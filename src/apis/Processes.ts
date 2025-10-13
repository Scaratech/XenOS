export interface ProcessOpts {
    async?: boolean;
    type: 'direct' | 'url' | 'opfs';
    content: string;
};

export interface ProcessInfo {
    pid: number;
    status: 'running' | 'terminated';
    startTime: number;
    memory: number | null;
};

interface ProcRec {
    pid: number;
    iframe: HTMLIFrameElement;
    status: 'running' | 'terminated';
    startTime: number;
    url: string;
    associatedWindows?: Set<string>;
}

export class ProcessManager {
    private npid = 0;
    private procs = new Map<number, ProcRec>();
    private killingProcesses = new Set<number>();

    private async loadContent(opts: ProcessOpts): Promise<string> {
        if (opts.type === 'direct') return opts.content;
    
        if (opts.type === 'url') {
            const res = await fetch(window.xen.net.encodeUrl(opts.content));
            return res.text();
        }

        return window.xen.fs.read(opts.content, 'text') as Promise<string>;
    }

    public async spawn(opts: ProcessOpts): Promise<number> {
        const pid = this.npid++;
        const src = await this.loadContent(opts);
        const html = `
<script>
    (() => {
        const parentWin = window.parent;
        if (!parentWin) return;

        try {
            Object.defineProperty(window, 'xen', {
                configurable: true,
                enumerable: false,
                get() {
                    return parentWin.xen;
                },
                set(value) {
                    parentWin.xen = value;
                }
            });
        } catch (err) {
            window.xen = parentWin.xen;
        }
    })();
</script>
<script${opts.async ? ' type="module"' : ''}>
${src}
</script>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const ifr = document.createElement('iframe');

        ifr.sandbox.value = 'allow-scripts allow-same-origin';
        ifr.style.display = 'none';
        ifr.src = url;
        ifr.setAttribute('xen-pid', String(pid));

        document.body.appendChild(ifr);

        this.procs.set(pid, {
            pid,
            iframe: ifr,
            status: 'running',
            startTime: Date.now(),
            url,
            associatedWindows: new Set()
        });

        return pid;
    }

    public associateWindow(pid: number, windowId: string): void {
        const p = this.procs.get(pid);

        if (p && p.status === 'running') {
            if (!p.associatedWindows) {
                p.associatedWindows = new Set();
            }

            const win = window.xen.wm.windows.find(w => w.id === windowId);

            if (win && win.el.content instanceof HTMLIFrameElement) {
                win.el.content.setAttribute('xen-pid', String(pid));
            }
    
            p.associatedWindows.add(windowId);
        }
    }

    public kill(pid: number): void {
        const p = this.procs.get(pid);
        if (!p || this.killingProcesses.has(pid)) return;

        this.killingProcesses.add(pid);

        try {
            if (p.associatedWindows) {
                p.associatedWindows.forEach(windowId => {
                    const w = window.xen.wm.windows.find(w => w.id === windowId);

                    if (w) {
                        w.closeCbs = [];
                        w.close();
                    }
                });
            }

            window.xen.wm.windows.forEach(win => {
                if (win.el.content instanceof HTMLIFrameElement) {
                    const framePid = win.el.content.getAttribute('xen-pid');

                    if (framePid !== null && Number(framePid) === pid) {
                        win.closeCbs = [];
                        win.close();
                    }
                }
            });

            p.iframe.remove();
            URL.revokeObjectURL(p.url);
            
            this.procs.delete(pid);
        } finally {
            this.killingProcesses.delete(pid);
        }
    }

    public info(pid: number): ProcessInfo | null {
        const p = this.procs.get(pid);
        if (!p) return null;

        let mem: number | null = null;
        const cw = p.iframe.contentWindow;

        if (cw && cw.performance && (cw.performance as any).memory) {
            mem = (cw.performance as any).memory.usedJSHeapSize;
        }

        return {
            pid: p.pid,
            status: p.status,
            startTime: p.startTime,
            memory: mem
        }
    }

    public list(): ProcessInfo[] {
        const out: ProcessInfo[] = [];

        for (const p of this.procs.values()) {
            let mem: number | null = null;
            const cw = p.iframe.contentWindow;

            if (cw && cw.performance && (cw.performance as any).memory) {
                mem = (cw.performance as any).memory.usedJSHeapSize;
            }

            out.push({
                pid: p.pid,
                status: p.status,
                startTime: p.startTime,
                memory: mem
            });
        }

        return out;
    }

    public cleanup(): void {
        for (const [pid, proc] of this.procs.entries()) {
            if (proc.status === 'terminated') {
                this.kill(pid);
            }
        }
    }
}

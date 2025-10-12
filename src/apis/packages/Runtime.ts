import { Manifest } from "./PackageManager";

export class Runtime {
    public async exec(manifest: Manifest, args?: any) {
        let code: string;
        const width = manifest.window?.width || '600px';
        const height = manifest.window?.height || '400px';
        const resizable = manifest.window?.resizable || true;
        const xenFilePicker = manifest.window?.xenFilePicker ?? false;
        let icon: string;
        let url: string;

        if (manifest.type != 'webview') {
            url = new URL(manifest.source, `${location.origin}/fs/usr/apps/${manifest.id}/`).href;

            if (args) {
                const params = new URLSearchParams(args);
                url += `?${params.toString()}`;
            }
        } else {
            //@ts-ignore
            url = window.__uv$config.prefix + window.__uv$config.encodeUrl(manifest.source);
        }

        if (manifest.icon) {
            icon = new URL(manifest.icon, `${location.origin}/fs/usr/apps/${manifest.id}/`).href;
        } else {
            icon = '/assets/logo.svg';
        }

        if (manifest.type == 'webview' || manifest.type == 'app') {
            code = `
                const win = window.xen.wm.create({
                    title: "${manifest.title}",
                    icon: "${icon}",
                    url: "${url}",
                    width: "${width}",
                    height: "${height}",
                    resizable: ${resizable},
                    xenFilePicker: ${xenFilePicker}
                });
                const frameEl = window.frameElement;
                const pidAttr = frameEl ? frameEl.getAttribute('xen-pid') : null;
                const pid = pidAttr ? parseInt(pidAttr, 10) : NaN;

                if (!Number.isNaN(pid)) {
                    window.xen.process.associateWindow(pid, win.id);

                    if (win.el.content instanceof HTMLIFrameElement) {
                        win.el.content.setAttribute('xen-pid', String(pid));
                    }
                    
                    win.onClose(() => {
                        setTimeout(() => {
                            window.xen.process.kill(pid);
                        }, 0);
                    });
                }
            `;
        } else if (manifest.type == 'process') {
            const req = await fetch(url);
            const res = await req.text();

            code = res;
        }

        const pid = await window.xen.process.spawn({
            async: true,
            type: 'direct',
            content: code,
        });

        return pid;
    }

    public async import(manifest: Manifest) {
        const path = `/usr/libs/${manifest.id}/${manifest.source}`;

        try {
            const code = await window.xen.fs.read(path, 'text');
            //@ts-ignore
            const blob = new Blob([code], { type: 'application/javascript' });
            const blobUrl = URL.createObjectURL(blob);

            try {
                const module = await import(blobUrl);
                return module;
            } finally {
                URL.revokeObjectURL(blobUrl);
            }
        } catch (err) {
            console.error(`Error importing library ${manifest.id}:`, err);
            throw err;
        }
    }
}

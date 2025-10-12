/**
 * XenOS TypeScript Declaration File
 * Complete type definitions for all public XenOS APIs with JSDoc annotations
 * 
 * @version 1.3.1
 * @author XenOS Team
 */

declare namespace XenOS {
    // Core Interfaces
    
    /**
     * File entry information returned by file system operations
     */
    interface FileEntryInfo {
        /** The name of the file or directory */
        name: string;
        /** Whether this entry is a file */
        isFile: boolean;
        /** Whether this entry is a directory */
        isDirectory: boolean;
    }

    /**
     * Complete file statistics including metadata
     */
    interface FileStat {
        /** The name of the file or directory */
        name: string;
        /** Size of the file in bytes */
        size: number;
        /** Whether this entry is a directory */
        isDirectory: boolean;
        /** Whether this entry is a file */
        isFile: boolean;
        /** Last modification date */
        lastModified: Date;
        /** MIME type of the file, null for directories */
        mime: string | null;
    }

    /**
     * Options for file picker dialog
     */
    interface FilePickerOptions {
        /** Title of the file picker dialog */
        title?: string;
        /** Whether to allow selecting multiple files/directories */
        multiple?: boolean;
        /** Selection mode - file or directory */
        mode?: "file" | "directory";
    }

    /**
     * Result returned by file picker
     */
    interface FilePickerResult {
        /** Path(s) to selected file(s)/directory(ies) in FS */
        path: string | string[];
        /** File stat object(s) */
        stat: FileStat | FileStat[];
        /** Blob URL(s) for files only */
        url?: string | string[];
    }

    /**
     * Options for dialog boxes
     */
    interface DialogOptions {
        /** Dialog title displayed in h1 tag */
        title?: string;
        /** Dialog body content displayed in p tag */
        body?: string;
        /** Icon to display in the dialog */
        icon?: string;
        /** Placeholder text for input field (prompt only) */
        placeholder?: string;
    }

    /**
     * Context menu entry definition
     */
    interface ContextMenuEntry {
        /** Display title of the menu entry */
        title: string;
        /** Icon to display next to the title */
        icon?: string;
        /** Whether the entry is toggleable */
        toggle?: boolean;
        /** Whether the entry is a "on click" action */
        once?: boolean;
        /** Function to execute when clicked */
        onClick?: (...args: any[]) => void;
    }

    /**
     * Context menu options with folder structure
     */
    interface ContextMenuOptions {
        /** Context menu entries organized by folder name */
        [folder: string]: ContextMenuEntry[];
    }

    /**
     * Notification options
     */
    interface NotificationOpts {
        /** Notification title */
        title: string;
        /** Notification body content */
        description: string;
        /** Icon URL or path */
        icon?: string;
        /** Image URL, path, or ArrayBuffer */
        image?: string | ArrayBuffer;
        /** Time in milliseconds before notification disappears */
        timeout?: number;
        /** Function to execute when notification is clicked */
        onClick?: () => void;
    }

    /**
     * Window creation options
     */
    interface WindowOpts {
        /** Window title */
        title?: string;
        /** Window icon */
        icon?: string;
        /** Window width */
        width?: number | string;
        /** Window height */
        height?: number | string;
        /** HTML content to display */
        content?: string;
        /** URL to load in window */
        url?: string;
        /** Whether window is resizable */
        resizable?: boolean;
        /** Whether window is minimizable */
        minimizable?: boolean;
        /** Whether window is maximizable */
        maximizable?: boolean;
        /** Whether window is closeable */
        closeable?: boolean;
        /** Whether to replace default file picker with XenOS file picker */
        xenFilePicker?: boolean;
    }

    /**
     * Process creation options
     */
    interface ProcessOpts {
        /** Whether code should run asynchronously */
        async?: boolean;
        /** Type of content source */
        type: 'direct' | 'url' | 'opfs';
        /** Code content, URL, or file system path */
        content: string;
    }

    /**
     * Process information
     */
    interface ProcessInfo {
        /** Process ID */
        pid: number;
        /** Current process status */
        status: 'running' | 'terminated';
        /** Process start time timestamp */
        startTime: number;
        /** Memory usage in bytes (performance.memory.usedJSHeapSize) */
        memory: number | null;
    }

    /**
     * Network policy configuration
     */
    interface NetworkPolicy {
        /** Port access rules */
        ports: {
            /** Allowed ports - specific array or "*" for all */
            allowed: number[] | "*";
            /** Denied ports - specific array or "*" for all */
            denied: number[] | "*";
        };
        /** IP address access rules */
        ips: {
            /** Allowed IPs - specific array or "*" for all */
            allowed: string[] | "*";
            /** Denied IPs - specific array or "*" for all */
            denied: string[] | "*";
        };
        /** Domain access rules */
        domains: {
            /** Allowed domains - specific array or "*" for all */
            allowed: (string | RegExp)[] | "*";
            /** Denied domains - specific array or "*" for all */
            denied: (string | RegExp)[] | "*";
        };
        /** Whether to deny HTTP requests (force HTTPS) */
        denyHTTP: boolean;
    }

    /**
     * Package policy configuration
     */
    interface PackagePolicy {
        /** Allowed package IDs - specific array or "*" for all */
        allowed: string[] | "*";
        /** Denied package IDs - specific array or "*" for all */
        denied: string[] | "*";
        /** Package IDs that must be installed */
        forceInstalled: string[];
    }

    /**
     * Repository policy configuration
     */
    interface RepoPolicy {
        /** Allowed repository URLs - specific array or "*" for all */
        allowed: string[] | "*";
        /** Denied repository URLs - specific array or "*" for all */
        denied: string[] | "*";
    }

    /**
     * Systray entry options
     */
    interface SystrayOpts {
        /** Unique identifier for the systray entry */
        id: string;
        /** Icon to display in systray */
        icon: string;
        /** Tooltip text */
        title?: string;
        /** Function to execute on left click */
        onClick?: (ev: MouseEvent) => void;
        /** Function to execute on right click */
        onRightClick?: (ev: MouseEvent) => void;
    }

    /**
     * Package maintainer information
     */
    interface Maintainer {
        /** Maintainer name */
        name?: string;
        /** Maintainer email */
        email?: string;
        /** Maintainer website */
        website?: string;
        /** Maintainer repository */
        repo?: string;
    }

    /**
     * XenOS package manifest
     */
    interface XenManifest {
        /** Unique package identifier */
        id: string;
        /** Package version */
        version: string;
        /** Package display title */
        title: string;
        /** Package description */
        description?: string;
        /** Package icon path */
        icon: string;
        /** Package type */
        type: 'webview' | 'app' | 'process' | 'library';
        /** Main source file */
        source: string;
        /** Package maintainer information */
        maintainer?: Maintainer;
        /** Window configuration for apps */
        window?: {
            /** Default window width */
            width?: string;
            /** Default window height */
            height?: string;
            /** Whether window is resizable */
            resizable?: boolean;
            /** Whether to use XenOS file picker */
            xenFilePicker?: boolean;
        };
    }

    /**
     * Anura package manifest (for compatibility)
     */
    interface AnuraManifest {
        /** Package name */
        name: string;
        /** Package type */
        type: 'auto';
        /** Package identifier */
        package: string;
        /** Main index file */
        index: string;
        /** Package icon */
        icon: string;
        /** Window information */
        wininfo: {
            /** Window width */
            width: number;
            /** Window height */
            height: number;
            /** Whether resizable */
            resizable: boolean;
        };
    }

    /**
     * Repository manifest
     */
    interface RepoManifest {
        /** Repository title */
        title: string;
        /** Repository description */
        description?: string;
        /** Repository maintainer */
        maintainer?: Maintainer;
        /** Array of package IDs in this repository */
        packages: string[];
    }

    /**
     * Package manifest (generic)
     */
    interface PackageManifest {
        /** Package name */
        name: string;
        /** Package version */
        version: string;
        /** Package description */
        description?: string;
        /** Package maintainer */
        maintainer?: Maintainer;
    }

    /**
     * Repository settings store
     */
    interface RepoSettingsStore {
        /** Repository URL */
        url: string;
        /** Repository type */
        type: 'xen' | 'anura';
    }

    /**
     * P2P peer information
     */
    interface Peer {
        /** Peer ID */
        id: string;
        /** Array of forwarded ports with optional descriptions */
        ports: Array<{ port: number; description?: string }>;
    }

    /**
     * P2P status
     */
    type Status = 'online' | 'offline';

    /**
     * VFS mount information
     */
    interface VFSMount {
        /** Mount path */
        path: string;
        /** Mounted file system */
        fs: FileSystem;
    }

    // API Classes and Interfaces

    /**
     * File Picker API for selecting files and directories
     */
    class FilePicker {
        /**
         * Opens a file picker dialog to select files or directories
         * @param opts File picker options
         * @returns Promise resolving to selected file(s) information
         * @example
         * ```typescript
         * const result = await xen.FilePicker.pick({
         *   title: "Select a file",
         *   mode: "file",
         *   multiple: false
         * });
         * console.log(result.path); // Selected file path
         * ```
         */
        static pick(opts?: FilePickerOptions): Promise<FilePickerResult>;
    }

    /**
     * Context Menu API for creating right-click menus
     */
    class ContextMenu {
        /**
         * Attaches a context menu to an element
         * @param elOrId Element or element ID to attach context menu to
         * @param options Context menu configuration with folder structure
         * @example
         * ```typescript
         * xen.contextMenu.attach('myElement', {
         *   root: [
         *     {
         *       title: "Copy",
         *       icon: "fas fa-copy",
         *       onClick: () => console.log("Copied!")
         *     }
         *   ]
         * });
         * ```
         */
        attach(elOrId: string | HTMLElement, options: ContextMenuOptions): void;
    }

    /**
     * Dialog API for creating modal dialog boxes
     */
    class Dialog {
        /**
         * Shows an alert dialog
         * @param opts Dialog options
         * @returns Promise that resolves when dialog is closed
         * @example
         * ```typescript
         * await xen.dialog.alert({
         *   title: "Success",
         *   body: "Operation completed successfully!"
         * });
         * ```
         */
        alert(opts: DialogOptions): Promise<void>;

        /**
         * Shows a confirmation dialog
         * @param opts Dialog options
         * @returns Promise resolving to true if OK clicked, false if Cancel clicked
         * @example
         * ```typescript
         * const confirmed = await xen.dialog.confirm({
         *   title: "Delete File",
         *   body: "Are you sure you want to delete this file?"
         * });
         * if (confirmed) {
         *   // Delete the file
         * }
         * ```
         */
        confirm(opts: DialogOptions): Promise<boolean>;

        /**
         * Shows a prompt dialog for text input
         * @param opts Dialog options (placeholder sets input placeholder)
         * @returns Promise resolving to entered text or null if cancelled
         * @example
         * ```typescript
         * const name = await xen.dialog.prompt({
         *   title: "Enter Name",
         *   body: "Please enter your name:",
         *   placeholder: "Your name here"
         * });
         * if (name) {
         *   console.log(`Hello, ${name}!`);
         * }
         * ```
         */
        prompt(opts: DialogOptions): Promise<string | null>;
    }

    /**
     * Abstract File System base class
     */
    abstract class FileSystem {
        /**
         * Creates a directory (recursive)
         * @param path Directory path to create
         */
        abstract mkdir(path: string): Promise<void>;

        /**
         * Lists directory contents
         * @param path Directory path to list
         * @param recursive Whether to list recursively
         * @returns Array of file entry information
         */
        abstract list(path: string, recursive?: boolean): Promise<FileEntryInfo[]>;

        /**
         * Removes a file or directory
         * @param path Path to remove
         */
        abstract rm(path: string): Promise<void>;

        /**
         * Writes content to a file
         * @param path File path
         * @param content Content to write
         */
        abstract write(path: string, content: Blob | string | ArrayBuffer): Promise<void>;

        /**
         * Reads file content
         * @param path File path
         * @param format Output format
         * @returns File content in requested format
         */
        abstract read(path: string, format?: "text" | "arrayBuffer" | "uint8array" | "blob"): Promise<string | ArrayBuffer | Uint8Array | Blob>;

        /**
         * Changes current working directory
         * @param path New working directory path
         */
        abstract cd(path: string): Promise<void>;

        /**
         * Gets current working directory
         * @returns Current working directory path
         */
        pwd(): string;

        /**
         * Checks if a path exists
         * @param path Path to check
         * @returns True if path exists, false otherwise
         */
        exists(path: string): Promise<boolean>;

        /**
         * Copies a file or directory
         * @param src Source path
         * @param dest Destination path
         */
        copy(src: string, dest: string): Promise<void>;

        /**
         * Moves a file or directory
         * @param src Source path
         * @param dest Destination path
         */
        move(src: string, dest: string): Promise<void>;

        /**
         * Gets file/directory statistics
         * @param path Path to get stats for
         * @returns File statistics
         */
        stat(path: string): Promise<FileStat>;

        /**
         * Normalizes a path
         * @param path Path to normalize
         * @param cwd Current working directory
         * @returns Normalized path
         */
        normalizePath(path: string, cwd?: string): string;
    }

    /**
     * Virtual File System that manages multiple mounted file systems
     */
    class VFS extends FileSystem {
        /**
         * Creates a directory (recursive)
         * @param path Directory path to create
         */
        mkdir(path: string): Promise<void>;

        /**
         * Lists directory contents
         * @param path Directory path to list
         * @param recursive Whether to list recursively
         * @returns Array of file entry information
         */
        list(path: string, recursive?: boolean): Promise<FileEntryInfo[]>;

        /**
         * Removes a file or directory
         * @param path Path to remove
         */
        rm(path: string): Promise<void>;

        /**
         * Writes content to a file
         * @param path File path
         * @param content Content to write
         */
        write(path: string, content: Blob | string | ArrayBuffer): Promise<void>;

        /**
         * Reads file content
         * @param path File path
         * @param format Output format
         * @returns File content in requested format
         */
        read(path: string, format?: "text" | "arrayBuffer" | "uint8array" | "blob"): Promise<string | ArrayBuffer | Uint8Array | Blob>;

        /**
         * Changes current working directory
         * @param path New working directory path
         */
        cd(path: string): Promise<void>;

        /**
         * Mounts a file system at the specified path
         * @param path Mount path
         * @param fs File system to mount
         * @example
         * ```typescript
         * await xen.vfs.mount('/mnt/external', new SomeFileSystem());
         * ```
         */
        mountFS(path: string, fs: FileSystem): Promise<void>;

        /**
         * Unmounts a file system
         * @param path Mount path to unmount
         * @example
         * ```typescript
         * await xen.vfs.unmount('/mnt/external');
         * ```
         */
        unmountFS(path: string): Promise<void>;

        /**
         * Gets all current mounts
         * @returns Array of mount information
         */
        getMounts(): VFSMount[];
    }

    /**
     * VFS Manager for handling virtual file system operations
     */
    class VFSManager {
        /** The underlying VFS instance */
        vfs: VFS;

        /**
         * Initializes the VFS with RootFS
         */
        init(): Promise<void>;

        /**
         * Mounts a VFS at specified path
         * @param path Mount path
         * @param fs File system instance to mount
         */
        mount(path: string, fs: FileSystem): Promise<void>;

        /**
         * Unmounts a VFS at specified path
         * @param path Mount path to unmount
         */
        unmount(path: string): Promise<void>;

        /**
         * Returns all VFS mounts
         * @returns Array of mount information
         */
        mounts(): VFSMount[];
    }

    /**
     * File System API for interacting with XenOS file systems
     */
    interface FileSystemAPI {
        /**
         * Creates a directory (recursive)
         * @param path Directory path to create
         * @example
         * ```typescript
         * await xen.fs.mkdir('/usr/apps/myapp');
         * ```
         */
        mkdir(path: string): Promise<void>;

        /**
         * Lists directory contents
         * @param path Directory path to list
         * @param recursive Whether to list all subdirectories recursively
         * @returns Array of file entry information
         * @example
         * ```typescript
         * const files = await xen.fs.list('/usr/apps');
         * files.forEach(file => console.log(file.name, file.isDirectory));
         * ```
         */
        list(path: string, recursive?: boolean): Promise<FileEntryInfo[]>;

        /**
         * Writes content to a file
         * @param path File path
         * @param content Content to write (Blob, string, or ArrayBuffer)
         * @example
         * ```typescript
         * await xen.fs.write('/tmp/test.txt', 'Hello, World!');
         * await xen.fs.write('/tmp/data.bin', new ArrayBuffer(1024));
         * ```
         */
        write(path: string, content: Blob | string | ArrayBuffer): Promise<void>;

        /**
         * Reads file content in specified format
         * @param path File path to read
         * @param format Output format
         * @returns File content in requested format
         * @example
         * ```typescript
         * const text = await xen.fs.read('/tmp/test.txt', 'text');
         * const buffer = await xen.fs.read('/tmp/data.bin', 'arrayBuffer');
         * ```
         */
        read(path: string, format?: "text" | "arrayBuffer" | "uint8array" | "blob"): Promise<string | ArrayBuffer | Uint8Array | Blob>;

        /**
         * Removes a file or directory
         * @param path Path to remove
         * @example
         * ```typescript
         * await xen.fs.rm('/tmp/unwanted.txt');
         * ```
         */
        rm(path: string): Promise<void>;

        /**
         * Checks if a path exists
         * @param path Path to check
         * @returns True if path exists, false otherwise
         * @example
         * ```typescript
         * if (await xen.fs.exists('/usr/config.json')) {
         *   // File exists
         * }
         * ```
         */
        exists(path: string): Promise<boolean>;

        /**
         * Gets current working directory
         * @returns Current working directory path
         */
        pwd(): Promise<string>;

        /**
         * Changes current working directory
         * @param path New working directory
         * @example
         * ```typescript
         * await xen.fs.cd('/usr/apps');
         * ```
         */
        cd(path: string): Promise<void>;

        /**
         * Downloads a file from URL and saves to file system
         * @param url URL to download from
         * @param path Local path to save to
         * @example
         * ```typescript
         * await xen.fs.fetch('https://example.com/file.txt', '/tmp/downloaded.txt');
         * ```
         */
        fetch(url: string, path: string): Promise<void>;

        /**
         * Mounts a native host file system path
         * @param path Path in XenFS to mount to
         * @example
         * ```typescript
         * await xen.fs.mount('/mnt/host');
         * ```
         */
        mount(path: string): Promise<void>;

        /**
         * Unmounts a mounted path
         * @param path Mounted path to unmount
         * @example
         * ```typescript
         * await xen.fs.unmount('/mnt/host');
         * ```
         */
        unmount(path: string): Promise<void>;

        /**
         * Uploads a file or directory from host FS
         * @param type Upload type
         * @param path Destination path in XenFS
         * @example
         * ```typescript
         * await xen.fs.upload('file', '/uploads/myfile.txt');
         * ```
         */
        upload(type: "file" | "directory", path: string): Promise<void>;

        /**
         * Downloads a file to host FS
         * @param path Path in XenFS to download
         * @example
         * ```typescript
         * await xen.fs.download('/usr/important.txt');
         * ```
         */
        download(path: string): Promise<void>;

        /**
         * Copies a file or directory
         * @param src Source path
         * @param dest Destination path
         * @example
         * ```typescript
         * await xen.fs.copy('/usr/template.txt', '/usr/copy.txt');
         * ```
         */
        copy(src: string, dest: string): Promise<void>;

        /**
         * Moves a file or directory
         * @param src Source path
         * @param dest Destination path
         * @example
         * ```typescript
         * await xen.fs.move('/tmp/old.txt', '/usr/new.txt');
         * ```
         */
        move(src: string, dest: string): Promise<void>;

        /**
         * Gets file or directory statistics
         * @param path Path to get stats for
         * @returns File statistics
         * @example
         * ```typescript
         * const stats = await xen.fs.stat('/usr/test.txt');
         * console.log(`Size: ${stats.size} bytes`);
         * ```
         */
        stat(path: string): Promise<FileStat>;

        /**
         * Compresses a directory to ZIP archive
         * @param path Directory path to compress
         * @param dest Destination ZIP file path
         * @example
         * ```typescript
         * await xen.fs.compress('/usr/apps/myapp', '/tmp/myapp.zip');
         * ```
         */
        compress(path: string, dest: string): Promise<void>;

        /**
         * Decompresses a ZIP archive
         * @param path ZIP file path
         * @param dest Destination directory path
         * @example
         * ```typescript
         * await xen.fs.decompress('/tmp/archive.zip', '/usr/extracted');
         * ```
         */
        decompress(path: string, dest: string): Promise<void>;

        /**
         * Creates a symbolic link
         * @param src Source path
         * @param dest Link path
         * @example
         * ```typescript
         * await xen.fs.link('/usr/real.txt', '/tmp/link.txt');
         * ```
         */
        link(src: string, dest: string): Promise<void>;

        /**
         * Removes a symbolic link
         * @param path Link path to remove
         * @example
         * ```typescript
         * await xen.fs.unlink('/tmp/link.txt');
         * ```
         */
        unlink(path: string): Promise<void>;

        /**
         * Reads the real path of a symbolic link
         * @param path Link path
         * @returns Real path
         * @example
         * ```typescript
         * const realPath = await xen.fs.readlink('/tmp/link.txt');
         * ```
         */
        readlink(path: string): Promise<string>;

        /**
         * Recursively deletes entire XenFS
         * @example
         * ```typescript
         * await xen.fs.wipe(); // Deletes everything in /*
         * ```
         */
        wipe(): Promise<void>;

        /**
         * Exports entire XenFS as ZIP archive
         * @example
         * ```typescript
         * await xen.fs.export(); // Downloads XenFS.zip
         * ```
         */
        export(): Promise<void>;

        /**
         * Imports ZIP archive to replace XenFS
         * @example
         * ```typescript
         * await xen.fs.import(); // Prompts for ZIP upload
         * ```
         */
        import(): Promise<void>;
    }

    /**
     * Networking client with Libcurl.js integration
     */
    interface NetworkingAPI {
        /**
         * Fetch API with CORS bypass and Wisp protocol support
         * @param req URL or Request object
         * @param opts Request options
         * @returns Response promise
         * @example
         * ```typescript
         * const response = await xen.net.fetch('https://example.com/api');
         * const data = await response.json();
         * ```
         */
        fetch(req: string | Request, opts?: RequestInit): Promise<Response>;

        /**
         * Direct access to Libcurl.js
         */
        direct: {
            /** Direct Libcurl.js access */
            libcurl: any;
            /** Direct Wisp client access */
            wisp: any;
        };

        /**
         * WebSocket implementation with Wisp support
         */
        WebSocket: typeof WebSocket;

        /**
         * Register request interceptor
         * @param callback Function to modify requests
         * @example
         * ```typescript
         * xen.net.onRequest(async (req) => {
         *   console.log('Intercepted:', req.url);
         *   return req;
         * });
         * ```
         */
        onRequest(callback: (req: Request) => Promise<Request>): void;

        /**
         * Register response interceptor
         * @param callback Function to modify responses
         * @example
         * ```typescript
         * xen.net.onResponse(async (res) => {
         *   console.log('Response:', res.status);
         *   return res;
         * });
         * ```
         */
        onResponse(callback: (res: Response) => Promise<Response>): void;

        /**
         * Encodes URL for Ultraviolet proxy
         * @param url URL to encode
         * @returns Encoded URL
         */
        encodeUrl(url: string): string;

        /**
         * Loopback server functionality
         */
        loopback: {
            /**
             * Creates HTTP server running inside XenOS
             * @param port Port number
             * @param handler Request handler function
             * @example
             * ```typescript
             * await xen.net.loopback.set(8080, async (req) => {
             *   return new Response('Hello from XenOS!');
             * });
             * ```
             */
            set(port: number, handler: (req: Request) => Promise<Response>): Promise<void>;

            /**
             * Removes a loopback server
             * @param port Port number to remove
             */
            remove(port: number): Promise<void>;
        };

        /**
         * Sets Wisp server URL
         * @param url Wisp server URL
         */
        setUrl(url: string): void;

        /**
         * Wisp protocol client
         */
        wisp: {
            /** Wisp connection instance */
            wispConn: any;
            /** Create Wisp stream */
            createStream: any;
            /** Wisp WebSocket API */
            WebSocket: typeof WebSocket;
        };
    }

    /**
     * Notifications API for displaying system notifications
     */
    class Notifications {
        /**
         * Creates and displays a notification
         * @param opts Notification options
         * @example
         * ```typescript
         * xen.notifications.spawn({
         *   title: "Download Complete",
         *   description: "Your file has been downloaded successfully.",
         *   icon: "/icons/download.png",
         *   timeout: 5000,
         *   onClick: () => console.log("Notification clicked!")
         * });
         * ```
         */
        spawn(opts: NotificationOpts): void;
    }

    /**
     * P2P networking API for peer-to-peer connections
     */
    interface P2PAPI {
        /**
         * Sets online/offline status
         * @param status New status
         * @example
         * ```typescript
         * xen.p2p.setStatus('online');
         * ```
         */
        setStatus(status: Status): void;

        /**
         * Sets signaling server URL
         * @param url Signaling server URL
         */
        setUrl(url: string): void;

        /**
         * Forwards a port for P2P access
         * @param port Port number to forward
         * @param desc Optional description
         * @example
         * ```typescript
         * xen.p2p.forward(8080, 'My web server');
         * ```
         */
        forward(port: number, desc?: string): void;

        /**
         * Stops forwarding a port
         * @param port Port number to unforward
         */
        unforward(port: number): void;

        /**
         * Gets list of online peers
         * @returns Array of peer information
         * @example
         * ```typescript
         * const peers = xen.p2p.getPeers();
         * peers.forEach(peer => {
         *   console.log(`Peer ${peer.id} has ports:`, peer.ports);
         * });
         * ```
         */
        getPeers(): Peer[];
    }

    /**
     * Package management API
     */
    interface PackageAPI {
        /**
         * Gets package manifest by ID and type
         * @param id Package ID
         * @param type Package type
         * @returns Package manifest
         * @example
         * ```typescript
         * const manifest = await xen.packages.getManifest('org.nebulaservices.texteditor', 'apps');
         * ```
         */
        getManifest(id: string, type: 'apps' | 'libs'): Promise<XenManifest>;

        /**
         * Opens an app with optional arguments
         * @param id App ID
         * @param args Optional arguments converted to URL parameters
         * @example
         * ```typescript
         * await xen.packages.open('org.nebulaservices.texteditor', {
         *   file: '/usr/documents/readme.txt'
         * });
         * ```
         */
        open(id: string, args?: any): Promise<void>;

        /**
         * Installs a package from various sources
         * @param source Installation source
         * @param path Optional path (for 'url' or 'opfs' sources)
         * @example
         * ```typescript
         * // From file picker
         * await xen.packages.install('prompt');
         * // From URL
         * await xen.packages.install('url', 'https://example.com/app.zip');
         * // From file system
         * await xen.packages.install('opfs', '/tmp/app.zip');
         * ```
         */
        install(source: 'prompt' | 'opfs' | 'url', path?: string): Promise<void>;

        /**
         * Installs an Anura package
         * @param source Installation source
         * @param path Optional path
         */
        anuraInstall(source: 'prompt' | 'opfs' | 'url', path?: string): Promise<void>;

        /**
         * Imports a library's exports
         * @param id Library ID
         * @returns Library exports
         * @example
         * ```typescript
         * const myLib = await xen.packages.import('com.example.mylib');
         * myLib.someFunction();
         * ```
         */
        import(id: string): Promise<any>;

        /**
         * Removes a package
         * @param id Package ID
         * @param type Package type
         * @example
         * ```typescript
         * await xen.packages.remove('org.example.app', 'apps');
         * ```
         */
        remove(id: string, type: 'apps' | 'libs'): Promise<void>;

        /**
         * Lists all installed apps
         * @returns Array of app manifests
         */
        listApps(): Promise<XenManifest[]>;

        /**
         * Lists all installed libraries
         * @returns Array of library manifests
         */
        listLibs(): Promise<XenManifest[]>;

        /**
         * Converts Anura manifest to Xen manifest
         * @param manifest Anura manifest
         * @returns Xen manifest
         */
        anuraToXen(manifest: AnuraManifest): XenManifest;
    }

    /**
     * Policy management API
     */
    interface PolicyAPI {
        /**
         * Gets combined policy for a type
         * @param type Policy type
         * @returns Combined policy
         * @example
         * ```typescript
         * const networkPolicy = await xen.policy.get('network');
         * console.log('Allowed domains:', networkPolicy.domains.allowed);
         * ```
         */
        get(type: 'network' | 'repo' | 'package'): Promise<NetworkPolicy | PackagePolicy | RepoPolicy>;

        /**
         * Sets policy for a group
         * @param type Policy type
         * @param name Group name
         * @param content Policy content
         * @example
         * ```typescript
         * await xen.policy.set('network', 'strict', {
         *   domains: { allowed: ['*.example.com'], denied: '*' },
         *   ports: { allowed: [80, 443], denied: '*' },
         *   ips: { allowed: '*', denied: [] },
         *   denyHTTP: true
         * });
         * ```
         */
        set(type: 'network' | 'repo' | 'package', name: string, content: NetworkPolicy | PackagePolicy | RepoPolicy): Promise<void>;
    }

    /**
     * Process management API
     */
    interface ProcessAPI {
        /**
         * Spawns a new process
         * @param opts Process options
         * @returns Process ID (PID)
         * @example
         * ```typescript
         * const pid = await xen.process.spawn({
         *   type: 'direct',
         *   content: 'console.log("Hello from process!");',
         *   async: false
         * });
         * ```
         */
        spawn(opts: ProcessOpts): Promise<number>;

        /**
         * Kills a process
         * @param pid Process ID to kill
         * @example
         * ```typescript
         * xen.process.kill(123);
         * ```
         */
        kill(pid: number): void;

        /**
         * Gets process information
         * @param pid Process ID
         * @returns Process information
         * @example
         * ```typescript
         * const info = xen.process.info(123);
         * console.log(`Process ${info.pid} is ${info.status}`);
         * ```
         */
        info(pid: number): ProcessInfo;

        /**
         * Lists all processes
         * @returns Array of all process information
         */
        list(): ProcessInfo[];
    }

    /**
     * Repository management API
     */
    interface RepoAPI {
        /**
         * Adds a new repository
         * @param url Repository URL (origin)
         * @param type Repository type
         * @example
         * ```typescript
         * xen.repos.addRepo('https://repo.example.com', 'xen');
         * ```
         */
        addRepo(url: string, type: 'xen' | 'anura'): void;

        /**
         * Removes a repository
         * @param url Repository URL to remove
         */
        removeRepo(url: string): void;

        /**
         * Gets repository manifest
         * @param url Repository URL
         * @returns Repository manifest
         */
        getManifest(url: string): Promise<RepoManifest>;

        /**
         * Lists packages in a repository
         * @param repo Repository URL
         * @param type Repository type
         * @returns Package list (format depends on type)
         */
        listPackages(repo: string, type: 'xen' | 'anura'): Promise<string[] | any>;

        /**
         * Gets package from Xen repository
         * @param repo Repository URL
         * @param id Package ID
         * @returns Package manifest
         */
        getPackage(repo: string, id: string): Promise<PackageManifest>;

        /**
         * Installs package from repository
         * @param repo Repository URL
         * @param id Package ID or name
         * @param type Repository type
         * @param anura For Anura repos, search by 'id' or 'name'
         * @example
         * ```typescript
         * await xen.repos.install('https://repo.example.com', 'my-package', 'xen');
         * ```
         */
        install(repo: string, id: string, type: 'xen' | 'anura', anura?: 'id' | 'name'): Promise<void>;
    }

    /**
     * Settings API for persistent configuration storage
     */
    interface SettingsAPI {
        /**
         * Gets a setting value
         * @param key Setting key
         * @returns Setting value or undefined
         * @example
         * ```typescript
         * const theme = xen.settings.get('theme') || 'dark';
         * ```
         */
        get(key: string): any;

        /**
         * Sets a setting value
         * @param key Setting key
         * @param value Setting value (any JSON-serializable value)
         * @example
         * ```typescript
         * xen.settings.set('theme', 'light');
         * xen.settings.set('userPrefs', { fontSize: 14, language: 'en' });
         * ```
         */
        set(key: string, value: any): void;

        /**
         * Removes a setting
         * @param key Setting key to remove
         * @example
         * ```typescript
         * xen.settings.remove('temporaryFlag');
         * ```
         */
        remove(key: string): void;

        /**
         * Gets all settings
         * @returns All settings as an object
         */
        getAll(): Record<string, any>;
    }

    /**
     * System tray API
     */
    class Systray {
        /**
         * Registers a systray entry
         * @param opts Systray options
         * @example
         * ```typescript
         * xen.systray.register({
         *   id: 'my-app',
         *   icon: '/icons/my-app.png',
         *   title: 'My Application',
         *   onClick: () => console.log('Systray clicked!'),
         *   onRightClick: () => console.log('Right clicked!')
         * });
         * ```
         */
        register(opts: SystrayOpts): void;

        /**
         * Unregisters a systray entry
         * @param id Systray entry ID to remove
         * @example
         * ```typescript
         * xen.systray.unregister('my-app');
         * ```
         */
        unregister(id: string): void;
    }

    /**
     * URI handling API for custom protocols
     */
    class URI {
        /**
         * Registers a URI handler
         * @param scheme URI scheme (e.g., 'myapp')
         * @param handler Function to handle the URI
         * @example
         * ```typescript
         * xen.uri.register('myapp', (data) => {
         *   console.log('Handling myapp://' + data);
         *   // Handle myapp://some-data
         * });
         * ```
         */
        register(scheme: string, handler: (data: string) => void): void;

        /**
         * Handles a URI
         * @param uri Complete URI to handle
         * @example
         * ```typescript
         * xen.uri.handle('myapp://open-file?path=/usr/documents/file.txt');
         * ```
         */
        handle(uri: string): void;

        /**
         * Unregisters a URI handler
         * @param scheme URI scheme to unregister
         * @example
         * ```typescript
         * xen.uri.unregister('myapp');
         * ```
         */
        unregister(scheme: string): void;
    }

    /**
     * Wallpaper management API
     */
    interface WallpaperAPI {
        /**
         * Gets current wallpaper path
         * @returns Current wallpaper path
         */
        get(): Promise<string>;

        /**
         * Uploads a wallpaper from URL or file picker
         * @param type Upload type
         * @param url URL (if type is 'url')
         * @example
         * ```typescript
         * // From URL
         * await xen.wallpaper.upload('url', 'https://example.com/bg.jpg');
         * // From file picker
         * await xen.wallpaper.upload('prompt');
         * ```
         */
        upload(type: 'url' | 'prompt', url?: string): Promise<void>;

        /**
         * Sets wallpaper from file system
         * @param file Path to wallpaper file
         * @example
         * ```typescript
         * await xen.wallpaper.set('/usr/wallpapers/sunset.jpg');
         * ```
         */
        set(file: string): Promise<void>;

        /**
         * Removes a wallpaper
         * @param file Wallpaper file path to remove
         */
        remove(file: string): Promise<void>;

        /**
         * Lists available wallpapers
         * @returns Array of wallpaper file paths
         */
        list(): Promise<string[]>;

        /**
         * Sets default wallpaper
         */
        default(): Promise<void>;
    }

    /**
     * Window object interface
     */
    interface XenWindow {
        /** Window properties (same as WindowOpts) */
        props: WindowOpts;
        /** Window DOM elements */
        el: {
            window: HTMLDivElement;
            titlebar: HTMLDivElement;
            content: HTMLDivElement;
        };
        /** Whether window is focused */
        isFocused: boolean;
        /** Closes the window */
        close(): void;
        /** Minimizes the window */
        minimize(): void;
        /** Maximizes the window */
        maximize(): void;
        /** Focuses the window */
        focus(): void;
    }

    /**
     * Window Manager API for creating and managing windows
     */
    interface WindowManagerAPI {
        /** Array of all open windows */
        windows: XenWindow[];

        /**
         * Creates a new window
         * @param opts Window options
         * @returns Window instance
         * @example
         * ```typescript
         * const win = xen.wm.create({
         *   title: 'My Application',
         *   width: 800,
         *   height: 600,
         *   content: '<h1>Hello World!</h1>',
         *   resizable: true
         * });
         * ```
         */
        create(opts: WindowOpts): XenWindow;

        /**
         * Focuses a window
         * @param window Window to focus
         * @param zIndex Optional z-index override
         */
        focus(window: XenWindow, zIndex?: number): void;
    }

    // Main Xen class that exposes all APIs
    
    /**
     * Main XenOS API class that provides access to all system functionality
     */
    class Xen {
        /** Settings API for persistent configuration */
        settings: SettingsAPI;
        
        /** Virtual File System Manager */
        vfs: VFSManager;
        
        /** File System API */
        fs: FileSystemAPI;
        
        /** VFS class reference */
        VFS: typeof VFS;
        
        /** FileSystem class reference */
        FileSystem: typeof FileSystem;
        
        /** Networking API */
        net: NetworkingAPI;
        
        /** P2P networking API */
        p2p: P2PAPI;
        
        /** Window Manager API */
        wm: WindowManagerAPI;
        
        /** Process Manager API */
        process: ProcessAPI;
        
        /** Package Manager API */
        packages: PackageAPI;
        
        /** Repository API */
        repos: RepoAPI;
        
        /** Context Menu API */
        contextMenu: ContextMenu;
        
        /** Task Bar component */
        taskBar: any;
        
        /** Notifications API */
        notifications: Notifications;
        
        /** Wallpaper API */
        wallpaper: WallpaperAPI;
        
        /** Initialization system */
        initSystem: any;
        
        /** Policy API */
        policy: PolicyAPI;
        
        /** Dialog API */
        dialog: Dialog;
        
        /** System tray API */
        systray: Systray;
        
        /** File Picker class */
        FilePicker: typeof FilePicker;
        
        /** Polyfill utilities */
        polyfill: {
            /** showOpenFilePicker polyfill */
            sofp: any;
            /** showDirectoryPicker polyfill */
            sdp: any;
        };
        
        /** Update system */
        update: any;
        
        /** Platform utilities */
        platform: any;
        
        /** XenShell terminal */
        shell: any;
        
        /** URI handling API */
        uri: URI;
        
        /** Version information */
        version: {
            /** OS name prefix */
            prefix: string;
            /** Version codename */
            codename: string;
            /** Major version number */
            major: number;
            /** Minor version number */
            minor: number;
            /** Patch version number */
            patch: number;
            /** Release channel */
            channel: string;
            /** Build identifier */
            build: string;
            /** Human-readable version string */
            pretty: string;
        };

        /**
         * Initializes the XenOS system
         * @example
         * ```typescript
         * await xen.init();
         * console.log(xen.version.pretty); // "XenOS Nightcord v1.3.1 Beta (uuid)"
         * ```
         */
        init(): Promise<void>;
    }
}

// Export for module usage
export = XenOS;
export as namespace XenOS;
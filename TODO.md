## Code Quality
- [ ] Remove vibecoded `xen.d.ts` and inline JSDoc
- [ ] Comment the codebase
- [ ] Split apps into multiple files
- [ ] Fix grammar in docs, README, etc.

## FS-Related
- [ ] Remove hardcoded boot from OPFS implementation from the SW
- [ ] Allow for alternative RootFSes
- [ ] Allow for "external booting" (`window.showDirectoryPicker()`)
- [ ] Allow for "network booting" (FS over network)

## Bug Fixes
- [ ] Fix context menu placement
- [ ] Fix lag on windows
- [ ] Random P2P WS disconnection

## Implement WiPs
- [ ] Debug button in process manager
- [ ] Browser
    - [ ] History
    - [ ] Download (?)
    - [ ] Horizontal tabs
- [ ] Hook `libcurl.js` and `wisp-client-js` to implement network policies

## Improvements
- [ ] Improve process system
    - [ ] SW as PID0
    - [ ] Init system as PID1
- [ ] Change debug bootflag to be something more convienent

## QoL
- [ ] Automatic recovery / Recovery environment
- [ ] Bootloader
- [ ] Update over proxy
- [ ] Reset over proxy
- [ ] Persistance
    - [ ] File handlers
    - [ ] URIs
    - [ ] Context menu

## Features
- [ ] Built-in VFSes
    - [ ] Temp-FS (map)
    - [ ] WebDAV-FS
        - [ ] Nextcloud support
        - [ ] Copyparty support
        - [ ] Puter support
    - [ ] GDrive
    - [ ] Onedrive
- [ ] AI agent (??)
- [ ] OOBE
- [ ] Replace `wisp-client-js` with a custom Wisp client


## Translation Layers
- [ ] Anura
    - [X] Manifests
    - [X] Repos
    - [ ] APIs
- [ ] Terbium
    - [ ] Manifests
    - [ ] Repos
    - [ ] APIs

## Major Features
- [ ] V86
    - [ ] FS integration
    - [ ] Network integration
    - [ ] Terminal integration (V86 terminal + V86 manager)
    - [ ] Multi-VM support
- [ ] Sandbox
    - [ ] FS isolation
    - [ ] Declared permissions
    - [ ] Fenced frames
    - [ ] Shared access
    - [ ] Allowed scopes
    - [ ] CORS/CSP on apps
- [ ] Accounts
    - [ ] `chmod`
    - [ ] `chown`
    - [ ] `sudo`
    - [ ] `su`
    - [ ] User-specific policies
    - [ ] Login page / Signup page
    - [ ] Admin accounts

## Apps
- [ ] SSH
- [ ] VNC
- [ ] RDP (?)

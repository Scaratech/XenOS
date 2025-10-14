type AnyFn = (...args: any[]) => any;

export interface HookInvocation<T extends AnyFn> {
    readonly fn: T;
    call(args?: Parameters<T>, thisArg?: unknown): ReturnType<T>;
    apply(thisArg?: unknown, args?: Parameters<T>): ReturnType<T>;
    run(): ReturnType<T>;
}

export type HookHandler<T extends AnyFn> = (
    original: HookInvocation<T>,
    args: Parameters<T>,
    context: unknown
) => ReturnType<T>;

interface TargetInfo {
    owner: Record<string | symbol, any>;
    context: any;
    key: string | symbol;
    path: (string | symbol)[];
}

interface BindingState<T extends AnyFn = AnyFn> {
    original: T;
    handler: HookHandler<T>;
    targetInfo: TargetInfo | null;
    fallbackContext: unknown;
    wrapper?: T;
}

export class Hook<T extends AnyFn = AnyFn> {
    private readonly bindings = new WeakMap<AnyFn, BindingState>();
    private readonly wrappers = new WeakMap<AnyFn, BindingState>();
    private readonly bindingList: BindingState[] = [];

    private readonly defaultHook: HookHandler<AnyFn> = (original, args, context) =>
        original.apply(context, args);

    public createHook<TFn extends AnyFn>(target: TFn, handler: HookHandler<TFn>): TFn {
        const binding = this.getBinding(target, true);
        binding.handler = handler ?? (this.defaultHook as HookHandler<TFn>);

        if (!binding.targetInfo) {
            binding.targetInfo = this.locateTarget(binding.original);
            binding.fallbackContext = binding.targetInfo
                ? binding.targetInfo.context
                : binding.fallbackContext;
        }

        return this.getWrappedFunction(binding);
    }

    public getHook<TFn extends AnyFn>(target: TFn): TFn {
        const binding = this.getBinding(target, true);
        return this.getWrappedFunction(binding);
    }

    public getObj<TObj extends Record<string | symbol, any>>(target: TObj): TObj {
        if (!target || (typeof target !== "object" && typeof target !== "function")) {
            throw new Error("getObj requires an object target.");
        }

        const root = this.getGlobalRoot();

        if (root && target === root) {
            const applicable = this.bindingList.filter(binding => binding.targetInfo);

            if (applicable.length === 0) {
                return this.shallowClone(root);
            }

            return this.newForBindings(applicable) as TObj;
        }

        const bindings = this.bindingList.filter(
            binding => binding.targetInfo?.context === target
        );

        if (bindings.length === 0) {
            return this.shallowClone(target);
        }

        if (bindings.length === 1) {
            return this.cloneObjForBinding(bindings[0]) as TObj;
        }

        return this.cloneObjForBindings(bindings) as TObj;
    }

    public override<TFn extends AnyFn>(target: TFn): TFn {
        const binding = this.getBinding(target, true);
        const info = binding.targetInfo;

        if (!info) {
            throw new Error("Unable to locate target function within xen.");
        }

        const wrapped = this.getWrappedFunction(binding);
        this.defineValue(info.owner, info.key, wrapped, info.owner);

        return wrapped;
    }

    private findBinding<TFn extends AnyFn>(target: TFn): BindingState<TFn> | null {
        if (typeof target !== "function") {
            return null;
        }

        const direct = this.bindings.get(target as AnyFn) as BindingState<TFn> | undefined;
        if (direct) {
            return direct;
        }

        const wrapped = this.wrappers.get(target as AnyFn) as BindingState<TFn> | undefined;
        if (wrapped) {
            return wrapped;
        }

        return null;
    }

    private getBinding<TFn extends AnyFn>(target: TFn, createIfMissing: boolean): BindingState<TFn> {
        const existing = this.findBinding(target);
        if (existing) {
            return existing;
        }

        if (!createIfMissing) {
            throw new Error("No hook registered for the supplied target.");
        }

        if (typeof target !== "function") {
            throw new Error("Hook target must be a function.");
        }

        return this.createBinding(target);
    }

    private createBinding<TFn extends AnyFn>(target: TFn): BindingState<TFn> {
        const info = this.locateTarget(target);

        const binding: BindingState<TFn> = {
            original: target,
            handler: this.defaultHook as HookHandler<TFn>,
            targetInfo: info,
            fallbackContext: info ? info.context : undefined
        };

        this.bindings.set(target, binding);
        this.bindingList.push(binding);

        return binding;
    }

    private getWrappedFunction<TFn extends AnyFn>(binding: BindingState<TFn>): TFn {
        if (!binding.wrapper) {
            binding.wrapper = this.createWrappedFunction(binding);
            this.wrappers.set(binding.wrapper as AnyFn, binding as BindingState);
        }

        return binding.wrapper as TFn;
    }

    private createWrappedFunction<TFn extends AnyFn>(binding: BindingState<TFn>): TFn {
        const hookInstance = this;
        const original = binding.original;
        const defaultContext = binding.fallbackContext;

        const wrapped = function (this: unknown, ...args: Parameters<TFn>): ReturnType<TFn> {
            const context = hookInstance.resolveContext(this, defaultContext);

            const invocation: HookInvocation<TFn> = {
                fn: original,
                call(callArgs?: Parameters<TFn>, thisArg?: unknown) {
                    const callContext = hookInstance.resolveContext(thisArg, context);
                    return original.apply(
                        callContext,
                        (callArgs ?? args) as Parameters<TFn>
                    );
                },
                apply(thisArg?: unknown, callArgs?: Parameters<TFn>) {
                    const callContext = hookInstance.resolveContext(thisArg, context);
                    return original.apply(
                        callContext,
                        (callArgs ?? args) as Parameters<TFn>
                    );
                },
                run() {
                    return original.apply(context, args as Parameters<TFn>);
                }
            };

            const handler = binding.handler ?? (hookInstance.defaultHook as HookHandler<TFn>);
            return handler(invocation, args as Parameters<TFn>, context);
        } as AnyFn;

        Object.defineProperty(wrapped, "name", {
            value: `Hooked(${original.name || "anonymous"})`,
            configurable: true
        });

        return wrapped as TFn;
    }

    private resolveContext(context: unknown, fallback: unknown): unknown {
        return context === undefined ? fallback : context;
    }

    private cloneObjForBinding<TFn extends AnyFn>(binding: BindingState<TFn>): Record<string | symbol, any> {
        const info = binding.targetInfo;
        if (!info) {
            throw new Error("Unable to locate target function within xen.");
        }

        const wrapped = this.getWrappedFunction(binding);
        return this.cloneWithReplacement(info.context, info.key, wrapped);
    }

    private cloneObjForBindings(bindings: BindingState[]): Record<string | symbol, any> {
        const [first, ...rest] = bindings;
        const baseInfo = first.targetInfo;

        if (!baseInfo) {
            throw new Error("Unable to locate target function within xen.");
        }

        const context = baseInfo.context;
        if (!context) {
            throw new Error("Unable to locate target function within xen.");
        }

        const initial = this.cloneWithReplacement(
            context,
            baseInfo.key,
            this.getWrappedFunction(first)
        );

        for (const binding of rest) {
            const info = binding.targetInfo;
            if (!info || info.context !== context) {
                throw new Error("All registered hooks must share the same context to clone the object.");
            }

            const wrapped = this.getWrappedFunction(binding);
            this.defineValue(initial, info.key, wrapped, context);
        }

        return initial;
    }

    private newForBindings(bindings: BindingState[]): any {
        const root = this.getGlobalRoot();
        if (!root) {
            throw new Error("Unable to create new xen instance with hook applied.");
        }

        const cloneCache = new Map<any, any>();
        const result = this.shallowClone(root);
        cloneCache.set(root, result);

        for (const binding of bindings) {
            const info = binding.targetInfo;
            if (!info) {
                throw new Error("Unable to create new xen instance with hook applied.");
            }

            let originalParent: any = root;
            let cloneParent: any = result;

            for (let depth = 0; depth < info.path.length; depth++) {
                const key = info.path[depth];
                const isLast = depth === info.path.length - 1;

                if (isLast) {
                    const wrapped = this.getWrappedFunction(binding);
                    this.defineValue(cloneParent, key, wrapped, originalParent);
                } else {
                    const originalChild =
                        originalParent?.[key as keyof typeof originalParent];

                    if (originalChild === undefined || originalChild === null) {
                        throw new Error("Unable to create new xen instance with hook applied.");
                    }

                    let cloneChild = cloneCache.get(originalChild);
                    if (!cloneChild) {
                        cloneChild = this.shallowClone(originalChild);
                        this.defineValue(cloneParent, key, cloneChild, originalParent);
                        cloneCache.set(originalChild, cloneChild);
                    }

                    originalParent = originalChild;
                    cloneParent = cloneChild;
                }
            }
        }

        return result;
    }

    private cloneWithReplacement(
        source: Record<string | symbol, any>,
        key: string | symbol,
        replacement: any
    ): Record<string | symbol, any> {
        const clone = this.shallowClone(source);

        this.defineValue(clone, key, replacement, source);

        return clone;
    }

    private shallowClone<TObj>(source: TObj): TObj {
        if (Array.isArray(source)) {
            return source.slice() as unknown as TObj;
        }

        if (source && (typeof source === "object" || typeof source === "function")) {
            const proto = Object.getPrototypeOf(source);
            const clone = Object.create(proto);
            Object.defineProperties(clone, Object.getOwnPropertyDescriptors(source));
            return clone;
        }

        return source;
    }

    private defineValue(
        target: Record<string | symbol, any>,
        key: string | symbol,
        value: any,
        reference: Record<string | symbol, any>
    ): void {
        const descriptor = Object.getOwnPropertyDescriptor(reference, key);

        if (descriptor) {
            if (!descriptor.configurable && !descriptor.writable) {
                throw new Error(`Cannot override non-configurable property: ${String(key)}`);
            }

            Object.defineProperty(target, key, {
                ...descriptor,
                value
            });
        } else {
            target[key] = value;
        }
    }

    private locateTarget(target: AnyFn): TargetInfo | null {
        const root = this.getGlobalRoot();
        if (!root || (typeof root !== "object" && typeof root !== "function")) {
            return null;
        }

        const visited = new Set<any>();
        const queue: Array<{ value: any; path: (string | symbol)[] }> = [
            { value: root, path: [] }
        ];

        while (queue.length > 0) {
            const { value, path } = queue.shift()!;
            if (!value || visited.has(value)) continue;
            visited.add(value);

            for (const key of this.getAllKeys(value)) {
                let propValue: any;
                try {
                    propValue = value[key as keyof typeof value];
                } catch {
                    continue;
                }

                if (propValue === target) {
                    const owner = this.findOwner(value, key) ?? value;
                    return {
                        owner,
                        context: value,
                        key,
                        path: [...path, key]
                    };
                }

                if (
                    propValue &&
                    (typeof propValue === "object" || typeof propValue === "function") &&
                    !visited.has(propValue)
                ) {
                    queue.push({
                        value: propValue,
                        path: [...path, key]
                    });
                }
            }
        }

        return null;
    }

    private getAllKeys(value: any): Array<string | symbol> {
        const keys: Array<string | symbol> = [];
        let current = value;

        while (current && current !== Object.prototype && current !== Function.prototype) {
            for (const key of Reflect.ownKeys(current)) {
                if (!keys.includes(key)) {
                    keys.push(key);
                }
            }

            current = Object.getPrototypeOf(current);
        }

        return keys;
    }

    private findOwner(value: any, key: string | symbol): any {
        let current = value;

        while (current && current !== Object.prototype && current !== Function.prototype) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
                return current;
            }

            current = Object.getPrototypeOf(current);
        }

        return null;
    }

    private safeGet(
        target: Record<string | symbol, any>,
        key: string | symbol
    ): any {
        try {
            return target[key as keyof typeof target];
        } catch {
            return undefined;
        }
    }

    private getGlobalRoot(): any {
        return (globalThis as any)?.xen;
    }
}

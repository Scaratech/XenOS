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

export class Hook<T extends AnyFn> {
    public hook: HookHandler<T>;

    private readonly original: T;
    private readonly targetInfo: TargetInfo | null;
    private readonly fallbackContext: unknown;

    constructor(target: T) {
        if (typeof target !== "function") {
            throw new TypeError("Hook target must be a function");
        }

        this.original = target;
        this.hook = (original, args, context) => original.apply(context, args);
        this.targetInfo = this.locateTarget(target);
        this.fallbackContext = this.targetInfo ? this.targetInfo.context : undefined;
    }

    public clone(): T {
        return this.createWrappedFunction();
    }

    public override(): T {
        const info = this.targetInfo;
        if (!info) {
            throw new Error("Unable to locate target function within xen");
        }

        const wrapped = this.createWrappedFunction();
        this.defineValue(info.owner, info.key, wrapped, info.owner);
        return wrapped;
    }

    public cloneObj(): Record<string | symbol, any> {
        const info = this.targetInfo;
        if (!info) {
            throw new Error("Unable to locate target function within xen");
        }

        const wrapped = this.createWrappedFunction();
        return this.cloneWithReplacement(
            info.context,
            info.key,
            wrapped
        );
    }

    public new(): any {
        const info = this.targetInfo;
        const root = (globalThis as any)?.xen;

        if (!info || !root) {
            throw new Error("Unable to create new xen instance with hook applied");
        }

        const wrapped = this.createWrappedFunction();
        return this.cloneHierarchy(root, info.path, wrapped);
    }

    private createWrappedFunction(): T {
        const hookInstance = this;
        const original = this.original;
        const defaultContext = this.fallbackContext;

        const wrapped = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
            const context = hookInstance.resolveContext(this, defaultContext);

            const invocation: HookInvocation<T> = {
                fn: original,
                call(callArgs?: Parameters<T>, thisArg?: unknown) {
                    const callContext = hookInstance.resolveContext(
                        thisArg,
                        context
                    );
                    return original.apply(
                        callContext,
                        (callArgs ?? args) as Parameters<T>
                    );
                },
                apply(thisArg?: unknown, callArgs?: Parameters<T>) {
                    const callContext = hookInstance.resolveContext(
                        thisArg,
                        context
                    );
                    return original.apply(
                        callContext,
                        (callArgs ?? args) as Parameters<T>
                    );
                },
                run() {
                    return original.apply(context, args as Parameters<T>);
                }
            };

            const handler = hookInstance.hook ?? ((og, ogArgs, ogContext) => og.apply(ogContext, ogArgs));
            return handler(invocation, args as Parameters<T>, context);
        } as AnyFn;

        Object.defineProperty(wrapped, "name", {
            value: `Hooked(${original.name || "anonymous"})`,
            configurable: true
        });

        return wrapped as T;
    }

    private resolveContext(context: unknown, fallback: unknown): unknown {
        if (context === undefined) {
            return fallback;
        }

        return context;
    }

    private locateTarget(target: T): TargetInfo | null {
        const root = (globalThis as any)?.xen;
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

    private cloneWithReplacement(
        source: Record<string | symbol, any>,
        key: string | symbol,
        replacement: any
    ): Record<string | symbol, any> {
        const clone = this.shallowClone(source);

        this.defineValue(clone, key, replacement, source);

        return clone;
    }

    private cloneHierarchy(
        source: any,
        path: (string | symbol)[],
        replacement: any,
        depth = 0
    ): any {
        if (depth >= path.length) return source;

        const key = path[depth];
        const clone = this.shallowClone(source);

        if (depth === path.length - 1) {
            this.defineValue(clone, key, replacement, source);
        } else {
            const child = source ? source[key] : undefined;
            clone[key] = this.cloneHierarchy(child, path, replacement, depth + 1);
        }

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
}

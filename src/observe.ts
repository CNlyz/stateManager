import { Updater, Key } from './interface';

let currentUpdater: Updater | null = null;

export function observe<T extends Object>(data: T) {
    /**
     * state => updater, 用于保存状态与依赖此状态的更新处理函数
     */
    const updaterMap = new Map<Key, Set<Updater>>();
    /**
     * 更新队列, 会将一次event loop里的全部更新处理函数收集起来, 在microtask里更新
     */
    const updaterList = new Set<Updater>();
    /**
     * 是否正在执行更新队列
     */
    let updating = false;

    function getUpdaters(key: Key) {
        if (currentUpdater !== null) {
            let deps = updaterMap.get(key);
            if (deps === undefined) {
                deps = new Set();
                updaterMap.set(key, deps);
            }
            deps.add(currentUpdater);
        }
    }

    function batchUpdate(key: Key) {
        const deps = updaterMap.get(key);
        if (deps === undefined) {
            return;
        }
        deps.forEach(dep => updaterList.add(dep));
        Promise.resolve().then(() => {
            if (!updating) {
                updating = true;
                updaterList.forEach(dep => dep());
                updaterList.clear();
            }
        }).then(() => updating = false);
    }

    removeDeps = (key: string, updater: () => void) => {
        const deps = updaterMap.get(key);
        if (deps === undefined) {
            return;
        }
        if (deps.has(updater)) {
            deps.delete(updater);
        }
        if (updaterList.has(updater)) {
            updaterList.delete(updater);
        }
    };

    return new Proxy(data, {
        get(target: T, key: string, receiver: any) {
            getUpdaters(key);
            return Reflect.get(target, key, receiver);
        },
        set(target: T, key: string, value: any, receiver: any) {
            batchUpdate(key);
            return Reflect.set(target, key, value, receiver);
        }
    });
}

export function collectDeps<T extends Object>(fn: () => T, updater: () => void) {
    currentUpdater = updater;
    const props = fn();
    currentUpdater = null;
    return () => Object.keys(props).forEach(key => removeDeps(key, updater));
}

let removeDeps = (key: string, updater: () => void) => {
    //
};

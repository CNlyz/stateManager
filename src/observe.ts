import { Updater, Key } from './interface';

let currentUpdater: Updater | null = null;

const updaterList = new Set<Updater>();

let updating = false;

let shouldRemoveDeps = false;

export function observe<T extends Object>(data: T) {
    const updaterMap = new Map<Key, Set<Updater>>();

    function getUpdaters(key: Key) {
        if (currentUpdater === null) {
            return;
        }
        let deps = updaterMap.get(key);
        if (deps === undefined) {
            deps = new Set();
            updaterMap.set(key, deps);
        }
        deps.add(currentUpdater);
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

    function removeDeps(key: Key) {
        if (currentUpdater === null) {
            return;
        }
        const deps = updaterMap.get(key);
        if (deps === undefined) {
            return;
        }
        deps.delete(currentUpdater);
        updaterList.delete(currentUpdater);
    };

    return new Proxy(data, {
        get(target: T, key: Key, receiver: any) {
            if (shouldRemoveDeps) {
                removeDeps(key);
            } else {
                getUpdaters(key);
            }
            return Reflect.get(target, key, receiver);
        },
        set(target: T, key: Key, value: any, receiver: any) {
            batchUpdate(key);
            return Reflect.set(target, key, value, receiver);
        }
    });
}

export function collectDeps<T extends Object>(getUpdaterMapKeys: () => T, updater: () => void) {
    currentUpdater = updater;
    shouldRemoveDeps = false;
    getUpdaterMapKeys();
    currentUpdater = null;
    return () => {
        currentUpdater = updater;
        shouldRemoveDeps = true;
        getUpdaterMapKeys();
        currentUpdater = null;
    }
}

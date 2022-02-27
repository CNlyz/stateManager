import { Updater, Key } from './interface';

let _currentUpdater: Updater | null = null;

const _updaterList = new Set<Updater>();

let _updating = false;

let _shouldRemoveDeps = false;

export function observe<T extends Object>(data: T) {
    const updaterMap = new Map<Key, Set<Updater>>();

    function getUpdaters(key: Key) {
        if (_currentUpdater === null) {
            return;
        }
        let deps = updaterMap.get(key);
        if (deps === undefined) {
            deps = new Set();
            updaterMap.set(key, deps);
        }
        deps.add(_currentUpdater);
    }

    function batchUpdate(key: Key) {
        const deps = updaterMap.get(key);
        if (deps === undefined) {
            return;
        }
        deps.forEach(dep => _updaterList.add(dep));
        Promise.resolve().then(() => {
            if (!_updating) {
                _updating = true;
                _updaterList.forEach(dep => dep());
                _updaterList.clear();
            }
        }).then(() => _updating = false);
    }

    function removeDeps(key: Key) {
        if (_currentUpdater === null) {
            return;
        }
        const deps = updaterMap.get(key);
        if (deps === undefined) {
            return;
        }
        deps.delete(_currentUpdater);
        _updaterList.delete(_currentUpdater);
    };

    return new Proxy(data, {
        get(target: T, key: Key, receiver: any) {
            if (_shouldRemoveDeps) {
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

/**
 * give currentUpdater a new updater or give it null
 */
export function setCurrentUpdater(updater: Updater | null) {
    if (updater === null || typeof updater === 'function') {
        return _currentUpdater = updater;
    }
    throw new Error(`Updater must be a function or null, but get ${typeof updater}`);
}

/**
 * tell xfi to collect deps or remove deps
 * if false, xfi will collect dependencies, or to remove them
 */
export function tellXfiWhetherRemoveDeps(shouldRemoveDeps: boolean) {
    _shouldRemoveDeps = shouldRemoveDeps;
}
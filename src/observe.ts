import { Updater, Key } from './interface';
import { getIDPrefix } from './utils';

/**
 * state => updater, 用于保存状态与依赖此状态的更新处理函数
 */
const updaterMap = new Map<Key, Set<Updater>>();
/**
 * 组件可将更新处理函数填充到这个变量上, 然后被 updaterMap 收集
 */
let currentUpdater: Updater | null = null;
/**
 * 更新队列, 会将一次event loop里的全部更新处理函数收集起来, 在microtask里更新
 */
const updaterList = new Set<Updater>();
/**
 * 是否正在执行更新队列
 */
let updating = false;
/**
 * 代理所有observable状态
 */
const proxy = new Proxy(({} as any), {
    get: (target, key, receiver) => {
        getUpdaters(key);
        return Reflect.get(target, key, receiver);
    },
    set: (target, key, value, receiver) => {
        batchUpdate(key);
        return Reflect.set(target, key, value, receiver);
    }
});

/**
 * 追踪一个属性的get和set
 * @param target 被追踪的属性所属的实例或者构造函数
 * @param key 被追踪的属性
 */
export function observable<T extends Object>(target: T, key: Key) {
    const proxyKey = getIDPrefix(key);
    Object.defineProperty(target, key, {
        get() {
            return proxy[proxyKey];
        },
        set(v: any) {
            proxy[proxyKey] = v;
        }
    });
}

/**
 * 追踪一个对象里的所有属性
 * @param data 被追踪的对象
 */
export function observe<T extends Object>(data: T) {
    const IDPrefix = getIDPrefix('');
    return new Proxy(data, {
        get(target: T, key: string, receiver: any) {
            getUpdaters(IDPrefix + key);
            return Reflect.get(target, key, receiver);
        },
        set(target: T, key: string, value: any, receiver: any) {
            batchUpdate(IDPrefix + key);
            return Reflect.set(target, key, value, receiver);
        }
    });
}

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

export function collectDeps<T extends Object>(fn: () => T, updater: () => void) {
    currentUpdater = updater;
    const props = fn();
    currentUpdater = null;
    return () => Object.keys(props).forEach(key => removeDeps(key, updater));
}

function removeDeps(key: string, updater: () => void) {
    const deps = updaterMap.get(key);
    if (deps === undefined) {
        return;
    }
    // 删除updater, 包括依赖map里和更新队列里的
    if (deps.has(updater)) {
        deps.delete(updater);
    }
    if (updaterList.has(updater)) {
        updaterList.delete(updater);
    }
}

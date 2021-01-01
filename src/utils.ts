import { Key } from './interface';

/**
 * 自增的id前缀, 保证_DEPSMAP里key的唯一性
 */
let _IDPrefix = 0;

/**
 * 生成ID前缀
 */
function getIDPrefix(key: string | number): string;
function getIDPrefix(key: Key): string | symbol;
function getIDPrefix(key: Key) {
    if (typeof key === 'string' || typeof key === 'number') {
        return `${_IDPrefix++}$${key}`;
    }
    return key;
}

export {
    getIDPrefix
};

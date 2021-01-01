import { observe } from './observe';

/**
 * 一个store抽象类, 预设了state, 可以很方便的将状态放到到state里
 */
export abstract class BaseRootState<State = any> {
    state = observe(this.initialState());

    protected initialState(): State {
        return {} as State;
    }
}

import { observe } from '../observe';

export default abstract class BaseRootState<State = any> {
    state = observe(this.initialState());

    protected initialState(): State {
        return {} as State;
    }

    dispatch = <K extends keyof State>(state: Pick<State, K>) => {
        for (const key in state) {
            if (!state.hasOwnProperty(key)) {
                return;
            }
            const newValue = state[key];
            const value = this.state[key];
            if (value !== newValue) {
                this.state[key] = newValue;
            }
        }
    }
}

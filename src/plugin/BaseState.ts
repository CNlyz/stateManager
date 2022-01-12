import { observe } from '../observe';

export abstract class BaseState<State extends Object = {}> {
    readonly state: State;

    constructor() {
        this.state = observe(this.initialState());
    }

    protected initialState() {
        return {} as State;
    }

    dispatch = <K extends keyof State>(state: Pick<State, K>) => {
        (Reflect.ownKeys(state) as K[]).forEach(key => {
            const newValue = state[key];
            const value = this.state[key];
            if (value !== newValue) {
                this.state[key] = newValue;
            }
        });
    }

    dispose = () => {
        (Reflect.ownKeys(this.state) as Array<keyof State>).forEach(key => {
            if (this.state[key] !== undefined) {
                this.state[key] = undefined!;
            }
        });
    }
}

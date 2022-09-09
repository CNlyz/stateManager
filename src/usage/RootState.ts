import { BaseState } from '../index';
import { getUseStateManager, getConnector, getInject } from '../index';

class Person {
    name: string = '';
}

export default class RootState extends BaseState<Person> {
    protected initialState(): Person {
        return new Person();
    }
}

const rootState = new RootState();

export const useStateManager = getUseStateManager(rootState);

export const connect = getConnector(rootState);

export const inject = getInject(rootState);
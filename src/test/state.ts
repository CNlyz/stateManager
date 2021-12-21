import BaseRootState from './BaseRootState';
import { getUseStateManager, getConnector } from '../connect';

class Person {
    name: string = '';
}

export default class State extends BaseRootState<Person> {
    protected initialState(): Person {
        return new Person();
    }
}

export const useStateManager = getUseStateManager(State);

export const connect = getConnector(State);
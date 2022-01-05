import BaseRootState from './BaseRootState';
import { getUseStateManager, getConnector } from '../index';

class Person {
    name: string = '';
}

export default class RootState extends BaseRootState<Person> {
    protected initialState(): Person {
        return new Person();
    }
}

export const useStateManager = getUseStateManager(RootState);

export const connect = getConnector(RootState);
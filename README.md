# Introduction

> A LightWeight JavaScript State Manager

### install
```js
npm install xfi
```

### Usage
```js
import { BaseState, getUseStateManager } from 'xfi';

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
```

```js
import React from 'react';
import { useStateManager } from './RootState';

export function PersonInfo(props: { name: string, age: number, height: number }) {
    const { name, dispatch } = useStateManager(root => ({
        name: root.state.name,
        dispatch: root.dispatch
    }));

    const onClickToChangeName = () => {
        dispatch({ name: 'xxx' }); // dispatch a new state
    }

    return (
        <div onClick={onClickToChangeName}>{name}</div>
    );
}
```




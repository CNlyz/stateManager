import React from 'react';
import { useStateManager } from './state';

export function PersonInfo() {
    const { name, dispatch } = useStateManager(root => ({
        name: root.state.name,
        dispatch: root.dispatch
    }));

    const onClickToChangeName = () => {
        dispatch({ name: 'xxx' });
    }

    return (
        <div onClick={onClickToChangeName}>{name}</div>
    );
}
import React from 'react';
import { useStateManager, connect } from './state';

export function PersonInfo(props: { name: string, age: number, height: number }) {
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

const Connected = connect(root => ({
    name: root.state.name,
    height: 0
}), PersonInfo);

function Test() {
    return (<Connected age={0} />);
}
import React from 'react';
import { useStateManager } from './RootState';
import PersonInfo from './classComponent';

export function PersonInfo(props: { name: string, age: number, height: number }) {
    const { name, dispatch } = useStateManager(root => ({
        name: root.state.name,
        dispatch: root.dispatch
    }));

    const onClickToChangeName = () => {
        dispatch({ name: 'xxx' });
    }

    return (
        <div onClick={onClickToChangeName}>
            {name}
            <PersonInfo age={1} height={10} />
        </div>
    );
}
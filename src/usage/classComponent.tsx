import React from 'react';
import { connect, inject } from './RootState';

interface Props {
    name: string;
    age: number;
    height: number;
}

type A = Omit<Props, keyof { name: string }>;

@inject(rootState => ({
    name: rootState.state.name
}))
export default class PersonInfo extends React.PureComponent<Props> {
    render() {
        return (<div />);
    }
}

// export default connect(root => ({
//     name: root.state.name,
//     height: 0,
// }), PersonInfo);

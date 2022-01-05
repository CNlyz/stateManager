import React from 'react';
import { connect } from './RootState';

interface Props {
    name: string;
    age: number;
    height: number;
}

class PersonInfo extends React.PureComponent<Props> {
    render() {
        return (<div />);
    }
}

export default connect(root => ({
    name: root.state.name,
    height: 0,
}), PersonInfo);

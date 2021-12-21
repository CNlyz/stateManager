import React, { useState, useEffect } from 'react';
import { collectDeps } from './observe';
import { ComponentType } from './interface';

let _RootState: any = null;

// for class component or function component
export function getConnector<RootState>(rootState: new () => RootState) {
    if (_RootState === null) {
        _RootState = new rootState();
    }
    return function connect<ConnectedProps, ComponentProps>(
        getState: (rootState: RootState) => ConnectedProps,
        Component: ComponentType<ComponentProps>
    ) {
        return class ConnectedComponent extends React.Component<Omit<ComponentProps, keyof ConnectedProps>> {
            private _removeDeps?: () => void = undefined;

            private trigger = () => {
                this.forceUpdate();
            }

            componentWillMount() {
                this._removeDeps = collectDeps(() => getState(_RootState), this.trigger);
            }

            componentWillUnmount() {
                this._removeDeps?.();
            }

            render() {
                const connectedProps = getState(_RootState);
                return <Component {...connectedProps} {...this.props as any} />;
            }
        };
    };
}

// only for function component
export function getUseStateManager<RootState>(rootState: new () => RootState) {
    if (_RootState === null) {
        _RootState = new rootState();
    }
    return function <T extends Object>(getState: (rootState: RootState) => T) {
        const fn = () => getState(_RootState);
        const [, setK] = useState(Symbol(0));
        useEffect(() => {
            const removeDeps = collectDeps(fn, () => setK(Symbol(0)));
            return () => removeDeps();
        }, []);
        return fn();
    };
}

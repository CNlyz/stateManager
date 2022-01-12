import React, { useState, useEffect } from 'react';
import { collectDeps } from '../observe';
import { ComponentType } from '../interface';

// for class component or function component
export function getConnector<RootState>(rootState: RootState) {
    return function connect<ComponentProps, ConnectedProps = Partial<ComponentProps>>(
        getState: (rootState: RootState) => ConnectedProps,
        Component: ComponentType<ComponentProps>
    ): ComponentType<Omit<ComponentProps, keyof ConnectedProps>> {
        return class ConnectedComponent extends React.Component<Omit<ComponentProps, keyof ConnectedProps>> {
            private _removeDeps?: () => void = undefined;

            private trigger = () => {
                this.forceUpdate();
            }

            componentWillMount() {
                this._removeDeps = collectDeps(() => getState(rootState), this.trigger);
            }

            componentWillUnmount() {
                this._removeDeps?.();
            }

            render() {
                const connectedProps = getState(rootState);
                return <Component {...connectedProps} {...this.props as any} />;
            }
        };
    };
}

// only for function component
export function getUseStateManager<RootState extends Object>(rootState: RootState) {
    function useStateManager(): RootState;
    function useStateManager<T extends Object>(getState: (rootState: RootState) => T): T & { rootState: RootState };
    function useStateManager(getState?: any) {
        if (getState === undefined) {
            return rootState;
        }
        const fn = () => getState(rootState);
        const [, update] = useState(Symbol(0));
        useEffect(() => {
            const removeDeps = collectDeps(fn, () => update(Symbol(0)));
            return () => removeDeps();
        }, []);
        return { ...fn(), rootState };
    };
    return useStateManager;
}

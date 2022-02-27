type Updater = () => void;

interface ConstructorOf<T> {
    new(...args: any[]): T;
}

type ComponentType<T> = ConstructorOf<React.Component<T>> | ((props: T) => JSX.Element);

type Key = string | symbol;

export {
    Updater,
    ComponentType,
    Key
};

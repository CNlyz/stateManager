import { setCurrentUpdater, tellXfiWhetherRemoveDeps } from '../observe';

export default function collectDeps<T extends Object>(getUpdaterMapKeys: () => T, updater: () => void) {
    setCurrentUpdater(updater);
    tellXfiWhetherRemoveDeps(false);
    getUpdaterMapKeys();
    setCurrentUpdater(null);

    const removeDeps = () => {
        setCurrentUpdater(updater);
        tellXfiWhetherRemoveDeps(true);
        getUpdaterMapKeys();
        setCurrentUpdater(null);
    }
    return removeDeps;
}
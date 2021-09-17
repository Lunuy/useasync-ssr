import { useCallback, useEffect, useRef, useState } from "react";
import { useAsyncManager } from "./AsyncContext";

function useMountedState(): () => boolean {
    const mountedRef = useRef<boolean>(false);
    const get = useCallback(() => mountedRef.current, []);
  
    useEffect(() => {
        mountedRef.current = true;
    
        return () => {
            mountedRef.current = false;
        };
    }, []);
  
    return get;
}

export interface AsyncState<T> {
    value?: T;
    error?: Error;
    loading: boolean;
};
export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList = []) {
    const asyncManager = useAsyncManager();
    if((asyncManager as any).ssrMode && asyncManager.loaded)
        return (asyncManager as any).getCache();

    const idRef = useRef(0);
    const isMounted = useMountedState();
    const [state, setState] = useState<AsyncState<T>>({ loading: true });

    useEffect(() => {
        const id = ++idRef.current;
        fn().then(
            value => isMounted() && id === idRef.current && setState({ value, loading: false }),
            error => isMounted() && id === idRef.current && setState({ error, loading: false })
        );
    }, deps);

    if((asyncManager as any).ssrMode) {
        (asyncManager as any).addPromise(fn().then(
            value => ({ value, loading: false }),
            error => ({ error, loading: false })
        ));
    }
    
    return state;
}
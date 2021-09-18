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
export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList = [], clientOnly = false): AsyncState<T> {
    const asyncManager = useAsyncManager();

    const idRef = useRef(0);
    const isMounted = useMountedState();
    const [state, setState] = useState<AsyncState<T>>(
        !clientOnly && (asyncManager as any).isCacheExists()
        ?
            (asyncManager as any).getCache()
        :
            { loading: true }
    );

    useEffect(() => {
        const id = ++idRef.current;

        // If first useEffect call with loaded state, keep state. (State is already filled by SSR cache)
        if(id === 1 && !state.loading)
            return;

        fn().then(
            value => isMounted() && id === idRef.current && setState({ value, loading: false }),
            error => isMounted() && id === idRef.current && setState({ error, loading: false })
        );
    }, deps);
    
    if(!clientOnly && !asyncManager.isClientMode && state.loading)
        (asyncManager as any).addPromise(fn().then(
            value => ({ value, loading: false }),
            error => ({ error, loading: false })
        ));
    
    return state;
}
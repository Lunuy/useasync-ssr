
import React, { useContext } from 'react';
import { AsyncManager } from './AsyncManager';

export const AsyncContext = React.createContext(new AsyncManager());
export const AsyncProvider = ({ asyncManager, caches, children }: { asyncManager: AsyncManager, caches?: any[],children: React.ReactNode }) => {
    if(asyncManager.isClientMode)
        (asyncManager as any).setCaches(caches ?? []);

    return (
        <AsyncContext.Provider value={asyncManager}>
            {children}
        </AsyncContext.Provider>
    )
}
export const useAsyncManager = () => {
    return useContext(AsyncContext);
}
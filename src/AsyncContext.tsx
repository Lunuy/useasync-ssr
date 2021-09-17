
import React, { useContext } from 'react';
import { AsyncManager } from './AsyncManager';

export const AsyncContext = React.createContext(new AsyncManager(false));
export const AsyncProvider = ({ asyncManager, children }: { asyncManager: AsyncManager, children: React.ReactNode }) => {
    return (
        <AsyncContext.Provider value={asyncManager}>
            {children}
        </AsyncContext.Provider>
    )
}
export const useAsyncManager = () => {
    return useContext(AsyncContext);
}
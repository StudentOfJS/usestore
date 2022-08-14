import { useEffect, useReducer } from 'react';
import { createReducer } from '../localStore';
import { StoreType, StoreAction } from '../types';

interface useDepartmentStoreProps {
  initialState: Record<string, any>;
  storeType?: StoreType
}

export default function useDepartmentStore({
  initialState,
  storeType = 'sessionStorage',
}: useDepartmentStoreProps) {
  const [state, dispatch] = useReducer(createReducer(storeType), initialState);

  function _syncStore (this: Window, ev: StorageEvent) {
    ev.key && dispatch({type: StoreAction.get, key: ev.key})
  };
  
  useEffect(() => {
    dispatch({type: StoreAction.init, key: ''})
    window.addEventListener('storage', _syncStore);
    return () => {
      window.removeEventListener('storage', _syncStore);
    };
  }, [initialState]);

  useEffect(() => {
    window.dispatchEvent(new Event('storage'));
  }, [state]);

  return {
    state,
    set: (key: string, value: any) => dispatch({type: StoreAction.set, key, value}),
    remove: (key: string) => dispatch({type: StoreAction.remove, key})
  };
}

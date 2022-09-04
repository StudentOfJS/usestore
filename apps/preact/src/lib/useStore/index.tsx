import { useEffect, useState } from 'preact/hooks';
import {
  getStoreData,
  updateStoreData,
  removeStoreData,
  clearStoreData,
} from 'store';

export default function useStore<T>(
  storeKey: string,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
): [
  T,
  (newData: T | ((oldData: T) => T)) => void,
  (storeKey: string, storeType?: 'localStorage' | 'sessionStorage') => void,
  (storeType?: 'localStorage' | 'sessionStorage') => void
] {
  const [state, setState] = useState<T>();
  const _syncStore = (event: CustomEvent<{
    key: string;
    value: T;
  }>) => {
    let { key, value } = event.detail;
    if (key === storeKey && value !== state) {
      setState(value);
    }
  };
  const updateState = (data: T | ((oldData: T) => T)) => {
    let newData = data;
    if (typeof data === 'function') {
      let fn = data as (oldData: T) => T;
      newData = fn(state as T);
    }
    setState(newData as T);
    updateStoreData(newData, storeKey, storeType);
  };

  useEffect(() => {
    window.addEventListener('custom_storage', _syncStore  as EventListener);
    getStoreData(storeKey);
    return () => {
      window.removeEventListener('custom_storage', _syncStore as EventListener);
    };
  }, []);
  return [state as T, updateState, removeStoreData, clearStoreData];
}

import { useEffect, useState } from 'preact/hooks';
import { getStoreData, updateStoreData, removeStoreData, clearStoreData } from 'store';

export default function useStore<T>(
  storeKey: string,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
): [T, (newData: T | ((oldData: T) => T)) => void, (storeKey: string, storeType?: 'localStorage' | 'sessionStorage') => void, (storeType?: 'localStorage' | 'sessionStorage') => void] {

  const [state, setState] = useState(getStoreData(storeKey, storeType));
  const _syncStore = () => {
    setState(getStoreData(storeKey, storeType) ?? '');
  };
  const updateState = (data: T | ((oldData: T) => T)) => {
    let newData = data;
    if(typeof data === 'function') {
      let fn = data as (oldData: T) => T;
      newData =  fn(state)
    }
    updateStoreData(newData, storeKey, storeType);
  };

  useEffect(() => {
    window.addEventListener('storage', _syncStore);
    _syncStore();
    return () => {
      window.removeEventListener('storage', _syncStore);
    };
  }, []);
  return [state, updateState, removeStoreData, clearStoreData];
}

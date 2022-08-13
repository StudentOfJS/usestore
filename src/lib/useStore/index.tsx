import { useEffect, useState } from 'react';
interface UseStoreProps<T> {
  data?: T;
  storeKey: string;
  storeType?: 'localStorage' | 'sessionStorage';
}
export default function useStore<T>({
  data,
  storeKey,
  storeType = 'sessionStorage',
}: UseStoreProps<T>): [T, (newData: T | ((oldData: T) => T)) => void] {
  const _getStoreData = () => {
    let dataString = window[storeType].getItem(storeKey);
    let localData = dataString ? JSON.parse(dataString) : data;
    return localData;
  };
  const [state, setState] = useState(_getStoreData());
  const _syncStore = () => {
    setState(_getStoreData());
  };
  useEffect(() => {
    window.addEventListener('storage', _syncStore);
    _syncStore();
    return () => {
      window.removeEventListener('storage', _syncStore);
    };
  }, []);
  useEffect(() => {
    window[storeType].setItem(storeKey, JSON.stringify(state));
    window.dispatchEvent(new Event('storage'));
  }, [state]);

  return [state, setState];
}

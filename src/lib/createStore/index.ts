interface CreateStoreProps<T> {
  data: T;
  storeKey: string;
  storeType?: 'localStorage' | 'sessionStorage';
}
export default function createStore<T>({
  data,
  storeKey,
  storeType = 'sessionStorage',
}: CreateStoreProps<T>) {
  let dataString = window[storeType].getItem(storeKey);
  if (!dataString) {
    window[storeType].setItem(storeKey, JSON.stringify(data));
  }
  window.dispatchEvent(new Event('storage'));
}

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
  let keys = window[storeType].getItem("storeKeys");
  if (keys?.includes(storeKey)) {
    let dataString = window[storeType].getItem(storeKey);
    !dataString && window[storeType].setItem(storeKey, JSON.stringify(data));
  } else {
    window[storeType].setItem("storeKeys", keys ? `${keys},${storeKey}` : storeKey);
    window[storeType].setItem(storeKey, JSON.stringify(data));
  }
  window.dispatchEvent(new Event('storage'));
}

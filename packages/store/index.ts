const createCustomStoreEvent = (key: string, value: unknown = undefined) => {
  window.dispatchEvent(
    new CustomEvent('custom_storage', {
      detail: { key, value },
    })
  );
};

export interface CreateStoreProps<T> {
  initialState: T;
  storeKey: string;
  storeType?: 'localStorage' | 'sessionStorage';
  resetOnUnmount?: boolean;
}
export function createStore<T>({
  initialState,
  storeKey,
  storeType = 'sessionStorage',
  resetOnUnmount = false,
}: CreateStoreProps<T>) {
  if (window) {
    let keys = window[storeType].getItem('storeKeys');
    if (!(keys && keys?.includes(storeKey))) {
      window[storeType].setItem(
        'storeKeys',
        keys ? `${keys},${storeKey}` : storeKey
      );
    }
    if(resetOnUnmount) {
      removeStoreData(storeKey, storeType);
    }
    let dataString = window[storeType].getItem(storeKey);
    try {
      let value = dataString ? JSON.parse(dataString) : null;
      let stringValue = JSON.stringify(initialState ?? '');
      if (value == null) {
        window[storeType].setItem(storeKey, stringValue);
      }
      createCustomStoreEvent(storeKey, value ?? initialState);
    } catch (err) {
      console.log(err);
    }
  }
}

export const getStoreData = (
  storeKey: string,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
) => {
  let dataString = (window && window[storeType].getItem(storeKey)) ?? '';
  console.log(dataString);
  try {
    let value = JSON.parse(dataString);
    createCustomStoreEvent(storeKey, value);
  } catch (err) {
    console.log(err);
  }
};

export const updateStoreData = (
  data: unknown,
  storeKey: string,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
) => {
  if (window) {
    let keys = window[storeType].getItem('storeKeys');
    if (keys && keys.includes(storeKey)) {
      window[storeType].setItem(storeKey, JSON.stringify(data));
      createCustomStoreEvent(storeKey, data);
    }
  }
};

export const removeStoreData = (
  storeKey: string,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
) => {
  if (window) {
    window[storeType].removeItem(storeKey);
    createCustomStoreEvent(storeKey);
  }
};

export const clearStoreData = (
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
) => {
  if (window) {
    window[storeType].clear();
    window.dispatchEvent(new CustomEvent('custom_storage'));
  }
};

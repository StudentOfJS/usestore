export const getStoreData = (
    storeKey: string,
    storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
  ) => {
    let dataString = window[storeType].getItem(storeKey);
    let localData = dataString && JSON.parse(dataString);
    return localData;
  };


export const updateStoreData = (
    data: unknown,
    storeKey: string,
    storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
  ) => {
    let keys = window[storeType].getItem("storeKeys");
    if (keys && keys.includes(storeKey)) {
        window[storeType].setItem(storeKey, JSON.stringify(data));
        window.dispatchEvent(new Event('storage'));
    }
  }

export const removeStoreData = (
    storeKey: string,
    storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
  ) => {
    window[storeType].removeItem(storeKey);
    window.dispatchEvent(new Event('storage'));
  }

export const clearStoreData = (storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage') => {
    window[storeType].clear();
    window.dispatchEvent(new Event('storage'));
  }
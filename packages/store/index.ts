export interface CreateStoreProps<T> {
  data: T;
  storeKey: string;
  storeType?: "localStorage" | "sessionStorage";
}
export function createStore<T>({
  data,
  storeKey,
  storeType = "sessionStorage",
}: CreateStoreProps<T>) {
  if (window) {
    let keys = window[storeType].getItem("storeKeys");
    if (keys?.includes(storeKey)) {
      let dataString = window[storeType].getItem(storeKey);
      !dataString && window[storeType].setItem(storeKey, JSON.stringify(data));
    } else {
      window[storeType].setItem(
        "storeKeys",
        keys ? `${keys},${storeKey}` : storeKey
      );
      window[storeType].setItem(storeKey, JSON.stringify(data));
    }
    window.dispatchEvent(new Event("storage"));
  }
}

export const getStoreData = (
  storeKey: string,
  storeType: "localStorage" | "sessionStorage" = "sessionStorage"
) => {
  let dataString = window && window[storeType].getItem(storeKey);
  let localData = dataString && JSON.parse(dataString);
  return localData;
};

export const updateStoreData = (
  data: unknown,
  storeKey: string,
  storeType: "localStorage" | "sessionStorage" = "sessionStorage"
) => {
  let keys = window && window[storeType].getItem("storeKeys");
  if (keys && keys.includes(storeKey)) {
    window && window[storeType].setItem(storeKey, JSON.stringify(data));
    window && window.dispatchEvent(new Event("storage"));
  }
};

export const removeStoreData = (
  storeKey: string,
  storeType: "localStorage" | "sessionStorage" = "sessionStorage"
) => {
  window && window[storeType].removeItem(storeKey);
  window && window.dispatchEvent(new Event("storage"));
};

export const clearStoreData = (
  storeType: "localStorage" | "sessionStorage" = "sessionStorage"
) => {
  window && window[storeType].clear();
  window && window.dispatchEvent(new Event("storage"));
};

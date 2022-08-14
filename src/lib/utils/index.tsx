import type { StoreType } from "../types";

export const Set = (key: string, value: any, storeType: StoreType = 'sessionStorage') => {
    window[storeType].setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('storage'));
}
export const Get = (key: string, storeType: StoreType = 'sessionStorage') => {
    let dataString = window[storeType].getItem(key)
    return dataString ? JSON.parse(dataString) : null
}
export const Remove = (key: string, storeType: StoreType = 'sessionStorage') => {
    window[storeType].deleteItem(key)
    window.dispatchEvent(new Event('storage'));
}
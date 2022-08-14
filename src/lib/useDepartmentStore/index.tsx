import { useEffect, useReducer, useState } from 'react';
type StoreType = 'localStorage' | 'sessionStorage'

interface useDepartmentStoreProps {
  initialState: Record<string, any>;
  storeType?: StoreType
}

type State = Record<string, string>
enum StoreAction {
  init = 'INIT',
  get = 'GET',
  set = 'SET',
  remove = 'REMOVE',
}
interface Action {
  type: StoreAction,
  key: string,
  value?: any,
}

const Set = (key: string, value: any, storeType: StoreType = 'sessionStorage') => {
  window[storeType].setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('storage'));
}
const Get = (key: string, storeType: StoreType = 'sessionStorage') => {
  let dataString = window[storeType].getItem(key)
  return dataString ? JSON.parse(dataString) : null
}
const Remove = (key: string, storeType: StoreType = 'sessionStorage') => {
  window[storeType].deleteItem(key)
  window.dispatchEvent(new Event('storage'));
}

const createReducer = (storeType: StoreType) => (state: State, action: Action) => {
  switch (action.type) {
    case StoreAction.init: {
      let newState = {...state}
      Object.keys(state).forEach(key => {
        let value = Get(key, storeType)
        if(value) {
          newState[key] = value
        } else {
          let value = JSON.stringify(state[key])
          Set(key, value, storeType)
          newState[key] = value
        }
      })
      return newState;
    }
    case StoreAction.get: {
      let value = Get(action.key, storeType)
      return {...state, [action.key]: value};
    }
    case StoreAction.set: {
      Set(action.key, action?.value ?? "", storeType)
      return {...state, [action.key]: action.value};
    }
    case StoreAction.remove: {
      Remove(action.key, storeType)
      return {...state, [action.key]: undefined};
    }
    default:
      return state;
  }
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

  return [state, dispatch];
}

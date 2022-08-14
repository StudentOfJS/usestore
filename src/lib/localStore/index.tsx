import { Get, Set, Remove } from "../utils"
import { StoreType, State, Action, StoreAction } from "../types"

export const createReducer = (storeType: StoreType) => (state: State, action: Action) => {
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
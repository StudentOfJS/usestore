export type StoreType = 'localStorage' | 'sessionStorage'
export type State = Record<string, string>
export enum StoreAction {
  init = 'INIT',
  get = 'GET',
  set = 'SET',
  remove = 'REMOVE',
}
export interface Action {
  type: StoreAction,
  key: string,
  value?: any,
}
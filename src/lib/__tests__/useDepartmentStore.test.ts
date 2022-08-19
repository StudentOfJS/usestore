import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react-hooks'
import useDepartmentStore from "../useDepartmentStore";

describe('useDepartmentStore with session storage: ', function () {
    // Mock localStorage
    beforeEach(() => {
        global = global || window;
        let store: Record<string, any> = {};
        vi.spyOn(window.sessionStorage, 'getItem').mockImplementation((key: string): string => {
            return store[key];
        })
        vi.spyOn(window.sessionStorage, 'removeItem').mockImplementation((key: string): void => {
            store[key] = undefined;
        })
        vi.spyOn(window.sessionStorage, 'setItem').mockImplementation((key: string, value: string): string => {
            return store[key] = <string>value;
        })
        vi.spyOn(window.sessionStorage, 'clear').mockImplementation(() => {
            store = {};
        })
    });
    it('should just run test', () => {
        expect(1).toBe(1);
    })

    it('should increment counter', () => {
        const { result } = renderHook(() => useDepartmentStore({
            count: 0
        }))

        act(() => {
            let {state, set, remove} = result.current
            set('count', state.count + 1)
        })
        let {state} = result.current
        expect(state.count).toBe(1)
    })
    it('should update sessionStorage', () => {
        const { result } = renderHook(() => useDepartmentStore({
            count: 0
        }))

        act(() => {
            let {state, set, remove}= result.current
            set('count', state.count + 10)
        })
        expect(sessionStorage.getItem('count')).toBe("10")
    })
    it('should sync state with sessionStorage', () => {
        const { result } = renderHook(() => useDepartmentStore({
            count: 0
        }))

        act(() => {
            let {state, set, remove}= result.current
            set('count', state.count + 100)
        })
        let {state} = result.current
        expect(JSON.parse(sessionStorage.getItem('count') ?? "")).toBe(state.count)
    })
});


import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react-hooks'
import useStore from "../useStore";

describe('useStore with session storage: ', function () {
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

    it('should increment counter', () => {
        const { result } = renderHook(() => useStore({ data: 0, storeKey: 'test' }))

        act(() => {
            let [count, setCount] = result.current
            setCount(count + 1)
        })
        let [count] = result.current
        expect(count).toBe(1)
    })
    it('should update sessionStorage', () => {
        const { result } = renderHook(() => useStore({ data: 0, storeKey: 'test' }))

        act(() => {
            let [count, setCount] = result.current
            setCount(count + 10)
        })
        expect(sessionStorage.getItem('test')).toBe("10")
    })
    it('should sync state with sessionStorage', () => {
        const { result } = renderHook(() => useStore({ data: 0, storeKey: 'test' }))

        act(() => {
            let [count, setCount] = result.current
            setCount(count + 100)
        })
        let [count] = result.current
        expect(JSON.parse(sessionStorage.getItem('test') ?? "")).toBe(count)
    })
});

describe('useStore with local storage: ', function () {
    // Mock localStorage
    beforeEach(() => {
        global = global || window;
        let store: Record<string, any> = {};
        vi.spyOn(window.localStorage, 'getItem').mockImplementation((key: string): string => {
            return store[key];
        })
        vi.spyOn(window.localStorage, 'removeItem').mockImplementation((key: string): void => {
            store[key] = undefined;
        })
        vi.spyOn(window.localStorage, 'setItem').mockImplementation((key: string, value: string): string => {
            return store[key] = <string>value;
        })
        vi.spyOn(window.localStorage, 'clear').mockImplementation(() => {
            store = {};
        })
    });

    it('should increment counter', () => {
        const { result } = renderHook(() => useStore({ data: 0, storeKey: 'test', storeType: 'localStorage' }))
        act(() => {
            let [count, setCount] = result.current
            setCount(count + 1)
        })
        let [count] = result.current
        expect(count).toBe(1)
    })
    it('should update localStorage', () => {
        const { result } = renderHook(() => useStore({ data: 0, storeKey: 'test', storeType: 'localStorage' }))

        act(() => {
            let [count, setCount] = result.current
            setCount(count + 10)
        })
        expect(localStorage.getItem('test')).toBe("10")
    })
    it('should sync state with localStorage', () => {
        const { result } = renderHook(() => useStore({ data: 0, storeKey: 'test', storeType: 'localStorage' }))

        act(() => {
            let [count, setCount] = result.current
            setCount(count + 100)
        })
        let [count] = result.current
        expect(JSON.parse(localStorage.getItem('test') ?? "")).toBe(count)
    })
});
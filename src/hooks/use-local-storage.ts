"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
// import superjson from "superjson";

export type StorageWrapper<T> =
  | { type: "value"; value: T }
  | { type: "cleared" };

export const useLocalStorage = <T>(key: string, initialValue?: T) => {
  // One-time migration of legacy data
  const isBrowser = typeof window !== "undefined";
  const migrateData = useCallback(() => {
    if (!isBrowser) return;
    const data = localStorage.getItem(key);
    if (!data) return;

    try {
      // Try parsing as json first
      // NOTE: Nico's original snippet uses superjson; if errors encountered, install superjson dependency and replace with the commented line below this and the other JSON function calls
      const parsed = JSON.parse(data);
      // const parsed = superjson.parse(data);
      // Skip if already in wrapper format
      if (parsed && typeof parsed === "object" && "type" in parsed) {
        return;
      }
      // Migrate legacy data to wrapper format
      const wrapper: StorageWrapper<T> = {
        type: "value",
        value: parsed as T,
      };
      localStorage.setItem(key, JSON.stringify(wrapper));
      // localStorage.setItem(key, superjson.stringify(wrapper));
    } catch {
      // If can't parse as superjson, try as plain value
      const wrapper: StorageWrapper<T> = {
        type: "value",
        value: data as T,
      };
      localStorage.setItem(key, JSON.stringify(wrapper));
      // localStorage.setItem(key, superjson.stringify(wrapper));
    }
  }, [key]);

  // Run migration once when hook is initialized
  migrateData();

  const getSnapshot = useCallback(() => {
    if (!isBrowser) return null;
    return localStorage.getItem(key);
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const subscribe = useCallback(
    (onChange: () => void) => {
      const onStorageEvent = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail.key === key) {
          onChange();
        }
      };
      window.addEventListener("storage", onChange);
      window.addEventListener(
        "local-storage-change",
        onStorageEvent as EventListener
      );
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(
          "local-storage-change",
          onStorageEvent as EventListener
        );
      };
    },
    [key]
  );

  const rawData = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const data = useMemo(() => {
    if (!isBrowser) return initialValue;
    if (!rawData) {
      return initialValue;
    }
    try {
      const parsed = JSON.parse(rawData) as StorageWrapper<T>;
      // const parsed = superjson.parse(rawData) as StorageWrapper<T>;
      if (parsed.type === "cleared") {
        return undefined;
      }
      return parsed.value;
    } catch {
      return initialValue;
    }
  }, [rawData, initialValue]);

  const setData = useCallback(
    (value: T) => {
      if (!isBrowser) return;
      const wrapper: StorageWrapper<T> = {
        type: "value",
        value,
      };
      localStorage.setItem(key, JSON.stringify(wrapper));
      // localStorage.setItem(key, superjson.stringify(wrapper));
      window.dispatchEvent(
        new CustomEvent("local-storage-change", { detail: { key } })
      );
    },
    [key]
  );

  const clearData = useCallback(() => {
    if (!isBrowser) return;
    const wrapper: StorageWrapper<T> = {
      type: "cleared",
    };
    localStorage.setItem(key, JSON.stringify(wrapper));
    // localStorage.setItem(key, superjson.stringify(wrapper));
    window.dispatchEvent(
      new CustomEvent("local-storage-change", { detail: { key } })
    );
  }, [key]);

  return useMemo(
    () => [data, setData, clearData] as const,
    [data, setData, clearData]
  );
};

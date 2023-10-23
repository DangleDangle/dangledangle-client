import { useCallback } from 'react';

export default function useLocalStorage<T>(key: string) {
  const save = useCallback(
    (json: T) => {
      localStorage.setItem(key, JSON.stringify(json));
    },
    [key]
  );

  const update = useCallback(
    (json: Partial<T>) => {
      const item = localStorage.getItem(key);
      try {
        if (!item) throw Error();

        const parsed = JSON.parse(item);
        save({ ...parsed, ...json });
        return true;
      } catch {
        console.error(`'${key}' 키값에 해당하는 localStorage 값이 없습니다`);
        return false;
      }
    },
    [key, save]
  );

  const destroy = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  const get = useCallback(() => {
    const item = localStorage.getItem(key);
    try {
      if (!item) throw Error();
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }, [key]);

  return { save, update, destroy, get };
}

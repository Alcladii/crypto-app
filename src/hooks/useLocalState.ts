import { useState, Dispatch, SetStateAction } from "react";

export const useLocalState = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const storedValue = window.localStorage.getItem(key);
  const item = storedValue ? JSON.parse(storedValue) : initialValue;
  const [state, setState] = useState<T>(item);

  const updateState: Dispatch<SetStateAction<T>> = (
    value: SetStateAction<T>
  ) => {
    const valueToStore = value instanceof Function ? value(state) : value;
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
    setState(valueToStore);
  };

  return [state, updateState];
};

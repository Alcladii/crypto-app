
import api from "../api";
import currencies from "../mocks/currencies.json"
import { createContext, useState, useEffect } from "react";
import axios from "axios";


export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {

  const useLocalState = (key, initialValue) => {
    const storedValue = window.localStorage.getItem(key);
    const item = storedValue ? JSON.parse(storedValue) : initialValue;
    const [state, setState] = useState(item);

    const updateState = (value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    };
    return [state, updateState];
  };

  const convertToBillion = (number) => {
    return (number / 1000000000).toFixed(2);
  };

  const retainTwoDigits = (number) => {
    return number.toFixed(2);
  };

  return (
    <CryptoContext.Provider
      value={{
        useLocalState,
        convertToBillion,
        retainTwoDigits,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

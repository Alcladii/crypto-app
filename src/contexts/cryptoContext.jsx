import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api";

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

  const [singleCoin, setSingleCoin] = useState({});
  const [singleCoinIsLoading, setSingleCoinIsLoading] = useState(false);
  const [singleCoinLoadingHasError, setSingleCoinLoadingHasError] =
    useState(false);

  const getSingleCoinData = async (item) => {
    try {
      setSingleCoin({});
      setSingleCoinIsLoading(true);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSingleCoinIsLoading(false);
      setSingleCoin(singleCoinData.data);
      setSingleCoinLoadingHasError(false);
    } catch (err) {
      setSingleCoinLoadingHasError(true);
      setSingleCoinIsLoading(false);
    }
  };

  return (
    <CryptoContext.Provider
      value={{
        convertToBillion,
        retainTwoDigits,
        useLocalState,
        getSingleCoinData,
        singleCoin,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

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

  const [displayCurrency, setDisplayCurrency] = useLocalState(
    "currentDisplayCurrency",
    "usd"
  );
  const [currencyList, setCurrencyList] = useState([]);
  const [currencyListIsLoading, setCurrencyListIsLoading] = useState(false);
  const [currencyLoadingHasError, setCurrencyLoadingHasError] = useState(false);

  const convertToBillion = (number) => {
    return (number / 1000000000).toFixed(2);
  };

  const retainTwoDigits = (number) => {
    return number.toFixed(2);
  };

  const getCurrencyList = async () => {
    try {
      setCurrencyListIsLoading(true);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      let fetchCurrencyList;
      fetchCurrencyList = Object.keys(singleCoinData.data.market_data.ath);
      console.log(fetchCurrencyList);
      setCurrencyListIsLoading(false);
      setCurrencyList(fetchCurrencyList);
      setCurrencyLoadingHasError(false);
    } catch (err) {
      setCurrencyLoadingHasError(true);
      setCurrencyListIsLoading(false);
    }
  };

  let currencySymbol;

  switch (displayCurrency) {
    case "aed":
      currencySymbol = "د.إ";
      break;
    case "ars":
      currencySymbol = "AR$";
      break;
    case "aud":
      currencySymbol = "AU$";
      break;
    case "bch":
      currencySymbol = "BCH";
      break;
    case "bdt":
      currencySymbol = "ó";
      break;
    case "bhd":
      currencySymbol = ".د.";
      break;
    case "hkd":
      currencySymbol = "HK$";
      break;
    case "usd":
      currencySymbol = "$";
      break;
    case "gbp":
      currencySymbol = "£";
      break;
    case "eur":
      currencySymbol = "€";
      break;
  }

  return (
    <CryptoContext.Provider
      value={{
        useLocalState,
        convertToBillion,
        retainTwoDigits,
        displayCurrency,
        getCurrencyList,
        setDisplayCurrency,
        currencyList,
        setCurrencyList,
        currencySymbol,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

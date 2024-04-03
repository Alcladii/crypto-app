import { createContext, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import api from "../api";
import currencies from "../mocks/currencies.json";
import queryString from "query-string";

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
  const [priceVolumeChartIsLoading, setPriceVolumeChartIsLoading] =
    useState(false);
  const [
    priceVolumeChartIsLoadingHasError,
    setPriceVolumeChartIsLoadingHasError,
  ] = useState(false);
  const [priceVolumeList, setPriceVolumeList] = useLocalState(
    "priceVolumeList",
    []
  );
  const [numOfDays, setNumOfDays] = useLocalState("numOfDays", []);
  const [coinsInChart, setCoinsInChart] = useState([]);
  const [slidesData, setSlidesData] = useLocalState("slidesData", []);
  const [selectedCoinData, setSelectedCoinData] = useLocalState(
    "selectedCoinData",
    []
  );
  const [singleCoin, setSingleCoin] = useLocalState("singleCoin", null);
  const [singleCoinIsLoading, setSingleCoinIsLoading] = useState(false);
  const [singleCoinLoadingHasError, setSingleCoinLoadingHasError] =
    useState(false);
  const [coinList, setCoinList] = useLocalState("coinList", []);
  const [portfolioList, setPortfolioList] = useLocalState("portfolioList", []);
  const [purchasedAmount, setPurchasedAmount] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [formattedDateForHistoryApiCall, setFormattedDateForHistoryApiCall] =
    useState(null);
  const [isNumber, setIsNumber] = useState(true);
  const [currencyConverterDays, setCurrencyConverterDays] = useLocalState(
    "currencyConverterDays",
    7
  );
  const [editAsset, setEditAsset] = useState(false) 
  const [darkMode, setDarkMode] = useLocalState("darkMode", true)

  console.log(darkMode)

  const convertToBillion = (number) => {
    return (number / 1000000000).toFixed(2);
  };

  const retainTwoDigits = (number) => {
    return number.toFixed(2);
  };

  const getSingleCoinData = async (item) => {
    try {
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

  const getCurrencyList = async () => {
    try {
      setCurrencyListIsLoading(true);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      let fetchCurrencyList;
      fetchCurrencyList = Object.keys(singleCoinData.data.market_data.ath);
      setCurrencyListIsLoading(false);
      setCurrencyList(fetchCurrencyList);
      setCurrencyLoadingHasError(false);
    } catch (err) {
      setCurrencyLoadingHasError(true);
      setCurrencyListIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrencyList();
  }, []);

  const currencySymbol = currencies[displayCurrency.toUpperCase()]?.symbol;

  const getCoinPriceVolume = async (coinId, currency, numOfDays) => {
    try {
      setPriceVolumeChartIsLoading(true);

      let apiUrl;
      if (numOfDays == 2) {
        apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}`;
      } else {
        apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}&interval=daily`;
      }
      const { data } = await axios(apiUrl);
      setPriceVolumeChartIsLoading(false);
      return data;
    } catch (err) {
      // one is for loading, the other is for error handling
      setPriceVolumeChartIsLoadingHasError(true);
      setPriceVolumeChartIsLoading(false);
    }
  };

  const location = useLocation();
  const historyURL = useHistory();
  const queryParams = queryString.parse(location.search);

  //google how to make a query string state custom hook

  const handleSearchParams = (conditionKey, conditionValue) => {
    if (!conditionKey in queryParams) {
      const updatedParams = { ...queryParams, [conditionKey]: conditionValue };
      historyURL.push(`?${queryString.stringify(updatedParams)}`);
    } else {
      queryParams[conditionKey] = conditionValue;
      historyURL.push(`?${queryString.stringify(queryParams)}`);
    }
  };

  const clearSearchParams = () => {
    const updatedParams = {};
    historyURL.push(`?${queryString.stringify(updatedParams)}`);
  };

  return (
    <CryptoContext.Provider
      value={{
        useLocalState,
        convertToBillion,
        retainTwoDigits,
        getSingleCoinData,
        singleCoin,
        setSingleCoin,
        displayCurrency,
        getCurrencyList,
        setDisplayCurrency,
        currencyList,
        setCurrencyList,
        currencySymbol,
        setNumOfDays,
        priceVolumeChartIsLoading,
        priceVolumeChartIsLoadingHasError,
        setPriceVolumeList,
        priceVolumeList,
        coinsInChart,
        setCoinsInChart,
        numOfDays,
        getCoinPriceVolume,
        slidesData,
        setSlidesData,
        selectedCoinData,
        setSelectedCoinData,
        coinList,
        setCoinList,
        portfolioList,
        setPortfolioList,
        purchasedAmount,
        setPurchasedAmount,
        purchaseDate,
        setPurchaseDate,
        formattedDateForHistoryApiCall,
        setFormattedDateForHistoryApiCall,
        isNumber,
        setIsNumber,
        handleSearchParams,
        clearSearchParams,
        location,
        queryParams,
        historyURL,
        setPriceVolumeChartIsLoadingHasError,
        currencyConverterDays,
        setCurrencyConverterDays,
        editAsset, 
        setEditAsset,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

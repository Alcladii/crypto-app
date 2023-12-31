import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import currencies from "../mocks/currencies.json";

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
  const [priceVolumeList, setPriceVolumeList] = useState([]);
  const [numOfDays, setNumOfDays] = useLocalState("numOfDays", []);
  const [coinsInChart, setCoinsInChart] = useState([]);
  const [slidesData, setSlidesData] = useLocalState("slidesData", []);
  const [selectedCoinData, setSelectedCoinData] = useLocalState("selectedCoinData", [])  
  const [singleCoin, setSingleCoin] = useLocalState("singleCoin", null);
  const [singleCoinIsLoading, setSingleCoinIsLoading] = useState(false);
  const [singleCoinLoadingHasError, setSingleCoinLoadingHasError] =
    useState(false);
  const [coinList, setCoinList] = useLocalState("coinList", []);
  const [portfolioList, setPortfolioList] = useLocalState("portfolioList",[]);
  const [purchasedAmount, setPurchasedAmount] = useState(null)
  const [purchaseDate, setPurchaseDate] = useState(null)
  const [formattedDateForHistoryApiCall, setFormattedDateForHistoryApiCall] = useState(null)
  const [isNumber, setIsNumber] = useState(true)

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
      const { data } = await axios(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}&interval=daily`
      );
      setPriceVolumeChartIsLoading(false);
      if (!data) {
        setPriceVolumeChartIsLoadingHasError(true);
        return;
      } else {
        setPriceVolumeChartIsLoadingHasError(false);
        return data
      }     
    } catch (err) {
      // one is for loading, the other is for error handling
      setPriceVolumeChartIsLoadingHasError(true);
      setPriceVolumeChartIsLoading(false);
    }
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
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import currencies from "../mocks/currencies.json";

type Currency = {
  symbol: string;
  name?: string;
  symbol_native?: string;
  decimal_digits?: number;
  rounding?: number;
  code?: string;
  name_plural?: string;
};

type Currencies = {
  [key: string]: Currency;
};

const currenciesTyped = currencies as Currencies;

export type CryptoContextProps = {
  useLocalState: <T>(
    key: string,
    initialValue: T
  ) => [T, Dispatch<SetStateAction<T>>];
  convertToBillion: (number: number) => string;
  retainTwoDigits: (number: number) => number;
  getSingleCoinData: (
    item: string,
    setSingleCoin: React.Dispatch<React.SetStateAction<any>>,
    setSingleCoinIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSingleCoinLoadingHasError: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  singleCoin: any;
  setSingleCoin: Dispatch<SetStateAction<any>>;
  displayCurrency: string;
  getCurrencyList: () => Promise<void>;
  setDisplayCurrency: Dispatch<SetStateAction<string>>;
  currencyList: string[];
  setCurrencyList: Dispatch<SetStateAction<string[]>>;
  currencySymbol?: string;
  setNumOfDays: Dispatch<SetStateAction<string>>;
  priceVolumeChartIsLoading: boolean;
  priceVolumeChartIsLoadingHasError: boolean;
  setPriceVolumeList: Dispatch<SetStateAction<any[]>>;
  priceVolumeList: any[];
  coinsInChart: any[];
  setCoinsInChart: Dispatch<SetStateAction<any[]>>;
  numOfDays: string;
  getCoinPriceVolume: (
    coinId: string,
    currency: string,
    numOfDays: string
  ) => Promise<any>;
  slidesData: any[];
  setSlidesData: Dispatch<SetStateAction<any[]>>;
  selectedCoinData: any[];
  setSelectedCoinData: Dispatch<SetStateAction<any[]>>;
  coinList: any[];
  setCoinList: Dispatch<SetStateAction<any[]>>;
  portfolioList: any[];
  setPortfolioList: Dispatch<SetStateAction<any[]>>;
  purchasedAmount: string | null;
  setPurchasedAmount: Dispatch<SetStateAction<string | null>>;
  purchaseDate: string | null;
  setPurchaseDate: Dispatch<SetStateAction<string | null>>;
  formattedDateForHistoryApiCall: string | null;
  setFormattedDateForHistoryApiCall: Dispatch<SetStateAction<string | null>>;
  isNumber: boolean;
  setIsNumber: Dispatch<SetStateAction<boolean>>;
  handleSearchParams: (conditionKey: string, conditionValue: string) => void;
  clearSearchParams: () => void;
  location: ReturnType<typeof useLocation>;
  queryParams: queryString.ParsedQuery<string>;
  navigateURL: ReturnType<typeof useNavigate>;
  setPriceVolumeChartIsLoadingHasError: Dispatch<SetStateAction<boolean>>;
  currencyConverterDays: string;
  setCurrencyConverterDays: Dispatch<SetStateAction<string>>;
  editAsset: boolean;
  setEditAsset: Dispatch<SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  convertToTrillion: (number: number) => string;
  changeSearchParams: (conditionKey: string, conditionValue: string) => void;
  numOfDaysFromUrl: string;
  redirectedFromPortfolioPage: boolean;
  setRedirectedFromPortfolioPage: Dispatch<SetStateAction<boolean>>;
  currencyListIsLoading: boolean;
  currencyLoadingHasError: boolean;
};

interface CryptoProviderProps {
  children: ReactNode;
}

export const CryptoContext = createContext<CryptoContextProps | undefined>(
  undefined
);

export const CryptoProvider = ({ children }: CryptoProviderProps) => {
  const useLocalState = <T,>(
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

  const [displayCurrency, setDisplayCurrency] = useLocalState<string>(
    "currentDisplayCurrency",
    "usd"
  );
  const [currencyList, setCurrencyList] = useLocalState<string[]>(
    "currencyList",
    []
  );
  const [currencyListIsLoading, setCurrencyListIsLoading] =
    useState<boolean>(false);
  const [currencyLoadingHasError, setCurrencyLoadingHasError] =
    useState<boolean>(false);
  const [priceVolumeChartIsLoading, setPriceVolumeChartIsLoading] =
    useState<boolean>(false);
  const [
    priceVolumeChartIsLoadingHasError,
    setPriceVolumeChartIsLoadingHasError,
  ] = useState<boolean>(false);
  const [priceVolumeList, setPriceVolumeList] = useLocalState<any[]>(
    "priceVolumeList",
    []
  );
  const [numOfDays, setNumOfDays] = useLocalState<string>("numOfDays", "7");
  const [coinsInChart, setCoinsInChart] = useState<any[]>([]);
  const [slidesData, setSlidesData] = useLocalState<any[]>("slidesData", []);
  const [selectedCoinData, setSelectedCoinData] = useLocalState<any[]>(
    "selectedCoinData",
    []
  );
  const [singleCoin, setSingleCoin] = useLocalState<any>("singleCoin", null);
  const [coinList, setCoinList] = useLocalState<any[]>("coinList", []);
  const [portfolioList, setPortfolioList] = useLocalState<any[]>(
    "portfolioList",
    []
  );
  const [purchasedAmount, setPurchasedAmount] = useState<string | null>(null);
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [formattedDateForHistoryApiCall, setFormattedDateForHistoryApiCall] =
    useState<string | null>(null);
  const [isNumber, setIsNumber] = useState<boolean>(true);
  const [currencyConverterDays, setCurrencyConverterDays] =
    useLocalState<string>("currencyConverterDays", "7");
  const [editAsset, setEditAsset] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useLocalState<boolean>("darkMode", true);
  const [redirectedFromPortfolioPage, setRedirectedFromPortfolioPage] =
    useLocalState<boolean>("redirectFromPortfolioPage", false);

  const convertToBillion = (number: number): string => {
    return (number / 1000000000).toFixed(2);
  };

  const convertToTrillion = (number: number): string => {
    return (number / 1000000000000).toFixed(2);
  };

  const retainTwoDigits = (number: number): number => {
    return parseFloat(number.toFixed(2));
  };

  const getSingleCoinData = async (
    item: string,
    setSingleCoin: React.Dispatch<React.SetStateAction<any>>,
    setSingleCoinIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSingleCoinLoadingHasError: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setSingleCoinIsLoading(true);
    setSingleCoinLoadingHasError(false);
    try {
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSingleCoinIsLoading(false);
      setSingleCoin(singleCoinData.data);
    } catch (err) {
      setSingleCoinIsLoading(false);
      setSingleCoinLoadingHasError(true);
    }
  };

  const getCurrencyList = async () => {
    setCurrencyLoadingHasError(false);
    setCurrencyListIsLoading(true);
    try {
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      let fetchCurrencyList: string[];
      fetchCurrencyList = Object.keys(singleCoinData.data.market_data.ath);
      setCurrencyList(fetchCurrencyList);
      setCurrencyListIsLoading(false);
    } catch (err) {
      setCurrencyLoadingHasError(true);
      setCurrencyListIsLoading(false);
    }
  };

  const currencySymbol = currenciesTyped[displayCurrency.toUpperCase()]?.symbol;

  const getCoinPriceVolume = async (
    coinId: string,
    currency: string,
    numOfDays: string
  ) => {
    setPriceVolumeChartIsLoadingHasError(false);
    setPriceVolumeChartIsLoading(true);
    try {
      let apiUrl: string;
      if (numOfDays === "2") {
        apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}`;
      } else {
        apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}&interval=daily`;
      }
      const { data } = await axios(apiUrl);
      setPriceVolumeChartIsLoading(false);
      return data;
    } catch (err) {
      setPriceVolumeChartIsLoadingHasError(true);
      setPriceVolumeChartIsLoading(false);
    }
  };

  const location = useLocation();
  const navigateURL = useNavigate();
  let queryParams = queryString.parse(location.search);

  const numOfDaysFromUrl = queryParams.days as string;

  const handleSearchParams = (conditionKey: string, conditionValue: string) => {
    if (!(conditionKey in queryParams)) {
      const updatedParams = { ...queryParams, [conditionKey]: conditionValue };
      queryParams = updatedParams;
      navigateURL(`?${queryString.stringify(queryParams)}`);
    }
  };

  const changeSearchParams = (conditionKey: string, conditionValue: string) => {
    if (conditionValue !== queryParams[conditionKey]) {
      queryParams[conditionKey] = conditionValue;
      navigateURL(`?${queryString.stringify(queryParams)}`);
    }
  };

  const clearSearchParams = () => {
    const updatedParams = {};
    navigateURL(`?${queryString.stringify(updatedParams)}`);
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
        navigateURL,
        setPriceVolumeChartIsLoadingHasError,
        currencyConverterDays,
        setCurrencyConverterDays,
        editAsset,
        setEditAsset,
        darkMode,
        setDarkMode,
        convertToTrillion,
        changeSearchParams,
        numOfDaysFromUrl,
        redirectedFromPortfolioPage,
        setRedirectedFromPortfolioPage,
        currencyListIsLoading,
        currencyLoadingHasError,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

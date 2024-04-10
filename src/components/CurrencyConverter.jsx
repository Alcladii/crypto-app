import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CryptoContext } from "../contexts/cryptoContext";
import LineChartCurrencyConverter from "../components/LineChartCurrencyConverter";
import { DaysButtonInCurrencyConverter } from "./DaysButtonInCurrencyConverter";

export const CurrencyConverter = () => {
  const {
    useLocalState,
    getCoinPriceVolume,
    displayCurrency,
    coinList,
    currencySymbol,
    currencyConverterDays,
  } = useContext(CryptoContext);
  const [inputValue, setInputValue] = useState("");
  const [leftCurrency, setLeftCurrency] = useLocalState(
    "leftCurrency",
    "bitcoin"
  );
  const [rightCurrency, setRightCurrency] = useLocalState(
    "rightCurrency",
    "bitcoin"
  );
  const [leftCurrencyData, setLeftCurrencyData] = useLocalState(
    "leftCurrencyData",
    null
  );
  const [singleCoinIsLoading, setSingleCoinIsLoading] = useState(false);
  const [singleCoinLoadingHasError, setSingleCoinLoadingHasError] =
    useState(false);
  const [rightCurrencyData, setRightCurrencyData] = useLocalState(
    "rightCurrencyData",
    null
  );
  const [convertedResult, setConvertedResult] = useState("");
  const [leftCurrencyPriceVolume, setLeftCurrencyPriceVolume] = useLocalState(
    "leftCurrencyPriceVolume",
    []
  );
  const [rightCurrencyPriceVolume, setRightCurrencyPriceVolume] = useLocalState(
    "rightCurrencyPriceVolume",
    []
  );
  const [
    getLeftCurrencyPriceVolumeHasError,
    setGetLeftCurrencyPriceVolumeHasError,
  ] = useState(false);
  const [
    getRightCurrencyPriceVolumeHasError,
    setGetRightCurrencyPriceVolumeHasError,
  ] = useState(false);
  const [leftCurrencyIcon, setLeftCurrencyIcon] = useLocalState(
    "leftCurrencyIcon",
    ""
  );
  const [rightCurrencyIcon, setRightCurrencyIcon] = useLocalState(
    "leftCurrencyIcon",
    ""
  );

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleReverse = () => {
    setLeftCurrency(rightCurrency);
    setRightCurrency(leftCurrency);
    setLeftCurrencyData(rightCurrencyData);
    setRightCurrencyData(leftCurrencyData);
  };

  const handleConvert = () => {
    if (rightCurrencyData !== null && leftCurrencyData !== null) {
      const conversionRate =
        rightCurrencyData.market_data.current_price[displayCurrency] /
        leftCurrencyData.market_data.current_price[displayCurrency];
      
      const result = (inputValue / conversionRate).toFixed(6);
      setConvertedResult(result);
    }
  };

  const getSelectedLeftCurrencyData = async (item) => {
    try {
      setSingleCoinIsLoading(true);
      setSingleCoinLoadingHasError(false);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSingleCoinIsLoading(false);
      if (!singleCoinData) {
        setSingleCoinLoadingHasError(true);
        return;
      } else {
        setLeftCurrencyData(singleCoinData.data);
      }
    } catch (err) {
      setSingleCoinLoadingHasError(true);
      setSingleCoinIsLoading(false);
    }
  };

  const getSelectedRightCurrencyData = async (item) => {
    try {
      setSingleCoinIsLoading(true);
      setSingleCoinLoadingHasError(false);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSingleCoinIsLoading(false);
      if (!singleCoinData) {
        setSingleCoinLoadingHasError(true);
        return;
      } else {
        setRightCurrencyData(singleCoinData.data);
      }
    } catch (err) {
      setSingleCoinLoadingHasError(true);
      setSingleCoinIsLoading(false);
    }
  };

  const handleLeftCurrencySelect = (value) => {
    setLeftCurrency(value);
  };

  const handleRightCurrencySelect = (value) => {
    setRightCurrency(value);
  };

  useEffect(() => {
    getSelectedLeftCurrencyData(leftCurrency);
  }, [leftCurrency]);

  useEffect(() => {
    getSelectedRightCurrencyData(rightCurrency);
  }, [rightCurrency]);

  const getLeftCurrencyPriceVolume = async (
    leftCurrency,
    displayCurrency,
    currencyConverterDays
  ) => {
    try {
      const response = await getCoinPriceVolume(
        leftCurrency,
        displayCurrency,
        currencyConverterDays
      );
      if (!response) {
        setGetLeftCurrencyPriceVolumeHasError(true);
        return;
      }
      setLeftCurrencyPriceVolume(response);
    } catch (error) {
      setGetLeftCurrencyPriceVolumeHasError(true);
    }
  };

  const getRightCurrencyPriceVolume = async (
    rightCurrency,
    displayCurrency,
    currencyConverterDays
  ) => {
    try {
      const response = await getCoinPriceVolume(
        rightCurrency,
        displayCurrency,
        currencyConverterDays
      );
      if (!response) {
        setGetRightCurrencyPriceVolumeHasError(true);
        return;
      }
      setRightCurrencyPriceVolume(response);
    } catch (error) {
      setGetRightCurrencyPriceVolumeHasError(true);
    }
  };

  useEffect(() => {
    setGetLeftCurrencyPriceVolumeHasError(false);
    getLeftCurrencyPriceVolume(
      leftCurrency,
      displayCurrency,
      currencyConverterDays
    );
  }, [leftCurrency, currencyConverterDays]);

  useEffect(() => {
    setGetRightCurrencyPriceVolumeHasError(false);
    getRightCurrencyPriceVolume(
      rightCurrency,
      displayCurrency,
      currencyConverterDays
    );
  }, [rightCurrency, currencyConverterDays]);

  const requests =
    leftCurrencyData && rightCurrencyData
      ? [leftCurrencyPriceVolume, rightCurrencyPriceVolume]
      : null;

  useEffect(() => {
    handleConvert();
  }, [
    leftCurrency,
    rightCurrency,
    leftCurrencyData,
    rightCurrencyData,
    inputValue,
  ]);

  const currencyOptions =
    coinList &&
    coinList.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}({item.symbol.toUpperCase()})
      </option>
    ));

  useEffect(() => {
    coinList.forEach((item) => {
      if (item.id === leftCurrency) {
        setLeftCurrencyIcon(item.image);
      }
    });
  }, [leftCurrency]);

  useEffect(() => {
    coinList.forEach((item) => {
      if (item.id === rightCurrency) {
        setRightCurrencyIcon(item.image);
      }
    });
  }, [rightCurrency]);

  return (
    //<div>Currency Converter</div>
    <div>
      <div className="flex justify-center my-6">
        {singleCoinIsLoading && <div>Loading Single Coin</div>}
        {singleCoinLoadingHasError && (
          <div>Error in loading coin data, unable to update coin price</div>
        )}
      </div>
      <div className="flex relative">
        <div className="w-[50%] p-6 mr-3 h-48 bg-line-bar-chart-background rounded-md">
          <div className="text-sm">You sell</div>
          <div className="flex items-center border-b-2 py-3 mt-6">
            <div className="w-[5%] mr-2.5">
              <img className="h-7 w-auto" src={leftCurrencyIcon} />
            </div>
            <div className="w-[95%]">
              <select
                className="w-[45%] appearance-none font-space-grotesk bg-transparent"
                value={leftCurrency}
                onChange={(e) => {
                  handleLeftCurrencySelect(e.target.value);
                  handleConvert();
                }}
              >
                {currencyOptions}
              </select>
              <input
                className="w-[55%] text-right text-lg font-semibold bg-transparent focus:outline-none"
                onChange={handleChange}
                value={inputValue}
              />
            </div>
          </div>
          <div className="mt-3 text-sm">
            1&nbsp;{leftCurrencyData !== null && leftCurrencyData.name}
            &nbsp;=&nbsp;{currencySymbol}
            {leftCurrencyData !== null &&
              leftCurrencyData.market_data.current_price[displayCurrency]}
          </div>
        </div>
        <div
          onClick={handleReverse}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-12 w-12 bg-white rounded-full cursor-pointer"
        >
          <img
            className="h-9"
            src="https://i.ibb.co/YypnKyZ/icons8-swap-60.png"
          />
        </div>
        <div className="w-[50%] p-6 ml-3 h-48 bg-right-currency-background rounded-md">
          <div className="text-sm">You buy</div>
          <div className="flex items-center border-b-2 py-3 mt-6">
            <div className="w-[5%] mr-2.5">
              <img className="h-7 w-auto" src={rightCurrencyIcon} />
            </div>
            <select
              className="w-[45%] appearance-none font-space-grotesk bg-transparent"
              value={rightCurrency}
              onChange={(e) => {
                handleRightCurrencySelect(e.target.value);
                handleConvert();
              }}
            >
              {currencyOptions}
            </select>
            <div className="w-[55%] text-right text-lg font-semibold bg-transparent focus:outline-none">
              {convertedResult != 0 ? convertedResult : ""}
            </div>
          </div>
          <div className="mt-3 text-sm">
            1&nbsp;{rightCurrencyData !== null && rightCurrencyData.name}
            &nbsp;=&nbsp;{currencySymbol}
            {rightCurrencyData !== null &&
              rightCurrencyData.market_data.current_price[displayCurrency]}
          </div>
        </div>
      </div>
      <div className="mt-16 bg-line-bar-chart-background rounded-md p-6">
        <div className="font-space-grotesk">
          {leftCurrencyData !== null && (
            <span>
              {leftCurrencyData.name}({leftCurrencyData.symbol.toUpperCase()})
            </span>
          )}
          <span className="text-to-in-currency-converter mx-4">to</span>
          {rightCurrencyData !== null && (
            <span>
              {rightCurrencyData.name}({rightCurrencyData.symbol.toUpperCase()})
            </span>
          )}
        </div>
        {getLeftCurrencyPriceVolumeHasError ||
        getRightCurrencyPriceVolumeHasError ? (
          <div className="flex justify-center my-5">
            Error in getting price and volume data, can't update chart
          </div>
        ) : (
          requests !== null && (
            <LineChartCurrencyConverter priceVolumeList={requests} />
          )
        )}
      </div>

      <div className="flex my-5 w-fit h-auto bg-button-unselected-search-bar-background rounded-md">
        <DaysButtonInCurrencyConverter days="2" buttonText="1D" />
        <DaysButtonInCurrencyConverter days="7" buttonText="7D" />
        <DaysButtonInCurrencyConverter days="30" buttonText="1M" />
        <DaysButtonInCurrencyConverter days="90" buttonText="90D" />
        <DaysButtonInCurrencyConverter days="180" buttonText="180D" />
        <DaysButtonInCurrencyConverter days="365" buttonText="1Y" />
      </div>
    </div>
  );
};

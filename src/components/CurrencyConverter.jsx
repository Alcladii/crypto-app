import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CryptoContext } from "../contexts/cryptoContext";
import LineChartCurrencyConverter from "../components/LineChartCurrencyConverter";

export const CurrencyConverter = () => {
  const {
    useLocalState,
    getCoinPriceVolume,
    displayCurrency,
    coinList,
    currencySymbol,
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
  const [currencyConverterDays, setCurrencyConverterDays] = useLocalState(
    "currencyConverterDays",
    7
  );

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    setLeftCurrency(rightCurrency);
    setRightCurrency(leftCurrency);
    setLeftCurrencyData(rightCurrencyData);
    setRightCurrencyData(leftCurrencyData);
  };

  const handleConvert = () => {
    const conversionRate =
      rightCurrencyData.market_data.current_price[displayCurrency] /
      leftCurrencyData.market_data.current_price[displayCurrency];
    const result = (inputValue / conversionRate).toFixed(6);
    setConvertedResult(result);
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
        {item.name}
      </option>
    ));

  return (
    <div className="App">
      {singleCoinIsLoading && <div>Loading Single Coin</div>}
      {singleCoinLoadingHasError && (
        <div>Error in loading coin data, unable to update coin price</div>
      )}
      <div>You sell</div>
      <input onChange={handleChange} value={inputValue} />
      <div className="currencySelectorWrapper">
        <select
          className="currencySelector"
          value={leftCurrency}
          onChange={(e) => {
            handleLeftCurrencySelect(e.target.value);
            handleConvert();
          }}
        >
          {currencyOptions}
        </select>
        <div>
          1&nbsp;{leftCurrencyData !== null && leftCurrencyData.name}
          &nbsp;=&nbsp;{currencySymbol}
          {leftCurrencyData &&
            leftCurrencyData.market_data.current_price[displayCurrency]}
        </div>
      </div>
      <button onClick={handleClick}>reverse</button>
      <div>You buy&nbsp; {convertedResult != 0 ? convertedResult : ""}</div>
      <div className="currencySelectorWrapper">
        <select
          className="currencySelector"
          value={rightCurrency}
          onChange={(e) => {
            handleRightCurrencySelect(e.target.value);
            handleConvert();
          }}
        >
          {currencyOptions}
        </select>
        <div>
          1&nbsp;{rightCurrencyData !== null && rightCurrencyData.name}
          &nbsp;=&nbsp;{currencySymbol}
          {rightCurrencyData &&
            rightCurrencyData.market_data.current_price[displayCurrency]}
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            setCurrencyConverterDays(0);
          }}
        >
          {" "}
          1 Day{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setCurrencyConverterDays(6);
          }}
        >
          {" "}
          7 Days{" "}
        </button>
        {/*I put two spaces here just to seperate the buttons before I start working on the CSS*/}
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setCurrencyConverterDays(30);
          }}
        >
          {" "}
          1 Month{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setCurrencyConverterDays(89);
          }}
        >
          {" "}
          90 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setCurrencyConverterDays(179);
          }}
        >
          {" "}
          180 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setCurrencyConverterDays(364);
          }}
        >
          {" "}
          1 Year{" "}
        </button>
      </div>
      <div>
        {leftCurrencyData !== null && leftCurrencyData.name}&nbsp;to&nbsp;
        {rightCurrencyData !== null && rightCurrencyData.name}
      </div>
      {getLeftCurrencyPriceVolumeHasError ||
      getRightCurrencyPriceVolumeHasError ? (
        <div>Error in getting price and volume data, can't update chart</div>
      ) : (
        requests !== null && (
          <LineChartCurrencyConverter priceVolumeList={requests} />
        )
      )}
    </div>
  );
};

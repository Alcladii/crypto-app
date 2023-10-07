import { CryptoContext } from "../contexts/cryptoContext";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
//import uid from "uid";

export const CurrencyConverter = () => {
  const { useLocalState } =
    useContext(CryptoContext);
  const [singleCoin, setSingleCoin] = useState({});
  const [singleCoinIsLoading, setSingleCoinIsLoading] = useState(false);
  const [singleCoinLoadingHasError, setSingleCoinLoadingHasError] =
    useState(false);
  const [inputValue, setInputValue] = useState("");
  const [reversed, setReversed] = useState(false);
  const [leftCurrency, setLeftCurrency] = useLocalState("leftCurrency", "");
  const [rightCurrency, setRightCurrency] = useLocalState("rightCurrency", "");
  const [leftCurrencyBeforeReverse, setLeftCurrencyBeforeReverse] =
    useLocalState("leftCurrencyBeforeReverse", "");
  const [rightCurrencyBeforeReverse, setRightCurrencyBeforeReverse] =
    useLocalState("rightCurrencyBeforeReverse", "");
  const [leftCurrencyValue, setLeftCurrencyValue] = useLocalState(
    "leftCurrencyValue",
    1
  );
  const [rightCurrencyValue, setRightCurrencyValue] = useLocalState(
    "rightCurrencyValue",
    1
  );
  const [convertedResult, setConvertedResult] = useState("");

  const getSingleCoinData = async () => {
    try {
      setSingleCoin({});
      setSingleCoinIsLoading(true);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSingleCoinIsLoading(false);
      setSingleCoin(singleCoinData.data);
      setSingleCoinLoadingHasError(false);
    } catch (err) {
      setSingleCoinLoadingHasError(true);
      setSingleCoinIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    if (reversed === true) {
      setReversed(false);
      setLeftCurrency(rightCurrencyBeforeReverse);
      setRightCurrency(leftCurrencyBeforeReverse);
    } else {
      setReversed(true);
      setRightCurrency(rightCurrencyBeforeReverse);
      setLeftCurrency(leftCurrencyBeforeReverse);
    }
  };

  const handleConvert = () => {
    let conversionRate;
    if (reversed === true) {
      conversionRate = rightCurrencyValue / leftCurrencyValue;
    } else {
      conversionRate = leftCurrencyValue / rightCurrencyValue;
    }
    const result = (inputValue / conversionRate).toFixed(6);
    setConvertedResult(result);
    console.log("conversion rate", conversionRate, "converted result", result);
  };

  const handleLeftCurrencySelect = (value) => {
    console.log("left currency", singleCoin.market_data.current_price[value]);
    setLeftCurrency(value);
    setLeftCurrencyBeforeReverse(value);
    setLeftCurrencyValue(singleCoin.market_data.current_price[value]);
  };

  const handleRightCurrencySelect = (value) => {
    console.log("right currency", singleCoin.market_data.current_price[value]);
    setRightCurrency(value);
    setRightCurrencyBeforeReverse(value);
    setRightCurrencyValue(singleCoin.market_data.current_price[value]);
  };

  useEffect(() => {
    console.log(
      leftCurrency,
      leftCurrencyValue,
      rightCurrency,
      rightCurrencyValue
    );
  }, []);

  useEffect(() => {
    getSingleCoinData();
    handleConvert();
    //handleLeftCurrencySelect("aed");
    //handleRightCurrencySelect("aed");
  }, []);

  useEffect(() => {
    handleConvert();
  }, [
    reversed,
    leftCurrency,
    rightCurrency,
    leftCurrencyValue,
    rightCurrencyValue,
    inputValue,
  ]);

  //singleCoin.market_data && console.log(Object.keys(singleCoin.market_data.current_price));
  console.log("leftCurrency", leftCurrency, "rightCurrency", rightCurrency);

  //const currencyList = singleCoin.market_data && Object.keys(singleCoin.market_data.current_price)
  //console.log(currencyList)

  const currencyOptions = [
    singleCoin.market_data &&
      Object.keys(singleCoin.market_data.current_price).map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      )),
  ];

  return (
    <div className="App">
      <input onChange={handleChange} value={inputValue} />
      <select
        value={/*reversed ? rightCurrency :*/ leftCurrency}
        onChange={(e) => {
          handleLeftCurrencySelect(e.target.value);
          handleConvert();
        }}
      >
        {currencyOptions}
      </select>
      <button onClick={handleClick}>reverse</button>
      <select
        value={/*reversed ? leftCurrency :*/ rightCurrency}
        onChange={(e) => handleRightCurrencySelect(e.target.value)}
      >
        {currencyOptions}
      </select>
      {/*<div>{leftCurrency}</div>
      <div>{rightCurrency}</div>*/}
      {!leftCurrency || !rightCurrency || !inputValue ? (
        <div>Please put in a number and choose both currencies.</div>
      ) : (
        <div>
          {inputValue}&nbsp;{leftCurrency}&nbsp;to&nbsp;{rightCurrency}
          &nbsp;is&nbsp;{convertedResult}
        </div>
      )}
    </div>
  );
};

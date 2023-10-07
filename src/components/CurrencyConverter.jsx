import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CryptoContext } from "../contexts/cryptoContext";

export const CurrencyConverter = () => {
  const { useLocalState, getSingleCoinData, singleCoin } =
    useContext(CryptoContext);
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
    getSingleCoinData("bitcoin");
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
        value={leftCurrency}
        onChange={(e) => {
          handleLeftCurrencySelect(e.target.value);
          handleConvert();
        }}
      >
        {currencyOptions}
      </select>
      <button onClick={handleClick}>reverse</button>
      <select
        value={rightCurrency}
        onChange={(e) => handleRightCurrencySelect(e.target.value)}
      >
        {currencyOptions}
      </select>
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

//Problem is if I select a new coin after reversed, the prev coin data on that side, won't update, 
//so when I reverse it back, it showed the old coin, instead of the new selected coin
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { CryptoContext } from "../contexts/cryptoContext";
import LineChartCurrencyConverter from "../components/LineChartCurrencyConverter";

export const CurrencyConverter = () => {
  const {
    useLocalState,
    getSingleCoinData,
    singleCoin,
    getCoinPriceVolume,
    displayCurrency,
    coinList,
  } = useContext(CryptoContext);
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
  const [leftCurrencyData, setLeftCurrencyData] = useLocalState(
    "leftCurrencyData",
    []
  );
  const [rightCurrencyData, setRightCurrencyData] = useLocalState(
    "rightCurrencyData",
    []
  );
  const [selectedCurrencies, setSelectedCurrencies] = useLocalState(
    "selectedCurrenciesInConverter",
    []
  );
  const [prevLeftCurrency, setPrevLeftCurrency] = useLocalState(
    "prevLeftCurrency",
    null
  );
  const [prevRightCurrency, setPrevRightCurrency] = useLocalState(
    "prevRightCurrency",
    null
  );
  const [currencyConverterDays, setCurrencyConverterDays] = useLocalState(
    "currencyConverterDays",
    [7]
  );
  const [prevCurrencyConverterDays, setPrevCurrencyConverterdays] =
    useLocalState("prevCurrencyConverterDays", []);
  //const [leftCurrencyDataBeforeReverse, setLeftCurrencyDataBeforeReverse] = useLocalState("leftCurrencyDataBeforeReverse", null)
  //const [rightCurrencyDataBeforeReverse, setRightCurrencyDataBeforeReverse] = useLocalState("rightCurrencyDataBeforeReverse", null)

  //make two hooks here for leftCurrencyData before reverse and rightCurrencyData before reverse 

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    if (reversed === true) {
      setReversed(false);
      setLeftCurrency(rightCurrencyBeforeReverse);
      setRightCurrency(leftCurrencyBeforeReverse);
      //setLeftCurrencyData(rightCurrencyDataBeforeReverse)
      //setRightCurrencyData(leftCurrencyDataBeforeReverse)
    } else {
      setReversed(true);
      setRightCurrency(rightCurrencyBeforeReverse);
      setLeftCurrency(leftCurrencyBeforeReverse);
      //setRightCurrencyData(rightCurrencyDataBeforeReverse)
      //setLeftCurrencyData(leftCurrencyDataBeforeReverse)     
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
  };

  //maybe put a reversed flag inside handleLeftCurrencySelect, so when it's on, setRightCurrency(value) and setRightCurrencyBeforeReverse(value)?
   //make different API call function for left and right currency

  const handleLeftCurrencySelect = (value) => {
    getSingleCoinData(value);
    setLeftCurrency(value);
    setLeftCurrencyBeforeReverse(value);
  };
 
  useEffect(() => {
    if (singleCoin.market_data && leftCurrency !== prevLeftCurrency) {
      setLeftCurrencyValue(
        singleCoin.market_data.current_price[displayCurrency]
      );
      setPrevLeftCurrency(leftCurrency);
    }
  }, [singleCoin.market_data]);

  const handleRightCurrencySelect = (value) => {
    getSingleCoinData(value);
    setRightCurrency(value);
    setRightCurrencyBeforeReverse(value);
  };

  useEffect(() => {
    if (singleCoin.market_data && rightCurrency !== prevRightCurrency) {
      setRightCurrencyValue(
        singleCoin.market_data.current_price[displayCurrency]
      );
      setPrevRightCurrency(rightCurrency);
    }
  }, [singleCoin.market_data]);

  //useEffect(() => {
    //these conditions here prevent unecessary API calls when page refreshed and arguments don't change
    /*if (
      leftCurrencyData || leftCurrency !== prevLeftCurrency ||
      currencyConverterDays !== prevCurrencyConverterDays
    ) {*/
      /*etCoinPriceVolume(leftCurrency, displayCurrency, currencyConverterDays)
        .then((response) => {
          //console.log("left currency data", leftCurrency, response)
          setLeftCurrencyData(response);
          //setLeftCurrencyDataBeforeReverse(response)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      setPrevCurrencyConverterdays(currencyConverterDays);
    }*/
  /*}*///, [leftCurrency, currencyConverterDays]);

  //useEffect(() => {
    /*if (
      !rightCurrencyData || rightCurrency !== prevRightCurrency ||
      currencyConverterDays !== prevCurrencyConverterDays
    ) {*/
      /*getCoinPriceVolume(rightCurrency, displayCurrency, currencyConverterDays)
        .then((response) => {
          //console.log("right currency data", rightCurrency, response)
          setRightCurrencyData(response);
          //setRightCurrencyDataBeforeReverse(response)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      setPrevCurrencyConverterdays(currencyConverterDays);
    }*/
  /*}*///, [rightCurrency, currencyConverterDays]);

  //reuse the line below
  //const requests = (leftCurrencyData && rightCurrencyData) && reversed ? [leftCurrencyData, rightCurrencyData] : [rightCurrencyData, leftCurrencyData]
  //const requests = (leftCurrencyData && rightCurrencyData) && [leftCurrencyData, rightCurrencyData] 

  //console.log(requests)

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
    coinList &&
      coinList.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
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
      { /*<LineChartCurrencyConverter priceVolumeList={requests} />*/}
    </div>
  );
};

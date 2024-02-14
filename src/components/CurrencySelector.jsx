import React, { useState, useContext, useEffect } from "react";
import currencies from "../mocks/currencies.json";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";


export const CurrencySelector = () => {
  const {
    displayCurrency,
    setDisplayCurrency,
    currencyList,
    location,
    queryParams,
    historyURL,
    handleSearchParams,
  } = useContext(CryptoContext);

  const handleChange = (e) => {
    setDisplayCurrency(e.target.value);
  };

  useEffect(() => {
    handleSearchParams("displaycurrency", displayCurrency)
  },[displayCurrency])

  return (
    <div className="relative flex justify-center h-10 w-32">
      <div className="h-full w-auto flex items-center justify-center bg-button-unselected-search-bar-background rounded-l-md">
        <img src="https://i.ibb.co/Fb93WxY/icons8-dollar-50-2.png" className="w-16 h-10"/>
      </div>
      <select
        className="pl-2 w-full bg-button-unselected-search-bar-background outline-none appearance-none rounded-s-none"
        value={displayCurrency}
        onChange={handleChange}
      >
        {currencyList.map((currency) => (
          <option key={currency} value={currency}>
            {currency.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="h-full w-auto absolute right-0 flex items-center justify-center pointer-events-none">
        <img src="https://i.ibb.co/kKv94Sz/icons8-expand-arrow-48.png" className="w-5 h-5"/>
      </div>
    </div>
  );
};

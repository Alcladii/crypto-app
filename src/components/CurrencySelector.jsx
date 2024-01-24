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
    //handleSearchParams("displaycurrency", e.target.value)
  };

  useEffect(() => {
    handleSearchParams("displaycurrency", displayCurrency)
  },[displayCurrency])

  return (
    <div>
      <select
        className="currency-selector"
        value={displayCurrency}
        onChange={handleChange}
      >
        {currencyList.map((currency) => (
          <option key={currency} value={currency}>
            {currency.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

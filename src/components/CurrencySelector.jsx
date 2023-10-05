import currencies from "../mocks/currencies.json";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import React, { useState, useContext } from "react";

export const CurrencySelector = () => {
  const { displayCurrency, setDisplayCurrency, currencyList } =
    useContext(CryptoContext);

  const handleChange = (e) => {
    setDisplayCurrency(e.target.value);
  };

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

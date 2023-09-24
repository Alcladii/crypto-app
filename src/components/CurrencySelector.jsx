
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import React, { useState, useContext } from "react";
import { uid } from "uid"

export const CurrencySelector = () => {

  const { displayCurrency, setDisplayCurrency, currencyList } = useContext(CryptoContext);

  const handleChange = (e) => {
    setDisplayCurrency(e.target.value)
  }

  return (
    <div>
    <select className='currency-selector' value={displayCurrency} onChange={handleChange}>
      {currencyList.map((currency)=>(
        <option key={uid} value={currency}>{currency}</option>
      ))}  
    </select>
    </div>
  );
};

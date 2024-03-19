import React, { useState, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const PurchaseAmount = ({ amount }) => {
  const { setPurchasedAmount } =
    useContext(CryptoContext);

  const [inputPurchasedAmount, setInputPurchasedAmount] = useState(amount);
  const [placeholder, setPlaceholder] = useState('Purchased Amount');

  const handleChange = (value) => {
    setInputPurchasedAmount(value);
    setPurchasedAmount(value);
  };

  const handleFocus = () => {
    setPlaceholder('');
  };

  const handleBlur = (e) => {
    if (e.target.value === '') {
      setPlaceholder('Purchased Amount');
    }
  };

  return (
    <div>
      <input
        value={inputPurchasedAmount}
        className="w-full bg-button-unselected-search-bar-background outline-none appearance-none rounded-md h-12 pl-3"
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

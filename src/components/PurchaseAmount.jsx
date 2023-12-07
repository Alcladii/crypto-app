import React, { useState, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const PurchaseAmount = () => {
  const [inputValue, setInputValue] = useState("");
  const [isNumber, setIsNumber] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false);

  const handleChange = (value) => {
    if (value.trim() === "") {
      setIsEmpty(true);
      setIsNumber(true); // Reset isNumber state when input is empty
    } else {
      setIsEmpty(false);
      const isValidNumber = /^\d*\.?\d+$/.test(value);

      if (!isValidNumber) {
        setIsNumber(false);
      } else {
        setIsNumber(true);
        setInputValue(value);
      }
    }
  };

  return (
    <div>
      <input
        className="purchase-amount-input"
        onChange={(e) => handleChange(e.target.value)}
        placeholder="input a number"
      />
      {!isNumber && !isEmpty && <div>Please input a number</div>}
    </div>
  );
};
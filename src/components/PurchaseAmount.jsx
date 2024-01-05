import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const PurchaseAmount = ({ amount }) => {
  const { setPurchasedAmount } =
    useContext(CryptoContext);

  const [inputPurchasedAmount, setInputPurchasedAmount] = useState(amount);

  const handleChange = (value) => {
    setInputPurchasedAmount(value);
    setPurchasedAmount(value);
  };

  return (
    <div>
      <input
        value={inputPurchasedAmount}
        className="purchase-amount-input"
        onChange={(e) => handleChange(e.target.value)}
        placeholder={"input a number"}
      />
    </div>
  );
};

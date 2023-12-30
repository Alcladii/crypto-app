import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const PurchaseAmount = ({amount, passPurchasedAmountInput}) => {
  const {
    useLocalState,
    purchasedAmount,
    setPurchasedAmount
  } = useContext(CryptoContext);
  
  const [inputPurchasedAmount, setInputPurchasedAmount] = useState(amount);
  const [isNumber, setIsNumber] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false);
  //const [localAmount, setLocalAmount] = useState(amount);

  const handleChange = (value) => {
      //setInputPurchasedAmount(value)
      //setPurchasedAmount(value) 
    if (value.trim() === "") {
      setIsEmpty(true);
      setIsNumber(true); // Reset isNumber state when input is empty
    } else {
    setIsEmpty(false);
      const isValidNumber = /^\d*\.?\d+$/.test(value);

      if (!isValidNumber) {
        //setInputValue("");
        setIsNumber(false);
      } else {
        setIsNumber(true);
        setInputPurchasedAmount(value);
        setPurchasedAmount(value)
        //setLocalAmount(value)
      }
    }
  };

  //passPurchasedAmountInput(inputPurchasedAmount)

  return (
    <div>
      <input
        //value = {inputPurchasedAmount}
        className="purchase-amount-input"
        onChange={(e) => handleChange(e.target.value)}  
        placeholder= {"input a number"}
      />
      {/*/{!isNumber && !isEmpty && <div>Please input a number</div>}*/}
    </div>
  );
};

{/*placeholder= {amount ? amount : "input a number"}*/}
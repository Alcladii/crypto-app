import React, { useState, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const PurchaseDate = () => {
  //const [purchaseDate, setPurchaseDate] = useState(null)

  const {
    purchaseDate, setPurchaseDate, formattedDateForHistoryApiCall, setFormattedDateForHistoryApiCall
  } = useContext(CryptoContext);

  

  //console.log(purchaseDate)

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const formattedDate = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;
    setFormattedDateForHistoryApiCall(formattedDate);
  };

  const handleInput = (value) => {
    formatDate(value);
    setPurchaseDate(value)
  }
  
  //console.log(formattedDateForHistoryApiCall)

  return (
    <div>
      <input type="date" onChange={(e) => handleInput(e.target.value)}/>
    </div>
  )
}
import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const PurchaseDate = ({ date }) => {
  const [localDate, setLocalDate] = useState(date);

  const { setPurchaseDate, setFormattedDateForHistoryApiCall } =
    useContext(CryptoContext);

    /*useEffect(() => {
      setLocalDate(date); 
    }, [date]);*/

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const formattedDate = `${dateObject.getDate()}-${
      dateObject.getMonth() + 1
    }-${dateObject.getFullYear()}`;
    setFormattedDateForHistoryApiCall(formattedDate);
  };

  const handleInput = (value) => {
    formatDate(value);
    setLocalDate(value); 
    setPurchaseDate(value);
  };

  return (
    <div>
      <input
        type="date"
        value={localDate || ""}
        onChange={(e) => handleInput(e.target.value)}
      />
    </div>
  );
};

import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const PurchaseDate = ({ date }) => {
  const [localDate, setLocalDate] = useState(date);

  const { setPurchaseDate, setFormattedDateForHistoryApiCall } =
    useContext(CryptoContext);

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
        className="w-full bg-button-unselected-search-bar-background outline-none appearance-none rounded-md h-12 pl-3"
        type="text"
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => (e.target.type = "text")}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Purchased Date"
      />
    </div>
  );
};

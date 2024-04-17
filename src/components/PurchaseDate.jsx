import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const PurchaseDate = ({ date }) => {
  const [localDate, setLocalDate] = useState(date);
  const { setPurchaseDate, setFormattedDateForHistoryApiCall, editAsset, darkMode, } =
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
      {editAsset ? <input
        className={`w-full bg-skin-add-edit-asset-popup-items-background-color text-skin-add-edit-asset-popup-input-text-color ${darkMode
          ? "placeholder-placeholder-dark"
          : "placeholder-placeholder-light"} outline-none appearance-none rounded-md h-12 pl-3`}
        type="date"      
        onChange={(e) => handleInput(e.target.value)}
        value={localDate}
      /> :
      <input
        className={`w-full bg-skin-add-edit-asset-popup-items-background-color text-skin-add-edit-asset-popup-input-text-color ${darkMode
        ? "placeholder-placeholder-dark"
        : "placeholder-placeholder-light"} outline-none appearance-none rounded-md h-12 pl-3`}
        type="text"
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => (e.target.type = "text")}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Purchased Date"
      />}
    </div>
  );
};

import React, { useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const DaysButtonInCurrencyConverter = ({ days, buttonText }) => {
  const { currencyConverterDays, setCurrencyConverterDays } =
    useContext(CryptoContext);

  return (
    <div>
      <div
        className={`${
          currencyConverterDays === days ? "selected-button" : "bg-transparent"
        } w-16 h-10 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer`}
        onClick={() => {
          setCurrencyConverterDays(days);
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};


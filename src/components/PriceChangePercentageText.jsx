import React, { useContext } from "react";
import { CryptoContext } from "../contexts/cryptoContext";

export const PriceChangePercentageText = ({ coin }) => {
  const { retainTwoDigits } = useContext(CryptoContext);

  return (
    <div
      className={`flex justify-start items-center ${
        coin > 0 ? "text-skin-change-percentage-in-coin-page-positive-text-color" : "text-skin-change-percentage-in-coin-page-negative-text-color"
      }`}
    >
      {coin !== null ? retainTwoDigits(Math.abs(coin)) : "N/A"}%
    </div>
  );
};
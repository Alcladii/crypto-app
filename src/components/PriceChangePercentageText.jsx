import React, { useContext } from "react";
import { CryptoContext } from "../contexts/cryptoContext";

export const PriceChangePercentageText = ({ coin }) => {
  const { retainTwoDigits } = useContext(CryptoContext);

  return (
    <div
      className={`flex justify-start items-center ${
        coin > 0 ? "text-go-up" : "text-go-down"
      }`}
    >
      {coin !== null ? retainTwoDigits(Math.abs(coin)) : "N/A"}%
    </div>
  );
};
import React, { useContext } from "react";
import { CryptoContext } from "../contexts/cryptoContext";

export const CurrencySelector = () => {
  const { coinList, useLocalState } = useContext(CryptoContext);

  return (
    <select>
      {coinList && coinList.forEach((coin) => <option>coinList.</option>)}
    </select>
  );
};

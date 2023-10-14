import React, { useContext } from "react";
import { CryptoContext } from "../contexts/cryptoContext";
import Coins from "../components/Coins";
import { CurrencyConverter } from "../components/CurrencyConverter";

export const Home = () => {
  const { useLocalState } = useContext(CryptoContext);
  const [loadCoins, setLoadCoins] = useLocalState(false);

  const hancleCoinsCurrencyClick = () => {
    if (loadCoins === false) {
      setLoadCoins(true);
    } else {
      setLoadCoins(false);
    }
  };

  return (
    <div>
      <button onClick={hancleCoinsCurrencyClick}>Coins</button>
      <button onClick={hancleCoinsCurrencyClick}>Currency Converter</button>
      {loadCoins ? <Coins /> : <CurrencyConverter />}
    </div>
  );
};

import React, { useContext } from "react";
import { CryptoContext } from "../contexts/cryptoContext";
import Coins from "../components/Coins";
import { CurrencyConverter } from "../components/CurrencyConverter";

export const Home = () => {
  const { useLocalState } = useContext(CryptoContext);
  const [loadCoins, setLoadCoins] = useLocalState(false);

  const hancleCoinsListClick = () => {  
    setLoadCoins(true);
  };

  const handleCurrencyConverterClick = () => {
    setLoadCoins(false)
  }

  return (
    <div>
      <button onClick={hancleCoinsListClick}>Coins</button>
      <button onClick={handleCurrencyConverterClick}>Currency Converter</button>
      {loadCoins ? <Coins /> : <CurrencyConverter />}
    </div>
  );
};

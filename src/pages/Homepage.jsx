import React, { useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import Coins from "../components/Coins";
import { CurrencyConverter } from "../components/CurrencyConverter";

export const Home = () => {
  const { useLocalState } = useContext(CryptoContext);
  const [loadCoins, setLoadCoins] = useLocalState(false);

  const handleCoinsListClick = () => {  
    setLoadCoins(true);
  };

  const handleCurrencyConverterClick = () => {
    setLoadCoins(false)
  }

  return (
    <div>
      <button onClick={handleCoinsListClick} className={`${loadCoins ? "coin-Or-Converter-Selected" : ""}`}>Coins</button>
      <button onClick={handleCurrencyConverterClick} className={`${!loadCoins ? "coin-Or-Converter-Selected" : ""}`}>Currency Converter</button>
     {loadCoins ? <Coins /> : <CurrencyConverter />}
    </div>
  );
};

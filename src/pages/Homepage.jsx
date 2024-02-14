import React, { useContext, useEffect } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import Coins from "../components/Coins";
import { CurrencyConverter } from "../components/CurrencyConverter";

export const Home = () => {
  const { useLocalState, handleSearchParams, queryParams } = useContext(CryptoContext);
  const [loadCoins, setLoadCoins] = useLocalState("loadCoinsPage", true);

  const handleCoinsListClick = () => {  
    setLoadCoins(true);
  };

  const handleCurrencyConverterClick = () => {
    setLoadCoins(false)
  }

  useEffect(() => {
    handleSearchParams("load_coins_page", loadCoins)
  }, [loadCoins])

  const loadCoinsPageFromUrl = queryParams.load_coins_page === "true"

  return (
    
    <div className="max-w-[1440px] bg-crpyto-background-dark" >
      <button onClick={handleCoinsListClick} className={`${loadCoins ? "coin-Or-Converter-Selected" : ""}`}>Coins</button>
      <button onClick={handleCurrencyConverterClick} className={`${!loadCoins ? "coin-Or-Converter-Selected" : ""}`}>Currency Converter</button>
      { loadCoinsPageFromUrl  ? <Coins /> : <CurrencyConverter />}
    </div>
  );
};

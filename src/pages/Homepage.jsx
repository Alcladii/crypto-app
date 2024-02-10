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

  return (
    
    <div className="page-max-width bg-crpyto-background-dark px-10 py-8" >
      <button onClick={handleCoinsListClick} className={`${loadCoins ? "coin-Or-Converter-Selected" : ""}`}>Coins</button>
      <button onClick={handleCurrencyConverterClick} className={`${!loadCoins ? "coin-Or-Converter-Selected" : ""}`}>Currency Converter</button>
      {/*some issues with CurrencyConverter causing the app to crash, save the line below until currencyConverter is fixed*/}
     {queryParams.load_coins_page === "true" ? <Coins /> : <CurrencyConverter />}
    </div>
  );
};

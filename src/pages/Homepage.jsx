import React, { useContext, useEffect } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import Coins from "../components/Coins";
import { CurrencyConverter } from "../components/CurrencyConverter";

export const Home = () => {
  const { useLocalState, handleSearchParams, queryParams, changeSearchParams, darkMode, } =
    useContext(CryptoContext);
  const [loadCoins, setLoadCoins] = useLocalState("loadCoinsPage", true);

  const handleCoinsListClick = () => {
    setLoadCoins(true);
    changeSearchParams("load_coins_page", "true")
  };

  const handleCurrencyConverterClick = () => {
    setLoadCoins(false);
    changeSearchParams("load_coins_page", "false")
  };

  useEffect(() => {
    handleSearchParams("load_coins_page", loadCoins);    
  },[]);

  const loadCoinsPageFromUrl = queryParams.load_coins_page === "true"

  return (
    <div className={`${darkMode ? "" : "theme-light"} bg-skin-app h-full w-screen` } >
      <div className="max-w-[1440px] mx-auto px-10 py-8">
        <div className="flex justify-left items-center">
          <div
            onClick={handleCoinsListClick}
            className={`${
              loadCoins
                ? "bg-skin-coins-converter-selected-button-background"
                : "bg-skin-coins-converter-unselected-button-background"
            } ${darkMode ? "" : "theme-light"} flex items-center justify-center h-10 w-44 rounded-md cursor-pointer`}
          >
            Coins
          </div>
          <div
            onClick={handleCurrencyConverterClick}
            className={`${
              !loadCoins
                ? "bg-skin-coins-converter-selected-button-background"
                : "bg-skin-coins-converter-unselected-button-background"
            } ${darkMode ? "" : "theme-light"} flex items-center justify-center h-10 w-44 rounded-md cursor-pointer`}
          >
            Currency Converter
          </div>
        </div>
        {loadCoinsPageFromUrl ? (
          <Coins />
        ) : (
          <CurrencyConverter />
        )}
      </div>
    </div>
  );
};

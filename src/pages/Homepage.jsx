import React, { useContext, useEffect } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import Coins from "../components/Coins";
import { CurrencyConverter } from "../components/CurrencyConverter";

export const Home = () => {
  const { useLocalState, handleSearchParams, queryParams } =
    useContext(CryptoContext);
  const [loadCoins, setLoadCoins] = useLocalState("loadCoinsPage", true);

  const handleCoinsListClick = () => {
    setLoadCoins(true);
  };

  const handleCurrencyConverterClick = () => {
    setLoadCoins(false);
  };

  useEffect(() => {
    handleSearchParams("load_coins_page", loadCoins);
  }, [loadCoins]);

  return (
    <div className="page-max-width bg-crpyto-background-dark px-10 py-8">
      <div className="flex justify-left items-center">
        <div
          onClick={handleCoinsListClick}
          className={`${loadCoins ? "bg-button-selected" : "bg-button-unselected-search-bar-background"} flex items-center justify-center h-10 w-44 rounded-md`}
        >
          Coins
        </div>
        <div
          onClick={handleCurrencyConverterClick}
          className={`${!loadCoins ? "bg-button-selected" : "bg-button-unselected-search-bar-background"} flex items-center justify-center h-10 w-44 rounded-md`}
        >
          Currency Converter
        </div>
      </div>
      {/*some issues with CurrencyConverter causing the app to crash, save the line below until currencyConverter is fixed*/}
      {queryParams.load_coins_page === "true" ? (
        <Coins />
      ) : (
        <CurrencyConverter />
      )}
    </div>
  );
};

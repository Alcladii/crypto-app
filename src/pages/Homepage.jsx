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

  const loadCoinsPageFromUrl = queryParams.load_coins_page === "true"

  return (
    <div className="bg-crpyto-background-dark h-full w-screen">
      <div className="max-w-[1440px] mx-auto px-10 py-8">
        <div className="flex justify-left items-center">
          <div
            onClick={handleCoinsListClick}
            className={`${
              loadCoins
                ? "selected-button"
                : "bg-button-unselected-search-bar-background"
            } flex items-center justify-center h-10 w-44 rounded-md cursor-pointer`}
          >
            Coins
          </div>
          <div
            onClick={handleCurrencyConverterClick}
            className={`${
              !loadCoins
                ? "selected-button"
                : "bg-button-unselected-search-bar-background"
            } flex items-center justify-center h-10 w-44 rounded-md cursor-pointer`}
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

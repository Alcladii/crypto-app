import { useContext, useEffect } from "react";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import Coins from "../components/Coins";
import { CurrencyConverter } from "../components/CurrencyConverter";

export const Home = () => {
  const {
    useLocalState,
    handleSearchParams,
    queryParams,
    changeSearchParams,
    darkMode,
  } = useContext(CryptoContext) as CryptoContextProps;
  const [loadCoins, setLoadCoins] = useLocalState("loadCoinsPage", true);

  const handleCoinsListClick = () => {
    setLoadCoins(true);
    changeSearchParams("load_coins_page", "true");
  };

  const handleCurrencyConverterClick = () => {
    setLoadCoins(false);
    changeSearchParams("load_coins_page", "false");
  };

  useEffect(() => {
    handleSearchParams("load_coins_page", "true");
  }, []);

  const loadCoinsPageFromUrl = queryParams.load_coins_page === "true";

  return (
    <div
      className={`bg-skin-app h-full w-screen ${darkMode ? "" : "theme-light"}`}
    >
      <div className="max-w-[1296px] mx-auto px-10 py-8">
        <div className="flex justify-center sm:justify-start items-center">
          <div
            onClick={handleCoinsListClick}
            className={`${
              loadCoinsPageFromUrl
                ? "bg-skin-coins-converter-selected-button-background"
                : "bg-skin-coins-converter-unselected-button-background"
            } ${
              darkMode ? "" : "theme-light"
            } flex items-center justify-center h-10 w-44 rounded-md cursor-pointer ${
              loadCoinsPageFromUrl
                ? "text-skin-coins-currency-selector-selected-button-text-color"
                : "text-skin-coins-currency-selector-unselected-button-text-color"
            }`}
          >
            Coins
          </div>
          <div
            onClick={handleCurrencyConverterClick}
            className={`${
              !loadCoinsPageFromUrl
                ? "bg-skin-coins-converter-selected-button-background"
                : "bg-skin-coins-converter-unselected-button-background"
            } ${
              darkMode ? "" : "theme-light"
            } flex items-center justify-center h-10 w-44 rounded-md cursor-pointer ${
              !loadCoinsPageFromUrl
                ? "text-skin-coins-currency-selector-selected-button-text-color"
                : "text-skin-coins-currency-selector-unselected-button-text-color"
            }`}
          >
            Currency Converter
          </div>
        </div>
        {(loadCoinsPageFromUrl || !queryParams.load_coins_page) ? <Coins /> : <CurrencyConverter />}
      </div>
    </div>
  );
};

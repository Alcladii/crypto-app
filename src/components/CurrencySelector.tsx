import { useContext, useEffect } from "react";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { DollarSign, OpenDropDownArrowCurrencySelector } from "../components/UI/Svg"

export const CurrencySelector = () => {
  const {
    displayCurrency,
    setDisplayCurrency,
    currencyList,
    handleSearchParams,
    changeSearchParams,
    darkMode,
  } = useContext(CryptoContext) as CryptoContextProps;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayCurrency(e.target.value);
    changeSearchParams("displaycurrency", e.target.value)
  };

  useEffect(() => {
    handleSearchParams("displaycurrency", displayCurrency);
  });

  return (
    <div className="relative flex justify-center h-10 w-16 md:w-32">
      <div
        className={`h-full w-auto items-center justify-center pl-2 bg-skin-unselected-button-bg hidden md:flex rounded-l-md ${
          darkMode ? "" : "theme-light"
        }`}
      >
        <DollarSign />
      </div>
      <select
        className={`pl-1 sm:pl-2 w-full bg-transparent md:bg-skin-unselected-button-bg outline-none appearance-none rounded-s-none ${
          darkMode ? "" : "theme-light"
        } text-skin-currency-selector-text-color`}
        value={displayCurrency}
        onChange={handleChange}
      >
        {currencyList.map((currency) => (
          <option key={currency} value={currency}>
            {currency.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="h-full w-auto absolute right-0 flex items-center justify-center pointer-events-none pr-1 sm:pr-2">
        <OpenDropDownArrowCurrencySelector />
      </div>
    </div>
  );
};

import { useContext, useEffect } from "react";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(255, 255, 255, 1)" : "rgba(66, 66, 134, 1)"}
          className="w-6 h-6 "
        >
          <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
            clip-rule="evenodd"
          />
        </svg>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke={darkMode ? "rgba(255, 255, 255, 1)" : "rgba(66, 66, 134, 1)"}
          className="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </div>
  );
};
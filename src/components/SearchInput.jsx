import React, { useState, useContext, useEffect, useRef } from "react";
import api from "../api";
import { CryptoContext } from "../contexts/cryptoContext";
import { ResultList } from "../components/ResultList";

export const SearchItemInput = () => {
  const { darkMode } = useContext(CryptoContext);
  const [inputValue, setInputValue] = useState("");
  const [showSearchInputPopup, setShowSearchInputPopup] = useState(false);
  const [results, setResults] = useState([]);

  let searchInputRef = useRef();

  useEffect(() => {
    let closeSearchInput = (e) => {
      if (!searchInputRef.current.contains(e.target)) {
        setShowSearchInputPopup(false);
        setInputValue("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", closeSearchInput);

    return () => {
      document.removeEventListener("mousedown", closeSearchInput);
    };
  });

  const fetchData = async (value) => {
    const response = await api(
      "/coins/markets",
      "vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
    );
    const coins = response.data;
    const results = coins.filter((coin) => {
      return value && coin && coin.id && coin.id.toLowerCase().includes(value);
    });
    setResults(results);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    fetchData(e.target.value);
  };

  const toggleSearchInputPopup = () => {
    setShowSearchInputPopup(!showSearchInputPopup);
  };

  return (
    <div className="flex items-center relative">
      <div ref={searchInputRef}>
        <div>
          <input
            placeholder="Search for coin"
            onChange={handleChange}
            value={inputValue}
            className={`hidden h-10 md:block md:w-40 lg:block lg:w-80 px-5 outline-none bg-skin-unselected-button-bg rounded-md text-skin-coin-search-input-text-color ${
              darkMode
                ? "placeholder-placeholder-dark"
                : "placeholder-placeholder-light"
            }`}
          />
        </div>
        <button
          className={`md:hidden lg:hidden flex items-center justify-center h-10 w-10 appearance-none rounded-md bg-skin-unselected-button-bg`}
          onClick={toggleSearchInputPopup}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke={
              darkMode ? "rgba(209, 209, 214, 1)" : "rgba(66, 66, 134, 1)"
            }
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
        <div
          className={`border ${
            showSearchInputPopup ? "absolute" : "hidden"
          } md:hidden w-60 p-0.5 bg-skin-search-popup-background-color rounded-md`}
        >
          <input
            placeholder="Search for coin"
            className={`w-full h-10 rounded-md bg-skin-unselected-button-bg focus:placeholder-transparent p-2 text-skin-coin-search-input-text-color ${
              darkMode
                ? "placeholder-placeholder-dark"
                : "placeholder-placeholder-light"
            }`}
            onChange={handleChange}
            value={inputValue}
          />
        </div>
        <ResultList results={results} />
      </div>
    </div>
  );
};

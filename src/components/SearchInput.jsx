import React, { useState, useContext } from "react";
import api from "../api";
import { CryptoContext } from "../contexts/cryptoContext";

export const SearchItemInput = ({ setResults }) => {
  const { darkMode } = useContext(CryptoContext);
  const [inputValue, setInputValue] = useState("");
  //save for real api call
  /*const fetchData = (value) => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6000&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d")
      .then((response) => response.json())
      .then((json) => {       
         const results = json.filter((coin) => {
            return value&&coin && coin.id && coin.id.toLowerCase().includes(value)
        });
        setResults(results);
      })
  }*/
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

  return (
    <input
      placeholder="Search for coin"
      onChange={handleChange}
      value={inputValue}
      className={`h-10 w-80 px-5 outline-none ${
        darkMode ? "" : "theme-light"
      } bg-skin-unselected-button-bg rounded-md ${
        darkMode
          ? "placeholder-placeholder-dark"
          : "placeholder-placeholder-light"
      }`}
    />
  );
};

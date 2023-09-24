import React, { useState } from "react";
import api from "../api"

export const SearchItemInput = ({setResults}) => {
  const [inputValue, setInputValue] = useState("");

  /*const fetchData = (value) => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6000&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d")
      .then((response) => response.json())
      .then((json) => {       
         const results = json.filter((coin) => {
            return value&&coin && coin.id && coin.id.toLowerCase().includes(value)
        });
        setResults(results);
        console.log(results)
      })
  }*/
  const fetchData = async (value) => {
      const response = await api("/coins/markets",
      "vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d");
  
      const coins = response.data;
      
      const results = coins.filter((coin) => {
        return value && coin && coin.id && coin.id.toLowerCase().includes(value);
      });
  
      setResults(results);
      console.log(results);
      
    }
  
  
  

  const handleChange = (e) => {
    setInputValue(e.target.value);
    fetchData(e.target.value)
  };
  
  return (
    <input
      placeholder = "Search for coin"
      onChange = {handleChange}
      value={inputValue}
    />
  );
}

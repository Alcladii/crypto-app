import React, { useState, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";


export const DeleteAsset = () => {

  const {
        coinList,
        portfolioList,
        setPortfolioList,
      } = useContext(CryptoContext);
  
  const handleClick = (coin) => {
    const newPortfolioList = portfolioList.filter((item) => item.id !== coin.id)
    setPortfolioList(newPortfolioList)
  }
  
  return (
    <div>
      <button onClick={() => handleClick("")}>Delete</button>
    </div>
  )
}

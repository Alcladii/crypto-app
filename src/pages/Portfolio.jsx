import React, { useState, useEffect, useContext } from "react";
import { CryptoContext } from "../contexts/cryptoContext";
import { AddAsset } from "../components/AddAsset";
import { PortfolioItem } from "../components/PortfolioItem";

function Portfolio() {
  const {
    portfolioList,
    setPortfolioList,
  } = useContext(CryptoContext);

  const addCoin = (coin, purchaseAmount, purchaseDate, history) => {
    const newPortfolioList = [
      ...portfolioList,
      {
        id: Math.random(),
        coinData: coin,
        purchaseAmount1: purchaseAmount,
        purchaseDate1: purchaseDate,
        historyData: history,
      },
    ];
    setPortfolioList(newPortfolioList);
  };

  return (
    <div>
      <h2>Portfolio</h2>
      <AddAsset
        addCoin={addCoin}
      />
      <PortfolioItem />
    </div>
  );
}

export default Portfolio;
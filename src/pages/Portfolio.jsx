import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
//import { uid } from "uid";
import { useParams } from "react-router-dom";
import { CryptoContext } from "../contexts/cryptoContext";
import { AddAsset } from "../components/AddAsset";

function Portfolio() {
  const coinId = useParams();

  const history = useHistory();

  //I used the "covertToBillion" function in lind 124 and 134
  const {
    convertToBillion,
    getSingleCoinData,
    singleCoin,
    singleCoinIsLoading,
    singleCoinLoadingHasError,
    displayCurrency,
    getCurrencyList,
    currencySymbol,
    retainTwoDigits,
    useLocalState,
    purchasedAmount, 
    setPurchasedAmount,
    portfolioList,
    setPortfolioList,
  } = useContext(CryptoContext);

  //const [portfolioList, setPortfolioList] = useLocalState("portfolioList",[]);
  //const [purchasedAmount, setPurchasedAmount] = useLocalState("")

  const addCoin= (
    coin,
    purchaseAmount,
    purchaseDate,
  ) => {
    const newPortfolioList = [
      ...portfolioList,
      {
        id: uid(),
        coinData: coin,
        purchaseAmount1: purchaseAmount,
        purchaseDate1: purchaseDate,
      }
    ];
    setPortfolioList(newPortfolioList);
  };

  return (
    <div>
      <h2>Portfolio</h2>
      <AddAsset
        portfolioList={portfolioList}
        setPortfolioList={setPortfolioList}
        addCoin={addCoin}
      />
      {/*<DeleteAsset />*/}
    </div>
  );
}

export default Portfolio;

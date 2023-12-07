import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
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
  } = useContext(CryptoContext);

  //const [ portfolioList, setPortfolioList ] = useLocalState("portfolioList", []);
  const [portfolioList, setPortfolioList] = useLocalState("portfolioList",["start"]);

  return (
    <div>
      <h2>Portfolio</h2>
      <AddAsset
        portfolioList={portfolioList}
        setPortfolioList={setPortfolioList}
      />
    </div>
  );
}

export default Portfolio;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { CryptoContext } from "../contexts/cryptoContext";
import { AddAsset } from "../components/AddAsset";
import { PortfolioItem } from "../components/PortfolioItem";

function Portfolio() {
  const { portfolioList, setPortfolioList, darkMode } = useContext(CryptoContext);
  const [fetchingLatestCoinData, setFetchingLatestCoinData] = useState(false);
  const [fetchingLatestCoinDataHasError, setFetchingLatestCoinDataHasError] =
    useState(false);
  const [portfolioListNeedsUpdate, setPortfolioListNeedsUpdate] = useState(false)

  const addCoin = (coin, purchaseAmount, purchaseDate, history) => {
    const newPortfolioList = [
      ...portfolioList,
      {
        id: uuidv4(),
        coinData: coin,
        purchaseAmount1: purchaseAmount,
        purchaseDate1: purchaseDate,
        historyData: history,
      },
    ];
    setPortfolioList(newPortfolioList);
    setPortfolioListNeedsUpdate(true)
  };

  //The functions below make sure every time the portfolio page loads, the data of all coins will be updated to the latest
  //So it gives the accurate profit

  const getLatestCoinDataOnLoad = async () => {   
    try {    
      setFetchingLatestCoinData(true);
      const promises = portfolioList.map((coin) =>
        axios(
          `https://api.coingecko.com/api/v3/coins/${coin.coinData.id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
        )
      );
      const updatedCoinData = await Promise.all(promises);
      updateToLatestCoinDataOnLoad(updatedCoinData);      
      setFetchingLatestCoinData(false);
      setFetchingLatestCoinDataHasError(false);
    } catch (err) {
      setFetchingLatestCoinDataHasError(true);
      setFetchingLatestCoinData(false);
    }
  };

  const updateToLatestCoinDataOnLoad = (coinData) => {
    const newPortfolioList = portfolioList.map((item) => {
      coinData.forEach((item1) => {
        if (item.coinData.id === item1.data.id) {
          item.coinData = item1.data;
        }
      });
      return item;
    });
    setPortfolioList(newPortfolioList);   
  };

  useEffect(() => {
    
    getLatestCoinDataOnLoad();

    const minute = 60000;

    const intervalId = setInterval(() => {
      getLatestCoinDataOnLoad();
    }, minute);
    setPortfolioListNeedsUpdate(false)

    return () => clearInterval(intervalId);
  }, [portfolioListNeedsUpdate]);

  return (
    <div className={`bg-skin-app h-full w-screen ${darkMode ? "" : "theme-light"}` }>
      <div className="max-w-[1440px] mx-auto px-10 py-8 font-space-grotesk  ">
        <div className="flex justify-between">
          <h2 className="text-xl text-skin-portfolio-item-coin-name-total-value-current-price-text-color">Portfolio</h2>
          <AddAsset addCoin={addCoin} />
        </div>
        {fetchingLatestCoinDataHasError && <div>Error Updating Data</div>}
        <PortfolioItem setPortfolioListNeedsUpdate={setPortfolioListNeedsUpdate}/>
      </div>
    </div>
  );
}

export default Portfolio;

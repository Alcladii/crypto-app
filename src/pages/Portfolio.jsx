import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CryptoContext } from "../contexts/cryptoContext";
import { AddAsset } from "../components/AddAsset";
import { PortfolioItem } from "../components/PortfolioItem";

function Portfolio() {
  const { portfolioList, setPortfolioList } = useContext(CryptoContext);
  const [fetchingLatestCoinData, setFetchingLatestCoinData] = useState(false);
  const [fetchingLatestCoinDataHasError, setFetchingLatestCoinDataHasError] =
    useState(false);

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

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-crpyto-background-dark h-full w-screen">
      <div className="max-w-[1440px] mx-auto px-10 py-8 font-space-grotesk  ">
        <div className="flex justify-between">
          <h2 className="text-xl">Portfolio</h2>
          <AddAsset addCoin={addCoin} />
        </div>

        {fetchingLatestCoinDataHasError && <div>Error Updating Data</div>}
        <PortfolioItem />
      </div>
    </div>
  );
}

export default Portfolio;

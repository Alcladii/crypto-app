import { useState, useEffect, useContext, SetStateAction, Dispatch } from "react";
import axios from "axios";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { AddAsset } from "../components/AddAsset";
import { PortfolioItem } from "../components/PortfolioItem";
import { InvestmentCalculator } from "../components/InvestmentCalculator";

type PortfolioProps = {
  loadHomePage: boolean;
  setLoadHomePage: Dispatch<SetStateAction<boolean>>;
};

function Portfolio({loadHomePage, setLoadHomePage}: PortfolioProps) {
  const { portfolioList, setPortfolioList, darkMode } = useContext(
    CryptoContext
  ) as CryptoContextProps;
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const host = import.meta.env.VITE_API_URL

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`${host}/api/portfolio`);
      setPortfolioList(res.data);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    }
  };

  useEffect (() => {
    if (loadHomePage) {
      setLoadHomePage(false);
    }
  },[])

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const addCoin = async (
    coinId: any,
    coin: any,
    purchaseAmount: any,
    purchaseDate: any,
    history: any
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${host}/api/portfolio`, {
        coinId,
        coin,
        purchaseAmount,
        purchaseDate,
        history,
      });

      console.log("Coin saved:", response.data);
      fetchPortfolio();
    } catch (err) {
      console.error("Failed to save coin:", err);
    }
  };

  const getLatestCoinDataEveryMinute = async (portfolioList: any[]) => {
    const uniqueCoinIds: any[] = [];

    try {
      // Get unique coinIds
      portfolioList.forEach((coin) => {
        if (!uniqueCoinIds.includes(coin.coinId)) {
          uniqueCoinIds.push(coin.coinData.id);
        }
      });

      // Fetch updated coinData for each unique coin
      const updateRequests = uniqueCoinIds.map(async (coinId) => {
        const { data: latestCoinData } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
        );

        //Send the latest coinData to your backend to update all entries for this coinId
        await axios.put(
          `${host}/api/portfolio/coin-data/${coinId}`,
          {
            coinData: latestCoinData,
          }
        );
      });

      // Wait for all updates to finish
      await Promise.all(updateRequests);

      // Fetch the updated portfolio list from your backend to update the JSX
      await fetchPortfolio();

      //setIsUpdating(false);
    } catch (error) {
      console.error("Failed to update all coin data:", error);
      //setHasError(true);
      //setIsUpdating(false);
    }
  };

  useEffect(() => {
    const minute = 60000;

    const intervalId = setInterval(() => {
      getLatestCoinDataEveryMinute(portfolioList);
    }, minute);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`bg-skin-app h-full w-screen ${darkMode ? "" : "theme-light"}`}
    >
      <div className="max-w-[1296px] mx-auto px-10 py-8 font-space-grotesk  ">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <h2 className="text-xl mb-3 sm:mb-0 text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
            Portfolio
          </h2>
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <InvestmentCalculator />
            <AddAsset addCoin={addCoin} />
          </div>
        </div>
        {/* {fetchingLatestCoinDataHasError && <div>Error Updating Data</div>} */}
        <PortfolioItem
          //setPortfolioListNeedsUpdate={setPortfolioListNeedsUpdate}
          fetchPortfolio={fetchPortfolio}
        />
      </div>
    </div>
  );
}

export default Portfolio;

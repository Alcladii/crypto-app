import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import "./App.css";
import queryString from "query-string";
import { Home } from "./pages/Homepage";
import Coins from "./components/Coins";
import Portfolio from "./pages/Portfolio";
import CoinPage from "./pages/CoinPage";
import { CryptoContext } from "./contexts/cryptoContext";
import { SearchItemInput } from "./components/SearchInput";
import { ResultList } from "./components/ResultList";
import { CurrencySelector } from "./components/CurrencySelector";
import { CurrencyConverter } from "./components/CurrencyConverter";

const ProgressBarOuter = styled.div`
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.4);
  height: 10px;
  width: 100px;
`;

const ProgressBarInner = styled.div`
  border-radius: 99px;
  height: 10px;
  width: ${(props) => (props.width / 100) * 100}px;
  background: ${(props) => props.background};
`;

export default function App() {
  const {
    useLocalState,
    displayCurrency,
    convertToTrillion,
    convertToBillion,
    retainTwoDigits,
  } = useContext(CryptoContext);
  const [results, setResults] = useState([]);
  const [loadHomePage, setLoadHomePage] = useLocalState("loadHomePage", true);
  const [marketData, setMarketData] = useLocalState("marketData", {});
  const [marketDataIsLoading, setMarketDataIsLoading] = useState(false);
  const [marketDataLoadingHasError, setMarketDataLoadingHasError] =
    useState(false);

  const handleHomePageClick = () => {
    setLoadHomePage(true);
  };

  const handlePortfolioPageClick = () => {
    setLoadHomePage(false);
  };

  const getMarketData = async () => {
    try {
      setMarketDataIsLoading(true);
      const marketData = await axios(`https://api.coingecko.com/api/v3/global`);
      setMarketDataIsLoading(false);
      setMarketData(marketData.data.data);
      setMarketDataLoadingHasError(false);
    } catch (err) {
      setMarketDataLoadingHasError(true);
      setMarketDataIsLoading(false);
    }
  };

  useEffect(() => {
    getMarketData();
  }, []);

  return (
    <div>
      <div className="bg-right-currency-background w-screen">
        <div className="max-w-[1440px] h-20 mx-auto flex items-center justify-center py-8 px-10 font-space-grotesk font-lg">
          <div className="flex items-center w-[70%] justify-between">
            <div className="flex items-center">
              <img
                className="w-8"
                src="https://i.ibb.co/KmV202Q/icons8-coin-50.png"
              />
              Coins&nbsp;&nbsp;
              {marketData && marketData.active_cryptocurrencies}
            </div>
            <div className="flex items-center">
              <img
                className="w-6"
                src="https://i.ibb.co/MSP9pvZ/icons8-exchange-50.png"
              />
              &nbsp; Exchange&nbsp;&nbsp;{marketData && marketData.markets}
            </div>
            <div className="flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-go-up mr-1"></div>
              {marketData &&
                convertToTrillion(marketData.total_market_cap[displayCurrency])}
              T
            </div>
            <div className="flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-go-up mr-1"></div>
              {marketData &&
                convertToBillion(marketData.total_volume[displayCurrency])}
              B
            </div>
            <div className="flex justify-center items-center ">
              <img
                className="w-6"
                src="https://i.ibb.co/CQFkcPj/bitcoin-2.png"
              />
              &nbsp;&nbsp;
              {marketData &&
                retainTwoDigits(marketData.market_cap_percentage.btc)}
              %&nbsp;&nbsp;
              <ProgressBarOuter>
                <ProgressBarInner
                  width={marketData.market_cap_percentage.btc}
                  background={"rgba(247, 147, 26, 1)"}
                ></ProgressBarInner>
              </ProgressBarOuter>
            </div>
            <div className="flex justify-center items-center ">
              <img
                className="w-6"
                src="https://i.ibb.co/W67ZShx/Ethereum-ETH-icon.png"
              />
              &nbsp;&nbsp;
              {marketData &&
                retainTwoDigits(marketData.market_cap_percentage.eth)}
              %&nbsp;&nbsp;
              <ProgressBarOuter>
                <ProgressBarInner
                  width={marketData.market_cap_percentage.eth}
                  background={"rgba(132, 157, 255, 1)"}
                ></ProgressBarInner>
              </ProgressBarOuter>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-crpyto-background-dark w-screen">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between py-8 px-10">
          <div className="font-sans font-bold text-2xl">CryptoFun</div>
          <div className="flex w-80">
            <div
              onClick={handleHomePageClick}
              className="flex items-center justify-center h-10 w-1/2"
            >
              <Link
                to="/"
                className={`${
                  loadHomePage ? "text-white" : "text-slate-600"
                } flex items-center justify-center`}
              >
                <img
                  src={`${
                    loadHomePage
                      ? "https://i.ibb.co/grDz009/icons8-home-50-white.png"
                      : "https://i.ibb.co/tsFhRqS/icons8-home-50.png"
                  }`}
                  className="h-6"
                />
                &nbsp;Home
              </Link>
            </div>
            {/*I put the spaces here just to seperate the buttons before working on the CSS*/}
            &nbsp;&nbsp;
            <div
              onClick={handlePortfolioPageClick}
              className={`${
                !loadHomePage
                  ? "bg-background-selected"
                  : "bg-background-unselected"
              } flex items-center justify-center h-10 w-1/2 r`}
            >
              <Link
                to="/portfolio"
                className={`${
                  !loadHomePage ? "text-white" : "text-slate-600"
                } flex items-center justify-center`}
              >
                <img
                  src={`${
                    !loadHomePage
                      ? "https://i.ibb.co/ZznLBWr/icons8-stack-white.png"
                      : "https://i.ibb.co/rkt2jc6/icons8-stack-64-copy-2.png"
                  }`}
                  className="h-8"
                />
                &nbsp;Portfolio
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <div>
              <SearchItemInput setResults={setResults} />
              <ResultList results={results} />
            </div>
            <div>
              <CurrencySelector />
            </div>
          </div>
        </div>
      </div>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/portfolio">
          <Portfolio />
        </Route>
        <Route exact path="/coin-page/:coinId">
          <CoinPage />
        </Route>
      </Switch>
    </div>
  );
}

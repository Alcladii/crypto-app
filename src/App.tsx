import { useState, useContext, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import "./App.css";
import { Home } from "./pages/Homepage.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import CoinPage from "./pages/CoinPage.tsx";
import { CryptoContext, CryptoContextProps } from "./contexts/cryptoContext";
import { SearchItemInput } from "./components/SearchInput.tsx";
import { CurrencySelector } from "./components/CurrencySelector.tsx";
import {
  ExchangeIcon,
  CoinsIcon,
  GreenDotInMarketData,
  BitcoinIconInMarketData,
  EthereumIconInMarketData,
  AppIcon,
  HomeIcon,
  PortfolioIcon,
  SunIconForLightMode,
  MoonIconForLightMode,
} from "./components/UI/Svg.tsx";

const ProgressBarOuter = styled.div`
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.4);
  height: 10px;
  width: 100px;
`;

const ProgressBarInner = styled.div<{ width: number; background: string }>`
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
    darkMode,
    setDarkMode,
    portfolioList,
    redirectedFromPortfolioPage,
  } = useContext(CryptoContext) as CryptoContextProps;

  const [loadHomePage, setLoadHomePage] = useState<boolean>(
    true
  );
  const [marketData, setMarketData] = useLocalState<any>("marketData", null);
  const [marketDataIsLoading, setMarketDataIsLoading] =
    useState<boolean>(false);
  const [marketDataLoadingHasError, setMarketDataLoadingHasError] =
    useState<boolean>(false);

  const handleHomePageClick = () => {
    setLoadHomePage(true);
  };

  const handlePortfolioPageClick = () => {
    setLoadHomePage(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getMarketData = async () => {
    setMarketDataLoadingHasError(false);
    setMarketDataIsLoading(true);   
    try {     
      const marketDataResponse = await axios.get(
        "https://api.coingecko.com/api/v3/global"
      );
      setMarketDataIsLoading(false);
      setMarketData(marketDataResponse.data.data);
      
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
      <div className="bg-right-currency-background w-screen text-white">
        <div className="max-w-[1296px] h-20 mx-auto flex items-center justify-center py-8 px-10 font-space-grotesk font-lg">
          <div className="flex items-center md:w-[70%] w-full justify-between overflow-x-scroll no-scrollbar">
            <div className="flex items-center text-[rgba(209, 209, 209, 1)] mr-4 xl:mr-0 min-w-32">
              <CoinsIcon />
              <div>
                &nbsp;Coins&nbsp;&nbsp;
                {marketData !== null && marketData.active_cryptocurrencies}
              </div>
            </div>
            <div className="flex items-center mr-4 xl:mr-0 min-w-40">
              <ExchangeIcon />
              <div>
                &nbsp; Exchange&nbsp;&nbsp;
                {marketData !== null && marketData.markets}
              </div>
            </div>
            <div className="flex items-center justify-center mr-4 xl:mr-0 min-w-16">
              <GreenDotInMarketData />
              {marketData !== null &&
                convertToTrillion(marketData.total_market_cap[displayCurrency])}
              T
            </div>
            <div className="flex items-center justify-center mr-4 xl:mr-0 min-w-20">
              <GreenDotInMarketData />
              &nbsp;
              {marketData !== null &&
                convertToBillion(marketData.total_volume[displayCurrency])}
              B
            </div>
            <div className="flex justify-center items-center mr-4 xl:mr-0 min-w-44 ">
              <BitcoinIconInMarketData />
              &nbsp;&nbsp;
              {marketData !== null &&
                retainTwoDigits(marketData.market_cap_percentage.btc)}
              %&nbsp;&nbsp;
              <ProgressBarOuter>
                <ProgressBarInner
                  width={
                    marketData !== null
                      ? marketData.market_cap_percentage.btc
                      : 0
                  }
                  background={"rgba(247, 147, 26, 1)"}
                ></ProgressBarInner>
              </ProgressBarOuter>
            </div>
            <div className="flex justify-center items-center mr-4 xl:mr-0 min-w-44">
              <EthereumIconInMarketData />
              &nbsp;&nbsp;
              {marketData !== null &&
                retainTwoDigits(marketData.market_cap_percentage.eth)}
              %&nbsp;&nbsp;
              <ProgressBarOuter>
                <ProgressBarInner
                  width={
                    marketData !== null
                      ? marketData.market_cap_percentage.eth
                      : 0
                  }
                  background="rgba(132, 157, 255, 1)"
                ></ProgressBarInner>
              </ProgressBarOuter>
            </div>
          </div>
        </div>
      </div>
      <div className={`bg-skin-app w-screen ${darkMode ? "" : "theme-light"}`}>
        <div className="max-w-[1296px] mx-auto flex items-center justify-between py-8 px-5 sm:px-10">
          <div
            className={`flex items-center font-sans font-bold text-2xl text-skin-selected-button-app-name-text`}
          >
            <AppIcon />
            <span className="ml-2 hidden sm:block">CryptoFun</span>
          </div>
          <div className="w-40 sm:w-60 lg:w-68 xl:w-80 flex rounded-md p-1 sm:p-0 bg-skin-home-porfolio-button-wrapper-background-color sm:bg-transparent">
            <div
              className={`flex items-center justify-center h-10 w-[30%] sm:w-1/2 lg:w-1/2  xl:w-1/2 mr-0.5 rounded-md ${
                loadHomePage
                  ? "bg-skin-coins-converter-selected-button-background"
                  : "bg-skin-coins-converter-unselected-button-background"
              }`}
            >
              <Link
                to="/"
                onClick={handleHomePageClick}
                className={`${
                  loadHomePage
                    ? "text-skin-selected-button-app-name-text"
                    : "text-skin-unselected-button-text"
                } flex items-center justify-center`}
              >
                <HomeIcon loadHomePage={loadHomePage} />
                <span className="hidden sm:block">&nbsp;Home</span>
              </Link>
            </div>
            <div
              className={`flex items-center justify-center h-10 w-[70%] sm:w-1/2 lg:w-1/2 xl:w-1/2 ml-0.5 rounded-md ${
                !loadHomePage
                  ? "bg-skin-coins-converter-selected-button-background"
                  : "bg-skin-coins-converter-unselected-button-background"
              }`}
            >
              <Link
                to="/portfolio"
                onClick={handlePortfolioPageClick}
                className={`${
                  !loadHomePage
                    ? "text-skin-selected-button-app-name-text"
                    : "text-skin-unselected-button-text"
                } flex items-center justify-center`}
              >
                <PortfolioIcon loadHomePage={loadHomePage} />
                &nbsp;Portfolio
              </Link>
            </div>
          </div>
          <div className="flex items-center md:space-x-5">
            <div className="flex flex-col relative">
              <SearchItemInput />
            </div>
            <div className="mr-1 md:mr-0">
              <CurrencySelector />
            </div>
            <button
              className={`w-10 h-10 rounded-md bg-skin-unselected-button-bg flex justify-center items-center ${
                darkMode ? "" : "theme-light"
              }`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <SunIconForLightMode /> : <MoonIconForLightMode />}
            </button>
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route
          path="/coin-page/:coinId"
          element={
            redirectedFromPortfolioPage ? (
              <CoinPage portfolioList={portfolioList} />
            ) : (
              <CoinPage />
            )
          }
        />
      </Routes>
    </div>
  );
}

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
    darkMode,
    setDarkMode,
    handleSearchParams,
    changeSearchParams,
    queryParams,
  } = useContext(CryptoContext);

  const [results, setResults] = useState([]);
  const [loadHomePage, setLoadHomePage] = useLocalState("loadHomePage", true);
  const [marketData, setMarketData] = useLocalState("marketData", null);
  const [marketDataIsLoading, setMarketDataIsLoading] = useState(false);
  const [marketDataLoadingHasError, setMarketDataLoadingHasError] =
    useState(false);

  const handleHomePageClick = () => {
    setLoadHomePage(true);
    changeSearchParams("load_home_page", "true");
  };

  const handlePortfolioPageClick = () => {
    setLoadHomePage(false);
    changeSearchParams("load_home_page", "false");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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

  useEffect(() => {
    handleSearchParams("load_home_page", "true");
  }, []);

  const loadHomePageInUrl = queryParams.load_home_page === "true";

  return (
    <div>
      <div className="bg-right-currency-background w-screen text-white">
        <div className="max-w-[1296px]  min-w-[1200px] h-20 mx-auto flex items-center justify-center py-8 px-10 font-space-grotesk font-lg">
          <div className="flex items-center w-[75%] justify-between">
            <div className="flex items-center text-[rgba(209, 209, 209, 1)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(255, 255, 255, 1)"
                class="w-6 h-6"
              >
                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                  clip-rule="evenodd"
                />
              </svg>
              &nbsp; Coins&nbsp;&nbsp;
              {marketData!==null && marketData.active_cryptocurrencies}
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(255, 255, 255, 1)"
                class="w-6 h-6"
              >
                <path d="M16.5 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3v-6A4.5 4.5 0 0 1 10.5 6h6Z" />
                <path d="M18 7.5a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-7.5a3 3 0 0 1-3-3v-7.5a3 3 0 0 1 3-3H18Z" />
              </svg>
              &nbsp; Exchange&nbsp;&nbsp;{marketData!==null  && marketData.markets}
            </div>
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                viewBox="0 0 1024 1024"
              >
                <title>circle</title>
                <circle
                  cx="512"
                  cy="512"
                  r="256"
                  fill="rgba(1, 241, 227, 1)"
                  fill-rule="evenodd"
                />
              </svg>
              &nbsp;
              {marketData!==null &&
                convertToTrillion(marketData.total_market_cap[displayCurrency])}
              T
            </div>
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                viewBox="0 0 1024 1024"
              >
                <title>circle</title>
                <circle
                  cx="512"
                  cy="512"
                  r="256"
                  fill="rgba(1, 241, 227, 1)"
                  fill-rule="evenodd"
                />
              </svg>
              &nbsp;
              {marketData!==null &&
                convertToBillion(marketData.total_volume[displayCurrency])}
              B
            </div>
            <div className="flex justify-center items-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:xodm="http://www.corel.com/coreldraw/odm/2003"
                xml:space="preserve"
                width="24px"
                height="24px"
                version="1.1"
                shape-rendering="geometricPrecision"
                text-rendering="geometricPrecision"
                image-rendering="optimizeQuality"
                fill-rule="evenodd"
                clip-rule="evenodd"
                viewBox="0 0 4091.27 4091.73"
              >
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer" />
                  <g id="_1421344023328">
                    <path
                      fill="#F7931A"
                      fill-rule="nonzero"
                      d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"
                    />
                    <path
                      fill="white"
                      fill-rule="nonzero"
                      d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"
                    />
                  </g>
                </g>
              </svg>
              &nbsp;&nbsp;
              {marketData!==null &&
                retainTwoDigits(marketData.market_cap_percentage.btc)}
              %&nbsp;&nbsp;
              <ProgressBarOuter>
                <ProgressBarInner
                  width={marketData!==null && marketData.market_cap_percentage.btc}
                  background={"rgba(247, 147, 26, 1)"}
                ></ProgressBarInner>
              </ProgressBarOuter>
            </div>
            <div className="flex justify-center items-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 32 32"
              >
                <g fill="none" fill-rule="evenodd">
                  <circle cx="16" cy="16" r="16" fill="#627EEA" />
                  <g fill="#FFF" fill-rule="nonzero">
                    <path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
                    <path d="M16.498 4L9 16.22l7.498-3.35z" />
                    <path
                      fill-opacity=".602"
                      d="M16.498 21.968v6.027L24 17.616z"
                    />
                    <path d="M16.498 27.995v-6.028L9 17.616z" />
                    <path
                      fill-opacity=".2"
                      d="M16.498 20.573l7.497-4.353-7.497-3.348z"
                    />
                    <path
                      fill-opacity=".602"
                      d="M9 16.22l7.498 4.353v-7.701z"
                    />
                  </g>
                </g>
              </svg>
              &nbsp;&nbsp;
              {marketData!==null &&
                retainTwoDigits(marketData.market_cap_percentage.eth)}
              %&nbsp;&nbsp;
              <ProgressBarOuter>
                <ProgressBarInner
                  width={marketData!==null && marketData.market_cap_percentage.eth}
                  background="rgba(132, 157, 255, 1)"
                ></ProgressBarInner>
              </ProgressBarOuter>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bg-skin-app w-screen ${
          darkMode ? "" : "theme-light"
        } `}
      >
        <div className="max-w-[1296px] mx-auto flex items-center justify-between py-8 px-10">
          <div
            className={`font-sans font-bold text-2xl text-skin-selected-button-app-name-text`}
          >
            CryptoFun
          </div>
          <div className="flex w-80">
            <div
              onClick={handleHomePageClick}
              className="flex items-center justify-center h-10 w-1/2"
            >
              <Link
                to="/"
                className={`${
                  loadHomePageInUrl
                    ? "text-skin-selected-button-app-name-text"
                    : "text-skin-unselected-button-text"
                } flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    darkMode
                      ? loadHomePageInUrl
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(255, 255, 255, 0.5)"
                      : loadHomePageInUrl
                      ? "rgba(53, 53, 112, 1)"
                      : "rgba(161, 161, 170, 1)"
                  }
                  class="w-6 h-6"
                >
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
                &nbsp;Home
              </Link>
            </div>
            <div
              onClick={handlePortfolioPageClick}
              className="flex items-center justify-center h-10 w-1/2"
            >
              <Link
                to="/portfolio"
                className={`${
                  !loadHomePageInUrl
                    ? "text-skin-selected-button-app-name-text"
                    : "text-skin-unselected-button-text"
                } flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    darkMode
                      ? !loadHomePageInUrl
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(255, 255, 255, 0.5)"
                      : !loadHomePageInUrl
                      ? "rgba(53, 53, 112, 1)"
                      : "rgba(161, 161, 170, 1)"
                  }
                  class="w-6 h-6"
                >
                  <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
                  <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
                  <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
                </svg>
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
            <button
              className={`w-10 h-10 rounded-md bg-skin-unselected-button-bg flex justify-center items-center ${
                darkMode ? "" : "theme-light"
              }`}
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="rgba(255, 255, 255, 1)"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="rgba(66, 66, 134, 1)"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              )}
            </button>
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

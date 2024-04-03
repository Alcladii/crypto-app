import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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

export default function App() {
  const { useLocalState, darkMode, setDarkMode } = useContext(CryptoContext);
  const [results, setResults] = useState([]);
  const [loadHomePage, setLoadHomePage] = useLocalState("loadHomePage", true);

  const handleHomePageClick = () => {
    setLoadHomePage(true);
  };

  const handlePortfolioPageClick = () => {
    setLoadHomePage(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <div className={`bg-skin-app w-screen ${darkMode ? "" : "theme-light"} `}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between py-8 px-10">
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
                  loadHomePage
                    ? "text-skin-selected-button-app-name-text"
                    : "text-skin-unselected-button-text"
                } flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    darkMode
                      ? loadHomePage
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(255, 255, 255, 0.5)"
                      : loadHomePage
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
                  !loadHomePage
                    ? "text-skin-selected-button-app-name-text"
                    : "text-skin-unselected-button-text"
                } flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    darkMode
                      ? !loadHomePage
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(255, 255, 255, 0.5)"
                      : !loadHomePage
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

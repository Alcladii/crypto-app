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
  const { useLocalState } = useContext(CryptoContext);
  const [results, setResults] = useState([]);
  const [loadHomePage, setLoadHomePage] = useLocalState("loadHomePage", true);

  const handleHomePageClick = () => {
    setLoadHomePage(true);
  };

  const handlePortfolioPageClick = () => {
    setLoadHomePage(false);
  };

  return (
    <div>
      <div className="bg-crpyto-background-dark w-screen" >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 px-10 border white">
          <div className="font-sans font-bold text-2xl">
            CryptoFun
          </div>
          <div className="flex w-80">
            <div
              onClick={handleHomePageClick}
              className="flex items-center justify-center h-10 w-1/2"
              //{`${loadHomePage ? "bg-background-selected" : "bg-background-unselected"}`}
            >
              <Link to="/" className={`${loadHomePage ? "text-white" : "text-slate-600"} flex items-center justify-center`}>                
                <img src={`${loadHomePage ? "https://i.ibb.co/grDz009/icons8-home-50-white.png" : "https://i.ibb.co/tsFhRqS/icons8-home-50.png"}`} className="h-6"/>
                &nbsp;Home
              </Link>
            </div>
            {/*I put the spaces here just to seperate the buttons before working on the CSS*/}
            &nbsp;&nbsp;
            <div
              onClick={handlePortfolioPageClick}
              className={`${!loadHomePage ? "bg-background-selected" : "bg-background-unselected"} flex items-center justify-center h-10 w-1/2 r`}
            >
              <Link to="/portfolio" className={`${!loadHomePage ? "text-white" : "text-slate-600"} flex items-center justify-center`}>  
                <img src={`${!loadHomePage ? "https://i.ibb.co/ZznLBWr/icons8-stack-white.png" : "https://i.ibb.co/rkt2jc6/icons8-stack-64-copy-2.png"}`} className="h-8"/>
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

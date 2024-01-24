import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import queryString from "query-string";
import { Home } from "./pages/Homepage"
import Coins from "./components/Coins";
import Portfolio from "./pages/Portfolio";
import CoinPage from "./pages/CoinPage";
import { CryptoContext } from "./contexts/cryptoContext";
import { SearchItemInput } from "./components/SearchInput";
import { ResultList } from "./components/ResultList";
import { CurrencySelector } from "./components/CurrencySelector";
import { CurrencyConverter } from "./components/CurrencyConverter"

//google how to make a query string state custom hook
export default function App() {
  
  const { useLocalState } = useContext(CryptoContext);
  const [results, setResults] = useState([]);
  const [loadHomePage, setLoadHomePage] = useLocalState("loadHomePage", true);

  const handleHomePageClick = () => {  
    setLoadHomePage(true);
  };

  const handlePortfolioPageClick = () => {
    setLoadHomePage(false)
  }

  return (
    //<Router>
        <div>
          <nav>
            <div>
              <ul>
                <button onClick={handleHomePageClick} className={`${loadHomePage? "home-Or-Portfolio-Selected" : ""}`}>
                  <Link to="/">Home</Link>
                </button>
                {/*I put the spaces here just to seperate the buttons before working on the CSS*/}
                &nbsp;&nbsp;
                <button onClick={handlePortfolioPageClick} className={`${!loadHomePage ? "home-Or-Portfolio-Selected" : ""}`}>
                  <Link to="/portfolio">Portfolio</Link>
                </button>
              </ul>
              <div className="search-wrapper">
                <SearchItemInput setResults={setResults} />
                <ResultList results={results} />
              </div>
              <div>
                <CurrencySelector />
              </div>
            </div>
          </nav>
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
    //</Router>
  );
}

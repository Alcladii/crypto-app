import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import queryString from "query-string";
import { Home } from "./pages/Homepage"
import Coins from "./pages/Coins";
import Portfolio from "./pages/Portfolio";
import CoinPage from "./pages/CoinPage";
import { CryptoProvider } from "./contexts/cryptoContext";
import { SearchItemInput } from "./components/SearchInput";
import { ResultList } from "./components/ResultList";
import { CurrencySelector } from "./components/CurrencySelector";
import { CurrencyConverter } from "./components/CurrencyConverter"


export default function App() {
  const [results, setResults] = useState([]);

  return (
    <Router>
      <CryptoProvider>
        <div>
          <nav>
            <div>
              <ul>
                <button>
                  <Link to="/">Home</Link>
                </button>
                {/*I put the spaces here just to seperate the buttons before working on the CSS*/}
                &nbsp;&nbsp;
                <button>
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
              {/*<Coins />*/}
            </Route>
            <Route exact path="/portfolio">
              <Portfolio />
            </Route>
            <Route exact path="/coins">
              <Coins />
            </Route>
            <Route exact path="/currency-converter">
              <CurrencyConverter />
            </Route>
            <Route exact path="/coin-page/:coinId">
              <CoinPage />
            </Route>
          </Switch>
        </div>
      </CryptoProvider>
    </Router>
  );
}

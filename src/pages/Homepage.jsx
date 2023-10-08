import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { CryptoProvider } from "../contexts/cryptoContext";
import Coins from "./Coins";
import Portfolio from "./Portfolio";
import CoinPage from "./CoinPage";
import { CurrencyConverter } from "../components/CurrencyConverter";

export const Home = () => {
  const [loadCoins, setLoadCoins] = useState(false);

  return (
    <Router>
      {/*<CryptoProvider>*/}
        <div>
          <nav>
            <div>
              <ul>
                <button>
                  <Link to="/coins">Coins</Link>
                </button>
                {/*I put the spaces here just to seperate the buttons before working on the CSS*/}
                 &nbsp;&nbsp;
                <button>
                  <Link to="/currency-converter">Currency Converter</Link>
                </button>
              </ul>
            </div>
          </nav>
          <Switch>
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
      {/*</CryptoProvider>*/}
    </Router>
  );
};

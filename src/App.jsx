import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Coins from "./pages/Coins";
import Portfolio from "./pages/Portfolio";
import CoinPage from "./pages/CoinPage";
import queryString from "query-string";
import { SearchItemInput } from "./components/SearchInput";
import { ResultList } from "./components/ResultList";
import { CurrencySelector } from "./components/CurrencySelector";
import { CryptoProvider } from "./contexts/cryptoContext";

let urlObject = {
  user: "sam",
  access: true,
  role: ["admin", "editor", "manager"],
};

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
                  <Link to="/coins">Coins</Link>
                </button>
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
            <Route exact path="/coins">
              <Coins />
            </Route>
            <Route exact path="/portfolio">
              <Portfolio />
            </Route>
            <Route
              exact
              path="/coin-page/:coinId">
              {/*component={(props) => <CoinPage {...props} />}*/}
              <CoinPage />
            </Route >
          </Switch>
        </div>
      </CryptoProvider>
    </Router>
  );
}

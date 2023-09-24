import { CryptoContext } from "../contexts/cryptoContext";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const CoinPage = () => {

  const coinId = useParams()

  const {
    convertToBillion,
    displayCurrency,
    currencySymbol,
    getCurrencyList,
  } = useContext(CryptoContext)

  const [singleCoin, setSingleCoin] = useState({});
  const [singleCoinIsLoading, setSingleCoinIsLoading] = useState(false);
  const [singleCoinLoadingHasError, setSingleCoinLoadingHasError] =
    useState(false);

  const getSingleCoinData = async (item) => {
    try {
      setSingleCoin({});
      setSingleCoinIsLoading(true);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSingleCoinIsLoading(false);
      setSingleCoin(singleCoinData.data);
      setSingleCoinLoadingHasError(false);
    } catch (err) {
      setSingleCoinLoadingHasError(true);
      setSingleCoinIsLoading(false);
    }
  };

  useEffect(() => {
    getSingleCoinData(coinId.coinId);
  }, [coinId]);

  useEffect(() => {
    getCurrencyList() 
  }, [])

  
  return (
    <div>
      {singleCoinIsLoading && <div>Loading Coin</div>}
      <div className="coin-page-columns">
        <div className="coin-page-column-1">
          {/*<img src={(singleCoin.image).length > 0 && singleCoin.image.small} />*/}
          {singleCoin.image && <img src={singleCoin.image.small} />}
          <div>
            <span>{singleCoin.name}</span>&nbsp;
            {singleCoin.symbol && (
              <span>({singleCoin.symbol.toUpperCase()})</span>
            )}
          </div>
          {singleCoin.links && (
            <a href={singleCoin.links.homepage[0]}>{singleCoin.links.homepage[0]}</a>
          )}
        </div>
        <div className="coin-page-column-2">
          {singleCoin.market_data && (
            <div>{currencySymbol}{singleCoin.market_data.current_price[displayCurrency].toLocaleString()}</div>
          )}
          {singleCoin.market_data && (
            <div>{singleCoin.market_data.price_change_percentage_24h.toFixed(2)}%</div>
          )}  
          <div className="ath-atl-container">
            <div className="ath-column">ATH:
              {singleCoin.market_data && (
                <div>{currencySymbol}{singleCoin.market_data.ath[displayCurrency].toLocaleString()}</div>
              )}
              {singleCoin.market_data && (
                <div>{singleCoin.market_data.ath_change_percentage[displayCurrency].toFixed(2)}%</div>
              )}
              {singleCoin.market_data && (
                <div>{new Date(singleCoin.market_data.ath_date[displayCurrency]).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}</div>
              )}
            
            </div>
            <div className="atl-column">ATL:
            {singleCoin.market_data && (
                <div>{currencySymbol}{singleCoin.market_data.atl[displayCurrency].toLocaleString()}</div>
              )}
              {singleCoin.market_data && (
                <div>{singleCoin.market_data.atl_change_percentage[displayCurrency].toFixed(2)}%</div>
              )}
              {singleCoin.market_data && (
                <div>{new Date(singleCoin.market_data.atl_date[displayCurrency]).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}</div>
              )}
            </div>
          </div>    
        </div>
        <div className="coin-page-column-3">
          {singleCoin.market_data && <div>Market Cap: {currencySymbol}{convertToBillion(singleCoin.market_data.market_cap[displayCurrency])}B&nbsp;&nbsp;{singleCoin.market_data.price_change_percentage_24h.toFixed(2)}%</div>}
          {singleCoin.market_data && <div>Fully Diluted Valuation: {currencySymbol}{convertToBillion(singleCoin.market_data.fully_diluted_valuation[displayCurrency])}B</div>}
          <div>Volume 24h: </div>
          <div>Volume/Market: </div>
          <div>Total Volume: </div>
          <div>Circulating Supply: </div>
          <div>Max Supply: </div>
        </div>
      </div>
      {singleCoinLoadingHasError && <div>Error in fetching Coin</div>}
    </div>
  );
};

export default CoinPage;

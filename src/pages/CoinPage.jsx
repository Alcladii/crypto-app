import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const CoinPage = ({ match }) => {
  const [singleCoin, setSingleCoin] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getSingleCoinData = async () => {
    try {
      setIsLoading(true)
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${match.params.coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      //console.log("from singleCoinData.data", singleCoinData.data)
      setIsLoading(false);
      setSingleCoin(singleCoinData.data);
      setHasError(false)
    } catch (err) {
      //console.log("Error in Fetching Data");
      setHasError(true)
      setIsLoading(false)
    }
  };

  //console.log(singleCoin)

  useEffect(() => {
    getSingleCoinData();
  }, [match.params.coinId]);

  return (
    <div>
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
            <div>${(singleCoin.market_data.current_price.usd).toLocaleString()}</div>
          )}
          {singleCoin.market_data && (
            <div>{singleCoin.market_data.price_change_percentage_24h.toFixed(2)}%</div>
          )}  
          <div className="ath-atl-container">
            <div className="ath-column">ATH:
              {singleCoin.market_data && (
                <div>${singleCoin.market_data.ath.usd.toLocaleString()}</div>
              )}
              {singleCoin.market_data && (
                <div>{singleCoin.market_data.ath_change_percentage.usd.toFixed(2)}%</div>
              )}
              {singleCoin.market_data && (
                <div>{new Date(singleCoin.market_data.ath_date.usd).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}</div>
              )}
            
            </div>
            <div className="atl-column">ATL:
            {singleCoin.market_data && (
                <div>${singleCoin.market_data.atl.usd.toLocaleString()}</div>
              )}
              {singleCoin.market_data && (
                <div>{singleCoin.market_data.atl_change_percentage.usd.toFixed(2)}%</div>
              )}
              {singleCoin.market_data && (
                <div>{new Date(singleCoin.market_data.atl_date.usd).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}</div>
              )}
            </div>
          </div>    
        </div>
        <div className="coin-page-column-3">
          {singleCoin.market_data && <div>Market Cap: ${(singleCoin.market_data.market_cap.usd/1000000000).toFixed(2)}B&nbsp;&nbsp;{singleCoin.market_data.price_change_percentage_24h.toFixed(2)}%</div>}
          {singleCoin.market_data && <div>Fully Diluted Valuation: ${(singleCoin.market_data.fully_diluted_valuation.usd/1000000000).toFixed(2)}B</div>}
          <div>Volume 24h: </div>
          <div>Volume/Market: </div>
          <div>Total Volume: </div>
          <div>Circulating Supply: </div>
          <div>Max Supply: </div>
        </div>
      </div>
    </div>
  );
};

export default CoinPage;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { CryptoContext } from "../contexts/cryptoContext";

const CoinPage = () => {
  const coinId = useParams();

  const { convertToBillion } = useContext(CryptoContext);

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

  return (
    <div>
      <div className="coin-page-columns">
        <div className="coin-page-column-1">
          {singleCoin.image && <img src={singleCoin.image.small} />}
          <div>
            <span>{singleCoin.name}</span>&nbsp;
            {singleCoin.symbol && (
              <span>({singleCoin.symbol.toUpperCase()})</span>
            )}
          </div>
          {singleCoin.links && (
            <a href={singleCoin.links.homepage[0]}>
              {singleCoin.links.homepage[0]}
            </a>
          )}
        </div>
        <div className="coin-page-column-2">
          {singleCoin.market_data && (
            <div>
              ${singleCoin.market_data.current_price.usd.toLocaleString()}
            </div>
          )}
          {singleCoin.market_data && (
            <div>
              {singleCoin.market_data.price_change_percentage_24h.toFixed(2)}%
            </div>
          )}
          <div className="ath-atl-container">
            <div className="ath-column">
              ATH:
              {singleCoin.market_data && (
                <div>${singleCoin.market_data.ath.usd.toLocaleString()}</div>
              )}
              {singleCoin.market_data && (
                <div>
                  {singleCoin.market_data.ath_change_percentage.usd.toFixed(2)}%
                </div>
              )}
              {singleCoin.market_data && (
                <div>
                  {new Date(
                    singleCoin.market_data.ath_date.usd
                  ).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>
            <div className="atl-column">
              ATL:
              {singleCoin.market_data && (
                <div>${singleCoin.market_data.atl.usd.toLocaleString()}</div>
              )}
              {singleCoin.market_data && (
                <div>
                  {singleCoin.market_data.atl_change_percentage.usd.toFixed(2)}%
                </div>
              )}
              {singleCoin.market_data && (
                <div>
                  {new Date(
                    singleCoin.market_data.atl_date.usd
                  ).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="coin-page-column-3">
          {singleCoin.market_data && (
            <div>
              Market Cap: $
              {convertToBillion(singleCoin.market_data.market_cap.usd)}
              B&nbsp;&nbsp;
              {singleCoin.market_data.price_change_percentage_24h.toFixed(2)}%
            </div>
          )}
          {singleCoin.market_data && (
            <div>
              Fully Diluted Valuation: $
              {convertToBillion(
                singleCoin.market_data.fully_diluted_valuation.usd
              )}
              B
            </div>
          )}
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

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { CryptoContext } from "../contexts/cryptoContext";

const CoinPage = () => {
  const coinId = useParams();

  const { convertToBillion, getSingleCoinData, singleCoin, displayCurrency, getCurrencyList, currencySymbol } = useContext(CryptoContext);

  useEffect(() => {
    getSingleCoinData(coinId.coinId);
  }, [coinId]);

  useEffect(() => {
    getCurrencyList();
  }, []);

  return (
    <div>
      {singleCoinIsLoading && <div>Loading Coin</div>}
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
              {currencySymbol}
              {singleCoin.market_data.current_price[
                displayCurrency
              ].toLocaleString()}
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
                <div>
                  {currencySymbol}
                  {singleCoin.market_data.ath[displayCurrency].toLocaleString()}
                </div>
              )}
              {singleCoin.market_data && (
                <div>
                  {singleCoin.market_data.ath_change_percentage[
                    displayCurrency
                  ].toFixed(2)}
                  %
                </div>
              )}
              {singleCoin.market_data && (
                <div>
                  {new Date(
                    singleCoin.market_data.ath_date[displayCurrency]
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
                <div>
                  {currencySymbol}
                  {singleCoin.market_data.atl[displayCurrency].toLocaleString()}
                </div>
              )}
              {singleCoin.market_data && (
                <div>
                  {singleCoin.market_data.atl_change_percentage[
                    displayCurrency
                  ].toFixed(2)}
                  %
                </div>
              )}
              {singleCoin.market_data && (
                <div>
                  {new Date(
                    singleCoin.market_data.atl_date[displayCurrency]
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
              Market Cap: {currencySymbol}
              {convertToBillion(
                singleCoin.market_data.market_cap[displayCurrency]
              )}
              B&nbsp;&nbsp;
              {singleCoin.market_data.price_change_percentage_24h.toFixed(2)}%
            </div>
          )}
          {singleCoin.market_data && (
            <div>
              Fully Diluted Valuation: {currencySymbol}
              {convertToBillion(
                singleCoin.market_data.fully_diluted_valuation[displayCurrency]
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
      {singleCoinLoadingHasError && <div>Error in fetching Coin</div>}
    </div>
  );
};

export default CoinPage;

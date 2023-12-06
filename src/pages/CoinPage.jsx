import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { CryptoContext } from "../contexts/cryptoContext";

const ProgressBarOuter = styled.div`
  border: 1px solid black;
  border-radius: 99px;
  background: #a505d0;
  height: 10px;
  width: 150px;
`;

const ProgressBarInner = styled.div`
  border-radius: 99px;
  height: 10px;
  width: ${(props) => props.width * 1.5}px;
  background: purple;
`;

const CoinPage = () => {
  const coinId = useParams();

  const history = useHistory();

  //I used the "covertToBillion" function in lind 124 and 134
  const {
    convertToBillion,
    getSingleCoinData,
    singleCoin,
    singleCoinIsLoading,
    singleCoinLoadingHasError,
    displayCurrency,
    getCurrencyList,
    currencySymbol,
    retainTwoDigits,
  } = useContext(CryptoContext);

  useEffect(() => {
    getSingleCoinData(coinId.coinId);
  }, [coinId.coinId]);

  useEffect(() => {
    getCurrencyList();
  }, []);

  const handleClick = () => {
    history.push("/");
  };

  const htmlContent = singleCoin.description && singleCoin.description.en;

  console.log(htmlContent);

  const createMarkup = (htmlContent) => {
    return {
      __html:
        htmlContent &&
        htmlContent.replace(
          /<a href="(.*?)">(.*?)<\/a>/g,
          '<a href="$1" target="_blank">$2</a>'
        ),
    };
  };

  return (
    <div>
      <button onClick={handleClick}>Back to Coins</button>
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
          {singleCoin.market_data && (
            <div>
              Volume 24h: {currencySymbol}
              {convertToBillion(
                singleCoin.market_data.market_cap_change_24h_in_currency[
                  displayCurrency
                ]
              )}
              B
            </div>
          )}
          {singleCoin.market_data && (
            <div>
              Volume/Market:{" "}
              {(
                singleCoin.market_data.total_volume[displayCurrency] /
                singleCoin.market_data.market_cap[displayCurrency]
              ).toFixed(5)}
            </div>
          )}

          {singleCoin.market_data && (
            <div>
              Total Volume:{" "}
              {singleCoin.market_data.total_volume[
                displayCurrency
              ].toLocaleString()}
              BTC
            </div>
          )}
          {singleCoin.market_data && (
            <div>
              Circulating Supply:{" "}
              {singleCoin.market_data.circulating_supply.toLocaleString()}
              BTC
            </div>
          )}
          {singleCoin.market_data &&
            (singleCoin.market_data.max_supply !== null ? (
              <div>
                Max Supply: {singleCoin.market_data.max_supply.toLocaleString()}
                BTC
              </div>
            ) : (
              <div> Max Supply: N/A</div>
            ))}
          {singleCoin.market_data && (
            <div>
              {retainTwoDigits(
                (singleCoin.market_data.total_volume[displayCurrency] /
                  singleCoin.market_data.market_cap[displayCurrency]) *
                  100
              )}
              %
            </div>
          )}
          {singleCoin.market_data && (
            <ProgressBarOuter>
              <ProgressBarInner
                width={
                  (singleCoin.market_data.total_volume[displayCurrency] /
                    singleCoin.market_data.market_cap[displayCurrency]) *
                  100
                }
              ></ProgressBarInner>
            </ProgressBarOuter>
          )}
        </div>
      </div>
      {/*<div>{singleCoin && <div>{singleCoin.description.en}</div>}</div>*/}
      <div>
        {singleCoin && (
          <div dangerouslySetInnerHTML={createMarkup(htmlContent)} />
        )}
      </div>
      <div>
        {singleCoin.links &&
          singleCoin.links.homepage.map((item) => {
            if (item !== "") {
              return <div>{item}</div>;
            }
          })}
      </div>
      <div>{singleCoin.links && singleCoin.links.blockchain_site.map((item) => {
        if (item.includes("blockchair")){
          return <div>{item}</div>
        }
      })}</div>
      <div>{singleCoin.links && singleCoin.links.blockchain_site.map((item) => {
        if (item.includes("tokenview")){
          return <div>{item}</div>
        }
      })}</div>
      {singleCoinLoadingHasError && <div>Error in fetching Coin</div>}
    </div>
  );
};

export default CoinPage;

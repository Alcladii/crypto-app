import react, { useContext, useEffect } from "react";
import styled from "styled-components";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { EditAsset } from "../components/EditAsset";

const CoinTag = styled.img`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
  width: ${(props) => props.width * 150}px;
  background: purple;
`;

export const PortfolioItem = () => {
  const {
    displayCurrency,
    currencySymbol,
    retainTwoDigits,
    portfolioList,
    setPortfolioList,
  } = useContext(CryptoContext);

  const handleClick = (id) => {
    const newPortfolioList = portfolioList.filter((item) => item.id !== id);
    setPortfolioList(newPortfolioList);
  };

  const profitPercentage = (item) => {
    return retainTwoDigits(
      ((item.coinData.market_data.current_price[displayCurrency] -
        item.historyData.market_data.current_price[displayCurrency]) /
        item.historyData.market_data.current_price[displayCurrency]) *
        100
    );
  };

  return (
    <div>
      {portfolioList.length !== 0 &&
        portfolioList.map((item) => (
          <div className="flex flex-col w-full border">
            <div className="flex">
              <div className="w-[30%] bg-line-bar-chart-background rounded-l-lg">
                <div className="flex items-center py-3">
                  <div>
                    <CoinTag src={item.coinData.image.large} />
                  </div>
                  &nbsp;&nbsp;
                  <div className="text-xl font-semibold">
                    {item.coinData.name}({item.coinData.symbol.toUpperCase()})
                  </div>
                  &nbsp;&nbsp;
                </div>
                <div className="p-2 pb-3">
                  <div className="text-base">Total Value</div>
                  <div className="flex items-center">
                    <div className="text-2xl font-semibold py-2">
                      {currencySymbol}
                      {retainTwoDigits(
                        item.coinData.market_data.current_price[
                          displayCurrency
                        ] * Number(item.purchaseAmount1)
                      )}
                      &nbsp;{displayCurrency.toUpperCase()}
                    </div>
                    <div className="mx-3">{profitPercentage(item)}%</div>
                  </div>
                  <div className="text-sm">Purchased&nbsp;{item.purchaseDate1}</div>
                </div>
               
                {/*<div>Last Updated&nbsp;{item.coinData.last_updated}</div>*/}
              </div>
              <div className="w-[75%] border flex bg-button-unselected-search-bar-background rounded-r-lg">
                <div className="w-[50%] border">
                  <div>
                    <div>
                      {currencySymbol}
                      {item.coinData.market_data.current_price[displayCurrency]}
                    </div>
                    <div>Current Price</div>
                  </div>
                  <div>
                    <div className="portfolio-item-market-cap-volume-wrapper">
                      <div>
                        {retainTwoDigits(
                          (item.coinData.market_data.total_volume[
                            displayCurrency
                          ] /
                            item.coinData.market_data.market_cap[
                              displayCurrency
                            ]) *
                            100
                        )}
                        %
                      </div>{" "}
                      &nbsp;&nbsp;
                      <div>
                        <ProgressBarOuter>
                          <ProgressBarInner
                            width={
                              item.coinData.market_data.total_volume[
                                displayCurrency
                              ] /
                              item.coinData.market_data.market_cap[
                                displayCurrency
                              ]
                            }
                          ></ProgressBarInner>
                        </ProgressBarOuter>
                      </div>
                    </div>
                    <div>Market Cap vs Volume</div>
                  </div>
                </div>
                <div className="w-[50%] border">
                  <div>
                    <div>
                      {retainTwoDigits(
                        item.coinData.market_data.price_change_percentage_24h
                      )}
                      %
                    </div>
                    <div>24h%</div>
                  </div>
                  <div>
                    <div>
                      {retainTwoDigits(
                        item.coinData.market_data.circulating_supply /
                          item.coinData.market_data.total_supply
                      )}
                      %
                    </div>
                    <div>Circ Supply vs Max Supply</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end my-3">
              <button onClick={() => handleClick(item.id)}>Remove</button>
              <EditAsset id={item.id} />
            </div>
          </div>
        ))}
    </div>
  );
};

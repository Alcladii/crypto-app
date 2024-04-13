import react, { useContext, useEffect } from "react";
import styled from "styled-components";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { EditAsset } from "../components/EditAsset";
import { PriceChangePercentageText } from "./PriceChangePercentageText";
import { Arrow } from "./Arrow";

const CoinTag = styled.img`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProgressBarOuter = styled.div`
  border-radius: 99px;
  background: rgba(1, 241, 227, 0.5);
  height: 10px;
  width: 100%;
`;

const ProgressBarInner = styled.div`
  border-radius: 99px;
  height: 10px;
  width: ${(props) => props.width * 100}%;
  background: #01f1e3;
`;

export const PortfolioItem = ({ setPortfolioListNeedsUpdate }) => {
  const {
    displayCurrency,
    currencySymbol,
    retainTwoDigits,
    portfolioList,
    setPortfolioList,
  } = useContext(CryptoContext);

  const handleRemove= (id) => {
    const newPortfolioList = portfolioList.filter((item) => item.id !== id);
    setPortfolioList(newPortfolioList);
    setPortfolioListNeedsUpdate(true);
  };

  const profitPercentage = (item) => {
    if (item.historyData.market_data) {
      return retainTwoDigits(
        ((item.coinData.market_data.current_price[displayCurrency] -
          item.historyData.market_data.current_price[displayCurrency]) /
          item.historyData.market_data.current_price[displayCurrency]) *
          100
      );
    }
  };

  return (
    <div>
      {portfolioList.length !== 0 &&
        portfolioList.map((item) => (
          <div className="flex flex-col w-full">
            <div className="flex">
              <div className="w-[30%] bg-line-bar-chart-background rounded-l-lg py-2">
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
                  <div className="text-sm">
                    Purchased&nbsp;{item.purchaseDate1}
                  </div>
                </div>
              </div>
              <div className="w-[75%] flex bg-button-unselected-search-bar-background rounded-r-lg">
                <div className="w-[50%] p-4 flex flex-col justify-between">
                  <div className="border-2 border-portfolio-item-price-properties rounded-md px-2 py-2">
                    <div className="text-xl font-semibold">
                      {currencySymbol}
                      {item.coinData.market_data.current_price[displayCurrency]}
                    </div>
                    <div className="text-sm">Current Price</div>
                  </div>
                  <div className="border-2 border-portfolio-item-price-properties rounded-md px-2 py-2">
                    <div className="flex items-center">
                      <div className="text-xl font-semibold text-portfolio-item-bar">
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
                    <div className="text-sm">Market Cap vs Volume</div>
                  </div>
                </div>
                <div className="w-[50%] p-4 flex flex-col justify-between">
                  <div className="border-2 border-portfolio-item-price-properties rounded-md px-2 py-2">
                    <div className="flex items-center">
                      <div>
                        <Arrow
                          priceChange={
                            item.coinData.market_data
                              .price_change_percentage_24h
                          }
                        />
                      </div>
                      <div className="text-xl font-semibold ml-2">
                        <PriceChangePercentageText
                          coin={
                            item.coinData.market_data
                              .price_change_percentage_24h
                          }
                        />
                      </div>
                    </div>
                    <div className="text-sm">24h%</div>
                  </div>
                  <div className="border-2 border-portfolio-item-price-properties rounded-md px-2 py-2">
                    <div className="flex items-center">
                      <div className="text-xl font-semibold">
                        {retainTwoDigits(
                          item.coinData.market_data.circulating_supply /
                            item.coinData.market_data.total_supply
                        )}
                        %
                      </div>
                      &nbsp;&nbsp;
                      <ProgressBarOuter>
                        <ProgressBarInner
                          width={
                            item.coinData.market_data.circulating_supply /
                            item.coinData.market_data.total_supply
                          }
                        ></ProgressBarInner>
                      </ProgressBarOuter>
                    </div>
                    <div className="text-sm">Circ Supply vs Max Supply</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end my-3">
              <div
                className="flex justify-center items-center w-24 h-10 selected-button rounded-md mr-4"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </div>
              <EditAsset id={item.id} setPortfolioListNeedsUpdate={setPortfolioListNeedsUpdate} />
            </div>
          </div>
        ))}
    </div>
  );
};

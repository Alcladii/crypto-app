import react, { useContext, useEffect } from "react";
import styled from "styled-components";
import { CryptoContext } from "../contexts/cryptoContext";
import "../App.css";

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
        item.historyData.market_data.current_price[displayCurrency]) * 100
    );
  };

  return (
    <div>
      {portfolioList.length !== 0 &&
        portfolioList.map((item) => (
          <div className="portfolio-item">
            <div className="portfolio-item-column-1">
              <div className="portfolio-item-coin-name-wrapper">
                <div>
                  <CoinTag src={item.coinData.image.large} />
                </div>
                &nbsp;&nbsp;
                <div>{item.coinData.name}</div>&nbsp;&nbsp;
              </div>
              <div>
                <div>Total Value</div>
                <div>{currencySymbol}{ retainTwoDigits(item.coinData.market_data.current_price[displayCurrency] * Number(item.purchaseAmount1)) }&nbsp;&nbsp;{profitPercentage(item)}%</div>
              </div>
              <div>Purchased&nbsp;{item.purchaseDate1}</div>
            </div>
            <div className="portfolio-item-column-2">
              <div className="portfolio-item-column-2-child">
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
              &nbsp;&nbsp;
              <div className="portfolio-item-column-2-child">
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
                  <div>{retainTwoDigits(
                      item.coinData.market_data.circulating_supply / item.coinData.market_data.total_supply
                    )}
                    %</div>
                  <div>Circ Supply vs Max Supply</div>
                </div>
              </div>
            </div>
            &nbsp;&nbsp;
            <button onClick={() => handleClick(item.id)}>Remove</button>
          </div>
        ))}
    </div>
  );
};

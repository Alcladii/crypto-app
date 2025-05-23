import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { DeleteAsset } from "./DeleteAsset";
import { EditAsset } from "./EditAsset";
import { PriceChangePercentageText } from "./PriceChangePercentageText";
import { Arrow } from "./UI/Arrow";

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

const ProgressBarInner = styled.div<{ width: number }>`
  border-radius: 99px;
  height: 10px;
  width: ${(props) => props.width * 100}%;
  background: #01f1e3;
`;

type PortfolioItemProps = {
  fetchPortfolio: () => void;
  //setPortfolioListNeedsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PortfolioItem: React.FC<PortfolioItemProps> = ({
  fetchPortfolio,
  //setPortfolioListNeedsUpdate,
}) => {
  const {
    displayCurrency,
    currencySymbol,
    retainTwoDigits,
    portfolioList,
    darkMode,
    setRedirectedFromPortfolioPage,
  } = useContext(CryptoContext) as CryptoContextProps;

  const profitPercentage = (item: {
    historyData: { market_data: { current_price: { [x: string]: number } } };
    coinData: { market_data: { current_price: { [x: string]: number } } };
  }) => {
    if (item.historyData.market_data) {
      return retainTwoDigits(
        ((item.coinData.market_data.current_price[displayCurrency] -
          item.historyData.market_data.current_price[displayCurrency]) /
          item.historyData.market_data.current_price[displayCurrency]) *
          100
      );
    }
    return 0;
  };

  const navigate = useNavigate();

  const handleClick = (item: any) => {
    navigate(`/coin-page/${item.id}`);
    setRedirectedFromPortfolioPage(true);
  };

  return (
    <div>
      {portfolioList.length !== 0 &&
        portfolioList.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col w-full ${darkMode ? "" : "theme-light"}`}
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-[35%] lg:w-[30%] rounded-t-lg md:rounded-none md:rounded-l-lg py-2 pl-4 pr-4 md:pr-0 bg-skin-portfolio-item-left-column-back-ground-color ">
                <div className="flex items-center justify-between md:justify-start pt-3 md:py-3">
                  <div className="hidden md:block md:mr-2">
                    <CoinTag src={item.coinData && item.coinData.image.large} />
                  </div>
                  <div
                    className="text-xl font-semibold text-skin-portfolio-item-coin-name-total-value-current-price-text-color"
                    onClick={() => handleClick(item.coinData)}
                  >
                    {item.coinData.name}({item.coinData.symbol.toUpperCase()})
                  </div>
                  <div className="md:hidden md:mr-2">
                    <CoinTag src={item.coinData.image.large} />
                  </div>
                </div>
                <div className="md:hidden text-sm text-skin-portfolio-item-titles-text-color">
                  Purchased&nbsp;{new Date(item.purchaseDate).toISOString().split('T')[0]}
                </div>
                <div className="py-2">
                  <div className="hidden md:block text-base text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
                    Total Value
                  </div>
                  <div className="flex sm:flex-col lg:flex-row">
                    <div className="text-2xl font-semibold py-2 sm:py-0 lg:py-2 text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
                      {currencySymbol}
                      {retainTwoDigits(
                        item.coinData.market_data.current_price[
                          displayCurrency
                        ] * item.purchaseAmount
                      )}
                      &nbsp;{displayCurrency.toUpperCase()}
                    </div>
                    <div className="mx-3 sm:mx-0 lg:mx-3 flex items-center">
                      <Arrow priceChange={profitPercentage(item)} />
                      &nbsp;
                      <PriceChangePercentageText
                        coin={profitPercentage(item)}
                      />
                    </div>
                  </div>
                  <div className="hidden md:block mt-3 text-sm text-skin-portfolio-item-titles-text-color">
                    Purchased&nbsp;{new Date(item.purchaseDate).toISOString().split('T')[0]}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[65%] lg:w-[70%] flex bg-skin-portfolio-item-right-column-back-ground-color rounded-b-lg md:rounded-none md:rounded-r-lg">
                <div className="w-[50%] p-4 flex flex-col justify-between">
                  <div className="border-2 mb-1 md:mb-0 border-skin-portfolio-item-frames-border-color rounded-md px-2 py-2">
                    <div className="text-xl font-semibold text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
                      {currencySymbol}
                      {item.coinData.market_data.current_price[displayCurrency]}
                    </div>
                    <div className="text-sm text-skin-portfolio-item-titles-text-color">
                      Current Price
                    </div>
                  </div>
                  <div className="border-2 mt-1 md:mt-0 border-skin-portfolio-item-frames-border-color rounded-md px-2 py-2">
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
                    <div className="text-sm text-skin-portfolio-item-titles-text-color">
                      Market Cap vs Volume
                    </div>
                  </div>
                </div>
                <div className="w-[50%] p-4 flex flex-col justify-between">
                  <div className="border-2 border-skin-portfolio-item-frames-border-color rounded-md px-2 py-2">
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
                    <div className="text-sm text-skin-portfolio-item-titles-text-color">
                      24h%
                    </div>
                  </div>
                  <div className="border-2 border-skin-portfolio-item-frames-border-color rounded-md px-2 py-2">
                    <div className="flex items-center">
                      <div className="text-xl font-semibold text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
                        {retainTwoDigits(
                          (item.coinData.market_data.circulating_supply /
                            item.coinData.market_data.total_supply) *
                            100
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
                    <div className="text-sm truncate text-skin-portfolio-item-titles-text-color">
                      Circ Supply vs Max Supply
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end my-3">
              <DeleteAsset
                id={item.id}
                //setPortfolioListNeedsUpdate={setPortfolioListNeedsUpdate}
                fetchPortfolio={fetchPortfolio}
              />
              <EditAsset
                id={item.id}
                //setPortfolioListNeedsUpdate={setPortfolioListNeedsUpdate}
                fetchPortfolio={fetchPortfolio}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

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

const ProgressBarInner = styled.div<{ width: number}>`
  border-radius: 99px;
  height: 10px;
  width: ${(props) => props.width * 100}%;
  background: #01f1e3;
`;

type PortfolioItemProps = {
  setPortfolioListNeedsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PortfolioItem: React.FC<PortfolioItemProps> = ({ setPortfolioListNeedsUpdate }) => {
  const {
    displayCurrency,
    currencySymbol,
    retainTwoDigits,
    portfolioList,
    darkMode,
    setRedirectedFromPortfolioPage,
  } = useContext(CryptoContext) as CryptoContextProps;

  /*const handleRemove= (id) => {
    const newPortfolioList = portfolioList.filter((item) => item.id !== id);
    setPortfolioList(newPortfolioList);
    setPortfolioListNeedsUpdate(true);
  };*/

  const profitPercentage = (item: { historyData: { market_data: { current_price: { [x: string]: number; }; }; }; coinData: { market_data: { current_price: { [x: string]: number; }; }; }; }) => {
    if (item.historyData.market_data) {
      return retainTwoDigits(
        ((item.coinData.market_data.current_price[displayCurrency] -
          item.historyData.market_data.current_price[displayCurrency]) /
          item.historyData.market_data.current_price[displayCurrency]) *
          100
      );
    }
    return 0
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
            <div className="flex">
              <div className="w-[30%] bg-skin-portfolio-item-left-column-back-ground-color rounded-l-lg py-2 pl-4">
                <div className="flex items-center py-3">
                  <div>
                    <CoinTag src={item.coinData.image.large} />
                  </div>
                  &nbsp;&nbsp;
                  <div className="text-xl font-semibold text-skin-portfolio-item-coin-name-total-value-current-price-text-color" onClick={()=>handleClick(item.coinData)}>                   
                    {item.coinData.name}({item.coinData.symbol.toUpperCase()})
                  </div>
                  &nbsp;&nbsp;
                </div>
                <div className="py-2">
                  <div className="text-base text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
                    Total Value
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl font-semibold py-2 text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
                      {currencySymbol}
                      {retainTwoDigits(
                        item.coinData.market_data.current_price[
                          displayCurrency
                        ] * Number(item.purchaseAmount1)
                      )}
                      &nbsp;{displayCurrency.toUpperCase()}
                    </div>
                    <div className="mx-3 flex items-center">
                      <Arrow priceChange={profitPercentage(item)}/>&nbsp;
                      <PriceChangePercentageText
                        coin={profitPercentage(item)}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-skin-portfolio-item-titles-text-color">
                    Purchased&nbsp;{item.purchaseDate1}
                  </div>
                </div>
              </div>
              <div className="w-[75%] flex bg-skin-portfolio-item-right-column-back-ground-color rounded-r-lg">
                <div className="w-[50%] p-4 flex flex-col justify-between">
                  <div className="border-2 border-skin-portfolio-item-frames-border-color rounded-md px-2 py-2">
                    <div className="text-xl font-semibold text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
                      {currencySymbol}
                      {item.coinData.market_data.current_price[displayCurrency]}
                    </div>
                    <div className="text-sm text-skin-portfolio-item-titles-text-color">
                      Current Price
                    </div>
                  </div>
                  <div className="border-2 border-skin-portfolio-item-frames-border-color rounded-md px-2 py-2">
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
                            item.coinData.market_data.total_supply)*100
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
                    <div className="text-sm text-skin-portfolio-item-titles-text-color">
                      Circ Supply vs Max Supply
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end my-3">
              {/*<div
                className="flex justify-center items-center w-24 h-10 bg-skin-portfolio-item-buttons-background-color text-skin-portfolio-item-buttons-text-color rounded-md mr-4"
                onClick={() => handleRemove(item.id)}
              >
                Remove
                        </div>*/}
              <DeleteAsset id={item.id} setPortfolioListNeedsUpdate={setPortfolioListNeedsUpdate}/>
              <EditAsset id={item.id} setPortfolioListNeedsUpdate={setPortfolioListNeedsUpdate} />
            </div>
          </div>
        ))}
    </div>
  );
};

import { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LineChartIndividualCoin from "./LineChartIndividualCoin";
import { Arrow } from "./UI/Arrow";
import { PriceChangePercentageText } from "./PriceChangePercentageText";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  sparkline_in_7d: { price: number[] };
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  market_cap_change_24h: number;
  market_cap: number;
  circulating_supply: number;
  total_supply: number;
};

const CoinTag = styled.img`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProgressBarOuter = styled.div<{ background: string }>`
  border-radius: 99px;
  background: ${(props) => `${props.background}80`};
  height: 8px;
  width: 100%;
`;

const ProgressBarInner = styled.div<{ width: number; background: string }>`
  border-radius: 99px;
  height: 8px;
  width: ${(props) => props.width * 100}%;
  background: ${(props) => props.background};
`;

type CoinsListItemProps = {
  singleCoin: Coin;
  innerRef?: React.Ref<HTMLDivElement>;
  index: number;
  color: string;
  selectedTimePeriod: string;
};



export const CoinsListItem:React.FC<CoinsListItemProps>= ({
  singleCoin,
  innerRef,
  index,
  color,
  selectedTimePeriod
}) => {
  const {
    convertToBillion,
    currencySymbol,
    setRedirectedFromPortfolioPage,
  } = useContext(CryptoContext) as CryptoContextProps;

  const navigate = useNavigate();

  const handleClick = (item: Coin) => {
    navigate(`/coin-page/${item.id}`);
    setRedirectedFromPortfolioPage(false);
  };

  return (
    <div
      key={singleCoin.id}
      className="flex items-center h-20 my-2.5 w-full bg-button-unselected-search-bar-background rounded-md bg-skin-coin-list-background-color"
      ref={innerRef}
    >
      <div className="md:w-[6%] lg:w-[5%] xl:w-[4%] min-w-12 pl-3 items-center text-skin-coin-list-text-color hidden md:flex">
        {index + 1}
      </div>
      <div
        className="w-[35%] sm:w-[35%] md:w-[21%] lg:w-[18%] xl:w-[15%] min-w-32 pr-2 flex justify-start items-center pl-3 md:pl-0"
        onClick={() => handleClick(singleCoin)}
      >
        <div className="flex items-center text-skin-coin-list-text-color">
          <CoinTag src={singleCoin.image} />
          <div className="flex flex-col-reverse sm:flex-col ml-2 sm:ml-4">
            <div className="hidden sm:block text-sm sm:text-base text-mobile-view-coin-name-text-color sm:text-skin-coin-list-text-color">
              {singleCoin.name}
            </div>
            <div className="sm:flex text-sm sm:text-base">
              <span className="hidden sm:block">(</span>
              {singleCoin.symbol.toUpperCase()}
              <span className="hidden sm:block">)</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[35%] sm:hidden min-w-32 pr-3 flex justify-start items-center">
        <div className="w-5/6 pt-6">
          <LineChartIndividualCoin
            priceList={singleCoin.sparkline_in_7d.price}
            color = {color}
          />
        </div>
      </div>
      <div className="w-[30%] sm:w-[20%] md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center text-base text-skin-coin-list-text-color">
        <div className="text-sm sm:text-base">
          {currencySymbol}
          {singleCoin.current_price &&
            singleCoin.current_price.toLocaleString()}
        </div>
        <div className="text-md flex items-center sm:hidden ">
          <Arrow
            priceChange={
              singleCoin[
                `price_change_percentage_${selectedTimePeriod}_in_currency` as keyof Coin
              ] as number
            }
          />
          &nbsp;
          <PriceChangePercentageText
            coin={
              singleCoin[
                `price_change_percentage_${selectedTimePeriod}_in_currency` as keyof Coin
              ] as number
            }
          />
        </div>
      </div>
      <div className="sm:w-[20%] md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center hidden sm:flex">
        <Arrow
          priceChange={singleCoin.price_change_percentage_1h_in_currency}
        />
        <div className="ml-1">
          <PriceChangePercentageText
            coin={singleCoin.price_change_percentage_1h_in_currency}
          />
        </div>
      </div>
      <div className="md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center hidden md:flex">
        <Arrow
          priceChange={singleCoin.price_change_percentage_24h_in_currency}
        />
        <div className="ml-1">
          <PriceChangePercentageText
            coin={singleCoin.price_change_percentage_24h_in_currency}
          />
        </div>
      </div>
      <div className="md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center hidden md:flex">
        <Arrow
          priceChange={singleCoin.price_change_percentage_7d_in_currency}
        />
        <div className="ml-1">
          <PriceChangePercentageText
            coin={singleCoin.price_change_percentage_7d_in_currency}
          />
        </div>
      </div>
      <div className="xl:w-[20%] lg:w-[24%] min-w-44 pr-3.5 justify-start items-center text-skin-coin-list-text-color hidden lg:flex">
        <div className="w-full">
          <div className="flex w-full items-center justify-between text-sm">
            <span>
              {currencySymbol}
              {convertToBillion(singleCoin.market_cap_change_24h)}B
            </span>
            <span>
              {currencySymbol}
              {convertToBillion(singleCoin.market_cap)}B
            </span>
          </div>
          <ProgressBarOuter
            background={color}
          >
            <ProgressBarInner
              width={singleCoin.market_cap_change_24h / singleCoin.market_cap}
              background={color}
            ></ProgressBarInner>
          </ProgressBarOuter>
        </div>
      </div>
      <div className="w-[20%] min-w-44 pl-3.5 justify-start items-center text-skin-coin-list-text-color hidden xl:flex">
        <div className="w-full">
          <div className="flex w-full items-center justify-between text-sm">
            <span>
              {currencySymbol}
              {convertToBillion(singleCoin.circulating_supply)}B
            </span>
            <span>
              {currencySymbol}
              {convertToBillion(singleCoin.total_supply)}B
            </span>
          </div>
          <ProgressBarOuter
            background={color}
          >
            <ProgressBarInner
              width={singleCoin.circulating_supply / singleCoin.total_supply}
              background={color}
            ></ProgressBarInner>
          </ProgressBarOuter>
        </div>
      </div>
      <div className="hidden sm:flex sm:w-[25%] md:w-[21%] lg:w-[18%] xl:w-[15%] min-w-32 pr-3 justify-end items-center">
        <div className="w-5/6 pt-6">
          <LineChartIndividualCoin
            priceList={singleCoin.sparkline_in_7d.price}
            color={color}
          />
        </div>
      </div>
    </div>
  );
};

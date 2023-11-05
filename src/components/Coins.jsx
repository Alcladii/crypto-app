import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import currencies from "../mocks/currencies.json";
import { CryptoContext } from "../contexts/cryptoContext";
import "../App.css";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import api from "../api";
import LineChartIndividualCoin from "./LineChartIndividualCoin";
import { SlickCarousel } from "../components/SlickCarousel";

const CoinTag = styled.img`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IndividualCoinWrapper = styled.div`
  border: 1px solid black;
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
  width: ${(props) => props.width * 1.5}px;
  background: purple;
`;

const ColorIndicator = styled.div`
  height: 10px;
  width: 15px;
  border: 1px solid white;
  background: ${(props) => props.background};
`;

function Coins() {
  const {
    useLocalState,
    convertToBillion,
    retainTwoDigits,
    displayCurrency,
    currencySymbol,
    getCurrencyList,
    setNumOfDays,
    priceVolumeChartIsLoading,
    priceVolumeChartIsLoadingHasError,
    priceVolumeList,
    selectedCoinData,
    slidesData,
  } = useContext(CryptoContext);

  const [coinListIsLoading, setCoinListIsLoading] = useState(false);
  const [coinListLoadingHasError, setCoinListLoadingHasError] = useState(false);
  const [coinList, setCoinList] = useLocalState("coinList", []);
  const [coinListDsc, setCoinListDsc] = useLocalState("coinListDsc", true);
  const [sortByPriceDirection, setSortByPriceDirection] = useState(false);
  const [coinPage, setCoinPage] = useState(1);

  const getCoinList = async () => {
    try {
      // save for making real API calls in the future
      /*setIsLoading(true);
      const {data}  = await axios(      
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${coinPage}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
      );
      setCoinList(coinList.concat(data))
      setCoinPage(coinPage + 1)*/
      /*const { coins }  = await api(
        "/coins/markets",
        "vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );*/
      let coins;
      const order = coinListDsc ? "market_cap_desc" : "market_cap_asc";
      setCoinListIsLoading(true);
      const response = await api(
        "/coins/markets",
        `vs_currency=${displayCurrency}&order=${order}&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
      );
      coins = response.data;
      setCoinList(coins);
      setCoinListIsLoading(false);
      setCoinListLoadingHasError(false);
    } catch (err) {
      setCoinListLoadingHasError(true);
      setCoinListIsLoading(false);
    }
  };

  const setToDsc = () => {
    setCoinListDsc(true);
  };

  const setToAsc = () => {
    setCoinListDsc(false);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      y: {
        display: false,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    tension: 0.5,
  };

  useEffect(() => {
    getCoinList();
  }, [coinListDsc]);

  useEffect(() => {
    getCurrencyList();
  }, []);

  const history = useHistory();

  const handleClick = (item) => {
    history.push(`/coin-page/${item.id}`);
  };

  const colors = ["blue", "purple", "green"];

  return (
    <div className="App">
      <div className="slick-carousel">
        <SlickCarousel coinList={coinList} />
      </div>
      <div>
        <button
          onClick={() => {
            setNumOfDays(0);
          }}
        >
          {" "}
          1 Day{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(6);
          }}
        >
          {" "}
          7 Days{" "}
        </button>
        {/*I put two spaces here just to seperate the buttons before I start working on the CSS*/}
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(30);
          }}
        >
          {" "}
          1 Month{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(89);
          }}
        >
          {" "}
          90 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(179);
          }}
        >
          {" "}
          180 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(364);
          }}
        >
          {" "}
          1 Year{" "}
        </button>
      </div>
      {priceVolumeList.length === 0 ? (
        <div className="please-select-coin-wrapper">
          Please select a coin to view chart
        </div>
      ) : (
        <div className="chart">
          {priceVolumeChartIsLoading && (
            <div>Loading Price and Volumne Chart</div>
          )}

          <div className="line-chart-wrapper">
            {priceVolumeList !== null && (
              <LineChart priceVolumeList={priceVolumeList} />
            )}
            <div className="charts-coins-container">
              {selectedCoinData &&
                selectedCoinData.map((coin) => (
                  <div className="coin-indicator-wrapper">
                    <ColorIndicator
                      background={colors[selectedCoinData.indexOf(coin)]}
                    ></ColorIndicator>
                    {coin.name}&nbsp;{currencySymbol}
                    {coin.current_price.toLocaleString()}
                  </div>
                ))}
            </div>
          </div>
          <div className="bar-chart-wrapper">
            {priceVolumeList !== null && (
              <BarChart priceVolumeList={priceVolumeList} />
            )}
            <div className="charts-coins-container">
              {selectedCoinData &&
                selectedCoinData.map((coin) => (
                  <div className="coin-indicator-wrapper">
                    <ColorIndicator
                      background={colors[selectedCoinData.indexOf(coin)]}
                    ></ColorIndicator>
                    {coin.name}&nbsp;{currencySymbol}
                    {convertToBillion(coin.total_volume)}B
                  </div>
                ))}
            </div>
          </div>
          {priceVolumeChartIsLoadingHasError && (
            <div>Error fetching Price and Volumne Chart</div>
          )}
        </div>
      )}

      <div>
        <button onClick={setToDsc}> Top 50 </button>&nbsp;&nbsp;
        <button onClick={setToAsc}> Bottom 50 </button>
        {coinListIsLoading && <div>Loading Coin List</div>}
        {/*
          save for infinite scroll when making real API call
          <InfiniteScroll
            dataLength={coinList}
            next={getCoinList}
            hasMore={true}
            loader={<h4>Infinite coins loading</h4>}
          >*/}
        <div>Name</div>
        <div></div>
        {coinList.map((singleCoin) => (
          <div key={singleCoin.id} className="individual-coin">
            <div>{singleCoin.index}</div>
            <div
              className="coin-column-width"
              onClick={() => handleClick(singleCoin)}
            >
              <div className="coin-name-icon-wrapper">
                <CoinTag src={singleCoin.image} />
                &nbsp;&nbsp;
                <span>{singleCoin.name}</span>
              </div>
            </div>
            &nbsp;&nbsp;
            <div className="coin-data-width">
              {currencySymbol}
              {singleCoin.current_price &&
                singleCoin.current_price.toLocaleString()}
            </div>
            &nbsp;&nbsp;
            <div className="coin-data-width">
              {singleCoin.price_change_percentage_1h_in_currency !== null
                ? retainTwoDigits(
                    singleCoin.price_change_percentage_1h_in_currency
                  )
                : "N/A"}
              %
            </div>
            <div className="coin-data-width">
              {singleCoin.price_change_percentage_24h_in_currency !== null
                ? retainTwoDigits(
                    singleCoin.price_change_percentage_24h_in_currency
                  )
                : "N/A"}
              %
            </div>
            <div className="coin-data-width">
              {singleCoin.price_change_percentage_7d_in_currency !== null
                ? retainTwoDigits(
                    singleCoin.price_change_percentage_7d_in_currency
                  )
                : "N/A"}
              %
            </div>
            <div className="coin-column-width">
              <div className="market-cap-change-wrapper">
                <span>
                  {currencySymbol}
                  {convertToBillion(singleCoin.market_cap_change_24h)}B
                </span>
                <span>
                  {currencySymbol}
                  {convertToBillion(singleCoin.market_cap)}B
                </span>
              </div>
              <ProgressBarOuter>
                <ProgressBarInner
                  width={
                    (singleCoin.market_cap_change_24h / singleCoin.market_cap) *
                    100
                  }
                ></ProgressBarInner>
              </ProgressBarOuter>
            </div>
            <div className="coin-column-width">
              <div className="total-circulating-supply-wrapper">
                <span>
                  {currencySymbol}
                  {convertToBillion(singleCoin.circulating_supply)}B
                </span>
                <span>
                  {currencySymbol}
                  {convertToBillion(singleCoin.total_supply)}B
                </span>
              </div>
              <ProgressBarOuter>
                <ProgressBarInner
                  width={
                    (singleCoin.circulating_supply / singleCoin.total_supply) *
                    100
                  }
                ></ProgressBarInner>
              </ProgressBarOuter>
            </div>
            <div className="coin-column-width">
              <div className="individual-coin-chart">
                <LineChartIndividualCoin
                  priceList={singleCoin.sparkline_in_7d.price}
                />
              </div>
            </div>
          </div>
        ))}
        {/*</InfiniteScroll>*/}
        {coinListLoadingHasError && <div>Error in fetching Coins List</div>}
      </div>
    </div>
  );
}

export default Coins;

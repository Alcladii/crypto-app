import currencies from "../mocks/currencies.json"
import { CryptoContext } from "../contexts/cryptoContext";
import "../App.css";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import api from "../api";
import LineChartIndividualCoin from "../components/LineChartIndividualCoin";

import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";

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
  width: auto;
`;

const ProgressBarInner = styled.div`
  border-radius: 99px;
  height: 10px;
  width: ${(props) => props.width * 5.44}px;
  background: purple;
`;

console.clear();

function Coins() {
  const {
    useLocalState,
    convertToBillion,
    retainTwoDigits,
  } = useContext(CryptoContext);

  const [coinListIsLoading, setCoinListIsLoading] = useState(false);
  const [coinListLoadingHasError, setCoinListLoadingHasError] = useState(false);
  const [coinList, setCoinList] = useState([]);
  const [coinListDsc, setCoinListDsc] = useState(true);
  const [priceVolumeChartIsLoading, setPriceVolumeChartIsLoading] =
    useState(false);
  const [
    priceVolumeChartIsLoadingHasError,
    setPriceVolumeChartIsLoadingHasError,
  ] = useState(false);
  const [priceList, setPriceList] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [numOfDays, setNumOfDays] = useLocalState("numOfDays", []);
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
      //setSingleCoin({});
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

  const getCoinPriceVolume = async (numOfDays) => {
    try {
      setPriceVolumeChartIsLoading(true);
      const { data } = await axios(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${numOfDays}&interval=daily`
      );
      setPriceVolumeChartIsLoading(false);
      setPriceVolumeChartIsLoadingHasError(false);
      setNumOfDays(numOfDays);
      setPriceList(data.prices);
      setVolumeList(data.total_volumes);
    } catch (err) {
      console.log("error getting price and volume");
      setPriceVolumeChartIsLoadingHasError(true);
      setPriceVolumeChartIsLoading(false);
    }
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
  }, []);

  useEffect(() => {
    getCoinPriceVolume(numOfDays);
  }, []);

  useEffect(() => {
    getCoinList();
  }, [coinListDsc]);

  const history = useHistory();

  const handleClick = (item) => {
    history.push(`/coin-page/${item.id}`);
  };

  return (
    <div className="App">
      <div>
        <button
          onClick={() => {
            getCoinPriceVolume(0);
          }}
        >
          {" "}
          1 Day{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            getCoinPriceVolume(6);
          }}
        >
          {" "}
          7 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            getCoinPriceVolume(30);
          }}
        >
          {" "}
          1 Month{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            getCoinPriceVolume(89);
          }}
        >
          {" "}
          90 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            getCoinPriceVolume(179);
          }}
        >
          {" "}
          180 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            getCoinPriceVolume(364);
          }}
        >
          {" "}
          1 Year{" "}
        </button>
      </div>
      <div className="chart">
        {priceVolumeChartIsLoading && (
          <div>Loading Price and Volumne Chart</div>
        )}
        <LineChart priceList={priceList} />
        <BarChart volumeList={volumeList} />
        {priceVolumeChartIsLoadingHasError && (
          <div>Error fetching Price and Volumne Chart</div>
        )}
      </div>
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
        {coinList.map((singleCoin) => (
          <div key={singleCoin.id} className="individual-coin">
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
              {/*{currencies[displayCurrency.toUpperCase()]?.symbol}*/}
              {singleCoin.current_price /*.toLocaleString()*/}
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
                  {convertToBillion(singleCoin.market_cap_change_24h)}B
                </span>
                <span>
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
                <span></span>
                <span></span>
              </div>
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

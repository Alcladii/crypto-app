import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import queryString from "query-string";
import InfiniteScroll from "react-infinite-scroll-component";
import currencies from "../mocks/currencies.json";
import { CryptoContext } from "../contexts/cryptoContext";
import "../App.css";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import api from "../api";
import LineChartIndividualCoin from "./LineChartIndividualCoin";
import { SlickCarousel } from "../components/SlickCarousel";
import { Arrow } from "../components/Arrow";
import { DaysButton } from "../components/DaysButton";

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
  width: ${(props) => props.width * 150}px;
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
    numOfDays,
    setNumOfDays,
    priceVolumeChartIsLoading,
    priceVolumeChartIsLoadingHasError,
    priceVolumeList,
    selectedCoinData,
    slidesData,
    coinList,
    setCoinList,
    setPriceVolumeList,
    getCoinPriceVolume,
    handleSearchParams,
    clearSearchParams,
    location,
    queryParams,
    historyURL,
  } = useContext(CryptoContext);

  const [coinListIsLoading, setCoinListIsLoading] = useState(false);
  const [coinListLoadingHasError, setCoinListLoadingHasError] = useState(false);
  const [coinListDsc, setCoinListDsc] = useLocalState("coinListDsc", true);
  const [sortBy, setSortBy] = useLocalState("sortBy", "");
  const [sortOrder, setSortOrder] = useLocalState("sortOrder", "");
  const [displayCoinList, setDisplayCoinList] = useLocalState(
    "displayCoinList",
    []
  );
  
  const showTopFifty = queryParams.show_top_fifty === "true";

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
      const order = showTopFifty ? "market_cap_desc" : "market_cap_asc";
      setCoinListIsLoading(true);
      const response = await api(
        "/coins/markets",
        `vs_currency=${displayCurrency}&order=${order}&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
      );
      coins = response.data;
      setCoinList(coins);
      if (sortOrder === "") {
        setSortOrder("default");
      }
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

  useEffect(() => {
    handleSearchParams("show_top_fifty", coinListDsc);
  }, [coinListDsc]);

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

    const minute = 60000;

    const intervalId = setInterval(() => {
      getCoinList();
    }, minute);

    return () => clearInterval(intervalId);
  }, [coinListDsc, showTopFifty]);

  useEffect(() => {
    getCurrencyList();
  }, []);

  const history = useHistory();

  const handleClick = (item) => {
    history.push(`/coin-page/${item.id}`);
  };

  const colors = ["blue", "purple", "green"];

  const handleSortOrder = () => {
    if (sortOrder === "default") {
      setSortOrder("ascent");
    }
    if (sortOrder === "ascent") {
      setSortOrder("descent");
    }
    if (sortOrder === "descent") {
      setSortOrder("default");
    }
  };

  const handleSortByName = () => {
    if (sortBy !== "name") {
      setSortBy("name");
    }
    handleSortOrder();
  };

  const handleSortByPrice = () => {
    if (sortBy !== "current_price") {
      setSortBy("current_price");
    }
    handleSortOrder();
  };

  const handleSortByOneHour = () => {
    if (sortBy !== "price_change_percentage_1h_in_currency") {
      setSortBy("price_change_percentage_1h_in_currency");
    }
    handleSortOrder();
  };

  const handleSortByTwentyFourHours = () => {
    if (sortBy !== "price_change_percentage_24h_in_currency") {
      setSortBy("price_change_percentage_24h_in_currency");
    }
    handleSortOrder();
  };

  const handleSortBySevenDays = () => {
    if (sortBy !== "price_change_percentage_7d_in_currency") {
      setSortBy("price_change_percentage_7d_in_currency");
    }
    handleSortOrder();
  };

  useEffect(() => {
    handleSearchParams("sort_by", sortBy);
  }, [sortBy]);

  useEffect(() => {
    handleSearchParams("sort_order", sortOrder);
  }, [sortOrder]);

  const sortCoinList = () => {
    const sortedCoinList = [...coinList];
    const sortByInQueryParams = queryParams.sort_by;
    const sortOrderInQueryParams = queryParams.sort_order;
    if (sortByInQueryParams === "name" && sortOrderInQueryParams === "ascent") {
      sortedCoinList.sort((value1, value2) =>
        value1.name.localeCompare(value2.name)
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (
      sortByInQueryParams === "name" &&
      sortOrderInQueryParams === "descent"
    ) {
      sortedCoinList.sort((value1, value2) =>
        value2.name.localeCompare(value1.name)
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortByInQueryParams === "current_price" ||
        sortByInQueryParams === "price_change_percentage_1h_in_currency" ||
        sortByInQueryParams === "price_change_percentage_24h_in_currency" ||
        sortByInQueryParams === "price_change_percentage_7d_in_currency") &&
      sortOrderInQueryParams === "ascent"
    ) {
      sortedCoinList.sort((value1, value2) => value1[sortBy] - value2[sortBy]);
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortByInQueryParams === "current_price" ||
        sortByInQueryParams === "price_change_percentage_1h_in_currency" ||
        sortByInQueryParams === "price_change_percentage_24h_in_currency" ||
        sortByInQueryParams === "price_change_percentage_7d_in_currency") &&
      sortOrderInQueryParams === "descent"
    ) {
      sortedCoinList.sort((value1, value2) => value2[sortBy] - value1[sortBy]);
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortByInQueryParams === "name" ||
        sortByInQueryParams === "current_price" ||
        sortByInQueryParams === "price_change_percentage_1h_in_currency" ||
        sortByInQueryParams === "price_change_percentage_24h_in_currency" ||
        sortByInQueryParams === "price_change_percentage_7d_in_currency") &&
      sortOrderInQueryParams === "default"
    ) {
      setDisplayCoinList(coinList);
    }
  };

  useEffect(() => {
    sortCoinList();
  }, [queryParams.sort_order, coinList]);

  useEffect(() => {
    handleSearchParams("days", numOfDays);
  }, [numOfDays]);

  return (
    <div className="App">
      <div className="my-[20px]">
        <SlickCarousel coinList={coinList} />
      </div>

      {priceVolumeList.length === 0 ? (
        <div className="please-select-coin-wrapper">
          Please select a coin to view chart
        </div>
      ) : (
        <div className="flex justify-center items-center max-w-[1440px] h-96 my-7">
          {priceVolumeChartIsLoading && (
            <div>Loading Price and Volumne Chart</div>
          )}

          <div className="line-chart-wrapper">
            {priceVolumeChartIsLoadingHasError === false && (
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
            {priceVolumeChartIsLoadingHasError === false && (
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
      <div className="flex my-5 w-fit h-auto bg-button-unselected-search-bar-background rounded-md">
        <DaysButton days="1" buttonText="1D" />
        <DaysButton days="7" buttonText="7D" />
        <DaysButton days="30" buttonText="1M" />
        <DaysButton days="90" buttonText="90D" />
        <DaysButton days="180" buttonText="180D" />
        <DaysButton days="365" buttonText="1Y" />
      </div>
      <div
        className="bg-button-unselected-search-bar-background w-44 h-10 mx-1 my-0.5 flex justify-center items-center rounded-md font-space-grotesk cursor-pointer"
        onClick={clearSearchParams}
      >
        Clear Search Criteria
      </div>

      <div className="max-w-[1440px]">
        <div className="flex justify-center my-6">
          <div
            className={`${
              coinListDsc
                ? "bg-button-selected"
                : "bg-button-unselected-search-bar-background"
            } flex justify-center items-center mr-5 h-10 w-44 rounded md cursor-pointer`}
            onClick={setToDsc}
          >
            {" "}
            Top 50{" "}
          </div>
          <div
            className={`${
              !coinListDsc
                ? "bg-button-selected"
                : "bg-button-unselected-search-bar-background"
            } flex justify-center items-center ml-5 h-10 w-44 rounded-md cursor-pointer`}
            onClick={setToAsc}
          >
            {" "}
            Bottom 50{" "}
          </div>
        </div>
        {coinListIsLoading && (
          <div className="flex justify-center my-5">Loading Coin List</div>
        )}
        {/*
          save for infinite scroll when making real API call
          <InfiniteScroll
            dataLength={coinList}
            next={getCoinList}
            hasMore={true}
            loader={<h4>Infinite coins loading</h4>}
          >*/}
        <div className="flex">
          <div className="w-[4%] flex items-center">#</div>
          <div className="w-[15%] pr-2 flex justify-start items-center">
            <div>Name</div>&nbsp;
            <button onClick={handleSortByName}>sort</button>
          </div>
          <div className="w-[10%] pl-2 flex justify-start items-center">
            <div>Price</div>
            <button onClick={handleSortByPrice}>sort</button>
          </div>
          <div className="w-[10%] flex justify-start items-center">
            <div>1h%</div>
            <button onClick={handleSortByOneHour}>sort</button>
          </div>
          <div className="w-[10%] flex justify-start items-center">
            <div>24h%</div>
            <button onClick={handleSortByTwentyFourHours}>sort</button>
          </div>
          <div className="w-[10%] flex justify-start items-center">
            <div>7d%</div>
            <button onClick={handleSortBySevenDays}>sort</button>
          </div>
          <div className="w-[17%] flex justify-start items-center">
            24h volume/Market Cap
          </div>
          <div className="w-[17%] flex justify-start items-center">
            Circulating/Total supply
          </div>
          <div className="w-[17%] flex justify-start items-center">Last 7d</div>
        </div>
        {displayCoinList.map((singleCoin) => (
          <div key={singleCoin.id} className="flex items-center">
            <div className="w-[4%] flex items-center">
              {displayCoinList.indexOf(singleCoin) + 1}
            </div>
            <div
              className="w-[15%] pr-2 flex justify-start items-center"
              onClick={() => handleClick(singleCoin)}
            >
              <div className="flex items-center">
                <CoinTag src={singleCoin.image} />
                &nbsp;&nbsp;
                <div>{singleCoin.name}</div>
              </div>
            </div>
            <div className="w-[10%] pl-2 flex justify-start items-center">
              {currencySymbol}
              {singleCoin.current_price &&
                singleCoin.current_price.toLocaleString()}
            </div>
            <div className="w-[10%] flex justify-start items-center">
              {
                <Arrow
                  priceChange={
                    singleCoin.price_change_percentage_1h_in_currency
                  }
                />
              }
              <div
                className={`coin-data-width ${
                  singleCoin.price_change_percentage_1h_in_currency > 0
                    ? "positive-num"
                    : "negative-num"
                }`}
              >
                {singleCoin.price_change_percentage_1h_in_currency !== null
                  ? retainTwoDigits(
                      singleCoin.price_change_percentage_1h_in_currency
                    )
                  : "N/A"}
                %
              </div>
            </div>
            <div className="w-[10%] flex justify-start items-center">
              {
                <Arrow
                  priceChange={
                    singleCoin.price_change_percentage_24h_in_currency
                  }
                />
              }
              <div
                className={`coin-data-width ${
                  singleCoin.price_change_percentage_24h_in_currency > 0
                    ? "positive-num"
                    : "negative-num"
                }`}
              >
                {singleCoin.price_change_percentage_24h_in_currency !== null
                  ? retainTwoDigits(
                      singleCoin.price_change_percentage_24h_in_currency
                    )
                  : "N/A"}
                %
              </div>
            </div>
            <div className="w-[10%] flex justify-start items-center">
              {
                <Arrow
                  priceChange={
                    singleCoin.price_change_percentage_7d_in_currency
                  }
                />
              }
              <div
                className={`coin-data-width ${
                  singleCoin.price_change_percentage_7d_in_currency > 0
                    ? "positive-num"
                    : "negative-num"
                }`}
              >
                {singleCoin.price_change_percentage_7d_in_currency !== null
                  ? retainTwoDigits(
                      singleCoin.price_change_percentage_7d_in_currency
                    )
                  : "N/A"}
                %
              </div>
            </div>
            <div className="w-[17%] flex justify-start items-center">
              <div>
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
                      singleCoin.market_cap_change_24h / singleCoin.market_cap
                    }
                  ></ProgressBarInner>
                </ProgressBarOuter>
              </div>
            </div>
            <div className="w-[17%] flex justify-start items-center">
              <div>
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
                      singleCoin.circulating_supply / singleCoin.total_supply
                    }
                  ></ProgressBarInner>
                </ProgressBarOuter>
              </div>
            </div>
            <div className="w-[17%] flex justify-start items-center">
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

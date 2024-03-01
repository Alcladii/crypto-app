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
  const [displayCoinList, setDisplayCoinList] = useLocalState(
    "displayCoinList",
    []
  );
  const [sortOrderByName, setSortOrderByName] = useLocalState(
    "sortOrderByName",
    "default"
  );
  const [sortOrderByPrice, setSortOrderByPrice] = useLocalState(
    "sortOrderByPrice",
    "default"
  );
  const [sortOrderByPriceChange1h, setSortOrderByPriceChange1h] = useLocalState(
    "sortOrderByPriceChange1h",
    "default"
  );
  const [sortOrderByPriceChange24h, setSortOrderByPriceChange24h] =
    useLocalState("sortOrderByPriceChange24h", "default");
  const [sortOrderByPriceChange7d, setSortOrderByPriceChange7d] = useLocalState(
    "sortOrderByPriceChange7d",
    "default"
  );

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

  useEffect(() => {
    getCoinList();

    const minute = 60000;

    const intervalId = setInterval(() => {
      getCoinList();
    }, minute);

    return () => clearInterval(intervalId);
  }, [coinListDsc]);

  useEffect(() => {
    getCurrencyList();
  }, []);

  const history = useHistory();

  const handleClick = (item) => {
    history.push(`/coin-page/${item.id}`);
  };

  const colors = ["blue", "purple", "green"];

  const handleSortOrderByName = () => {
    if (sortOrderByName === "default") {
      setSortOrderByName("ascent");
    }
    if (sortOrderByName === "ascent") {
      setSortOrderByName("descent");
    }
    if (sortOrderByName === "descent") {
      setSortOrderByName("default");
    }
  };

  const handleSortOrderByPrice = () => {
    if (sortOrderByPrice === "default") {
      setSortOrderByPrice("ascent");
    }
    if (sortOrderByPrice === "ascent") {
      setSortOrderByPrice("descent");
    }
    if (sortOrderByPrice === "descent") {
      setSortOrderByPrice("default");
    }
  };

  const handleSortOrderByPriceChange1h = () => {
    if (sortOrderByPriceChange1h === "default") {
      setSortOrderByPriceChange1h("ascent");
    }
    if (sortOrderByPriceChange1h === "ascent") {
      setSortOrderByPriceChange1h("descent");
    }
    if (sortOrderByPriceChange1h === "descent") {
      setSortOrderByPriceChange1h("default");
    }
  };

  const handleSortOrderByPriceChange24h = () => {
    if (sortOrderByPriceChange24h === "default") {
      setSortOrderByPriceChange24h("ascent");
    }
    if (sortOrderByPriceChange24h === "ascent") {
      setSortOrderByPriceChange24h("descent");
    }
    if (sortOrderByPriceChange24h === "descent") {
      setSortOrderByPriceChange24h("default");
    }
  };

  const handleSortOrderByPriceChange7d = () => {
    if (sortOrderByPriceChange7d === "default") {
      setSortOrderByPriceChange7d("ascent");
    }
    if (sortOrderByPriceChange7d === "ascent") {
      setSortOrderByPriceChange7d("descent");
    }
    if (sortOrderByPriceChange7d === "descent") {
      setSortOrderByPriceChange7d("default");
    }
  };

  const handleSortByName = () => {
    if (sortBy !== "name") {
      setSortBy("name");
    }
    handleSortOrderByName();
    setSortOrderByPrice("default");
    setSortOrderByPriceChange1h("default");
    setSortOrderByPriceChange24h("default");
    setSortOrderByPriceChange7d("default");
  };

  const handleSortByPrice = () => {
    if (sortBy !== "current_price") {
      setSortBy("current_price");
    }
    handleSortOrderByPrice();
    setSortOrderByName("default");
    setSortOrderByPriceChange1h("default");
    setSortOrderByPriceChange24h("default");
    setSortOrderByPriceChange7d("default");
  };

  const handleSortByOneHour = () => {
    if (sortBy !== "price_change_percentage_1h_in_currency") {
      setSortBy("price_change_percentage_1h_in_currency");
    }
    handleSortOrderByPriceChange1h();
    setSortOrderByName("default");
    setSortOrderByPrice("default");
    setSortOrderByPriceChange24h("default");
    setSortOrderByPriceChange7d("default");
  };

  const handleSortByTwentyFourHours = () => {
    if (sortBy !== "price_change_percentage_24h_in_currency") {
      setSortBy("price_change_percentage_24h_in_currency");
    }
    handleSortOrderByPriceChange24h();
    setSortOrderByName("default");
    setSortOrderByPrice("default");
    setSortOrderByPriceChange1h("default");
    setSortOrderByPriceChange7d("default");
  };

  const handleSortBySevenDays = () => {
    if (sortBy !== "price_change_percentage_7d_in_currency") {
      setSortBy("price_change_percentage_7d_in_currency");
    }
    handleSortOrderByPriceChange7d();
    setSortOrderByName("default");
    setSortOrderByPrice("default");
    setSortOrderByPriceChange1h("default");
    setSortOrderByPriceChange24h("default");
  };

  useEffect(() => {
    handleSearchParams("sort_by", sortBy);
  }, [sortBy]);

  useEffect(() => {
    handleSearchParams("sort_order_by_name", sortOrderByName);
  }, [sortOrderByName]);

  useEffect(() => {
    handleSearchParams("sort_order_by_price", sortOrderByPrice);
  }, [sortOrderByPrice]);

  useEffect(() => {
    handleSearchParams(
      "sort_order_by_price_change_1h",
      sortOrderByPriceChange1h
    );
  }, [sortOrderByPriceChange1h]);

  useEffect(() => {
    handleSearchParams(
      "sort_order_by_price_change_24h",
      sortOrderByPriceChange24h
    );
  }, [sortOrderByPriceChange24h]);

  useEffect(() => {
    handleSearchParams(
      "sort_order_by_price_change_7d",
      sortOrderByPriceChange7d
    );
  }, [sortOrderByPriceChange7d]);

  const sortByInQueryParams = queryParams.sort_by;
  const sortOrderByNameInQueryParams = queryParams.sort_order_by_name;
  const sortOrderByPriceInQueryParams = queryParams.sort_order_by_price;
  const sortOrderByPriceChange1hInQueryParams =
    queryParams.sort_order_by_price_change_1h;
  const sortOrderByPriceChange24hInQueryParams =
    queryParams.sort_order_by_price_change_24h;
  const sortOrderByPriceChange7dInQueryParams =
    queryParams.sort_order_by_price_change_7d;

  const sortCoinList = () => {
    const sortedCoinList = [...coinList];

    if (
      sortByInQueryParams === "name" &&
      sortOrderByNameInQueryParams === "ascent"
    ) {
      sortedCoinList.sort((value1, value2) =>
        value1[sortByInQueryParams].localeCompare(value2[sortByInQueryParams])
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (
      sortByInQueryParams === "name" &&
      sortOrderByNameInQueryParams === "descent"
    ) {
      sortedCoinList.sort((value1, value2) =>
        value2[sortByInQueryParams].localeCompare(value1[sortByInQueryParams])
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortByInQueryParams === "current_price" &&
        sortOrderByPriceInQueryParams === "ascent") ||
      (sortByInQueryParams === "price_change_percentage_1h_in_currency" &&
        sortOrderByPriceChange1hInQueryParams === "ascent") ||
      (sortByInQueryParams === "price_change_percentage_24h_in_currency" &&
        sortOrderByPriceChange24hInQueryParams === "ascent") ||
      (sortByInQueryParams === "price_change_percentage_7d_in_currency" &&
        sortOrderByPriceChange7dInQueryParams === "ascent")
    ) {
      sortedCoinList.sort(
        (value1, value2) =>
          value1[sortByInQueryParams] - value2[sortByInQueryParams]
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortByInQueryParams === "current_price" &&
        sortOrderByPriceInQueryParams === "descent") ||
      (sortByInQueryParams === "price_change_percentage_1h_in_currency" &&
        sortOrderByPriceChange1hInQueryParams === "descent") ||
      (sortByInQueryParams === "price_change_percentage_24h_in_currency" &&
        sortOrderByPriceChange24hInQueryParams === "descent") ||
      (sortByInQueryParams === "price_change_percentage_7d_in_currency" &&
        sortOrderByPriceChange7dInQueryParams === "descent")
    ) {
      sortedCoinList.sort(
        (value1, value2) =>
          value2[sortByInQueryParams] - value1[sortByInQueryParams]
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortByInQueryParams === "name" &&
        sortOrderByNameInQueryParams === "default") ||
      (sortByInQueryParams === "current_price" &&
        sortOrderByPriceInQueryParams === "default") ||
      (sortByInQueryParams === "price_change_percentage_1h_in_currency" &&
        sortOrderByPriceChange1hInQueryParams === "default") ||
      (sortByInQueryParams === "price_change_percentage_24h_in_currency" &&
        sortOrderByPriceChange24hInQueryParams === "default") ||
      (sortByInQueryParams === "price_change_percentage_7d_in_currency" &&
        sortOrderByPriceChange7dInQueryParams === "default")
    ) {
      setDisplayCoinList(coinList);
    }
  };

  useEffect(() => {
    sortCoinList();
  }, [
    sortByInQueryParams,
    sortOrderByNameInQueryParams,
    sortOrderByPriceInQueryParams,
    sortOrderByPriceChange1hInQueryParams,
    sortOrderByPriceChange24hInQueryParams,
    sortOrderByPriceChange7dInQueryParams,
    coinList,
  ]);

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
        <div className="coin-list-title-container">
          <div className="coin-number-column-width">#</div>
          <div className="coin-column-width">
            <div>Name</div>
            <div onClick={handleSortByName}>
              <img
                src={
                  sortOrderByNameInQueryParams === "default"
                    ? "https://i.ibb.co/fpfHc9R/icons8-triangle-48-white.png"
                    : sortOrderByNameInQueryParams === "ascent"
                    ? "https://i.ibb.co/pKrLjwn/icons8-triangle-48-2-white.png"
                    : "https://i.ibb.co/2hMjkBq/icons8-square-48.png"
                }
                className="w-3.5 ml-2"
              />
            </div>
          </div>
          <div className="coin-data-width">
            <div>Price</div>
            <div onClick={handleSortByPrice}>
              <img
                src={
                  sortOrderByPriceInQueryParams === "default"
                    ? "https://i.ibb.co/fpfHc9R/icons8-triangle-48-white.png"
                    : sortOrderByPriceInQueryParams === "ascent"
                    ? "https://i.ibb.co/pKrLjwn/icons8-triangle-48-2-white.png"
                    : "https://i.ibb.co/2hMjkBq/icons8-square-48.png"
                }
                className="w-3.5 ml-2"
              />
            </div>
          </div>
          <div className="coin-data-width">
            <div>1h%</div>
            <div onClick={handleSortByOneHour}>
              <img
                src={
                  sortOrderByPriceChange1hInQueryParams === "default"
                    ? "https://i.ibb.co/fpfHc9R/icons8-triangle-48-white.png"
                    : sortOrderByPriceChange1hInQueryParams === "ascent"
                    ? "https://i.ibb.co/pKrLjwn/icons8-triangle-48-2-white.png"
                    : "https://i.ibb.co/2hMjkBq/icons8-square-48.png"
                }
                className="w-3.5 ml-2"
              />
            </div>
          </div>
          <div className="coin-data-width">
            <div>24h%</div>
            <div onClick={handleSortByTwentyFourHours}>
              <img
                src={
                  sortOrderByPriceChange24hInQueryParams === "default"
                    ? "https://i.ibb.co/fpfHc9R/icons8-triangle-48-white.png"
                    : sortOrderByPriceChange24hInQueryParams === "ascent"
                    ? "https://i.ibb.co/pKrLjwn/icons8-triangle-48-2-white.png"
                    : "https://i.ibb.co/2hMjkBq/icons8-square-48.png"
                }
                className="w-3.5 ml-2"
              />
            </div>
          </div>
          <div className="coin-data-width">
            <div>7d%</div>
            <div onClick={handleSortBySevenDays}>
              <img
                src={
                  sortOrderByPriceChange7dInQueryParams === "default"
                    ? "https://i.ibb.co/fpfHc9R/icons8-triangle-48-white.png"
                    : sortOrderByPriceChange7dInQueryParams === "ascent"
                    ? "https://i.ibb.co/pKrLjwn/icons8-triangle-48-2-white.png"
                    : "https://i.ibb.co/2hMjkBq/icons8-square-48.png"
                }
                className="w-3.5 ml-2"
              />
            </div>
          </div>
          <div className="coin-column-width">24h volume/Market Cap</div>
          <div className="coin-column-width">Circulating/Total supply</div>
          <div className="coin-column-width">Last 7d</div>
        </div>
        {displayCoinList.map((singleCoin) => (
          <div key={singleCoin.id} className="individual-coin">
            <div className="coin-number-column-width">
              {displayCoinList.indexOf(singleCoin) + 1}
            </div>
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
            <div className="coin-data-width">
              {currencySymbol}
              {singleCoin.current_price &&
                singleCoin.current_price.toLocaleString()}
            </div>
            &nbsp;&nbsp;
            <div className="change-percentage-wrapper">
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
            <div className="change-percentage-wrapper">
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
            <div className="change-percentage-wrapper">
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
            <div className="coin-column-width">
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
            <div className="coin-column-width">
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

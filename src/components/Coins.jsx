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
import { PriceChangePercentageText } from "./PriceChangePercentageText";

const CoinTag = styled.img`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProgressBarOuter = styled.div`
  border-radius: 99px;
  background: ${(props) => `${props.background}80`};
  height: 8px;
  width: 100%;
`;

const ProgressBarInner = styled.div`
  border-radius: 99px;
  height: 8px;
  width: ${(props) => props.width * 100}%;
  background: ${(props) => props.background};
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
    changeSearchParams,
  } = useContext(CryptoContext);

  const [coinListIsLoading, setCoinListIsLoading] = useState(false);
  const [coinListLoadingHasError, setCoinListLoadingHasError] = useState(false);
  const [coinListDsc, setCoinListDsc] = useLocalState("coinListDsc", true);
  const [sortBy, setSortBy] = useLocalState("sortBy", "default");
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
      let coins;
      const order = (showTopFifty ? "market_cap_desc" : "market_cap_asc");
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
    changeSearchParams("show_top_fifty", true)
  };

  const setToAsc = () => {
    setCoinListDsc(false);
    changeSearchParams("show_top_fifty", false)
  };

  useEffect(() => {
    handleSearchParams("show_top_fifty", coinListDsc);
  }, []);

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

  const colors = ["#7878FA", "#D878FA", "#01F1E3"];

  const handleSortOrderByName = () => {
    if (sortOrderByName === "default") {
      setSortOrderByName("ascent");
      changeSearchParams("sort_order_by_name", "ascent")
    }
    if (sortOrderByName === "ascent") {
      setSortOrderByName("descent");
      changeSearchParams("sort_order_by_name", "descent")
    }
    if (sortOrderByName === "descent") {
      setSortOrderByName("default");
      changeSearchParams("sort_order_by_name", "default")
    }
  };

  const handleSortOrderByPrice = () => {
    if (sortOrderByPrice === "default") {
      setSortOrderByPrice("ascent");
      changeSearchParams("sort_order_by_price", "ascent")
    }
    if (sortOrderByPrice === "ascent") {
      setSortOrderByPrice("descent");
      changeSearchParams("sort_order_by_price", "descent")
    }
    if (sortOrderByPrice === "descent") {
      setSortOrderByPrice("default");
      changeSearchParams("sort_order_by_price", "default")
    }
  };

  const handleSortOrderByPriceChange1h = () => {
    if (sortOrderByPriceChange1h === "default") {
      setSortOrderByPriceChange1h("ascent");
      changeSearchParams("sort_order_by_price_change_1h", "ascent")
    }
    if (sortOrderByPriceChange1h === "ascent") {
      setSortOrderByPriceChange1h("descent");
      changeSearchParams("sort_order_by_price_change_1h", "descent")
    }
    if (sortOrderByPriceChange1h === "descent") {
      setSortOrderByPriceChange1h("default");
      changeSearchParams("sort_order_by_price_change_1h", "default")
    }
  };

  const handleSortOrderByPriceChange24h = () => {
    if (sortOrderByPriceChange24h === "default") {
      setSortOrderByPriceChange24h("ascent");
      changeSearchParams("sort_order_by_price_change_24h", "ascent")
    }
    if (sortOrderByPriceChange24h === "ascent") {
      setSortOrderByPriceChange24h("descent");
      changeSearchParams("sort_order_by_price_change_24h", "descent")
    }
    if (sortOrderByPriceChange24h === "descent") {
      setSortOrderByPriceChange24h("default");
      changeSearchParams("sort_order_by_price_change_24h", "default")
    }
  };

  const handleSortOrderByPriceChange7d = () => {
    if (sortOrderByPriceChange7d === "default") {
      setSortOrderByPriceChange7d("ascent");
      changeSearchParams("sort_order_by_price_change_7d", "ascent")
    }
    if (sortOrderByPriceChange7d === "ascent") {
      setSortOrderByPriceChange7d("descent");
      changeSearchParams("sort_order_by_price_change_7d", "descent")
    }
    if (sortOrderByPriceChange7d === "descent") {
      setSortOrderByPriceChange7d("default");
      changeSearchParams("sort_order_by_price_change_7d", "default")
    }
  };

  const handleSortByName = () => {
    if (sortBy !== "name") {
      setSortBy("name");     
    }
    changeSearchParams("sort_by", "name")
    handleSortOrderByName();
    setSortOrderByPrice("default");
    changeSearchParams("sort_order_by_price", "default")
    setSortOrderByPriceChange1h("default");
    changeSearchParams("sort_order_by_price_change_1h", "default")
    setSortOrderByPriceChange24h("default");
    changeSearchParams("sort_order_by_price_change_24h", "default")
    setSortOrderByPriceChange7d("default");
    changeSearchParams("sort_order_by_price_change_7d", "default")
  };

  const handleSortByPrice = () => {
    if (sortBy !== "current_price") {
      setSortBy("current_price");
    }
    changeSearchParams("sort_by", "current_price")
    handleSortOrderByPrice();
    setSortOrderByName("default");
    changeSearchParams("sort_order_by_name", "default")
    setSortOrderByPriceChange1h("default");
    changeSearchParams("sort_order_by_price_change_1h", "default")
    setSortOrderByPriceChange24h("default");
    changeSearchParams("sort_order_by_price_change_24h", "default")
    setSortOrderByPriceChange7d("default");
    changeSearchParams("sort_order_by_price_change_7d", "default")
  };

  const handleSortByOneHour = () => {
    if (sortBy !== "price_change_percentage_1h_in_currency") {
      setSortBy("price_change_percentage_1h_in_currency");
    }
    changeSearchParams("sort_by", "price_change_percentage_1h_in_currency")
    handleSortOrderByPriceChange1h();
    setSortOrderByName("default");
    changeSearchParams("sort_order_by_name", "default")
    setSortOrderByPrice("default");
    changeSearchParams("sort_order_by_price", "default")
    setSortOrderByPriceChange24h("default");
    changeSearchParams("sort_order_by_price_change_24h", "default")
    setSortOrderByPriceChange7d("default");
    changeSearchParams("sort_order_by_price_change_7d", "default")
  };

  const handleSortByTwentyFourHours = () => {
    if (sortBy !== "price_change_percentage_24h_in_currency") {
      setSortBy("price_change_percentage_24h_in_currency");
    }
    changeSearchParams("sort_by", "price_change_percentage_24h_in_currency")
    handleSortOrderByPriceChange24h();
    setSortOrderByName("default");
    changeSearchParams("sort_order_by_name", "default")
    setSortOrderByPrice("default");
    changeSearchParams("sort_order_by_price", "default")
    setSortOrderByPriceChange1h("default");
    changeSearchParams("sort_order_by_price_change_1h", "default")
    setSortOrderByPriceChange7d("default");
    changeSearchParams("sort_order_by_price_change_7d", "default")
  };

  const handleSortBySevenDays = () => {
    if (sortBy !== "price_change_percentage_7d_in_currency") {
      setSortBy("price_change_percentage_7d_in_currency");
    }
    changeSearchParams("sort_by", "price_change_percentage_7d_in_currency")
    handleSortOrderByPriceChange7d();
    setSortOrderByName("default");
    changeSearchParams("sort_order_by_name", "default")
    setSortOrderByPrice("default");
    changeSearchParams("sort_order_by_price", "default")
    setSortOrderByPriceChange1h("default");
    changeSearchParams("sort_order_by_price_change_1h", "default")
    setSortOrderByPriceChange24h("default");
    changeSearchParams("sort_order_by_price_change_24h", "default")
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
      (sortByInQueryParams === "default" &&
        sortOrderByNameInQueryParams === "default") ||
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
  }, []);

  const progressBarColors = [
    "#C27721",
    "#6374C3",
    "#30E0A1",
    "#F5AC37",
    "#F3EB2F",
    "#638FFE",
    "#4DEEE5",
    "#F06142",
    "#5082CF",
  ];

  const calculateColorIndex = (coin) => {
    return displayCoinList.indexOf(coin) % progressBarColors.length;
  };

  return (
    <div className="App">
      <div className="my-[20px]">
        <SlickCarousel coinList={coinList} />
      </div>

      {priceVolumeList.length === 0 &&
      priceVolumeChartIsLoadingHasError !== true ? (
        <div className="my-8 text-2xl flex justify-center">
          Please select a coin to view chart
        </div>
      ) : priceVolumeList.length === 0 &&
        priceVolumeChartIsLoadingHasError === true ? (
        <div className="my-8 text-2xl flex justify-center">
          Error fetching Price and Volumne Chart
        </div>
      ) : (
        <div>
          <div className="my-8 text-2xl flex justify-center">
            {priceVolumeChartIsLoading && (
              <div>Loading Price and Volumne Chart</div>
            )}
          </div>
          <div className="flex justify-center items-center max-w-[1440px] h-auto my-7">
            <div className="w-1/2 h-auto p-5 mr-7 bg-line-bar-chart-background rounded-md">
              {(priceVolumeChartIsLoadingHasError === false && !priceVolumeList.includes(null)) && (
                <LineChart priceVolumeList={priceVolumeList} />
              )}
              <div className="flex justify-between">
                {selectedCoinData &&
                  selectedCoinData.map((coin) => (
                    <div className="flex items-center mx-2.5 mt-2">
                      <ColorIndicator
                        background={colors[selectedCoinData.indexOf(coin)]}
                      ></ColorIndicator>
                      {coin.name}&nbsp;{currencySymbol}
                      {coin.current_price.toLocaleString()}
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-1/2 h-auto p-5 ml-7 bg-line-bar-chart-background rounded-md">
              {(priceVolumeChartIsLoadingHasError === false && !priceVolumeList.includes(null)) && (
                <BarChart priceVolumeList={priceVolumeList} />
              )}
              <div className="flex justify-between">
                {selectedCoinData &&
                  selectedCoinData.map((coin) => (
                    <div key={coin.id} className="flex items-center mx-1 mt-2">
                      <ColorIndicator
                        background={colors[selectedCoinData.indexOf(coin)]}
                      ></ColorIndicator>
                      {coin.name}&nbsp;{currencySymbol}
                      {convertToBillion(coin.total_volume)}B
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="my-8 text-2xl flex justify-center">
            {priceVolumeChartIsLoadingHasError && (
              <div>Error fetching Price and Volumne Chart</div>
            )}
          </div>
        </div>
      )}
      <div className="flex my-5 w-fit h-auto bg-button-unselected-search-bar-background rounded-md">
        <DaysButton days="2" buttonText="1D" />
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
              showTopFifty
                ? "selected-button"
                : "bg-button-unselected-search-bar-background"
            } flex justify-center items-center mr-5 h-10 w-44 rounded md cursor-pointer`}
            onClick={setToDsc}
          >
            {" "}
            Top 50{" "}
          </div>
          <div
            className={`${
              !showTopFifty
                ? "selected-button"
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
          <div className="w-[4%] pl-3 flex items-center">#</div>
          <div className="w-[15%] pr-2 flex justify-start items-center">
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
          <div className="w-[9%] pl-2 flex justify-start items-center">
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
          <div className="w-[9%] pl-2 flex justify-start items-center">
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
          <div className="w-[9%] pl-2 flex justify-start items-center">
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
          <div className="w-[9%] pl-2 flex justify-start items-center">
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
          <div className="w-[20%] pr-3.5 flex justify-start items-center">
            24h volume/Market Cap
          </div>
          <div className="w-[20%] pl-3.5 flex justify-start items-center">
            Circulating/Total supply
          </div>
          <div className="w-[15%] flex pl-7 justify-start items-center">
            Last 7d
          </div>
        </div>
        {displayCoinList.map((singleCoin) => (
          <div
            key={singleCoin.id}
            className="flex items-center h-20 my-2.5 bg-button-unselected-search-bar-background rounded-md font-space-grotesk"
          >
            <div className="w-[4%] pl-3 flex items-center">
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
            <div className="w-[9%] pl-2 flex justify-start items-center text-lg">
              {currencySymbol}
              {singleCoin.current_price &&
                singleCoin.current_price.toLocaleString()}
            </div>
            <div className="w-[9%] pl-2 flex justify-start items-center">
              {
                <Arrow
                  priceChange={
                    singleCoin.price_change_percentage_1h_in_currency
                  }
                />
              }
              <div className="ml-2">
                <PriceChangePercentageText
                  coin={singleCoin.price_change_percentage_1h_in_currency}
                />
              </div>
            </div>
            <div className="w-[9%] pl-2 flex justify-start items-center">
              {
                <Arrow
                  priceChange={
                    singleCoin.price_change_percentage_24h_in_currency
                  }
                />
              }
              <div className="ml-2">
                <PriceChangePercentageText
                  coin={singleCoin.price_change_percentage_24h_in_currency}
                />
              </div>
            </div>
            <div className="w-[9%] pl-2 flex justify-start items-center">
              {
                <Arrow
                  priceChange={
                    singleCoin.price_change_percentage_7d_in_currency
                  }
                />
              }
              <div className="ml-2">
                <PriceChangePercentageText
                  coin={singleCoin.price_change_percentage_7d_in_currency}
                />
              </div>
            </div>
            <div className="w-[20%] pr-3.5 flex justify-start items-center">
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
                  background={
                    progressBarColors[calculateColorIndex(singleCoin)]
                  }
                >
                  <ProgressBarInner
                    width={
                      singleCoin.market_cap_change_24h / singleCoin.market_cap
                    }
                    background={
                      progressBarColors[calculateColorIndex(singleCoin)]
                    }
                  ></ProgressBarInner>
                </ProgressBarOuter>
              </div>
            </div>
            <div className="w-[20%] pl-3.5 flex justify-start items-center">
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
                  background={
                    progressBarColors[calculateColorIndex(singleCoin)]
                  }
                >
                  <ProgressBarInner
                    width={
                      singleCoin.circulating_supply / singleCoin.total_supply
                    }
                    background={
                      progressBarColors[calculateColorIndex(singleCoin)]
                    }
                  ></ProgressBarInner>
                </ProgressBarOuter>
              </div>
            </div>
            <div className="w-[15%] pr-3 flex justify-end items-center">
              <div className="w-5/6 pt-6">
                <LineChartIndividualCoin
                  priceList={singleCoin.sparkline_in_7d.price}
                  color={progressBarColors[calculateColorIndex(singleCoin)]}
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

import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
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
import { Arrow } from "../components/Arrow";
import queryString from "query-string";

//Make query string, change the URL while clicking on the button, and use useEffect to make API call whenever the URL changes

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
  const [coinPage, setCoinPage] = useState(1);
  const [sortByNameDirection, setSortByNameDirection] = useState("default");
  const [sortByPriceDirection, setSortByPriceDirection] = useState("default");
  const [sortByOneHourDirection, setSortByOneHourDirection] =
    useState("default");
  const [sortByTwentyFourHoursDirection, setSortByTwentyFourHoursDirection] =
    useState("default");
  const [sortBySevenDaysDirection, setSortBySevenDaysDirection] =
    useState("default");
  const [displayCoinList, setDisplayCoinList] = useLocalState(
    "displayCoinList",
    []
  );
  //const sortedCoinList = [...coinList]

  //console.log(sortByNameDirection)
  //console.log(sortByOneHourDirection);

  //put API call into fetchData
  // put selectedCoins to cryptoContext, and currency(maybe already in Context, and call getCoinPriceVolume from fetchData)
  /*const fetchData = (conditions) => { 
    //console.log("API called with parameters:", 
    //queryString.stringify(conditions),
    //conditions);
    if (selectedCoinData.length === 0) {
      setPriceVolumeList([]);
    } else {
      setPriceVolumeList([]);
      const requests = selectedCoinData.map((item) => {
        return getCoinPriceVolume(item.id, displayCurrency, numOfDays);
      });
      Promise.all(requests).then((responses) => {
        setPriceVolumeList(responses);
      });
    }
  };*/

  const fetchData = (conditions) => {
    if (Object.keys(conditions).length === 0) {
      setPriceVolumeList([]);
    } else {
      setPriceVolumeList([]);
      const requests = Object.keys(conditions)
        .map((key) => {
          if (
            key.includes("selectedcoin")
          ) {
             return getCoinPriceVolume(
              conditions[key],
              conditions.displaycurrency,
              conditions.days
            );
          }
          return null;
        })
        .filter((request) => request !== null);

      Promise.all(requests).then((responses) => {
        //console.log(responses)
        setPriceVolumeList(responses);
      });
    }
  };

  useEffect(() => {
    fetchData(queryParams);
  }, [location.search]);

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
      setDisplayCoinList(coins)
      handleSearchParams("sort_order", "default")
      //set the sort_order to "default"
      /*setSortByNameDirection("default");
      setSortByPriceDirection("default");
      setSortByOneHourDirection("default");
      setSortByTwentyFourHoursDirection("default");
      setSortBySevenDaysDirection("default");*/
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

    const intervalId = setInterval(() => {
      getCoinList();
    }, 60000);

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

  console.log(queryParams);

  const handleSortByName = () => {
    if (!("sort_by" in queryParams) || queryParams.sort_order === "ascent") {
      handleSearchParams("sort_by", "name");
      handleSearchParams("sort_order", "descent");
    } else if (queryParams.sort_order === "descent") {
      handleSearchParams("sort_by", "name");
      handleSearchParams("sort_order", "default");
    } else if (queryParams.sort_order === "default") {
      handleSearchParams("sort_by", "name");
      handleSearchParams("sort_order", "ascent");
    }
  };

  const handleSortByPrice = () => {
    if (!("sort_by" in queryParams) || queryParams.sort_order === "ascent") {
      handleSearchParams("sort_by", "current_price");
      handleSearchParams("sort_order", "descent");
    } else if (queryParams.sort_order === "descent") {
      handleSearchParams("sort_by", "current_price");
      handleSearchParams("sort_order", "default");
    } else if (queryParams.sort_order === "default") {
      handleSearchParams("sort_by", "current_price");
      handleSearchParams("sort_order", "ascent");
    }
  };

  const handleSortByOneHour = () => {
    if (!("sort_by" in queryParams) || queryParams.sort_order === "ascent") {
      handleSearchParams("sort_by", "price_change_percentage_1h_in_currency");
      handleSearchParams("sort_order", "descent");
    } else if (queryParams.sort_order === "descent") {
      handleSearchParams("sort_by", "price_change_percentage_1h_in_currency");
      handleSearchParams("sort_order", "default");
    } else if (queryParams.sort_order === "default") {
      handleSearchParams("sort_by", "price_change_percentage_1h_in_currency");
      handleSearchParams("sort_order", "ascent");
    }
  };

  const handleSortByTwentyFourHours = () => {
    if (!("sort_by" in queryParams) || queryParams.sort_order === "ascent") {
      handleSearchParams("sort_by", "price_change_percentage_24h_in_currency");
      handleSearchParams("sort_order", "descent");
    } else if (queryParams.sort_order === "descent") {
      handleSearchParams("sort_by", "price_change_percentage_24h_in_currency");
      handleSearchParams("sort_order", "default");
    } else if (queryParams.sort_order === "default") {
      handleSearchParams("sort_by", "price_change_percentage_24h_in_currency");
      handleSearchParams("sort_order", "ascent");
    }
  };

  const handleSortBySevenDays= () => {
    if (!("sort_by" in queryParams) || queryParams.sort_order === "ascent") {
      handleSearchParams("sort_by", "price_change_percentage_7d_in_currency");
      handleSearchParams("sort_order", "descent");
    } else if (queryParams.sort_order === "descent") {
      handleSearchParams("sort_by", "price_change_percentage_7d_in_currency");
      handleSearchParams("sort_order", "default");
    } else if (queryParams.sort_order === "default") {
      handleSearchParams("sort_by", "price_change_percentage_7d_in_currency");
      handleSearchParams("sort_order", "ascent");
    }
  };

  //modify this sort by to make it more universal
  const sortCoinList = () => {
    const sortedCoinList = [...coinList];
    const sortBy = queryParams.sort_by;
    const sortOrder = queryParams.sort_order;
    //const property = `price_change_percentage_${sortBy}_in_currency`
    if (sortBy === "name" && sortOrder === "ascent") {
      sortedCoinList.sort((value1, value2) =>
        value1.name.localeCompare(value2.name)
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (sortBy === "name" && sortOrder === "descent") {
      sortedCoinList.sort((value1, value2) =>
        value2.name.localeCompare(value1.name)
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortBy === "current_price" ||
        sortBy === "price_change_percentage_1h_in_currency" ||
        sortBy === "price_change_percentage_24h_in_currency" ||
        sortBy === "price_change_percentage_7d_in_currency") &&
      sortOrder === "ascent"
    ) {
      //const property = `price_change_percentage_${sortBy}_in_currency`
      sortedCoinList.sort((value1, value2) => value1[sortBy] - value2[sortBy]);
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortBy === "current_price" ||
        sortBy === "price_change_percentage_1h_in_currency" ||
        sortBy === "price_change_percentage_24h_in_currency" ||
        sortBy === "price_change_percentage_7d_in_currency") &&
      sortOrder === "descent"
    ) {
      //const property = `price_change_percentage_${sortBy}_in_currency`
      sortedCoinList.sort((value1, value2) => value2[sortBy] - value1[sortBy]);
      setDisplayCoinList(sortedCoinList);
    }
    if (
      (sortBy === "name" ||
        sortBy === "current_price" ||
        sortBy === "price_change_percentage_1h_in_currency" ||
        sortBy === "price_change_percentage_24h_in_currency" ||
        sortBy === "price_change_percentage_7d_in_currency") &&
      sortOrder === "default"
    ) {
      setDisplayCoinList(coinList);
    }
  };

  /*const sortByName = () => {
    const sortedCoinList = [...coinList];
    if (sortByNameDirection === "default") {
      setDisplayCoinList(coinList);
    }
    if (sortByNameDirection === "name ascent") {
      sortedCoinList.sort((value1, value2) =>
        value1.name.localeCompare(value2.name)
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (sortByNameDirection === "name descent") {
      sortedCoinList.sort((value1, value2) =>
        value2.name.localeCompare(value1.name)
      );
      setDisplayCoinList(sortedCoinList);
    }
  };

  const sortByPrice = () => {
    const sortedCoinList = [...coinList];
    if (sortByPriceDirection === "default") {
      setDisplayCoinList(coinList);
    }
    if (sortByPriceDirection === "price ascent") {
      sortedCoinList.sort(
        (value1, value2) => value1.current_price - value2.current_price
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (sortByPriceDirection === "price descent") {
      sortedCoinList.sort(
        (value1, value2) => value2.current_price - value1.current_price
      );
      setDisplayCoinList(sortedCoinList);
    }
  };

  const sortByOneHour = () => {
    const sortedCoinList = [...coinList];
    if (sortByOneHourDirection === "default") {
      setDisplayCoinList(coinList);
    }
    if (sortByOneHourDirection === "1h ascent") {
      sortedCoinList.sort(
        (value1, value2) =>
          value1.price_change_percentage_1h_in_currency -
          value2.price_change_percentage_1h_in_currency
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (sortByOneHourDirection === "1h descent") {
      sortedCoinList.sort(
        (value1, value2) =>
          value2.price_change_percentage_1h_in_currency -
          value1.price_change_percentage_1h_in_currency
      );
      setDisplayCoinList(sortedCoinList);
    }
  };

  const sortByTwentyFourHours = () => {
    const sortedCoinList = [...coinList];
    if (sortByTwentyFourHoursDirection === "default") {
      setDisplayCoinList(coinList);
    }
    if (sortByTwentyFourHoursDirection === "24h ascent") {
      sortedCoinList.sort(
        (value1, value2) =>
          value1.price_change_percentage_24h_in_currency -
          value2.price_change_percentage_24h_in_currency
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (sortByTwentyFourHoursDirection === "24h descent") {
      sortedCoinList.sort(
        (value1, value2) =>
          value2.price_change_percentage_24h_in_currency -
          value1.price_change_percentage_24h_in_currency
      );
      setDisplayCoinList(sortedCoinList);
    }
  };

  const sortBySevenDays = () => {
    const sortedCoinList = [...coinList];
    if (sortBySevenDaysDirection === "default") {
      setDisplayCoinList(coinList);
    }
    if (sortBySevenDaysDirection === "7d ascent") {
      sortedCoinList.sort(
        (value1, value2) =>
          value1.price_change_percentage_7d_in_currency -
          value2.price_change_percentage_7d_in_currency
      );
      setDisplayCoinList(sortedCoinList);
    }
    if (sortBySevenDaysDirection === "7d descent") {
      sortedCoinList.sort(
        (value1, value2) =>
          value2.price_change_percentage_7d_in_currency -
          value1.price_change_percentage_7d_in_currency
      );
      setDisplayCoinList(sortedCoinList);
    }
  };*/

  //console.log("displayCoinList", displayCoinList);

  useEffect(() => {
    sortCoinList();
  }, [queryParams.sort_order]);

  /*useEffect(() => {
    sortByName();
  }, [sortByNameDirection, coinList]);

  useEffect(() => {
    sortByPrice();
  }, [sortByPriceDirection, coinList]);

  useEffect(() => {
    sortByOneHour();
  }, [sortByOneHourDirection, coinList]);

  useEffect(() => {
    sortByTwentyFourHours();
  }, [sortByTwentyFourHoursDirection, coinList]);

  useEffect(() => {
    sortBySevenDays();
  }, [sortBySevenDaysDirection, coinList]);*/

  useEffect(()=> {
    handleSearchParams("days", numOfDays)
  }, [numOfDays])

  return (
    <div className="App">
      <div className="slick-carousel">
        <SlickCarousel coinList={coinList} />
      </div>
      <div>
        <button
          onClick={() => {
            setNumOfDays(0);
            //handleSearchParams("days", "0");
          }}
        >
          {" "}
          1 Day{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(6);
            //handleSearchParams("days", "6");
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
            //handleSearchParams("days", "30");
          }}
        >
          {" "}
          1 Month{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(89);
            //handleSearchParams("days", "90");
          }}
        >
          {" "}
          90 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(179);
            //handleSearchParams("days", "179");
          }}
        >
          {" "}
          180 Days{" "}
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setNumOfDays(364);
            //handleSearchParams("days", "364");
          }}
        >
          {" "}
          1 Year{" "}
        </button>
        &nbsp;&nbsp;
        <button onClick={clearSearchParams}>Clear Search Criteria</button>
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
            <div>Name</div>&nbsp;
            <button onClick={handleSortByName}>sort</button>
          </div>
          <div className="coin-data-width">
            <div>Price</div>
            <button onClick={handleSortByPrice}>sort</button>
          </div>
          <div className="coin-data-width">
            <div>1h%</div>
            <button onClick={handleSortByOneHour}>sort</button>
          </div>
          <div className="coin-data-width">
            <div>24h%</div>
            <button onClick={handleSortByTwentyFourHours}>sort</button>
          </div>
          <div className="coin-data-width">
            <div>7d%</div>
            <button onClick={handleSortBySevenDays}>sort</button>
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
            {/*&nbsp;&nbsp;*/}
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

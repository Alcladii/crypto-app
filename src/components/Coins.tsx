import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import "../App.css";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import api from "../api";
import LineChartIndividualCoin from "./LineChartIndividualCoin";
import { SlickCarousel } from "./SlickCarousel";
import { Arrow } from "./UI/Arrow";
import { DaysButton } from "./DaysButton";
import { PriceChangePercentageText } from "./PriceChangePercentageText";
import { UpAndDownPercentagePeriodSelector } from "./UpAndDownPercentagePeriodSelector";
import { SortArrowAccent } from "../components/UI/Svg";
import { SortArrowDescent } from "../components/UI/Svg";
import { SortArrowOriginal } from "../components/UI/Svg";

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

const ColorIndicator = styled.div<{ background: string }>`
  height: 10px;
  width: 15px;
  background: ${(props) => props.background};
`;

type DaysSelectionData = {
  days: string;
  buttonText: string;
};

const daysSelectionData: DaysSelectionData[] = [
  { days: "2", buttonText: "1D" },
  { days: "7", buttonText: "7D" },
  { days: "30", buttonText: "1M" },
  { days: "90", buttonText: "90D" },
  { days: "180", buttonText: "180D" },
  { days: "365", buttonText: "1Y" },
];

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

function Coins() {
  const {
    useLocalState,
    convertToBillion,
    displayCurrency,
    currencySymbol,
    getCurrencyList,
    currencyList,
    numOfDays,
    priceVolumeChartIsLoading,
    priceVolumeChartIsLoadingHasError,
    priceVolumeList,
    selectedCoinData,
    coinList,
    setCoinList,
    handleSearchParams,
    queryParams,
    changeSearchParams,
    darkMode,
    setRedirectedFromPortfolioPage,
  } = useContext(CryptoContext) as CryptoContextProps;

  const [coinListIsLoading, setCoinListIsLoading] = useState(false);
  const [coinListLoadingHasError, setCoinListLoadingHasError] = useState(false);
  const [coinListDsc, setCoinListDsc] = useLocalState<boolean>(
    "coinListDsc",
    true
  );
  const [sortBy, setSortBy] = useLocalState<string>("sortBy", "default");
  const [displayCoinList, setDisplayCoinList] = useLocalState<Coin[]>(
    "displayCoinList",
    []
  );
  const [sortOrderByName, setSortOrderByName] = useLocalState<string>(
    "sortOrderByName",
    "default"
  );
  const [sortOrderByPrice, setSortOrderByPrice] = useLocalState<string>(
    "sortOrderByPrice",
    "default"
  );
  const [sortOrderByPriceChange1h, setSortOrderByPriceChange1h] =
    useLocalState<string>("sortOrderByPriceChange1h", "default");
  const [sortOrderByPriceChange24h, setSortOrderByPriceChange24h] =
    useLocalState<string>("sortOrderByPriceChange24h", "default");
  const [sortOrderByPriceChange7d, setSortOrderByPriceChange7d] =
    useLocalState<string>("sortOrderByPriceChange7d", "default");
  const [
    displaySelectCoinToSeeChartMessage,
    setDisplaySelectCoinToSeeChartMessage,
  ] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsticky] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("1h");

  const showTopFifty = queryParams.show_top_fifty === "true";

  const getCoinList = async () => {
    try {
      let coins;
      const order = (showTopFifty || !queryParams.show_top_fifty) ? "market_cap_desc" : "market_cap_asc";
      setCoinListIsLoading(true);
      const response = await api(
        `/coins/markets`,
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
    changeSearchParams("show_top_fifty", "true");
  };

  const setToAsc = () => {
    setCoinListDsc(false);
    changeSearchParams("show_top_fifty", "false");
  };

  useEffect(() => {
    handleSearchParams("show_top_fifty", "true");
  }, [coinListDsc]);

  useEffect(() => {
    getCoinList();

    const minute = 60000;

    const intervalId = setInterval(() => {
      getCoinList();
    }, minute);

    return () => clearInterval(intervalId);
  }, [coinListDsc, showTopFifty]);

  useEffect(() => {
    if (currencyList.length === 0){
      getCurrencyList();
    }   
  }, []);

  const navigate = useNavigate();

  const handleClick = (item: Coin) => {
    navigate(`/coin-page/${item.id}`);
    setRedirectedFromPortfolioPage(false);
  };

  const colors = ["#7878FA", "#D878FA", "#01F1E3"];

  const handleSortOrderByName = () => {
    if (sortOrderByName === "default") {
      setSortOrderByName("ascent");
      changeSearchParams("sort_order_by_name", "ascent");
    } else if (sortOrderByName === "ascent") {
      setSortOrderByName("descent");
      changeSearchParams("sort_order_by_name", "descent");
    } else {
      setSortOrderByName("default");
      changeSearchParams("sort_order_by_name", "default");
    }
  };

  const handleSortOrderByPrice = () => {
    if (sortOrderByPrice === "default") {
      setSortOrderByPrice("ascent");
      changeSearchParams("sort_order_by_price", "ascent");
    } else if (sortOrderByPrice === "ascent") {
      setSortOrderByPrice("descent");
      changeSearchParams("sort_order_by_price", "descent");
    } else {
      setSortOrderByPrice("default");
      changeSearchParams("sort_order_by_price", "default");
    }
  };

  const handleSortOrderByPriceChange1h = () => {
    if (sortOrderByPriceChange1h === "default") {
      setSortOrderByPriceChange1h("ascent");
      changeSearchParams("sort_order_by_price_change_1h", "ascent");
    } else if (sortOrderByPriceChange1h === "ascent") {
      setSortOrderByPriceChange1h("descent");
      changeSearchParams("sort_order_by_price_change_1h", "descent");
    } else {
      setSortOrderByPriceChange1h("default");
      changeSearchParams("sort_order_by_price_change_1h", "default");
    }
  };

  const handleSortOrderByPriceChange24h = () => {
    if (sortOrderByPriceChange24h === "default") {
      setSortOrderByPriceChange24h("ascent");
      changeSearchParams("sort_order_by_price_change_24h", "ascent");
    } else if (sortOrderByPriceChange24h === "ascent") {
      setSortOrderByPriceChange24h("descent");
      changeSearchParams("sort_order_by_price_change_24h", "descent");
    } else {
      setSortOrderByPriceChange24h("default");
      changeSearchParams("sort_order_by_price_change_24h", "default");
    }
  };

  const handleSortOrderByPriceChange7d = () => {
    if (sortOrderByPriceChange7d === "default") {
      setSortOrderByPriceChange7d("ascent");
      changeSearchParams("sort_order_by_price_change_7d", "ascent");
    } else if (sortOrderByPriceChange7d === "ascent") {
      setSortOrderByPriceChange7d("descent");
      changeSearchParams("sort_order_by_price_change_7d", "descent");
    } else {
      setSortOrderByPriceChange7d("default");
      changeSearchParams("sort_order_by_price_change_7d", "default");
    }
  };

  const handleSortByName = () => {
    if (sortBy !== "name") {
      setSortBy("name");
    }
    changeSearchParams("sort_by", "name");
    handleSortOrderByName();
    setSortOrderByPrice("default");
    changeSearchParams("sort_order_by_price", "default");
    setSortOrderByPriceChange1h("default");
    changeSearchParams("sort_order_by_price_change_1h", "default");
    setSortOrderByPriceChange24h("default");
    changeSearchParams("sort_order_by_price_change_24h", "default");
    setSortOrderByPriceChange7d("default");
    changeSearchParams("sort_order_by_price_change_7d", "default");
  };

  const handleSortByPrice = () => {
    if (sortBy !== "current_price") {
      setSortBy("current_price");
    }
    changeSearchParams("sort_by", "current_price");
    handleSortOrderByPrice();
    setSortOrderByName("default");
    changeSearchParams("sort_order_by_name", "default");
    setSortOrderByPriceChange1h("default");
    changeSearchParams("sort_order_by_price_change_1h", "default");
    setSortOrderByPriceChange24h("default");
    changeSearchParams("sort_order_by_price_change_24h", "default");
    setSortOrderByPriceChange7d("default");
    changeSearchParams("sort_order_by_price_change_7d", "default");
  };

  const handleSortByOneHour = () => {
    if (sortBy !== "price_change_percentage_1h_in_currency") {
      setSortBy("price_change_percentage_1h_in_currency");
    }
    changeSearchParams("sort_by", "price_change_percentage_1h_in_currency");
    handleSortOrderByPriceChange1h();
    setSortOrderByName("default");
    changeSearchParams("sort_order_by_name", "default");
    setSortOrderByPrice("default");
    changeSearchParams("sort_order_by_price", "default");
    setSortOrderByPriceChange24h("default");
    changeSearchParams("sort_order_by_price_change_24h", "default");
    setSortOrderByPriceChange7d("default");
    changeSearchParams("sort_order_by_price_change_7d", "default");
  };

  const handleSortByTwentyFourHours = () => {
    if (sortBy !== "price_change_percentage_24h_in_currency") {
      setSortBy("price_change_percentage_24h_in_currency");
    }
    changeSearchParams("sort_by", "price_change_percentage_24h_in_currency");
    handleSortOrderByPriceChange24h();
    setSortOrderByName("default");
    changeSearchParams("sort_order_by_name", "default");
    setSortOrderByPrice("default");
    changeSearchParams("sort_order_by_price", "default");
    setSortOrderByPriceChange1h("default");
    changeSearchParams("sort_order_by_price_change_1h", "default");
    setSortOrderByPriceChange7d("default");
    changeSearchParams("sort_order_by_price_change_7d", "default");
  };

  const handleSortBySevenDays = () => {
    if (sortBy !== "price_change_percentage_7d_in_currency") {
      setSortBy("price_change_percentage_7d_in_currency");
    }
    changeSearchParams("sort_by", "price_change_percentage_7d_in_currency");
    handleSortOrderByPriceChange7d();
    setSortOrderByName("default");
    changeSearchParams("sort_order_by_name", "default");
    setSortOrderByPrice("default");
    changeSearchParams("sort_order_by_price", "default");
    setSortOrderByPriceChange1h("default");
    changeSearchParams("sort_order_by_price_change_1h", "default");
    setSortOrderByPriceChange24h("default");
    changeSearchParams("sort_order_by_price_change_24h", "default");
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
    } else if (
      sortByInQueryParams === "name" &&
      sortOrderByNameInQueryParams === "descent"
    ) {
      sortedCoinList.sort((value1, value2) =>
        value2[sortByInQueryParams].localeCompare(value1[sortByInQueryParams])
      );
      setDisplayCoinList(sortedCoinList);
    } else if (
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
    } else if (
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
    } else if (
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
  }, [numOfDays]);

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

  const calculateColorIndex = (coin: Coin) => {
    return displayCoinList.indexOf(coin) % progressBarColors.length;
  };

  useEffect(() => {
    if (tableRef.current) {
      const observer = new IntersectionObserver(
        ([e]) => setIsticky(e.intersectionRatio < 1),
        {
          rootMargin: "0px 0px 100% 0px",
          threshold: [1],
        }
      );

      observer.observe(tableRef.current);
    }
  }, []);

  return (
    <div className={`${darkMode ? "" : "theme-light"} max-w-[1296px]`}>
      <div className="my-5">
        <SlickCarousel
          coinList={coinList}
          setDisplaySelectCoinToSeeChartMessage={
            setDisplaySelectCoinToSeeChartMessage
          }
        />
      </div>
      {priceVolumeList.length === 0 && displaySelectCoinToSeeChartMessage ? (
        <div className="my-8 text-2xl flex justify-center text-skin-prompt-text-color">
          Please select a coin to view chart
        </div>
      ) : (
        <div>
          <div className="my-8 text-2xl flex justify-center text-skin-prompt-text-color">
            {priceVolumeChartIsLoading && (
              <div>Loading Price and Volume Chart</div>
            )}
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center h-auto my-7">
            <div className="w-full md:w-1/2 h-auto p-5 mr-0 md:mr-7 mb-3 md:mb-0 bg-skin-charts-background-color rounded-md">
              {priceVolumeList.length !== 0 &&
                !priceVolumeList.includes(undefined) &&
                !priceVolumeList.includes(null) && (
                  <LineChart priceVolumeList={priceVolumeList} />
                )}
              <div className="flex justify-between flex-col lg:flex-row">
                {selectedCoinData &&
                  selectedCoinData.map((coin) => (
                    <div
                      key={coin.id}
                      className="flex items-center mx-2.5 mt-2 text-skin-chart-color-indicator-text-color"
                    >
                      <ColorIndicator
                        background={colors[selectedCoinData.indexOf(coin)]}
                      ></ColorIndicator>
                      &nbsp;{coin.name}&nbsp;{currencySymbol}
                      {coin.current_price.toLocaleString()}
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 h-auto p-5 mr-0 md:ml-7 mt-3 md:mt-0 bg-skin-charts-background-color rounded-md">
              {priceVolumeList.length !== 0 &&
                !priceVolumeList.includes(undefined) &&
                !priceVolumeList.includes(null) && (
                  <BarChart priceVolumeList={priceVolumeList} />
                )}
              <div className="flex justify-between flex-col lg:flex-row">
                {selectedCoinData &&
                  selectedCoinData.map((coin) => (
                    <div
                      key={coin.id}
                      className="flex items-center mx-1 mt-2 text-skin-chart-color-indicator-text-color"
                    >
                      <ColorIndicator
                        background={colors[selectedCoinData.indexOf(coin)]}
                      ></ColorIndicator>
                      &nbsp;{coin.name}&nbsp;{currencySymbol}
                      {convertToBillion(coin.total_volume)}B
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {(priceVolumeList.length === 0 &&
            priceVolumeChartIsLoadingHasError) ||
            (priceVolumeChartIsLoadingHasError && (
              <div className="my-8 text-2xl flex justify-center text-skin-prompt-text-color">
                Error fetching Price and Volume Chart
              </div>
            ))}
        </div>
      )}
      <div className="flex my-5 w-full sm:w-fit h-auto bg-skin-days-bar-background-color rounded-md">
        {daysSelectionData.map((item) => (
          <DaysButton
            key={item.days}
            days={item.days}
            buttonText={item.buttonText}
          />
        ))}
      </div>
      <div>
        <div className="flex justify-center my-6">
          <div
            className={`${
              showTopFifty
                ? "bg-skin-carousel-selected-button-background-color"
                : "bg-skin-carousel-unselected-button-background-color"
            } flex justify-center items-center mr-5 h-10 w-44 rounded md cursor-pointer ${
              showTopFifty
                ? "text-skin-days-button-top-bottom-fifty-text-color"
                : "text-skin-unselected-days-top-bottom-fifty-button-text-color"
            }`}
            onClick={setToDsc}
          >
            {" "}
            Top 50{" "}
          </div>
          <div
            className={`${
              !showTopFifty
                ? "bg-skin-carousel-selected-button-background-color"
                : "bg-skin-carousel-unselected-button-background-color"
            } flex justify-center items-center ml-5 h-10 w-44 rounded-md cursor-pointer ${
              !showTopFifty
                ? "text-skin-days-button-top-bottom-fifty-text-color"
                : "text-skin-unselected-days-top-bottom-fifty-button-text-color"
            }`}
            onClick={setToAsc}
          >
            {" "}
            Bottom 50{" "}
          </div>
        </div>
        <div className="sm:hidden flex justify-between items-center mb-5 text-skin-prompt-text-color font-space-grotesk ">
          <div className="text-xl">Market Overview</div>
          <UpAndDownPercentagePeriodSelector
            selectedTimePeriod={selectedTimePeriod}
            setSelectedTimePeriod={setSelectedTimePeriod}
          />
        </div>
        {coinListIsLoading && (
          <div className="flex justify-center my-5">Loading Coin List</div>
        )}
        <div className="no-scrollbar">
          <div
            ref={tableRef}
            className={`flex ${
              darkMode ? "" : "theme-light"
            } text-skin-coin-list-titles-text-color w-full sticky  -top-[2px] ${
              isSticky
                ? "bg-skin-sticky-coins-table-title-bar-background-color h-16"
                : ""
            }`}
          >
            <div className="md:w-[6%] lg:w-[5%] xl:w-[4%] min-w-12 pl-3 items-center hidden md:flex ">
              #
            </div>
            <div className="w-[35%] sm:w-[35%] md:w-[21%] lg:w-[18%] xl:w-[15%] min-w-32 pr-2 flex justify-start items-center">
              <div className="mr-1 pl-3 md:pl-0">Name</div>
              <div onClick={handleSortByName}>
                {sortOrderByNameInQueryParams === "default" ? (
                  <SortArrowAccent />
                ) : sortOrderByNameInQueryParams === "ascent" ? (
                  <SortArrowDescent />
                ) : (
                  <SortArrowOriginal />
                )}
              </div>
            </div>
            <div className="w-[35%] sm:hidden min-w-32 flex justify-start items-center">
              Last 7d
            </div>
            <div className="w-[30%] sm:w-[20%] md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 flex justify-start items-center">
              <div className="mr-1">Price</div>
              <div onClick={handleSortByPrice}>
                {sortOrderByPriceInQueryParams === "default" ? (
                  <SortArrowAccent />
                ) : sortOrderByPriceInQueryParams === "ascent" ? (
                  <SortArrowDescent />
                ) : (
                  <SortArrowOriginal />
                )}
              </div>
            </div>
            <div className="w-[25%] sm:w-[20%] md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center hidden sm:flex">
              <div className="mr-1">1h%</div>
              <div onClick={handleSortByOneHour}>
                {sortOrderByPriceChange1hInQueryParams === "default" ? (
                  <SortArrowAccent />
                ) : sortOrderByPriceChange1hInQueryParams === "ascent" ? (
                  <SortArrowDescent />
                ) : (
                  <SortArrowOriginal />
                )}
              </div>
            </div>
            <div className="md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center hidden md:flex">
              <div className="mr-1">24h%</div>
              <div onClick={handleSortByTwentyFourHours}>
                {sortOrderByPriceChange24hInQueryParams === "default" ? (
                  <SortArrowAccent />
                ) : sortOrderByPriceChange24hInQueryParams === "ascent" ? (
                  <SortArrowDescent />
                ) : (
                  <SortArrowOriginal />
                )}
              </div>
            </div>
            <div className="md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center hidden md:flex">
              <div className="mr-1">7d%</div>
              <div onClick={handleSortBySevenDays}>
                {sortOrderByPriceChange7dInQueryParams === "default" ? (
                  <SortArrowAccent />
                ) : sortOrderByPriceChange7dInQueryParams === "ascent" ? (
                  <SortArrowDescent />
                ) : (
                  <SortArrowOriginal />
                )}
              </div>
            </div>
            <div className="xl:w-[20%] lg:w-[24%] min-w-44 pr-3.5 justify-start items-center hidden lg:flex">
              24h volume/Market Cap
            </div>
            <div className="w-[20%] min-w-44 pl-3.5 justify-start items-center hidden xl:flex">
              Circulating/Total supply
            </div>
            <div className="hidden sm:flex sm:w-[25%] md:w-[21%] lg:w-[18%] xl:w-[15%] min-w-32 pl-7 justify-start items-center">
              Last 7d
            </div>
          </div>
          {displayCoinList.map((singleCoin) => (
            <div
              key={singleCoin.id}
              className="flex items-center h-20 my-2.5 w-full bg-button-unselected-search-bar-background rounded-md font-space-grotesk bg-skin-coin-list-background-color"
            >
              <div className="md:w-[6%] lg:w-[5%] xl:w-[4%] min-w-12 pl-3 items-center text-skin-coin-list-text-color hidden md:flex">
                {displayCoinList.indexOf(singleCoin) + 1}
              </div>
              <div
                className="w-[35%] sm:w-[35%] md:w-[21%] lg:w-[18%] xl:w-[15%] min-w-32 pr-2 flex justify-start items-center pl-3 md:pl-0"
                onClick={() => handleClick(singleCoin)}
              >
                <div className="flex items-center text-skin-coin-list-text-color">
                  <CoinTag src={singleCoin.image} />
                  &nbsp;&nbsp;
                  <div className="flex flex-col-reverse md:flex-col">
                    <div className="text-sm sm:text-lg text-mobile-view-coin-name-text-color sm:text-skin-coin-list-text-color">
                      {singleCoin.name}
                    </div>
                    <div className="sm:flex text-xl sm:text-lg">
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
                    color={progressBarColors[calculateColorIndex(singleCoin)]}
                  />
                </div>
              </div>
              <div className="w-[30%] sm:w-[20%] md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center text-lg text-skin-coin-list-text-color">
                <div className="text-lg">
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
                  priceChange={
                    singleCoin.price_change_percentage_1h_in_currency
                  }
                />
                <div className="ml-1">
                  <PriceChangePercentageText
                    coin={singleCoin.price_change_percentage_1h_in_currency}
                  />
                </div>
              </div>
              <div className="md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center hidden md:flex">
                <Arrow
                  priceChange={
                    singleCoin.price_change_percentage_24h_in_currency
                  }
                />
                <div className="ml-1">
                  <PriceChangePercentageText
                    coin={singleCoin.price_change_percentage_24h_in_currency}
                  />
                </div>
              </div>
              <div className="md:w-[13%] lg:w-[11%] xl:w-[9%] min-w-24 pl-2 justify-start items-center hidden md:flex">
                <Arrow
                  priceChange={
                    singleCoin.price_change_percentage_7d_in_currency
                  }
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
              <div className="hidden sm:flex sm:w-[25%] md:w-[21%] lg:w-[18%] xl:w-[15%] min-w-32 pr-3 justify-end items-center">
                <div className="w-5/6 pt-6">
                  <LineChartIndividualCoin
                    priceList={singleCoin.sparkline_in_7d.price}
                    color={progressBarColors[calculateColorIndex(singleCoin)]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {coinListLoadingHasError && <div>Error in fetching Coins List</div>}
      </div>
    </div>
  );
}

export default Coins;

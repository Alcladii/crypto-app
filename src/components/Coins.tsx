import { useState, useEffect, useContext, useRef, useMemo } from "react";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import "../App.css";
//import LineChart from "./LineChart";
//import BarChart from "./BarChart";
import { SlickCarousel } from "./SlickCarousel";
import { DaysButton } from "./DaysButton";
import { UpAndDownPercentagePeriodSelector } from "./UpAndDownPercentagePeriodSelector";
import { SortArrowAccent } from "../components/UI/Svg";
import { SortArrowDescent } from "../components/UI/Svg";
import { SortArrowOriginal } from "../components/UI/Svg";
import { useCoinDataQuery } from "../hooks/useCoinDataQuery";
import { useShowTopFifty } from "../hooks/showTopFifty";
import { useInfiniteCoinsListScroll } from "../hooks/useInfiniteCoinsListScroll";
import { CoinsListItem } from "../components/CoinsListItem";
import { ChartsPanel } from "../components/ChartsPanel"
import { DataPeriodSelector } from "./DataPeriodSelector";

const ColorIndicator = styled.div<{ background: string }>`
  height: 10px;
  width: 15px;
  background: ${(props) => props.background};
`;

// type DaysSelectionData = {
//   days: string;
//   buttonText: string;
// };

// const daysSelectionData: DaysSelectionData[] = [
//   { days: "2", buttonText: "1D" },
//   { days: "7", buttonText: "7D" },
//   { days: "30", buttonText: "1M" },
//   { days: "90", buttonText: "90D" },
//   { days: "180", buttonText: "180D" },
//   { days: "365", buttonText: "1Y" },
// ];

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
    selectedCoinData,
    handleSearchParams,
    queryParams,
    changeSearchParams,
    darkMode,
    selectedCoinIds,
    numOfDaysFromUrl,
  } = useContext(CryptoContext) as CryptoContextProps;

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
  const showTopFifty = useShowTopFifty();
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCoinsListScroll();

  const flattenedData = useMemo(() => {
    return data?.pages ? data.pages.flat() : [];
  }, [data]);

  const { ref, inView } = useInView({rootMargin: "1250px"});

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  console.log(
    "inview",
    inView,
    "hasNextPage",
    hasNextPage,
    "isFetchingNextPage",
    isFetchingNextPage
  );

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
    if (currencyList.length === 0) {
      getCurrencyList();
    }
  }, []);

  //const colors = ["#7878FA", "#D878FA", "#01F1E3"];

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
    const sortedCoinList = flattenedData ? [...flattenedData] : [];

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
      setDisplayCoinList(flattenedData || []);
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
    flattenedData,
  ]);

  // useEffect(() => {
  //   handleSearchParams("days", numOfDays);
  // }, [numOfDays]);

  // useEffect(() => {
  //   handleSearchParams("days", "7");
  // }, []);

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

  // const priceVolumeList = useCoinDataQuery(
  //   selectedCoinIds,
  //   displayCurrency,
  //   numOfDaysFromUrl
  // ).map((r) => r.data);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  // return (
  //   <div>
  //     {/* {data?.pages.map((items, pageIndex) => (
        
  //       <div key={pageIndex}> */}
  //         {flattenedData.map((coin: any, index: number) => {
  //           //const globalIndex = pageIndex * 50 + index;
  //           if (flattenedData.length == index + 1) {
  //             return (
  //               // <div ref={ref} className="text-base text-white" key={coin.id} >
  //               //   {globalIndex +1}&nbsp;{coin.name}
  //               // </div>
  //                <CoinsListItem
  //                 key={index}
  //                 singleCoin={coin}
  //                 innerRef={ref}
  //                 index={index}
  //                 color={progressBarColors[index % progressBarColors.length]}
  //                 selectedTimePeriod={selectedTimePeriod}
  //                />
  //             );
  //           }
  //           return (
  //             // <div className="text-base text-white" key={coin.id}>
  //             //   {globalIndex + 1}&nbsp;{coin.name}
  //             // </div>
  //              <CoinsListItem
  //               key={index}
  //               singleCoin={coin}
  //               index={index}
  //               color={progressBarColors[index % progressBarColors.length]}
  //               selectedTimePeriod={selectedTimePeriod}
  //             />
  //           );
  //         })}
  //       {/* </div> */}
  //     {/* ))} */}
  //   </div>
  // );

  return (
    <div
      className={`${
        darkMode ? "" : "theme-light"
      } max-w-[1296px] font-space-grotesk text-base`}
    >
      <div className="my-5">
        <SlickCarousel
          coinList={displayCoinList}
          // setDisplaySelectCoinToSeeChartMessage={
          //   setDisplaySelectCoinToSeeChartMessage
          // }
        />
      </div>
      <ChartsPanel />
      <DataPeriodSelector />
      {/* {priceVolumeList.length === 0 && displaySelectCoinToSeeChartMessage ? (
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
          <div className="flex flex-col md:flex-row justify-center items-center h-auto my-7 text-sm xl:text-base">
            <div className="w-full md:w-1/2 h-auto p-5 mr-0 md:mr-7 mb-3 md:mb-0 bg-skin-charts-background-color rounded-md">
              {priceVolumeList.length !== 0 &&
                priceVolumeList.every(
                  (item) => item !== undefined && item !== null
                ) && <LineChart priceVolumeList={priceVolumeList} />}
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
                priceVolumeList.every(
                  (item) => item !== undefined && item !== null
                ) && <BarChart priceVolumeList={priceVolumeList} />}
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
      )} */}
      {/* <div className="flex my-5 w-full sm:w-fit h-auto bg-skin-days-bar-background-color rounded-md">
        {daysSelectionData.map((item) => (
          <DaysButton
            key={item.days}
            days={item.days}
            buttonText={item.buttonText}
          />
        ))}
      </div> */}
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
        <div className="sm:hidden flex justify-between items-center mb-5 text-skin-prompt-text-color ">
          <div className="text-xl">Market Overview</div>
          <UpAndDownPercentagePeriodSelector
            selectedTimePeriod={selectedTimePeriod}
            setSelectedTimePeriod={setSelectedTimePeriod}
          />
        </div>
        {status === "pending" && (
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
          {displayCoinList.map((coin: any, index: number) => {
            const isLast = index === displayCoinList.length - 1;
            if (isLast) {
              return (
                <CoinsListItem
                  key={index}
                  singleCoin={coin}
                  innerRef={ref}
                  index={index}
                  color={progressBarColors[index % progressBarColors.length]}
                  selectedTimePeriod={selectedTimePeriod}
                />
              );
            }
            return (
              <CoinsListItem
                key={index}
                singleCoin={coin}
                index={index}
                color={progressBarColors[index % progressBarColors.length]}
                selectedTimePeriod={selectedTimePeriod}
              />
            );
          })}
        </div>
        <div className="flex justify-center z-99">
          <button
            className={`fixed bottom-12 transition-all duration-300 text-white bg-purple-300
              ${
                isSticky
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }
           `}
            onClick={handleScrollToTop}
          >
            Go Back to Top
          </button>
        </div>

        {error && (
          <div className="text-white w-full text-center">
            {error.message} API calls ran out, retry in a minute
          </div>
        )}
      </div>
    </div>
  );
}

export default Coins;

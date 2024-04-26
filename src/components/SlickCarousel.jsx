import React, { useContext, useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import styled from "styled-components";
import { CryptoContext } from "../contexts/cryptoContext";
import { Arrow } from "../components/Arrow"

const CoinTag = styled.img`
  width: 30px;
`;

const SlidesContainer = styled.div`
  background-color: ${(props) => (props.selected ? "purple" : "grey")};
  cursor: pointer;
  height: 70px;
`;

export const SlickCarousel = ({
  coinList,
  setDisplaySelectCoinToSeeChartMessage,
}) => {
  const {
    currencySymbol,
    retainTwoDigits,
    useLocalState,
    numOfDays,
    getCoinPriceVolume,
    setPriceVolumeList,
    slidesData,
    setSlidesData,
    selectedCoinData,
    setSelectedCoinData,
    displayCurrency,
    handleSearchParams,
    location,
    queryParams,
    historyURL,
    setPriceVolumeChartIsLoadingHasError,
    changeSearchParams,
    numOfDaysFromUrl,
    darkMode,
  } = useContext(CryptoContext);

  const [comparisonIsOn, setComparisonIsOn] = useLocalState(
    "comparisonModeOn",
    false
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 860,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (coinList.length > 0) {
      const coinIdsInSlidesData = slidesData.map((coin) => coin.id);
      const coinsNotInSlidesData = coinList.filter(
        (coin) => !coinIdsInSlidesData.includes(coin.id)
      );
      if (coinsNotInSlidesData.length > 0) {
        const coinsInSlides = coinList.map((coin) => ({
          ...coin,
          selected: false,
        }));
        setSlidesData(coinsInSlides);
        setSelectedCoinData([]);
      }
    }
  }, [coinList]);

  let numOfSelectedSlides = slidesData.filter((coin) => coin.selected).length;

  const handleClick = (id) => {
    setDisplaySelectCoinToSeeChartMessage(false);
    const newSlides = slidesData.map((coin) => {
      const isSameCoin = id === coin.id;
      if (isSameCoin) {
        if (!comparisonIsOn) {
          coin.selected = true;
        } else {
          if (numOfSelectedSlides < 3 && !coin.selected) coin.selected = true;
          else if (coin.selected) coin.selected = false;
        }
      } else if (!comparisonIsOn) {
        coin.selected = false;
      }
      return coin;
    });
    const selectedCoin = slidesData.filter((coin) => coin.selected);
    setSelectedCoinData(selectedCoin);
    setSlidesData(newSlides);
  };

  useEffect(() => {
    if (selectedCoinData.length === 0) {
      setPriceVolumeList([]);
    } else {
      setPriceVolumeList([]);
      const requests = selectedCoinData.map((item) => {
        return getCoinPriceVolume(item.id, displayCurrency, numOfDaysFromUrl);
      });
      Promise.all(requests).then((responses) => {
        setPriceVolumeList(responses);
      });
    }
  }, [selectedCoinData, displayCurrency, numOfDaysFromUrl]);

  const handleComparison = () => {
    setComparisonIsOn(!comparisonIsOn);
    slidesData.forEach((slide) => {
      slide.selected = false;
    });
    setSelectedCoinData([]);
    setPriceVolumeChartIsLoadingHasError(false);
    setDisplaySelectCoinToSeeChartMessage(true);
  };

  return (
    <div className={`${darkMode ? "" : "theme-light"} `}>
      <div className="flex justify-end items-center py-8 ">
        {comparisonIsOn ? (
          <div
            onClick={handleComparison}
            className="bg-skin-carousel-selected-button-background-color w-44 h-10 flex justify-center items-center rounded-md font-sans cursor-pointer text-skin-carousel-selected-button-text-color"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="rgba(255,255,255,1)"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            &nbsp; Exit Comparison
          </div>
        ) : (
          <div
            onClick={handleComparison}
            className="bg-skin-carousel-unselected-button-background-color w-32 h-10 flex justify-center items-center rounded-md font-sans cursor-pointer text-skin-carousel-unselected-button-text-color"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={`${
                darkMode ? "rgba(255,255,255,1)" : "rgba(24, 24, 37, 1)"
              }`}
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z"
                clip-rule="evenodd"
              />
            </svg>
            &nbsp; Compare
          </div>
        )}
      </div>
      <div>
        {slidesData && (
          <Slider {...settings}>
            {slidesData.map((coin) => (
              <div key={coin.id}>
                <div
                  onClick={() => handleClick(coin.id)}
                  selected={coin.selected}
                  className={`${
                    coin.selected
                      ? "bg-skin-carousel-selected-button-background-color"
                      : "bg-skin-carousel-unselected-button-background-color"
                  } cursor-pointer h-16 flex items-center rounded-md px-3 py-1`}
                >
                  <div className="w-fit sm:w-[25%]">
                    <CoinTag src={coin.image} />
                  </div>
                  <div className="w-full sm:w-[75%] text-left text-xs flex items-center justify-between sm:justify-start sm:flex-col sm:items-stretch">
                    <div
                      className={`flex items-center font-space-grotesk text-sm ${
                        coin.selected
                          ? "text-skin-carousel-selected-button-text-color"
                          : "text-skin-carousel-unselected-button-text-color"
                      }`}
                    >
                      <div className="hidden lg:block">{coin.name}</div>
                      <div className="flex items-center pl-1 sm:pl-0">
                        <span className="hidden lg:block">(</span>
                        {coin.symbol.toUpperCase()}
                        <span className="hidden lg:block">)</span>
                      </div>
                    </div>
                    <div className="font-space-grotesk text-sm flex flex-col sm:flex-row items-end sm:items-center">
                      <span className="text-skin-carousel-current-price-text-color">
                        {currencySymbol}
                        {coin.current_price}
                      </span>
                      <div className="flex items-center">
                        <Arrow priceChange = {coin.price_change_percentage_24h_in_currency} />
                        <span
                          className={`${
                            coin.price_change_percentage_24h_in_currency > 0
                              ? "text-go-up"
                              : "text-go-down"
                          }`}
                        >
                          {coin.price_change_percentage_24h_in_currency &&
                            retainTwoDigits(
                              coin.price_change_percentage_24h_in_currency
                            )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import { CryptoContext } from "../contexts/cryptoContext";
import queryString from "query-string";

const CoinTag = styled.img`
  width: 30px;
`;

const SlidesContainer = styled.div`
  background-color: ${(props) => (props.selected ? "purple" : "grey")};
  cursor: pointer;
  height: 70px;
`;

export const SlickCarousel = ({ coinList }) => {
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
  };

  return (
    <div>
      <div className="flex justify-end items-center py-8 ">
        {comparisonIsOn ? (
          <div
            onClick={handleComparison}
            className="selected-button w-44 h-10 flex justify-center items-center rounded-md font-sans cursor-pointer"
          >
            <img
              src="https://i.ibb.co/1mN5KGj/icons8-cross-50.png"
              className="w-7 mr-1.5"
            />
            Exit Comparison
          </div>
        ) : (
          <div
            onClick={handleComparison}
            className="bg-button-unselected-search-bar-background w-32 h-10 flex justify-center items-center rounded-md font-sans cursor-pointer"
          >
            <img
              src="https://i.ibb.co/yPvmz1f/icons8-charts-64.png"
              className="w-5 mr-2.5"
            />
            Compare
          </div>
        )}
      </div>
      <div>
        {slidesData && (
          <Slider {...settings}>
            {slidesData.map((coin) => (
              <div>
                <div 
                  key={coin.id}               
                  onClick={() => handleClick(coin.id)}
                  selected={coin.selected}
                  className={`${
                    coin.selected
                      ? "selected-button"
                      : "bg-button-unselected-search-bar-background"
                  } cursor-pointer h-16 flex items-center rounded-md px-1 py-1`}
                >
                  <div className="slide-icon-wrapper">
                    <CoinTag src={coin.image} />
                  </div>
                  <div className="slide-content-wrapper">
                    <div className="flex items-center font-space-grotesk text-sm">
                      <div>{coin.name}</div>
                      <div className="ml-0.5">
                        ({coin.symbol.toUpperCase()})
                      </div>
                    </div>
                    <div className="font-space-grotesk text-sm flex items-center">
                      {currencySymbol}
                      {coin.current_price}

                      <img
                        src={`${
                          coin.price_change_percentage_24h_in_currency > 0
                            ? "https://i.ibb.co/zbDF1N6/icons8-triangle-48.png"
                            : "https://i.ibb.co/DzMdxQ0/icons8-triangle-48-2.png"
                        }`}
                        className="h-2 ml-2.5 mr-1.5"
                      />
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
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

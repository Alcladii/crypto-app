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
        const coinsInSlides = coinList.map((coin) => {
          const isSelected = Object.values(queryParams).includes(coin.id);
          return { ...coin, selected: isSelected };
        });
        setSlidesData(coinsInSlides);
        setSelectedCoinData([]);
      }
    }
  }, [coinList]);

  let numOfSelectedSlides = slidesData.filter((coin) => coin.selected).length;

  const updateSearchParams = () => {
    for (let property in queryParams) {
      if (property.includes("selectedcoin")) {
        delete queryParams[property];
      }
    }
    if (selectedCoinData.length === 0) {
      historyURL.push(`?${queryString.stringify(queryParams)}`);
    } else {
      let num = 1;
      selectedCoinData.forEach((item) => {
        if (item.selected === true) {
          handleSearchParams(`selectedcoin_${num++}`, item.id);
        }
      });
    }
  }

  useEffect(() => {
    updateSearchParams()
  }, [selectedCoinData]);
 
  const handleClick = (id) => {
    const newSlides = slidesData.map((coin) => {
      const isSameCoin = id === coin.id;
      if (isSameCoin) {
        if (queryParams.comparison_is_on === "false") {
          coin.selected = true;
        } else {
          if (numOfSelectedSlides < 3 && !coin.selected) coin.selected = true;
          else if (coin.selected) coin.selected = false;
        }
      } else if (queryParams.comparison_is_on === "false") {
        coin.selected = false;
      }
      return coin;
    });
    const selectedCoin = slidesData.filter((coin) => coin.selected);
    setSelectedCoinData(selectedCoin);
    setSlidesData(newSlides);
  };

  const handleComparison = () => {
    setComparisonIsOn(!comparisonIsOn);
    slidesData.forEach((slide) => {
      slide.selected = false;
    });
    setSelectedCoinData([]);
  };

  useEffect(()=>{
    handleSearchParams("comparison_is_on", comparisonIsOn)
  },[comparisonIsOn])

  const getPriceVolumeDataForSelectedCoins = (conditions) => {
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
        setPriceVolumeList(responses);
      });
    }
  };

  useEffect(() => {
    getPriceVolumeDataForSelectedCoins (queryParams);
  }, [location.search]);

  return (
    <div>
      <div className="flex justify-end items-center py-8 ">
        {comparisonIsOn ? <div
          onClick={handleComparison}
          className="bg-button-selected w-44 h-10 flex justify-center items-center rounded-md font-sans"
        >
          <img src="https://i.ibb.co/1mN5KGj/icons8-cross-50.png" className="w-7 mr-1.5"/>
          Exit Comparison
        </div> : <div
          onClick={handleComparison}
          className="bg-button-unselected-search-bar-background w-32 h-10 flex justify-center items-center rounded-md font-sans"
        >
          <img src="https://i.ibb.co/yPvmz1f/icons8-charts-64.png" className="w-5 mr-2.5"/>
          Compare
        </div> }  
        
        </div>
      <div className="slider-wrapper">
        {slidesData && (
          <Slider {...settings}>
            {slidesData.map((coin) => (
              <div>
                {/*const SlidesContainer = styled.div`
                     background-color: ${(props) => (props.selected ? "purple" : "grey")};
                     cursor: pointer;
                     height: 70px;
                  `;*/}
                <div
                  onClick={() => handleClick(coin.id)}
                  selected={coin.selected}
                  className={`single-slide-style ${coin.selected ? "bg-button-selected" : "bg-button-unselected-search-bar-background"} cursor-pointer h-16`}
                >
                  <div className="slide-icon-wrapper">
                    <CoinTag src={coin.image} />
                  </div>
                  <div className="slide-content-wrapper">
                    <div>{coin.id}</div>
                    <div>
                      {currencySymbol}
                      {coin.current_price}&nbsp;&nbsp;
                      {coin.price_change_percentage_24h_in_currency &&
                        retainTwoDigits(
                          coin.price_change_percentage_24h_in_currency
                        )}
                      %
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

import React, { useContext, useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { CryptoContext } from "../contexts/cryptoContext";

const CoinTag = styled.img`
  width: 30px;
`;

const SlidesContainer = styled.div`
  background-color: ${(props) => (props.selected ? "purple" : "grey")};
  cursor: pointer;
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
  } = useContext(CryptoContext);

  const [comparisonIsOn, setComparisonIsOn] = useLocalState("comparisonModeOn", false)

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
          if(!comparisonIsOn){
            coin.selected = true;
          }else{
            if (numOfSelectedSlides < 3 && !coin.selected) coin.selected = true;
            else if (coin.selected) coin.selected = false;
          }        
        } else if (!comparisonIsOn) {
          coin.selected = false
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
        return getCoinPriceVolume(item.id, numOfDays);
      });
      Promise.all(requests).then((responses) => {
        setPriceVolumeList(responses);
      });
    }
  }, [selectedCoinData, numOfDays]);

  const handleComparison = () => {
    setComparisonIsOn(!comparisonIsOn)
    slidesData.forEach((slide)=>{slide.selected = false})
    setSelectedCoinData([])
  }

  return (
    <div className="App">
      <div className="comparison-button-wrapper">
        <button onClick={handleComparison} className={`comparison-button ${comparisonIsOn ? "comparison-on" : ""}`}>Comparison</button>
      </div>
      
      <div className="slider-wrapper">
        {slidesData && (
          <Slider {...settings}>
            {slidesData.map((coin) => (
              <div>
                <SlidesContainer
                  onClick={() => handleClick(coin.id)}
                  selected={coin.selected}
                  className="single-slide-style"
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
                </SlidesContainer>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

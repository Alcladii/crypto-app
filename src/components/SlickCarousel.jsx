import React, { useContext } from "react";
//import "./styles.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { CryptoContext } from "../contexts/cryptoContext";

const CoinTag = styled.img`
  width: 30px;
`;

export const SlickCarousel = ({ coinList }) => {
  const { currencySymbol, retainTwoDigits } = useContext(CryptoContext);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
  };

  return (
    <div className="App">
      <div className="slider-wrapper">
        <Slider {...settings}>
          {coinList &&
            coinList.map((coin) => (
              <div>
                <div className="single-slide-style">
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
      </div>
    </div>
  );
};

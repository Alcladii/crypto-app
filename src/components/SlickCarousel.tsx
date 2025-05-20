import { useContext, useEffect } from "react";
import Slider from "react-slick";
import styled from "styled-components";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { Arrow } from "./UI/Arrow";
import { ComparisonIcon, CloseIconWithoutCircle } from "../components/UI/Svg";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h_in_currency: number;
  selected?: boolean;
};

type SlickCarouselProps = {
  coinList: Coin[];
  setDisplaySelectCoinToSeeChartMessage: (value: boolean) => void;
};

const CoinTag = styled.img`
  width: 30px;
`;

export const SlickCarousel: React.FC<SlickCarouselProps> = ({
  coinList,
  setDisplaySelectCoinToSeeChartMessage,
}) => {
  const {
    currencySymbol,
    retainTwoDigits,
    useLocalState,
    getCoinPriceVolume,
    setPriceVolumeList,
    slidesData,
    setSlidesData,
    selectedCoinData,
    setSelectedCoinData,
    displayCurrency,
    setPriceVolumeChartIsLoadingHasError,
    numOfDaysFromUrl,
    darkMode,
  } = useContext(CryptoContext) as CryptoContextProps;

  const [comparisonIsOn, setComparisonIsOn] = useLocalState<boolean>(
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
      const coinIdsInSlidesData = slidesData.map((coin: Coin) => coin.id);
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

  let numOfSelectedSlides = slidesData.filter(
    (coin: Coin) => coin.selected
  ).length;

  const handleClick = (id: string) => {
    setDisplaySelectCoinToSeeChartMessage(false);
    const newSlides = [...slidesData];

    newSlides.forEach((coin: Coin) => {
      const isSameCoin = id === coin.id;

      if (isSameCoin) {
        if (!comparisonIsOn) {
          coin.selected = true;
        } else {
          if (numOfSelectedSlides < 3 && !coin.selected) {
            coin.selected = true;
          } else if (coin.selected) {
            coin.selected = false;
          }
        }
      } else if (!comparisonIsOn) {
        coin.selected = false;
      }
      return coin;
    });
    const selectedCoin = slidesData.filter((coin: Coin) => coin.selected);
    setSelectedCoinData(selectedCoin);
    setSlidesData(newSlides);
  };

  useEffect(() => {
    if (selectedCoinData.length === 0) {
      setPriceVolumeList([]);
    } else {
      const requests = selectedCoinData.map((item: Coin) => {
        return getCoinPriceVolume(item.id, displayCurrency, numOfDaysFromUrl);
      });
      Promise.all(requests).then((responses) => {
        setPriceVolumeList(responses);
      });
    }
  }, [selectedCoinData, displayCurrency, numOfDaysFromUrl]);

  const handleComparison = () => {
    setComparisonIsOn(!comparisonIsOn);
    slidesData.forEach((slide: Coin) => {
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
            <CloseIconWithoutCircle />
            &nbsp; Exit Comparison
          </div>
        ) : (
          <div
            onClick={handleComparison}
            className="bg-skin-carousel-unselected-button-background-color w-32 h-10 flex justify-center items-center rounded-md font-sans cursor-pointer text-skin-carousel-unselected-button-text-color"
          >
            <ComparisonIcon />
            &nbsp; Compare
          </div>
        )}
      </div>
      <div>
        {slidesData && (
          <Slider {...settings}>
            {slidesData.map((coin: Coin) => (
              <div key={coin.id}>
                <div
                  onClick={() => handleClick(coin.id)}
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
                        <Arrow
                          priceChange={
                            coin.price_change_percentage_24h_in_currency
                          }
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
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

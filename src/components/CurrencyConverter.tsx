import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CryptoContext, CryptoContextProps} from "../contexts/cryptoContext";
import LineChartCurrencyConverter from "./LineChartCurrencyConverter";
import { DaysButtonInCurrencyConverter } from "./DaysButtonInCurrencyConverter";

const daysSelectionData = [
  { days: "2", buttonText: "1D" },
  { days: "7", buttonText: "7D" },
  { days: "30", buttonText: "1M" },
  { days: "90", buttonText: "90D" },
  { days: "180", buttonText: "180D" },
  { days: "365", buttonText: "1Y" },
];
export const CurrencyConverter = () => {
  const {
    useLocalState,
    getCoinPriceVolume,
    displayCurrency,
    coinList,
    currencySymbol,
    currencyConverterDays,
    darkMode,
  } = useContext(CryptoContext) as CryptoContextProps;
  const [inputValue, setInputValue] = useState("");
  const [leftCurrency, setLeftCurrency] = useLocalState<string>(
    "leftCurrency",
    "bitcoin"
  );
  const [rightCurrency, setRightCurrency] = useLocalState<string>(
    "rightCurrency",
    "bitcoin"
  );
  const [leftCurrencyData, setLeftCurrencyData] = useLocalState<CurrencyData | null>(
    "leftCurrencyData",
    null
  );
  const [singleCoinIsLoading, setSingleCoinIsLoading] = useState(false);
  const [singleCoinLoadingHasError, setSingleCoinLoadingHasError] =
    useState(false);
  const [rightCurrencyData, setRightCurrencyData] = useLocalState<CurrencyData | null>(
    "rightCurrencyData",
    null
  );
  const [convertedResult, setConvertedResult] = useState("");
  const [leftCurrencyPriceVolume, setLeftCurrencyPriceVolume] = useLocalState(
    "leftCurrencyPriceVolume",
    []
  );
  const [rightCurrencyPriceVolume, setRightCurrencyPriceVolume] = useLocalState(
    "rightCurrencyPriceVolume",
    []
  );
  const [
    getLeftCurrencyPriceVolumeHasError,
    setGetLeftCurrencyPriceVolumeHasError,
  ] = useState(false);
  const [
    getRightCurrencyPriceVolumeHasError,
    setGetRightCurrencyPriceVolumeHasError,
  ] = useState(false);
  const [leftCurrencyIcon, setLeftCurrencyIcon] = useLocalState(
    "leftCurrencyIcon",
    ""
  );
  const [rightCurrencyIcon, setRightCurrencyIcon] = useLocalState(
    "leftCurrencyIcon",
    ""
  );

  interface CurrencyData {
    name: string;
    market_data: {
      current_price: {
        [key: string]: number;
      };
    };
    symbol: string;
  }
  

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(e.target.value);
  };

  const handleReverse = () => {
    setLeftCurrency(rightCurrency);
    setRightCurrency(leftCurrency);
    setLeftCurrencyData(rightCurrencyData);
    setRightCurrencyData(leftCurrencyData);
  };

  const handleConvert = () => {
    if (rightCurrencyData !== null && leftCurrencyData !== null) {
      const conversionRate =
        rightCurrencyData.market_data.current_price[displayCurrency] /
        leftCurrencyData.market_data.current_price[displayCurrency];

      const result = (parseFloat(inputValue) / conversionRate).toFixed(6);
      setConvertedResult(result);
    }
  };

  const getSelectedLeftCurrencyData = async (item : string) => {
    try {
      console.log("getSelectedLeftCurrencyData in CurrencyConverter.tsx ran")
      setSingleCoinIsLoading(true);
      setSingleCoinLoadingHasError(false);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSingleCoinIsLoading(false);
      // if (!singleCoinData) {
      //   setSingleCoinLoadingHasError(true);
      //   return;
      // } else {
        setLeftCurrencyData(singleCoinData.data);
      //}
    } catch (err) {
      setSingleCoinLoadingHasError(true);
      setSingleCoinIsLoading(false);
    }
  };

  const getSelectedRightCurrencyData = async (item : string) => {
    console.log("getSelectedRightCurrencyData in CurrencyConverter.tsx ran") 
    setSingleCoinLoadingHasError(false);
    setSingleCoinIsLoading(true);
    try {       
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSingleCoinIsLoading(false);
      // if (!singleCoinData) {
      //   setSingleCoinLoadingHasError(true);
      //   return;
      // } else {
        setRightCurrencyData(singleCoinData.data);
      //}
    } catch (err) {
      setSingleCoinLoadingHasError(true);
      setSingleCoinIsLoading(false);
    }
  };

  const handleLeftCurrencySelect = (value : string) => {
    setLeftCurrency(value);
  };

  const handleRightCurrencySelect = (value : string) => {
    setRightCurrency(value);
  };

  useEffect(() => {
    getSelectedLeftCurrencyData(leftCurrency);
  }, [leftCurrency]);

  useEffect(() => {
    getSelectedRightCurrencyData(rightCurrency);
  }, [rightCurrency]);

  const getLeftCurrencyPriceVolume = async (
    leftCurrency: string,
    displayCurrency: string,
    currencyConverterDays: string,
  ) => {
    try {
      const response = await getCoinPriceVolume(
        leftCurrency,
        displayCurrency,
        currencyConverterDays
      );
      if (!response) {
        setGetLeftCurrencyPriceVolumeHasError(true);
        return;
      }
      setLeftCurrencyPriceVolume(response);
    } catch (error) {
      setGetLeftCurrencyPriceVolumeHasError(true);
    }
  };

  const getRightCurrencyPriceVolume = async (
    rightCurrency: string,
    displayCurrency: string, 
    currencyConverterDays: string,
  ) => {
    try {
      const response = await getCoinPriceVolume(
        rightCurrency,
        displayCurrency,
        currencyConverterDays
      );
      if (!response) {
        setGetRightCurrencyPriceVolumeHasError(true);
        return;
      }
      setRightCurrencyPriceVolume(response);
    } catch (error) {
      setGetRightCurrencyPriceVolumeHasError(true);
    }
  };

  useEffect(() => {
    setGetLeftCurrencyPriceVolumeHasError(false);
    getLeftCurrencyPriceVolume(
      leftCurrency,
      displayCurrency,
      currencyConverterDays
    );
  }, [leftCurrency, currencyConverterDays]);

  useEffect(() => {
    setGetRightCurrencyPriceVolumeHasError(false);
    getRightCurrencyPriceVolume(
      rightCurrency,
      displayCurrency,
      currencyConverterDays
    );
  }, [rightCurrency, currencyConverterDays]);

  const requests =
    leftCurrencyData && rightCurrencyData
      ? [leftCurrencyPriceVolume, rightCurrencyPriceVolume]
      : null;

  useEffect(() => {
    handleConvert();
  }, [
    leftCurrency,
    rightCurrency,
    leftCurrencyData,
    rightCurrencyData,
    inputValue,
  ]);

  const currencyOptions =
    coinList &&
    coinList.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}({item.symbol.toUpperCase()})
      </option>
    ));

  useEffect(() => {
    coinList.forEach((item) => {
      if (item.id === leftCurrency) {
        setLeftCurrencyIcon(item.image);
      }
    });
  }, [leftCurrency]);

  useEffect(() => {
    coinList.forEach((item) => {
      if (item.id === rightCurrency) {
        setRightCurrencyIcon(item.image);
      }
    });
  }, [rightCurrency]);

  

  return (
    <div className={`${darkMode ? "" : "theme-light"}`}>
      <div className="flex justify-center my-6">
        {singleCoinIsLoading && <div className="text-skin-loading-and-error-message-currency-converter-text-color">Loading Single Coin</div>}
        {singleCoinLoadingHasError && (
          <div className="text-skin-loading-and-error-message-currency-converter-text-color">Error in loading coin data, unable to update coin price</div>
        )}
      </div>
      <div className="flex relative flex-col md:flex-row">
        <div className="w-full md:w-[50%] p-6 mb-2 md:mr-3 h-48 bg-skin-left-currency-background-color rounded-md">
          <div className="text-sm text-skin-you-sell-you-buy-text-color">
            You sell
          </div>
          <div className="flex items-center border-b-2 border-skin-currency-converter-border-color py-3 mt-6">
            <div className="w-[5%] min-w-7 mr-2.5">
              <img className="h-7 w-7" src={leftCurrencyIcon} />
            </div>
            <div className="w-[92%]">
              <select
                className="w-[45%] appearance-none font-space-grotesk bg-transparent text-skin-selected-coin-currency-converter-left-right-text-color"
                value={leftCurrency}
                onChange={(e) => {
                  handleLeftCurrencySelect(e.target.value);
                  handleConvert();
                }}
              >
                {currencyOptions}
              </select>
              <input
                className="w-[55%] text-right text-lg font-semibold bg-transparent focus:outline-none"
                onChange={handleChange}
                value={inputValue}
              />
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="text-skin-coin-price-name-currency-converter-text-color">
              1&nbsp;{leftCurrencyData !== null && leftCurrencyData.name}
              &nbsp;=&nbsp;
            </span>
            <span className="text-skin-coin-price-number-currency-converter-text-color">
              {currencySymbol}
              {leftCurrencyData !== null &&
                leftCurrencyData.market_data.current_price[displayCurrency]}
            </span>
          </div>
        </div>
        <div
          onClick={handleReverse}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-12 w-12 rounded-full cursor-pointer bg-transparent"
        >
          <svg
            fill={darkMode ? "rgba(61, 61, 126, 1)" : "rgba(255, 255, 255, 1)"}
            width="48"
            height="48"
            viewBox="-138.24 -138.24 788.48 788.48"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#000000"
            stroke-width="0.00512"
          >
            <g
              id="SVGRepo_bgCarrier"
              stroke-width="0"
              transform="translate(0,0), scale(1)"
            >
              <rect
                x="-138.24"
                y="-138.24"
                width="788.48"
                height="788.48"
                rx="394.24"
                fill={darkMode ? "rgba(255, 255, 255, 1)" : "rgba(53, 53, 112, 1)"}
                strokeWidth="0"
              ></rect>
            </g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z"></path>
            </g>
          </svg>
        </div>
        <div className="w-full md:w-[50%] p-6 mt-2 md:ml-3 h-48 bg-skin-right-currency-background-color rounded-md">
          <div className="text-sm text-skin-you-sell-you-buy-text-color">
            You buy
          </div>
          <div className="flex items-center border-b-2 border-skin-currency-converter-border-color py-3 mt-6">
            <div className="w-[5%] min-w-7 mr-2.5">
              <img className="h-7 w-7" src={rightCurrencyIcon} />
            </div>
            <select
              className="w-[45%] appearance-none font-space-grotesk bg-transparent text-skin-selected-coin-currency-converter-left-right-text-color"
              value={rightCurrency}
              onChange={(e) => {
                handleRightCurrencySelect(e.target.value);
                handleConvert();
              }}
            >
              {currencyOptions}
            </select>
            <div className="w-[55%] text-right text-lg font-semibold bg-transparent focus:outline-none">
              {convertedResult !== "0" ? convertedResult : ""}
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="text-skin-coin-price-name-currency-converter-text-color">
              1&nbsp;{rightCurrencyData !== null && rightCurrencyData.name}
              &nbsp;=&nbsp;
            </span>
            <span className="text-skin-coin-price-number-currency-converter-text-color">
              {currencySymbol}
              {rightCurrencyData !== null &&
                rightCurrencyData.market_data.current_price[displayCurrency]}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-16 bg-skin-currency-converter-chart-background-color rounded-md p-6">
        <div className="font-space-grotesk">
          {leftCurrencyData !== null && (
            <span className="text-skin-currency-inside-chart-text-color">
              {leftCurrencyData.name}({leftCurrencyData.symbol.toUpperCase()})
            </span>
          )}
          <span className="text-skin-to-inside-chart-text-color mx-4">to</span>
          {rightCurrencyData !== null && (
            <span className="text-skin-currency-inside-chart-text-color">
              {rightCurrencyData.name}({rightCurrencyData.symbol.toUpperCase()})
            </span>
          )}
        </div>
        {getLeftCurrencyPriceVolumeHasError ||
        getRightCurrencyPriceVolumeHasError ? (
          <div className="flex justify-center my-5 text-skin-loading-and-error-message-currency-converter-text-color">
            Error in getting price and volume data, can't update chart
          </div>
        ) : (
          requests !== null && (
            <LineChartCurrencyConverter priceVolumeList={requests} />
          )
        )}
      </div>

      <div className="flex my-5 w-full sm:w-fit h-auto bg-skin-days-button-bar-currency-converter-background-color rounded-md">
          {daysSelectionData.map((item) => (
          <DaysButtonInCurrencyConverter days={item.days} buttonText={item.buttonText} />
        ))}
      </div>
    </div>
  );
};

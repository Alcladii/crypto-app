import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { CoinSelectWithSearch } from "./coinSelectWithSearch";
import { InvestmentCalculatorItems } from "./InvestmentCalculatorItems";
import { CloseIcon } from "../components/UI/Svg";

export const InvestmentCalculator = () => {
  const { useLocalState, displayCurrency, darkMode } = useContext(
    CryptoContext
  ) as CryptoContextProps;

  const [showPopup, setShowPopup] = useState(false);
  const [coinListInCalculator, setCoinListInCalculator] = useLocalState(
    "coinListInCalculator",
    []
  );
  const [coinListIsLoading, setCoinListIsLoading] = useState(false);
  const [coinListLoadingHasError, setCoinListLoadingHasError] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [valueCostIsSelected, setValueCostIsSelected] = useState<boolean>(true);
  const CalculatorInput = {
    contributionInterval: "",
    initialInvestment: "",
    investmentAdded: "",
    targetGrowthRate: "",
    startDate: "",
    endDate: "",
  };
  const [formInput, setFormInput] = useState(CalculatorInput);
  const {
    contributionInterval,
    initialInvestment,
    investmentAdded,
    targetGrowthRate,
    startDate,
    endDate,
  } = formInput;
  const [calculationResult, setCalculationResult] = useState<any | null>(null);
  const [fetchingHistoricalData, setFetchingHistoricalData] =
    useState<boolean>(false);
  const [fetchingHistoricalDataHasError, setFetchingHistoricalDataHasError] =
    useState<boolean>(false);
  const [selectedCoinDataIsLoading, setSelectedCoinDataIsLoading] =
    useState<boolean>(false);
  const [selectedCoinDataLoadingHasError, setSelectedCoinDataLoadingHasError] =
    useState<boolean>(false);

  const getCoinList = async () => {
    setCoinListIsLoading(true);
    setCoinListLoadingHasError(false);
    try {
      let coins;

      const response = await axios(
        `https://api.coingecko.com/api/v3/coins/list`
      );
      coins = response.data;
      setCoinListInCalculator(coins);
      setCoinListIsLoading(false);
    } catch (err) {
      setCoinListLoadingHasError(true);
      setCoinListIsLoading(false);
    }
  };

  useEffect(() => {
    if (!coinListInCalculator) {
      getCoinList();
    }
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleValueCostClick = () => {
    setValueCostIsSelected(true);
    setCalculationResult(null);
  };

  const handleDollarCostClick = () => {
    setValueCostIsSelected(false);
    setCalculationResult(null);
  };

  const fetchHistoricalData = async (
    coinId: string,
    currency: string,
    startDate: string,
    endDate: string
  ) => {
    setFetchingHistoricalDataHasError(false);
    setFetchingHistoricalData(true);
    try {
      const response = await axios(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=${currency}&from=${startDate}&to=${endDate}&precision=2`
      );
      const historicalData = response.data;
      setFetchingHistoricalData(false)
      return historicalData;
    } catch {
      setFetchingHistoricalData(false);
      setFetchingHistoricalDataHasError(false);
    }
  };

  const convertToUnixTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const unixTimestamp = Math.floor(date.getTime() / 1000).toString();

    return unixTimestamp;
  };

  const CalculateInvestmentTimePeriod = (
    startDateStr: string,
    endDateStr: string
  ) => {
    const startDate: Date = new Date(startDateStr);
    const endDate: Date = new Date(endDateStr);
    const timePeriod: number = endDate.getTime() - startDate.getTime();
    return timePeriod;
  };

  const CalculateIntervals = (interval: string) => {
    const timePeriod: number = CalculateInvestmentTimePeriod(
      startDate,
      endDate
    );
    const intervalToMs: number = parseInt(interval) * 24 * 60 * 60 * 1000;
    const intervalQuantity: number = Math.floor(timePeriod / intervalToMs);
    return intervalQuantity;
  };

  const getPriceAndDateForEachInvterval = (historyData: any) => {
    const intervalQuantity = CalculateIntervals(contributionInterval);
    const timePeriod: number = CalculateInvestmentTimePeriod(
      startDate,
      endDate
    );
    let arrayOfPriceAndDateforEachInterval = [];
    for (let i = 0; i <= intervalQuantity; i++) {
      if (timePeriod / (24 * 60 * 60 * 1000) > 90) {
        const data = historyData.prices[parseInt(contributionInterval) * i];
        arrayOfPriceAndDateforEachInterval.push(data);
      } else {
        const data =
          historyData.prices[parseInt(contributionInterval) * i * 24];
        arrayOfPriceAndDateforEachInterval.push(data);
      }
    }
    return arrayOfPriceAndDateforEachInterval;
  };

  const calculateNetInvestmentVA = (
    initialInvestment: number,
    growthRate: number,
    actualPrices: any
  ) => {
    let netInvestment = initialInvestment;
    let targetValue, investmentNeeded, actualValue;
    let adjustedInitialInvestment = initialInvestment;
    for (let i = 1; i < actualPrices.length; i++) {
      targetValue = initialInvestment * Math.pow(1 + growthRate / 100, i);
      const actualGrowthRate =
        (actualPrices[i] - actualPrices[i - 1]) / actualPrices[i - 1];
      actualValue = adjustedInitialInvestment * (1 + actualGrowthRate);
      investmentNeeded = targetValue - actualValue;
      netInvestment += investmentNeeded;
      adjustedInitialInvestment = targetValue;
    }
    return {
      netInvestment: netInvestment,
      coinsValue: adjustedInitialInvestment,
    };
  };

  const calculateNetInvestmentDA = (
    initialInvestment: number,
    investmentAdded: number,
    actualPrices: any
  ) => {
    let netInvestment = initialInvestment;
    let actualValue;
    for (let i = 1; i < actualPrices.length; i++) {
      const growthRate =
        (actualPrices[i] - actualPrices[i - 1]) / actualPrices[i - 1];
      actualValue = netInvestment * (growthRate + 1);
      netInvestment = actualValue + investmentAdded;
    }
    const totalNetInvestment =
      initialInvestment + investmentAdded * (actualPrices.length - 1);
    return { netInvestment: totalNetInvestment, coinsValue: netInvestment };
  };

  const handleCalculation = async () => {
    const startDateInUnix = convertToUnixTimestamp(startDate).concat();
    const endDateInUnix = convertToUnixTimestamp(endDate);
    const historyData = await fetchHistoricalData(
      selectedOption.id,
      displayCurrency,
      startDateInUnix,
      endDateInUnix
    );
    const priceAndDateForEachInterval =
      getPriceAndDateForEachInvterval(historyData);
    const actualPricesArray = priceAndDateForEachInterval.map(
      (item) => item[1]
    );
    if (valueCostIsSelected) {
      const returnFromVACalculation = calculateNetInvestmentVA(
        parseInt(initialInvestment),
        parseInt(targetGrowthRate),
        actualPricesArray
      );
      setCalculationResult(returnFromVACalculation);
    } else {
      const returnFromDACalculation = calculateNetInvestmentDA(
        parseInt(initialInvestment),
        parseInt(investmentAdded),
        actualPricesArray
      );
      setCalculationResult(returnFromDACalculation);
    }
  };

  return (
    <div className="text-skin-calculator-general-text-color">
      <div
        className="flex justify-center items-center w-full sm:w-52 h-10 sm:mr-2 rounded-md mb-3 bg-skin-portfolio-item-buttons-background-color text-skin-portfolio-item-buttons-text-color cursor-pointer"
        onClick={togglePopup}
      >
        Investment Calculator
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-md  font-space-grotesk">
          <div
            className={`fixed top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[768px] lg:w-[820px] h-[768px] overflow-y-auto no-scrollbar bg-skin-app ${
              darkMode ? "" : "theme-light"
            } rounded-lg border-gray-300 shadow-md py-10 md:pt-6 md:pb-10 px-6 md:px-10 bg-skin-calculator-pop-up-background-color`}
          >
            <div className="flex h-[7%] md:h-[12%] justify-between items-top sm:items-center">
              <div className="font-space-grotesk text-lg font-semibold">
                Investment Calculator
              </div>
              <CloseIcon togglePopup={togglePopup} />
            </div>
            <div id="coin-select" className="flex items-center justify-between sm:justify-start">
              <div className="flex justify-center items-center h-12 w-[50%] sm:w-[25%] mr-2 rounded-md bg-skin-calculator-search-bar-unselected-calculator-option-background-color">
                {selectedOption && (
                  <div className="flex">
                    <img
                      className="w-6 h-6 mr-2"
                      src={selectedOption.image.large}
                    />
                    {selectedOption.name}({selectedOption.symbol.toUpperCase()})
                  </div>
                )}
              </div>
              <CoinSelectWithSearch
                coinList={coinListInCalculator}
                setSelectedOption={setSelectedOption}
                setSelectedCoinDataIsLoading={setSelectedCoinDataIsLoading}
                setSelectedCoinDataLoadingHasError={
                  setSelectedCoinDataLoadingHasError
                }
              />
            </div>
            {selectedCoinDataIsLoading && (
              <div className="text-red flex justify-center">
                Loading selected coin
              </div>
            )}
            {selectedCoinDataLoadingHasError && (
              <div className="text-red flex justify-center">
                Error in loading selected coin
              </div>
            )}
            {coinListIsLoading && (
              <div className="text-red flex justify-center">
                Loading coin list
              </div>
            )}
            {coinListLoadingHasError && (
              <div className="text-red flex justify-center">
                Error in loading coin list
              </div>
            )}
            {fetchingHistoricalData && (
              <div className="text-red flex justify-center">
                Loading coin historical data
              </div>
            )}
            {fetchingHistoricalDataHasError && (
              <div className="text-red flex justify-center">
                Error in fetching historical data
              </div>
            )}
            <div className="w-full h-12 flex mt-4">
              <button
                className={`w-[50%] h-full mr-0.5 rounded-md ${
                  valueCostIsSelected
                    ? "bg-skin-carousel-selected-button-background-color text-skin-selected-calculator-option-text-color"
                    : "bg-skin-calculator-search-bar-unselected-calculator-option-background-color text-skin-unselected-calculator-option-text-color"
                }`}
                onClick={handleValueCostClick}
              >
                Value Cost Averaging
              </button>
              <button
                className={`w-[50%] h-full ml-0.5 rounded-md ${
                  !valueCostIsSelected
                    ? "bg-skin-carousel-selected-button-background-color text-skin-selected-calculator-option-text-color"
                    : "bg-skin-calculator-search-bar-unselected-calculator-option-background-color text-skin-unselected-calculator-option-text-color"
                }`}
                onClick={handleDollarCostClick}
              >
                Dollar Cost Averaging
              </button>
            </div>
            <div className="w-full h-fit mt-4">
              <InvestmentCalculatorItems
                formInput={formInput}
                setFormInput={setFormInput}
                calculationResult={calculationResult}
                valueCostIsSelected={valueCostIsSelected}
              />
            </div>
            <div className="w-full h-12 mt-4">
              <button
                className="w-full h-full rounded-md bg-skin-carousel-selected-button-background-color"
                onClick={handleCalculation}
              >
                Calculate({valueCostIsSelected ? "VCA" : "DCA"})
              </button>
            </div>
            <div className="w-full h-36 mt-4">
              {valueCostIsSelected ? (
                <p>
                  Value-cost averaging (VCA) -- is an investment strategy
                  focuses on the value of the investment rather than the number
                  of coins purchased. In VCA, investors aim to invest a
                  consistent amount of money at regular intervals, but instead
                  of buying a fixed quantity of assets each time.
                </p>
              ) : (
                <p>
                  Dollar-cost averaging (DCA) -- is to reduce the impact of
                  market volatility on the average cost of acquiring the
                  investment. By consistently investing over time, investors may
                  be able to lower their average cost per coin and potentially
                  benefit from long-term market appreciation
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

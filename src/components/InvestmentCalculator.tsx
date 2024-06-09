import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { CoinSelectWithSearch } from "./coinSelectWithSearch";

export const InvestmentCalculator = () => {
  const { useLocalState, getSingleCoinData, darkMode } =
    useContext(CryptoContext) as CryptoContextProps;

  const [showPopup, setShowPopup] = useState(false);
  const [coinListInCalculator, setCoinListInCalculator] = useLocalState(
    "coinListInCalculator",
    []
  );
  const [coinListIsLoading, setCoinListIsLoading] = useState(false);
  const [coinListLoadingHasError, setCoinListLoadingHasError] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  //console.log(selectedOption);

  const getCoinList = useCallback(() => {
    async () => {
      try {
        let coins;
        setCoinListIsLoading(true);
        const response = await axios(
          `https://api.coingecko.com/api/v3/coins/list`
        );
        coins = response.data;
        //console.log("coins", coins);
        setCoinListInCalculator(coins);
        setCoinListIsLoading(false);
        setCoinListLoadingHasError(false);
      } catch (err) {
        setCoinListLoadingHasError(true);
        setCoinListIsLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!coinListInCalculator) {
      getCoinList();
    }
  }, [coinListInCalculator]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  /*const handleCoinSelect = (coin) => {
    getSingleCoinData(coin, setSingleCoinDataInInvestmentCalculator);
  }*/

  /*const coinsOptions =
    coinListInCalculator &&
    coinListInCalculator.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ));*/

  return (
    <div>
      <div
        className="flex justify-center items-center w-40 h-10 rounded-md mb-3 bg-skin-portfolio-item-buttons-background-color text-skin-portfolio-item-buttons-text-color"
        onClick={togglePopup}
      >
        Investment Calculator
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-md  font-space-grotesk">
          <div
            className={`fixed top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[768px] lg:w-[820px] h-[620px] md:h-96 bg-skin-app ${
              darkMode ? "" : "theme-light"
            } rounded-lg border-gray-300 shadow-md py-10 md:pt-6 md:pb-10 px-6 md:px-10`}
          >
            <div className="flex h-[7%] md:h-[12%] justify-between items-center">
              <div className="font-space-grotesk text-lg font-semibold text-skin-add-asset-popup-buttons-title-text-color">
                Investment Calculator
              </div>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill={
                  darkMode ? "rgba(255 ,255 ,255 ,1)" : "rgba(24, 24, 37, 1)"
                }
                className="w-8 h-8 cursor-pointer"
                onClick={togglePopup}
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <rect x="0" fill="none" width="24" height="24"></rect>{" "}
                  <g>
                    {" "}
                    <path d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0 4-10.3.1-14.2zm-4.3 11.3L12 13.4l-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 2.8-2.8 1.4 1.4-2.8 2.8 2.8 2.8-1.4 1.4z"></path>{" "}
                  </g>{" "}
                </g>
              </svg>
            </div>
            {/*<select
              className="w-full bg-skin-add-edit-asset-popup-items-background-color text-skin-add-asset-popup-coin-selector-text-color outline-none appearance-none rounded-md h-12 pl-3"
              //value={singleCoinDataInInvestmentCalculator.name}
              onChange={(e) => {
                getSingleCoinData(
                  e.target.value,
                  setSingleCoinDataInInvestmentCalculator
                );
              }}
            >
              <option value="" disabled selected>
                Please select coins
              </option>
              {coinsOptions}
            </select>*/}
            <div className="flex items-center">
              <div className="h-12 w-[25%] mr-2 rounded-md bg-skin-add-asset-popup-coin-name-icon-wrapper-background-color">
                {selectedOption && <div>{selectedOption.name}({selectedOption.symbol})</div>}
              </div>
              <CoinSelectWithSearch
                coinList={coinListInCalculator}
                setSelectedOption={setSelectedOption}
              />
            </div>
            {coinListLoadingHasError && (
              <div className="text-red">Coin List Loading Has Error</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

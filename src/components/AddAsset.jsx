import React, { useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { PurchaseAmount } from "../components/PurchaseAmount";
import { PurchaseDate } from "../components/PurchaseDate";

export const AddAsset = ({ addCoin }) => {
  const {
    coinList,
    purchasedAmount,
    setPurchasedAmount,
    purchaseDate,
    formattedDateForHistoryApiCall,
    isNumber,
    setIsNumber,
    setEditAsset,
    darkMode,
  } = useContext(CryptoContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedCoinIsLoading, setSelectedCoinIsLoading] = useState(false);
  const [selectedCoinLoadingHasError, setSelectedCoinLoadingHasError] =
    useState(false);
  const [selectCoinIsLoading, setSelectCoinIsLoading] = useState(false);
  const [selectCoinDataHasError, setSelectCoinDataHasError] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setSelectedCoin("");
    setSelectedAmount("");
    setEditAsset(false);
  };

  const coinsOptions =
    coinList &&
    coinList.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ));

  const handleCoinSelect = async (coin) => {
    try {
      setSelectCoinDataHasError(false);
      setSelectCoinIsLoading(true);
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSelectedCoin(singleCoinData.data);
      setSelectCoinIsLoading(false);
    } catch (err) {
      setSelectCoinDataHasError(true);
      setSelectCoinIsLoading(false);
    }
  };

  const getSelectedCoinData = async (coin) => {
    try {
      setSelectedCoinIsLoading(true);
      const singleCoinHistory = await axios(
        `https://api.coingecko.com/api/v3/coins/${coin}/history?date=${formattedDateForHistoryApiCall}&localization=false`
      );
      addCoin(
        selectedCoin,
        purchasedAmount,
        purchaseDate,
        singleCoinHistory.data
      );
      setSelectedCoinIsLoading(false);
      setSelectedCoinLoadingHasError(false);
    } catch (err) {
      setSelectedCoinLoadingHasError(true);
      setSelectedCoinIsLoading(false);
    }
  };

  const handleAddClick = (coin) => {
    const isValidNumber = /^\d*\.?\d+$/.test(purchasedAmount);
    if (!isValidNumber) {
      setIsNumber(false);
      setShowPopup(true);
    } else {
      setShowPopup(false);
      getSelectedCoinData(coin);
      setIsNumber(true);
    }
  };

  return (
    <div>
      <div
        className="flex justify-center items-center w-28 h-10 selected-button rounded-md mb-3"
        onClick={togglePopup}
      >
        Add Asset
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-md  font-space-grotesk">
          <div
            className={`fixed top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[820px] h-96 bg-skin-app ${
              darkMode ? "" : "theme-light"
            } rounded-lg border-gray-300 shadow-md pt-5 pb-9 px-10`}
          >
            <div className="flex h-[12%] justify-between items-center">
              <div className="font-space-grotesk text-lg font-semibold text-skin-add-asset-popup-buttons-title-text-color">
                Select Coins
              </div>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill={darkMode ? "rgba(255 ,255 ,255 ,1)" : "rgba(24, 24, 37, 1)"}
                class="w-8 h-8 cursor-pointer"
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
            <div className="flex h-[88%] pt-6">
              <div className="w-[38%] bg-skin-add-asset-popup-coin-name-icon-wrapper-background-color rounded-lg flex justify-center items-center">
                {selectedCoin && (
                  <div className="flex-col justify-center items-center">
                    <div className="w-32 flex justify-center items-center mb-2">
                      <div className="w-14 h-14 flex justify-center items-center rounded-md pb-2 bg-skin-add-asset-popup-icon-wrapper-background-color">
                        <img
                          className="w-8 mt-2"
                          src={selectedCoin.image.large}
                        />
                      </div>
                    </div>
                    <div className="w-32 flex justify-center mt-4 text-2xl font-bold">
                      {selectedCoin.name}&nbsp;(
                      {selectedCoin.symbol.toUpperCase()})
                    </div>
                  </div>
                )}
              </div>
              <div className="w-[65%] ml-5 flex flex-col justify-between ">
                <select
                  className="w-full bg-skin-add-asset-popup-items-background-color text-skin-add-asset-popup-coin-selector-text-color outline-none appearance-none rounded-md h-12 pl-3"
                  value={selectedCoin.id}
                  onChange={(e) => {
                    handleCoinSelect(e.target.value);
                  }}
                >
                  <option value="" disabled selected>
                    Please select coins
                  </option>
                  {coinsOptions}
                </select>
                <PurchaseAmount />
                {!isNumber && <div>Put in a number</div>}
                <PurchaseDate />
                <div className="flex justify-between">
                  <div
                    className="w-1/2 bg-skin-add-asset-popup-buttons-background-color text-skin-add-asset-popup-buttons-title-text-color outline-none appearance-none rounded-md h-12 mr-2 flex justify-center items-center"
                    onClick={togglePopup}
                  >
                    Cancel
                  </div>
                  <div
                    className="w-1/2 bg-skin-add-asset-popup-buttons-background-color text-skin-add-asset-popup-buttons-title-text-color outline-none appearance-none rounded-md h-12 ml-2 flex justify-center items-center"
                    onClick={() => {
                      handleAddClick(selectedCoin.id);
                    }}
                  >
                    Save and Continue
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

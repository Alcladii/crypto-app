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
      <button onClick={togglePopup}>Add Asset</button>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-md  font-space-grotesk">
          <div className="fixed top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[820px] h-96 bg-crpyto-background-dark rounded-lg border-gray-300 shadow-md pt-5 pb-9 px-10">
            <div className="flex h-[12%] justify-between items-center">
              <div className="font-space-grotesk text-lg font-semibold">Select Coins</div>
              <div
                onClick={togglePopup}
                className="w-8 h-8 rounded-full border-2 cursor-pointer flex justify-center items-center text-2xl"
              >
                ×
              </div>
            </div>
            <div className="flex h-[88%] pt-6">
              <div className="w-[38%] bg-line-bar-chart-background rounded-lg flex justify-center items-center">
                {selectedCoin && (
                  <div className="flex-col justify-center items-center">
                    <div className="w-32 flex justify-center items-center mb-2">
                      <div className="w-14 h-14 flex justify-center items-center rounded-md pb-2 bg-coin-icon-background">
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
                  className="w-full bg-button-unselected-search-bar-background outline-none appearance-none rounded-md h-12 pl-3"
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
                    className="w-1/2 bg-button-unselected-search-bar-background outline-none appearance-none rounded-md h-12 mr-2 flex justify-center items-center"
                    onClick={togglePopup}
                  >
                    Cancel
                  </div>
                  <div
                    className="w-1/2 bg-button-unselected-search-bar-background outline-none appearance-none rounded-md h-12 ml-2 flex justify-center items-center"
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

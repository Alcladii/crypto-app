import React, { useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { PurchaseAmount } from "../components/PurchaseAmount";
import { PurchaseDate } from "../components/PurchaseDate";

export const EditAsset = ({ id, setPortfolioListNeedsUpdate }) => {
  const {
    portfolioList,
    setPortfolioList,
    purchasedAmount,
    purchaseDate,
    isNumber,
    setIsNumber,
    formattedDateForHistoryApiCall,
    setEditAsset,
  } = useContext(CryptoContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoinIsLoading, setSelectedCoinIsLoading] = useState(false);
  const [selectedCoinLoadingHasError, setSelectedCoinLoadingHasError] =
    useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setEditAsset(true);
  };

  /*const handleEditClick = (a) => {
    portfolioList.map(() => {});
    setIsNumber(true);
  };*/

  const selectedItem = portfolioList.find((item) => item.id === id);

  const editItem = (currentData, amount, date, historyData) => {
    const newPortfolioList = portfolioList.map((item) => {
      if (item.id === id) {
        item.coinData = currentData;
        item.purchaseAmount1 = amount;
        item.purchaseDate1 = date;
        item.historyData = historyData;
      }
      return item;
    });
    setPortfolioList(newPortfolioList);
  };

  const updateSelectedCoinData = async (coin) => {
    try {
      setSelectedCoinIsLoading(true);
      const updatedSingleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      const updatedSingleCoinHistoryData = await axios(
        `https://api.coingecko.com/api/v3/coins/${coin}/history?date=${formattedDateForHistoryApiCall}&localization=false`
      );
      editItem(
        updatedSingleCoinData.data,
        purchasedAmount,
        purchaseDate,
        updatedSingleCoinHistoryData.data
      );
      setSelectedCoinIsLoading(false);
      setSelectedCoinLoadingHasError(false);
    } catch (err) {
      setSelectedCoinLoadingHasError(true);
      setSelectedCoinIsLoading(false);
    }
  };

  const handleSaveClick = (coin) => {
    const isValidNumber = /^\d*\.?\d+$/.test(purchasedAmount);
    if (!isValidNumber) {
      setShowPopup(true);
      setIsNumber(false);
    } else {
      setShowPopup(false);
      updateSelectedCoinData(coin);
      setIsNumber(true);
      setPortfolioListNeedsUpdate(true)
    }
  };

  const handleEdit = () => {
    //handleEditClick(id);
    setIsNumber(true);
    togglePopup();
  };

  return (
    <div>
      <div
        className="flex justify-center items-center w-24 h-10 selected-button rounded-md"
        onClick={handleEdit}
      >
        Edit
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-md  font-space-grotesk">
          <div className="fixed top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[820px] h-96 bg-crpyto-background-dark rounded-lg border-gray-300 shadow-md pt-5 pb-9 px-10">
            <div className="h-full flex flex-col justify-between">
              <div className="h-[13%] flex items-center text-xl semi-bold">
                Edit Asset
              </div>
              {selectedItem && (
                <div className="flex items-center">
                  <img
                    className="w-8"
                    src={selectedItem.coinData.image.large}
                  />
                  <div className="flex items-center h-10" key={selectedItem.id}>
                    {selectedItem.coinData.name}
                  </div>
                </div>
              )}
              <div>Purchased Amount</div>
              <PurchaseAmount amount={selectedItem.purchaseAmount1} />
              {!isNumber && <div>Put in a number</div>}
              <div>Purchased Date</div>
              <PurchaseDate date={selectedItem.purchaseDate1} />
              <div className="flex justify-end mt-2">
                <div
                  className="flex justify-center items-center w-24 h-10 selected-button rounded-md mr-4"
                  onClick={() => {
                    handleSaveClick(selectedItem.coinData.id);
                  }}
                >
                  Save
                </div>
                <div
                  className="flex justify-center items-center w-24 h-10 selected-button rounded-md"
                  onClick={togglePopup}
                >
                  Close
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

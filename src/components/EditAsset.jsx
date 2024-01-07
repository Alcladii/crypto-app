import React, { useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { PurchaseAmount } from "../components/PurchaseAmount";
import { PurchaseDate } from "../components/PurchaseDate";

export const EditAsset = ({ id }) => {
  const {
    portfolioList,
    setPortfolioList,
    purchasedAmount,
    purchaseDate,
    isNumber,
    setIsNumber,
    formattedDateForHistoryApiCall,
  } = useContext(CryptoContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoinIsLoading, setSelectedCoinIsLoading] = useState(false);
  const [selectedCoinLoadingHasError, setSelectedCoinLoadingHasError] =
    useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleEditClick = (a) => {
    portfolioList.map(() => {});
    setIsNumber(true);
  };

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
    }
  };

  const handleEdit = () => {
    handleEditClick(id);
    togglePopup();
  };

  return (
    <div>
      <button onClick={handleEdit}>Edit</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Asset</h2>
            <p>Edit selected asset below</p>
            {selectedItem && (
              <div key={selectedItem.id}>{selectedItem.coinData.name}</div>
            )}
            <PurchaseAmount amount={selectedItem.purchaseAmount1} />
            {!isNumber && <div>Put in a number</div>}
            <PurchaseDate date={selectedItem.purchaseDate1} />
            <button
              onClick={() => {
                handleSaveClick(selectedItem.coinData.id);
              }}
            >
              Save
            </button>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

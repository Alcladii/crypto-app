import React, { useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { PurchaseAmount } from "../components/PurchaseAmount";
import { PurchaseDate } from "../components/PurchaseDate";

export const EditAsset = ({ id }) => {
  const { portfolioList } = useContext(CryptoContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(""); // State for purchased amount
  const [selectedDate, setSelectedDate] = useState(""); 

  //console.log(showPopup);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    //setSelectedCoin("");
    //setSelectedAmount("");
  };

  const handleEditClick = (a) => {
    portfolioList.map(() => {});
  };

  const selectedItem = portfolioList.find((item) => item.id === id)

  return (
    <div>
      <button
        onClick={() => {
          handleEditClick(id), togglePopup();
        }}
      >
        Edit
      </button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Asset</h2>
            <p>Edit selected asset below</p>
            {selectedItem && <div key={selectedItem.id}>{selectedItem.coinData.name}</div>}
            <PurchaseAmount amount={(selectedItem.purchaseAmount1)}/>
            <PurchaseDate date={(selectedItem.purchaseDate1)}/>
            <button
              onClick={() => {
                handleClick(selectedCoin);
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

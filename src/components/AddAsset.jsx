import React, { useState, useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { PurchaseAmount} from "../components/PurchaseAmount"


export const AddAsset = ({ portfolioList, setPortfolioList }) => {
  const {
    coinList,
    convertToBillion,
    getSingleCoinData,
    singleCoin,
    singleCoinIsLoading,
    singleCoinLoadingHasError,
    displayCurrency,
    getCurrencyList,
    currencySymbol,
    retainTwoDigits,
    useLocalState,
  } = useContext(CryptoContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setSelectedCoin("");
    setSelectedAmount("");
  };

  const coinsOptions =
    coinList &&
    coinList.map((item) => (
      <option key={item.id} value={item.name}>
        {item.name}
      </option>
    ));

  const amountOptions = [];
  for (let i = 1; i <= 9999; i++) {
    amountOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const handleCoinSelect = (value) => {
    setSelectedCoin(value);
  };

  //when you click Add, it's gonna check if the current coin is in the portfolioList
  const handleClick = () => {
    
  };

  const handleChange = (value) => {
    setInputValue(value)
  }

  return (
    <div>
      <button onClick={togglePopup}>Add Asset</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Popup Window</h2>
            <p>This is a popup window!</p>
            <select
              className="selected-style"
              value={selectedCoin}
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
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
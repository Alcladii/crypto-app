import React, { useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { PurchaseAmount} from "../components/PurchaseAmount"
import { PurchaseDate } from "../components/PurchaseDate"


export const AddAsset = ({ addCoin }) => {
  const {
    coinList,
    purchasedAmount,
    setPurchasedAmount,
    purchaseDate,
    formattedDateForHistoryApiCall,
  } = useContext(CryptoContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedCoinIsLoading, setSelectedCoinIsLoading] = useState(false);
  const [selectedCoinLoadingHasError, setSelectedCoinLoadingHasError] = useState(false);
  const [isNumber, setIsNumber] = useState(true)
  //const [passedPurchasedAmount, setPassedPurchasedAmount] = useState ("")

  //console.log(purchasedAmount)
  

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

  const handleCoinSelect = (value) => {
    setSelectedCoin(value);
  };

  const getSelectedCoinData = async (coin) => {
    try {      
        setSelectedCoinIsLoading(true);
        const singleCoinData = await axios(
          `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
        );
        const singleCoinHistory = await axios(
           `https://api.coingecko.com/api/v3/coins/${coin}/history?date=${formattedDateForHistoryApiCall}&localization=false`
        )
        const isValidNumber = /^\d*\.?\d+$/.test(purchasedAmount);
        if(!isValidNumber){
          setIsNumber(false)
        } else {      
          addCoin(singleCoinData.data, purchasedAmount, purchaseDate, singleCoinHistory.data)
          setIsNumber(true)
        }
        //addCoin(singleCoinData.data, purchasedAmount, purchaseDate, singleCoinHistory.data)
        setSelectedCoinIsLoading(false);
        setSelectedCoinLoadingHasError(false);
      } catch (err) {
        setSelectedCoinLoadingHasError(true);
        setSelectedCoinIsLoading(false);
      }
  }

  const handleClick = (coin) => {
    getSelectedCoinData(coin)
    if(isNumber){
      setShowPopup(false)
    } else {
      setShowPopup(true)
    }
    //setShowPopup(false)
  };

  {/*const passPurchasedAmountInput = (amount) => {
    setPurchasedAmount(amount)
  }*/}

  return (
    <div>
      <button onClick={togglePopup}>Add Asset</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Asset</h2>
            <p>Add asset below</p>
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
            <PurchaseAmount /*passPurchasedAmountInput={passPurchasedAmountInput}*//>
            {!isNumber && <div>Put in a number</div>}
            <PurchaseDate />
            <button onClick={()=> {handleClick(selectedCoin)}}>Add</button>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
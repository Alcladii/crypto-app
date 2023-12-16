import React, { useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";
import { PurchaseAmount} from "../components/PurchaseAmount"
import { PurchaseDate } from "../components/PurchaseDate"


export const AddAsset = ({ portfolioList, setPortfolioList, addCoin }) => {
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
    purchasedAmount,
    purchaseDate,
  } = useContext(CryptoContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedCoinIsLoading, setSelectedCoinIsLoading] = useState(false)
  const [selectedCoinLoadingHasError, setSelectedCoinLoadingHasError] = useState(false)
  const [selectedCoinData, setSelectedCoinData] = useState({})

  //console.log(selectedCoin)

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

  //don't have to make selectedCoinData state, can set the data into coin in portfolioList
  const getSelectedCoinData = async (coin) => {
    try {
        
        //setSelectedCoin({});
        setSelectedCoinIsLoading(true);
        const singleCoinData = await axios(
          `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
        );
        //console.log(singleCoinData.data, purchasedAmount, purchaseDate)
        addCoin(singleCoinData.data, purchasedAmount, purchaseDate)
        setSelectedCoinIsLoading(false);
        //setSelectedCoinData(singleCoinData.data);
        setSelectedCoinLoadingHasError(false);
      } catch (err) {
        setSelectedCoinLoadingHasError(true);
        setSelectedCoinIsLoading(false);
      }
  }

  

  //when you click Add, it's gonna check if the current coin is in the portfolioList
  const handleClick = (coin) => {
    getSelectedCoinData(coin)
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
            <PurchaseAmount />
            <PurchaseDate />
            <button onClick={()=> {handleClick(selectedCoin)}}>Add</button>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
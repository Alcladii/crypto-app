import { useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { PurchaseAmount } from "./PurchaseAmount";
import { PurchaseDate } from "./PurchaseDate";
import { CloseIcon } from "../components/UI/Svg";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
};

type AddAssetProps = {
  addCoin: (
    coinId: string | null,
    coin: Coin | null,
    purchasedAmount: string | null,
    purchaseDate: string | null,
    singleCoinHistoryData: any
  ) => void;
};

export const AddAsset: React.FC<AddAssetProps> = ({ addCoin }) => {
  const {
    coinList,
    purchasedAmount,
    purchaseDate,
    formattedDateForHistoryApiCall,
    isNumber,
    setIsNumber,
    setEditAsset,
    darkMode,
  } = useContext(CryptoContext) as CryptoContextProps;

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedCoinIsLoading, setSelectedCoinIsLoading] = useState(false);
  const [selectedCoinLoadingHasError, setSelectedCoinLoadingHasError] =
    useState(false);
  const [selectCoinIsLoading, setSelectCoinIsLoading] = useState(false);
  const [selectCoinDataHasError, setSelectCoinDataHasError] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setSelectedCoin(null);
    setSelectedAmount("");
    setEditAsset(false);
  };

  const coinsOptions =
    coinList &&
    coinList.map((item: Coin) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ));

  const handleCoinSelect = async (coinId: string) => {
    setSelectCoinDataHasError(false);
    setSelectCoinIsLoading(true);
    try {
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      setSelectedCoin(singleCoinData.data);
      setSelectCoinIsLoading(false);
    } catch (err) {
      setSelectCoinDataHasError(true);
      setSelectCoinIsLoading(false);
    }
  };

  const getSelectedCoinData = async (coinId: string) => {
    setSelectedCoinLoadingHasError(false);
    setSelectedCoinIsLoading(true);
    try {
      const singleCoinHistory = await axios(
        `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${formattedDateForHistoryApiCall}&localization=false`
      );
      addCoin(
        coinId,
        selectedCoin,
        purchasedAmount,
        purchaseDate,
        singleCoinHistory.data
      );
      setSelectedCoinIsLoading(false);
    } catch (err) {
      setSelectedCoinLoadingHasError(true);
      setSelectedCoinIsLoading(false);
    }
  };

  const handleAddClick = (coinId: string) => {
    const amount = purchasedAmount !== null ? purchasedAmount : "";
    const isValidNumber = /^\d*\.?\d+$/.test(amount);
    if (!isValidNumber) {
      setIsNumber(false);
      setShowPopup(true);
    } else {
      setShowPopup(false);
      getSelectedCoinData(coinId);
      setIsNumber(true);
    }
  };

  return (
    <div>
      <div
        className="flex justify-center items-center w-full sm:w-28 h-10 sm:ml-2 rounded-md mb-3 bg-skin-portfolio-item-buttons-background-color text-skin-portfolio-item-buttons-text-color"
        onClick={togglePopup}
      >
        Add Asset
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
                Select Coins
              </div>
              <CloseIcon togglePopup={togglePopup} />
            </div>
            <div className="h-[93%] md:h-[88%] pt-6 flex flex-col md:flex-row items-center">
              <div className="w-52 h-52 md:w-[38%] md:h-full bg-skin-add-asset-popup-coin-name-icon-wrapper-background-color rounded-lg flex justify-center items-center">
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
                    <div className="w-32 flex justify-center mt-4 text-2xl font-bold text-skin-portfolio-item-coin-name-total-value-current-price-text-color">
                      {selectedCoin.name}&nbsp;(
                      {selectedCoin.symbol.toUpperCase()})
                    </div>
                  </div>
                )}
              </div>
              <div className="w-[90%] md:w-[65%] md:ml-5 flex flex-col justify-between h-[60%] md:h-full mt-9 md:mt-0">
                <select
                  className="w-full bg-skin-add-edit-asset-popup-items-background-color text-skin-add-asset-popup-coin-selector-text-color outline-none appearance-none rounded-md h-12 pl-3"
                  value={selectedCoin?.id || ""}
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
                    className="w-1/2 cursor-pointer bg-skin-add-asset-popup-buttons-background-color text-skin-add-asset-popup-buttons-title-text-color outline-none appearance-none rounded-md h-12 mr-2 flex justify-center items-center"
                    onClick={togglePopup}
                  >
                    Cancel
                  </div>
                  <div
                    className="w-1/2 cursor-pointer bg-skin-add-asset-popup-buttons-background-color text-skin-add-asset-popup-buttons-title-text-color outline-none appearance-none rounded-md h-12 ml-2 flex justify-center items-center"
                    onClick={() => {
                      handleAddClick(selectedCoin?.id || "");
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

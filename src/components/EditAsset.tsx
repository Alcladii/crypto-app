import { useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { PurchaseAmount } from "./PurchaseAmount";
import { PurchaseDate } from "./PurchaseDate";

type EditAssetProps = {
  id: string;
  //setPortfolioListNeedsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPortfolio: () => void;
};

export const EditAsset /*: React.FC<EditAssetProps>*/ = ({
  id,
  //setPortfolioListNeedsUpdate,
  fetchPortfolio,
}: EditAssetProps) => {
  const {
    portfolioList,
    //setPortfolioList,
    purchasedAmount,
    purchaseDate,
    isNumber,
    setIsNumber,
    formattedDateForHistoryApiCall,
    setEditAsset,
    darkMode,
  } = useContext(CryptoContext) as CryptoContextProps;

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoinIsLoading, setSelectedCoinIsLoading] = useState(false);
  const [selectedCoinLoadingHasError, setSelectedCoinLoadingHasError] =
    useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setEditAsset(true);
  };

  const selectedItem = portfolioList.find((item) => item.id === id);

  const updatePortfolioItem = async (
    id: string,
    coinData: any,
    amount: string | null,
    date: string | null,
    historyData: any
  ) => {
    try {
      const res = await axios.put(`http://localhost:3001/api/portfolio/${id}`, {
        purchaseAmount: amount,
        purchaseDate: date,
        coinData,
        historyData,
      });

      fetchPortfolio();
    } catch (err) {
      console.error("Failed to update portfolio item:", err);
    }
  };

  const updateSelectedCoinData = async (coinId: string) => {
    setSelectedCoinIsLoading(true);
    setSelectedCoinLoadingHasError(false);

    try {
      const updatedCoinRes = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );

      const historyRes = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${formattedDateForHistoryApiCall}&localization=false`
      );

      await updatePortfolioItem(
        id,
        updatedCoinRes.data,
        purchasedAmount,
        purchaseDate,
        historyRes.data
      );

      setSelectedCoinIsLoading(false);
    } catch (err) {
      console.error("Error fetching updated coin data:", err);
      setSelectedCoinIsLoading(false);
      setSelectedCoinLoadingHasError(true);
    }
  };

  const handleSaveClick = (coinId: string) => {
    const amount = purchasedAmount !== null ? purchasedAmount : "";
    const isValidNumber = /^\d*\.?\d+$/.test(amount);
    if (!isValidNumber) {
      setShowPopup(true);
      setIsNumber(false);
    } else {
      setShowPopup(false);
      updateSelectedCoinData(coinId);
      setIsNumber(true);
      //setPortfolioListNeedsUpdate(true)
    }
  };

  const handleEdit = () => {
    setIsNumber(true);
    togglePopup();
  };

  return (
    <div>
      <div
        className="flex justify-center items-center w-24 h-10 rounded-md bg-skin-portfolio-item-buttons-background-color text-skin-portfolio-item-buttons-text-color"
        onClick={handleEdit}
      >
        Edit
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur-md  font-space-grotesk">
          <div
            className={`${
              darkMode ? "" : "theme-light"
            } fixed top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[768px] lg:w-[820px] h-[450px] md:h-96 bg-skin-edit-asset-popup-background-color rounded-lg border-gray-300 shadow-md pt-5 pb-9 px-10`}
          >
            <div className="h-full flex flex-col justify-between">
              <div className="h-[13%] flex items-center text-skin-edit-asset-popup-buttons-title-text-color text-xl semi-bold">
                Edit Asset
              </div>
              {selectedItem && (
                <div className="flex items-center">
                  <img
                    className="w-8 mr-2"
                    src={selectedItem.coinData.image.large}
                  />
                  <div
                    className="flex items-center h-10 text-skin-edit-asset-popup-buttons-title-text-color"
                    key={selectedItem.id}
                  >
                    {selectedItem.coinData.name}
                  </div>
                </div>
              )}
              <div className="text-skin-edit-asset-popup-buttons-title-text-color">
                Purchased Amount
              </div>
              <PurchaseAmount amount={selectedItem.purchaseAmount} />
              {!isNumber && <div>Put in a number</div>}
              <div className="text-skin-edit-asset-popup-buttons-title-text-color">
                Purchased Date
              </div>
              <PurchaseDate date={selectedItem.purchaseDate} />
              <div className="flex justify-end mt-2">
                <div
                  className="flex justify-center items-center w-24 h-10 text-skin-edit-asset-popup-buttons-title-text-color bg-skin-edit-asset-buttons-background-color rounded-md mr-4"
                  onClick={() => {
                    handleSaveClick(selectedItem.coinData.id);
                  }}
                >
                  Save
                </div>
                <div
                  className="flex justify-center items-center w-24 h-10 text-skin-edit-asset-popup-buttons-title-text-color bg-skin-edit-asset-buttons-background-color rounded-md"
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

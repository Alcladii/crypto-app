import { useState, useContext } from "react";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type PurchaseDateProps = {
  date?: any;
}

export const PurchaseDate: React.FC<PurchaseDateProps> = ({ date }) => {
  const [localDate, setLocalDate] = useState(date);
  const { setPurchaseDate, setFormattedDateForHistoryApiCall, editAsset, darkMode, } =
    useContext(CryptoContext) as CryptoContextProps;
    
  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const formattedDate = `${dateObject.getDate()}-${
      dateObject.getMonth() + 1
    }-${dateObject.getFullYear()}`;
    setFormattedDateForHistoryApiCall(formattedDate);
  };

  const handleInput = (value: string) => {
    formatDate(value);
    setLocalDate(value); 
    setPurchaseDate(value);
  };

  return (
    <div>
      {editAsset ? <input
        className={`w-full bg-skin-add-edit-asset-popup-items-background-color text-skin-add-edit-asset-popup-input-text-color ${darkMode
          ? "placeholder-placeholder-dark"
          : "placeholder-placeholder-light"} outline-none appearance-none rounded-md h-12 pl-3`}
        type="date"      
        onChange={(e) => handleInput(e.target.value)}
        value={new Date(localDate).toISOString().split('T')[0]}
      /> :
      <input
        className={`w-full bg-skin-add-edit-asset-popup-items-background-color text-skin-add-edit-asset-popup-input-text-color ${darkMode
        ? "placeholder-placeholder-dark"
        : "placeholder-placeholder-light"} outline-none appearance-none rounded-md h-12 pl-3`}
        type="text"
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => (e.target.type = "text")}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Purchased Date"
      />}
    </div>
  );
};

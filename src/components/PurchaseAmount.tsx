import { useState, useContext } from "react";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type PurchaseAmountProps = {
  amount?: string;
}

export const PurchaseAmount: React.FC<PurchaseAmountProps> = ({ amount }) => {
  const { setPurchasedAmount, darkMode } =
    useContext(CryptoContext) as CryptoContextProps;
  const [inputPurchasedAmount, setInputPurchasedAmount] = useState(amount || '');
  const [placeholder, setPlaceholder] = useState('Purchased Amount');

  const handleChange = (value: string) => {
    setInputPurchasedAmount(value);
    setPurchasedAmount(value);
  };

  const handleFocus = () => {
    setPlaceholder('');
  };

  const handleBlur = (e: any) => {
    if (e.target.value === '') {
      setPlaceholder('Purchased Amount');
    }
  };

  return (
    <div>
      <input
        value={inputPurchasedAmount}
        className={`w-full bg-skin-add-edit-asset-popup-items-background-color text-skin-add-edit-asset-popup-input-text-color ${
          darkMode
            ? "placeholder-placeholder-dark"
            : "placeholder-placeholder-light"
        } outline-none appearance-none rounded-md h-12 pl-3`}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

import React, { useContext } from "react";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type DeleteAssetProps = {
  id: string;
  setPortfolioListNeedsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteAsset: React.FC<DeleteAssetProps> = ({
  id,
  setPortfolioListNeedsUpdate,
}) => {
  const { portfolioList, setPortfolioList } = useContext(
    CryptoContext
  ) as CryptoContextProps;

  const handleRemove = (id: string) => {
    const newPortfolioList = portfolioList.filter((item) => item.id !== id);
    setPortfolioList(newPortfolioList);
    setPortfolioListNeedsUpdate(true);
  };

  return (
    <div>
      <button
        className="flex justify-center items-center w-24 h-10 bg-skin-portfolio-item-buttons-background-color text-skin-portfolio-item-buttons-text-color rounded-md mr-4"
        onClick={() => handleRemove(id)}
      >
        Delete
      </button>
    </div>
  );
};

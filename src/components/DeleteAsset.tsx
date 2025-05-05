import React, { useContext } from "react";
import axios from "axios";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type DeleteAssetProps = {
  id: string;
  //setPortfolioListNeedsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPortfolio: () => void;
};

export const DeleteAsset: React.FC<DeleteAssetProps> = ({
  id,
  //setPortfolioListNeedsUpdate,
  fetchPortfolio,
}) => {
  // const { portfolioList, setPortfolioList } = useContext(
  //   CryptoContext
  // ) as CryptoContextProps;

  const handleRemove = async (id: string) => {
    // const newPortfolioList = portfolioList.filter((item) => item.id !== id);
    // setPortfolioList(newPortfolioList);
    // setPortfolioListNeedsUpdate(true);
    try {
      await axios.delete(`http://localhost:3001/api/portfolio/${id}`);
    } catch (err) {
      console.error("Failed to delete portfolio item:", err);
    }
    fetchPortfolio();
  };

  // const deletePortfolioItem = async (id: string) => {
  //   try {
  //     await axios.delete(`http://localhost:3001/api/portfolio/${id}`);
  //     setPortfolioList((prev) => prev.filter((item) => item.id !== id));
  //   } catch (err) {
  //     console.error('Failed to delete portfolio item:', err);
  //   }
  // };

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

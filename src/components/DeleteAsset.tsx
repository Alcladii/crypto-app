import React, { useContext } from "react";
import "../App.css";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type DeleteAssetProps = {
  id: string;
  setPortfolioListNeedsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DeleteAsset: React.FC<DeleteAssetProps> = ({id, setPortfolioListNeedsUpdate}) => {

  const {
        portfolioList,
        setPortfolioList,
      } = useContext(CryptoContext) as CryptoContextProps;
  
  /*const handleClick = (coin : Coin) => {
    const newPortfolioList = portfolioList.filter((item) => item.id !== coin.id)
    setPortfolioList(newPortfolioList)
  }*/


  const handleRemove= (id: string) => {
    const newPortfolioList = portfolioList.filter((item) => item.id !== id);
    setPortfolioList(newPortfolioList);
    setPortfolioListNeedsUpdate(true);
  };
  
  return (
    <div>
      <button onClick={() => handleRemove(id)}>Delete</button>
    </div>
  )
}

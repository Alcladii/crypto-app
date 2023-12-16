import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { TodoContext } from "../contexts/todoContext";
import { CryptoContext } from "../contexts/cryptoContext";

export const PortfolioItem = () => { 
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
        portfolioList,
      } = useContext(CryptoContext);
  
  return (
    <div>
      
    </div>
  )
}
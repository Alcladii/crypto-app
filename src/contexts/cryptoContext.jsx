import { createContext, useState, useEffect } from "react";
import api from '../api'

export const CryptoContext = createContext()

const useLocalState = (key, initialValue) => {
    const storedValue = window.localStorage.getItem(key);
    const item = storedValue ? JSON.parse(storedValue) : initialValue;
    const [state, setState] = useState(item);
  
    const updateState = (value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    };
    return [state, updateState];
  };

export const CryptoProvider = ({children}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [coinList, setCoinList] = useState([])
  const [coinListDsc, setCoinListDsc] = useState(true)

  const getCoinList = async () => {
    try {
      /*setIsLoading(true);
      const {data}  = await axios(      
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${coinPage}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
      );
      setCoinList(coinList.concat(data))
      setCoinPage(coinPage + 1)*/
      /*const { coins }  = await api(
        "/coins/markets",
        "vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );*/
      let coins;
      if (coinListDsc === true){
        setIsLoading(true)
        const response = await api(
          "/coins/markets",
          "vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
        );
        coins = response.data;
        //console.log("top 50", coins)
      } else if (coinListDsc === false) {
        setIsLoading(true)
        const response = await api(
          "/coins/markets",
          "vs_currency=usd&order=market_cap_asc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
        );        
        coins = response.data;   
        //console.log("bottom 50", coins)
      }
      //console.log(coins)
      setCoinList(coins);
      setIsLoading(false);
      setHasError(false)
      //console.log(data)
      } catch (err) {
      //console.log("Error in Fetching Data")
      setHasError(true); 
      setisLoading(false);
    }
  };

  const setToDsc = () => {
    setCoinListDsc(true); 
    console.log("setToDsc run")
  };

  const setToAsc = () => {
    setCoinListDsc(false); 
    console.log("setToAsc run")
  };

  return (
    <CryptoContext.Provider
      value = {{
        coinList,
        isLoading,
        hasError,
        coinListDsc,
        getCoinList,
        setToDsc,
        setToAsc, 
        useLocalState,     
      }} >
        {children}
    </CryptoContext.Provider>
  )
}
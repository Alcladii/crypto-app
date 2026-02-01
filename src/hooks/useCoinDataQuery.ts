import axios from "axios"
import { useQueries } from "@tanstack/react-query";
import { useContext } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/GlobalContext"; // adjust path

export const useCoinDataQuery = (
  selectedCoinIds: string[],
  displayCurrency: string,
  numOfDaysFromUrl: string
) => {
  const getCoinPriceVolume = async (
    coinId: string,
    currency: string,
    numOfDays: string
  ) => {
    const apiUrl =
      numOfDays === "2"
        ? `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}`
        : `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}&interval=daily`;

    const { data } = await axios.get(apiUrl);
    return data; 
  };
  // const { getCoinPriceVolume } = useContext(
  //   CryptoContext
  // ) as CryptoContextProps;

  const results = useQueries({
    queries: selectedCoinIds.map((item) => ({
      queryKey: ["coinData", item, displayCurrency, numOfDaysFromUrl],
      queryFn: () =>
        getCoinPriceVolume(item, displayCurrency, numOfDaysFromUrl),
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    })),
  });

  return results;
};

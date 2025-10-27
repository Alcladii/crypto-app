import { useQueries } from "@tanstack/react-query";
import { useContext } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext"; // adjust path

export const useCoinDataQuery = (
  selectedCoinIds: string[],
  displayCurrency: string,
  numOfDaysFromUrl: string
) => {
  const { getCoinPriceVolume } = useContext(
    CryptoContext
  ) as CryptoContextProps;

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

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { useShowTopFifty } from "./showTopFifty";

export const useInfiniteCoinsListScroll = () => {
  const showTopFifty = useShowTopFifty();
  const { queryParams, displayCurrency } = useContext(
    CryptoContext,
  ) as CryptoContextProps;

  // const getCoinsList = async ({ pageParam }: { pageParam: number }) => {
  //   const order =
  //     showTopFifty || !queryParams.show_top_fifty
  //       ? "market_cap_desc"
  //       : "market_cap_asc";
  //    console.log("get Coins List ran")
  //   const response = await axios.get(
  //     `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${displayCurrency}&order=${order}&per_page=25&page=${pageParam}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
  //   );
  //   return response.data;
  // };

  const getCoinsList = async ({ pageParam }: { pageParam: number }) => {
    const order =
      showTopFifty || !queryParams.show_top_fifty
        ? "market_cap_desc"
        : "market_cap_asc";

    const response = await axios.get(
      "http://localhost:3001/api/coingecko/markets",
      {
        params: {
          vs_currency: displayCurrency,
          order,
          per_page: 25,
          page: pageParam,
          sparkline: true,
          price_change_percentage: "1h,24h,7d",
        },
      },
    );

    return response.data;
  };

  const query = useInfiniteQuery({
    queryKey: ["coins", displayCurrency, showTopFifty],
    queryFn: getCoinsList,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false, //new
    refetchOnReconnect: false, //new
    retry: (failureCount, error: any) => {
      //new
      const status = error?.response?.status;
      if (status === 429) return false;
      return failureCount < 2;
    },
  });

  return query;
};

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { useShowTopFifty } from "./showTopFifty";

const host = import.meta.env.VITE_API_URL;

export const useInfiniteCoinsListScroll = () => {
  const showTopFifty = useShowTopFifty();
  const { queryParams, displayCurrency } = useContext(
    CryptoContext,
  ) as CryptoContextProps;

  const getCoinsList = async ({ pageParam }: { pageParam: number }) => {
    const order =
      showTopFifty || !queryParams.show_top_fifty
        ? "market_cap_desc"
        : "market_cap_asc";

    console.log("order", order)

    const res = await axios.get(`${host}/api/coingecko/markets`, {
      params: {
        vs_currency: displayCurrency,
        order,
        per_page: 25,
        page: pageParam,
        sparkline: true,
        price_change_percentage: "1h,24h,7d",
      },
    });

    if (!res.data.ok) {
      // make React Query go into isError
      const err = new Error(res.data.error.message);
      (err as any).code = res.data.error.code;
      throw err;
    }

    return res.data.data;
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

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { useInfiniteCoinsListScroll } from "../hooks/useInfiniteCoinsListScroll"

interface CoinsListProviderProps {
  children: ReactNode;
}

export type CoinsListContextProps = {
  data: any; // ideally type your coins here later
  fetchNextPage: () => void | Promise<any>;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
};

export const CoinsListContext = createContext<CoinsListContextProps | undefined>(
  undefined
);

export type CryptoContextProps = {
  data: string[]
};



export const CoinsProvider = ({ children }:CoinsListProviderProps) => {
  
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCoinsListScroll();

  //console.log("data", data, "status", status)

  return (
    <CoinsListContext.Provider
      value={{
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      }}
    >
      {children}
    </CoinsListContext.Provider>
  );
};
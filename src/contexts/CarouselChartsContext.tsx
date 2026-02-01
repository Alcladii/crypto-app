import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { useInfiniteCoinsListScroll } from "../hooks/useInfiniteCoinsListScroll"
import { useLocalState } from "../hooks/useLocalState";

interface CarouselChartsProviderProps {
  children: ReactNode;
}

export type CarouselChartsContextProps = {
  selectedCoinData: any[];
  setSelectedCoinData: Dispatch<SetStateAction<any[]>>;
  selectedCoinIds: string[];
};

export const CarouselChartsContext = createContext<CarouselChartsContextProps | undefined>(
  undefined
);

export type CryptoContextProps = {
  data: string[]
};


export const CarouselChartsProvider = ({ children }: CarouselChartsProviderProps) => {
  const [selectedCoinData, setSelectedCoinData] = useLocalState<any[]>("selectedCoinData", []);
  const selectedCoinIds = useMemo(() => {
    return selectedCoinData.map((coin) => coin.id);
  }, [selectedCoinData.map((coin) => coin.id).join(",")]);

  return (
    <CarouselChartsContext.Provider
      value={{
        selectedCoinData,
        setSelectedCoinData,
        selectedCoinIds
      }}
    >
      {children}
    </CarouselChartsContext.Provider>
  );
};
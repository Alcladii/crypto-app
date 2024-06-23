import React, { useState, useContext, useRef } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { useDebounce } from "../hooks/useDebounce";

type CoinSelectWithSearchProps = {
  coinList: any;
  setSelectedOption: React.Dispatch<React.SetStateAction<any>>;
  setSelectedCoinDataIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCoinDataLoadingHasError: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export const CoinSelectWithSearch: React.FC<CoinSelectWithSearchProps> = ({
  coinList,
  setSelectedOption,
  setSelectedCoinDataIsLoading,
  setSelectedCoinDataLoadingHasError,
}) => {
  const { getSingleCoinData } = useContext(CryptoContext) as CryptoContextProps;
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchValue = useDebounce(inputValue, 500);
  let searchInputRef = useRef<HTMLInputElement | null>();

  const handleCoinSelect = (coin: any) => {
    getSingleCoinData(
      coin.id,
      setSelectedOption,
      setSelectedCoinDataIsLoading,
      setSelectedCoinDataLoadingHasError
    );
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const filteredCoinsOptions = coinList.filter((item: any) =>
    item.name.toLowerCase().includes(debouncedSearchValue.toLowerCase())
  );

  return (
    <div className="w-[40%] sm:w-[75%] h-full">
      <input
        className="relative px-2 w-full h-12 rounded-md outline-none bg-skin-calculator-search-bar-unselected-calculator-option-background-color"
        ref={searchInputRef as React.MutableRefObject<HTMLInputElement>}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={inputValue}
        placeholder="search"
      />
      {isFocused ? (
        <div className="h-[73%] w-96 absolute right-0 sm:right-auto overflow-y-scroll rounded-md no-scrollbar bg-skin-calculator-search-drop-down-background-color border-skin-calculator-search-drop-down-border-color">
          {filteredCoinsOptions.map((item: any) => (
            <div
              onMouseDown={() => handleCoinSelect(item)}
              className="my-2 ml-3 cursor-pointer"
              key={item.id}
            >
              {item.name}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

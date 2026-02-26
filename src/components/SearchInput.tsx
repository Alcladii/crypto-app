import { useState, useContext, useEffect, useRef, ChangeEvent } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { ResultList } from "./ResultList";
import { useDebounce } from "../hooks/useDebounce";
import { MagnifyGlass } from "./UI/Svg";

const host = import.meta.env.VITE_API_URL;


type Coin = {
  id: string;
  name: string;
  symbol: string;
  large: string;
}

export const SearchItemInput = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  const [inputValue, setInputValue] = useState<string>("");
  const [showSearchInputPopup, setShowSearchInputPopup] = useState<boolean>(false);
  const debouncedSearchValue = useDebounce(inputValue, 500);
  let searchInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeSearchInput = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowSearchInputPopup(false);
        setInputValue("");
      }
    };
    document.addEventListener("mousedown", closeSearchInput);

    return () => {
      document.removeEventListener("mousedown", closeSearchInput);
    };
  }, []);

  const { data: searchData, isError: fetchSearchDataHasError } = useQuery({
    queryKey: ["search", debouncedSearchValue],
    queryFn: async () => {
      const { data: res } = await axios.get(`${host}/api/coingecko/search`, {
        params: { query: debouncedSearchValue },
      });
      if (!res.ok) throw new Error(res.error.message);
      return res.data.coins as Coin[];
    },
    enabled: debouncedSearchValue.length > 0,
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });

  const results = searchData ?? [];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const toggleSearchInputPopup = () => {
    setShowSearchInputPopup(!showSearchInputPopup);
  };

  return (
    <div className="flex items-center">
      <div ref={searchInputRef} className="relative">
        <div>
          <input
            placeholder="Search for coin"
            onChange={handleChange}
            value={inputValue}
            className={`hidden h-10 lg:block lg:w-80 px-5 outline-none bg-skin-unselected-button-bg rounded-md text-skin-coin-search-input-text-color ${
              darkMode
                ? "placeholder-placeholder-dark"
                : "placeholder-placeholder-light"
            }`}
          />
        </div>
        <button
          className={`lg:hidden flex items-center justify-center h-10 w-6 appearance-none rounded-md bg-transparent`}
          onClick={toggleSearchInputPopup}
        >
          <MagnifyGlass />
        </button>
        <div
          className={`border ${
            showSearchInputPopup ? "absolute" : "hidden"
          } -left-24 md:left-0 -bottom-14 lg:hidden w-56 p-0.5 bg-skin-search-popup-background-color rounded-md`}
        >
          <input
            placeholder="Search for coin"
            className={`w-full h-10 rounded-md bg-skin-unselected-button-bg focus:placeholder-transparent p-2 text-skin-coin-search-input-text-color ${
              darkMode
                ? "placeholder-placeholder-dark"
                : "placeholder-placeholder-light"
            }`}
            onChange={handleChange}
            value={inputValue}
          />       
        </div>
        {debouncedSearchValue !== "" && <ResultList results={results} fetchSearchDataHasError={fetchSearchDataHasError} setInputValue={setInputValue}/>}
      </div>
    </div>
  );
};

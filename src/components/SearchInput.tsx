import { useState, useContext, useEffect, useRef, ChangeEvent } from "react";
import axios from "axios";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import { ResultList } from "./ResultList";
import { useDebounce } from "../hooks/useDebounce";

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
  const [results, setResults] = useState<Coin[]>([]);
  const [fecthingData, setFetchingData] = useState<boolean>(false)
  const [fetchSearchDataHasError, setFetchSearchDataHasError] = useState<boolean>(false)
  const key = import.meta.env.VITE_API_KEY_CRYPTO;
  const debouncedSearchValue = useDebounce(inputValue, 500);
  let searchInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeSearchInput = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowSearchInputPopup(false);
        setInputValue("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", closeSearchInput);

    return () => {
      document.removeEventListener("mousedown", closeSearchInput);
    };
  }, []);

  const fetchSearchData = async (value: string) => {
    console.log("fetchSearchData ran in SearchInput.tsx")
    setFetchSearchDataHasError(false)
    setFetchingData(true)
    try {
      const response = await axios <{ coins: Coin[] }>(
        `https://api.coingecko.com/api/v3/search?key=${key}&query=${value.toLowerCase()}`
      );
      const results = response.data.coins;
      setResults(results);
      setFetchingData(false)
    } catch (error) {
      setFetchingData(false)
      setFetchSearchDataHasError(true)      
    }
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      fetchSearchData(debouncedSearchValue);
    }
  }, [debouncedSearchValue]);

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke={
              darkMode ? "rgba(209, 209, 214, 1)" : "rgba(66, 66, 134, 1)"
            }
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
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

import React, { useState, useEffect, useContext, useRef } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type CoinSelectWithSearchProps = {
  coinList: any,
  setSelectedOption: React.Dispatch<React.SetStateAction<any>>, 
}

export const CoinSelectWithSearch: React.FC<CoinSelectWithSearchProps> = ({ coinList, setSelectedOption }) => {
  const { useLocalState, getSingleCoinData, darkMode } =
    useContext(CryptoContext) as CryptoContextProps;
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  //const [filteredResult, setFilteredResult] = useState([])

  let searchInputRef = useRef<HTMLInputElement | null> ();

  console.log(isFocused);

  //console.log(coinList)
  //console.log(selectedOption);

  /*const coinsOptions =
    coinList &&
    coinList.map((item) => (
      {value: item.name, label: item.id}
    ));*/

  /*const coinsOptions =
    coinList &&
    coinList.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ));*/

  /*const handleChange = (option) => {
    setSelectedOption(option);
  };*/

  const handleCoinSelect = (coin: any) => {
    getSingleCoinData(coin.id, setSelectedOption);
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
    item.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  //console.log(filteredCoinsOptions);

  return (
    /*<Select
      value={selectedOption}
      onChange={handleCoinSelect}
      options={coinsOptions}
      isSearchable
    />*/
    /*<select
        className="w-[75%] ml-2 bg-skin-add-edit-asset-popup-items-background-color text-skin-add-asset-popup-coin-selector-text-color outline-none appearance-none rounded-md h-12 pl-3"
        //value={singleCoinDataInInvestmentCalculator.name}
        onChange={(e) => {
          handleCoinSelect(e.target.value);
        }}
      >
        <option value="" disabled selected>
          Please select coins
        </option>
        {coinsOptions}
      </select>*/

    <div className="w-[75%]">
        <input
          className="relative px-2 w-full"
          ref={searchInputRef as React.MutableRefObject<HTMLInputElement>}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={inputValue}
          placeholder="search"
        />
        {isFocused ? (
          <div className="h-60 absolute overflow-y-scroll">
            {filteredCoinsOptions.map((item: any) => (
              <div onMouseDown={()=>handleCoinSelect(item)} className="border" key={item.id}>
                {" "}
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

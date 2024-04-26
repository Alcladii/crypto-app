import React from "react";
import { useHistory } from "react-router-dom";
import "../App.css";

export const ResultList = ({results}) => {
  const history = useHistory();

  const handleClick = (item) => {
    history.push(`/coin-page/${item.id}`);
  };
  

  return (  
    <div className={`${results.length === 0 ? "hidden" : "absolute"} top-[230%] lg:top-[100%] -left-24 md:left-0 flex flex-col w-56 px-2.5 py-1 lg:w-[100%] rounded-md shadow-md shadow-color-gray-300 mt-1 max-h-40 overflow-y-scroll no-scrollbar text-skin-coin-search-result-list-text-color cursor-pointer bg-skin-coin-search-result-list-background-color`}>
      {results.map((item) => (
        <div key={item.id} onClick={() => handleClick(item)}>{item.name}</div>
      ))}
    </div>   
  );
};

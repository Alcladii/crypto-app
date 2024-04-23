import React from "react";
import { useHistory } from "react-router-dom";
import "../App.css";

export const ResultList = ({ results }) => {
  const history = useHistory();

  const handleClick = (item) => {
    history.push(`/coin-page/${item.id}`);
  };
  

  return (
    <div className="absolute top-[200%] md:top-[100%] left-0 flex flex-col w-60 lg:w-[100%] rounded-md shadow-md shadow-color-gray-300 mt-1 max-h-40 overflow-y-scroll no-scrollbar text-skin-coin-search-result-list-text-color cursor-pointer bg-skin-coin-search-result-list-background-color">
      {results.map((item) => (
        <div onClick={() => handleClick(item)}>{item.name}</div>
      ))}
    </div>
  );
};

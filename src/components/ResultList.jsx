import React from "react";
import { useHistory } from "react-router-dom";
import "../App.css";

export const ResultList = ({ results }) => {
  const history = useHistory();

  const handleClick = (item) => {
    history.push(`/coin-page/${item.id}`);
  };

  return (
    <div
      className={`${
        results.length === 0 ? "hidden" : "absolute"
      } top-[230%] lg:top-[100%] -left-24 md:left-0 flex flex-col w-56 px-2.5 py-1 lg:w-[100%] rounded-md shadow-md shadow-color-gray-300 mt-1 max-h-40 overflow-y-scroll no-scrollbar text-skin-coin-search-result-list-text-color cursor-pointer bg-skin-coin-search-result-list-background-color`}
    >
      {results.map((item) => (
        <div className="flex items-center my-1 px-1" key={item.id} onClick={() => handleClick(item)}>
          <img className="w-8 h-auto mr-2" src={item.large} />
          {item.name}
        </div>
      ))}
    </div>
  );
};

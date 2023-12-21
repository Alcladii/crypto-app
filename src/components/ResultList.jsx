import React from "react";
import { useHistory } from "react-router-dom";
import "../App.css";

export const ResultList = ({ results }) => {
  const history = useHistory();

  const handleClick = (item) => {
    history.push(`/coin-page/${item.id}`);
  };
  
  return (
    <div className="result-list">
      {results.map((item) => (
        <div onClick={() => handleClick(item)}>{item.name}</div>
      ))}
    </div>
  );
};

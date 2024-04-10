import React, { useContext, } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const DaysButton = ({ days, buttonText }) => {
  const { setNumOfDays, changeSearchParams, queryParams, darkMode } = useContext(CryptoContext);

  const daysInChart = queryParams.days

  return (
    <div className={`${darkMode ? "" : "theme-light"}`}>
      <div
        className={`${
          daysInChart === days ? "bg-skin-days-button-background-color" : "bg-transparent"
        } w-16 h-10 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer ${daysInChart === days ? "text-skin-days-button-top-bottom-fifty-text-color" : "text-skin-unselected-days-top-bottom-fifty-button-text-color"}`}
        onClick={() => {
          setNumOfDays(days);
          changeSearchParams("days", days)
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};

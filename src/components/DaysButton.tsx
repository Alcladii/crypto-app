import { useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

type DaysButtonProps = {
  days: string;
  buttonText: string;
}

export const DaysButton: React.FC<DaysButtonProps> = ({ days, buttonText }) => {
  const { setNumOfDays, changeSearchParams, queryParams, darkMode } =
    useContext(CryptoContext);

  const daysInChart: string = queryParams.days as string;

  return (
    <div className={`${darkMode ? "" : "theme-light"} w-[17%] sm:w-16`}>
      <div
        className={`${
          daysInChart === days
            ? "bg-skin-days-button-background-color"
            : "bg-transparent"
        } h-10 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer ${
          daysInChart === days
            ? "text-skin-days-button-top-bottom-fifty-text-color"
            : "text-skin-unselected-days-top-bottom-fifty-button-text-color"
        }`}
        onClick={() => {
          setNumOfDays(days);
          changeSearchParams("days", days);
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};

/*import React, { useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const DaysButton = ({ days, buttonText }) => {
  const { setNumOfDays, changeSearchParams, queryParams, darkMode } =
    useContext(CryptoContext);

  const daysInChart = queryParams.days;

  return (
    <div className={`${darkMode ? "" : "theme-light"} w-[17%] sm:w-16`}>
      <div
        className={`${
          daysInChart === days
            ? "bg-skin-days-button-background-color"
            : "bg-transparent"
        } h-10 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer ${
          daysInChart === days
            ? "text-skin-days-button-top-bottom-fifty-text-color"
            : "text-skin-unselected-days-top-bottom-fifty-button-text-color"
        }`}
        onClick={() => {
          setNumOfDays(days);
          changeSearchParams("days", days);
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};*/

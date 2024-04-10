import React, { useContext, } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const DaysButton = ({ days, buttonText }) => {
  const { setNumOfDays, changeSearchParams, queryParams } = useContext(CryptoContext);

  const daysInChart = queryParams.days

  return (
    <div>
      <div
        className={`${
          daysInChart === days ? "selected-button" : "bg-transparent"
        } w-16 h-10 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer`}
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

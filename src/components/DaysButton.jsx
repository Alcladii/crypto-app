import React, { useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const DaysButton = ({ days, buttonText }) => {
  const { numOfDays, setNumOfDays } = useContext(CryptoContext);

  return (
    <div>
      <div
        className={`${
          numOfDays === days ? "selected-button" : "bg-transparent"
        } w-16 h-10 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer`}
        onClick={() => {
          setNumOfDays(days);
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};

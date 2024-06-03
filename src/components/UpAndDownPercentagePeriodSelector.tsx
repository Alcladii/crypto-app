import { useState, useContext } from "react";
import "../App.css";
import { CryptoContext, CryptoContextProps} from "../contexts/cryptoContext";

type UpAndDownPercentagePeriodSelectorProps = {
  selectedTimePeriod: string;
  setSelectedTimePeriod: React.Dispatch<React.SetStateAction<string>>;
}

export const UpAndDownPercentagePeriodSelector: React.FC<UpAndDownPercentagePeriodSelectorProps>= ({
  selectedTimePeriod,
  setSelectedTimePeriod,
}) => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  const timePeriod = [
    { time: "1h", buttonText: "1h" },
    { time: "24h", buttonText: "24h" },
    { time: "7d", buttonText: "7D" },
  ];

  return (
    <div
      className={`${
        darkMode ? "" : "theme-light"
      } flex w-fit h-auto items-center bg-skin-days-bar-background-color rounded-md`}
    >
      {timePeriod.map((item) => (
        <div
          key={item.time}
          className={`h-10 w-16 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer ${
            item.time === selectedTimePeriod
              ? "bg-skin-days-button-background-color"
              : "bg-transparent"
          } ${
            item.time === selectedTimePeriod
              ? "text-skin-days-button-top-bottom-fifty-text-color"
              : "text-skin-unselected-days-top-bottom-fifty-button-text-color"
          }`}
          onClick={() => {
            setSelectedTimePeriod(item.time);
          }}
        >
          {item.buttonText}
        </div>
      ))}
    </div>
  );
};

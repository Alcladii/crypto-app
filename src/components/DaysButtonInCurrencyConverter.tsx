import { useContext } from "react";
import "../App.css";
import { CryptoContext } from "../contexts/cryptoContext";

export const DaysButtonInCurrencyConverter = ({ days, buttonText }) => {
  const { currencyConverterDays, setCurrencyConverterDays } =
    useContext(CryptoContext);

  return (
    <div className="w-[17%] sm:w-16">
      <div
        className={`${
          currencyConverterDays === days ? "bg-skin-days-button-background-color" : "bg-transparent"
        } ${currencyConverterDays === days ? "text-skin-days-button-top-bottom-fifty-text-color" : "text-skin-unselected-days-top-bottom-fifty-button-text-color"} h-10 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer`}
        onClick={() => {
          setCurrencyConverterDays(days);
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};


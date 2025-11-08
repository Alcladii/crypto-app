import { useContext, useEffect } from "react";
import { DaysButton } from "./DaysButton";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type DaysSelectionData = {
  days: string;
  buttonText: string;
};

const daysSelectionData: DaysSelectionData[] = [
  { days: "2", buttonText: "1D" },
  { days: "7", buttonText: "7D" },
  { days: "30", buttonText: "1M" },
  { days: "90", buttonText: "90D" },
  { days: "180", buttonText: "180D" },
  { days: "365", buttonText: "1Y" },
];

export const DataPeriodSelector = () => {
  const { handleSearchParams } = useContext(
    CryptoContext
  ) as CryptoContextProps;

  useEffect(() => {
    handleSearchParams("days", "7");
  }, []);

  return (
    <div>
      <div className="flex my-5 w-full sm:w-fit h-auto bg-skin-days-bar-background-color rounded-md">
        {daysSelectionData.map((item) => (
          <DaysButton
            key={item.days}
            days={item.days}
            buttonText={item.buttonText}
          />
        ))}
      </div>
    </div>
  );
}

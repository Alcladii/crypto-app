

import "../App.css";
import { useQueryParams } from "../hooks/useQueryParams";

type DaysButtonProps = {
  days: string;
  buttonText: string;
};

export const DaysButton: React.FC<DaysButtonProps> = ({ days, buttonText }) => {
  //const { darkMode } = useContext(CryptoContext) as CryptoContextProps;

  const { queryParams, handleSearchParams } = useQueryParams()

  const daysFromSearchParams = queryParams.days

  return (
    // <div className={`${darkMode ? "" : "theme-light"} w-[17%] sm:w-16`}>
    <div className={` w-[17%] sm:w-16`}>
      <div
        className={`${
          daysFromSearchParams === days
            ? "bg-skin-days-button-background-color"
            : "bg-transparent"
        } h-10 mx-1 my-1  flex justify-center items-center rounded-md cursor-pointer ${
          daysFromSearchParams === days
            ? "text-skin-days-button-top-bottom-fifty-text-color"
            : "text-skin-unselected-days-top-bottom-fifty-button-text-color"
        }`}
        onClick={() => {
          //setNumOfDays(days);
          handleSearchParams("days", days);
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};

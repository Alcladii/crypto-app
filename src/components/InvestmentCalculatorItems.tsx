import { useContext } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type CalculatorInputProps = {
  formInput: {
    contributionInterval: string;
    initialInvestment: string;
    investmentAdded: string;
    targetGrowthRate: string;
    startDate: string;
    endDate: string;
  };
  setFormInput: React.Dispatch<React.SetStateAction<any>>;
  calculationResult: {
    netInvestment: number;
    coinsValue: number;
  };
  valueCostIsSelected: boolean;
};

export const InvestmentCalculatorItems: React.FC<CalculatorInputProps> = ({
  formInput,
  setFormInput,
  calculationResult,
  valueCostIsSelected,
}) => {
  const { darkMode, retainTwoDigits } = useContext(
    CryptoContext
  ) as CryptoContextProps;
  const {
    contributionInterval,
    initialInvestment,
    investmentAdded,
    targetGrowthRate,
    startDate,
    endDate,
  } = formInput;

  const handleInput = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  return (
    <form className="block">
      <div className="w-full flex justify-between mb-4">
        <div className="flex flex-col sm:flex-row w-full sm:w-[65%]">
          <div className="mb-2 sm:mr-2 sm:mb-0 w-full sm:w-[50%]">
            <input
              id="start-date"
              name="startDate"
              className={`w-full px-3 bg-skin-calculator-items-container-dates-selector-background-color text-calculator-date-seletors-text-color ${
                darkMode
                  ? "placeholder-placeholder-dark"
                  : "placeholder-placeholder-light"
              } outline-none appearance-none rounded-md h-10`}
              type="date"
              onChange={handleInput}
              value={startDate}
            />
          </div>
          <div className="mt-2 sm:ml-2 sm:mt-0 w-full sm:w-[50%]">
            <input
              id="end-date"
              name="endDate"
              className={`w-full px-3 bg-skin-calculator-items-container-dates-selector-background-color text-calculator-date-seletors-text-color ${
                darkMode
                  ? "placeholder-placeholder-dark"
                  : "placeholder-placeholder-light"
              } outline-none appearance-none rounded-md h-10`}
              type="date"
              onChange={handleInput}
              value={endDate}
            />
          </div>
        </div>
        <div className="hidden sm:block w-[10%] rounded-md flex items-center justify-center bg-skin-calculator-items-container-dates-selector-background-color text-calculator-date-seletors-text-color">
          Q-ty
        </div>
      </div>
      <div className="px-6 py-4 h-auto rounded-md bg-skin-calculator-items-container-dates-selector-background-color">
        <div>
          <label
            className="sm:h-12 mb-2 sm:mb-0 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between"
            htmlFor={"initial-investment"}
          >
            <span>Contribution interval, days</span>
            <input
              className="sm:px-1 py-1 sm:py-0 text-left sm:text-right bg-transparent outline-none text-lg"
              id="contribution-interval"
              name="contributionInterval"
              type="text"
              value={contributionInterval}
              onChange={handleInput}
            />
          </label>
        </div>
        <div>
          <label
            className="sm:h-12 mb-2 sm:mb-0 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between"
            htmlFor={"initial-investment"}
          >
            <span>Initial investment, $</span>
            <input
              className="sm:px-1 py-1 sm:py-0 text-left sm:text-right h-9 bg-transparent outline-none text-lg"
              id="initial-investment"
              name="initialInvestment"
              type="text"
              value={initialInvestment}
              onChange={handleInput}
            />
          </label>
        </div>
        {!valueCostIsSelected ? (
          <div>
            <label
              className="sm:h-12 mb-2 sm:mb-0 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between"
              htmlFor={"investment-Added"}
            >
              <span>Investment added each interval, $</span>
              <input
                className="sm:px-1 py-1 sm:py-0 text-left sm:text-right h-9 bg-transparent outline-none text-lg"
                id="investment-Added"
                name="investmentAdded"
                type="text"
                value={investmentAdded}
                onChange={handleInput}
              />
            </label>
          </div>
        ) : (
          <div>
            <label
              className="sm:h-12 mb-2 sm:mb-0 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between"
              htmlFor={"target-growth-percentage"}
            >
              <span>Grow rate per interval %</span>
              <input
                className="sm:px-1 py-1 sm:py-0 text-left sm:text-right h-9 bg-transparent outline-none text-lg"
                id="target-growth-percentage"
                name="targetGrowthRate"
                type="text"
                value={targetGrowthRate}
                onChange={handleInput}
              />
            </label>
          </div>
        )}
        <div className="sm:h-12 mb-2 sm:mb-0 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>Total Amount Spent on investment, $</div>
          <div className="text-right sm:px-1 h-9 flex items-center">
            {calculationResult !== null &&
              retainTwoDigits(calculationResult.netInvestment)}
          </div>
        </div>
        <div className="sm:h-12 mb-2 sm:mb-0 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>Coins Value, $</div>
          <div className="text-right sm:px-1 h-9 flex items-center">
            {calculationResult !== null &&
              retainTwoDigits(calculationResult.coinsValue)}
          </div>
        </div>
      </div>
    </form>
  );
};

import { useContext } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

type PriceChangePercentageTextProps = {
  coin: number;
}

export const PriceChangePercentageText: React.FC<PriceChangePercentageTextProps> = ({ coin }) => {
  const { retainTwoDigits } = useContext(CryptoContext) as CryptoContextProps;

  return (
    <div
      className={`flex justify-start items-center ${
        coin > 0 ? "text-skin-change-percentage-in-coin-page-positive-text-color" : "text-skin-change-percentage-in-coin-page-negative-text-color"
      }`}
    >
      {coin !== null ? retainTwoDigits(Math.abs(coin)) : "N/A"}%
    </div>
  );
};
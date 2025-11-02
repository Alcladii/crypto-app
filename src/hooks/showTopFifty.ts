import { useContext } from "react";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";

export const useShowTopFifty = () => {
  const { queryParams } = useContext(CryptoContext) as CryptoContextProps;
  const showTopFifty = queryParams.show_top_fifty === "true";
  return showTopFifty;
};

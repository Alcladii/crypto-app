import { useState, useEffect, useContext, useRef, useMemo } from "react";
import styled from "styled-components";
import { useCoinDataQuery } from "../hooks/useCoinDataQuery";
import { CryptoContext, CryptoContextProps } from "../contexts/cryptoContext";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

const ColorIndicator = styled.div<{ background: string }>`
  height: 10px;
  width: 15px;
  background: ${(props) => props.background};
`;

export const ChartsPanel = () => {
  const {
    convertToBillion,
    displayCurrency,
    currencySymbol,
    selectedCoinData,
    handleSearchParams,
    queryParams,
    changeSearchParams,
    darkMode,
    selectedCoinIds,
    numOfDaysFromUrl,
  } = useContext(CryptoContext) as CryptoContextProps;

  const results = useCoinDataQuery(
    selectedCoinIds,
    displayCurrency,
    numOfDaysFromUrl,
  );

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  // Only keep successful data (removes undefined from 429 / errors)
  const priceVolumeList = results
    .filter((r) => r.isSuccess && r.data)
    .map((r) => r.data);

  const colors = ["#7878FA", "#D878FA", "#01F1E3"];

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row justify-center items-center h-auto my-7 text-sm xl:text-base">
          <div className="w-full md:w-1/2 h-auto p-5 mr-0 md:mr-7 mb-3 md:mb-0 bg-skin-charts-background-color rounded-md">
            {isLoading ? (
              <div className="text-skin-prompt-text-color">Loading chart…</div>
            ) : isError ? (
              <div className="text-skin-prompt-text-color">
                Rate limit hit (429). Please wait a moment and try again.
              </div>
            ) : priceVolumeList.length > 0 ? (
              <LineChart priceVolumeList={priceVolumeList} />
            ) : (
              <div className="text-skin-prompt-text-color">
                No chart data yet — select a coin to view chart.
              </div>
            )}
            <div className="flex justify-between flex-col lg:flex-row">
              {selectedCoinData &&
                selectedCoinData.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center mx-2.5 mt-2 text-skin-chart-color-indicator-text-color"
                  >
                    <ColorIndicator
                      background={colors[selectedCoinData.indexOf(coin)]}
                    ></ColorIndicator>
                    &nbsp;{coin.name}&nbsp;{currencySymbol}
                    {coin.current_price.toLocaleString()}
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 h-auto p-5 mr-0 md:ml-7 mt-3 md:mt-0 bg-skin-charts-background-color rounded-md">
              {isLoading ? (
              <div className="text-skin-prompt-text-color">Loading chart…</div>
            ) : isError ? (
              <div className="text-skin-prompt-text-color">
                Rate limit hit (429). Please wait a moment and try again.
              </div>
            ) : priceVolumeList.length > 0 ? (
              <BarChart priceVolumeList={priceVolumeList} />
            ) : (
              <div className="text-skin-prompt-text-color">
                No chart data yet — select a coin to view chart.
              </div>
            )}
            <div className="flex justify-between flex-col lg:flex-row">
              {selectedCoinData &&
                selectedCoinData.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center mx-1 mt-2 text-skin-chart-color-indicator-text-color"
                  >
                    <ColorIndicator
                      background={colors[selectedCoinData.indexOf(coin)]}
                    ></ColorIndicator>
                    &nbsp;{coin.name}&nbsp;{currencySymbol}
                    {convertToBillion(coin.total_volume)}B
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

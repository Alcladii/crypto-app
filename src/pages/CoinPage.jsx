import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { CryptoContext } from "../contexts/cryptoContext";
import { PriceChangePercentageText } from "../components/PriceChangePercentageText";
import { Arrow } from "../components/Arrow";
import { CoinPagePlusInCircleIcon } from "../components/CoinPagePlusInCircleIcon";

const ProgressBarOuter = styled.div`
  border-radius: 99px;
  background: ${(props) => `${props.background}80`};
  height: 8px;
  width: 100%;
`;

const ProgressBarInner = styled.div`
  border-radius: 99px;
  height: 8px;
  width: ${(props) => props.width * 100}%;
  background: ${(props) => props.background};
`;

const CoinPage = ({ portfolioList }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const coinId = useParams();

  const history = useHistory();

  const {
    convertToBillion,
    getSingleCoinData,
    singleCoin,
    singleCoinIsLoading,
    singleCoinLoadingHasError,
    displayCurrency,
    getCurrencyList,
    currencySymbol,
    retainTwoDigits,
    setSingleCoin,
    darkMode,
    redirectedFromPortfolioPage,
  } = useContext(CryptoContext);

  useEffect(() => {
    getSingleCoinData(coinId.coinId);
  }, [coinId.coinId]);

  useEffect(() => {
    getCurrencyList();
  }, []);

  const handleClick = () => {
    setSingleCoin(null);
    history.push("/");
  };

  const naviBackToPortfolio = () => {
    setSingleCoin(null);
    history.push("/portfolio");
  };

  let htmlContent;
  if (singleCoin !== null) {
    htmlContent = singleCoin.description.en;
  } else {
    htmlContent = "";
  }

  const createMarkup = () => {
    if (htmlContent !== "") {
      let processedContent = htmlContent;
      if (!isExpanded && htmlContent.length > 1045) {
        processedContent = htmlContent.slice(0, 1045) + "...";
      }
      processedContent = processedContent.replace(
        /<a href="(.*?)">(.*?)<\/a>/g,
        '<a href="$1" target="_blank">$2</a>'
      );
      return { __html: `${processedContent}` };
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const calculateProfit = (item) => {
    return retainTwoDigits(
      (item.coinData.market_data.current_price[displayCurrency] -
        item.historyData.market_data.current_price[displayCurrency]) *
        item.purchaseAmount1
    );
  };

  return (
    <div
      className={`bg-skin-app h-full w-screen ${darkMode ? "" : "theme-light"}`}
    >
      <div className="max-w-[1440px] mx-auto px-10 py-8 font-space-grotesk text-skin-single-coin-page-text-color">
        {!redirectedFromPortfolioPage ? (
          <div
            className="flex justify-center items-center w-36 h-10 bg-skin-coins-converter-selected-button-background rounded-lg"
            onClick={handleClick}
          >
            Back to Coins
          </div>
        ) : (
          <div
            className="flex justify-center items-center w-40 h-10 bg-skin-coins-converter-selected-button-background rounded-lg"
            onClick={naviBackToPortfolio}
          >
            Back to Portfolio
          </div>
        )}

        {singleCoinIsLoading && (
          <div className="my-5 flex justify-center items-center">
            Loading Coin
          </div>
        )}
        {singleCoinLoadingHasError && (
          <div className="my-10 flex justify-center items-center text-2xl">
            Error in fetching Coin
          </div>
        )}
        {singleCoin !== null && (
          <div className="flex w-full my-5">
            <div className="column-1 flex flex-col w-[55%] mr-6">
              <div className="flex">
                <div className="flex w-[45%] h-96 flex flex-col items-center mr-3">
                  <div className="w-full h-[80%] flex flex-col justify-center items-center rounded-lg bg-skin-single-coin-page-modules-background-color mb-3">
                    {singleCoin.image && (
                      <div className="p-3 rounded-lg bg-skin-coin-icon-wrapper-background-color">
                        <img src={singleCoin.image.small} />
                      </div>
                    )}
                    <div className="mt-6 text-2xl font-semibold">
                      <span>{singleCoin.name}</span>&nbsp;
                      {singleCoin.symbol && (
                        <span>({singleCoin.symbol.toUpperCase()})</span>
                      )}
                    </div>
                  </div>
                  <div className="h-[20%] w-full flex justify-center items-center mt-3 bg-skin-single-coin-page-modules-background-color rounded-lg">
                    {singleCoin.links && (
                      <a
                        className="text-skin-single-coin-link-text-color"
                        target="_blank"
                        href={singleCoin.links.homepage[0]}
                      >
                        {singleCoin.links.homepage[0]}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex w-[55%] h-96 flex flex-col items-center ml-3 bg-skin-single-coin-page-modules-background-color rounded-lg">
                  <div className="flex justify-center items-center h-[36%]">
                    {singleCoin.market_data && (
                      <div className="mr-4 text-3xl font-semibold">
                        {currencySymbol}
                        {singleCoin.market_data.current_price[
                          displayCurrency
                        ].toLocaleString()}
                      </div>
                    )}
                    {singleCoin.market_data && (
                      <div className="flex items-center">
                        <div className="mr-2">
                          <Arrow
                            priceChange={
                              singleCoin.market_data.price_change_percentage_24h
                            }
                          />
                        </div>
                        <div className="text-lg font-semibold">
                          <PriceChangePercentageText
                            coin={
                              singleCoin.market_data.price_change_percentage_24h
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {portfolioList &&
                    portfolioList.map(
                      (item) =>
                        item.coinData.id === coinId.coinId && (
                          <div key={uuidv4()} className=" flex items-center">
                            <div className="text-xl mr-3">Profit:</div>
                            <div
                              className={`text-xl ${
                                calculateProfit(item) > 0
                                  ? "text-skin-change-percentage-in-coin-page-positive-text-color"
                                  : "text-skin-change-percentage-in-coin-page-negative-text-color"
                              }`}
                            >
                              {currencySymbol}
                              {calculateProfit(item)}
                            </div>
                          </div>
                        )
                    )}
                  <div className="flex flex-col w-full h-[64%]">
                    <div className="flex flex-col justify-center items-center h-[50%]">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {singleCoin.market_data && (
                            <Arrow
                              priceChange={
                                singleCoin.market_data.ath_change_percentage[
                                  displayCurrency
                                ]
                              }
                            />
                          )}
                        </div>
                        All Time High:
                        {singleCoin.market_data && (
                          <div className="mx-2">
                            {currencySymbol}
                            {singleCoin.market_data.ath[
                              displayCurrency
                            ].toLocaleString()}
                          </div>
                        )}
                        {singleCoin.market_data && (
                          <div>
                            {singleCoin.market_data.ath_change_percentage[
                              displayCurrency
                            ].toFixed(2)}
                            %
                          </div>
                        )}
                      </div>
                      {singleCoin.market_data && (
                        <div className="text-skin-single-coin-time-text-color">
                          {new Date(
                            singleCoin.market_data.ath_date[displayCurrency]
                          ).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            timeZone: "GMT",
                          })}
                          &nbsp;GMT
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center items-center h-[50%]">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {singleCoin.market_data && (
                            <Arrow
                              priceChange={
                                singleCoin.market_data.atl_change_percentage[
                                  displayCurrency
                                ]
                              }
                            />
                          )}
                        </div>
                        All Time Low:
                        {singleCoin.market_data && (
                          <div className="mx-2">
                            {currencySymbol}
                            {singleCoin.market_data.atl[
                              displayCurrency
                            ].toLocaleString()}
                          </div>
                        )}
                        {singleCoin.market_data && (
                          <div>
                            <div>
                              {singleCoin.market_data.atl_change_percentage[
                                displayCurrency
                              ].toFixed(2)}
                              %
                            </div>
                          </div>
                        )}
                      </div>
                      {singleCoin.market_data && (
                        <div className="text-skin-single-coin-time-text-color">
                          {new Date(
                            singleCoin.market_data.atl_date[displayCurrency]
                          ).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            timeZone: "GMT",
                          })}
                          &nbsp;GMT
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-36">
                <div className="mb-4 text-xl font-semibold">Description</div>
                <p>
                  {singleCoin && (
                    <span dangerouslySetInnerHTML={createMarkup(htmlContent)} />
                  )}
                  {htmlContent.length > 996 && (
                    <span
                      style={{
                        display: "inline",
                        color: "#6060FF",
                        cursor: "pointer",
                      }}
                      onClick={toggleExpand}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="column-2 flex flex-col w-[45%] ml-6 ">
              <div className="h-[500px] w-full px-14 py-14 bg-skin-single-coin-page-modules-background-color rounded-lg flex flex-col justify-between text-lg">
                {singleCoin.market_data && (
                  <div className="flex items-center">
                    <CoinPagePlusInCircleIcon />
                    &nbsp;&nbsp; Market Cap: {currencySymbol}
                    {convertToBillion(
                      singleCoin.market_data.market_cap[displayCurrency]
                    )}
                    B&nbsp;&nbsp;
                    {singleCoin.market_data.price_change_percentage_24h.toFixed(
                      2
                    )}
                    %
                  </div>
                )}
                {singleCoin.market_data && (
                  <div className="flex items-center">
                    <CoinPagePlusInCircleIcon />
                    &nbsp;&nbsp; Fully Diluted Valuation: {currencySymbol}
                    {convertToBillion(
                      singleCoin.market_data.fully_diluted_valuation[
                        displayCurrency
                      ]
                    )}
                    B
                  </div>
                )}
                {singleCoin.market_data && (
                  <div className="flex items-center">
                    <CoinPagePlusInCircleIcon />
                    &nbsp;&nbsp; Volume 24h: {currencySymbol}
                    {convertToBillion(
                      singleCoin.market_data.market_cap_change_24h_in_currency[
                        displayCurrency
                      ]
                    )}
                    B
                  </div>
                )}
                {singleCoin.market_data && (
                  <div className="flex items-center">
                    <CoinPagePlusInCircleIcon />
                    &nbsp;&nbsp; Volume/Market:{" "}
                    {(
                      singleCoin.market_data.total_volume[displayCurrency] /
                      singleCoin.market_data.market_cap[displayCurrency]
                    ).toFixed(5)}
                  </div>
                )}

                {singleCoin.market_data && (
                  <div className="flex items-center">
                    <CoinPagePlusInCircleIcon />
                    &nbsp;&nbsp; Total Volume:{" "}
                    {singleCoin.market_data.total_volume[
                      displayCurrency
                    ].toLocaleString()}
                    BTC
                  </div>
                )}
                {singleCoin.market_data && (
                  <div className="flex items-center">
                    <CoinPagePlusInCircleIcon />
                    &nbsp;&nbsp; Circulating Supply:{" "}
                    {singleCoin.market_data.circulating_supply.toLocaleString()}
                    BTC
                  </div>
                )}
                {singleCoin.market_data &&
                  (singleCoin.market_data.max_supply !== null ? (
                    <div className="flex items-center">
                      <CoinPagePlusInCircleIcon />
                      &nbsp;&nbsp; Max Supply:{" "}
                      {singleCoin.market_data.max_supply.toLocaleString()}
                      BTC
                    </div>
                  ) : (
                    <div> Max Supply: N/A</div>
                  ))}
                <div className="flex justify-between">
                  {singleCoin.market_data && (
                    <div>
                      {retainTwoDigits(
                        (singleCoin.market_data.total_volume[displayCurrency] /
                          singleCoin.market_data.market_cap[displayCurrency]) *
                          100
                      )}
                      %
                    </div>
                  )}
                  {singleCoin.market_data && (
                    <div>
                      {retainTwoDigits(
                        (1 -
                          singleCoin.market_data.total_volume[displayCurrency] /
                            singleCoin.market_data.market_cap[
                              displayCurrency
                            ]) *
                          100
                      )}
                      %
                    </div>
                  )}
                </div>
                {singleCoin.market_data && (
                  <ProgressBarOuter background={"#F8D2A6"}>
                    <ProgressBarInner
                      width={
                        singleCoin.market_data.total_volume[displayCurrency] /
                        singleCoin.market_data.market_cap[displayCurrency]
                      }
                      background={"#D4770C"}
                    ></ProgressBarInner>
                  </ProgressBarOuter>
                )}
              </div>
              <div className="mt-20 h-64 flex flex-col justify-between ">
                <div className="w-full h-16 bg-skin-single-coin-page-modules-background-color rounded-lg flex justify-center items-center">
                  {singleCoin.links &&
                    singleCoin.links.homepage
                      .filter((e) => e !== "")
                      .map((item) => (
                        <div key={uuidv4()}>
                          <a
                            className="text-skin-single-coin-link-text-color"
                            target="_blank"
                            href={item}
                          >
                            {item}
                          </a>
                        </div>
                      ))}
                </div>
                <div className="w-full h-16 bg-skin-single-coin-page-modules-background-color rounded-lg flex justify-center items-center">
                  {singleCoin.links &&
                    singleCoin.links.blockchain_site
                      .filter((item) => item.includes("blockchair"))
                      .map((item) => (
                        <div key={uuidv4()}>
                          <a className="text-skin-single-coin-link-text-color" target="_blank" href={item}>
                            {item}
                          </a>
                        </div>
                      ))}
                </div>
                <div className="w-full h-16 bg-skin-single-coin-page-modules-background-color rounded-lg flex justify-center items-center">
                  {singleCoin.links &&
                    singleCoin.links.blockchain_site
                      .filter((item) => item.includes("tokenview"))
                      .map((item) => (
                        <div key={uuidv4()}>
                          <a className="text-skin-single-coin-link-text-color" target="_blank" href={item}>
                            {item}
                          </a>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinPage;

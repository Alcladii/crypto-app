import { useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { CoinsListItem } from "./CoinsListItem";
import {
  CoinsListContext,
  CoinsListContextProps,
} from "../contexts/CoinsListContext";
import { useInfiniteCoinsListScroll } from "../hooks/useInfiniteCoinsListScroll"

export const CoinsList = () => {
  //const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useContext(CoinsListContext) as CoinsListContextProps;
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteCoinsListScroll()

  const { ref, inView } = useInView({ rootMargin: "0px" });
  
    useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage]);

   
  

  return (
    <div>
      {/* {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.map((coin: any) => (
            <div className="text-base text-white" key={coin.id}>
              {coin.name}
            </div>
          ))}
        </div>
      ))} */}
      {data?.pages.map((items: any, pageIndex: number) => (
        <div key={pageIndex}>
          {items.map((coin: any, index: number) => {
            if (items.length == index + 1) {
              return (
                <div ref={ref} className="text-base text-white" key={coin.id}>
                  {coin.name}
                </div>
              );
            }
            return (
              <div className="text-base text-white" key={coin.id}>
                {coin.name}
              </div>
            );
          })}
        </div>
      ))}
      {/* {displayCoinsList.map((coin: any, index: number) => {
        const isLast = index === displayCoinsList.length - 1;
        if (isLast) {
          return (
            <CoinsListItem
              key={index}
              singleCoin={coin}
              //innerRef={ref}
              index={index}
              //color={progressBarColors[index % progressBarColors.length]}
              //selectedTimePeriod={selectedTimePeriod}
            />
          );
        }
        return (
          <CoinsListItem
            key={index}
            singleCoin={coin}
            index={index}
            //color={progressBarColors[index % progressBarColors.length]}
            //selectedTimePeriod={selectedTimePeriod}
          />
        );
      })} */}
    </div>
  );
};

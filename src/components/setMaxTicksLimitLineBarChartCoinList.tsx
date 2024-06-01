export const setMaxTicksLimit = (numOfDays) => {
    let maxTicksLimit
  
    if (numOfDays === "2") {
      maxTicksLimit = 12;
    }
    if (numOfDays === "7") {
      maxTicksLimit = 7;
    }
    if (numOfDays === "30" || numOfDays === "90") {
      maxTicksLimit = 30;
    }
    if (numOfDays === "180") {
      maxTicksLimit = 6;
    }
    if (numOfDays === "365") {
      maxTicksLimit = 12;
    }
  
    return maxTicksLimit;
  };
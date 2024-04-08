export const setDisplayIntervalLineBarChart = (numOfDays, item) => {
  const date = new Date(item[0]);
  if (numOfDays === "2") {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      hour12: true,
    });
  } else if (numOfDays === "7" || numOfDays === "30" || numOfDays === "90") {
    return date.toLocaleDateString(undefined, { day: "numeric" });
  } else {
    return date.toLocaleDateString(undefined, { month: "short" });
  }
};

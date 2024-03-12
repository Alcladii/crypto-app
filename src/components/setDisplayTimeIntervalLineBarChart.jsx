export const setDisplayIntervalLineChart = (numOfDays, item) => {
    const date = new Date(item[0]);
    return numOfDays === "2"
    ? date.toLocaleTimeString(undefined, {
        hour: "numeric",
        hour12: true,
      })
    : numOfDays === "7" || numOfDays === "30" || numOfDays === "90"
    ? date.toLocaleDateString(undefined, { day: "numeric" })
    : date.toLocaleDateString(undefined, { month: "short" });
}
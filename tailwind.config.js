/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/components/AddAsset.jsx",
    "./src/components/Arrow.jsx",
    "./src/components/BarChart.jsx",
    "./src/components/Coins.jsx",
    "./src/components/CurrencyConverter.jsx",
    "./src/components/CurrencySelector.jsx",
    "./src/components/DeleteAsset.jsx",
    "./src/components/EditAsset.jsx",
    "./src/components/LineChart.jsx",
    "./src/components/LineChartCurrencyConverter.jsx",
    "./src/components/LineChartIndividualCoin.jsx",
    "./src/components/PortfolioItem.jsx",
    "./src/components/PurchaseAmount.jsx",
    "./src/components/PurchaseDate.jsx",
    "./src/components/ResultList.jsx",
    "./src/components/SearchInput.jsx",
    "./src/components/SlickCarousel.jsx",
    "./src/contexts/cryptoContext.jsx",
    "./src/pages/CoinPage.jsx",
    "./src/pages/Homepage.jsx",
    "./src/pages/Portfolio.jsx",
    "./src/App.jsx",
  ],
  theme: {
    extend: {
      colors: {
        "crpyto-background-dark": "#13121A",
        "button-selected": "#6161D6",
        "button-unselected-search-bar-background": "#191925",
      },
    },
  },
  plugins: [],
};
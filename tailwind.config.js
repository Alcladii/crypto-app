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
        "button-selected": "rgba(97, 97, 214, 0.5)",
        "button-unselected-search-bar-background": "#191925",
        "go-up": "#01F1E3",
        "go-down": "#FE2264",
        "line-bar-chart-background": "#191932"
      },
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

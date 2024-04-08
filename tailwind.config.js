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
    "./src/components/CoinPagePlusInCircleIcon.jsx",
  ],
  theme: {
    extend: {
      textColor:{
        skin: {
          "selected-button-app-name-text": 'var(--color-text-selected-button-app-name)',
          "unselected-button-text": 'var(--color-text-unselected-button)',
          "currency-selector-text-color": 'var(--color-text-currency-selector)',
          "search-bar-place-holder-text-color": 'var(--color-text-search-bar-place-holder)',
          "carousel-selected-button-text-color": 'var(--color-text-carousel-selected-button)',
          "carousel-unselected-button-text-color": 'var(--color-text-carousel-unselected-button)',
          "carousel-current-price-text-color": 'var(--color-text-carousel-current-price)',
        }
      },
      backgroundColor: {
        skin: {
          app: 'var(--color-background-app)',
          "unselected-button-bg": 'var(--color-background-unselected-button-search-bar-currency-selector)',
          "carousel-selected-button-background-color": 'var(--color-background-carousel-selected-button)',
          "carousel-unselected-button-background-color": 'var(--color-background-carousel-unselected-button)',
        }
      },
      colors: {
        "crpyto-background-dark": "#13121A",
        "button-selected": "rgba(97, 97, 214, 0.5)",
        "button-unselected-search-bar-background": "#191925",
        "button-unselected-search-bar-background-light": "rgba(204, 204, 250, 0.4)",
        "go-up": "#01F1E3",
        "go-down": "#FE2264",
        "line-bar-chart-background": "#191932",
        "right-currency-background": "#1E1932",
        "to-in-currency-converter": "rgba(209, 209, 209, 0.8)",
        "coin-icon-background": "#2C2C4A",
        "portfolio-item-price-properties": "#2D2D51",
        "portfolio-item-bar": "#01F1E3",
        "portfolio-item-bar-background": "rgba(1, 241, 227, 0.5)",
        "text-button-selected-currency-selector-dark-theme": "rgb(255, 255, 255)",
        "text-button-unselected-dark-theme":"rgb(71 85 105)",
        "placeholder-light": "rgba(66, 66, 134, 1)",
        "placeholder-dark": "rgba(209, 209, 209, 1)",
        "coin-page-progress-bar-outter": "#F8D2A6",
        "coin-page-progress-bar-inner": "#D4770C",
      },
      
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

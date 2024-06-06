/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      textColor:{
        skin: {
          "selected-button-app-name-text": 'var(--color-text-selected-button-app-name)',
          "unselected-button-text": 'var(--color-text-unselected-button)',
          "currency-selector-text-color": 'var(--color-text-currency-selector)',
          "search-bar-place-holder-text-color": 'var(--color-text-search-bar-place-holder)',
          "coins-currency-selector-selected-button-text-color": 'var(--color-text-coins-currency-selector-selected-button)',
          "coins-currency-selector-unselected-button-text-color": 'var(--color-text-coins-currency-selector-unselected-button)',
          "carousel-selected-button-text-color": 'var(--color-text-carousel-selected-button)',
          "carousel-unselected-button-text-color": 'var(--color-text-carousel-unselected-button)',
          "carousel-current-price-text-color": 'var(--color-text-carousel-current-price)',
          "prompt-text-color": 'var(--color-text-prompt)',
          "days-button-top-bottom-fifty-text-color":'var(--color-text-days-button-top-bottom-fifty)',
          "unselected-days-top-bottom-fifty-button-text-color":'var(--color-text-unselected-days-button-top-bottom-fifty)',
          "coin-list-titles-text-color":'var(--color-text-coin-list-titles)',
          "coin-list-text-color":'var(--color-text-coin-list)',
          "single-coin-page-text-color":'var(--color-text-single-coin-page)',
          "single-coin-time-text-color":'var(--color-text-single-coin-time)',
          "single-coin-link-text-color":'var(--color-text-single-coin-link)',
          "change-percentage-in-coin-page-positive-text-color":'var(--color-text-change-percentage-in-coin-page-positive)',
          "change-percentage-in-coin-page-negative-text-color":'var(--color-text-change-percentage-in-coin-page-negative)',
          "you-sell-you-buy-text-color":'var(--color-text-you-sell-you-buy)',
          "selected-coin-currency-converter-left-right-text-color":'var(--color-text-selected-coin-currency-converter-left-right)',
          "coin-price-name-currency-converter-text-color":'var(--color-text-coin-price-name-currency-converter)',
          "coin-price-number-currency-converter-text-color":'var(--color-text-coin-price-number-currency-converter)',
          "currency-inside-chart-text-color":'var(--color-text-currency-inside-chart)',
          "to-inside-chart-text-color":'var(--color-text-to-inside-chart)',
          "loading-and-error-message-currency-converter-text-color":'var(--color-text-loading-and-error-message-currency-converter)',
          "edit-asset-popup-input-text-color":'var(--color-text-edit-asset-popup-input)',
          "edit-asset-popup-buttons-title-text-color":'var(--color-text-edit-asset-popup-buttons-title)',
          "add-asset-popup-buttons-title-text-color":'var(--color-text-add-asset-popup-buttons-title)',
          "add-asset-popup-coin-selector-text-color":'var(--color-text-add-asset-popup-coin-selector)',
          "add-edit-asset-popup-input-text-color":'var(--color-text-add-edit-asset-popup-input)',
          "portfolio-item-coin-name-total-value-current-price-text-color":'var(--color-text-portfolio-item-coin-name-total-value-current-price)',
          "portfolio-item-titles-text-color": 'var(--colort-text-portfolio-item-titles)',
          "portfolio-item-buttons-text-color":'var(--color-text-portfolio-item-buttons)',
          "coin-search-result-list-text-color":'var(--color-text-coin-search-result-list)',
          "coin-search-input-text-color":'var(--color-text-coin-search-input)',
          "chart-color-indicator-text-color":'var(--color-text-chart-color-indicator)'
        }
      },
      backgroundColor: {
        skin: {
          app: 'var(--color-background-app)',
          "unselected-button-bg": 'var(--color-background-unselected-button-search-bar-currency-selector)',
          "carousel-selected-button-background-color": 'var(--color-background-carousel-selected-button)',
          "carousel-unselected-button-background-color": 'var(--color-background-carousel-unselected-button)',
          "days-bar-background-color": 'var(--color-background-days-bar)',
          "days-button-background-color": 'var(--color-background-days-button)',
          "charts-background-color":'var(--color-background-charts)',
          "coin-list-background-color":'var(--color-background-coin-list)',
          "coins-converter-selected-button-background": 'var(--color-background-coins-converter-selected-button)',
          "coins-converter-unselected-button-background": 'var(--color-background-coins-converter-unselected-button)',
          "coins-converter-wrapper-background":'var(--color-background-coins-converter-wrapper)',
          "single-coin-page-modules-background-color":'var(--color-background-single-coin-page-modules)',
          "coin-icon-wrapper-background-color":'var(--color-background-coin-icon-wrapper)',
          "left-currency-background-color":'var(--color-background-left-currency)',
          "right-currency-background-color":'var(--color-background-right-currency)',
          "currency-converter-chart-background-color":'var(--color-background-currency-converter-chart)',
          "days-button-bar-currency-converter-background-color":'var(--color-background-days-button-bar-currency-converter)',
          "edit-asset-popup-background-color":'var(--color-background-edit-asset-popup)',
          "edit-asset-items-background-color":'var(--color-background-edit-asset-items)',
          "edit-asset-buttons-background-color":'var(--color-background-edit-asset-buttons)',
          "add-asset-popup-coin-name-icon-wrapper-background-color":'var(--color-background-add-asset-popup-coin-name-icon-wrapper)',
          "add-asset-popup-icon-wrapper-background-color":'var(--color-background-add-asset-popup-icon-wrapper)',
          "add-edit-asset-popup-items-background-color":'var(--color-background-add-edit-asset-popup-items)',
          "add-asset-popup-buttons-background-color":'var(--color-background-add-asset-popup-buttons)',
          "portfolio-item-left-column-back-ground-color":'var(--color-background-portfolio-item-left-column)',
          "portfolio-item-right-column-back-ground-color":'var(--color-background-portfolio-item-right-column)',
          "portfolio-item-buttons-background-color":'var(--color-background-portfolio-item-buttons)',
          "search-popup-background-color":'var(--color-background-search-popup)',
          "coin-search-result-list-background-color":'var(--color-background-coin-search-result-list)',
          "home-porfolio-button-wrapper-background-color":'var(--color-bakcground-home-porfolio-button-wrapper)',
          "sticky-coins-table-title-bar-background-color":'var(--color-background-sticky-coins-table-title-bar)'
        }
      },
      borderColor: {
        skin: {
          "currency-converter-border-color": 'var(--color-border-currency-converter)',
          "portfolio-item-frames-border-color":'var(--color-border-portfolio-item-frames)',
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
        "placeholder-light": "rgba(66, 66, 134, 1)", //don't delete this
        "placeholder-dark": "rgba(209, 209, 209, 1)", //don't delete this
        "coin-page-progress-bar-outter": "#F8D2A6",
        "coin-page-progress-bar-inner": "#D4770C",
        "mobile-view-coin-name-text-color": "rgba(255, 255, 255, 0.5)"
      },
      
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import currencies from "../../mocks/currencies.json";
import { ErrorResponse } from "../errorResponse";

// type Currency = {
//     symbol: string;
//     name?: string;
//     symbol_native?: string;
//     decimal_digits?: number;
//     rounding?: number;
//     code?: string;
//     name_plural?: string;
//   };

//   type Currencies = {
//     [key: string]: Currency;
//   };

const currenciesTyped = currencies;

type CurrencyState = {
  displayCurrency: string;
  currencyList: string[];
  currencySymbol: string | undefined;
  isLoading: boolean;
  hasError: boolean;
};

const initialState: CurrencyState = {
  displayCurrency: "usd",
  currencyList: [],
  currencySymbol: currenciesTyped["USD"]?.symbol,
  isLoading: false,
  hasError: false,
};

export const getCurrencyList = createAsyncThunk(
  "currency/getCurrencyList",
  async (_, thunkAPI) => {
    try {
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      let fetchCurrencyList = Object.keys(singleCoinData.data.market_data.ath);
      return fetchCurrencyList;
    } catch (err) {
      const error = err as ErrorResponse;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const currencySlice = createSlice({
  name: "currency",
  //   initialState: {
  //     displayCurrency: 'usd',
  //     currencyList: [],
  //     currencySymbol: currenciesTyped['USD']?.symbol,
  //     isLoading: false,
  //     hasError: false,
  //   },
  initialState,
  reducers: {
    setDisplayCurrency: (state, action) => {
      state.displayCurrency = action.payload;
      //state.currencySymbol = currenciesTyped[action.payload.toUpperCase()]?.symbol;
      const currency =
        currenciesTyped[
          action.payload.toUpperCase() as keyof typeof currenciesTyped
        ];
      state.currencySymbol = currency?.symbol;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrencyList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getCurrencyList.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.isLoading = false;
          state.currencyList = action.payload;
        }
      )
      .addCase(getCurrencyList.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const { setDisplayCurrency } = currencySlice.actions;

export default currencySlice.reducer;

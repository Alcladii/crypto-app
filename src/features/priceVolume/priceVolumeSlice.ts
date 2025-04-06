import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ErrorResponse } from "../errorResponse";

type PriceVolumeState = {
  priceVolumeList: any[];
  isLoading: boolean;
  hasError: boolean;
  numOfDays: string;
};

const initialState: PriceVolumeState = {
  priceVolumeList: [],
  isLoading: false,
  hasError: false,
  numOfDays: "7", 
};

export const getCoinPriceVolume = createAsyncThunk(
  "singleCoin/getSingleCoinData",
  async (
    {
      coinId,
      currency,
      numOfDays,
    }: { coinId: string; currency: string; numOfDays: string },
    thunkAPI
  ) => {
    try {
      const apiUrl =
        numOfDays === "2"
          ? `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}`
          : `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${numOfDays}&interval=daily`;
      const { data } = await axios(apiUrl);
      return data;
    } catch (err) {
      const error = err as ErrorResponse;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const priceVolumeSlice = createSlice({
  name: "priceVolume",
  initialState,
  reducers: {
    setNumOfDays: (state, action: PayloadAction<string>) => {
      state.numOfDays = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoinPriceVolume.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getCoinPriceVolume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.priceVolumeList = action.payload;
      })
      .addCase(getCoinPriceVolume.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const { setNumOfDays } = priceVolumeSlice.actions;
export default priceVolumeSlice.reducer;

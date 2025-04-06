import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ErrorResponse } from '../errorResponse';

export const getSingleCoinData = createAsyncThunk(
  'singleCoin/getSingleCoinData',
  async (item, thunkAPI) => {
    try {
      const singleCoinData = await axios(
        `https://api.coingecko.com/api/v3/coins/${item}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      return singleCoinData.data;
    } catch (err) {
      const error = err as ErrorResponse;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const singleCoinSlice = createSlice({
  name: 'singleCoin',
  initialState: {
    singleCoin: null,
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleCoinData.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getSingleCoinData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleCoin = action.payload;
      })
      .addCase(getSingleCoinData.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export default singleCoinSlice.reducer;
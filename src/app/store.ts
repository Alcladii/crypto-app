import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from '../features/currency/currencySlice';
import singleCoinReducer from '../features/singleCoin/singleCoin';
import priceVolumeReducer from '../features/priceVolume/priceVolumeSlice';

const store = configureStore({
  reducer: {
    currency: currencyReducer,
    singleCoin: singleCoinReducer,
    priceVolume: priceVolumeReducer,
  },
});

export default store;

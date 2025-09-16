import { configureStore } from "@reduxjs/toolkit";
import chartReducer from "./chart/chartSlice"; // Ensure this file exists

const store = configureStore({
  reducer: {
    chartData: chartReducer,
  },
});

export default store;

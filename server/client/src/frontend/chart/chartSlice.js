import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDataPiutangForChart } from "./getDataForChart";

export const fetchChartData = createAsyncThunk("chart/fetchChartData", async () => {
  const data = await getDataPiutangForChart(); 
  return data;
});

const chartSlice = createSlice({
  name: "chart",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChartData.fulfilled, (state, action) => {
      return action.payload; 
    });
  },
});

export default chartSlice.reducer;

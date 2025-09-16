// import React, { useEffect, useState } from "react";
// import Plot from "react-plotly.js";
// import { useSelector, useDispatch } from "react-redux";
// import Select from "react-select";
// import { fetchChartData } from "./chartSlice";

// const transformData = (rawData) => {
//   const transformed = {};

//   Object.keys(rawData).forEach((date) => {
//     transformed[date] = {
//       category: ["Heavy Equipment", "Motor Vehicle"],
//       stage1: rawData[date].stage1,
//       stage2: rawData[date].stage2,
//       stage3: rawData[date].stage3,
//       total_CKPN: rawData[date].total_CKPN,
//       total_OS: rawData[date].total_OS,
//     };
//   });

//   return transformed;
// };

// const ChartSubsidiary = () => {
//   const rawChartData = useSelector((state) => state.chartData);
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [filteredData, setFilteredData] = useState(null);
//   const [dataTrend, setDataTrend] = useState([]);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchChartData());
//   }, [dispatch]);

//   useEffect(() => {
//     if (rawChartData) {
//       const transformedData = transformData(rawChartData);
//       const availableMonths = Object.keys(transformedData).sort();
      
//       if (availableMonths.length > 0) {
//         const latestMonth = availableMonths[availableMonths.length - 1];
//         setSelectedMonth({ value: latestMonth, label: latestMonth });
//         setFilteredData(transformedData[latestMonth]);
//       }
      
//       const monthlyTrend = availableMonths.map((month) => {
//         const monthData = transformedData[month] || {};
//         return {
//           date: month,
//           outstandingAmount: monthData.total_OS || 0,
//           ckpnAmount: Array.isArray(monthData.total_CKPN) ? monthData.total_CKPN.reduce((a, b) => a + (b || 0), 0) : monthData.total_CKPN || 0,
//         };
//       });
//       setDataTrend(monthlyTrend);
//     }
//   }, [rawChartData]);

//   const monthOptions = rawChartData ? Object.keys(rawChartData).map((month) => ({ value: month, label: month })) : [];

//   if (!filteredData) return <p>No data available for the selected month.</p>;

//   const { category, stage1, stage2, stage3, total_CKPN } = filteredData;

//   return (
//     <div className="container-fluid">
//       <div className="row mb-4">
//         <div className="col-md-4">
//           <label>Select Month:</label>
//           <Select options={monthOptions} value={selectedMonth} onChange={setSelectedMonth} />
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-md-6">
//           <div className="border p-3 shadow-sm rounded">
//             <Plot
//               data={[{
//                 x: category,
//                 y: total_CKPN,
//                 type: "bar",
//                 name: "CKPN",
//                 marker: { color: ["#0C233C", "#AB0D82"] },
//               }]}
//               layout={{ title: "CKPN Distribution", autosize: true }}
//             />
//           </div>
//         </div>
//         <div className="col-md-6">
//           <div className="border p-3 shadow-sm rounded">
//             <Plot
//               data={[
//                 { x: category, y: stage1, type: "bar", name: "Stage 1", marker: { color: "#510DBC" } },
//                 { x: category, y: stage2, type: "bar", name: "Stage 2", marker: { color: "#1E49E2" } },
//                 { x: category, y: stage3, type: "bar", name: "Stage 3", marker: { color: "#00d0ff" } }
//               ]}
//               layout={{ title: "Stage Distribution", autosize: true }}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="row mt-5">
//         <h5 className="text-center font-weight-bold">Trend Outstanding & CKPN</h5>
//       </div>
//       <div className="row">
//         <div className="col-md-12">
//           <div className="border p-3 shadow-sm rounded">
//             {/* <Plot
//               data={[
//                 {
//                   x: dataTrend.map((item) => item.date),
//                   y: dataTrend.map((item) => item.ckpnAmount),
//                   type: "scatter",
//                   mode: "lines+markers",
//                   name: "CKPN Amount",
//                   line: { color: "red", width: 2, dash: "dot" },
//                 },
//                 {
//                   x: dataTrend.map((item) => item.date),
//                   y: dataTrend.map((item) => item.outstandingAmount),
//                   type: "scatter",
//                   mode: "lines+markers",
//                   name: "Outstanding Amount",
//                   line: { color: "#1E49E2", width: 2 },
//                 },
//               ]}
//               layout={{
//                 autosize: true,
//                 margin: { l: 40, r: 40, t: 30, b: 40 },
//                 xaxis: { title: "Date" },
//                 yaxis: { title: "CKPN Amount", side: "left", showgrid: false },
//                 yaxis2: { title: "Outstanding Loan Amount", side: "right", overlaying: "y", showgrid: false },
//                 legend: { x: 0, y: 1 },
//               }}
//               useResizeHandler
//               style={{ width: "100%", height: "100%" }}
//             /> */}
            
//             <Plot
//               data={[
//                 {
//                   x: dataTrend.map((item) => item.date),
//                   y: dataTrend.map((item) => item.ckpnAmount),
//                   type: "scatter",
//                   mode: "lines+markers",
//                   name: "CKPN Amount",
//                   yaxis: "y1",
//                   line: { color: "red", width: 2, dash: "dot" },
//                 },
//                 {
//                   x: dataTrend.map((item) => item.date),
//                   y: dataTrend.map((item) => item.outstandingAmount),
//                   type: "scatter",
//                   mode: "lines+markers",
//                   name: "Outstanding Amount",
//                   yaxis: "y2",
//                   line: { color: "#1E49E2", width: 2 },
//                 },
//               ]}
//               layout={{
//                 autosize: true,
//                 margin: { l: 40, r: 40, t: 30, b: 40 },
//                 xaxis: { title: "Date" },
//                 yaxis: { title: "CKPN Amount", side: "left", showgrid: false, zeroline: false },
//                 yaxis2: { title: "Outstanding Loan Amount", side: "right", overlaying: "y", showgrid: false, zeroline: false },
//                 legend: { x: 0, y: 1 },
//               }}
//               useResizeHandler
//               style={{ width: "100%", height: "100%" }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartSubsidiary;

import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { fetchChartData } from "./chartSlice";

const transformData = (rawData) => {
  const transformed = {};
  Object.keys(rawData).forEach((date) => {
    transformed[date] = {
      category: ["Heavy Equipment", "Motor Vehicle"],
      stage1: [rawData[date].stage1[0], rawData[date].stage1[1]],
      stage2: [rawData[date].stage2[0], rawData[date].stage2[1]],
      stage3: [rawData[date].stage3[0], rawData[date].stage3[1]],
      total_CKPN: rawData[date].total_CKPN,
      total_OS: rawData[date].total_OS,
    };
  });
  return transformed;
};

const ChartSubsidiary = () => {
  const rawChartData = useSelector((state) => state.chartData);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [dataTrend, setDataTrend] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChartData());
  }, [dispatch]);

  useEffect(() => {
    if (rawChartData) {
      const transformedData = transformData(rawChartData);
      const availableMonths = Object.keys(transformedData);
      if (availableMonths.length > 0) {
        setSelectedMonth({ value: availableMonths[availableMonths.length - 1], label: availableMonths[availableMonths.length - 1] });
      }
      setDataTrend(
        availableMonths.map((month) => {
          const monthData = transformedData[month];
          return {
            date: month,
            outstandingAmount: monthData.total_OS || 0,
            ckpnAmount:
              Array.isArray(monthData.total_CKPN)
                ? monthData.total_CKPN.reduce((sum, value) => sum + (value || 0), 0)
                : monthData.total_CKPN || 0,
          };
        })
      );
    }
  }, [rawChartData]);

  useEffect(() => {
    if (selectedMonth && rawChartData) {
      const transformedData = transformData(rawChartData);
      setFilteredData(transformedData[selectedMonth.value]);
    }
  }, [selectedMonth, rawChartData]);

  const monthOptions = rawChartData
    ? Object.keys(rawChartData).map((month) => ({ value: month, label: month }))
    : [];

  if (!filteredData) {
    return <p>No data available for the selected month.</p>;
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-4">
          <label style={{ marginRight: "10px" }}>Select Month:</label>
          <Select options={monthOptions} value={selectedMonth} onChange={setSelectedMonth} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <Plot
            data={[
              {
                x: filteredData.category,
                y: filteredData.total_CKPN,
                type: "bar",
                name: "CKPN",
                marker: { color: ["#0C233C", "#AB0D82"] },
              },
            ]}
            layout={{ title: "CKPN Distribution", height: 300 }}
          />
        </div>
        <div className="col-md-12">
          <Plot
            data={[
              { x: filteredData.category, y: filteredData.stage1, type: "bar", name: "Stage 1", marker: { color: "#510DBC" } },
              { x: filteredData.category, y: filteredData.stage2, type: "bar", name: "Stage 2", marker: { color: "#1E49E2" } },
              { x: filteredData.category, y: filteredData.stage3, type: "bar", name: "Stage 3", marker: { color: "#00d0ff" } },
            ]}
            layout={{ title: "Stage Distribution", height: 300 }}
          />
        </div>
      </div>

<div className="row">
<Plot data={[
                {
                  x: dataTrend.map((item) => item.date),
                  y: dataTrend.map((item) => item.ckpnAmount),
                  type: "scatter",
                  mode: "lines+markers",
                  name: "CKPN Amount",
                  yaxis: "y1",
                  line: { color: "red", width: 2, dash: "dot" },
                },
                {
                  x: dataTrend.map((item) => item.date),
                  y: dataTrend.map((item) => item.outstandingAmount),
                  type: "scatter",
                  mode: "lines+markers",
                  name: "Outstanding Amount",
                  yaxis: "y2",
                  line: { color: "#1E49E2", width: 2 },
                },
              ]}
              layout={{
                autosize: true,
                margin: { l: 40, r: 40, t: 30, b: 40 },
                xaxis: { title: "Date" },
                yaxis: { title: "CKPN Amount", side: "left", showgrid: false, zeroline: false },
                yaxis2: { title: "Outstanding Loan Amount", side: "right", overlaying: "y", showgrid: false, zeroline: false },
                legend: { x: 0, y: 1 },
              }}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
</div>
      {/* <div className="row mt-5">
        <div className="col-md-6">
          <h5 style={{ fontWeight: "bold", textAlign: "center" }}>Trend CKPN</h5>
          <Plot
            data={[
              {
                x: dataTrend.map((item) => item.date),
                y: dataTrend.map((item) => item.ckpnAmount),
                type: "scatter",
                mode: "lines+markers",
                name: "CKPN Amount",
                line: { color: "red", width: 2, dash: "dot" },
              },
            ]}
            layout={{ title: "Trend CKPN", height: 300 }}
          />
        </div>
        <div className="col-md-6">
          <h5 style={{ fontWeight: "bold", textAlign: "center" }}>Trend Outstanding</h5>
          <Plot
            data={[
              {
                x: dataTrend.map((item) => item.date),
                y: dataTrend.map((item) => item.outstandingAmount),
                type: "scatter",
                mode: "lines+markers",
                name: "Outstanding Amount",
                line: { color: "#1E49E2", width: 2 },
              },
            ]}
            layout={{ title: "Trend Outstanding", height: 300 }}
          />
          
        </div>
      </div> */}
    </div>
  );
};

export default ChartSubsidiary;



// import React, { useEffect, useState } from "react";
// import Plot from "react-plotly.js";
// import { useSelector } from "react-redux";
// import { Card, CardContent } from "@/components/ui/card";
// import { getDataInsAmountCkpnForChart, getDataPiutangForChart } from "./getDataForChart";

// const transformData = (rawData) => {
//   const transformed = {};

//   Object.keys(rawData).forEach((date) => {
//     transformed[date] = {
//       category: ["Heavy Equipment", "Motor Vehicle"],
//       stage1: [
//         rawData[date].stage1[0],
//         rawData[date].stage1[1]
//       ],
//       stage2: [
//         rawData[date].stage2[0],
//         rawData[date].stage2[1]
//       ],
//       stage3: [
//         rawData[date].stage3[0],
//         rawData[date].stage3[1]
//       ],
//       total_CKPN: [
//         rawData[date].total_CKPN[0],
//         rawData[date].total_CKPN[1]
//       ],
//       total_OS: rawData[date].total_OS
//     };
//   });

//   return transformed;
// };

// const ChartSubsidiary = ({ selectedMonth }) => {
//   const rawChartData = useSelector((state) => state.chartData);
//   const [filteredData, setFilteredData] = useState(null);

//   useEffect(() => {
//     if (rawChartData) {
//       const transformedData = transformData(rawChartData);
//       if (selectedMonth && transformedData[selectedMonth]) {
//         setFilteredData(transformedData[selectedMonth]);
//       } else {
//         setFilteredData(null);
//       }
//     }
//   }, [rawChartData, selectedMonth]);

//   if (!filteredData) {
//     return <p>No data available for the selected month.</p>;
//   }

//   const { category, stage1, stage2, stage3, total_CKPN, total_OS } = filteredData;

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       {/* Stage Distribution */}
//       <Card>
//         <CardContent>
//           <Plot
//             data={[
//               { x: category, y: stage1, type: "bar", name: "Stage 1", marker: { color: "#1f77b4" } },
//               { x: category, y: stage2, type: "bar", name: "Stage 2", marker: { color: "#ff7f0e" } },
//               { x: category, y: stage3, type: "bar", name: "Stage 3", marker: { color: "#2ca02c" } }
//             ]}
//             layout={{ title: "Stage Distribution" }}
//           />
//         </CardContent>
//       </Card>

//       {/* CKPN Distribution */}
//       <Card>
//         <CardContent>
//           <Plot
//             data={[
//               { labels: category, values: total_CKPN, type: "pie", marker: { colors: ["#1f77b4", "#ff7f0e"] } }
//             ]}
//             layout={{ title: "CKPN Distribution" }}
//           />
//         </CardContent>
//       </Card>

//       {/* Outstanding Loan (OS) */}
//       <Card>
//         <CardContent>
//           <Plot
//             data={[
//               { x: ["Total OS"], y: [total_OS], type: "bar", name: "Total OS", marker: { color: "#9467bd" } }
//             ]}
//             layout={{ title: "Total Outstanding Loan (OS)" }}
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ChartSubsidiary;


// import React, { useState } from "react";
// import Plot from "react-plotly.js";
// import { getDataInsAmountCkpnForChart, getDataPiutangForChart } from "./getDataForChart";

// const ChartSubsidiary = (args) => {
//     const rawData = getDataInsAmountCkpnForChart();
//     const rawDataPiutang = getDataPiutangForChart();

//     const [selectedAc, setSelectedAc] = useState(args.acName == "All" ? "SafeGuard Insurance" : args.acName);

//     const Colors = {
//         "Heavy Equipment": "#00b8f5",
//         "Motor Vehicle": "#1e49e2",
//         "stage1": "#00c0ae",
//         "stage2": "#ab0d82",
//         "stage3": "#fd349c",
//     };

//     const formatIDR = (value) => new Intl.NumberFormat("id-ID", {
//         style: "currency", currency: "IDR", maximumFractionDigits: 0,
//     }).format(value);

//     const [selectedMonth, setSelectedMonth] = useState("1/31/2024");
//     const handleMonthChange = (e) => setSelectedMonth(e.target.value);


//     const total_ckpn_instrument_on_selected_month = (month) => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const selectedAcDataPiutang = Object.assign({}, rawDataPiutang['Group_Insurance'], rawDataPiutang['Group_CMI'])[selectedAc];

//         const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month)
//         const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)

//         var labels = ["Giro", "Heavy Equipment", "Motor Vehicle", "Piutang"]
//         var instrumentCkpn = [0, 0, 0, 0]
//         //Masih ada piutang lagi proses data
//         // console.log(monthData)

//         Object.entries(monthData[1]).forEach((monthDataKeyData) => {
//             if (["stage1", "stage2", "stage3"].includes(monthDataKeyData[0])) {
//                 //Giro
//                 instrumentCkpn[0] += monthDataKeyData[1][4]
//                 //Deposito
//                 instrumentCkpn[1] += monthDataKeyData[1][5]
//                 //Obligasi
//                 instrumentCkpn[2] += monthDataKeyData[1][6]
//             }
//         })
//         console.log(monthDataPiutang[1])
//         Object.entries(monthDataPiutang[1]).forEach((monthDataKeyData) => {
//             //piutang
//             if (selectedAc != 'Bahana Artha Ventura') {
//                 console.log(monthDataKeyData)
//                 if (["bucket1", "bucket2", "bucket3", "bucket4"].includes(monthDataKeyData[0])) {
//                     instrumentCkpn[3] += monthDataKeyData[1][1]
//                 }
//             } else {
//                 if (["stage1", "stage2", "stage3"].includes(monthDataKeyData[0])) {
//                     instrumentCkpn[3] += monthDataKeyData[1][1]
//                 }
//             }
//         })

//         //ambil hanya Deposito & obligasi

//         labels = labels.slice(1, 3);
//         instrumentCkpn = instrumentCkpn.slice(1, 3);

//         return { labels, instrumentCkpn }

//     }



//     const depo_each_stage = (month) => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month);
//         const labelsDepo = ["stage1", "stage2", "stage3"]
//         var valueDepo = [monthData[1]["stage1"][5], monthData[1]["stage2"][5], monthData[1]["stage3"][5]]

//         return { labelsDepo, valueDepo }

//     }

//     const obli_each_stage = (month) => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month);
//         const labelsObli = ["stage1", "stage2", "stage3"]
//         var valueObli = [monthData[1]["stage1"][6], monthData[1]["stage2"][6], monthData[1]["stage3"][6]]

//         return { labelsObli, valueObli }

//     }

//     const piutang_each_stage = (month) => {
//         var labelsPiutang
//         const selectedAcDataPiutang = Object.assign({}, rawDataPiutang['Group_Insurance'], rawDataPiutang['Group_CMI'])[selectedAc];
//         const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)
//         console.log(monthDataPiutang)
//         if (selectedAc != 'Bahana Artha Ventura') {
//             labelsPiutang = ["Bucket1", "Bucket2", "Bucket3", "Bucket4"]
//             var valuePiutang = [
//                 monthDataPiutang[1]["bucket1"][1],
//                 monthDataPiutang[1]["bucket2"][1],
//                 monthDataPiutang[1]["bucket3"][1],
//                 monthDataPiutang[1]["bucket4"][1]
//             ]

//         } else {
//             labelsPiutang = ["stage1", "stage2", "stage3"]
//             var valuePiutang = [monthDataPiutang[1]["stage1"][1], monthDataPiutang[1]["stage2"][1], monthDataPiutang[1]["stage3"][1]]

//         }

//         return { labelsPiutang, valuePiutang }

//     }


//     const trend_os_ckpn = () => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const labelTrend = Object.keys(selectedAcData)
//         const trendOs = {
//             y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['total_OS']),
//             x: labelTrend,
//             type: 'scatter',
//             name: 'Outstanding'
//         }
//         const trendCkpn = {
//             y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['total_CKPN']),
//             x: labelTrend,
//             type: 'scatter',
//             name: 'CKPN'
//         }

//         const dataTrend = [trendOs, trendCkpn]

//         return dataTrend
//     }

//     const { labels, instrumentCkpn } = total_ckpn_instrument_on_selected_month(selectedMonth);
//     const ChartColors = labels.map((label) => Colors[label] || "#000000");

//     const { labelsDepo, valueDepo } = depo_each_stage(selectedMonth);
//     const { labelsObli, valueObli } = obli_each_stage(selectedMonth);

//     const ChartColorsDepo = labelsDepo.map((label) => Colors[label] || "#000000");
//     const ChartColorsObli = labelsObli.map((label) => Colors[label] || "#000000");

//     const dataTrend = trend_os_ckpn();




//     return (
//         <div className="container-fluid">
//             {/* First Row */}
//             <div className="row">
//                 <div className="col-md-6">
//                     <h5 className="text-center font-weight-bold">Total CKPN per Segment</h5>
//                     <Plot data={[{ x: labels, y: instrumentCkpn, type: "bar", marker: { color: ChartColors } }]}
//                         layout={{ autosize: true, margin: { t: 10, l: 50, r: 50, b: 50 } }}
//                         useResizeHandler={true} style={{ width: "50%", height: "50%" }}
//                     />
//                 </div>
//                 <div className="col-md-6">
//                     <h5 className="text-center font-weight-bold">Total CKPN per Stage</h5>
//                     <div className="row">
//                         <div className="col-md-6">
//                             <Plot data={[{ x: labelsDepo, y: valueDepo, type: "bar", marker: { color: ChartColorsDepo } }]}
//                                 layout={{ autosize: true, title: `Heavy Equipment` }}
//                                 useResizeHandler={true} style={{ width: "100%", height: "100%" }}
//                             />
//                         </div>
//                         <div className="col-md-6">
//                             <Plot data={[{ x: labelsObli, y: valueObli, type: "bar", marker: { color: ChartColorsObli } }]}
//                                 layout={{ autosize: true, title: `Motor Vehicle` }}
//                                 useResizeHandler={true} style={{ width: "100%", height: "100%" }}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* Second Row */}
//             <div className="row mt-4">
//                 <h5 className="text-center font-weight-bold">Trend Outstanding & CKPN</h5>
//                 <div className="col-md-12">
//                     <Plot data={dataTrend} layout={{ autosize: true, yaxis: { side: "left" }, yaxis2: { side: "right", overlaying: "y" } }}
//                         useResizeHandler={true} style={{ width: "100%", height: "100%" }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChartSubsidiary;


// ========== JALAN OLD =================================================================================================
// import React, { useState } from "react";
// import Plot from "react-plotly.js";
// import { getDataInsAmountCkpnForChart, getDataPiutangForChart } from "./getDataForChart";
// import Select from "react-select";

// const ChartSubsidiary = (args) => {
//     const rawData = getDataInsAmountCkpnForChart();
//     const rawDataPiutang = getDataPiutangForChart();

//     const Colors = {
//         "Giro": "#00338d",
//         "Heavy Equipment": "#00b8f5",
//         "Motor Vehicle": "#1e49e2",
//         "Piutang": "#76d2ff",
//         "stage1": "#00c0ae",
//         "stage2": "#ab0d82",
//         "stage3": "#fd349c",
//         "Bucket1": "#00c0ae",
//         "Bucket2": "#ab0d82",
//         "Bucket3": "#fd349c",
//         "Bucket4": "#ffa3da",
//     };

//     const formatIDR = (value) => new Intl.NumberFormat("id-ID", {
//         style: "currency",
//         currency: "IDR",
//         maximumFractionDigits: 0,
//     }).format(value);

//     const [selectedMonth, setSelectedMonth] = useState("1/31/2024");
//     const [selectedAc, setSelectedAc] = useState(args.acName === "All" ? "SafeGuard Insurance" : args.acName);

//     const total_ckpn_instrument_on_selected_month = (month) => {
//         const selectedAcData = { ...rawData['Group_Insurance'], ...rawData['Group_CMI'] }[selectedAc] || {};
//         const selectedAcDataPiutang = { ...rawDataPiutang['Group_Insurance'], ...rawDataPiutang['Group_CMI'] }[selectedAc] || {};

//         const monthData = selectedAcData[month] || {};
//         const monthDataPiutang = selectedAcDataPiutang[month] || {};

//         let labels = ["Heavy Equipment", "Motor Vehicle"];
//         let instrumentCkpn = [0, 0];

//         ["stage1", "stage2", "stage3"].forEach((stage) => {
//             instrumentCkpn[0] += monthData[stage]?.[5] || 0;
//             instrumentCkpn[1] += monthData[stage]?.[6] || 0;
//         });

//         return { labels, instrumentCkpn };
//     };

//     const { labels, instrumentCkpn } = total_ckpn_instrument_on_selected_month(selectedMonth);
//     const ChartColors = labels.map(label => Colors[label] || "#000000");

//     const depo_each_stage = (month) => {
//         const selectedAcData = { ...rawData['Group_Insurance'], ...rawData['Group_CMI'] }[selectedAc] || {};
//         const monthData = selectedAcData[month] || {};
//         return {
//             labelsDepo: ["stage1", "stage2", "stage3"],
//             valueDepo: [monthData["stage1"]?.[5] || 0, monthData["stage2"]?.[5] || 0, monthData["stage3"]?.[5] || 0],
//         };
//     };

//     const { labelsDepo, valueDepo } = depo_each_stage(selectedMonth);
//     const dataTrend = (() => {
//         const selectedAcData = { ...rawData['Group_Insurance'], ...rawData['Group_CMI'] }[selectedAc] || {};
//         const labelTrend = Object.keys(selectedAcData);
    
//         console.log("selectedAcData:", selectedAcData); // Debugging
    
//         const outstandingData = labelTrend.map(date => selectedAcData[date]?.total_OS || 0);
//         const ckpnData = labelTrend.map(date => selectedAcData[date]?.total_CKPN || 0);
    
//         console.log("Outstanding Data:", outstandingData); // Debugging
//         console.log("CKPN Data:", ckpnData); // Debugging
    
//         return [
//             {
//                 x: labelTrend,
//                 y: outstandingData,
//                 type: "scatter",
//                 mode: "lines",
//                 name: "Outstanding",
//                 yaxis: "y2", // Assign to secondary axis
//                 line: { color: "red", width: 2 }
//             },
//             {
//                 x: labelTrend,
//                 y: ckpnData,
//                 type: "scatter",
//                 mode: "lines",
//                 name: "CKPN",
//                 yaxis: "y", // Primary axis
//                 line: { color: "blue", width: 2 }
//             }
//         ];
//     })();
    
//     // const dataTrend = (() => {
//     //     const selectedAcData = { ...rawData['Group_Insurance'], ...rawData['Group_CMI'] }[selectedAc] || {};
//     //     const labelTrend = Object.keys(selectedAcData);
//     //     return [
//     //         { y: labelTrend.map(date => selectedAcData[date]?.total_OS || 0), x: labelTrend, type: 'scatter', name: 'Outstanding' },
//     //         { y: labelTrend.map(date => selectedAcData[date]?.total_CKPN || 0), x: labelTrend, type: 'scatter', name: 'CKPN' }
//     //     ];
//     // })();

//     const monthOptions = [
//         { value: "1/31/2024", label: "1/31/2024" },
//         { value: "2/29/2024", label: "2/29/2024" },
//         { value: "3/31/2024", label: "3/31/2024" },
//         { value: "4/30/2024", label: "4/30/2024" },
//         { value: "5/31/2024", label: "5/31/2024" },
//         { value: "6/30/2024", label: "6/30/2024" },
//         { value: "7/31/2024", label: "7/31/2024" },
//         { value: "8/31/2024", label: "8/31/2024" },
//         { value: "9/30/2024", label: "9/30/2024" },
//         { value: "10/31/2024", label: "10/31/2024" },
//         { value: "11/30/2024", label: "11/30/2024" },
//         { value: "12/31/2024", label: "12/31/2024" }
//     ];
    
//     return (
//         <div className="container">
//             <div className="row mb-4">
//                 <div className="col-md-4">
//                     <label style={{ marginRight: "10px" }}>Select Month:</label>
//                     <Select
//                         options={monthOptions}
//                         value={monthOptions.find(option => option.value === selectedMonth)}
//                         onChange={option => setSelectedMonth(option.value)}
//                     />
//                 </div>
//             </div>

//             <div className="row mb-4">
//                 <div className="col-md-5">
//                     <div className="border p-3 shadow-sm rounded">
//                         <Plot
//                             data={[{ x: labels, y: instrumentCkpn, type: "bar", name: "CKPN", marker: { color: ChartColors } }]}
//                             layout={{ title: "CKPN Distribution" }}
//                         />
//                     </div>
//                 </div>
//                 <div className="col-md-7">
//                     <div className="border p-3 shadow-sm rounded">
//                         <Plot
//                             data={labelsDepo.map((label, i) => ({
//                                 x: ["Heavy Equipment", "Motor Vehicle"],
//                                 y: [valueDepo[i], valueDepo[i]],
//                                 type: "bar",
//                                 name: label,
//                                 marker: { color: Colors[label] || "#000000" }
//                             }))}
//                             layout={{ title: "Stage Distribution", barmode: "group" }}
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="row mt-5">
//                 <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>Trend Outstanding & CKPN</h5>
//             </div>
//             <div className="row">
//                 <div className="col-md-12">
//                     <div className="border p-3 shadow-sm rounded">
//                     <Plot
//     data={dataTrend}
//     layout={{
//         autosize: true,
//         xaxis: { title: "Date" },
//         yaxis: {
//             title: "CKPN Amount",
//             showgrid: true
//         },
//         yaxis2: {
//             title: "Outstanding Amount",
//             overlaying: "y",
//             side: "right",
//             showgrid: false,
//             zeroline: false
//         },
//         legend: { x: 0, y: 1 }
//     }}
//     useResizeHandler
//     style={{ width: "100%", height: "100%" }}
// />

//                         {/* <Plot
//                             data={dataTrend}
//                             layout={{ autosize: true, xaxis: { title: "Date" }, legend: { x: 0, y: 1 } }}
//                             useResizeHandler
//                             style={{ width: "100%", height: "100%" }}
//                         /> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChartSubsidiary;



// import React, { useState } from "react";
// import Plot from "react-plotly.js";
// import { getDataInsAmountCkpnForChart, getDataPiutangForChart } from "./getDataForChart"
// import { data } from "react-router-dom";
// import Select from "react-select";


// //holding pakai acName=>All
// const ChartSubsidiary = (args) => {
//     // Data for each month
//     const rawData = getDataInsAmountCkpnForChart()
//     const rawDataPiutang = getDataPiutangForChart()

//     // Color mapping for each category
//     const Colors = {
//         "Giro": "#00338d",
//         "Heavy Equipment": "#00b8f5",
//         "Motor Vehicle": "#1e49e2",
//         "Piutang": "#76d2ff",

//         "stage1": "#00c0ae",
//         "stage2": "#ab0d82",
//         "stage3": "#fd349c",

//         "Bucket1": "#00c0ae",
//         "Bucket2": "#ab0d82",
//         "Bucket3": "#fd349c",
//         "Bucket4": "#ffa3da",

//     };

//     const formatIDR = (value) => {
//         return new Intl.NumberFormat("id-ID", {
//             style: "currency",
//             currency: "IDR",
//             maximumFractionDigits: 0,
//         }).format(value);
//     };


//     // State to manage the selected month
//     const [selectedMonth, setSelectedMonth] = useState("1/31/2024");
//     const handleMonthChange = (e) => setSelectedMonth(e.target.value);
//     const [selectedAc, setSelectedAc] = useState(args.acName == "All" ? "SafeGuard Insurance" : args.acName);

//     const handleAcChange = (e) => setSelectedAc(e.target.value);



//     const total_ckpn_instrument_on_selected_month = (month) => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const selectedAcDataPiutang = Object.assign({}, rawDataPiutang['Group_Insurance'], rawDataPiutang['Group_CMI'])[selectedAc];

//         const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month)
//         const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)

//         var labels = ["Giro", "Heavy Equipment", "Motor Vehicle", "Piutang"]
//         var instrumentCkpn = [0, 0, 0, 0]
//         //Masih ada piutang lagi proses data
//         // console.log(monthData)

//         Object.entries(monthData[1]).forEach((monthDataKeyData) => {
//             if (["stage1", "stage2", "stage3"].includes(monthDataKeyData[0])) {
//                 //Giro
//                 instrumentCkpn[0] += monthDataKeyData[1][4]
//                 //Deposito
//                 instrumentCkpn[1] += monthDataKeyData[1][5]
//                 //Obligasi
//                 instrumentCkpn[2] += monthDataKeyData[1][6]
//             }
//         })
//         console.log(monthDataPiutang[1])
//         Object.entries(monthDataPiutang[1]).forEach((monthDataKeyData) => {
//             //piutang
//             if (selectedAc != 'Bahana Artha Ventura') {
//                 console.log(monthDataKeyData)
//                 if (["bucket1", "bucket2", "bucket3", "bucket4"].includes(monthDataKeyData[0])) {
//                     instrumentCkpn[3] += monthDataKeyData[1][1]
//                 }
//             } else {
//                 if (["stage1", "stage2", "stage3"].includes(monthDataKeyData[0])) {
//                     instrumentCkpn[3] += monthDataKeyData[1][1]
//                 }
//             }
//         })

//         //ambil hanya Deposito & obligasi

//         labels = labels.slice(1, 3);
//         instrumentCkpn = instrumentCkpn.slice(1, 3);

//         return { labels, instrumentCkpn }

//     }



//     const { labels, instrumentCkpn } = total_ckpn_instrument_on_selected_month(selectedMonth)
//     // console.log(labels,instrumentCkpn)

//     // Map category names to their respective colors
//     const ChartColors = labels.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found



//     const giro_each_stage = (month) => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month);
//         const labelsGiro = ["stage1", "stage2", "stage3"]
//         var valueGiro = [monthData[1]["stage1"][4], monthData[1]["stage2"][4], monthData[1]["stage3"][4]]


//         return { labelsGiro, valueGiro }

//     }

//     const { labelsGiro, valueGiro } = giro_each_stage(selectedMonth)

//     // Map category names to their respective colors
//     const ChartColorsGiro = labelsGiro.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


//     const depo_each_stage = (month) => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month);
//         const labelsDepo = ["stage1", "stage2", "stage3"]
//         var valueDepo = [monthData[1]["stage1"][5], monthData[1]["stage2"][5], monthData[1]["stage3"][5]]

//         return { labelsDepo, valueDepo }

//     }

//     const { labelsDepo, valueDepo } = depo_each_stage(selectedMonth)

//     // Map category names to their respective colors
//     const ChartColorsDepo = labelsDepo.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


//     const obli_each_stage = (month) => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month);
//         const labelsObli = ["stage1", "stage2", "stage3"]
//         var valueObli = [monthData[1]["stage1"][6], monthData[1]["stage2"][6], monthData[1]["stage3"][6]]

//         return { labelsObli, valueObli }

//     }

//     const { labelsObli, valueObli } = obli_each_stage(selectedMonth)

//     // Map category names to their respective colors
//     const ChartColorsObli = labelsObli.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found

//     const piutang_each_stage = (month) => {
//         var labelsPiutang
//         const selectedAcDataPiutang = Object.assign({}, rawDataPiutang['Group_Insurance'], rawDataPiutang['Group_CMI'])[selectedAc];
//         const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)
//         console.log(monthDataPiutang)
//         if (selectedAc != 'Bahana Artha Ventura') {
//             labelsPiutang = ["Bucket1", "Bucket2", "Bucket3", "Bucket4"]
//             var valuePiutang = [
//                 monthDataPiutang[1]["bucket1"][1],
//                 monthDataPiutang[1]["bucket2"][1],
//                 monthDataPiutang[1]["bucket3"][1],
//                 monthDataPiutang[1]["bucket4"][1]
//             ]

//         } else {
//             labelsPiutang = ["stage1", "stage2", "stage3"]
//             var valuePiutang = [monthDataPiutang[1]["stage1"][1], monthDataPiutang[1]["stage2"][1], monthDataPiutang[1]["stage3"][1]]

//         }

//         return { labelsPiutang, valuePiutang }

//     }

//     const { labelsPiutang, valuePiutang } = piutang_each_stage(selectedMonth)

//     // Map category names to their respective colors
//     const ChartColorsPiutang = labelsPiutang.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


//     const trend_os_ckpn = () => {
//         const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])[selectedAc];
//         const labelTrend = Object.keys(selectedAcData)
//         const trendOs = {
//             y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['total_OS']),
//             x: labelTrend,
//             type: 'scatter',
//             name: 'Outstanding'
//         }
//         const trendCkpn = {
//             y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['total_CKPN']),
//             x: labelTrend,
//             type: 'scatter',
//             name: 'CKPN'
//         }

//         const dataTrend = [trendOs, trendCkpn]

//         return dataTrend
//     }

//     const dataTrend = trend_os_ckpn()


//     const FilterAc = (args) => {
//         console.log(args)
//         if (args.acName == "All") {
//             return (
//                 <div className="col-md-8">
//                     <div className="row">
//                         <div className="col-md-6"></div>
//                         {/* <div className="col-md-6">
//                             <label style={{ marginLeft: "20px", marginRight: "10px" }}>
//                                 Select Subsidiaries:
//                             </label>
//                             <select className="form-select" value={selectedAc} onChange={handleAcChange}>
//                                 {Object.keys(Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'])).filter((acName) => !(['SCOV Syariah', 'TRUST Syariah', 'SureGuarantee Syariah'].includes(acName))).map((cat) => (
//                                     <option key={cat} value={cat}>
//                                         {cat}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div> */}
//                     </div>
//                 </div>
//             )
//         } else {
//             return (<div className="col-md-8"></div>)
//         }

//     }

//     const monthOptions = [
//         { value: "1/31/2024", label: "January 2024" },
//         { value: "2/29/2024", label: "February 2024" },
//         { value: "3/31/2024", label: "March 2024" },
//     ];
    

//     const getTotal = (instrument) => formatIDR(instrument);

//     return (<div className="container">
//         <div className="row mb-4">
//             <div className="col-md-4">
//                 <label style={{ marginRight: "10px" }}>Select Month:</label>
//                 <Select
//                     options={monthOptions}
//                     value={selectedMonth}
//                     onChange={setSelectedMonth}
//                 />
//             </div>
//         </div>

//         <div className="row mb-4">
//             {/* CKPN Distribution (Bar Chart) */}
//             <div className="col-md-6">
//                 <div className="border p-3 shadow-sm rounded">
//                     <Plot
//                         data={[
//                             { x: labels, y: instrumentCkpn, type: "bar", name: "CKPN", marker: { color: "#1f77b4" } }
//                         ]}
//                         layout={{ title: "CKPN Distribution" }}
//                     />

//                 </div>
//             </div>

//             {/* Combined Heavy Equipment & Motor Vehicle Per Stage (Grouped Bar Chart) */}
//             <div className="col-md-6">
//                 <div className="border p-3 shadow-sm rounded">
//                     <Plot
//                         data={[
//                             {
//                                 x: ["Heavy Equipment", "Motor Vehicle"],
//                                 y: [stage1[0], stage1[1]],
//                                 type: "bar",
//                                 name: "Stage 1",
//                                 marker: { color: "#1f77b4" }
//                             },
//                             {
//                                 x: ["Heavy Equipment", "Motor Vehicle"],
//                                 y: [stage2[0], stage2[1]],
//                                 type: "bar",
//                                 name: "Stage 2",
//                                 marker: { color: "#ff7f0e" }
//                             },
//                             {
//                                 x: ["Heavy Equipment", "Motor Vehicle"],
//                                 y: [stage3[0], stage3[1]],
//                                 type: "bar",
//                                 name: "Stage 3",
//                                 marker: { color: "#2ca02c" }
//                             }
//                         ]}
//                         layout={{
//                             title: "Stage Distribution (Grouped)",
//                             barmode: "group" // Ensures bars are grouped side by side
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>

//         {/* CKPN vs. Outstanding Loan Trend Chart */}
//         <div className="row mt-5">
//             <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>Trend Outstanding & CKPN</h5>
//         </div>
//         <div className="row">
//             <div className="col-md-12">
//                 <div className="border p-3 shadow-sm rounded">
//                     <Plot
//                         data={[
//                             {
//                                 x: dataTrend.map((item) => item.date) || [],
//                                 y: dataTrend.map((item) => item.ckpnAmount) || [],
//                                 type: "scatter",
//                                 mode: "lines",
//                                 name: "CKPN Amount",
//                                 yaxis: "y1",
//                                 line: { color: "blue", width: 2 },
//                             },
//                             {
//                                 x: dataTrend.map((item) => item.date) || [],
//                                 y: dataTrend.map((item) => item.outstandingAmount) || [],
//                                 type: "scatter",
//                                 mode: "lines",
//                                 name: "Outstanding Amount",
//                                 yaxis: "y2",
//                                 line: { color: "red", width: 2, dash: "dot" },
//                             }
//                         ]}
//                         layout={{
//                             autosize: true,
//                             margin: { l: 40, r: 40, t: 30, b: 40 },
//                             xaxis: { title: "Date" },
//                             yaxis: {
//                                 title: "CKPN Amount",
//                                 side: "left",
//                                 showgrid: false,
//                                 zeroline: false,
//                             },
//                             yaxis2: {
//                                 title: "Outstanding Loan Amount",
//                                 side: "right",
//                                 overlaying: "y",
//                                 showgrid: false,
//                                 zeroline: false,
//                             },
//                             legend: { x: 0, y: 1 },
//                         }}
//                         useResizeHandler={true}
//                         style={{ width: "100%", height: "100%" }}
//                     />
//                 </div>
//             </div>
//         </div>
//     </div>

//     )
// };

// export default ChartSubsidiary;

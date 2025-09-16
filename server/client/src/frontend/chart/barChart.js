import React, { useState } from "react";
import Plot from "react-plotly.js";
import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

// register Handsontable's modules
registerAllModules();


const ChartWithDropdown = () => {
    // Data for each month
    const rawData = {
        '31-10-2024': {
            kategori: ["Obligasi", "Deposito", "Giro"],
            total_jumlah_rekening: [99, 13, 7],
            total_outstanding_amount: [6480000000000, 64279498745.3, 6972499783],
            total_ckpn: [116542946.81, 85943825, 5517689.28],
            total_ckpn_ratio : [55601.82, 747.92, 1263.66],
            stage1_jumlah_rekening: [64, 8, 5],
            stage1_outstanding_amount: [4188363636363.64, 39587408827.76, 4980356987.85],
            stage1_ckpn: [75340894.91, 52863842.99, 12634.49],
            stage1_ckpn_ratio :[55592.17, 748.86, 394187.42],
            stage2_jumlah_rekening: [25, 4, 2],
            stage2_outstanding_amount: [1636363636363.64, 19793704413.88, 1992142795.14],
            stage2_ckpn: [29430037.07, 26431921.53, 5053.8],
            stage2_ckpn_ratio :[55601.82,748.86,394187.10],
            stage3_jumlah_rekening: [10, 1, 0],
            stage3_outstanding_amount: [654545454545.45, 4948426103.47, 0],
            stage3_ckpn: [11772014.83, 6607980.38, 0],
            stage3_ckpn_ratio :[55601.82, 748.8560527, 0],
        },
        '31-11-2024': {
            kategori: ["Obligasi", "Deposito", "Giro"],
            total_jumlah_rekening: [99, 13, 7],
            total_outstanding_amount: [6480000000000, 63128098745.3, 6881299783],
            total_ckpn: [115506466.78, 56515067, 5514598.1],
            total_ckpn_ratio:[56100.76,1117.01,1247.83],
            stage1_jumlah_rekening: [44, 7, 4],
            stage1_outstanding_amount: [2879999999999.99, 33002779351.31, 3932175872.56],
            stage1_ckpn: [51336207.46, 30425767.61, 8341.76],
            stage1_ckpn_ratio:[56100.76, 1084.7, 471384.440760703],
            stage2_jumlah_rekening: [30, 3, 2],
            stage2_outstanding_amount: [1963636363636.36, 14572619722.99, 1966087936.28],
            stage2_ckpn: [35001959.63, 13039614.69, 4170.88],
            stage2_ckpn_ratio:[56100.76, 1117.57, 471384.44],
            stage3_jumlah_rekening: [25, 3, 1],
            stage3_outstanding_amount: [1636363636363.64, 14572619722.99, 983043968.14],
            stage3_ckpn: [29168299.69, 13039614.69, 2085.44],
            stage3_ckpn_ratio:[56100.76, 1117.57, 471384.44],
        },
        '31-12-2024': {
            kategori: ["Obligasi", "Deposito", "Giro"],
            total_jumlah_rekening: [99, 13, 7],
            total_outstanding_amount: [6480000000000, 60928098745, 6712199781],
            total_ckpn: [114467263.4, 27587308, 5512932.24],
            total_ckpn_ratio:[56610.07, 2208.56, 1217.53],
            stage1_jumlah_rekening: [30, 5, 3],
            stage1_outstanding_amount: [1963636363636.36, 23423076682.69, 2880942763.29],
            stage1_ckpn: [34687049.52, 10618126.14, 5542.38],
            stage1_ckpn_ratio:[56610.07, 2205.95, 519802.46],
            stage2_jumlah_rekening: [40, 5, 2],
            stage2_outstanding_amount: [2618181818181.82, 23423076682.69, 1920628508.86],
            stage2_ckpn: [46249399.35, 10618126.14, 3694.92],
            stage2_ckpn_ratio:[56610.07, 2205.95, 519802.46],
            stage3_jumlah_rekening: [29, 3, 2],
            stage3_outstanding_amount: [1898181818181.82, 14053846009.62, 1920628508.86],
            stage3_ckpn: [33530814.53, 6370875.69, 3694.92],
            stage3_ckpn_ratio:[56610.07, 2205.95, 519802.46],
        },
    };

    // Color mapping for each category
    const categoryColors = {
        Deposito: "#098e7e", // Blue
        Giro: "#ceb5c3", // Orange
        Obligasi: "#e044a7", // Green
    };

    // State to manage the selected month
    const [selectedMonth, setSelectedMonth] = useState("31-10-2024");

    // Handle dropdown change
    const handleDropdownChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    // Format number as IDR with delimiter
    const formatIDR = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Data manipulation for the selected month
    const getDataForSelectedMonth = (month) => {
        const monthData = rawData[month];

        // Manipulating data to create labels and values for the Pie Chart and table
        const labels = Object.values(monthData.kategori); // ['Deposito', 'Giro', 'Obligasi']
        const values = Object.values(monthData.total_ckpn); // [85943825, 17689.28188, 116542946.81]

        // const details = monthData.kategori.map((val, index) => ({
        //     kategori: monthData.kategori[index],
        //     total_jumlah_rekening: monthData.total_jumlah_rekening[index],
        //     total_outstanding_amount: formatIDR(monthData.total_outstanding_amount[index]),
        //     total_ckpn: formatIDR(monthData.total_ckpn[index]),
        //     stage1_jumlah_rekening: monthData.stage1_jumlah_rekening[index],
        //     stage1_outstanding_amount: formatIDR(monthData.stage1_outstanding_amount[index]),
        //     stage1_ckpn: formatIDR(monthData.stage1_ckpn[index]),
        //     stage2_jumlah_rekening: monthData.stage2_jumlah_rekening[index],
        //     stage2_outstanding_amount: formatIDR(monthData.stage2_outstanding_amount[index]),
        //     stage2_ckpn: formatIDR(monthData.stage2_ckpn[index]),
        //     stage3_jumlah_rekening: monthData.stage3_jumlah_rekening[index],
        //     stage3_outstanding_amount: formatIDR(monthData.stage3_outstanding_amount[index]),
        //     stage3_ckpn: formatIDR(monthData.stage3_ckpn[index]),
        // }))

        const details = monthData.kategori.map((val, index) => ([
            monthData.kategori[index],
            monthData.total_jumlah_rekening[index],
            formatIDR(monthData.total_outstanding_amount[index]),
            formatIDR(monthData.total_ckpn[index]),
            // monthData.total_ckpn_ratio[index],
            monthData.stage1_jumlah_rekening[index],
            formatIDR(monthData.stage1_outstanding_amount[index]),
            formatIDR(monthData.stage1_ckpn[index]),
            // monthData.stage1_ckpn_ratio[index],
            monthData.stage2_jumlah_rekening[index],
            formatIDR(monthData.stage2_outstanding_amount[index]),
            formatIDR(monthData.stage2_ckpn[index]),
            // monthData.stage2_ckpn_ratio[index],
            monthData.stage3_jumlah_rekening[index],
            formatIDR(monthData.stage3_outstanding_amount[index]),
            formatIDR(monthData.stage3_ckpn[index]),
            // monthData.stage3_ckpn_ratio[index],
        ]))

        // const details = labels.map((label, index) => ({
        //     category: label,
        //     value: values[index], // Store raw value
        //     formattedValue: formatIDR(values[index]), // Store formatted value for display
        // }));
        // alert(details)
        return { labels, values, details };
    };

    // Get data for the selected month
    const { labels, values, details } = getDataForSelectedMonth(selectedMonth);

    // Map category names to their respective colors
    const ChartColors = labels.map((label) => categoryColors[label] || "#000000"); // Default to black if no mapping found




    return (
        <div className="row">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-4">
                        <div style={{ marginBottom: "20px" }}>
                            <label htmlFor="month-selector" style={{ marginRight: "10px" }}>
                                Select Reporting Period:
                            </label>
                            <select
                                className="form-select"
                                id="month-selector"
                                value={selectedMonth}
                                onChange={handleDropdownChange}
                            >
                                <option value="31-10-2024">31-10-2024</option>
                                <option value="31-11-2024">31-11-2024</option>
                                <option value="31-12-2024">31-12-2024</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <Plot
                                data={[{
                                    x: labels,
                                    y: values,
                                    type: "bar",
                                    marker: {
                                        color: ChartColors, // Apply different colors for each category
                                    },
                                }]}
                                layout={{
                                    autosize: true, // Enables responsive behavior
                                    title: `Financial Data for ${selectedMonth}`,
                                    xaxis: { title: "Categories" },
                                    yaxis: {
                                        title: "Total (in respective units)",
                                        range: [0, 130000000], // Set y-axis max value to be a fixed range
                                    },
                                }}
                                useResizeHandler={true} // Enables responsive resizing
                                style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                            />
                        </div>
                        <div className="col-md-4">
                            <Plot
                                data={[{
                                    labels: labels,
                                    values: values,
                                    type: "pie",
                                    marker: {
                                        colors: ChartColors, // Apply same colors for each category
                                    },
                                    textinfo: "label+percent", // Show labels and percentages on the chart
                                    hoverinfo: "label+value", // Show labels and values on hover
                                }]}
                                layout={{
                                    autosize: true, // Enables responsive behavior    
                                    title: `Distribution for ${selectedMonth}`,
                                }}
                                useResizeHandler={true} // Enables responsive resizing
                                style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Data for {selectedMonth}</h3>
                                      
                            <HotTable
                                themeName="ht-theme-main"   
                                data={details}
                                colHeaders={true}
                                rowHeaders={false}
                                height="auto"
                                stretchH="all"
                                nestedHeaders={[
                                    [
                                        {label: 'Kategori', rowspan: 2 }, 
                                        { label: 'Total', colspan: 3 }, 
                                        { label: 'Stage 1', colspan: 3 },
                                        { label: 'Stage 2', colspan: 3 },
                                        { label: 'Stage 3', colspan: 3 }],
                                    ['', 
                                        'Jumlah Rekening', 'OS Amount', 'CKPN', 
                                        // 'ratio CKPN', 
                                        'Jumlah Rekening', 'OS Amount', 'CKPN', 
                                        // 'ratio CKPN', 
                                        'Jumlah Rekening', 'OS Amount', 'CKPN', 
                                        // 'ratio CKPN', 
                                        'Jumlah Rekening', 'OS Amount', 'CKPN', 
                                        // 'ratio CKPN'
                                    ],
                                ]}
                                autoWrapRow={true}
                                autoWrapCol={true}
                                licenseKey="non-commercial-and-evaluation"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartWithDropdown;

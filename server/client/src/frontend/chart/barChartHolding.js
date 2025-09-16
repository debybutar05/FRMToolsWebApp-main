import React, { useState } from "react";
import Plot from "react-plotly.js";
import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

// register Handsontable's modules
registerAllModules();


const ChartWithDropdownHolding = () => {
    // Data for each month
    const rawData = {
        BAHANA_Sekuritas:{
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
            '30-11-2024': {
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
        },
        GRAHANIAGA_TATAUTAMA:{
            '31-10-2024': {
                kategori: ["Obligasi", "Deposito", "Giro"],
                total_jumlah_rekening: [98, 14, 6],
                total_outstanding_amount: [6475000000000, 59034098765.1, 6437899784],
                total_ckpn: [113205678.54, 28900213.45, 4723496.78],
                total_ckpn_ratio: [57512.23, 2064.78, 1189.34],
                stage1_jumlah_rekening: [35, 6, 4],
                stage1_outstanding_amount: [2158181818181.82, 24056465432.23, 2970328543.12],
                stage1_ckpn: [37748912.13, 9786543.21, 6789.34],
                stage1_ckpn_ratio: [57512.23, 2062.54, 502345.67],
                stage2_jumlah_rekening: [43, 4, 1],
                stage2_outstanding_amount: [2690000000000, 17643879326.67, 1420654389.43],
                stage2_ckpn: [47560213.34, 8432012.56, 2789.56],
                stage2_ckpn_ratio: [57512.23, 2064.78, 502345.67],
                stage3_jumlah_rekening: [20, 4, 1],
                stage3_outstanding_amount: [1626818181818.18, 17337654006.89, 1530678907.23],
                stage3_ckpn: [27996553.07, 7527657.78, 2789.56],
                stage3_ckpn_ratio: [57512.23, 2064.78, 502345.67],
            },
            '30-11-2024': {
                kategori: ["Obligasi", "Deposito", "Giro"],
                total_jumlah_rekening: [97, 12, 8],
                total_outstanding_amount: [6490000000000, 63578998765.4, 6553123891],
                total_ckpn: [112385987.78, 56234567.56, 4789235.89],
                total_ckpn_ratio: [56345.12, 1087.34, 1223.45],
                stage1_jumlah_rekening: [38, 7, 5],
                stage1_outstanding_amount: [2299090909090.91, 33425478654.78, 3450876543.34],
                stage1_ckpn: [40234512.56, 29345678.78, 8765.23],
                stage1_ckpn_ratio: [56345.12, 1085.56, 471234.78],
                stage2_jumlah_rekening: [42, 3, 2],
                stage2_outstanding_amount: [2578181818181.82, 18034567890.56, 1890234678.78],
                stage2_ckpn: [45789034.67, 19456234.67, 4567.12],
                stage2_ckpn_ratio: [56345.12, 1087.34, 471234.78],
                stage3_jumlah_rekening: [17, 2, 1],
                stage3_outstanding_amount: [1612727272727.27, 12123456789.12, 1212345678.90],
                stage3_ckpn: [26462789.23, 6423456.34, 4567.12],
                stage3_ckpn_ratio: [56345.12, 1087.34, 471234.78],
            },
            '31-12-2024': {
                kategori: ["Obligasi", "Deposito", "Giro"],
                total_jumlah_rekening: [99, 13, 9],
                total_outstanding_amount: [6505000000000, 62078456789.34, 6673456789],
                total_ckpn: [116304589.12, 32890123.45, 4902345.34],
                total_ckpn_ratio: [58023.45, 1256.34, 1276.23],
                stage1_jumlah_rekening: [36, 5, 6],
                stage1_outstanding_amount: [2113636363636.36, 23789234567.78, 3109876543.21],
                stage1_ckpn: [36983234.12, 10178923.23, 7823.56],
                stage1_ckpn_ratio: [58023.45, 1254.67, 498764.34],
                stage2_jumlah_rekening: [40, 6, 2],
                stage2_outstanding_amount: [2454545454545.45, 21976543210.12, 2009347654.12],
                stage2_ckpn: [42893456.78, 12893456.34, 3123.45],
                stage2_ckpn_ratio: [58023.45, 1256.34, 498764.34],
                stage3_jumlah_rekening: [23, 2, 1],
                stage3_outstanding_amount: [1936818181818.18, 16376543210.78, 1556789345.67],
                stage3_ckpn: [36542789.45, 9823456.78, 3123.45],
                stage3_ckpn_ratio: [58023.45, 1256.34, 498764.34],
            },
        }
    };

    // Color mapping for each category
    const categoryColors = {
        Deposito: "#098e7e", // Blue
        Giro: "#ceb5c3", // Orange
        Obligasi: "#e044a7", // Green
    };

    // State to manage the selected month
    const [selectedMonth, setSelectedMonth] = useState("31-10-2024");
    const [selectedSubsidiary, setSelectedSubsidiary] = useState("BAHANA_Sekuritas");

    // Handle dropdown change
    const handleMonthChange = (e) => {setSelectedMonth(e.target.value);}
    const handleSubsidiaryChange = (e) => setSelectedSubsidiary(e.target.value);;

    // Format number as IDR with delimiter
    const formatIDR = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Data manipulation for the selected month
    const getDataForSelected = (subsidiary, month) => {
        const monthData = rawData[subsidiary]?.[month];
        if (!monthData) return { labels: [], values: [], details: [] };

        const labels = monthData.kategori;
        const values = monthData.total_ckpn;

        const details = monthData.kategori.map((val, index) => ([
            monthData.kategori[index],
            monthData.total_jumlah_rekening[index],
            formatIDR(monthData.total_outstanding_amount[index]),
            formatIDR(monthData.total_ckpn[index]),
            monthData.stage1_jumlah_rekening[index],
            formatIDR(monthData.stage1_outstanding_amount[index]),
            formatIDR(monthData.stage1_ckpn[index]),
            monthData.stage2_jumlah_rekening[index],
            formatIDR(monthData.stage2_outstanding_amount[index]),
            formatIDR(monthData.stage2_ckpn[index]),
            monthData.stage3_jumlah_rekening[index],
            formatIDR(monthData.stage3_outstanding_amount[index]),
            formatIDR(monthData.stage3_ckpn[index]),
        ]));

        return { labels, values, details };
    };

    // Get data for the selected month
    const { labels, values, details } = getDataForSelected(selectedSubsidiary, selectedMonth);
    
    
    // Map category names to their respective colors
    const ChartColors = labels.map((label) => categoryColors[label] || "#000000"); // Default to black if no mapping found




    return (
        <div className="row">
            <div className="col-md-12">
                <div className="row">
                    {/* Subsidiary Dropdown */}
                    <div className="col-md-4">
                        <label htmlFor="subsidiary-selector" style={{ marginRight: "10px" }}>
                            Select Subsidiary:
                        </label>
                        <select
                            className="form-select"
                            id="subsidiary-selector"
                            value={selectedSubsidiary}
                            onChange={handleSubsidiaryChange}
                        >
                            {Object.keys(rawData).map((subsidiary) => (
                                <option key={subsidiary} value={subsidiary}>
                                    {subsidiary}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4"></div>
                    {/*Month Dropdown*/}
                    <div className="col-md-4">
                        <label htmlFor="month-selector" style={{ marginRight: "10px" }}>
                            Select Reporting Period:
                        </label>
                        <select
                            className="form-select"
                            id="month-selector"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            {Object.keys(rawData[selectedSubsidiary] || {}).map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
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
                                    // title: `Financial Data for ${selectedSubsidiary} (${selectedMonth})`,
                                    title: `${selectedSubsidiary} Expected Credit Loss (${selectedMonth})`,
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

export default ChartWithDropdownHolding;

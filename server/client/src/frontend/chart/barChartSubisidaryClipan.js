import React, { useState } from "react";
import Plot from "react-plotly.js";
import { getDataInsAmountCkpnForChart, getDataPiutangForChart, getDataPiutangClipanForChart } from "./getDataForChart"
import { data } from "react-router-dom";

//holding pakai acName=>All
const ChartSubsidiary = () => {
    // Data for each month
    const rawDataPiutang = getDataPiutangClipanForChart()

    // Color mapping for each category
    const Colors = {
        "Giro": "#00338d",
        "Deposito": "#00b8f5",
        "Obligasi": "#1e49e2",
        "Piutang": "#76d2ff",

        "stage 1": "#00c0ae",
        "stage 2": "#ab0d82",
        "stage 3": "#fd349c",

        "Bucket1": "#00c0ae",
        "Bucket2": "#ab0d82",
        "Bucket3": "#fd349c",
        "Bucket4": "#ffa3da",

        "Heavy Equipment":"#0c243c",
        "Motor Vehicle":"#ab0d82"

    };

    const formatIDR = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };


    // State to manage the selected month
    const [selectedMonth, setSelectedMonth] = useState("01/31/2024");
    const handleMonthChange = (e) => setSelectedMonth(e.target.value);



    const ckpnDistribution = (month) => {
        const selectedAcDataPiutang = rawDataPiutang;
        const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)

        const labels = ["Heavy Equipment", "Motor Vehicle"]
        const instrumentCkpn = [0, 0]

        
        Object.entries(monthDataPiutang[1]).forEach((monthDataKeyData) => {
            //distribusiCkpn
            
                if (monthDataKeyData[0]=="total_CKPN") {
                    instrumentCkpn[0] = monthDataKeyData[1][0]
                    instrumentCkpn[1] = monthDataKeyData[1][1]
                }
            
        })

        return { labels, instrumentCkpn }

    }

    
    
    
    const { labels, instrumentCkpn } = ckpnDistribution(selectedMonth)
    // console.log(labels,instrumentCkpn)
    
    console.log("trace 1",labels, instrumentCkpn)

    // Map category names to their respective colors
    const ChartColors = labels.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found



    const he_each_stage = (month) => {
        const selectedAcDataPiutang = rawDataPiutang;
        const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)

        const labelsHe = ["stage 1", "stage 2", "stage 3"]
        const valueHe = [0, 0, 0]

        console.log(Object.entries(monthDataPiutang[1]))
        Object.entries(monthDataPiutang[1]).forEach((monthDataKeyData) => {
            //HE -> 0

            
            if (monthDataKeyData[0]=="stage1") {
                    // console.log("trace 2a",monthDataKeyData[1][0])
                    valueHe[0] = monthDataKeyData[1][0]
                }
                if (monthDataKeyData[0]=="stage2") {
                    // console.log("trace 2a",monthDataKeyData[1][0])
                    valueHe[1] = monthDataKeyData[1][0]
                }
                if (monthDataKeyData[0]=="stage3") {
                    // console.log("trace 2a",monthDataKeyData[1][0])
                    valueHe[2] = monthDataKeyData[1][0]
                }
            
        })

        return { labelsHe, valueHe }

    }
    
    // console.log("trace 2b",he_each_stage(selectedMonth))

    const { labelsHe, valueHe } = he_each_stage(selectedMonth)


    // console.log("trace 2", labelsHe, valueHe)

    // Map category names to their respective colors
    const ChartColorsHe = labelsHe.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found

    const mv_each_stage = (month) => {
        const selectedAcDataPiutang = rawDataPiutang;
        const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)

        const labelsMv = ["stage 1", "stage 2", "stage 3"]
        const valueMv = [0, 0, 0]

        
        Object.entries(monthDataPiutang[1]).forEach((monthDataKeyData) => {
            //mv -> 1
            
                if (monthDataKeyData[0]=="stage1") {
                    valueMv[0] = monthDataKeyData[1][1]
                }
                if (monthDataKeyData[0]=="stage2") {
                    valueMv[1] = monthDataKeyData[1][1]
                }
                if (monthDataKeyData[0]=="stage3") {
                    valueMv[2] = monthDataKeyData[1][1]
                }
            
        })

        return { labelsMv, valueMv }

    }

    const { labelsMv, valueMv } = mv_each_stage(selectedMonth)

    // Map category names to their respective colors
    const ChartColorsMv = labelsMv.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found



    const trend_os_ckpn = () => {
        const selectedAcData = rawDataPiutang
        const labelTrend = Object.keys(selectedAcData)
        const trendOs = {
            y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['total_OS']),
            x: labelTrend,
            type: 'scatter',
            name: 'Tren Outstanding'
        }
        const trendCkpn = {
            y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['total_CKPN'].reduce((a, b) => a + b, 0)),
            x: labelTrend,
            type: 'scatter',
            name: 'Tren CKPN',
            yaxis: 'y2'
        }

        const dataTrend = [trendOs, trendCkpn]

        return dataTrend
    }

    const dataTrend = trend_os_ckpn()

    console.log(dataTrend)



    const getTotal = (instrument) => formatIDR(instrument);

    

    return (
        <div className="row">
            <div className="col-md-12">
                {/* Filters */}
                <div className="row">
                    <div className="col-md-4">
                        <label style={{ marginRight: "10px" }}>Select Month:</label>
                        <select className="form-select" value={selectedMonth} onChange={handleMonthChange}>
                            {Object.keys(rawDataPiutang).map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>

                   
                </div>
                {/* Chart */}<div className="row mt-4 m-0 p-0">
                    <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>CKPN Distribution</h5>
                </div>
                <div className="row mb-1 m-0 p-0">
                    <div className="col-md-12 p-0">
                        <Plot
                            data={[{
                                x: labels,
                                y: instrumentCkpn,
                                type: "bar",
                                marker: { color: ChartColors },
                            }]}
                            layout={{
                                autosize: true,
                                margin: { t: 10, l: 50, r: 50, b: 50 },
                                yaxis: {
                                    range: [0, 700000000], // Set Y-axis range from 0 to 700M
                                },
                            }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "100%" }}
                        />

                    </div>

                    {/* Legend Section */}
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {labels.map((label, index) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: ChartColors[index],
                                                marginRight: '10px',
                                            }}
                                        ></div>
                                        <span style={{ fontWeight: 'normal' }}>{label}: <b>{getTotal(instrumentCkpn[index])}</b></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>Stage Distribution</h5>
                </div>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <Plot
                            data={[{
                                x: labelsHe,
                                y: valueHe,
                                type: "bar",
                                marker: {
                                    color: ChartColorsHe, // Apply different colors for each category
                                },
                            }]}
                            layout={{
                                autosize: true, // Enables responsive behavior
                                title: `Giro`,
                                // xaxis: { title: "Instruments" },
                                yaxis: {
                                    // title: "Total CKPN for Giro",
                                    // range: [0, 130000000], // Set y-axis max value to be a fixed range
                                },
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                    <div className="col-md-6">
                        <Plot
                            data={[{
                                x: labelsMv,
                                y: valueMv,
                                type: "bar",
                                marker: {
                                    color: ChartColorsMv, // Apply different colors for each category
                                },
                            }]}
                            layout={{
                                autosize: true, // Enables responsive behavior
                                title: `Deposito`,
                                // xaxis: { title: "Instruments" },
                                yaxis: {
                                    // title: "Total CKPN for Deposito",
                                    // range: [0, 130000000], // Set y-axis max value to be a fixed range
                                },
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
                <div className="row">
                    <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>Trend Outstanding & CKPN</h5>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Plot
                            data={dataTrend}
                            layout={{
                                autosize: true,
                                // title: `<b>Trend Outstanding & CKPN</b>`,
                                xaxis: { title: "Date" },
                                yaxis: {
                                    title: "Amount OS",
                                    // range: [0, 130000000], // Set y-axis max value to be a fixed range
                                },
                                yaxis2: {
                                    title: "Amount CKPN",
                                    overlaying: 'y',
                                    side: 'right'
                                    // range: [0, 130000000], // Set y-axis max value to be a fixed range
                                },
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
            </div>
        </div>






    );
};

export default ChartSubsidiary;

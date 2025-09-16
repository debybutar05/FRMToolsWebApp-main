import React, { useState } from "react";
import Plot from "react-plotly.js";
import { getDataInsAmountCkpnForChart, getDataPiutangForChart, getDataIntercoAmountCkpnforChart } from "./getDataForChart"
import { data } from "react-router-dom";

//holding pakai acName=>All
const ChartSubsidiaryInvest = (args) => {
    // Data for each month
    const rawData = getDataInsAmountCkpnForChart()
    const rawDataPiutang = getDataPiutangForChart()
    const rawDataInterco = getDataIntercoAmountCkpnforChart()

    // Color mapping for each category
    const Colors = {
        "Kas Setara Kas": "#00338d",
        "Deposito": "#00b8f5",
        "Obligasi": "#1e49e2",
        "Piutang": "#76d2ff",

        "stage1": "#00c0ae",
        "stage2": "#ab0d82",
        "stage3": "#fd349c",

        "Bucket1": "#00c0ae",
        "Bucket2": "#ab0d82",
        "Bucket3": "#fd349c",
        "Bucket4": "#ffa3da",

    };

    // Color mapping for each category
    const ColorsAC = {
        "SafeGuard Insurance": "#00338d",
        "SafeGuard Insurance Putera": "#00b8f5",
        "TRUST": "#1e49e2",
        "National Reinsurance": "#76d2ff",
        "SCOV": "#7213ea",
        "Insurance Subsidiary": "#b497ff",
        "HealthTrust": "#098e7e",
        "SCOV Syariah": "#00c0ae",
        "TRUST Syariah": "#ab0d82",
        "SureGuarantee Syariah": "#fd349c",
        "SureGuarantee": "#ffa3da",
        "Beta Securities": "#666666",
        "Gamma Capital": "#510dbc",
        "Bahana Artha Ventura": "#63ebda",
        "Investment Subsidiary": "#f1c44d",
        "Alpha Asset Management": "#269924",
        "Holding Company": "#d91e18",
        "ECL": "#8B0000",
        "Outstanding": "#C49A00"
    };

    const formatIDR = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };


    // State to manage the selected month
    const [selectedMonth, setSelectedMonth] = useState("1/31/2024");
    const handleMonthChange = (e) => setSelectedMonth(e.target.value);
    const [selectedAc, setSelectedAc] = useState(args.acName == "All" ? "SafeGuard Insurance" : args.acName);
    const [selectedInstrumentMove, setselectedInstrumentMove] = useState("Total");

    const handleAcChange = (e) => setSelectedAc(e.target.value);
    const handleInstrumentMoveChange = (e) => setselectedInstrumentMove(e.target.value);



    const total_ECL_instrument_on_selected_month = (month) => {
        const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'], rawData['Holding'])[selectedAc];
        const selectedAcDataPiutang = Object.assign({}, rawDataPiutang['Group_Insurance'], rawDataPiutang['Group_CMI'], rawDataPiutang['Holding'])[selectedAc];

        const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month)
        const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)

        const labels = ["Kas Setara Kas", "Deposito", "Obligasi"]
        const instrumentECL = [0, 0, 0]
        //Masih ada piutang lagi proses data
        // console.log(monthData)

        Object.entries(monthData[1]).forEach((monthDataKeyData) => {
            if (["stage1", "stage2", "stage3"].includes(monthDataKeyData[0])) {
                //Giro
                instrumentECL[0] += monthDataKeyData[1][4]
                //Deposito
                instrumentECL[1] += monthDataKeyData[1][5]
                //Obligasi
                instrumentECL[2] += monthDataKeyData[1][6]
            }
        })

        return { labels, instrumentECL }

    }



    const { labels, instrumentECL } = total_ECL_instrument_on_selected_month(selectedMonth)
    // console.log(labels,instrumentECL)

    // Map category names to their respective colors
    const ChartColors = labels.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found

    const interco_OS_ECL_month = (month) => {
        const allAc = Object.assign({}, rawDataInterco['Group_Insurance'], rawDataInterco['Group_CMI'], rawDataInterco['Holding']);
        const ECLdata = {
            x: ['non-interco', 'interco'],
            y: [allAc[selectedAc][month]['non interco'] ? allAc[selectedAc][month]['non interco'][1] : 0, allAc[selectedAc][month]['interco all'] ? allAc[selectedAc][month]['interco all'][1] : 0],
            name: 'ECL',
            type: 'bar',
            marker: { color: ColorsAC['ECL'] }
        }
        const OSdata = {
            x: ['non-interco', 'interco'],
            y: [allAc[selectedAc][month]['non interco'] ? allAc[selectedAc][month]['non interco'][0] : 0, allAc[selectedAc][month]['interco all'] ? allAc[selectedAc][month]['interco all'][0] : 0],
            name: 'Outstanding',
            type: 'bar',
            marker: { color: ColorsAC['Outstanding'] }
        }

        const data = [ECLdata, OSdata]

        return data
    }

    const dataIntercoOSECLMonth = interco_OS_ECL_month(selectedMonth)


    const interco_OS_ECL_detail_month = (month) => {

        const allAc = Object.assign({}, rawDataInterco['Group_Insurance'], rawDataInterco['Group_CMI'], rawDataInterco['Holding']);
        const xData = [
            "SafeGuard Insurance",
            "SafeGuard Insurance Putera",
            "TRUST",
            "National Reinsurance",
            "SCOV",
            "Insurance Subsidiary",
            "HealthTrust",
            "SureGuarantee",
            "Beta Securities",
            "Gamma Capital",
            "Bahana Artha Ventura",
            "Investment Subsidiary",
            "Alpha Asset Management",
            "Holding Company"
        ]
        const ECLdata = {
            x: xData,
            y: [
                allAc[selectedAc][month]["interco SafeGuard Insurance"] ? allAc[selectedAc][month]["interco SafeGuard Insurance"][1] : 0
                , allAc[selectedAc][month]["interco SafeGuard Insurance Putera"] ? allAc[selectedAc][month]["interco SafeGuard Insurance Putera"][1] : 0
                , allAc[selectedAc][month]["interco TRUST"] ? allAc[selectedAc][month]["interco TRUST"][1] : 0
                , allAc[selectedAc][month]["interco National Reinsurance"] ? allAc[selectedAc][month]["interco National Reinsurance"][1] : 0
                , allAc[selectedAc][month]["interco SCOV"] ? allAc[selectedAc][month]["interco SCOV"][1] : 0
                , allAc[selectedAc][month]["interco Insurance Subsidiary"] ? allAc[selectedAc][month]["interco Insurance Subsidiary"][1] : 0
                , allAc[selectedAc][month]["interco HealthTrust"] ? allAc[selectedAc][month]["interco HealthTrust"][1] : 0
                , allAc[selectedAc][month]["interco SureGuarantee"] ? allAc[selectedAc][month]["interco SureGuarantee"][1] : 0
                , allAc[selectedAc][month]["interco Beta Securities"] ? allAc[selectedAc][month]["interco Beta Securities"][1] : 0
                , allAc[selectedAc][month]["interco Gamma Capital"] ? allAc[selectedAc][month]["interco Gamma Capital"][1] : 0
                , allAc[selectedAc][month]["interco Bahana Artha Ventura"] ? allAc[selectedAc][month]["interco Bahana Artha Ventura"][1] : 0
                , allAc[selectedAc][month]["interco Investment Subsidiary"] ? allAc[selectedAc][month]["interco Investment Subsidiary"][1] : 0
                , allAc[selectedAc][month]["interco Bahana TCW Investment Managemen"] ? allAc[selectedAc][month]["interco Bahana TCW Investment Managemen"][1] : 0
                , allAc[selectedAc][month]["interco Holding Company"] ? allAc[selectedAc][month]["interco Holding Company"][1] : 0
            ],
            name: 'ECL',
            type: 'bar',
            marker: { color: ColorsAC['ECL'] }
        }
        const OSdata = {
            x: xData,
            y: [
                allAc[selectedAc][month]["interco SafeGuard Insurance"] ? allAc[selectedAc][month]["interco SafeGuard Insurance"][0] : 0
                , allAc[selectedAc][month]["interco SafeGuard Insurance Putera"] ? allAc[selectedAc][month]["interco SafeGuard Insurance Putera"][0] : 0
                , allAc[selectedAc][month]["interco TRUST"] ? allAc[selectedAc][month]["interco TRUST"][0] : 0
                , allAc[selectedAc][month]["interco National Reinsurance"] ? allAc[selectedAc][month]["interco National Reinsurance"][0] : 0
                , allAc[selectedAc][month]["interco SCOV"] ? allAc[selectedAc][month]["interco SCOV"][0] : 0
                , allAc[selectedAc][month]["interco Insurance Subsidiary"] ? allAc[selectedAc][month]["interco Insurance Subsidiary"][0] : 0
                , allAc[selectedAc][month]["interco HealthTrust"] ? allAc[selectedAc][month]["interco HealthTrust"][0] : 0
                , allAc[selectedAc][month]["interco SureGuarantee"] ? allAc[selectedAc][month]["interco SureGuarantee"][0] : 0
                , allAc[selectedAc][month]["interco Beta Securities"] ? allAc[selectedAc][month]["interco Beta Securities"][0] : 0
                , allAc[selectedAc][month]["interco Gamma Capital"] ? allAc[selectedAc][month]["interco Gamma Capital"][0] : 0
                , allAc[selectedAc][month]["interco Bahana Artha Ventura"] ? allAc[selectedAc][month]["interco Bahana Artha Ventura"][0] : 0
                , allAc[selectedAc][month]["interco Investment Subsidiary"] ? allAc[selectedAc][month]["interco Investment Subsidiary"][0] : 0
                , allAc[selectedAc][month]["interco Bahana TCW Investment Managemen"] ? allAc[selectedAc][month]["interco Bahana TCW Investment Managemen"][0] : 0
                , allAc[selectedAc][month]["interco Holding Company"] ? allAc[selectedAc][month]["interco Holding Company"][0] : 0
            ],
            name: 'Outstanding',
            type: 'bar',
            marker: { color: ColorsAC['Outstanding'] }
        }

        const data = [ECLdata, OSdata]

        return data
    }

    const dataECLOSDetailsInterco = interco_OS_ECL_detail_month(selectedMonth)

    const giro_each_stage = (month) => {
        const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'], rawData['Holding'])[selectedAc];
        const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month);
        const labelsGiro = ["stage1", "stage2", "stage3"]
        var valueGiro = [monthData[1]["stage1"][4], monthData[1]["stage2"][4], monthData[1]["stage3"][4]]


        return { labelsGiro, valueGiro }

    }

    const { labelsGiro, valueGiro } = giro_each_stage(selectedMonth)

    // Map category names to their respective colors
    const ChartColorsGiro = labelsGiro.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


    const depo_each_stage = (month) => {
        const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'], rawData['Holding'])[selectedAc];
        const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month);
        const labelsDepo = ["stage1", "stage2", "stage3"]
        var valueDepo = [monthData[1]["stage1"][5], monthData[1]["stage2"][5], monthData[1]["stage3"][5]]

        return { labelsDepo, valueDepo }

    }

    const { labelsDepo, valueDepo } = depo_each_stage(selectedMonth)

    // Map category names to their respective colors
    const ChartColorsDepo = labelsDepo.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


    const obli_each_stage = (month) => {
        const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'], rawData['Holding'])[selectedAc];
        const monthData = Object.entries(selectedAcData).find((monthKeyData) => monthKeyData[0] == month);
        const labelsObli = ["stage1", "stage2", "stage3"]
        var valueObli = [monthData[1]["stage1"][6], monthData[1]["stage2"][6], monthData[1]["stage3"][6]]

        return { labelsObli, valueObli }

    }

    const { labelsObli, valueObli } = obli_each_stage(selectedMonth)

    // Map category names to their respective colors
    const ChartColorsObli = labelsObli.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found

    const piutang_each_stage = (month) => {
        var labelsPiutang
        const selectedAcDataPiutang = Object.assign({}, rawDataPiutang['Group_Insurance'], rawDataPiutang['Group_CMI'], rawDataPiutang['Holding'])[selectedAc];
        const monthDataPiutang = Object.entries(selectedAcDataPiutang).find((monthKeyData) => monthKeyData[0] == month)
        console.log(monthDataPiutang)
        if (selectedAc != 'Bahana Artha Ventura') {
            labelsPiutang = ["Bucket1", "Bucket2", "Bucket3", "Bucket4"]
            var valuePiutang = [
                monthDataPiutang[1]["bucket1"][1],
                monthDataPiutang[1]["bucket2"][1],
                monthDataPiutang[1]["bucket3"][1],
                monthDataPiutang[1]["bucket4"][1]
            ]

        } else {
            labelsPiutang = ["stage1", "stage2", "stage3"]
            var valuePiutang = [monthDataPiutang[1]["stage1"][1], monthDataPiutang[1]["stage2"][1], monthDataPiutang[1]["stage3"][1]]

        }

        return { labelsPiutang, valuePiutang }

    }

    const { labelsPiutang, valuePiutang } = piutang_each_stage(selectedMonth)

    // Map category names to their respective colors
    const ChartColorsPiutang = labelsPiutang.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


    const trend_os_ECL = (InstrumentMove) => {
        const selectedAcData = Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'], rawData['Holding'])[selectedAc];
        const labelTrend = Object.keys(selectedAcData)

        var trendOs, trendECL
        if (InstrumentMove == "Total") {
            trendOs = {
                y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['total_OS']),
                x: labelTrend,
                type: 'scatter',
                name: 'Outstanding'
            }
            trendECL = {
                y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['total_CKPN']),
                x: labelTrend,
                type: 'scatter',
                name: 'ECL',
                yaxis: 'y2'
            }
        }
        else if (InstrumentMove == "Kas dan setara Kas") {
            trendOs = {
                y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['stage1'][7]),
                x: labelTrend,
                type: 'scatter',
                name: 'Outstanding'
            }
            trendECL = {
                y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['stage1'][10]),
                x: labelTrend,
                type: 'scatter',
                name: 'ECL',
                yaxis: 'y2'
            }
        }
        else if (InstrumentMove == "Deposito") {
            trendOs = {
                y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['stage1'][8]),
                x: labelTrend,
                type: 'scatter',
                name: 'Outstanding'
            }
            trendECL = {
                y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['stage1'][11]),
                x: labelTrend,
                type: 'scatter',
                name: 'ECL',
                yaxis: 'y2'
            }
        }
        else if (InstrumentMove == "Obligasi") {
            trendOs = {
                y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['stage1'][9]),
                x: labelTrend,
                type: 'scatter',
                name: 'Outstanding'
            }
            trendECL = {
                y: Object.entries(selectedAcData).map((dataEachDate) => dataEachDate[1]['stage1'][12]),
                x: labelTrend,
                type: 'scatter',
                name: 'ECL',
                yaxis: 'y2'
            }
        }

        const dataTrend = [trendOs, trendECL]

        return dataTrend
    }

    const dataTrend = trend_os_ECL(selectedInstrumentMove)

    // const total_ECL_insurance_on_selected_month=(month)=>{
    //     const allAc=rawData['Group_Insurance'];
    //     const labelsInsurance=Object.keys(allAc)
    //     //filter syariah
    //     .filter((acName)=>!(['SCOV Syariah','TRUST Syariah','SureGuarantee Syariah'].includes(acName)))

    //     const ECLValueInsurance = labelsInsurance.map((acName)=>{
    //         const monthData=Object.entries(allAc[acName]).find((monthKeyData)=>monthKeyData[0]==month)
    //         // console.log(monthData)
    //         var ECL=0
    //         Object.entries(monthData[1]).forEach((monthDataKeyData)=>{
    //             if(["stage1","stage2","stage3"].includes(monthDataKeyData[0])){
    //                 ECL+=monthDataKeyData[1][3]
    //             }
    //         })
    //         return ECL
    //     })
    //     const sumECLValueInsurance=ECLValueInsurance.reduce((acc, curr) => acc + curr,0)

    //     return {labelsInsurance,ECLValueInsurance,sumECLValueInsurance}

    // }

    // const {labelsInsurance,ECLValueInsurance,sumECLValueInsurance}=total_ECL_insurance_on_selected_month(selectedMonth)

    // // Map category names to their respective colors
    // const ChartColorsInsurance = labelsInsurance.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


    // const total_ECL_CMI_on_selected_month=(month)=>{
    //     const allAc=rawData['Group_CMI'];
    //     const labelsCMI=Object.keys(allAc)
    //     //filter syariah
    //     .filter((acName)=>!(['SCOV Syariah','TRUST Syariah','SureGuarantee Syariah'].includes(acName)))

    //     const ECLValueCMI = labelsCMI.map((acName)=>{
    //         const monthData=Object.entries(allAc[acName]).find((monthKeyData)=>monthKeyData[0]==month)
    //         // console.log(monthData)
    //         var ECL=0
    //         Object.entries(monthData[1]).forEach((monthDataKeyData)=>{
    //             if(["stage1","stage2","stage3"].includes(monthDataKeyData[0])){
    //                 ECL+=monthDataKeyData[1][3]
    //             }
    //         })
    //         return ECL
    //     })

    //     const sumECLValueCMI=ECLValueCMI.reduce((acc, curr) => acc + curr,0)

    //     return {labelsCMI,ECLValueCMI,sumECLValueCMI}

    // }

    // const {labelsCMI,ECLValueCMI,sumECLValueCMI}=total_ECL_CMI_on_selected_month(selectedMonth)

    // // Map category names to their respective colors
    // const ChartColorsCMI = labelsCMI.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found



    const FilterAc = (args) => {
        console.log(args)
        if (args.acName == "All") {
            return (
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-6"></div>
                        <div className="col-md-6">
                            <label style={{ marginLeft: "20px", marginRight: "10px" }}>
                                Select Subsidiaries:
                            </label>
                            <select className="form-select" value={selectedAc} onChange={handleAcChange}>
                                {Object.keys(Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI'], rawData['Holding'])).filter((acName) => !(['SCOV Syariah', 'TRUST Syariah', 'SureGuarantee Syariah'].includes(acName))).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<div className="col-md-8"></div>)
        }

    }



    const getTotal = (instrument) => formatIDR(instrument);

    return (
        <div className="row">
            <div className="col-md-12">
                {/* Filters */}
                <div className="row">
                    {/* <div className="col-md-4">
                        <label style={{ marginRight: "10px" }}>Select Month:</label>
                        <select className="form-select" value={selectedMonth} onChange={handleMonthChange}>
                            {Object.keys(rawData["Group_Insurance"]["SafeGuard Insurance"]).map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    <FilterAc acName={args.acName} />

                    {/* <div className="col-md-4"></div> */}
                    {/* <div className="col-md-4">
                        <label style={{ marginLeft: "20px", marginRight: "10px" }}>
                        Select Category:
                        </label>
                        <select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
                        {rawData.subsidiary1["31-10-2024"].kategori.map((cat) => (
                            <option key={cat} value={cat}>
                            {cat}
                            </option>
                        ))}
                        </select>
                    </div> */}
                </div>
                {/* Chart */}<div className="row mt-4 m-0 p-0">
                    <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>Total ECL per Instrument</h5>
                </div>
                <div className="row mb-1 m-0 p-0" style={{ minHeight: '50vh' }}>
                    <div className="col-md-8 p-0">
                        <Plot
                            data={[{
                                x: labels,
                                y: instrumentECL,
                                type: "bar",
                                marker: { color: ChartColors },
                            }]}
                            layout={{
                                autosize: true,
                                margin: { t: 10, l: 50, r: 50, b: 50 },
                                yaxis: {
                                },
                            }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "100%" }}
                        />

                    </div>

                    {/*<div className="col-md-8 p-0">
                         <Plot
                            data={dataECLInterco}
                            layout={{
                                barmode: 'stack'
                            }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "100%" }}
                        /> 
                    </div>*/}

                    <div className="col-md-4 p-0" style={{ alignContent: 'center' }}>
                        {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
                        {labels.map((label, index) => (
                            <div className="row mb-4">
                                <div className="col-md-1">
                                    {/* <div key={label} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}> */}
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: ChartColors[index],
                                            marginRight: '10px',
                                        }}
                                    ></div>
                                    {/* <span style={{ fontWeight: 'normal'}}>{label}: <b>{getTotal(instrumentECL[index])}</b></span> */}
                                    {/* </div> */}
                                </div>
                                <div className="col-md-4">
                                    <span style={{ fontWeight: 'normal' }}>{label}: </span>
                                </div>
                                <div className="col-md-7" style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 'normal' }}><b>{getTotal(instrumentECL[index])}</b></span>
                                </div>
                            </div>
                        ))}
                        {/* </div> */}
                    </div>

                    <hr className="mt-4" />

                    {/* Legend Section */}

                </div>

                <div className="row mt-5">
                    <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>Total ECL per Stage</h5>
                </div>
                <div className="row mb-2">
                    <div className="col-md-6">
                        <Plot
                            data={[{
                                x: labelsGiro,
                                y: valueGiro,
                                type: "bar",
                                marker: {
                                    color: ChartColorsGiro, // Apply different colors for each category
                                },
                            }]}
                            layout={{
                                autosize: true, // Enables responsive behavior
                                title: { text: `Kas Setara Kas` },
                                // xaxis: { title: "Instruments" },
                                yaxis: {
                                    // title: "Total ECL for Giro",
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
                                x: labelsDepo,
                                y: valueDepo,
                                type: "bar",
                                marker: {
                                    color: ChartColorsDepo, // Apply different colors for each category
                                },
                            }]}
                            layout={{
                                autosize: true, // Enables responsive behavior
                                title: { text: `Deposito` },
                                // xaxis: { title: "Instruments" },
                                yaxis: {
                                    // title: "Total ECL for Deposito",
                                    // range: [0, 130000000], // Set y-axis max value to be a fixed range
                                },
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-md-6">
                        <Plot
                            data={[{
                                x: labelsObli,
                                y: valueObli,
                                type: "bar",
                                marker: {
                                    color: ChartColorsObli, // Apply different colors for each category
                                },
                            }]}
                            layout={{
                                autosize: true, // Enables responsive behavior
                                title: { text: `Obligasi` },
                                // xaxis: { title: "Instruments" },
                                yaxis: {
                                    // title: "Total ECL for Giro",
                                    // range: [0, 130000000], // Set y-axis max value to be a fixed range
                                },
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
                <hr className="mt-4 mb-4" />
            </div>
        </div>






    );
};

export default ChartSubsidiaryInvest;

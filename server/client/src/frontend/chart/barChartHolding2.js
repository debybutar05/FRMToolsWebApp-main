import React, { useState } from "react";
import Plot from "react-plotly.js";
import { HotTable } from '@handsontable/react-wrapper';
import Handsontable from "handsontable";
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import {getDataInsAmountCkpnForChart,getDataIntercoAmountCkpnforChart} from "./getDataForChart"


const ChartWithDropdownHolding2 = () => {
    // Data for each month
    const rawData = getDataInsAmountCkpnForChart()
    const rawDataInterco = getDataIntercoAmountCkpnforChart()

    // Color mapping for each category
    const Colors = {
        "SafeGuard Insurance":"#00338d",
        "SafeGuard Insurance Putera":"#00b8f5",
        "TRUST":"#1e49e2",
        "National Reinsurance":"#76d2ff",
        "SCOV":"#7213ea",
        "Insurance Subsidiary":"#b497ff",
        "HealthTrust":"#098e7e",
        "SCOV Syariah":"#00c0ae",
        "TRUST Syariah":"#ab0d82",
        "SureGuarantee Syariah":"#fd349c",
        "SureGuarantee":"#ffa3da",
        "Beta Securities":"#666666",
        "Gamma Capital":"#510dbc",
        "Bahana Artha Ventura":"#63ebda",
        "Investment Subsidiary":"#f1c44d",
        "Alpha Asset Management":"#269924",
        "Holding Company":"#d91e18",

        "Itc":"#008B8B",
        "Non-Itc":"#0033CC",

        "ECL":"#8B0000",
        "ECL-Itc":"#464646",
        "ECL-NonItc":"#461A66",
        
        "Outstanding":"#C49A00",
        "Outstanding-Itc":"#629346",
        "Outstanding-NonItc":"#626766"
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

    
    const interco_OS_ECL_month=(month)=>{
        const allAc=Object.assign({}, rawDataInterco['Group_Insurance'], rawDataInterco['Group_CMI'], rawDataInterco['Holding']);
        const ECLdata={
            x: ['non-interco', 'interco'],
            y:[allAc["Holding Company"][month]['non interco']?allAc["Holding Company"][month]['non interco'][1]:0,allAc["Holding Company"][month]['interco all']?allAc["Holding Company"][month]['interco all'][1]:0],
            name:'ECL',
            type: 'bar',
            marker: {color: Colors['ECL']}
        }
        const OSdata={
            x: ['non-interco', 'interco'],
            y:[allAc["Holding Company"][month]['non interco']?allAc["Holding Company"][month]['non interco'][0]:0,allAc["Holding Company"][month]['interco all']?allAc["Holding Company"][month]['interco all'][0]:0],
            name:'Outstanding Amount',
            type: 'bar',
            marker: {color: Colors['Outstanding']}
        }

        const data=[ECLdata,OSdata]

        return data
    }

    const dataIntercoOSECLMonth=interco_OS_ECL_month(selectedMonth)

    // Custom cell styling
    const IntercoCellStyle = (row, col) => {
        const colors = [
            ["white",               Colors['Itc'],              Colors['Non-Itc']], // Header row
            [Colors['ECL'],         Colors['ECL-Itc'],          Colors['ECL-NonItc']], // Row 1
            [Colors['Outstanding'], Colors['Outstanding-Itc'], Colors['Outstanding-NonItc']], // Row 2
        ];

        return {
        background: colors[row][col] || "#000",
        color: "white",
        };
    }

    // Custom cell renderer function
    const customRenderer = (instance, td, row, col, prop, value) => {
        if (!td) return; // Prevents undefined errors
        Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value);
        
        // Apply styles
        const style = IntercoCellStyle(row, col);
        td.style.backgroundColor = style.backgroundColor;
        td.style.color = style.color;
    };
    
    const interco_table_os_ecl_month=(month)=>{
        const allAc=Object.assign({}, rawDataInterco['Group_Insurance'], rawDataInterco['Group_CMI'], rawDataInterco['Holding']);

        var rowHeader=['ECL','Outstanding Amount']
        var colHeaders=["Interco","Non-Interco"]
        var dataTable=[
            [formatIDR(allAc["Holding Company"][month]['interco all']?allAc["Holding Company"][month]['interco all'][1]:0)  ,formatIDR(allAc["Holding Company"][month]['non interco']?allAc["Holding Company"][month]['non interco'][1]:0)  ],
            [formatIDR(allAc["Holding Company"][month]['interco all']?allAc["Holding Company"][month]['interco all'][0]:0)  ,formatIDR(allAc["Holding Company"][month]['non interco']?allAc["Holding Company"][month]['non interco'][0]:0)  ]
        ]


        return {rowHeader,colHeaders,dataTable}
    }

    const {rowHeader,colHeaders,dataTable}=interco_table_os_ecl_month(selectedMonth)



    const total_ckpn_all_ac_on_selected_month=(month)=>{
        const allAc=Object.assign({}, rawData['Group_Insurance'], rawData['Group_CMI']);
        const labels=Object.keys(allAc)
        //filter syariah
        .filter((acName)=>!(['SCOV Syariah','TRUST Syariah','SureGuarantee Syariah'].includes(acName)))
        
        const ckpnValue = labels.map((acName)=>{
            const monthData=Object.entries(allAc[acName]).find((monthKeyData)=>monthKeyData[0]==month)
            // console.log(monthData)
            var ckpn=0
            Object.entries(monthData[1]).forEach((monthDataKeyData)=>{
                if(["stage1","stage2","stage3"].includes(monthDataKeyData[0])){
                    ckpn+=monthDataKeyData[1][3]
                }
            })
            return ckpn
        })

        const sumCkpnValue=ckpnValue.reduce((acc, curr) => acc + curr,0)

        return {labels,ckpnValue,sumCkpnValue}
        
    }

    const {labels, ckpnValue, sumCkpnValue}=total_ckpn_all_ac_on_selected_month(selectedMonth)

    // Map category names to their respective colors
    const ChartColors = labels.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


    const total_ckpn_insurance_on_selected_month=(month)=>{
        const allAc=rawData['Group_Insurance'];
        const labelsInsurance=Object.keys(allAc)
        //filter syariah
        .filter((acName)=>!(['SCOV Syariah','TRUST Syariah','SureGuarantee Syariah'].includes(acName)))
        
        const ckpnValueInsurance = labelsInsurance.map((acName)=>{
            const monthData=Object.entries(allAc[acName]).find((monthKeyData)=>monthKeyData[0]==month)
            // console.log(monthData)
            var ckpn=0
            Object.entries(monthData[1]).forEach((monthDataKeyData)=>{
                if(["stage1","stage2","stage3"].includes(monthDataKeyData[0])){
                    ckpn+=monthDataKeyData[1][3]
                }
            })
            return ckpn
        })
        const sumCkpnValueInsurance=ckpnValueInsurance.reduce((acc, curr) => acc + curr,0)

        return {labelsInsurance,ckpnValueInsurance,sumCkpnValueInsurance}
        
    }

    const {labelsInsurance,ckpnValueInsurance,sumCkpnValueInsurance}=total_ckpn_insurance_on_selected_month(selectedMonth)

    // Map category names to their respective colors
    const ChartColorsInsurance = labelsInsurance.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


    const total_ckpn_CMI_on_selected_month=(month)=>{
        const allAc=rawData['Group_CMI'];
        const labelsCMI=Object.keys(allAc)
        //filter syariah
        .filter((acName)=>!(['SCOV Syariah','TRUST Syariah','SureGuarantee Syariah'].includes(acName)))
        
        const ckpnValueCMI = labelsCMI.map((acName)=>{
            const monthData=Object.entries(allAc[acName]).find((monthKeyData)=>monthKeyData[0]==month)
            // console.log(monthData)
            var ckpn=0
            Object.entries(monthData[1]).forEach((monthDataKeyData)=>{
                if(["stage1","stage2","stage3"].includes(monthDataKeyData[0])){
                    ckpn+=monthDataKeyData[1][3]
                }
            })
            return ckpn
        })

        const sumCkpnValueCMI=ckpnValueCMI.reduce((acc, curr) => acc + curr,0)

        return {labelsCMI,ckpnValueCMI,sumCkpnValueCMI}
        
    }

    const {labelsCMI,ckpnValueCMI,sumCkpnValueCMI}=total_ckpn_CMI_on_selected_month(selectedMonth)

    // Map category names to their respective colors
    const ChartColorsCMI = labelsCMI.map((label) => Colors[label] || "#000000"); // Default to black if no mapping found


    return (
        <div className="row">
            <div className="col-md-12">
                {/* Filters */}
                <div className="row">
                    <div className="col-md-4">
                        <label style={{ marginRight: "10px" }}>Select Month:</label>
                        <select className="form-select" value={selectedMonth} onChange={handleMonthChange}>
                        {Object.keys(rawData["Group_Insurance"]["SafeGuard Insurance"]).map((month) => (
                            <option key={month} value={month}>
                            {month}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
                {/* Chart */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <Plot
                            data={[{
                                x: labels,
                                y: ckpnValue,
                                type: "bar",
                                marker: {
                                    color: ChartColors, // Apply different colors for each category
                                },
                            }]}
                            layout={{
                                autosize: true, // Enables responsive behavior
                                title: {text:`Total ECL from All Affiliated Companies:<br><b>${formatIDR(sumCkpnValue)}</b>`},
                                // title: `Total CKPN on ${selectedMonth} : ${formatIDR(sumCkpnValue)}`,
                                // xaxis: { title: "Subsidiaries" },
                                yaxis: {
                                    // title: "Total CKPN for All Subsidiaries",
                                    // range: [0, 130000000], // Set y-axis max value to be a fixed range
                                },
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
                <hr className="mt-4 mb-4"/>
                <div className="row">
                    <div className="col-md-6">
                        <Plot
                            data={[{
                                x: labelsInsurance,
                                y: ckpnValueInsurance,
                                type: "bar",
                                marker: {
                                    color: ChartColorsInsurance, // Apply different colors for each category
                                },
                            }]}
                            layout={{
                                autosize: true, // Enables responsive behavior
                                title: {text:`Total ECL from Insurance Group: <br><b>${formatIDR(sumCkpnValueInsurance)}</b>`},
                                // xaxis: { title: "Subsidiaries" },
                                yaxis: {
                                    // title: "Total CKPN For Insurance Group",
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
                                x: labelsCMI,
                                y: ckpnValueCMI,
                                type: "bar",
                                marker: {
                                    color: ChartColorsCMI, // Apply different colors for each category
                                },
                            }]}
                            layout={{
                                autosize: true, // Enables responsive behavior
                                title: {text:`Total ECL from CMI Group: <br><b>${formatIDR(sumCkpnValueCMI)}</b>`},
                                // xaxis: { title: "Subsidiaries" },
                                yaxis: {
                                    // title: "Total CKPN for CMI Group",
                                    // range: [0, 130000000], // Set y-axis max value to be a fixed range
                                },
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
                <hr className="mt-4 mb-4"/>
                <div className="row" style={{height:"60vh"}}>
                    <div className="col-md-6">
                        <Plot
                            data={dataIntercoOSECLMonth}
                            layout={{
                                autosize: true,
                                title: `Outstanding Amount & ECL Comparison`,
                                barmode: 'group'
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />

                    </div>
                    <div className="col-md-6" style={{alignContent:"center"}}>
                            <HotTable
                                themeName="ht-theme-main"   
                                data={dataTable}
                                colHeaders={colHeaders}
                                rowHeaders={rowHeader}
                                rowHeaderWidth={200}
                                width="auto"
                                height="auto"
                                stretchH="all" 
                                colWidths={[150, 150]} // Ensure columns are wide enough
                                autoWrapRow={true}
                                autoWrapCol={true}
                                licenseKey="non-commercial-and-evaluation"
                                // cells={(row, col) => ({
                                //     renderer: customRenderer, // Use the separate function
                                // })}
                            />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartWithDropdownHolding2;

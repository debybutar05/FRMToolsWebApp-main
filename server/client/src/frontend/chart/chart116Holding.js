import React, { useState } from "react";
import Plot from "react-plotly.js";
import {getData116ChartHolding} from "./getDataForChart"

const ChartWithDropdownP116Holding = (args) => {
    const rawData = getData116ChartHolding()

    // Color mapping for each category
    const categoryColors = {
        'RoU': "#00338d", 
        'L. Liability': "#1e49e2",
        'Depreciation': "#76d2ff", 
        'Interest': "#098e7e",
    };

    // State to manage the selected month
    const [selectedMonth, setSelectedMonth] = useState("1/31/2024");
    const [selectedAsset, setSelectedAsset] = useState("kendaraan");

    // Handle dropdown change
    const handleMonthChange = (e) => {setSelectedMonth(e.target.value);}
    const handleAssetChange = (e) => {setSelectedAsset(e.target.value);}

    // Format number as IDR with delimiter
    const formatIDR = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getRoULlCompareAllSubsidiaries =(month,asset)=>{
        const allAc=Object.assign({}, rawData['Group Insurance'], rawData['Group Investment']);
        const xData=Object.keys(allAc)
        const RouData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].rou}),
            name:'Nett RoU',
            type: 'bar',
            marker: {color: categoryColors['RoU']}
        }

        const LLData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].ll}),
            name:'Lease liability',
            type: 'bar',
            marker: {color: categoryColors['L. Liability']}
        }

        const data=[RouData,LLData]

        return data

    }

    const chartRouLlCompareAllSubsidiaries=getRoULlCompareAllSubsidiaries(selectedMonth,selectedAsset)

    const getDepIntCompareAllSubsidiaries =(month,asset)=>{
        const allAc=Object.assign({}, rawData['Group Insurance'], rawData['Group Investment']);
        const xData=Object.keys(allAc)

        const DepData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].depreciation}),
            name:'Depreciation',
            type: 'bar',
            marker: {color: categoryColors['depreciation']}
        }

        const IntData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].interest}),
            name:'Interest',
            type: 'bar',
            marker: {color: categoryColors['interest']}
        }

        const data=[DepData,IntData]

        return data

    }

    const chartDepIntCompareAllSubsidiaries=getDepIntCompareAllSubsidiaries(selectedMonth,selectedAsset)

    const getDataCompareInsurance =(month,asset)=>{
        const allAc=rawData['Group Insurance'];
        const xData=Object.keys(allAc)
        const RouData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].rou}),
            name:'Nett RoU',
            type: 'bar',
            marker: {color: categoryColors['RoU']}
        }

        const LLData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].ll}),
            name:'Lease liability',
            type: 'bar',
            marker: {color: categoryColors['L. Liability']}
        }

        const DepData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].depreciation}),
            name:'Depreciation',
            type: 'bar',
            marker: {color: categoryColors['depreciation']}
        }

        const IntData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].interest}),
            name:'Interest',
            type: 'bar',
            marker: {color: categoryColors['interest']}
        }

        const data=[RouData,LLData,DepData,IntData]

        return data

    }

    const chartDataCompareInsurance=getDataCompareInsurance(selectedMonth,selectedAsset)

    const getDataCompareCMI =(month,asset)=>{
        const allAc=rawData['Group Investment'];
        const xData=Object.keys(allAc)
        const RouData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].rou}),
            name:'Nett RoU',
            type: 'bar',
            marker: {color: categoryColors['RoU']}
        }

        const LLData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].ll}),
            name:'Lease liability',
            type: 'bar',
            marker: {color: categoryColors['L. Liability']}
        }

        const DepData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].depreciation}),
            name:'Depreciation',
            type: 'bar',
            marker: {color: categoryColors['depreciation']}
        }

        const IntData={
            x: xData,
            y: xData.map((ac)=>{return allAc[ac][asset][month].interest}),
            name:'Interest',
            type: 'bar',
            marker: {color: categoryColors['interest']}
        }

        const data=[RouData,LLData,DepData,IntData]

        return data

    }

    const chartDataCompareCMI=getDataCompareCMI(selectedMonth,selectedAsset)

    return (
        <div className="row">
            <div className="col-md-12">
                {/* filter */}
                <div className="row">
                    <div className="col-md-4">
                        <label style={{ marginRight: "10px" }}>Select Month:</label>
                        <select className="form-select" value={selectedMonth} onChange={handleMonthChange}>
                            {Object.keys(rawData['Group Insurance']['SafeGuard Insurance']['kendaraan']).map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <label style={{ marginRight: "10px" }}>Select Asset:</label>
                        <select className="form-select" value={selectedAsset} onChange={handleAssetChange}>
                            {Object.keys(rawData['Group Insurance']['SafeGuard Insurance']).map((asset) => (
                                <option key={asset} value={asset}>
                                    {asset}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* chart */}
                <div className="row">
                    <div className="col-md-12">
                        <Plot
                            data={chartRouLlCompareAllSubsidiaries}
                            layout={{
                                autosize: true,
                                title: {text:`Nett RoU & Lease Liability Subsidiaries Comparison`},
                                barmode: 'group'
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
                <hr className="mt-4 mb-4"/>
                <div className="row">
                    <div className="col-md-12">
                        <Plot
                            data={chartDepIntCompareAllSubsidiaries}
                            layout={{
                                autosize: true,
                                title: {text:`Depreciation & Interest Liability Subsidiaries Comparison`},
                                barmode: 'group'
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                    {/* <div className="col-md-6">
                        <Plot
                            data={chartDataCompareInsurance}
                            layout={{
                                autosize: true,
                                title: {text:`Insurance Subsidiaries Comparison`},
                                barmode: 'group'
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                    <div className="col-md-6">
                        <Plot
                            data={chartDataCompareCMI}
                            layout={{
                                autosize: true,
                                title: {text:`CMI Subsidiaries Comparison`},
                                barmode: 'group'
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div> */}
                </div>
            </div>
        </div>
    )

}

export default ChartWithDropdownP116Holding
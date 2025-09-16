import React, { useState } from "react";
import Plot from "react-plotly.js";
import {getData116ChartHolding,getData116ChartInterco} from "./getDataForChart"

const ChartWithDropdownP116 = (args) => {
    const rawData = getData116ChartHolding()
    const rawDataInterco = getData116ChartInterco()

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
    const [selectedAc, setSelectedAc] = useState(args.acName == "All" ? "SafeGuard Insurance" : args.acName);
    

    // Handle dropdown change
    const handleMonthChange = (e) => {setSelectedMonth(e.target.value);}
    const handleAssetChange = (e) => {setSelectedAsset(e.target.value);}
    const handleAcChange = (e) => setSelectedAc(e.target.value);

    // Format number as IDR with delimiter
    const formatIDR = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const calculateTotal = (values) => values.reduce((sum, val) => sum + val, 0);


    // compare rou ll on reporting period each asset 
    const getRouLLForSelectedMonth=(month,ac)=>{
        const allAc=Object.assign({}, rawData['Group Insurance'], rawData['Group Investment']);
        const selectedAcData=allAc[ac]
        const xData=Object.keys(selectedAcData)
        // console.log(ac,allAc,selectedAcData,xData)
        const yValuesRou = xData.map(asset => selectedAcData[asset][month].rou);
        const yValuesLl = xData.map(asset => selectedAcData[asset][month].ll);

        const RouData={
            x: xData,
            y: xData.map((asset)=>{return selectedAcData[asset][month].rou}),
            name:`Nett RoU: ${formatIDR(calculateTotal(yValuesRou))}`,
            type: 'bar',
            marker: {color: categoryColors['RoU']},
            textposition: "inside",
            textfont: { size: 12, align: "right" }
        }

        const LLData={
            x: xData,
            y: xData.map((asset)=>{return selectedAcData[asset][month].ll}),
            name:`Lease Liability: ${formatIDR(calculateTotal(yValuesLl))}`,
            type: 'bar',
            marker: {color: categoryColors['L. Liability']},
            textposition: "inside",
            textfont: { size: 12, align: "right" }
        }

        const data=[RouData,LLData]
        return data

    }

    const chartDataRouLL=getRouLLForSelectedMonth(selectedMonth,selectedAc)

    const getDepIntForSelectedMonth=(month,ac)=>{
        const allAc=Object.assign({}, rawData['Group Insurance'], rawData['Group Investment']);
        const selectedAcData=allAc[ac]
        const xData=Object.keys(selectedAcData)
        // console.log(ac,allAc,selectedAcData,xData)
        const yValuesDep = xData.map(asset => selectedAcData[asset][month].depreciation);
        const yValuesInt = xData.map(asset => selectedAcData[asset][month].interest);


        const DepData={
            x: xData,
            y: xData.map((asset)=>{return selectedAcData[asset][month].depreciation}),
            name:`Depreciation: ${formatIDR(calculateTotal(yValuesDep))}`,
            type: 'bar',
            marker: {color: categoryColors['Depreciation']},
            textposition: "inside",
            textfont: { size: 12, align: "right" }
        }

        const IntData={
            x: xData,
            y: xData.map((asset)=>{return selectedAcData[asset][month].interest}),
            name:`Interest : ${formatIDR(calculateTotal(yValuesInt))}`,
            type: 'bar',
            marker: {color: categoryColors['Interest']},
            textposition: "inside",
            textfont: { size: 12, align: "right" }
        }

        const data=[DepData,IntData]
        return data

    }

    const chartDataDepInt=getDepIntForSelectedMonth(selectedMonth,selectedAc)





    // Data manipulation for the selected month
    const getRouLlForSelectedAcAsset = (ac,asset) => {
        const allAc=Object.assign({}, rawData['Group Insurance'], rawData['Group Investment']);
        const selectedAcAssetData=allAc[ac][asset]

        var traceRou = {
            x: Object.keys(selectedAcAssetData),
            y: Object.values(selectedAcAssetData).map((item)=>item.rou),
            name: 'Nett RoU',
            type: 'bar',
            marker: {color:categoryColors['RoU']}
          };
          
          var traceLl = {
            x: Object.keys(selectedAcAssetData),
            y: Object.values(selectedAcAssetData).map((item)=>item.ll),
            name: 'Lease Liability',
            type: 'bar',
            marker: {color:categoryColors['L. Liability']}
          };
          
          var data = [traceRou, traceLl];

        return data
    }

    // Get data for the selected month
    const dataAcAssetRouLl = getRouLlForSelectedAcAsset(selectedAc,selectedAsset);

    const getDepIntForSelectedAcAsset = (ac,asset) => {
        const allAc=Object.assign({}, rawData['Group Insurance'], rawData['Group Investment']);
        const selectedAcAssetData=allAc[ac][asset]

        var traceDep = {
            x: Object.keys(selectedAcAssetData),
            y: Object.values(selectedAcAssetData).map((item)=>item.depreciation),
            name: 'Depreciation',
            type: 'bar',
            marker: {color:categoryColors['Depreciation']}
          };
          
          var traceInt = {
            x: Object.keys(selectedAcAssetData),
            y: Object.values(selectedAcAssetData).map((item)=>item.interest),
            name: 'Interest',
            type: 'bar',
            marker: {color:categoryColors['Interest']}
          };
          
          var data = [traceDep, traceInt];

        return data
    }

    // Get data for the selected month
    const dataAcAssetDepInt = getDepIntForSelectedAcAsset(selectedAc,selectedAsset);



    const interco_ROU_LL_month=(month,asset)=>{
        const allAc=Object.assign({}, rawDataInterco['Group_Insurance'], rawDataInterco['Group_CMI']);
        const RoUdata={
            x: ['non-interco', 'interco'],
            y:[allAc[selectedAc][month][asset]['non interco']?allAc[selectedAc][month][asset]['non interco'][0]:0, allAc[selectedAc][month][asset]['interco all']?allAc[selectedAc][month][asset]['interco all'][1]:0],
            name:'Nett RoU',
            type: 'bar',
            marker: {color: categoryColors['RoU']}
        }
        const LLdata={
            x: ['non-interco', 'interco'],
            y:[allAc[selectedAc][month][asset]['non interco']?allAc[selectedAc][month][asset]['non interco'][1]:0,allAc[selectedAc][month][asset]['interco all']?allAc[selectedAc][month][asset]['interco all'][1]:0],
            name:'Lease Liability',
            type: 'bar',
            marker: {color: categoryColors['L. Liability']}
        }

        const data=[RoUdata,LLdata]

        return data
    }

    const dataIntercoRoULlMonth=interco_ROU_LL_month(selectedMonth,selectedAsset)


    const interco_ROU_LL_detail_month=(month,asset)=>{
    
        const allAc=Object.assign({}, rawDataInterco['Group_Insurance'], rawDataInterco['Group_CMI']);
        const xData=[
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
        const LLdata={
            x: xData,
            y:[
                 allAc[selectedAc][month][asset]["interco SafeGuard Insurance"]?                      allAc[selectedAc][month][asset]["interco SafeGuard Insurance"][1]:0
                ,allAc[selectedAc][month][asset]["interco SafeGuard Insurance Putera"]?               allAc[selectedAc][month][asset]["interco SafeGuard Insurance Putera"][1]:0
                ,allAc[selectedAc][month][asset]["interco TRUST"]?                          allAc[selectedAc][month][asset]["interco TRUST"][1]:0
                ,allAc[selectedAc][month][asset]["interco National Reinsurance"]?                       allAc[selectedAc][month][asset]["interco National Reinsurance"][1]:0
                ,allAc[selectedAc][month][asset]["interco SCOV"]?                           allAc[selectedAc][month][asset]["interco SCOV"][1]:0
                ,allAc[selectedAc][month][asset]["interco Insurance Subsidiary"]?                          allAc[selectedAc][month][asset]["interco Insurance Subsidiary"][1]:0
                ,allAc[selectedAc][month][asset]["interco HealthTrust"]?                          allAc[selectedAc][month][asset]["interco HealthTrust"][1]:0
                ,allAc[selectedAc][month][asset]["interco SureGuarantee"]?                         allAc[selectedAc][month][asset]["interco SureGuarantee"][1]:0
                ,allAc[selectedAc][month][asset]["interco Beta Securities"]?                  allAc[selectedAc][month][asset]["interco Beta Securities"][1]:0
                ,allAc[selectedAc][month][asset]["interco Gamma Capital"]?            allAc[selectedAc][month][asset]["interco Gamma Capital"][1]:0
                ,allAc[selectedAc][month][asset]["interco Bahana Artha Ventura"]?              allAc[selectedAc][month][asset]["interco Bahana Artha Ventura"][1]:0
                ,allAc[selectedAc][month][asset]["interco Investment Subsidiary"]?              allAc[selectedAc][month][asset]["interco Investment Subsidiary"][1]:0
                ,allAc[selectedAc][month][asset]["interco Bahana TCW Investment Managemen"]?   allAc[selectedAc][month][asset]["interco Bahana TCW Investment Managemen"][1]:0
                ,allAc[selectedAc][month][asset]["interco Holding Company"]?                       allAc[selectedAc][month][asset]["interco Holding Company"][1]:0
            ],
            name:'Lease Liability',
            type: 'bar',
            marker: {color: categoryColors['L. Liability']}
        }
        const ROUdata={
            x: xData,
            y:[
                 allAc[selectedAc][month][asset]["interco SafeGuard Insurance"]?                      allAc[selectedAc][month][asset]["interco SafeGuard Insurance"][0]:0
                ,allAc[selectedAc][month][asset]["interco SafeGuard Insurance Putera"]?               allAc[selectedAc][month][asset]["interco SafeGuard Insurance Putera"][0]:0
                ,allAc[selectedAc][month][asset]["interco TRUST"]?                          allAc[selectedAc][month][asset]["interco TRUST"][0]:0
                ,allAc[selectedAc][month][asset]["interco National Reinsurance"]?                       allAc[selectedAc][month][asset]["interco National Reinsurance"][0]:0
                ,allAc[selectedAc][month][asset]["interco SCOV"]?                           allAc[selectedAc][month][asset]["interco SCOV"][0]:0
                ,allAc[selectedAc][month][asset]["interco Insurance Subsidiary"]?                          allAc[selectedAc][month][asset]["interco Insurance Subsidiary"][0]:0
                ,allAc[selectedAc][month][asset]["interco HealthTrust"]?                          allAc[selectedAc][month][asset]["interco HealthTrust"][0]:0
                ,allAc[selectedAc][month][asset]["interco SureGuarantee"]?                         allAc[selectedAc][month][asset]["interco SureGuarantee"][0]:0
                ,allAc[selectedAc][month][asset]["interco Beta Securities"]?                  allAc[selectedAc][month][asset]["interco Beta Securities"][0]:0
                ,allAc[selectedAc][month][asset]["interco Gamma Capital"]?            allAc[selectedAc][month][asset]["interco Gamma Capital"][0]:0
                ,allAc[selectedAc][month][asset]["interco Bahana Artha Ventura"]?              allAc[selectedAc][month][asset]["interco Bahana Artha Ventura"][0]:0
                ,allAc[selectedAc][month][asset]["interco Investment Subsidiary"]?              allAc[selectedAc][month][asset]["interco Investment Subsidiary"][0]:0
                ,allAc[selectedAc][month][asset]["interco Bahana TCW Investment Managemen"]?   allAc[selectedAc][month][asset]["interco Bahana TCW Investment Managemen"][0]:0
                ,allAc[selectedAc][month][asset]["interco Holding Company"]?                       allAc[selectedAc][month][asset]["interco Holding Company"][0]:0
            ],
            name:'Nett RoU',
            type: 'bar',
            marker: {color: categoryColors['RoU']}
        }

        const data=[LLdata,ROUdata]

        return data
    }

    const dataROULLDetailsInterco=interco_ROU_LL_detail_month(selectedMonth,selectedAsset)




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
                                {Object.keys(Object.assign({}, rawData['Group Insurance'], rawData['Group Investment'])).filter((acName) => !(['SCOV Syariah', 'TRUST Syariah', 'SureGuarantee Syariah'].includes(acName))).map((cat) => (
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

    const commonLayout = {
        autosize: true,
        barmode: 'group',
        legend: { orientation: "h", y: -0.2 },
    };


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
                    <FilterAc acName={args.acName} />
                </div>

                {/* Chart */}
                <div className="row mt-4 m-0 p-0">
                    <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>Asset Comparison</h5>
                </div>
                <div className="row mb-1 m-0 p-0">
                    <div className="col-md-6 p-0">
                    
                        <Plot
                            data={chartDataRouLL}
                            layout={{ ...commonLayout,
                                title: {text:`Nett RoU & Lease Liability`},
                                
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />

                    </div>
                    <div className="col-md-6 p-0">
                    <Plot
                            data={chartDataDepInt}
                            layout={{
                                ...commonLayout,
                                title: {text:`Depreciation & Interest`},
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
                
                <hr className="mb-4 mt-4"/>

                <div className="row mt-4 m-0 p-0">
                    <h5 style={{ fontWeight: 'bold', textAlign: 'center' }}>Monthly Comparison: {selectedAsset}</h5>
                </div>
                <div className="row mb-1 m-0 p-0">
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
                <div className="row">
                    <div className="col-md-12 ">
                        <Plot
                            data={dataAcAssetRouLl}
                            layout={{
                                barmode: 'group',
                                autosize: true,
                                title: {text:`Nett RoU & Lease Liability Each Month`},
                            }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
                <hr className="mb-4 mt-4"/>
                <div className="row">
                    <div className="col-md-12 ">
                        <Plot
                            data={dataAcAssetDepInt}
                            layout={{
                                barmode: 'group',
                                autosize: true,
                                title: {text:`Depreciation & Interest Each Month`},
                            }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
                <hr className="mb-4 mt-4"/>

                <div className="row">
                    <div className="col-md-4">
                        <Plot
                            data={dataIntercoRoULlMonth}
                            layout={{
                                autosize: true,
                                title: {text:`Nett RoU & Lease Liability Comparison`},
                                barmode: 'group',
                                legend: {
                                    x: 0.5,        // Center horizontally
                                    y: -0.2,       // Place below the plot
                                    xanchor: 'center',
                                    yanchor: 'top',
                                    orientation: 'h' // Makes the legend horizontal
                                }
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>

                    <div className="col-md-8">
                        <Plot
                            data={dataROULLDetailsInterco}
                            layout={{
                                autosize: true,
                                title: {text:`Outstanding Amount & ECL interco detail`},
                                barmode: 'group',
                                yaxis: {
                                    range: [0, 100000000], // Set y-axis max value to be a fixed range
                                },
                                legend: {
                                    x: 0.5,        // Center horizontally
                                    y: -0.4,       // Place below the plot
                                    xanchor: 'center',
                                    yanchor: 'top',
                                    orientation: 'h' // Makes the legend horizontal
                                }
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartWithDropdownP116
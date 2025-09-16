import React, { useState } from "react";
import Plot from "react-plotly.js";

const ChartWithDropdownVintage = () => {
    const rawData = {
        "31-10-2024": {
            os_and_ecl: {
                kategori: ["T0", "T1", "T2", "T365"],
                total_outstanding_amount: [10609193472, 18081398762, 7001545971, 14558548051],
                total_ECL: [8480667368, 10155657547, 4327020718],
            },
            Interco: {
                kategori: ["Y", "N"],
                total_ECL: [13576181070, 11153095041],
            },
            TOP5: {
                NAME: ["Fadli", "Erwin", "Dona", "Xan", "Cemara"],
                amount: [14434276184, 6103665704, 4802473530, 3471322326, 1639206971],
            },
        },
        "30-11-2024": {
            os_and_ecl: {
                kategori: ["T0", "T1", "T2", "T365"],
                total_outstanding_amount: [12345678901, 19876543210, 7890123456, 15678901234],
                total_ECL: [9123456789, 11223344556, 4765432100],
            },
            Interco: {
                kategori: ["Y", "N"],
                total_ECL: [14567890123, 11987654321],
            },
            TOP5: {
                NAME: ["Fadli", "Erwin", "Dona", "Kai", "Nova"],
                amount: [15432098765, 7012345678, 5098765432, 3678901234, 1734567890],
            },
        },
        "31-12-2024": {
            os_and_ecl: {
                kategori: ["T0", "T1", "T2", "T365"],
                total_outstanding_amount: [13579864201, 17654329876, 8543217890, 14987654321],
                total_ECL: [8932175643, 10987654321, 4598763210],
            },
            Interco: {
                kategori: ["Y", "N"],
                total_ECL: [13987654321, 12123456789],
            },
            TOP5: {
                NAME: ["Erwin", "Dona", "Kai", "Sari", "Jaka"],
                amount: [14876543210, 6789012345, 4987654321, 3456789012, 1765432109],
            },
        },
    };

    // Color mapping for each category
    const categoryColors = {
        T0: "#098e7e",
        T1: "#ceb5c3",
        T2: "#e044a7",
        T365: "#c298b0",
    };

    const [selectedMonth, setSelectedMonth] = useState("31-10-2024");

    const handleDropdownChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const currentData = rawData[selectedMonth];

    return (
        <div className="row">
            <div className="col-12">
                <div className="row"> 
                    <div className="col-4 mb-3">
                        <label htmlFor="monthSelector" className="form-label">Select Month:</label>
                        <select  id="monthSelector" className="form-select" value={selectedMonth} onChange={handleDropdownChange}>
                            {Object.keys(rawData).map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 mb-4">
                        <Plot
                            data={[
                                {
                                    x: currentData.os_and_ecl.kategori,
                                    y: currentData.os_and_ecl.total_outstanding_amount,
                                    type: "bar",
                                    marker: { color: currentData.os_and_ecl.kategori.map((cat) => categoryColors[cat]) },
                                },
                            ]}
                            layout={{ 
                                title: "Total Outstanding Amount by Category",
                                autosize: true, // Enables responsive behavior
                            }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                    <div className="col-6 mb-4">
                        <Plot
                            data={[
                                {
                                    x: currentData.TOP5.NAME,
                                    y: currentData.TOP5.amount,
                                    type: "bar",
                                    marker: { color: "#4c78a8" },
                                },
                            ]}
                            layout={{ 
                                title: "Top 5 Debtors with Amount" ,
                                autosize: true, // Enables responsive behavior
                                }}
                            useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 mb-4">
                        <Plot
                            data={[
                                {
                                    x: currentData.os_and_ecl.kategori,
                                    y: currentData.os_and_ecl.total_ECL,
                                    type: "bar",
                                    marker: { color: currentData.os_and_ecl.kategori.map((cat) => categoryColors[cat]) },
                                },
                            ]}
                            layout={{ title: "Total ECL by Category" ,
                                autosize: true, // Enables responsive behavior
                                }}
                                useResizeHandler={true} // Enables responsive resizing
                            style={{ width: "100%", height: "100%" }} // Make it responsive to parent width
                        />
                    </div>

                    <div className="col-6 mb-4">
                        <Plot
                            data={[
                                {
                                    x: currentData.Interco.kategori,
                                    y: currentData.Interco.total_ECL,
                                    type: "bar",
                                    marker: { color: ["#d62728", "#2ca02c"] },
                                },
                            ]}
                            layout={{ title: "Interco Category Amount" ,
                                autosize: true, // Enables responsive behavior
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

export default ChartWithDropdownVintage;

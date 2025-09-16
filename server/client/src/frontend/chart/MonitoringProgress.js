import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import DataTable from 'react-data-table-component';
import '../MainPage.css';
import { Download, EnvelopeAt } from 'react-bootstrap-icons';
import { Button, Form } from 'react-bootstrap';
import Papa from 'papaparse';

const MonitoringProgress = () => {
    const phases = [0, 12.5, 25, 50, 62.5, 75, 87.5, 100];
    const statuses = [
        'Waiting for data transfer approval',
        'Waiting for data quality approval',
        'Waiting for tariff calculation approval',
        'ECL Calculation has not started',
        'Waiting for data transfer approval',
        'Waiting for data quality approval',
        'Waiting for ECL Calculation approval',
        'Completed'
    ];

    const getStatus = (progress) => {
        for (let i = phases.length - 1; i >= 0; i--) {
            if (progress >= phases[i]) return statuses[i];
        }
        return statuses[0];
    };

    const data = [
        { name: "Investment Subsidiary", tariffProgress: 50, eclProgress: 50, status: getStatus(100) },
        { name: "Beta Securities", tariffProgress: 50, eclProgress: 25, status: getStatus(75) },
        { name: "Gamma Capital", tariffProgress: 50, eclProgress: 12.5, status: getStatus(62.5) },
        { name: "Bahana Artha Ventura", tariffProgress: 50, eclProgress: 0, status: getStatus(50) },
        { name: "Alpha Asset Management", tariffProgress: 50, eclProgress: 25, status: getStatus(75) },
        { name: "SafeGuard Insurance", tariffProgress: 50, eclProgress: 12.5, status: getStatus(62.5) },
        { name: "SafeGuard Insurance Putera", tariffProgress: 0, eclProgress: 0, status: getStatus(0) },
        { name: "TRUST", tariffProgress: 50, eclProgress: 25, status: getStatus(75) },
        { name: "National Reinsurance", tariffProgress: 50, eclProgress: 50, status: getStatus(100) },
        { name: "SCOV", tariffProgress: 50, eclProgress: 25, status: getStatus(50) },
        { name: "Insurance Subsidiary", tariffProgress: 50, eclProgress: 25, status: getStatus(75) },
        { name: "HealthTrust", tariffProgress: 50, eclProgress: 50, status: getStatus(100) },
        { name: "SureGuarantee", tariffProgress: 50, eclProgress: 17.5, status: getStatus(87.5) },
    ];

    const createProgressBar = (tariffProgress, eclProgress) => {
        const colors = {
            tariff: "#250750ff",      // Royal Blue
            ecl: "#80087aff",         // Deep Violet
            remaining: "#E6E9F2"    // Soft light blue-gray
        };

        return [
            {
                type: "bar",
                x: [tariffProgress],
                y: [""],
                orientation: "h",
                // text: [`${tariffProgress}%`],
                textposition: "inside",
                insidetextanchor: "start",
                hoverinfo: "text",
                marker: { color: colors.tariff },
                name: "Tariff Progress"
            },
            {
                type: "bar",
                x: [eclProgress],
                y: [""],
                orientation: "h",
                // text: [`${eclProgress}%`],
                textposition: "inside",
                insidetextanchor: "start",
                hoverinfo: "text",
                marker: { color: colors.ecl },
                name: "ECL Progress"
            },
            {
                type: "bar",
                x: [Math.max(0, 100 - Math.max(tariffProgress, eclProgress))],
                y: [""],
                orientation: "h",
                // text: [`${Math.max(0, 100 - Math.max(tariffProgress, eclProgress))}%`],
                textposition: "inside",
                insidetextanchor: "start",
                hoverinfo: "text",
                marker: { color: colors.remaining },
                name: "Remaining"
            }
        ];
    };

    // const createProgressBar = (tariffProgress, eclProgress) => {
    //     const colors = ["#0C233C", "#0C233C", "#AB0D82", "#AB0D82"];
    //     const greyColor = "#D3D3D3";

    //     return [
    //         {
    //             type: "bar",
    //             x: [tariffProgress],
    //             y: [""],
    //             orientation: "h",
    //             hoverinfo: "none",
    //             marker: { color: colors[0] }
    //         },
    //         {
    //             type: "bar",
    //             x: [eclProgress],
    //             y: [""],
    //             orientation: "h",
    //             hoverinfo: "none",
    //             marker: { color: colors[2] }
    //         },
    //         {
    //             type: "bar",
    //             x: [Math.max(0, 100 - Math.max(tariffProgress, eclProgress))],
    //             y: [""],
    //             orientation: "h",
    //             hoverinfo: "none",
    //             marker: { color: greyColor }
    //         }
    //     ];
    // };

    const customStyles = {
        table: {
            style: {
                border: 'none',
            }
        },
        rows: {
            style: {
                borderBottom: 'none',
            }
        },
        headRow: {
            style: {
                borderBottom: 'none',
            }
        },
        headCells: {
            style: {
                textAlign: 'left',
                justifyContent: 'left',
                paddingLeft: '20px',
            }
        },
        cells: {
            style: {
                textAlign: 'left',
                justifyContent: 'left',
                paddingLeft: '20px',
            }
        },
    };


    // const columns = [
    //     { name: 'Affiliated Company', selector: row => row.name, sortable: true, width: '200px' },

    //     {
    //         name: (
    //             <div className="row" style={{ width: '400px', marginTop: '5px', fontSize: '14px', color: '#333' }}>
    //                 <div className="col-md-6">Tariff Progress</div>
    //                 <div className="col-md-6">ECL Progress</div>
    //             </div>
    //         ),
    //         style: {
    //             width: '400px',
    //             textAlign: 'left',
    //             whiteSpace: 'nowrap'
    //         },
    //         cell: row => (
    //             <div style={{ width: '400px' }}>
    //                 <Plot
    //                     data={createProgressBar(row.tariffProgress, row.eclProgress)}
    //                     layout={{
    //                         width: 400,
    //                         height: 30,
    //                         margin: { l: 0, r: 0, t: 0, b: 0 },
    //                         xaxis: { visible: false, range: [0, 100] },
    //                         yaxis: { visible: false },
    //                         barmode: "stack",
    //                         showlegend: false,
    //                         hovermode: false,
    //                         dragmode: false,
    //                     }}
    //                     config={{
    //                         displayModeBar: false, // Hide the mode bar (zoom, pan, reset options, etc.)
    //                     }}
    //                 />
    //             </div>
    //         ),
    //         sortable: false,
    //     },
    //     {
    //         name: 'Status',
    //         cell: row => (
    //             <div style={{ fontStyle: '' }}>
    //                 {row.status}
    //             </div>
    //         ),
    //         sortable: true,
    //         width: '250px'
    //     },
    //     {
    //         name: 'Action',
    //         cell: row => (
    //             <Button className="mr-2 btn-outline-4" style={{ fontSize: '20px', textAlign: 'center' }}>
    //                 <EnvelopeAt />
    //             </Button>
    //         ),
    //         sortable: false,
    //         width: '200px',
    //     },
    // ];
    const columns = [
        {
            name: 'Affiliated Company',
            selector: row => row.name,
            sortable: true,
            width: '200px'
        }, {
            name: (
                <div style={{
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    width: '100%'  // ensures spacing distributes properly
                }}>
                    <span><strong>Progress</strong></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>
                            <span style={{
                                display: 'inline-block',
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#250750ff',  // Tariff
                                borderRadius: '50%',
                                marginRight: '4px'
                            }}></span>
                            Tariff
                        </span>
                        <span>
                            <span style={{
                                display: 'inline-block',
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#80087aff',  // ECL
                                borderRadius: '50%',
                                marginRight: '4px'
                            }}></span>
                            ECL
                        </span>
                    </div>
                    <span><strong>Total</strong></span>
                </div>
            ),
            cell: row => {
                const total = Math.min(100, row.tariffProgress + row.eclProgress); // cap at 100%
                return (
                    <div className="d-flex align-items-center justify-content-between w-100">
                        <div style={{ flexGrow: 1, minWidth: 0, marginRight: '12px' }}>
                            <Plot
                                data={createProgressBar(row.tariffProgress, row.eclProgress)}
                                layout={{
                                    width: undefined,
                                    height: 30,
                                    margin: { l: 0, r: 0, t: 0, b: 0 },
                                    xaxis: { visible: false, range: [0, 100] },
                                    yaxis: { visible: false },
                                    barmode: "stack",
                                    showlegend: false,
                                    hovermode: false,
                                    dragmode: false,
                                }}
                                config={{ displayModeBar: false }}
                                useResizeHandler={true}
                                style={{ width: '100%', height: '30px' }}
                            />
                        </div>
                        <div style={{ minWidth: '50px', textAlign: 'right', fontWeight: 600, color: "#0C233C" }}>
                            {total}%
                        </div>
                    </div>
                );
            },
            sortable: false,
            width: '500px', // or auto for dynamic width
        },
        {
            name: 'Status',
            cell: row => (
                <div>
                    {row.status}
                </div>
            ),
            sortable: true,
            width: '250px'
        },
        {
            name: 'Action',
            cell: row => (
                <Button className="mr-2 btn-outline-4" style={{ fontSize: '20px', textAlign: 'center' }}>
                    <EnvelopeAt />
                </Button>
            ),
            sortable: false,
            width: '150px',
        },
    ];


    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const getEndOfMonth = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1); // Set to next month
        date.setDate(0); // Set to the last day of the month
        return date.toISOString().split('T')[0]; // Format as yyyy-mm-dd
    };

    const [selectedDate, setSelectedDate] = useState(getEndOfMonth());

    const handleExportReport = () => {
        const csvData = data.map((row, index) => ({
            id: index + 1,
            AffiliatedCompany: row.name,
            TariffProgress: ((row.tariffProgress) * 2) / 100,
            ECLProgress: row.eclProgress / 100,
            TotalProgress: (row.tariffProgress + row.eclProgress) / 100,
            status: row.status,
            LastTariffCalculationDate: row.lastTariffCalculationDate || '31/12/2024',
            LastECLCalculationDate: row.lastECLCalculationDate || '31/01/2025',
        }));

        const csv = Papa.unparse(csvData);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `MonitoringProgressReport_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="row mb-3 align-items-end justify-content-between">
                    {/* Reporting Period - Left */}
                    <div className="col-md-6 mb-2 mb-md-0">
                        <Form.Group className="mb-0" style={{ maxWidth: '300px' }}>
                            <Form.Label style={{ fontWeight: 500 }}>Reporting Period</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </Form.Group>
                    </div>

                    {/* Export Button - Right */}
                    <div className="col-md-6 text-md-end">
                        <Button
                            variant="primary"
                            className="btn btn3 d-inline-flex align-items-center"
                            onClick={handleExportReport}
                            style={{ height: '40px' }}
                        >
                            <Download />
                            <span style={{ marginLeft: '10px' }}>Export Report</span>
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div style={{ overflowX: 'auto', maxHeight: '400px', width: '100%' }}>
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        dense
                        customStyles={customStyles}
                    />
                </div>

            </div>
        </div>
    );
};

export default MonitoringProgress;

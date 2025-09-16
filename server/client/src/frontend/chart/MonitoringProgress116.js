import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import DataTable from 'react-data-table-component';
import '../MainPage.css';
import { Download, EnvelopeAt } from 'react-bootstrap-icons';
import { Button, Form } from 'react-bootstrap';
import Papa from 'papaparse';

const MonitoringProgress116 = () => {
    const phases = [0, 25, 50, 75, 100];
    const statuses = [
        'RoU & LL Calculation has not started',
        'Waiting for data transfer approval',
        'Waiting for data quality approval',
        'Waiting for RoU & LL calculation approval',
        'Completed'
    ];

    const getStatus = (progress) => {
        for (let i = phases.length - 1; i >= 0; i--) {
            if (progress >= phases[i]) return statuses[i];
        }
        return statuses[0];
    };

    const data = [
        { name: "Investment Subsidiary", progress: 100, status: getStatus(100) },
        { name: "Beta Securities", progress: 75, status: getStatus(75) },
        { name: "Gamma Capital", progress: 62.5, status: getStatus(62.5) },
        { name: "Bahana Artha Ventura", progress: 50, status: getStatus(50) },
        { name: "Alpha Asset Management", progress: 0, status: getStatus(0) },
        { name: "SafeGuard Insurance", progress: 62.5, status: getStatus(62.5) },
        { name: "SafeGuard Insurance Putera", progress: 62.5, status: getStatus(62.5) },
        { name: "TRUST", progress: 75, status: getStatus(75) },
        { name: "National Reinsurance", progress: 100, status: getStatus(100) },
        { name: "SCOV", progress: 50, status: getStatus(50) },
        { name: "Insurance Subsidiary", progress: 75, status: getStatus(75) },
        { name: "HealthTrust", progress: 100, status: getStatus(100) },
        { name: "SureGuarantee", progress: 87.5, status: getStatus(87.5) },
    ];

    const createProgressBar = (progress) => {
        return [
            {
                type: "bar",
                x: [progress],
                y: [""],
                orientation: "h",
                hoverinfo: "none",
                marker: { color: "#0C233C" }
            },
            {
                type: "bar",
                x: [Math.max(0, 100 - progress)],
                y: [""],
                orientation: "h",
                hoverinfo: "none",
                marker: { color: "#D3D3D3" }
            }
        ];
    };

    const columns = [
        { name: 'Affiliated Company', selector: row => row.name, sortable: true, width: '200px' },
        {
            name: 'Progress',
            cell: row => (
                <div style={{ width: '400px' }}>
                    <Plot
                        data={createProgressBar(row.progress)}
                        layout={{
                            width: 400,
                            height: 30,
                            margin: { l: 0, r: 0, t: 0, b: 0 },
                            xaxis: { visible: false, range: [0, 100] },
                            yaxis: { visible: false },
                            barmode: "stack",
                            showlegend: false,
                        }}
                        config={{ displayModeBar: false }}
                    />
                </div>
            ),
            sortable: false,
        },
        { name: 'Status', selector: row => row.status, sortable: true, width: '250px' },
        {
            name: 'Action',
            cell: row => (
                <Button className="mr-2 btn-outline-4" style={{ fontSize: '20px', textAlign: 'center' }}>
                    <EnvelopeAt />
                </Button>
            ),
            sortable: false,
            width: '200px',
        },
    ];

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleDateChange = (e) => setSelectedDate(e.target.value);

    const handleExportReport = () => {
        const csvData = data.map((row, index) => ({
            id: index + 1,
            AffiliatedCompany: row.name,
            Progress: row.progress / 100,
            Status: row.status,
            LastCalculationDate: '31/12/2024'
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `MonitoringProgressReportPSAK116_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="row">
            <div className="col-md-12">
                {/* Filters Row */}
                <div className="row align-items-end justify-content-between mb-3">
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
                    />
                </div>
            </div>
        </div>

    );
};

export default MonitoringProgress116;

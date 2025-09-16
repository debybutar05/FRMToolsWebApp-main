import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { CheckCircle, InfoCircle, CaretRightFill, CaretDownFill, Download } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import './MainPage.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import './MainPage.css';
import JSZip from 'jszip'
import { Button } from 'react-bootstrap';

export default function ModelingLossRateSekuritas() {
    const location = useLocation(); // Use this to get the passed data

    const [rows, setRows] = useState([
        { id: 0, process: "Load Data", status: "Not Started", error: "" },
        { id: 1, process: "Data Control Validation", status: "Not Started", error: "" },
        { id: 2, process: "Data Format Validation", status: "Not Started", error: "" },
        { id: 3, process: "Generate Model", status: "Not Started", progress: 0, error: "", isDropdown: true, isSubprocess: false },
        { id: 3.1, process: "Z-score Calculation", status: "Not Started", progress: 0, isSubprocess: true, fileNames: ["zscore.csv"] },
        { id: 3.2, process: "Loss Rate Forecast Calculation", status: "Not Started", progress: 0, isSubprocess: true, fileNames: ["lrf.csv"] },
        { id: 3.3, process: 'ICT Rate Calculation', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: ["ict.csv"] },
    ]);

    const handleDownload = (fileNames) => {
        fileNames.forEach((fileName) => {
            const fileUrl = `/files/securities/process/${fileName}`; // Path to the file in the public folder
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };


    const [showSubprocesses, setShowSubprocesses] = useState(() =>
        rows
            .filter((row) => row.isDropdown)
            .reduce((acc, row) => ({ ...acc, [row.id]: true }), {})
    );

    const toggleSubprocesses = (id) => {
        setShowSubprocesses((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };


    useEffect(() => {
        // Ensure proper progress and status initialization for main rows

        console.log(location.state);
        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.isDropdown) {
                    // Calculate the average progress of subprocesses
                    const subprocesses = prevRows.filter(
                        (sub) => Math.floor(sub.id) === row.id && sub.isSubprocess
                    );

                    if (subprocesses.length > 0) {
                        const totalProgress = subprocesses.reduce((sum, sub) => sum + (sub.progress || 0), 0);
                        const averageProgress = totalProgress / subprocesses.length;

                        // Determine the status of the main process
                        const isAnyInProgress = subprocesses.some((sub) => sub.progress > 0 && sub.progress < 100);
                        const isAllCompleted = subprocesses.every((sub) => sub.status === 'Completed');

                        return {
                            ...row,
                            progress: averageProgress || 0, // Default to 0% if no progress
                            status: isAllCompleted
                                ? 'Completed'
                                : isAnyInProgress
                                    ? 'In Progress'
                                    : 'Not Started',
                        };
                    }
                }
                return row;
            })
        );
    }, [location.state]);


    const [approvedRows, setApprovedRows] = useState({});

    const handleApprove = async (rowId, processName) => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to approve ${processName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'No, cancel!',
        });

        if (confirmResult.isConfirmed) {
            setApprovedRows((prev) => ({ ...prev, [rowId]: true }));

            // Swal.fire('Approved!', `${processName} has been approved successfully.`, 'success');
        }
    };

    const columns = [
        {
            name: "Process",
            selector: (row) =>
                row.isDropdown ? (
                    <span
                        onClick={() => toggleSubprocesses(row.id)}
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                    >
                        {showSubprocesses[row.id] ? <CaretDownFill /> : <CaretRightFill />} {row.process}
                    </span>
                ) : row.isSubprocess ? (
                    <span style={{ marginLeft: "30px" }}>{row.process}</span>
                ) : (
                    <span style={{ fontWeight: "bold" }}>{row.process}</span>
                ),
        }, {
            name: 'Status',
            cell: (row) => (
                <div>
                    {row.status}
                    {row.progress > 0 && row.progress < 100 && ` (${row.progress.toFixed(0)}%)`}
                </div>
            ),
        },
        {
            name: 'Actions',
            cell: (row) => {
                const isPreviousRowApproved = row.id === 0 || approvedRows[row.id - 1];

                if (row.isDropdown) {
                    const subprocesses = rows.filter(
                        (sub) => Math.floor(sub.id) === row.id && sub.isSubprocess
                    );

                    if (row.status === 'Completed') {
                        return <CheckCircle style={{ color: '#22326e', fontSize: '20px', marginLeft: "5px" }} />;
                    }

                    const allSubprocessesCompleted = subprocesses.every((sub) => sub.status === 'Completed');

                    if (allSubprocessesCompleted) {
                        return <Download style={{ color: '#22326e', fontSize: '20px' }} />;
                    } else if (row.status !== 'Completed') {
                        return (
                            <button
                                className={loading === row.id || !isPreviousRowApproved ? "btn btn-secondary" : "btn btn-primary execute"}
                                onClick={() => handleExecute(row)}
                                disabled={loading === row.id || !isPreviousRowApproved}
                            >
                                {loading === row.id ? 'Executing...' : 'Execute'}
                            </button>
                        );
                    }
                    return null;
                }

                if (row.isSubprocess) {
                    return row.status === 'Completed' ? (
                        <button className="mr-2 btn-outline-4" onClick={() => handleDownload(row.fileNames)}>
                            <Download style={{ color: '#22326e', fontSize: '20px' }} />
                        </button>
                    ) : null;
                }

                return row.status.toLowerCase().includes('completed') ? (
                    (row.id === 1 || row.id === 2) ? (
                        <button
                            onClick={handleDownloadModelDataControl}
                            className="mr-2 btn-outline-4"
                            disabled={row.status !== 'Completed'}
                        >
                            <Download style={{ color: '#22326e', fontSize: '20px' }} />
                        </button>
                    ) : (
                        <CheckCircle style={{ color: '#22326e', fontSize: '20px', marginLeft: "5px" }} />
                    )
                ) : (
                    <button
                        className={loading === row.id || !isPreviousRowApproved ? "btn btn-secondary" : "btn btn-primary execute"}
                        onClick={() => handleExecute(row)}
                        disabled={loading === row.id || !isPreviousRowApproved}
                    >
                        {loading === row.id ? 'Executing...' : 'Execute'}
                    </button>
                );
            },
        },
        {
            name: "Approval",
            cell: (row) => {
                // Show approval button only for non-subprocess rows
                if (row.isSubprocess) return null;

                // Approval button is enabled only when the row status is 'Completed'
                return row.status === "Completed" ? (
                    <button
                        className={approvedRows[row.id] ? "btn btn-success" : "btn btn-primary"}
                        onClick={() => handleApprove(row.id)}
                        disabled={approvedRows[row.id]} // Disable button once approved
                    >
                        {approvedRows[row.id] ? "Approved" : "Approve"}
                    </button>
                ) : (
                    <span>Pending</span>
                );
            },
        }

    ];

    const filesList = [
        'cr_securities_model.csv'
    ];


    const handleDownloadModelDataControl = () => {
        const zip = new JSZip();

        // Fetch each file and add it to the zip
        let filesProcessed = 0;

        filesList.forEach((fileName) => {
            const fileUrl = `/files/securities/${fileName}`;

            fetch(fileUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`File not found: ${fileUrl}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    zip.file(fileName, blob);

                    filesProcessed++;
                    if (filesProcessed === filesList.length) {
                        zip.generateAsync({ type: 'blob' })
                            .then((content) => {
                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(content);
                                link.download = 'Data Control Validation.zip';
                                link.click();
                            })
                            .catch(err => {
                                console.error('Error generating zip:', err);
                            });
                    }
                })
                .catch(err => {
                    console.error('Error fetching file:', err);
                });
        })
    };



    const filesDownloadAll = [
        'zscore.csv',
        'ict.csv',
        'lrf.csv'
    ];


    const handleDownloadAll = () => {
        const zip = new JSZip();

        let filesProcessed = 0;

        filesDownloadAll.forEach((fileName) => {
            const fileUrl = `/files/securities/process/${fileName}`;

            fetch(fileUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`File not found: ${fileUrl}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    zip.file(fileName, blob);

                    filesProcessed++;
                    if (filesProcessed === filesDownloadAll.length) {
                        zip.generateAsync({ type: 'blob' })
                            .then((content) => {
                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(content);
                                link.download = 'Modeling Sekuritas.zip';
                                link.click();
                            })
                            .catch(err => {
                                console.error('Error generating zip:', err);
                            });
                    }
                })
                .catch(err => {
                    console.error('Error fetching file:', err);
                });
        })
    };


    const handleFinish = () => {
        navigate("/model-list-loss-rate-sekuritas")
    }

    const filteredRows = rows.filter((row) => {
        if (row.isSubprocess) {
            return showSubprocesses[Math.floor(row.id)] === true;
        }
        return true;
    });



    const [loading, setLoading] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);

    const updateProgress = (id, progress) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id
                    ? {
                        ...row,
                        status: progress === 100 ? 'Completed' : 'In Progress',
                        progress,
                    }
                    : row
            )
        );
    };

    const handleExecute = async (row) => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to execute ${row.process}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, execute it!',
            cancelButtonText: 'No, cancel!',
        });

        if (confirmResult.isConfirmed) {
            setLoading(row.id);

            if (row.isDropdown) {
                // Handle parent process with subprocesses
                const subprocesses = rows.filter(
                    (sub) => Math.floor(sub.id) === row.id && sub.isSubprocess
                );

                if (subprocesses.length > 0) {
                    const executeSubprocess = async (subprocessId, progressIncrement) => {
                        return new Promise((resolve) => {
                            let progress = 0;

                            const interval = setInterval(() => {
                                progress += progressIncrement;
                                if (progress >= 100) {
                                    progress = 100;
                                    clearInterval(interval);
                                }
                                updateProgress(subprocessId, progress);
                                if (progress === 100) resolve();
                            }, 200);
                        });
                    };

                    // Execute subprocesses sequentially
                    for (const subprocess of subprocesses) {
                        await executeSubprocess(subprocess.id, 20);
                    }

                    // Mark parent process as completed after all subprocesses finish
                    setRows((prevRows) =>
                        prevRows.map((r) =>
                            r.id === row.id
                                ? { ...r, status: 'Completed', progress: 100 }
                                : r
                        )
                    );
                }
            } else {
                // Handle single process (non-parent)
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 20;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                    }
                    updateProgress(row.id, progress);
                }, 200);

                // Simulate execution time
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            setLoading(null);
            Swal.fire('Executed!', `${row.process} has been executed successfully.`, 'success');
        }
    };

    const resetAllProcesses = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to reset all processes?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reset it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                setRows((prevRows) =>
                    prevRows.map((row) => ({
                        ...row,
                        status: 'Not Started',
                        progress: row.isSubprocess ? 0 : 0,
                    }))
                );
                Swal.fire('Reset!', 'All processes have been reset.', 'success');
            }
        });
    };

    const openModal = async (processId) => {
        try {
            const csvUrl =
                processId === 2
                    ? '/files/MEV_historis_validation_error.csv'
                    : '/files/model_result.csv';

            const response = await fetch(csvUrl);
            const csvText = await response.text();

            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const parsedData = result.data;
                    setModalData(parsedData); // Update modal data with parsed CSV rows
                    setShowModal(true);

                    // Check if the "remarks" column exists and has non-empty values
                    if (processId === 2) {
                        const hasRemarks = parsedData.some((row) => row.remarks && row.remarks.trim() !== '');
                        setRows((prevRows) =>
                            prevRows.map((r) =>
                                r.process === 'Generate Data Validation Result'
                                    ? {
                                        ...r,
                                        status: hasRemarks ? 'Completed with remarks' : 'Completed',
                                    }
                                    : r
                            )
                        );
                    }
                },
            });
        } catch (error) {
            console.error('Error loading CSV:', error);
            Swal.fire('Error', 'Failed to load the CSV file.', 'error');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData([]);
    };

    const handleDownloadCSV = (row) => {
        const csvUrl =
            row.process === 'Generate Data Validation Result'
                ? '/files/MEV_historis_validation_error.csv'
                : '/files/model_result.csv';

        fetch(csvUrl)
            .then((response) => response.text())
            .then((csvText) => {
                const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${row.process.replace(/\s+/g, '_')}_result.csv`;
                link.click();
            })
            .catch((error) => {
                console.error('Error downloading CSV:', error);
                Swal.fire('Error', 'Failed to download the CSV file.', 'error');
            });
    };

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    // Function to generate the report
    const handleGenerateReport = () => {
        // For example, you can download the results as a CSV, or generate a PDF, etc.
        const reportData = rows.filter(row => row.status === 'Completed'); // Only completed processes
        // Convert data to CSV and download it (you can adjust the logic here)
        const csv = Papa.unparse(reportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'modeling_investment_report.csv';
        link.click();
    };


    const selectedRow = rows.find(row => row.id === 3);
    const { projectName, reportingDate } = location.state || { projectName: 'N/A', reportingDate: 'N/A' };

    // Now you can use projectName and reportingDate safely
    const displayProjectName = projectName !== undefined ? projectName : 'N/A';
    const displayReportingDate = reportingDate !== undefined ? new Date(reportingDate).toLocaleDateString() : 'N/A';


    const allCompleted = rows.every((row) => row.status === 'Completed');

    const showConfirmation = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'The process will be terminated.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, go back!',
            cancelButtonText: 'No, stay here!',
        });

        if (result.isConfirmed) {
            handleBack()
        } else {
            console.log('User chose to stay on the page.');
        }
    };

    return (
        <div>
            <div className="d-flex">
                <div className="flex-grow-1 pt-3 pl-1">
                    <div style={{ display: "flex", justifyContent: "center", width: "100%", minHeight: "100vh", backgroundColor: "#fbfbfb" }}>
                        <div className="card flex" style={{ width: "100%", minHeight: "90%", alignSelf: "start", alignItems: "center", zIndex: "999" }}>
                            <div className="card-body col-12 d-flex flex-column" style={{ justifyContent: "flex-start", height: 'auto' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <h2 className="m-4">Securites Asset Tariff</h2>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button className="btn btn-outline-primary" onClick={showConfirmation} style={{ height: '40px' }}>
                                            {`<`} Back
                                        </button>
                                    </div>
                                </div>
                                {/* <h5 className="m-4">
                                    Project: {displayProjectName} <br />
                                    Reporting Period: {displayReportingDate}
                                </h5> */}
                                <div style={{ width: '100%' }}>

                                    <div style={{ width: "100%" }}>
                                        <DataTable
                                            columns={columns}
                                            data={filteredRows}
                                            defaultSortField="id"
                                            pagination={false}
                                            customStyles={{
                                                table: { width: "100%", borderCollapse: "collapse" },
                                                headRow: {
                                                    style: { backgroundColor: "#f8f9fa" },
                                                },
                                                headCells: {
                                                    style: {
                                                        fontWeight: 600,
                                                        textAlign: "left",
                                                        paddingLeft: "16px",
                                                        paddingRight: "16px",
                                                        borderBottom: "2px solid #d1d1d1",
                                                    },
                                                },
                                                cells: {
                                                    style: {
                                                        padding: "12px 16px",
                                                        textAlign: "left",
                                                        borderBottom: "1px solid #d1d1d1",
                                                    },
                                                },
                                            }}
                                        />
                                    </div>

                                </div>
                                <div className='m-4' style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    {rows.every((row) => row.status === 'Completed') && (
                                        <button className="btn btn-outline-primary" style={{ display: 'none' }}>
                                            Download All Outputs as ZIP
                                        </button>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <button className="btn btn-reset" onClick={resetAllProcesses} style={{ marginLeft: "5px" }}>
                                            Reset All Processes
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {allCompleted && (
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                                <button className="btn btn3" onClick={handleDownloadAll} style={{ marginLeft: "5px" }}>
                                                    Download All
                                                </button>
                                                {/* <button className="btn btn-outline-4" onClick={ }> */}

                                                <button className="btn btn4" style={{ marginLeft: "5px", color: "white" }} onClick={handleFinish}>
                                                    Close Project
                                                </button>
                                                {/* </button> */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

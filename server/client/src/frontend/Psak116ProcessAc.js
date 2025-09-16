import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { CheckCircle, InfoCircle, CaretRightFill, CaretDownFill, Download, XCircle, InfoCircleFill, CheckCircleFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import './MainPage.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Papa from 'papaparse';
import './MainPage.css';
import JSZip from 'jszip'
import { Button } from 'react-bootstrap';

export default function Psak116ProcessAc() {
  const location = useLocation();
  const { projectNameRow, reportingDateRow, status } = location.state || {}

  const [rows, setRows] = useState([
    { id: 0, process: 'Load Data', status: 'Not Started', error: '', fileNames: [] },
    { id: 1, process: 'Data Transfer Checking', status: 'Not Started', progress: 0 },
    { id: 2, process: 'Data Quality Checking', status: 'Not Started', progress: 0, fileNames: [] },
    { id: 3, process: 'Generate PSAK116 Forecast', status: 'Not Started', progress: 0, error: '', isDropdown: true, isSubprocess: false, fileNames: [] },
    // { id: 3.1, process: 'Indicators Assessment', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: ["indicator_file.csv"] },
    // { id: 3.2, process: 'Undiscounted Expected Cashflow Calculation', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: ["undiscounted_ecf.csv"] },
    { id: 3.1, process: 'Generating Full PSAK 116 Forecast', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: ["full_forecast.csv"] },
    { id: 3.2, process: 'Generating Current Forecast per Asset Class', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: ["result_asset_level_12_31_2024.csv"] },
    { id: 3.3, process: 'Generating PSAK 116 Journal', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: ["jurnal_psak116_12_31_2024.csv"] },
    // { id: 3.2, process: 'Initial Measurement of Right of Use Asset', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: ["IM_RoUA.csv"] },
  ]);


  const handleDownload = (fileNames) => {
    fileNames.forEach((fileName) => {
      const fileUrl = `/files/PSAK116/process/${fileName}`; // Path to the file in the public folder
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
    console.log(location.state);
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.isDropdown) {
          const subprocesses = prevRows.filter(
            (sub) => Math.floor(sub.id) === row.id && sub.isSubprocess
          );

          if (subprocesses.length > 0) {
            const totalProgress = subprocesses.reduce((sum, sub) => sum + (sub.progress || 0), 0);
            const averageProgress = totalProgress / subprocesses.length;

            const isAnyInProgress = subprocesses.some((sub) => sub.progress > 0 && sub.progress < 100);
            const isAllCompleted = subprocesses.every((sub) => sub.status === 'Completed');

            return {
              ...row,
              progress: averageProgress || 0,
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
  const [rejectedRows, setRejectedRows] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentRejectedRow, setCurrentRejectedRow] = useState(null);

  const handleApprove = async (row) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to approve ${row.process}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmResult.isConfirmed) {
      setApprovedRows((prev) => ({ ...prev, [row.id]: true }));
    }
  };

  const handleReject = (row) => {
    setShowRejectModal(true);
    setCurrentRejectedRow(row);
    setRejectReason(row.rejectionComment || ""); // Fill textarea with existing comment
  };


  const confirmReject = () => {
    if (currentRejectedRow) {
      setRejectedRows((prev) => ({
        ...prev,
        [currentRejectedRow.id]: true,
      }));
      setRejectionReasons((prev) => ({
        ...prev,
        [currentRejectedRow.id]: rejectReason || "",
      }));
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === currentRejectedRow.id ? { ...row, rejectionComment: rejectReason || "" } : row
        )
      );
      setShowRejectModal(false);
      setRejectReason("");
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
      cell: (row, index) => {
        const previousRow = rows[index - 1]; // Get the previous row
        const previousRowApproved = previousRow ? approvedRows[previousRow.id] : true;
        const previousRowCompleted = previousRow ? previousRow.status === "Completed" || status === "Completed" : true;
        const previousRowHasApproval = previousRow ? !previousRow.isSubprocess && previousRow.id !== 0 && previousRow.id !== 3 : false;

        // Allow execution if:
        // - The previous row is approved (if it has an approval button)
        // - OR the previous row is already completed AND it has no approval button
        const isPreviousRowApprovedOrCompleted = previousRowApproved || (!previousRowHasApproval && previousRowCompleted);

        // Ensure that both row.status and the externally passed status are checked
        const isCompleted = row.status === "Completed" || status === "Completed";

        if (row.isDropdown) {
          const subprocesses = rows.filter(
            (sub) => Math.floor(sub.id) === row.id && sub.isSubprocess
          );

          if (isCompleted) {
            return <CheckCircle style={{ color: '#22326e', fontSize: '20px', marginLeft: "5px" }} />;
          }

          const allSubprocessesCompleted = subprocesses.every((sub) => sub.status === "Completed" || status === "Completed");

          if (allSubprocessesCompleted) {
            return <Download style={{ color: '#22326e', fontSize: '20px' }} />;
          } else {
            return (
              <button
                className={loading === row.id || !isPreviousRowApprovedOrCompleted ? "btn btn-secondary" : "btn btn-primary execute"}
                onClick={() => handleExecute(row)}
                disabled={loading === row.id || !isPreviousRowApprovedOrCompleted}
              >
                {loading === row.id ? 'Executing...' : 'Execute'}
              </button>
            );
          }
        }


        if (row.isSubprocess) {
          if (isCompleted) {
            if (!row.fileNames || (Array.isArray(row.fileNames) && row.fileNames.length === 0)) {
              return <CheckCircle style={{ color: '#22326e', fontSize: '20px', marginLeft: "5px" }} />;
            }
            return (
              <button className="mr-2 btn-outline-4" onClick={() => handleDownload(row.fileNames)}>
                <Download style={{ color: '#22326e', fontSize: '20px' }} />
              </button>
            );
          }
          return null;
        }


        return isCompleted ? (
          (row.id === 1) ? (
            <button
              onClick={handleDownloadModelDataTransfer}
              className="mr-2 btn-outline-4"
              disabled={!isCompleted}
            >
              <Download style={{ color: '#22326e', fontSize: '20px' }} />
            </button>
          ) : row.id === 2 ? (
            <button
              onClick={handleDownloadModelDataQuality}
              className="mr-2 btn-outline-4"
              disabled={!isCompleted}
            >
              <Download style={{ color: '#22326e', fontSize: '20px' }} />
            </button>)
            : (
              <CheckCircle style={{ color: '#22326e', fontSize: '20px', marginLeft: "5px" }} />
            )
        ) : (
          <button
            className={loading === row.id || !isPreviousRowApprovedOrCompleted ? "btn btn-secondary" : "btn btn-primary execute"}
            onClick={() => handleExecute(row)}
            disabled={loading === row.id || !isPreviousRowApprovedOrCompleted}
          >
            {loading === row.id ? 'Executing...' : 'Execute'}
          </button>
        );
      },
    },
    {
      name: "Approval",
      cell: (row) => {
        if (row.isSubprocess || status === 'Completed' || row.id === 0) return null;

        const isApproved = approvedRows[row.id];
        const isRejected = rejectedRows[row.id];

        if (isApproved) {
          return (
            <span style={{ color: '#22326e' }}>
              <CheckCircleFill style={{ marginRight: '5px', fontSize: '20px' }} />
              Approved
            </span>
          );
        }

        if (isRejected) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => {
                setCurrentRejectedRow(row);
                setRejectReason(row.rejectionComment || rejectionReasons[row.id] || ""); // Fill with rejectionComment or reason
                setShowRejectModal(true);
              }}>
              <span style={{ color: '#AB0D82' }}>
                <InfoCircleFill style={{ marginRight: '5px', fontSize: '20px', cursor: 'pointer' }}
                />
                Rejected
              </span>
              <span style={{ color: 'grey', fontSize: '10px', marginLeft: '5px' }}>
                click for remarks
              </span>
            </div>
          );
        }

        return row.status === "Completed" && row.id ? (
          <>
            <button
              className="btn btn4"
              onClick={() => handleApprove(row)}
              disabled={isApproved || isRejected}
            >
              Approve
            </button>
            <button
              className="btn btn-reset"
              onClick={() => handleReject(row)}
              disabled={isRejected || isApproved}
              style={{ marginLeft: "10px" }}
            >
              Reject
            </button>
          </>
        ) : (
          <span style={{ color: 'grey', fontStyle: 'italic' }}>Pending</span>
        );
      },
    }
  ];

  const filesList = [
    'psak116_datatransfer.csv'
  ];

  const handleDownloadModelDataTransfer = () => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesList.forEach((fileName) => {
      const fileUrl = `/files/PSAK116/reports_psak116/${fileName}`;

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
                link.download = 'Data Transfer Checking PSAK116.zip';
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


  const filesListQuality = [
    'lease_data_dataquality.csv',
    'payment_dataquality.csv'
  ];

  const handleDownloadModelDataQuality = () => {

    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesListQuality.forEach((fileName) => {
      console.log('masukk handleDownloadModelDataQuality', filesProcessed);
      const fileUrl = `/files/PSAK116/reports_psak116/${fileName}`;

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
          if (filesProcessed === filesListQuality.length) {
            zip.generateAsync({ type: 'blob' })
              .then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'Data Quality Checking PSAK116.zip';
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


  const filteredRows = rows.filter((row) => {
    if (row.isSubprocess) {
      return showSubprocesses[Math.floor(row.id)] === true;
    }
    return true;
  });


  const filesListResult = [
    'result_asset_level_12_31_2024.csv',
    'jurnal_psak116_12_31_2024.csv',
  ];


  const handleDownloadResult = () => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesListResult.forEach((fileName) => {
      const fileUrl = `/files/PSAK116/results/${fileName}`;

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
          if (filesProcessed === filesListResult.length) {
            zip.generateAsync({ type: 'blob' })
              .then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'PSAK 116 Result.zip';
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

  const intervalRefs = useRef({});

  const executionTimeMapping = {
    "Rate Calculation": 4 * 1000,
    "Final ECL Calculation": 8 * 1000,
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
        // Handle parent process (only update status, not progress)
        const subprocesses = rows.filter(
          (sub) => Math.floor(sub.id) === row.id && sub.isSubprocess
        );

        if (subprocesses.length > 0) {
          for (const subprocess of subprocesses) {
            await executeSubprocess(subprocess.id, subprocess.process);
          }
        }

        // Mark parent process as completed without progress change
        setRows((prevRows) =>
          prevRows.map((r) =>
            r.id === row.id ? { ...r, status: "Completed", progress: 0 } : r
          )
        );
      } else {
        // Handle single process (non-parent)
        await executeSubprocess(row.id, row.process);
      }

      setLoading(null);
      // Swal.fire('Executed!', `${row.process} has been executed successfully.`, 'success');
    }
  };

  const executeSubprocess = async (subprocessId, processName) => {
    return new Promise((resolve) => {
      const executionTime = executionTimeMapping[processName] || 2500; // Default: 5s
      const intervalSteps = 20;
      const intervalDuration = executionTime / intervalSteps;

      let progress = 0;
      const interval = setInterval(() => {
        progress += 100 / intervalSteps;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          delete intervalRefs.current[subprocessId]; // Remove from refs
          resolve(); // Mark subprocess as completed
        }
        updateProgress(subprocessId, progress);
      }, intervalDuration);

      intervalRefs.current[subprocessId] = interval; // Store interval ID
    });
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
        Object.values(intervalRefs.current).forEach(clearInterval);
        intervalRefs.current = {};

        setRows((prevRows) =>
          prevRows.map((row) => ({
            ...row,
            status: 'Not Started',
            progress: 0,
            rejectionComment: '',
          }))
        );

        setApprovedRows({});
        setRejectedRows({});
        setRejectionReasons({});
        setRejectReason('');
        setCurrentRejectedRow(null);
        setShowRejectModal(false);
        setLoading(null);

        Swal.fire('Reset!', 'All processes have been reset.', 'success');
      }
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
                    <h2 className="m-4">PSAK 116 Projects</h2>
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
                      <Button
                        // variant={row.status !== 'Completed' ? 'secondary' : 'primary'}
                        onClick={handleDownloadResult}
                        className="mr-2 btn-outline-4"
                        style={{ marginRight: '5px' }}
                      // disabled={row.status !== 'Completed'}
                      >
                        Download Result
                      </Button>

                    )}
                  </div>
                  <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Rejection Reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <label>Rejection Reason</label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter the reason for rejection..."
                        disabled={rejectedRows[currentRejectedRow?.id]}
                        style={{ width: "100%", height: "100px", padding: "10px" }}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                        {rejectedRows[currentRejectedRow?.id] ? 'Close' : 'Cancel'}
                      </Button>
                      {!rejectedRows[currentRejectedRow?.id] && (
                        <Button variant="danger" onClick={confirmReject} disabled={!rejectReason}>
                          Reject
                        </Button>
                      )}
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

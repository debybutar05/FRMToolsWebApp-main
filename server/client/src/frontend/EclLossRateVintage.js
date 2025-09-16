import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { CheckCircle, InfoCircle, CaretRightFill, CaretDownFill, Download, XCircle, InfoCircleFill, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import './MainPage.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import './MainPage.css';
import JSZip from 'jszip';
import Modal from 'react-bootstrap/Modal';
import { Button, Tooltip } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export default function EclLossRateVintage() {
  const location = useLocation(); // Use this to get the passed data
  const { projectNameRow, reportingDateRow, status } = location.state || {}

  const [rows, setRows] = useState([
    { id: 0, process: 'Load Data', status: 'Not Started', error: '' },
    { id: 1, process: 'Data Transfer Checking', status: 'Not Started', progress: 0, rejectionComment: "" },
    { id: 2, process: 'Data Quality Checking', status: 'Not Started', progress: 0, rejectionComment: "" },
    // { id: 2, process: 'Generate Data Validation Result', status: 'Not Started', error: '' },
    { id: 3, process: 'Calculate ECL', status: 'Not Started', progress: 0, error: '', isDropdown: true, isSubprocess: false, rejectionComment: "" },
    { id: 3.1, process: 'Rate Calculation', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: [], rejectionComment: "" },
    { id: 3.2, process: 'Final ECL Calculation', status: 'Not Started', progress: 0, isSubprocess: true, fileNames: ["receivables_12_31_2024.csv","journal_receivables_12_31_2024.csv"], rejectionComment: "" },
    // { id: 4, process: 'Generate ECL Calculation Result', status: 'Not Started', error: '' },
  ]);


  const handleDownload = (fileNames) => {
    fileNames.forEach((fileName) => {
      const fileUrl = `/files/vintage/results/calculator/${fileName}`; // Path to the file in the public folder
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
  const [allApproved, setAllApproved] = useState({});
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
        console.log("trace 1", row, approvedRows)
        if (row.id === 3 && isApproved) {
          setAllApproved(true)
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
                <XCircleFill style={{ marginRight: '5px', fontSize: '20px', cursor: 'pointer' }}
                />
                Rejected
                <InfoCircle style={{ marginLeft: '5px', cursor: 'pointer' }} data-toggle="tooltip" data-placement="Click for reason" title="Tooltip on top" />
              </span>
              {/* <Tooltip style={{ color: 'grey', fontSize: '10px', marginLeft: '5px' }} placement='click for reason' /> */}
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
    'vintage_calc_datatransfer.csv'
  ];

  const handleDownloadModelDataTransfer = () => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesList.forEach((fileName) => {
      const fileUrl = `/files/vintage/reports_vintage/calculator/${fileName}`;

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
                link.download = 'Data Transfer Checking Receivables Calculator.zip';
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
    'receivables_calc_dataquality.csv',
  ];

  const handleDownloadModelDataQuality = () => {

    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesListQuality.forEach((fileName) => {
      // console.log('masukk handleDownloadModelDataQuality', filesProcessed);
      const fileUrl = `/files/vintage/reports_vintage/calculator/${fileName}`;

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
                link.download = 'Data Quality Checking Receivables Calculator.zip';
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
  const navigateReport = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
                    <h2 className="m-4">Non-Investment ECL - Receivables Portfolio</h2>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-outline-primary" onClick={showConfirmation} style={{ height: '40px' }}>
                      {`<`} Back
                    </button>
                    {(allApproved && allCompleted) && (
                      <button className="btn btn-primary" style={{ height: '40px', marginLeft: '5px' }}
                        onClick={() => navigateReport('/Report-NonInvestment')}
                      >
                        View Report
                      </button>

                    )}
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
                      pagination={true}
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
                  {/* 
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {allCompleted && (
                      <button className="btn btn-outline-primary"
                      onClick={()=> navigateReport('/Report')}
                      >
                          View Report
                      </button>

                    )}
                  </div> */}
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
  );
}


// import React, { useState, PropTypes, Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import DataTable from 'react-data-table-component';
// import { CheckCircle, Download, EyeFill, InfoCircle } from 'react-bootstrap-icons';
// import Swal from 'sweetalert2';
// import './MainPage.css';
// import Papa from 'papaparse';
// import DatePicker from "react-datepicker";

// import "react-datepicker/dist/react-datepicker.css";

// export default function ECLInvestment() {
//   const [rows, setRows] = useState([
//     { id: 0, process: 'Load Data', status: 'Not Started', error: '' },
//     { id: 1, process: 'Data Validation', status: 'Not Started', error: '' },
//     { id: 2, process: 'Generate Data Validation Result', status: 'Not Started', error: '' },
//     { id: 3, process: 'Calculate ECL', status: 'Not Started', error: '' },
//     { id: 4, process: 'Generate ECL Calculation Result', status: 'Not Started', error: '' },
//   ]);

//   const [loading, setLoading] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState([]);
//   const [startDate, setStartDate] = useState(new Date());

//   const handleExecute = async (row) => {
//     const confirmResult = await Swal.fire({
//       title: 'Are you sure?',
//       text: `Do you really want to execute ${row.process}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, execute it!',
//       cancelButtonText: 'No, cancel!',
//     });

//     if (confirmResult.isConfirmed) {
//       setLoading(row.id);

//       setTimeout(() => {
//         const updatedRows = rows.map((r) => {
//           if (r.id === row.id) {
//             return {
//               ...r,
//               status: 'Completed',
//               error: 'No Error',
//             };
//           }
//           return r;
//         });

//         setRows(updatedRows);
//         setLoading(null);
//         Swal.fire('Executed!', `${row.process} has been executed successfully.`, 'success');
//       }, 1500); // Simulates a delay for execution
//     }
//   };


//   const resetAllProcesses = () => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'Do you want to reset all processes?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, reset it!',
//       cancelButtonText: 'No, cancel!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const resetRows = rows.map((row) => ({
//           ...row,
//           status: 'Not Started',
//           error: '',
//         }));
//         setRows(resetRows);
//         Swal.fire('Reset!', 'All processes have been reset.', 'success');
//       }
//     });
//   };

//   const openModal = async (processId) => {
//     try {
//       const csvUrl =
//         processId === 2
//           ? '/files/validation-result.csv'
//           : '/files/ecl-calculation-result.csv';

//       const response = await fetch(csvUrl);
//       const csvText = await response.text();

//       Papa.parse(csvText, {
//         header: true,
//         skipEmptyLines: true,
//         complete: (result) => {
//           const parsedData = result.data;
//           setModalData(parsedData); // Update modal data with parsed CSV rows
//           setShowModal(true);

//           // Check if the "remarks" column exists and has non-empty values
//           if (processId === 2) {
//             const hasRemarks = parsedData.some((row) => row.remarks && row.remarks.trim() !== '');
//             setRows((prevRows) =>
//               prevRows.map((r) =>
//                 r.process === 'Generate Data Validation Result'
//                   ? {
//                     ...r,
//                     status: hasRemarks ? 'Completed with remarks' : 'Completed',
//                   }
//                   : r
//               )
//             );
//           }
//         },
//       });
//     } catch (error) {
//       console.error('Error loading CSV:', error);
//       Swal.fire('Error', 'Failed to load the CSV file.', 'error');
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setModalData([]);
//   };

//   const handleDownloadCSV = (row) => {
//     const csvUrl =
//       row.process === 'Generate Data Validation Result'
//         ? '/files/validation-result.csv'
//         : '/files/ecl-calculation-result.csv';

//     fetch(csvUrl)
//       .then((response) => response.text())
//       .then((csvText) => {
//         const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = `${row.process.replace(/\s+/g, '_')}_result.csv`;
//         link.click();
//       })
//       .catch((error) => {
//         console.error('Error downloading CSV:', error);
//         Swal.fire('Error', 'Failed to download the CSV file.', 'error');
//       });
//   };

//   const columns = [
//     {
//       name: 'Process',
//       selector: (row) => (
//         <span>
//           {row.process}
//         </span>
//       ),
//     },
//     {
//       name: 'Status',
//       cell: (row) => row.status,
//     },
//     {
//       name: 'Actions',
//       cell: (row) => {
//         const isPreviousRowCompleted =
//           row.id === 0 || // First row doesn't depend on any previous row
//           rows[row.id - 1]?.status === 'Completed' ||
//           rows[row.id - 1]?.status === 'Completed with remarks';

//         return row.status.toLowerCase().includes('completed') ? (
//           <>
//             <CheckCircle style={{ color: '#22326e', fontSize: '20px', marginRight: '10px' }} />
//             {(row.process === 'Generate Data Validation Result' || row.process === 'Generate ECL Calculation Result') && (
//               <>
//                 <a
//                   title="View detailed data"
//                   onClick={() => openModal(row.id)}
//                 >
//                   <EyeFill style={{ color: '#22326e', fontSize: '20px', marginRight: '10px' }} />
//                 </a>

//                 <a
//                   title="Download CSV"
//                   onClick={() => handleDownloadCSV(row)}
//                 >
//                   <Download style={{ color: '#22326e', fontSize: '20px', marginRight: '10px' }} />
//                 </a>
//               </>
//             )}
//           </>
//         ) : (
//           <button
//             className="btn btn-primary"
//             onClick={() => handleExecute(row)}
//             disabled={loading === row.id || !isPreviousRowCompleted}
//           >
//             {loading === row.id ? 'Executing...' : 'Execute'}
//           </button>
//         );
//       },
//     },
//   ];

//   const handleFileClick = () => {
//     document.getElementById('file').click(); // Programmatically trigger the file input
//   };

//   return (
//     <div>
//       <div className="d-flex">
//         {/* Main content */}
//         <div className="flex-grow-1 pt-3 pl-1">
//           <div style={{ display: "flex", justifyContent: "center", width: "100%", minHeight: "100vh", backgroundColor: "#fbfbfb" }}>
//             <div className="card flex" style={{ width: "100%", minHeight: "90%", alignSelf: "start", alignItems: "center", zIndex: "999" }}>
//               <div className="card-body col-12 d-flex flex-column" style={{ justifyContent: "flex-start", height: 'auto' }}>
//                 <div className="d-flex justify-content-start align-items-center p-4">
//                   <h2 className="m-0">ECL Calculation Investment</h2>
//                   <div style={{ paddingLeft: "20px" }}>
//                     <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
//                   </div>
//                 </div>

//                 <div style={{ width: '100%' }}>
//                   {/* <DataTable columns={columns} data={rows} pagination={false} /> */}

//                   <div className="data-table">
//                     <DataTable
//                       columns={columns}
//                       data={rows}
//                       pagination={false}
//                       customStyles={{
//                         table: {
//                           width: '100%', /* Make sure the table takes up full width of the container */
//                           borderCollapse: 'collapse' /* Ensure no gaps between table cells */
//                         },
//                         headRow: {
//                           style: {
//                             backgroundColor: '#f8f9fa', /* Light background for the header */
//                           }
//                         },
//                         headCells: {
//                           style: {
//                             fontWeight: 600,
//                             textAlign: 'left',
//                             paddingLeft: '16px',
//                             paddingRight: '16px',
//                             borderBottom: '2px solid #d1d1d1', /* Grey bottom border */
//                           }
//                         },
//                         cells: {
//                           style: {
//                             padding: '12px 16px',
//                             textAlign: 'left',
//                             borderBottom: '1px solid #d1d1d1', /* Grey bottom border */
//                           }
//                         }
//                       }}
//                     />
//                   </div>

//                 </div>
//                 <div className='m-4' style={{ display: 'flex', justifyContent: 'start', marginTop: '20px' }}>
//                   {rows.every((row) => row.status === 'Completed') && (
//                     <button className="btn btn-outline-primary" style={{ display: 'none' }}>
//                       Download All Outputs as ZIP
//                     </button>
//                   )}
//                   <button className="btn btn-warning" onClick={resetAllProcesses}>
//                     Reset All Processes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Modal for CSV Data */}
//           {showModal && (
//             <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//               <div className="modal-dialog modal-xl" style={{ maxWidth: '90%', maxHeight: '90%' }}>
//                 <div className="modal-content">
//                   <div className="modal-header">
//                     <h5 className="modal-title">Data Result</h5>
//                     <button className="btn-close" onClick={closeModal}></button>
//                   </div>
//                   <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//                     <table className="table table-bordered table-hover">
//                       <thead className="table-light">
//                         <tr>
//                           {Object.keys(modalData[0] || {}).map((header) => (
//                             <th
//                               key={header}
//                               style={{
//                                 textAlign: header === 'AmountOri' || header === 'InterestRate' || header === 'CurrencyRate' ? 'right' : 'left',
//                                 whiteSpace: 'nowrap',
//                               }}
//                             >
//                               {header}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {modalData.map((row, index) => (
//                           <tr key={index}>
//                             {Object.entries(row).map(([key, value], i) => (
//                               <td
//                                 key={i}
//                                 style={{
//                                   textAlign: key === 'AmountOri' || key === 'InterestRate' || key === 'CurrencyRate' ? 'right' : 'left',
//                                   whiteSpace: 'nowrap',
//                                 }}
//                               >
//                                 {value}
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="modal-footer">
//                     <button className="btn btn-secondary" onClick={closeModal}>
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }




















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import DataTable from 'react-data-table-component';
// import { CheckCircle, InfoCircle, Download } from 'react-bootstrap-icons';
// import Swal from 'sweetalert2';
// import './MainPage.css';
// import logo from './images/kpmg-logo-white.png';
// import { Button } from 'bootstrap';
// // import DatePicker from 'react-date-picker';

// export default function MainPage() {
//   const [integrationStatus, setIntegrationStatus] = useState([]);
//   const [loading, setLoading] = useState(null);
//   const [refreshInterval, setRefreshInterval] = useState(null);
//   const [integrationReport, setIntegrationReport] = useState();
//   // const [value, onChange] = useState < Value > (new Date());

//   const [rows, setRows] = useState([
//     // { id: 0, process: "Proceed Import", status: "Not Started" },
//     // { id: 1, process: "Input Validation", status: "Not Started", error: "" },
//     // { id: 2, process: "Parameter Validation", status: "Not Started", error: "" },
//     // { id: 3, process: "Proceed Other", status: "Not Started"},
//     // { id: 4, process: "Calculate and Export Provision ECL", status: "Not Started"},
//     // { id: 5, process: "Calculate and Export LGD", status: "Not Started"},
//     // { id: 6, process: "Calculate Discount Factor", status: "Not Started"},
//     // { id: 7, process: "Calculate and Export CCF", status: "Not Started"},
//     // { id: 8, process: "Calculate and Export Stage", status: "Not Started"},
//     // { id: 9, process: "PD Calculation", status: "Not Started" },
//     // { id: 10, process: "ECL Calculation", status: "Not Started" },
//     { id: 0, process: "Load Data", status: "Not Started" },
//     { id: 1, process: "Data Validation", status: "Not Started", error: "" },
//     { id: 2, process: "View Data Validation Result", status: "Not Started", error: "" },
//     // { id: 3, process: "Proceed Other", status: "Not Started"},
//     { id: 9, process: "Calculate ECL", status: "Not Started" },
//     { id: 10, process: "Generate ECL Calculation Result", status: "Not Started" },
//   ]);


//   const fetchStatus = async (retryCount = 3) => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/integration-status');
//       const result = response.data;
//       setIntegrationStatus(result);

//       const updatedRows = rows.map(row => {
//         const jsonEntry = result.functions.find(func => {
//           switch (func.function_name) {
//             case "proceed_import":
//               return row.process === "Proceed Import";
//             case "proceed_input_validation":
//               return row.process === "Input Validation";
//             case "proceed_parameter_validation":
//               return row.process === "Parameter Validation";
//             case "proceed_other":
//               return row.process === "Proceed Other";
//             case "proceed_pd":
//               return row.process === "PD Calculation";
//             case "proceed_ecl":
//               return row.process === "ECL Calculation";
//             default:
//               return false;
//           }
//         });

//         if (jsonEntry) {
//           if ((row.id === 1 || row.id === 2) && jsonEntry.status === "Completed" && jsonEntry.error !== 'no error') {
//             return {
//               ...row,
//               status: `Completed`,
//               error: jsonEntry.error
//             };
//           } else {
//             return {
//               ...row,
//               status: jsonEntry.status.replace(/(^|\s)\S/g, l => l.toUpperCase()),
//               error: jsonEntry.error,
//               output_path: jsonEntry.output_path || [] // Make sure output paths are included
//             };
//           }
//         } else {
//           return row;
//         }
//       });

//       const subProcessStatus = updatedRows[3].output_path
//       updatedRows.forEach((row, index) => {
//         // Check if the index is in the range 4 to 8 and output_path has a corresponding entry
//         if (index >= 4 && index <= 8 && index - 4 < subProcessStatus.length) {
//           row.status = subProcessStatus[index - 4].substatus; // Adjust index for output_path
//         }
//       });


//       setRows(updatedRows);
//       setIntegrationReport(rows);

//       const allCompleted = updatedRows.every(row => row.status === "Completed");
//       if (allCompleted && refreshInterval) {
//         clearInterval(refreshInterval);
//         setRefreshInterval(null);
//         console.log("All processes are completed. Stopping auto-refresh.");
//       }
//     } catch (error) {
//       console.error("Error fetching status:", error);
//       if (retryCount > 0) {
//         console.log(`Retrying... attempts left: ${retryCount - 1}`);
//         setTimeout(() => fetchStatus(retryCount - 1), 1000);
//       }
//     }
//   };


//   useEffect(() => {
//     fetchStatus();
//     const intervalId = setInterval(fetchStatus, 5000); // Poll every 5 seconds
//     setRefreshInterval(intervalId);

//     // Clean up the interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   const handleExecute = async (row) => {
//     const confirmResult = await Swal.fire({
//       title: 'Are you sure?',
//       text: `Do you really want to execute ${row.process}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, execute it!',
//       cancelButtonText: 'No, cancel!',
//     });

//     if (confirmResult.isConfirmed) {
//       setLoading(row.id);
//       try {
//         await axios.post(`http://localhost:5000/execute/${row.process.replace(/\s+/g, '').toLowerCase()}`);
//       } catch (error) {
//         console.error(`Error executing ${row.process}:`, error);
//         Swal.fire('Error!', `There was an error executing ${row.process}: ${error.message}`, 'error');
//       } finally {
//         setLoading(null);
//         fetchStatus();
//       }
//     }
//   };

//   const resetAllProcesses = async () => {
//     const confirmResult = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'Do you really want to reset all processes?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, reset it!',
//       cancelButtonText: 'No, cancel!',
//     });

//     if (confirmResult.isConfirmed) {
//       try {
//         const response = await axios.get('http://localhost:5000/api/proceed-reset');
//         console.log('Reset successful:', response.data);
//         fetchStatus(); // Refresh status after reset
//         Swal.fire('Reset!', 'All processes have been reset.', 'success');
//       } catch (error) {
//         console.error('Error resetting process:', error);
//         Swal.fire('Error!', 'Could not reset processes.', 'error');
//       }
//     }
//   };

//   const downloadAllOutputs = async () => {
//     const confirmResult = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'Do you want to download all outputs?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, download it!',
//       cancelButtonText: 'No, cancel!',
//     });

//     if (confirmResult.isConfirmed) {
//       try {
//         const response = await axios.get('http://localhost:5000/api/download-outputs', {
//           responseType: 'blob',
//         });
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'outputs.zip');
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//       } catch (error) {
//         console.error("Error downloading files:", error);
//         Swal.fire('Error!', 'Could not download outputs.', 'error');
//       }
//     }
//   };

//   const handleDownload = async (row) => {
//     if (row.output_path && row.status === "Completed") {
//       try {
//         const response = await axios.get('http://localhost:5000/api/download-process-output', {
//           responseType: 'blob'
//         });

//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', `${row.process}_outputs.zip`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//       } catch (error) {
//         console.error("Error downloading files:", error);
//         Swal.fire('Error!', `Could not download files for ${row.process}.`, 'error');
//       }
//     } else {
//       Swal.fire('Error!', 'No files available for download.', 'error');
//     }
//   };


//   const columns = [
//     {
//       name: 'Process',
//       selector: (row) => (
//         <span>
//           {row.process}
//           {row.process === "Proceed Other" && (
//             <span data-toggle="tooltip" title={"Step to calculate CCF, Staging, LGD and Discount Factor"} className="ms-2">
//               <InfoCircle />
//             </span>
//           )}
//         </span>
//       )
//     },
//     {
//       name: 'Status',
//       cell: (row, index) => (
//         (row.id === 1 || row.id === 2) && row.status === "Completed" && row.error !== "no error"
//           ? (
//             `${row.status} with invalid data: ${row.error}`
//             // ) : row.id > 3 && row.id < 9 ? (
//             //   <div>{row.output_path}</div>
//           ) : (
//             row.status
//           )
//       )
//       // row.status + row.error
//     },
//     {
//       name: 'Actions',
//       cell: (row, index) => (
//         // row.status === "Completed" ? (
//         //   <CheckCircle style={{ color: "#22326e", fontSize: "20px" }} />
//         // )

//         row.status.toLowerCase() === "completed" && row.output_path && row.output_path.length > 0 ? (
//           <div>
//             {/* {JSON.stringify(row.output_path)} */}
//             <CheckCircle style={{ color: "#22326e", fontSize: "20px", marginRight: "20px" }} />
//             {/* <Download
//               style={{ color: "#22326e", fontSize: "20px", cursor: "pointer" }}
//               onClick={() => handleDownload(row)}
//             /> */}
//           </div>
//         ) : row.id > 3 && row.id < 9 ? (
//           <div></div>
//         ) :
//           row.status === "Completed" && row.id === 0 ? (
//             <CheckCircle style={{ color: "#22326e", fontSize: "20px" }} />
//           )
//             : (
//               <button
//                 className="btn btn-primary"
//                 onClick={() => handleExecute(row)}
//                 // data-bs-toggle="modal" data-bs-target="#exampleModal"
//                 disabled={
//                   loading === row.id ||
//                   (index > 0 && rows[index - 1].status !== "Completed") ||
//                   ((row.id === 2 || row.id === 3) && rows[index - 1].status === "Completed" && rows[index - 1].error !== "no error") ||
//                   row.status === "Completed"
//                 }
//               >
//                 {loading === row.id ? (
//                   <div className="loading-dots">Executing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>
//                 ) : 'Execute'}
//               </button>
//             )
//       ),
//     }
//   ];

//   // // Modal Function
//   // var myModal = document.getElementById('myModal')
//   // var myInput = document.getElementById('myInput')

//   // myModal.addEventListener('shown.bs.modal', function () {
//   //   myInput.focus()
//   // })

//   return (
//     <div>

//       {/* Modal */}
//       {/* <!-- Button trigger modal --> */}
//       <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
//         Launch demo modal
//       </button>

//       {/* <!-- Modal --> */}
//       <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//         <div class="modal-dialog">
//           <div class="modal-content">
//             <div class="modal-header">
//               <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
//               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div class="modal-body">
//               ...
//             </div>
//             <div class="modal-footer">
//               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//               <button type="button" class="btn btn-primary">Save changes</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div style={{ display: "flex", justifyContent: "center", width: "100%", height: "100vh", backgroundColor: "#fbfbfb" }}>
//         <div className="card flex" style={{ width: "100%", height: "90%", alignSelf: "center", alignItems: "center" }}>
//           <div className="card-body col-12 d-flex flex-column align-items-center" style={{ justifyContent: "center" }}>
//             <h2 className="mb-4 d-flex align-items-center">
//               ECL Calculation
//             </h2>

//             {/* <DatePicker onChange={onChange} value={value} /> */}

//             {/* <div>{JSON.stringify(integrationReport)}</div> */}

//             <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
//               <div style={{ width: "90%" }}>
//                 <DataTable columns={columns} data={rows} pagination={false} />
//               </div>
//             </div>
//             <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
//               {rows.every(row => row.status === "Completed") && (
//                 <button className="btn btn-outline-primary" onClick={downloadAllOutputs} style={{ marginRight: "10px" }}>
//                   Download All Outputs as ZIP
//                 </button>
//               )}
//               <button className="btn btn-warning" onClick={resetAllProcesses}>
//                 Reset All Processes
//               </button>
//             </div>


//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

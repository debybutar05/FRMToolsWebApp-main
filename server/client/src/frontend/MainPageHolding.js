import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { CheckCircle, InfoCircle, BoxArrowLeft } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import './MainPage.css';
import logo from './images/kpmg-logo-white.png';
import { Button } from 'bootstrap';
import ChartSubsidiary from './chart/barChartSubsidiary';
// import ChartWithDropdown from './chart/barChartHolding2 1';
// import ChartWithDropdown from './chart/barChart';
// import ChartWithDropdownHolding from './chart/barChartHolding';
import ChartWithDropdownHolding2 from './chart/barChartHolding2';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import MonitoringProgress from './chart/MonitoringProgress';
// import ChartWithDropdownHolding2 from './chart/barChartHolding2';

export default function MainPageHolding() {
  const [integrationStatus, setIntegrationStatus] = useState([]);
  const [loading, setLoading] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [integrationReport, setIntegrationReport] = useState();

  const [rows, setRows] = useState([
    { id: 0, process: "Proceed Import", status: "Not Started" },
    { id: 1, process: "Input Validation", status: "Not Started", error: "" },
    { id: 2, process: "Parameter Validation", status: "Not Started", error: "" },
    { id: 3, process: "Proceed Other", status: "Not Started" },
    // { id: 4, process: "Calculate and Export Provision ECL", status: "Not Started" },
    // { id: 5, process: "Calculate and Export LGD", status: "Not Started" },
    // { id: 6, process: "Calculate Discount Factor", status: "Not Started" },
    // { id: 7, process: "Calculate and Export CCF", status: "Not Started" },
    // { id: 8, process: "Calculate and Export Stage", status: "Not Started" },
    { id: 9, process: "PD Calculation", status: "Not Started" },
    { id: 10, process: "ECL Calculation", status: "Not Started" },
  ]);


  const fetchStatus = async (retryCount = 3) => {
    try {
      const response = await axios.get('http://localhost:5000/api/integration-status');
      const result = response.data;
      setIntegrationStatus(result);

      const updatedRows = rows.map(row => {
        const jsonEntry = result.functions.find(func => {
          switch (func.function_name) {
            case "proceed_import":
              return row.process === "Proceed Import";
            case "proceed_input_validation":
              return row.process === "Input Validation";
            case "proceed_parameter_validation":
              return row.process === "Parameter Validation";
            case "proceed_other":
              return row.process === "Proceed Other";
            case "proceed_pd":
              return row.process === "PD Calculation";
            case "proceed_ecl":
              return row.process === "ECL Calculation";
            default:
              return false;
          }
        });

        if (jsonEntry) {
          if ((row.id === 1 || row.id === 2) && jsonEntry.status === "Completed" && jsonEntry.error !== 'no error') {
            return {
              ...row,
              status: `Completed`,
              error: jsonEntry.error
            };
          } else {
            return {
              ...row,
              status: jsonEntry.status.replace(/(^|\s)\S/g, l => l.toUpperCase()),
              error: jsonEntry.error,
              output_path: jsonEntry.output_path || [] // Make sure output paths are included
            };
          }
        } else {
          return row;
        }
      });

      const subProcessStatus = updatedRows[3].output_path
      updatedRows.forEach((row, index) => {
        // Check if the index is in the range 4 to 8 and output_path has a corresponding entry
        if (index >= 4 && index <= 8 && index - 4 < subProcessStatus.length) {
          row.status = subProcessStatus[index - 4].substatus; // Adjust index for output_path
        }
      });


      setRows(updatedRows);
      setIntegrationReport(rows);

      const allCompleted = updatedRows.every(row => row.status === "Completed");
      if (allCompleted && refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
        console.log("All processes are completed. Stopping auto-refresh.");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
      if (retryCount > 0) {
        console.log(`Retrying... attempts left: ${retryCount - 1}`);
        setTimeout(() => fetchStatus(retryCount - 1), 1000);
      }
    }
  };


  useEffect(() => {
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    setRefreshInterval(intervalId);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
      try {
        await axios.post(`http://localhost:5000/execute/${row.process.replace(/\s+/g, '').toLowerCase()}`);
      } catch (error) {
        console.error(`Error executing ${row.process}:`, error);
        Swal.fire('Error!', `There was an error executing ${row.process}: ${error.message}`, 'error');
      } finally {
        setLoading(null);
        fetchStatus();
      }
    }
  };

  const resetAllProcesses = async () => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to reset all processes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.get('http://localhost:5000/api/proceed-reset');
        console.log('Reset successful:', response.data);
        fetchStatus(); // Refresh status after reset
        Swal.fire('Reset!', 'All processes have been reset.', 'success');
      } catch (error) {
        console.error('Error resetting process:', error);
        Swal.fire('Error!', 'Could not reset processes.', 'error');
      }
    }
  };

  const downloadAllOutputs = async () => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to download all outputs?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, download it!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.get('http://localhost:5000/api/download-outputs', {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'outputs.zip');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading files:", error);
        Swal.fire('Error!', 'Could not download outputs.', 'error');
      }
    }
  };

  const handleDownload = async (row) => {
    if (row.output_path && row.status === "Completed") {
      try {
        const response = await axios.get('http://localhost:5000/api/download-process-output', {
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${row.process}_outputs.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading files:", error);
        Swal.fire('Error!', `Could not download files for ${row.process}.`, 'error');
      }
    } else {
      Swal.fire('Error!', 'No files available for download.', 'error');
    }
  };


  const columns = [
    {
      name: 'Process',
      selector: (row) => (
        <span>
          {row.process}
          {row.process === "Proceed Other" && (
            <span data-toggle="tooltip" title={"Step to calculate CCF, Staging, LGD and Discount Factor"} className="ms-2">
              <InfoCircle />
            </span>
          )}
        </span>
      )
    },
    {
      name: 'Status',
      cell: (row, index) => (
        (row.id === 1 || row.id === 2) && row.status === "Completed" && row.error !== "no error"
          ? (
            `${row.status} with invalid data: ${row.error}`
            // ) : row.id > 3 && row.id < 9 ? (
            //   <div>{row.output_path}</div>
          ) : (
            row.status
          )
      )
      // row.status + row.error
    },
    {
      name: 'Actions',
      cell: (row, index) => (
        // row.status === "Completed" ? (
        //   <CheckCircle style={{ color: "#22326e", fontSize: "20px" }} />
        // ) 

        row.status.toLowerCase() === "completed" && row.output_path && row.output_path.length > 0 ? (
          <div>
            {/* {JSON.stringify(row.output_path)} */}
            <CheckCircle style={{ color: "#22326e", fontSize: "20px", marginRight: "20px" }} />
            {/* <Download
              style={{ color: "#22326e", fontSize: "20px", cursor: "pointer" }}
              onClick={() => handleDownload(row)}
            /> */}
          </div>
        ) : row.id > 3 && row.id < 9 ? (
          <div></div>
        ) :
          row.status === "Completed" && row.id === 0 ? (
            <CheckCircle style={{ color: "#22326e", fontSize: "20px" }} />
          )
            : (
              <button
                className="btn btn-primary"
                onClick={() => handleExecute(row)}
                disabled={
                  loading === row.id ||
                  (index > 0 && rows[index - 1].status !== "Completed") ||
                  ((row.id === 2 || row.id === 3) && rows[index - 1].status === "Completed" && rows[index - 1].error !== "no error") ||
                  row.status === "Completed"
                }
              >
                {loading === row.id ? (
                  <div className="loading-dots">Executing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>
                ) : 'Execute'}
              </button>
            )
      ),
    }
  ];

  const [key, setKey] = useState('chart1');


  return (
    <div>
      <div className="d-flex">
        {/* Main content */}
        <div className="flex-grow-1 pt-3 pl-1">
          <div style={{ display: "flex", justifyContent: "center", width: "100%", minHeight: "100vh", backgroundColor: "#fbfbfb" }}>
            <div className="card flex" style={{ width: "100%", minHeight: "90%", alignSelf: "start", alignItems: "center", zIndex: "999" }}>
              <div className="card-body col-12 p-4" style={{ justifyContent: "flex-start", alignItems: "start", height: 'auto' }}>
                <h2 className="d-flex align-items-center">
                  Dashboard
                </h2>
                {/* <ChartWithDropdownAc/> */}

                {/* <ChartSubsidiary acName='All' /> */}

                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k || 'chart1')} // Ensure key is never null
                  className="mb-3"
                >
                  <Tab eventKey="chart1" title="Total ECL">
                    {key === "chart1" &&
                      <div>
                        <ChartWithDropdownHolding2 />
                      </div>
                    }
                  </Tab>
                  <Tab eventKey="chart2" title="Stand Alone ECL">
                    {key === "chart2" &&
                      <ChartSubsidiary acName='All' />
                    }
                  </Tab>
                  <Tab eventKey="chart3" title="Calculation Monitoring">
                    {key === "chart3" &&
                      <div>
                        <MonitoringProgress />
                      </div>
                    }
                  </Tab>
                </Tabs>
                {/* <ChartWithDropdownHolding2 /> */}
                {/* <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab eventKey="chart1" title="Chart 1">
                    <ChartWithDropdownAc />
                  </Tab>
                  <Tab eventKey="chart2" title="Chart 2">
                    <ChartWithDropdownHolding />
                  </Tab>
                </Tabs> */}

                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <div style={{ width: "90%" }}>
                    {/* <DataTable columns={columns} data={rows} pagination={false} /> */}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  {rows.every(row => row.status === "Completed") && (
                    <button className="btn btn-outline-primary" onClick={downloadAllOutputs} style={{ marginRight: "10px" }}>
                      Download All Outputs as ZIP
                    </button>
                  )}
                  {/* <button className="btn btn-warning" onClick={resetAllProcesses}>
                Reset All Processes
              </button> */}
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Pencil, Trash, HouseFill, Download, Eye, EnvelopeAt } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import Papa from 'papaparse';
import './MainPage.css';
import JSZip from 'jszip';
import excelLogo from './images/logo_excel.png';
import { Link } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';

export default function PSAK116Module() {

const companyOptions = [
  { value: 'BAHANA – TCW Investment Management', label: 'BAHANA – TCW Investment Management' },
  { value: 'BAHANA – Sekuritas', label: 'BAHANA – Sekuritas' },
  { value: 'GRAHANIAGA TATAUTAMA', label: 'GRAHANIAGA TATAUTAMA' },
];


  const filesList = [
    'jurnal_psak116_12_31_2024.csv',
    'result_asset_level_12_31_2024.csv'
  ];

  const [projects, setProjects] = useState([
    { id: 1, projectName: 'PSAK116_INVEST_Jan25', name: 'Investment Subsidiary', status: 'Completed', progress: 0, reportingDate: "1/31/2025"},
    { id: 2, projectName: 'PSAK116_SGI_Jan25', name: 'SafeGuard Insurance', status: 'Completed', progress: 0, reportingDate: "1/31/2025"},
  ]);

  const [csvModalData, setCsvModalData] = useState({
    show: false,
    csvContent: [],
  });
  const handleViewCSV = () => {
    let csvFileName = key === "Journal" ? "jurnal_psak116_12_31_2024.csv" : 
     "result_asset_level_12_31_2024.csv";
    const fileUrl = `/files/PSAK116/results/${csvFileName}`;

    fetch(fileUrl)
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setCsvModalData({
              show: true,
              csvContent: result.data,
            });
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV file:", error);
        alert("Could not load the CSV file.");
      });
  };


  // Function to close the CSV modal
  const closeCsvModal = () => {
    setCsvModalData({ ...csvModalData, show: false });
  };

  const columns = [
    {

      name: 'Project Name',
      selector: (project) => (<Link
        to={{
          pathname: project.status === 'Completed' ? "/result-summary-psak116" : "/psak116-process", // Conditional path
          state: project.status !== 'Completed' ? { projectName: project.projectName, name: project.name, reportingDate: project.reportingDate } : {},
        }}
        style={{
          textDecoration: 'underline',
          color: project.status === 'Completed' ? 'blue' : 'grey',
          cursor: project.status === 'Completed' ? 'pointer' : 'none',
          fontWeight: 'bold',
        }}
      >
        {project.projectName}
      </Link>

      ),
    },
    {
      name: 'Company Name',
      selector: (project) => project.name,
    },
    {
      name: 'Reporting Date',
      selector: (project) => new Date(project.reportingDate).toLocaleDateString(),
    },
    {
      name: 'Status',
      selector: (project) => project.status,
    },
    {
      name: 'Actions',
      cell: (project) => (
        <div className="d-flex">
          <Button
            variant={project.status !== 'Completed' ? 'secondary' : 'primary'}
            onClick={() => handleDownloadResult(project.projectName)}
            className="mr-2 btn-outline-4"
            style={{ marginRight: '5px' }}
            disabled={project.status !== 'Completed'}
          >
            <Download />
          </Button>
          <Button
            variant={project.status !== "Completed" ? "secondary" : "primary"}
            onClick={handleViewCSV}
            className="mr-2 btn-outline-4"
            disabled={project.status !== "Completed"}
          >
            <Eye />
          </Button>
          <Button
            variant={project.status !== 'Completed' ? 'primary' : 'primary'}
            // onClick={} // Trigger the modal to view CSV
            className="mr-2 btn-outline-4"
          // disabled={project.status !== 'Completed'}
          >
            <EnvelopeAt />
          </Button>

        </div>
      ),
    },
  ];


  const [key, setKey] = useState('Journal');

  const handleDownloadResult = (projectName) => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesList.forEach((fileName) => {
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
          if (filesProcessed === filesList.length) {
            zip.generateAsync({ type: 'blob' })
              .then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `${projectName}.zip`;
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

  return (
    <div>
      <div className="d-flex">
        <div className="flex-grow-1 pt-3 pl-1">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              minHeight: '100vh',
              backgroundColor: '#fbfbfb',
            }}
          >
            <div
              className="card flex"
              style={{
                width: '100%',
                alignSelf: 'start',
                alignItems: 'center',
                zIndex: '999',
              }}
            >
              <div
                className="card-body col-12 d-flex flex-column"
                style={{ justifyContent: 'flex-start' }}
              >
                <div className="d-flex justify-content-between align-items-center p-4">
                  <h2 className="m-0">PSAK 116 List of Projects</h2>
                </div>

                <div style={{ width: '100%' }}>
                  <DataTable
                    columns={columns}
                    data={projects}
                    pagination={true}
                    customStyles={{
                      table: { width: '100%', borderCollapse: 'collapse' },
                      headRow: {
                        style: { backgroundColor: '#f8f9fa' },
                      },
                      headCells: {
                        style: {
                          fontWeight: 600,
                          textAlign: 'left',
                          paddingLeft: '16px',
                          paddingRight: '16px',
                          borderBottom: '2px solid #d1d1d1',
                        },
                      },
                      cells: {
                        style: {
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #d1d1d1',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSV View Modal */}<Modal show={csvModalData.show} onHide={closeCsvModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>PSAK 116 Calculation Result</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => {
              setKey(k || "Journal");
              handleViewCSV();
            }}
            className="mb-3"
          >
            <Tab eventKey="Journal" title="Journal">
              {key === "Journal" &&
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      {csvModalData.csvContent[0] &&
                        Object.keys(csvModalData.csvContent[0]).map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvModalData.csvContent.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            </Tab>
            <Tab eventKey="Result" title="Result">
              {key === "Result" &&
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      {csvModalData.csvContent[0] &&
                        Object.keys(csvModalData.csvContent[0]).map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvModalData.csvContent.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCsvModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

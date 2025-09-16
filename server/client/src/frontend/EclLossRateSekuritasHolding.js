import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Pencil, Trash, HouseFill, Download, Eye } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import Papa from 'papaparse';
import './MainPage.css';
import JSZip from 'jszip';
import excelLogo from './images/logo_excel.png';
import { Link } from 'react-router-dom';

export default function EclLossRateSekuritasHolding() {
  const types = [
    { value: 'Securities', label: 'Securities' },
  ];

const companyOptions = [
  { value: 'BAHANA – TCW Investment Management', label: 'BAHANA – TCW Investment Management' },
  { value: 'BAHANA – Sekuritas', label: 'BAHANA – Sekuritas' },
  { value: 'GRAHANIAGA TATAUTAMA', label: 'GRAHANIAGA TATAUTAMA' },
];


  const filesList = [
    'lrs_result_changed.csv',
    'lrs_result.csv',
  ];

  const [projects, setProjects] = useState([
    // { id: 1, projectName: 'Project 001', name: 'ASKRINDO - Insurance', status: 'In Progress', progress: 0, reportingDate: "1/31/2025", type: types[0] },
    { id: 1, projectName: 'Project 002', name: 'GRAHANIAGA TATAUTAMA', status: 'Completed', progress: 0, reportingDate: "1/31/2025", type: types[0] },
    { id: 2, projectName: 'Project 003', name: 'BAHANA - Sekuritas', status: 'Completed', progress: 0, reportingDate: "10/31/2024", type: types[0] },
  ]);
  const [csvModalData, setCsvModalData] = useState({
    show: false,
    csvContent: [],
  });

  // Function to open CSV data in a React-Bootstrap Modal
  const handleViewCSV = (csvFileName) => {
    const fileUrl = `/files/securities/results/calculator/${csvFileName}`; // Make sure the file path is correct

    fetch(fileUrl)
      .then((response) => response.text()) // Fetch the file as text
      .then((csvData) => {
        // Parse CSV data using PapaParse
        Papa.parse(csvData, {
          header: true, // Assuming the CSV has headers
          skipEmptyLines: true,
          complete: (result) => {
            setCsvModalData({
              show: true,
              csvContent: result.data, // Save the parsed data in the state
            });
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching CSV file:', error);
        alert('Could not load the CSV file.');
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
          pathname: project.status === 'Completed' ? "/Report-NonInvestment" : "/ecl-calculation-loss-rate-vintage", // Conditional path
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
      name: 'Type',
      selector: (project) => (project.type ? project.type.label : 'N/A'),
    },
    {
      name: 'Actions',
      cell: (project) => (
        <div className="d-flex">
          <Button
            variant={project.status !== 'Completed' ? 'secondary' : 'primary'}
            onClick={handleDownloadModel}
            className="mr-2 btn-outline-4"
            style={{ marginRight: '5px' }}
            disabled={project.status !== 'Completed'}
          >
            <Download />
          </Button>
          <Button
            variant={project.status !== 'Completed' ? 'secondary' : 'primary'}
            onClick={() => handleViewCSV('lrs_result_changed.csv')} // Trigger the modal to view CSV
            className="mr-2 btn-outline-4"
            disabled={project.status !== 'Completed'}
          >
            <Eye />
          </Button>
        </div>
      ),
    },
  ];

  const handleDownloadModel = () => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesList.forEach((fileName) => {
      const fileUrl = `/files/securities/results/calculator/${fileName}`;

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
                link.download = 'EClLossRateSecurities.zip';
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
                  <h2 className="m-0">ECL Securities Asset</h2>
                </div>

                <div style={{ width: '100%' }}>
                  <DataTable
                    columns={columns}
                    data={projects}
                    pagination={false}
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
          <Modal.Title>CSV Data View: ECL Securities Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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

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

export default function EclLossRateVintageHolding() {
  const types = [
    { value: 'Receivables Portfolio', label: 'Receivables Portfolio' },
    { value: 'Securities Asset', label: 'Securities Asset' },
  ];

  const companyOptions = [
    { value: 'BAHANA – TCW Investment Management', label: 'BAHANA – TCW Investment Management' },
    { value: 'BAHANA – Sekuritas', label: 'BAHANA – Sekuritas' },
    { value: 'GRAHANIAGA TATAUTAMA', label: 'GRAHANIAGA TATAUTAMA' },
  ];


  // const filesList = [
  //   'lrv_ecl_changed.csv',
  //   'lrv_ecl_result.csv',
  // ];

  const [projects, setProjects] = useState([
    { id: 1, projectName: 'ECL_NonInvest_INVEST_Jan25', name: 'Investment Subsidiary', status: 'In Progress', progress: 0, reportingDate: "1/31/2025", type: types[0] },
    { id: 2, projectName: 'ECL_NonInvest_BahanaSekuritas_Dec24', name: 'Beta Securities', status: 'Completed', progress: 0, reportingDate: "12/31/2024", type: types[1] },
    { id: 3, projectName: 'ECL_NonInvest_INVEST_Dec24', name: 'SafeGuard Insurance', status: 'Completed', progress: 0, reportingDate: "12/31/2024", type: types[0] },
  ]);

  const [csvModalData, setCsvModalData] = useState({
    show: false,
    csvContent: [],
  });

  const handleViewCSV = (csvFileName, type) => {
    console.log('csv: ', csvFileName);

    const fileUrl = `/files/${type}/results/calculator/${csvFileName}`;
    console.log('fileURL: ', fileUrl);


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
            variant={project.status !== 'Completed' ? 'primary-outline' : 'primary'}
            onClick={() => {
              project.type.value === types[0].value ? handleDownloadModel(project.projectName, 'vintage') :
                handleDownloadModel(project.projectName,'securities')
            }
            }
            className="mr-2 btn-outline-4"
            style={{ marginRight: '5px' }}
            disabled={project.status !== 'Completed'}
          >
            <Download />
          </Button>
          <Button
            variant={project.status !== 'Completed' ? 'primary-outline' : 'primary'}
            onClick={() => {
              project.type.value === types[0].value ? handleViewCSV('receivables_12_31_2024.csv', 'vintage') :
                handleViewCSV('securities_12_31_2024.csv', 'securities')
            }}
            className="mr-2 btn-outline-4"
            disabled={project.status !== 'Completed'}
          >
            <Eye />
          </Button>
          <Button
            variant={project.status !== 'Completed' ? 'primary' : 'primary'}
            // onClick={() => handleViewCSV('vasicek_final_ecl_changed.csv')} // Trigger the modal to view CSV
            className="mr-2 btn-outline-4"
          // disabled={project.status !== 'Completed'}
          >
            <EnvelopeAt />
          </Button>
        </div >
      ),
    },
  ];

  const handleDownloadModel = (projectName, type) => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    var filesList = type === 'vintage' ? [
      'receivables_12_31_2024.csv',
      'journal_receivables_12_31_2024.csv',
    ] : [
      'securities_12_31_2024.csv',
      'journal_securities_12_31_2024.csv'
    ]

    filesList.forEach((fileName) => {
      const fileUrl = `/files/${type}/results/calculator/${fileName}`;
      console.log('fileURLDownload: ', fileUrl);

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
                  <h2 className="m-0">Non-Investment ECL</h2>
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
          <Modal.Title>CSV Data View: Non-Investment ECL</Modal.Title>
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

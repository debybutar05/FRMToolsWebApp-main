import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Pencil, Trash, HouseFill, Download, Eye, Mailbox, MapFill, Envelope, EnvelopeAtFill, EnvelopeAt } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import Papa from 'papaparse';
import './MainPage.css';
import JSZip from 'jszip';
import excelLogo from './images/logo_excel.png';
import { Link } from 'react-router-dom';

export default function EclInvestmentHolding() {

  const [modalData, setModalData] = useState({
    show: false,
    isEdit: false,
    project: null,
    projectName: '',
    reportingDate: new Date(),
    projectType: null,
  });

  const [fileModalData, setFileModalData] = useState({
    show: false,
    selectedFiles: [],
  });
  
  
  const openModal = (isEdit, project = null) => {
    setModalData({
      show: true,
      isEdit,
      project,
      projectName: isEdit ? project.name : '',
      reportingDate: isEdit ? new Date(project.reportingDate) : new Date(),
      projectType: isEdit ? project.type : null,
    });
  };

  
      useEffect(() => {
        if (!modalData.isEdit) {
    
          const date = new Date(modalData.reportingDate);
          const month = date.toLocaleString('en-US', { month: 'short' });
          const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    
          const formattedDate = `${month}${year}`;
    
          const newProjectName = `ECL_Invest_${formattedDate}`;
          setModalData((prevData) => ({
            ...prevData,
            projectName: newProjectName,
          }));
        }
      }, [modalData.reportingDate]);
    
  const closeModal = () => {
    setModalData({ ...modalData, show: false });
  };

  const closeFileModal = () => {
    setFileModalData({ ...fileModalData, show: false });
  };

  const handleSave = () => {
    const { isEdit, project, projectName, reportingDate, projectType } = modalData;

    if (!projectName || !reportingDate || !projectType) {
      alert('All fields are required!');
      return;
    }

    if (isEdit) {
      setProjects2((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, name: projectName, reportingDate, type: projectType }
            : p
        )
      );
    } else {
      const newProject = {
        id: projects2.length + 1,
        name: projectName,
        status: 'In Progress',
        progress: 0,
        reportingDate,
        type: projectType,
      };
      setProjects2((prevProjects) => [...prevProjects, newProject]);
    }

    // openFileModal();
    closeModal();
    closeFileModal();
  };

  const handleRemove = (project) => {
    // if (project.status !== 'In Progress') {
    // alert('Only In Progress projects can be removed.');
    //   return;
    // }
    setProjects2((prevProjects) => prevProjects.filter((p) => p.id !== project.id));
  };
  const types2 = [
    { value: 'Investment Portfolio', label: 'Investment Portfolio' },
    // { value: 'Receivables Portfolio', label: 'Receivables Portfolio' },
    // { value: 'Securities Asset', label: 'Securities Asset' },
  ];

  const [projects2, setProjects2] = useState([
    { id: 1, name: 'ECL_Central Holdings_Jan25', status: 'In Progress', progress: 0, reportingDate: '1/31/2025', type: types2[0] },
    { id: 2, name: 'ECL_Central Holdings_Dec24', status: 'Completed', progress: 0, reportingDate: '12/31/2024', type: types2[0] },
  ]);


  const columns2 = [
    {
      name: 'Project Name',
      sortable: true,
      selector: (project) => (
        project.status === 'Completed' ?
          // <button className="btn btn-outline-4">
          <Link
            to={'/Report-Investment'}
            style={{ textDecoration: 'underline bold', color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {project.name}
          </Link>
          :
          <Link
            to={'/ecl-calculation-investment'}
            style={{ textDecoration: 'underline bold', color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {project.name}
          </Link>
      ),
    },
    {
      name: 'Reporting Date',
      sortable: true,
      selector: (project) => new Date(project.reportingDate).toLocaleDateString(),
    },
    {
      name: 'Status',
      sortable: true,
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
            variant={project.status !== 'Completed' ? "primary" : "primary-outline"}
            onClick={() => openModal(true, project)}
            className="mr-2 btn-outline-4"
            style={{ marginRight: "5px" }}
            disabled={project.status === 'Completed'}
          >
            <Pencil />
          </Button>
          <Button
            variant={project.status !== 'Completed' ? 'primary-outlinef' : 'primary'}
            onClick={() => handleViewCSV('investment_12_31_2024.csv')} // Trigger the modal to view CSV
            className="mr-2 btn-outline-4"
            disabled={project.status !== 'Completed'}
          >
            <Eye />
          </Button>
          <Button
            variant={project.status !== 'Completed' ? "danger" : "danger-outline"}
            onClick={() => handleRemove(project)}
            className="mr-2 btn-outline-4"
            disabled={project.status === 'Completed'}>
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  const types = [
    { value: 'Investment Portfolio', label: 'Investment Portfolio' },
  ];

  const companyOptions = [
    { value: 'BAHANA – TCW Investment Management', label: 'BAHANA – TCW Investment Management' },
    { value: 'BAHANA – Sekuritas', label: 'BAHANA – Sekuritas' },
    { value: 'GRAHANIAGA TATAUTAMA', label: 'GRAHANIAGA TATAUTAMA' },
  ];


  const filesList = [
    'investment_12_31_2024.csv',
    'journal_vasicek_12_31_2024.csv',
  ];

  const [projects, setProjects] = useState([
    { id: 0, projectName: 'ECL_Invest_TRUST_Jan25', name: 'TRUST', status: 'In Progress', progress: 0, reportingDate: "1/31/2025", type: types[0] },
    { id: 1, projectName: 'ECL_Invest_INVEST_Dec24', name: 'Investment Subsidiary', status: 'Completed', progress: 0, reportingDate: "12/31/2024", type: types[0] },
    // { id: 3, projectName: 'Project 003', name: 'JASA RAHARJA', status: 'Completed', progress: 0, reportingDate: "10/31/2024", type: types[0] },
  ]);
  const [csvModalData, setCsvModalData] = useState({
    show: false,
    csvContent: [],
  });

  // Function to open CSV data in a React-Bootstrap Modal
  const handleViewCSV = (csvFileName) => {
    const fileUrl = `/files/vasicek/results/calculator/${csvFileName}`; // Make sure the file path is correct

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
      sortable: true,
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
      sortable: true,
      selector: (project) => project.name,
    },
    {
      name: 'Reporting Date',
      sortable: true,
      selector: (project) => new Date(project.reportingDate).toLocaleDateString(),
    },
    {
      name: 'Status',
      sortable: true,
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
            onClick={() => { handleDownloadModel(project.projectName) }}
            className="mr-2 btn-outline-4"
            style={{ marginRight: '5px' }}
            disabled={project.status !== 'Completed'}
          >
            <Download />
          </Button>
          <Button
            variant={project.status !== 'Completed' ? 'primary-outlinef' : 'primary'}
            onClick={() => handleViewCSV('investment_12_31_2024.csv')} // Trigger the modal to view CSV
            className="mr-2 btn-outline-4"
            disabled={project.status !== 'Completed'}
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

  const handleDownloadModel = (projectName) => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesList.forEach((fileName) => {
      const fileUrl = `/files/vasicek/results/calculator/${fileName}`;

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
                {/* Holding */}
                <div className="d-flex justify-content-between align-items-center p-4">
                  <h2 className="m-0">Holding Company Investment ECL</h2>
                  <Button
                    className="btn btn-primary"
                    onClick={() => openModal(false)}
                    style={{ backgroundColor: '#00338D', color: 'white', border: 'None' }}
                  >
                    Add New Project
                  </Button>
                </div>

                <div style={{ width: '100%' }}>
                  <div style={{ width: '100%' }}>
                    <DataTable
                      columns={columns2}
                      data={projects2}
                      pagination={true}
                      defaultSortFieldId={1}
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

                {/* AC */}
                <div className="d-flex justify-content-between align-items-center" style={{ height: '20px' }}>
                </div>
                <div className="d-flex justify-content-between align-items-center p-4">
                  <h2 className="m-0">Affiliated Company Investment ECL</h2>
                </div>

                <div style={{ width: '100%' }}>
                  <DataTable
                    columns={columns}
                    data={projects}
                    pagination={true}
                    defaultSortFieldId={1}
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

      {/* Project Modal */}
      <Modal show={modalData.show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData.isEdit ? 'Edit Project' : 'Add New Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Reporting Date</label>
              <input
                type="date"
                className="form-control"
                value={modalData.reportingDate.toISOString().split('T')[0]}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    reportingDate: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Project Type</label>
              <Select
                value={modalData.projectType}
                onChange={(selectedOption) =>
                  setModalData({ ...modalData, projectType: selectedOption })
                }
                options={types}
                placeholder="Select Project Type"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button className="btn4" variant="primary" onClick={handleSave}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSV View Modal */}<Modal show={csvModalData.show} onHide={closeCsvModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>CSV Data View: ECL Investment Portfolio</Modal.Title>
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

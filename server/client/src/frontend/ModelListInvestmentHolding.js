import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Pencil, Trash, HouseFill, Eye } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import Swal from 'sweetalert2';
import './MainPage.css';
import excelLogo from './images/logo_excel.png';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import './MainPage.css';
import JSZip from 'jszip';

export default function ModelListInvestmentHolding() {
  const types = [
    { value: 'Investment Portfolio', label: 'Investment Portfolio' },
  ];

  const [modalData, setModalData] = useState({
    show: false,
    isEdit: false,
    project: null,
    projectName: null,
    companyName: null,
    reportingDate: new Date(),
    projectType: null,
  });

  const [fileModalData, setFileModalData] = useState({
    show: false,
    selectedFiles: [],
  });

  const companyOptions = [
    { value: 'Central Holdings', label: 'Central Holdings' },
    { value: 'Investment Subsidiary', label: 'Investment Subsidiary' },
    { value: 'Alpha Asset Management', label: 'Alpha Asset Management' },
    { value: 'Beta Securities', label: 'Beta Securities' },
    { value: 'Gamma Capital', label: 'Gamma Capital' },
    { value: 'SafeGuard Insurance', label: 'SafeGuard Insurance' },
    { value: 'SafeGuard Insurance Putera', label: 'SafeGuard Insurance Putera' },
    { value: 'National Reinsurance', label: 'National Reinsurance' },
    { value: 'TRUST', label: 'TRUST' },
    { value: 'SCOV', label: 'SCOV' },
    { value: 'Insurance Subsidiary', label: 'Insurance Subsidiary' },
    { value: 'HealthTrust', label: 'HealthTrust' },
    { value: 'SureGuarantee', label: 'SureGuarantee' },
  ];

  const companyLabel = [
    { value: 'Central Holdings', label: 'Central Holdings' },
    { value: 'Investment Subsidiary', label: 'INVEST' },
    { value: 'Alpha Asset Management', label: 'AAM' },
    { value: 'Beta Securities', label: 'BSEC' },
    { value: 'Gamma Capital', label: 'GCAP' },
    { value: 'SafeGuard Insurance', label: 'SGI' },
    { value: 'SafeGuard Insurance Putera', label: 'SGIP' },
    { value: 'National Reinsurance', label: 'NRE' },
    { value: 'TRUST', label: 'TRUST' },
    { value: 'SCOV', label: 'SCOV' },
    { value: 'Insurance Subsidiary', label: 'Central HoldingsL' },
    { value: 'HealthTrust', label: 'HealthTrust' },
    { value: 'SureGuarantee', label: 'SureGuarantee' },
  ];

  const [projects, setProjects] = useState([
    { id: 1, projectName: "Tariff_Invest_INVEST_Jan25", name: 'Investment Subsidiary', status: 'In Progress', progress: 0, reportingDate: '1/31/2025', type: types[0] },
    // { id: 2, projectName: "Tariff_Invest_SGI_Dec24", name: 'SafeGuard Insurance', status: 'Rejected', progress: 0, reportingDate: '12/31/2024', type: types[0] },
    { id: 2, projectName: "Tariff_Invest_BSEC_Dec24", name: 'Beta Securities', status: 'Completed', progress: 0, reportingDate: '12/31/2024', type: types[0] },
    // { id: 3, projectName: "Invest 3", name: 'JASA RAHARJA', status: 'Completed', progress: 0, reportingDate: new Date(), type: types[0] },
  ]);

  // const openModal = (isEdit, project = null) => {
  //   setModalData({
  //     show: true,
  //     isEdit,
  //     project,
  //     projectName: isEdit ? project.projectName : null,
  //     companyName: isEdit ? { value: project.name, label: project.name } : null,
  //     reportingDate: isEdit ? new Date(project.reportingDate) : new Date(),
  //     projectType: isEdit ? project.type : null,
  //   });
  // };

  const openModal = (isEdit, project = null) => {
    setModalData({
      show: true,
      isEdit,
      project,
      projectName: isEdit ? project.projectName : '',  // Start with an empty string for new projects
      companyName: isEdit ? { value: project.name, label: project.name } : null,
      reportingDate: isEdit ? new Date(project.reportingDate) : new Date(),
      projectType: isEdit ? project.type : null,
    });
  };

  useEffect(() => {
    if (!modalData.isEdit && modalData.companyName) {
      const companyAbbreviation = companyLabel.find(
        (option) => option.value === modalData.companyName.value
      )?.label || 'Default';

      const date = new Date(modalData.reportingDate);
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

      const formattedDate = `${month}${year}`;

      const newProjectName = `Tariff_Invest_${companyAbbreviation}_${formattedDate}`;
      setModalData((prevData) => ({
        ...prevData,
        projectName: newProjectName,
      }));
    }
  }, [modalData.companyName, modalData.reportingDate]);


  const closeModal = () => {
    setModalData({ ...modalData, show: false });
  };

  const openFileModal = () => {
    setFileModalData({
      ...fileModalData,
      show: true,
    });
  };

  const closeFileModal = () => {
    setFileModalData({ ...fileModalData, show: false });
  };

  const handleSave = () => {
    const { isEdit, project, projectName, companyName, reportingDate, projectType } = modalData;

    if (!projectName || !companyName || !reportingDate || !projectType) {
      alert('All fields are required!');
      return;
    }

    if (isEdit) {
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, projectName: projectName, name: companyName.value, reportingDate, type: projectType }
            : p
        )
      );
    } else {
      const newProject = {
        id: projects.length + 1,
        projectName,
        name: companyName.value,
        status: 'In Progress',
        progress: 0,
        reportingDate,
        type: projectType,
      };
      setProjects((prevProjects) => [...prevProjects, newProject]);
    }

    openFileModal();
    closeModal();

    closeFileModal();
  };

  const handleRemove = (project) => {
    // if (project.status !== 'In Progress') {
    //   alert('Only Initializing projects can be removed.');
    //   return;
    // }
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== project.id));
  };



  // Function to open CSV data in a React-Bootstrap Modal
  const handleViewCSV = (csvFileName) => {
    const fileUrl = `/files/vasicek/results/model/${csvFileName}`; // Make sure the file path is correct

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

  const filesList = [
    'lgd.csv',
    'weighted_cpd.csv',
  ];

  const handleDownloadModel = (project) => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    filesList.forEach((fileName) => {
      const fileUrl = `/files/vasicek/results/model/${fileName}`;

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
                link.download = `Tariff_Investment_${project.projectName}.zip`;
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


  const [csvModalData, setCsvModalData] = useState({
    show: false,
    csvContent: [],
  });

  // Function to close the CSV modal
  const closeCsvModal = () => {
    setCsvModalData({ ...csvModalData, show: false });
  };

  const columns = [
    {
      name: 'Project Name',
      selector: (project) => (
        project.status === 'Completed' ?
          <Link
            onClick={() => handleDownloadModel(project)}
            className="mr-2 btn-outline-4"
            disabled={project.status !== 'Completed'}
            style={{
              textDecoration: 'underline',
              color: 'blue',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >

            {project.projectName}
          </Link>
          :
          <Link
            to={{
              pathname: "/modeling-investment",
              state: project.status !== 'Completed' ? { projectName: project.projectName, reportingDate: project.reportingDate } : {},
            }}
            style={{
              textDecoration: 'underline',
              color: 'blue',
              cursor: 'pointer',
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
      name: 'Model Date',
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
            variant={project.status !== 'Completed' ? "primary" : "primary-outline"}
            onClick={() => openModal(true, project)}
            className="mr-2 btn-outline-4"
            style={{ marginRight: "5px" }}
            disabled={project.status === 'Completed'}
          >
            <Pencil />
          </Button>
          <Button
            variant={project.status !== 'Completed' ? "danger" : "danger-outline"}
            className='btn-outline-4'
            onClick={() => handleRemove(project)}
            disabled={project.status === 'Completed'}>
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  const handleFileSelect = (file) => {
    setFileModalData((prevData) => ({
      ...prevData,
      selectedFiles: prevData.selectedFiles.includes(file)
        ? prevData.selectedFiles.filter((selectedFile) => selectedFile !== file)
        : [...prevData.selectedFiles, file],
    }));
  };

  const handleFileSubmit = () => {
    alert('Files submitted: ' + fileModalData.selectedFiles.join(', '));

    Swal.fire({
      title: 'Success!',
      text: 'New model created and files have been submitted successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    });

    closeFileModal();
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
                  <h2 className="m-0">Investment Tariff</h2>
                  <Button
                    className="btn btn-primary"
                    onClick={() => openModal(false)}
                    style={{ backgroundColor: '#00338D', color: 'white', border: 'None' }}
                  >
                    Add New Tariff
                  </Button>
                </div>

                <div style={{ width: '100%' }}>
                  <DataTable
                    columns={columns}
                    data={projects}
                    pagination={true}
                    // className="data-table-wrapped"
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
            {modalData.isEdit ? 'Edit Tariff' : 'Add New Tariff'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {/* <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                className="form-control"
                value={modalData.projectName}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    projectName: e.target.value,
                  })}
              />
            </div> */}
            <div className="form-group">
              <label>Company Name</label>
              <Select
                value={modalData.companyName}
                onChange={(selectedOption) =>
                  setModalData({ ...modalData, companyName: selectedOption })
                }
                options={companyOptions}
                placeholder="Select Company"
              />
            </div>
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

      {/* File Upload Modal */}
      <Modal show={fileModalData.show} onHide={closeFileModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Files to Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="breadcrumb" style={{
            display: 'flex',
            alignItems: 'center',
            height: '30px',
            color: 'grey'
          }}>
            <HouseFill style={{ marginRight: "5px" }} />
            {'> ... > IFRS 9 > vasicek > inputs > model'}
          </div>
          <div className="file-list">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {filesList.map((file, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <img
                          src={excelLogo}
                          alt="Excel"
                          width="20"
                          height="20"
                          className="mr-2"
                        />
                        <span className='p-2'>
                          {file}
                        </span>
                      </div>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={fileModalData.selectedFiles.includes(file)}
                        onChange={() => handleFileSelect(file)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

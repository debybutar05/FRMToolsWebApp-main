import React, { useState } from 'react';
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

  const [projects, setProjects] = useState([
    { id: 0, projectName: "Regress_Jan2025", combination: "2", status: "Completed", progress: 0, reportingDate: new Date(2025, 0, 31) },
    { id: 1, projectName: "Regress_Dec2024", combination: "2", status: "Completed", progress: 0, reportingDate: new Date(2024, 11, 31) },
  ]);
  


  const [modalData, setModalData] = useState({
    show: false,
    isEdit: false,
    project: null,
    combination: "",
    reportingDate: new Date(), // Default to current date
  });
  const openModal = (isEdit, project = null) => {
    setModalData({
      show: true,
      isEdit,
      project,
      combination: isEdit ? project.combination : "",
      reportingDate: isEdit ? new Date(project.reportingDate) : new Date(),
    });
  };


  const closeModal = () => {
    setModalData((prev) => ({ ...prev, show: false }));
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date); // Convert string to Date object
    if (isNaN(d)) return date; // Return original if invalid date
    return d.toLocaleDateString("en-US"); // Format as "MM/DD/YYYY"
  };


  // Function to get "MMMYYYY" format (e.g., "Jan2025")
  const getProjectName = (date) => {
    if (!date) return "";
    const d = new Date(date); // Convert to Date object
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `Regress_${monthNames[d.getMonth()]}${d.getFullYear()}`;
  };

  const handleSave = () => {
    const { isEdit, project, combination, reportingDate } = modalData;

    if (!combination || !reportingDate) {
      alert("All fields are required!");
      return;
    }

    const parsedDate = new Date(reportingDate); // Ensure it's a Date object
    if (isNaN(parsedDate)) {
      alert("Invalid date format!");
      return;
    }

    const projectName = getProjectName(parsedDate); // Auto-generate project name

    if (isEdit) {
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, projectName, combination: combination.toString(), reportingDate: parsedDate }
            : p
        )
      );
    } else {
      const newProject = {
        id: projects.length ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
        projectName,
        combination: combination.toString(),
        status: "In Progress",
        progress: 0,
        reportingDate: parsedDate, // Store as a Date object
      };
      setProjects((prevProjects) => [...prevProjects, newProject]);
    }

    closeModal();
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

  const handleDownloadModel = () => {
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
                link.download = 'VasicekModelResults.zip';
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
        // project.status === 'Completed' ?
        //   <Link
        //     // variant={project.status !== 'Completed' ? 'secondary' : 'primary'}
        //     onClick={handleDownloadModel} // Trigger the modal to view CSV
        //     className="mr-2 btn-outline-4"
        //     disabled={project.status !== 'Completed'}
        //     style={{
        //       textDecoration: 'underline',
        //       color: 'blue',
        //       cursor: 'pointer',
        //       fontWeight: 'bold',
        //     }}
        //   >

        //     {project.projectName}
        //   </Link>
        //   :
        <Link
          to={{
            pathname: "/regression-process", // Conditional path
            state: project.status !== 'Completed' ? { projectName: project.projectName, reportingDate: project.reportingDate } : {}, // Only pass state if not completed
          }}
          state={{
            status: project.status
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
      name: 'Number of Combinations',
      selector: (project) => project.combination,
    },
    {
      name: 'Regression Date',
      selector: (project) => project.reportingDate.toLocaleDateString(),
    },
    {
      name: 'Status',
      selector: (project) => project.status,
    },
    // {
    //   name: 'Type',
    //   selector: (project) => (project.type ? project.type.label : 'N/A'),
    // },
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
                  <h2 className="m-0">Regression List</h2>
                  <Button
                    className="btn btn-primary"
                    onClick={() => openModal(false)}
                    style={{ backgroundColor: '#00338D', color: 'white', border: 'None' }}
                  >
                    Add New Regression
                  </Button>
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

      {/* Project Modal */}
      <Modal show={modalData.show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData.isEdit ? 'Edit Regression' : 'Add New Regression'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Number of Combination</label><input
                type="number"
                className="form-control"
                value={modalData.combination}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    combination: e.target.value,
                  })
                }
              />

            </div>
            <div className="form-group">
              <label>Regression Date</label>
              <input
                type="date"
                className="form-control"
                value={modalData.reportingDate ? modalData.reportingDate.toISOString().split('T')[0] : ""}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    reportingDate: new Date(e.target.value), // Convert string to Date
                  })
                }
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

    </div>
  );
}

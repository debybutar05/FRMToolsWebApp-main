import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Pencil, Trash, HouseFill, Download, EnvelopeAt } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import Swal from 'sweetalert2';
import './MainPage.css';
import JSZip from 'jszip';
import excelLogo from './images/logo_excel.png';

export default function ModelListInvestmentAc() {
  const types = [
    { value: 'Investment Portfolio', label: 'Investment Portfolio' },
    // { value: 'Modeling Loss Rate Sekuritas', label: 'Modeling Loss Rate Sekuritas' },
    // { value: 'Receivables Portfolio Tariff', label: 'Receivables Portfolio Tariff' },
  ];

  // const [projects, setProjects] = useState([]);



const companyOptions = [
  { value: 'BAHANA – TCW Investment Management', label: 'BAHANA – TCW Investment Management' },
  { value: 'BAHANA – Sekuritas', label: 'BAHANA – Sekuritas' },
  { value: 'GRAHANIAGA TATAUTAMA', label: 'GRAHANIAGA TATAUTAMA' },
];



  const filesList = [
    'lgd.csv',
    'weighted.csv',
  ];

  const [projects, setProjects] = useState([
    { id: 1, name: 'Investment Subsidiary', status: 'In Progress', progress: 0, reportingDate: "10/31/2024", type: types[0] },
    { id: 2, name: 'Investment Subsidiary', status: 'Completed', progress: 0, reportingDate: "9/30/2023", type: types[0] },
    { id: 3, name: 'Investment Subsidiary', status: 'Completed', progress: 0, reportingDate: "10/31/2022", type: types[0] },
  ]);

  const [modalData, setModalData] = useState({
    show: false,
    isEdit: false,
    project: null,
    companyName: null,
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
      companyName: isEdit ? { value: project.name, label: project.name } : null,
      reportingDate: isEdit ? new Date(project.reportingDate) : new Date(),
      projectType: isEdit ? project.type : null,
    });
  };

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
    const { isEdit, project, companyName, reportingDate, projectType } = modalData;

    if (!companyName || !reportingDate || !projectType) {
      alert('All fields are required!');
      return;
    }

    if (isEdit) {
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, name: companyName.value, reportingDate, type: projectType }
            : p
        )
      );
    } else {
      const newProject = {
        id: projects.length + 1,
        name: companyName.value,
        status: 'Draft',
        progress: 0,
        reportingDate,
        type: projectType,
      };
      setProjects((prevProjects) => [...prevProjects, newProject]);
    }

    // openFileModal();
    closeModal();
    closeFileModal();
  };

  const handleRemove = (project) => {
    if (project.status !== 'Draft') {
      alert('Only Draft projects can be removed.');
      return;
    }
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== project.id));
  };

  const columns = [
    // {
      // name: 'Company Name',
      // selector: (project) => project.name
      // (
      // <a
      //   href={getPagePath(project.type)}
      //   onClick={(e) => {
      //     e.preventDefault();
      //     window.location.href = getPagePath(project.type);
      //   }}
      //   style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}
      // >
      // </a>
      // ),
    // },
    // {
    //   name: 'Reporting Date',
    //   selector: (project) => project.reportingDate.toLocaleDateString(),
    // },
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
            variant={project.status !== 'Completed'? "primary" : "primary-outline"}
            onClick={handleDownloadModel}
            className="mr-2 btn-outline-4"
            style={{ marginRight: "5px" }}
            disabled={project.status === 'Completed'}
          >
            <Download />
          </Button>
          <Button
            variant={project.status !== 'Completed'? "primary" : "primary-outline"}
            // onClick={handleDownloadModel}
            className="mr-2 btn-outline-4"
            style={{ marginRight: "5px" }}
            disabled={project.status === 'Completed'}
          >
            <EnvelopeAt />
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
      confirmButtonText: 'OK'
    });

    closeFileModal();
  };

  const getPagePath = (type) => {
    switch (type.value) {
      case 'Modeling Investment':
        return '/modeling-investment';
      case 'Modeling Loss Rate Sekuritas':
        return '/modeling-loss-rate-sekuritas';
      case 'Receivables Portfolio Tariff':
        return '/modeling-loss-rate-vintage';
      default:
        return '/';
    }
  };

  const fileNames = [
    'lgd.csv',
    'weighted_cpd.csv',
  ];

  const handleDownloadModel = () => {
    const zip = new JSZip();

    // Fetch each file and add it to the zip
    let filesProcessed = 0;

    fileNames.forEach((fileName) => {
      const fileUrl = `/files/vasicek/results/model/${fileName}`; // Path to the file in the public folder

      fetch(fileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`File not found: ${fileUrl}`);
          }
          return response.blob(); // Convert the file to a blob
        })
        .then(blob => {
          zip.file(fileName, blob); // Add the file to the zip

          filesProcessed++;
          if (filesProcessed === fileNames.length) {
            // After all files are processed, generate the zip and trigger download
            zip.generateAsync({ type: 'blob' })
              .then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'models.zip'; // Set the zip file name
                link.click(); // Trigger the download
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
  }


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
                  {/* <Button
                    className="btn btn-primary"
                    onClick={() => openModal(false)}
                    style={{ backgroundColor: '#00338D', color: 'white', border: 'None' }}
                  >
                    Add New Company
                  </Button> */}
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
            {modalData.isEdit ? 'Edit Company' : 'Add New Company'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
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
        <Modal.Footer>
          <Button variant="secondary" onClick={closeFileModal}>
            Cancel
          </Button>
          <Button className="btn4" variant="primary" onClick={handleFileSubmit}>
            Submit Files
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './MainPage.css';
// import logo from './images/kpmg-logo-white.png';
// import { useNavigate } from 'react-router-dom';

// export default function ProjectList() {
//     const navigate = useNavigate();

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         navigate('/ecl-calculation');
//     };

//     return (
//         <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#fbfbfb" }}>
//             <div className="card p-4" style={{ width: "400px" }}>
//                 <div className="text-center mb-4">
//                     <img src={logo} alt="KPMG" width="150px" />
//                 </div>
//                 <h3 className="text-center mb-4">New Project</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label htmlFor="username" className="form-label">Project Name</label>
//                         <input type="text" className="form-control" id="username" placeholder="Enter your username" />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="password" className="form-label">As Of</label>
//                         <input type="text" className="form-control" id="Date" placeholder="Enter your password" />
//                     </div>
//                     <button type="submit" className="btn btn-primary w-100">Create</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Pencil, Trash, HouseFill } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import Swal from 'sweetalert2';
import './MainPage.css';
import excelLogo from './images/logo_excel.png';
import { Link } from 'react-router-dom';

// Dummy files for demonstration
const filesList = [
  'CRA_rr.csv',
  'MEV_Historical.csv',
  'MEV_Scenario.csv',
  'PDTTC.csv',
  'Weighting.csv'
];

export default function PSAK116ModuleAc() {

  const [projects, setProjects] = useState([
    { id: 1, name: 'PSAK116_Jan25', status: 'In Progress', progress: 0, reportingDate: '1/31/2025' },
    { id: 2, name: 'PSAK116_Dec24', status: 'Completed', progress: 0, reportingDate: '12/31/2024' },
  ]);

  const [modalData, setModalData] = useState({
    show: false,
    isEdit: false,
    project: null,
    projectName: '',
    reportingDate: new Date(),
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
    });
  };


  useEffect(() => {
    if (!modalData.isEdit) {

      const date = new Date(modalData.reportingDate);
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

      const formattedDate = `${month}${year}`;

      const newProjectName = `PSAK116_${formattedDate}`;
      setModalData((prevData) => ({
        ...prevData,
        projectName: newProjectName,
      }));
    }
  }, [modalData.reportingDate]);


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
    const { isEdit, project, projectName, reportingDate } = modalData;

    if (!projectName || !reportingDate) {
      alert('All fields are required!');
      return;
    }

    if (isEdit) {
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, name: projectName, reportingDate }
            : p
        )
      );
    } else {
      const newProject = {
        id: projects.length + 1,
        name: projectName,
        status: 'In Progress',
        progress: 0,
        reportingDate,
      };
      setProjects((prevProjects) => [...prevProjects, newProject]);
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
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== project.id));
  };

  const columns = [
    {
      name: 'Project Name',
      selector: (project) => (
        project.status === 'Completed' ?
          // <button className="btn btn-outline-4">
          <Link
            to={'/result-summary-psak116'}
            style={{ textDecoration: 'underline bold', color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {project.name}
          </Link>
          :
          <Link
            to={'/psak116-process'}
            style={{ textDecoration: 'underline bold', color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {project.name}
          </Link>
      ),
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
            variant={project.status === 'Completed' ? 'primary-outline' : 'primary'}
            onClick={() => openModal(true, project)}
            className="mr-2 btn-outline-4"
            style={{ marginRight: "5px" }}
            disabled={project.status === 'Completed'}
          >
            <Pencil />
          </Button>
          <Button
            variant={project.status === 'Completed' ? 'primary-outline' : 'primary'}
            onClick={() => handleRemove(project)}
            className="mr-2 btn-outline-4"
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
                  <h2 className="m-0">PSAK 116 Project List</h2>
                  <Button
                    className="btn btn-primary"
                    onClick={() => openModal(false)}
                    style={{ backgroundColor: '#00338D', color: 'white', border: 'None' }}
                  >
                    Add New Project
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

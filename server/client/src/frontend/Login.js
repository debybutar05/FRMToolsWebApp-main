import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css';
import logo from './images/KPMG_logo.png';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

export default function Login({ setUsername, setCompany, companies, groups, GroupingCompanies }) {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionGroup, setSelectedOptionGroup] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputUsername.trim() && inputPassword.trim() && selectedOption) {
            setUsername(inputUsername);
            setCompany(selectedOption.label);
            navigate('/homepage');
        } else {
            alert("Please fill in all fields.");
        }
    };

    const optionsGroup = groups.map(group => ({
        value: group.toLowerCase().replace(/\s+/g, '-'),
        label: group
    }));

    const optionsCompany = (group) => {
        if (!group) return [];
        return GroupingCompanies
            .filter(item => item.group === group)
            .map(item => ({
                value: item.company.toLowerCase().replace(/\s+/g, '-'),
                label: item.company
            }));
    };

    const handleChangeGroup = (selectedOptionGroup) => {
        setSelectedOptionGroup(selectedOptionGroup);
        setSelectedOption(null);
    };

    const handleChangeCompany = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    return (
        <div
  className="d-flex align-items-center justify-content-center vh-100"
  style={{
    background: "linear-gradient(135deg, #f4f5fa, #fbfbfb)",
    fontFamily: "'Inter', sans-serif",
  }}
>
  <div
    className="card p-4 shadow-lg"
    style={{
      width: "420px",
      border: "none",
      borderRadius: "20px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    }}
  >
    <div className="text-center mb-4">
      <img src={logo} alt="KPMG" width="100px" />
    </div>

    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="group" className="form-label fw-semibold text-dark">
          Group
        </label>
        <Select
          value={selectedOptionGroup}
          onChange={handleChangeGroup}
          options={optionsGroup}
          placeholder="Select your group"
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "10px",
              borderColor: "#d1d1d1",
              boxShadow: "none",
            }),
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="company" className="form-label fw-semibold text-dark">
          Company
        </label>
        <Select
          value={selectedOption}
          onChange={handleChangeCompany}
          options={optionsCompany(selectedOptionGroup?.label)}
          placeholder="Select your company"
          isDisabled={!selectedOptionGroup}
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "10px",
              borderColor: "#d1d1d1",
              boxShadow: "none",
            }),
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="username" className="form-label fw-semibold text-dark">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          placeholder="Enter your username"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          style={{ borderRadius: "10px" }}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="form-label fw-semibold text-dark">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Enter your password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          style={{ borderRadius: "10px" }}
        />
      </div>

      <button
        type="submit"
        className="btn w-100"
        style={{
          background: "linear-gradient(90deg, #0E1A40, #220486)",
          border: "none",
          borderRadius: "12px",
          color: "white",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        Login
      </button>
    </form>
  </div>
</div>

    );
}


// import React, { useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './MainPage.css';
// import logo from './images/KPMG_logo.png';
// import { useNavigate } from 'react-router-dom';
// import Select from "react-select";

// export default function Login({ setUsername, setCompany, companies, groups }) {
//     const [inputUsername, setInputUsername] = useState("");
//     const [inputPassword, setInputPassword] = useState("");
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [selectedOptionGroup, setSelectedOptionGroup] = useState(null);
//     const navigate = useNavigate();

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         if (inputUsername.trim() && inputPassword.trim() && selectedOption) {
//             setUsername(inputUsername);
//             setCompany(selectedOption.label);
//             navigate('/homepage');
//         } else {
//             alert("Please fill in all fields.");
//         }
//     };

//     const options = companies.map(company => ({
//         value: company.toLowerCase().replace(/\s+/g, '-'),
//         label: company
//     }));

    
//     const optionsGroup = groups.map(group => ({
//         value: group.toLowerCase().replace(/\s+/g, '-'),
//         label: group
//     }));

//     const handleChangeCompany = (selectedOption) => {
//         setSelectedOption(selectedOption);
//     };

//     const handleChangeGroup = (selectedOptionGroup) => {
//         setSelectedOptionGroup(selectedOptionGroup);
//     };

//     return (
//         <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#fbfbfb" }}>
//             <div className="card p-4" style={{ width: "400px" }}>
//                 <div className="text-center mb-4">
//                     <img src={logo} alt="KPMG" width="100px" />
//                 </div>
//                 <form onSubmit={handleSubmit}>

//                     <div className="mb-3">
//                         <label htmlFor="group" className="form-label">Group</label>
//                         <Select
//                             value={selectedOptionGroup}
//                             onChange={handleChangeGroup}
//                             options={optionsGroup}
//                             placeholder="Select your company"
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="company" className="form-label">Company</label>
//                         <Select
//                             value={selectedOption}
//                             onChange={handleChangeCompany}
//                             options={options}
//                             placeholder="Select your company"
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label htmlFor="username" className="form-label">Username</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="username"
//                             placeholder="Enter your username"
//                             value={inputUsername}
//                             onChange={(e) => setInputUsername(e.target.value)}
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label htmlFor="password" className="form-label">Password</label>
//                         <input
//                             type="password"
//                             className="form-control"
//                             id="password"
//                             placeholder="Enter your password"
//                             value={inputPassword}
//                             onChange={(e) => setInputPassword(e.target.value)}
//                         />
//                     </div>

//                     <button type="submit" className="btn btn-primary w-100">Login</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

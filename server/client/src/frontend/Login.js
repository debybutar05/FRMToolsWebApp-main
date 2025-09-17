import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css';
import logo from './images/KPMG_logo.png';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

export default function Login({ setUsername, setCompany }) {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [selectedOptionGroup, setSelectedOptionGroup] = useState(null);
  const [selectedOptionCompany, setSelectedOptionCompany] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  const [groups, setGroups] = useState([]);
  const [entities, setEntities] = useState([]);

  const navigate = useNavigate();

  // Ambil data group + entity + CSRF token saat pertama kali render
  useEffect(() => {
    axios.get("http://localhost:3000/api/groups")
      .then(res => setGroups(res.data))
      .catch(err => console.error("Error fetching groups:", err));

    axios.get("http://localhost:3000/api/entities")
      .then(res => setEntities(res.data))
      .catch(err => console.error("Error fetching entities:", err));

    axios.get("http://localhost:3000/api/csrf-token", { withCredentials: true })
      .then(res => {
        console.log("CSRF Token fetched:", res.data.csrfToken);
        setCsrfToken(res.data.csrfToken);
      })
      .catch(err => console.error("Error fetching CSRF token:", err));
  }, []);

  // Convert data ke format react-select
  const optionsGroup = groups.map(group => ({
    value: group.id,
    label: group.name
  }));

  const optionsCompany = () => {
    if (!selectedOptionGroup) return [];
    const selectedGroup = entities.find(g => g.id === selectedOptionGroup.value);
    return selectedGroup?.ListOfEntities.map(ent => ({
      value: ent.id,
      label: ent.name
    })) || [];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputUsername.trim() && inputPassword.trim() && selectedOptionCompany) {
      try {
        // POST ke backend + kirim CSRF token di header
        const res = await axios.post(
          "http://localhost:3000/api/login",
          {
            username: inputUsername,
            password: inputPassword,
            company: selectedOptionCompany.label,
          },
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true, // penting untuk cookie CSRF
          }
        );

        console.log("Login success:", res.data);

        // Simpan data user dan navigasi ke homepage
        setUsername(inputUsername);
        setCompany(selectedOptionCompany.label);
        navigate('/homepage');
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please check your username, password, or CSRF token.");
      }
    } else {
      alert("Please fill in all fields.");
    }
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
            <label className="form-label fw-semibold text-dark">Group</label>
            <Select
              value={selectedOptionGroup}
              onChange={setSelectedOptionGroup}
              options={optionsGroup}
              placeholder="Select group"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">Company</label>
            <Select
              value={selectedOptionCompany}
              onChange={setSelectedOptionCompany}
              options={optionsCompany()}
              placeholder="Select company"
              isDisabled={!selectedOptionGroup}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">Password</label>
            <input
              type="password"
              className="form-control"
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

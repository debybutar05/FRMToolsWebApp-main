import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HouseDoorFill, CalculatorFill, BarChartFill, ChevronDown, ChevronUp, FileEarmarkText, ClipboardData, ClipboardDataFill, FileEarmarkTextFill } from "react-bootstrap-icons";

function Sidebar({ isCollapsed }) {
    // Default dropdown states
    const [isModellingOpen, setIsModellingOpen] = useState(true);
    const [isECLViewOpen, setIsECLViewOpen] = useState(true);
    const [isECLCalculationOpen, setIsECLCalculationOpen] = useState(true);

    // Toggle the Modelling dropdown
    const toggleModelling = () => {
        setIsModellingOpen(!isModellingOpen);
    };

    // Toggle the ECL Calculation dropdown
    const toggleECLCalculation = () => {
        setIsECLCalculationOpen(!isECLCalculationOpen);
    };


    // Toggle the ECL Calculation dropdown
    const toggleECLView = () => {
        setIsECLViewOpen(!isECLViewOpen);
    };


    return (
        <div
            className={`bg-light d-flex flex-column ${isCollapsed ? "collapsed" : ""}`}
            style={{
                width: isCollapsed ? "50px" : "290px", // Adjust width based on collapsed state
                // maxHeight: "100%",
                height: '100%',
                paddingTop: "10px",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                transition: "width 0.3s ease",
                position: 'fixed',
                marginTop: "50px",
                zIndex: '900'

            }}
        >
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link text-dark d-flex align-items-center" to="/homepage">
                        <HouseDoorFill className="me-2" />
                        {!isCollapsed && <span>Home Page</span>}
                    </Link>
                </li>

                {/* Modelling Dropdown */}
                <li className={`nav-item ${isModellingOpen ? "show" : ""}`}>
                    <a
                        className="nav-link text-dark d-flex align-items-center"
                        href="#"
                        onClick={toggleModelling}
                        aria-expanded={isModellingOpen ? "true" : "false"}
                    >
                        <BarChartFill className="me-2" />
                        {!isCollapsed && <span>Modeling</span>}
                        <span className="ms-auto">
                            {isModellingOpen ? <ChevronUp /> : <ChevronDown />}
                        </span>
                    </a>
                    <ul className={`nav flex-column ms-3 ${isModellingOpen ? "show" : "collapse"}`} style={{ paddingLeft: "20px" }}>

                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/regression"
                            >
                                {!isCollapsed && <span className="me-5" >Modelling Vasicek</span>}
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/modeling-investment"
                            >
                                {!isCollapsed && <span className="me-5" >Modelling Investment</span>}
                            </Link>
                        </li> */}
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/tariff-calculation"
                            >
                                {!isCollapsed && <span className="me-5" >Modelling Receivables Portfolio</span>}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/model-list-loss-rate-sekuritas"
                            >
                                {!isCollapsed && <span className="me-5" >Modelling Securities</span>}
                            </Link>
                        </li>
                    </ul>
                </li>

                
                {/* ECL Calculation Dropdown */}
                <li className={`nav-item ${isECLViewOpen ? "show" : ""}`}>
                    <a
                        className="nav-link text-dark d-flex align-items-center"
                        href="#"
                        onClick={toggleECLView}
                        aria-expanded={isECLViewOpen ? "true" : "false"}
                    >
                        <CalculatorFill className="me-2" />
                        {!isCollapsed && <span>View ECL</span>}
                        <span className="ms-auto">
                            {isECLViewOpen ? <ChevronUp /> : <ChevronDown />}
                        </span>
                    </a>
                    <ul className={`nav flex-column ms-3 ${isECLViewOpen ? "show" : "collapse"}`} style={{ paddingLeft: "20px" }}>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-project-list"
                            >
                                {!isCollapsed && <span className="me-5" >View ECL Vasicek</span>}
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-calculation-investment"
                            >
                                {!isCollapsed && <span className="me-5" >ECL Investment</span>}
                            </Link>
                        </li> */}
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-project-list-vintage"
                            >
                                {!isCollapsed && <span className="me-5" >View ECL Receivables Portfolio</span>}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-project-list-sekuritas"
                            >
                                {!isCollapsed && <span className="me-5" >View ECL Securities</span>}
                            </Link>
                        </li>
                    </ul>
                </li>
                {/* =================================================================== */}
                {/* ECL Calculation Dropdown */}
                <li className={`nav-item ${isECLViewOpen ? "show" : ""}`}>
                    <a
                        className="nav-link text-dark d-flex align-items-center"
                        href="#"
                        onClick={toggleECLView}
                        aria-expanded={isECLViewOpen ? "true" : "false"}
                    >
                        <CalculatorFill className="me-2" />
                        {!isCollapsed && <span>View ECL</span>}
                        <span className="ms-auto">
                            {isECLViewOpen ? <ChevronUp /> : <ChevronDown />}
                        </span>
                    </a>
                    <ul className={`nav flex-column ms-3 ${isECLViewOpen ? "show" : "collapse"}`} style={{ paddingLeft: "20px" }}>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-project-list"
                            >
                                {!isCollapsed && <span className="me-5" >View ECL Vasicek</span>}
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-calculation-investment"
                            >
                                {!isCollapsed && <span className="me-5" >ECL Investment</span>}
                            </Link>
                        </li> */}
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-project-list-vintage"
                            >
                                {!isCollapsed && <span className="me-5" >View ECL Receivables Portfolio</span>}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-project-list-sekuritas"
                            >
                                {!isCollapsed && <span className="me-5" >View ECL Loss Rate Securities</span>}
                            </Link>
                        </li>
                    </ul>
                </li>

                {/* ECL Calculation Dropdown */}
                <li className={`nav-item ${isECLCalculationOpen ? "show" : ""}`}>
                    <a
                        className="nav-link text-dark d-flex align-items-center"
                        href="#"
                        onClick={toggleECLCalculation}
                        aria-expanded={isECLCalculationOpen ? "true" : "false"}
                    >
                        <CalculatorFill className="me-2" />
                        {!isCollapsed && <span>ECL Calculation</span>}
                        <span className="ms-auto">
                            {isECLCalculationOpen ? <ChevronUp /> : <ChevronDown />}
                        </span>
                    </a>
                    <ul className={`nav flex-column ms-3 ${isECLCalculationOpen ? "show" : "collapse"}`} style={{ paddingLeft: "20px" }}>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-project-list-calc"
                            >
                                {!isCollapsed && <span className="me-5" >ECL Vasicek</span>}
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-calculation-investment"
                            >
                                {!isCollapsed && <span className="me-5" >ECL Investment</span>}
                            </Link>
                        </li> */}
                        <li className="nav-item">
                            <Link
                                className="nav-link text-dark d-flex align-items-center"
                                to="/ecl-project-list-vintage-calc"
                            >
                                {!isCollapsed && <span className="me-5" >ECL Receivables Portfolio</span>}
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <Link
                        className="nav-link text-dark d-flex align-items-center"
                        to="/psak116-project-list"
                    >
                        <FileEarmarkTextFill className="me-2" />
                        {!isCollapsed && <span>PSAK 116 Module</span>}
                        {/* {!isCollapsed && <span className="me-2" >PSAK 116 Module</span>} */}
                    </Link>
                </li>
                {/* <li className="nav-item">
                    <Link className="nav-link text-dark d-flex align-items-center" to="/psak116-project-list">
                        <FileEarmarkTextFill className="me-2" />
                        {!isCollapsed && <span>PSAK 116 Module</span>}
                    </Link>
                </li> */}
                {/* <li className="nav-item">
                    <Link className="nav-link text-dark d-flex align-items-center" to="/individual-assessment">
                        <ClipboardDataFill className="me-2" />
                        {!isCollapsed && <span>ECL Individual Assessment</span>}
                    </Link>
                </li> */}
            </ul>
        </div>
    );
}

export default Sidebar;

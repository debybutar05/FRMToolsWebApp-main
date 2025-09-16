import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    HouseDoorFill,
    CalculatorFill,
    BarChartFill,
    ChevronDown,
    ChevronUp,
    FileEarmarkTextFill
} from "react-bootstrap-icons";


function Sidebar({ isCollapsed }) {
    const [isPSAK109Open, setIsPSAK109Open] = useState(true);
    const [isModellingOpen, setIsModellingOpen] = useState(true);
    const [isECLViewOpen, setIsECLViewOpen] = useState(true);
    const [isECLCalculationOpen, setIsECLCalculationOpen] = useState(true);
    const [isPSAK116Open, setIsPSAK116Open] = useState(true);

    const togglePSAK109 = () => {
        setIsPSAK109Open(!isPSAK109Open);
    };

    const toggleModelling = () => {
        setIsModellingOpen(!isModellingOpen);
    };

    const toggleECLCalculation = () => {
        setIsECLCalculationOpen(!isECLCalculationOpen);
    };

    const toggleECLView = () => {
        setIsECLViewOpen(!isECLViewOpen);
    };

    const togglePSAK116 = () => {
        setIsPSAK116Open(!isPSAK116Open);
    };

    const sidebarStyles = `
  .nav-link:hover {
    background-color: rgba(0, 51, 141, 0.08);
  }
`;

    if (typeof document !== "undefined") {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = sidebarStyles;
        document.head.appendChild(styleTag);
    }

    const navLinkStyle = {
        color: "#00338D",
        fontWeight: 500,
        fontSize: "14px",
        padding: "8px 10px",
        borderRadius: "6px",
        transition: "background 0.2s",
        textDecoration: "none",
    };


    return (    
        <div
            className={`d-flex flex-column ${isCollapsed ? "collapsed" : ""}`}
            style={{
                width: isCollapsed ? "50px" : "270px",
                height: "100vh",
                backgroundColor: "#f9f9fb",
                paddingTop: "12px",
                transition: "width 0.3s ease",
                position: "fixed",
                top: "60px",
                left: 0,
                zIndex: 900,
                overflowY: "auto",
                boxShadow: "2px 0 6px rgba(0, 0, 0, 0.08)",
                borderRight: "1px solid #e0e0e0",
            }}
        >
            <ul className="nav flex-column" style={{ padding: "0 12px", color: "#00338D" }}>
                {/* Section - PSAK 109 */}
                <li className="nav-item">
                    <a
                        className="nav-link d-flex align-items-center"
                        href="#"
                        onClick={togglePSAK109}
                        style={{
                            fontWeight: 600,
                            padding: "10px",
                            borderRadius: "8px",
                            background: isPSAK109Open ? "rgba(0, 51, 141, 0.07)" : "transparent",
                            color: "#00338D",
                        }}
                    >
                        {!isCollapsed && <>PSAK 109</>}
                        <span className="ms-auto">
                            {isPSAK109Open ? <ChevronUp /> : <ChevronDown />}
                        </span>
                    </a>
                    {isPSAK109Open && (
                        <ul className="nav flex-column ms-2">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/homepage" style={navLinkStyle}>
                                    <HouseDoorFill className="me-2" />
                                    {!isCollapsed && "Dashboard"}
                                </NavLink>
                            </li>

                            {/* Subsection - Tariff */}
                            <li className="nav-item">
                                <a href="#" className="nav-link d-flex align-items-center" onClick={toggleModelling} style={navLinkStyle}>
                                    <BarChartFill className="me-2" />
                                    {!isCollapsed && "Tariff Calculation"}
                                    <span className="ms-auto">{isModellingOpen ? <ChevronUp /> : <ChevronDown />}</span>
                                </a>
                                {isModellingOpen && (
                                    <ul className="nav flex-column ms-3">
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/model-list" style={navLinkStyle}>Investment Tariff</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/model-list-loss-rate-vintage" style={navLinkStyle}>Non-Investment Tariff</NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            {/* Subsection - ECL */}
                            <li className="nav-item">
                                <a href="#" className="nav-link d-flex align-items-center" onClick={toggleECLView} style={navLinkStyle}>
                                    <CalculatorFill className="me-2" />
                                    {!isCollapsed && "ECL Calculation"}
                                    <span className="ms-auto">{isECLViewOpen ? <ChevronUp /> : <ChevronDown />}</span>
                                </a>
                                {isECLViewOpen && (
                                    <ul className="nav flex-column ms-3">
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/ecl-project-list" style={navLinkStyle}>Investment ECL</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/ecl-project-list-vintage" style={navLinkStyle}>Non-Investment ECL</NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    )}
                </li>

                {/* Section - PSAK 116 */}
                {/* <li className="nav-item mt-2">
                    <a
                        className="nav-link d-flex align-items-center"
                        href="#"
                        onClick={togglePSAK116}
                        style={{
                            fontWeight: 600,
                            padding: "10px",
                            borderRadius: "8px",
                            background: isPSAK116Open ? "rgba(0, 51, 141, 0.07)" : "transparent",
                            color: "#00338D",
                        }}
                    >
                        {!isCollapsed && <>PSAK 116</>}
                        <span className="ms-auto">
                            {isPSAK116Open ? <ChevronUp /> : <ChevronDown />}
                        </span>
                    </a>
                    {isPSAK116Open && (
                        <ul className="nav flex-column ms-2">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/homepage-PSAK116" style={navLinkStyle}>
                                    <HouseDoorFill className="me-2" />
                                    {!isCollapsed && "Dashboard"}
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/psak116-project-list" style={navLinkStyle}>
                                    <CalculatorFill className="me-2" />
                                    {!isCollapsed && "RoU & LL Calculation"}
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </li> */}
            </ul>
        </div>

    );
}

export default Sidebar;


        // <div
        //     className={`bg-light d-flex flex-column ${isCollapsed ? "collapsed" : ""}`}
        //     style={{
        //         width: isCollapsed ? "50px" : "290px",
        //         height: '100%',
        //         paddingTop: "10px",
        //         boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        //         transition: "width 0.3s ease",
        //         position: 'fixed',
        //         marginTop: "50px",   
        //         zIndex: '900'
        //     }}
        // >
        //     <ul className="nav flex-column">
        //         {/* PSAK 109 Tools Dropdown */}
        //         <li className={`nav-item ${isPSAK109Open ? "show" : ""}`}>
        //             <a
        //                 className="nav-link text-dark d-flex align-items-center"
        //                 href="#"
        //                 onClick={togglePSAK109}
        //                 aria-expanded={isPSAK109Open ? "true" : "false"}
        //             >
        //                 {/* <FileEarmarkTextFill className="me-2" /> */}
        //                 {!isCollapsed && <span style={{ fontWeight: 'bold' }}>PSAK 109</span>}
        //                 <span className="ms-auto">
        //                     {isPSAK109Open ? <ChevronUp /> : <ChevronDown />}
        //                 </span>
        //             </a>
        //             <ul className={`nav flex-column ms-3 ${isPSAK109Open ? "show" : "collapse"}`} style={{ paddingLeft: "20px" }}>
        //                 <li className="nav-item">
        //                     <NavLink className="nav-link text-dark d-flex align-items-center" to="/homepage">
        //                         <HouseDoorFill className="me-2" />
        //                         {!isCollapsed && <span>Dashboard</span>}
        //                     </NavLink>
        //                 </li>

        //                 {/* Modelling Dropdown */}
        //                 <li className={`nav-item ${isModellingOpen ? "show" : ""}`}>
        //                     <a className="nav-link text-dark d-flex align-items-center" href="#" onClick={toggleModelling}>
        //                         <BarChartFill className="me-2" />
        //                         {!isCollapsed && <span>Tariff Calculation</span>}
        //                         <span className="ms-auto">{isModellingOpen ? <ChevronUp /> : <ChevronDown />}</span>
        //                     </a>
        //                     <ul className={`nav flex-column ms-3 ${isModellingOpen ? "show" : "collapse"}`} style={{ paddingLeft: "20px" }}>
        //                         <li className="nav-item">
        //                             <NavLink className="nav-link text-dark" to="/model-list">Investment Tariff</NavLink>
        //                         </li>
        //                         <li className="nav-item">
        //                             <NavLink className="nav-link text-dark" to="/model-list-loss-rate-vintage">Non-Investment Tariff</NavLink>
        //                         </li>
        //                     </ul>
        //                 </li>

        //                 {/* ECL Calculation Dropdown */}
        //                 <li className={`nav-item ${isECLViewOpen ? "show" : ""}`}>
        //                     <a className="nav-link text-dark d-flex align-items-center" href="#" onClick={toggleECLView}>
        //                         <CalculatorFill className="me-2" />
        //                         {!isCollapsed && <span>ECL Calculation</span>}
        //                         <span className="ms-auto">{isECLViewOpen ? <ChevronUp /> : <ChevronDown />}</span>
        //                     </a>
        //                     <ul className={`nav flex-column ms-3 ${isECLViewOpen ? "show" : "collapse"}`} style={{ paddingLeft: "20px" }}>
        //                         <li className="nav-item">
        //                             <NavLink className="nav-link text-dark" to="/ecl-project-list">Investment ECL</NavLink>
        //                         </li>
        //                         <li className="nav-item">
        //                             <NavLink className="nav-link text-dark" to="/ecl-project-list-vintage">Non-Investment ECL</NavLink>
        //                         </li>
        //                     </ul>
        //                 </li>
        //             </ul>
        //         </li>

        //         <li className={`nav-item ${isPSAK116Open ? "show" : ""}`}>
        //             <a
        //                 className="nav-link text-dark d-flex align-items-center"
        //                 href="#"
        //                 onClick={togglePSAK116}
        //                 aria-expanded={isPSAK116Open ? "true" : "false"}
        //             >
        //                 {!isCollapsed && <span style={{ fontWeight: 'bold' }}>PSAK 116</span>}
        //                 <span className="ms-auto">
        //                     {isPSAK116Open ? <ChevronUp /> : <ChevronDown />}
        //                 </span>
        //             </a>
        //             <ul className={`nav flex-column ms-3 ${isPSAK116Open ? "show" : "collapse"}`} style={{ paddingLeft: "20px" }}>
        //                 <li className="nav-item">
        //                     <NavLink className="nav-link text-dark d-flex align-items-center" to="/homepage-PSAK116">
        //                         <HouseDoorFill className="me-2" />
        //                         {!isCollapsed && <span>Dashboard</span>}
        //                     </NavLink>
        //                 </li>
        //                 <li className="nav-item">
        //                     <NavLink className="nav-link text-dark d-flex align-items-center" to="/psak116-project-list">
        //                         <CalculatorFill className="me-2" />
        //                         {!isCollapsed && <span>RoU & LL Calculation</span>}
        //                     </NavLink>
        //                 </li>
        //             </ul>
        //         </li>
        //     </ul>
        // </div>
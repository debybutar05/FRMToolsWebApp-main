import React from "react";
import { BoxArrowLeft, List } from "react-bootstrap-icons";
import logo from "./images/kpmg-logo-white.png";
import './MainPage.css'

function Navbar({ username, company }) {
    return (
        <nav
            style={{
                background: "linear-gradient(90deg, #0E1A40 0%, #220486ff 100%)", // rich luxury gradient
                color: "#ffffff",
                height: "60px",
                position: "fixed",
                top: 0,
                width: "100%",
                zIndex: 1000,
                padding: "0 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)",
            }}
        >
            {/* Logo */}
            <a href="/homepage" className="d-flex align-items-center">
                <img
                    src={logo}
                    alt="Logo"
                    height="40"
                    style={{
                        filter: "drop-shadow(0 1px 4px rgba(255,255,255,0.7))",
                        marginTop: "-1px",
                    }}
                />
            </a>

            {/* User Info & Logout */}
            <div
                className="d-flex align-items-center"
                style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    padding: "10px 22px",
                    borderRadius: "999px",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 500,
                    gap: "14px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 2px 6px rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <span style={{ letterSpacing: "0.4px" }}>{username} | {company}</span>
                <a href="/" title="Logout" style={{ color: "#ffffff" }}>
                    <BoxArrowLeft size={20} />
                </a>
            </div>
        </nav>
    );
}



// function Navbar({ toggleSidebar, username, company }) {
//     return (
//         <nav
//             className="navbar navbar-expand-lg navbar-dark"
//             style={{
//                 backgroundColor: "#00338D",
//                 justifyContent: "space-between",
//                 height: "50px",
//                 position: "fixed",
//                 width: "100%",
//                 zIndex: "1000"
//             }}
//         >
//             <div className="container-fluid dflex">
//                 <a className="navbar-brand p-2" href="/homepage">
//                     <img src={logo} alt="KPMG" height="40px" />
//                 </a>
//                 {/* Username */}
//                 <div className="ms-auto p-2">
//                     <span className="navbar-text text-white">
//                         <span className="navbar-text text-white" style={{ fontSize: "14px", paddingRight: "15px" }} >
//                             {username} | {company}
//                         </span>
//                         <a href="/">
//                             <BoxArrowLeft style={{ fontSize: "16px" }} />
//                         </a>
//                     </span>
//                 </div>
//             </div>
//         </nav>
//     );
// }

export default Navbar;

// import React from "react";
// import { BoxArrowLeft, List } from "react-bootstrap-icons";
// import logo from "./images/kpmg-logo-white.png";

// function Navbar({ toggleSidebar }) {
//   return (
//     <nav
//       className="navbar navbar-expand-lg navbar-dark"
//       style={{
//         backgroundColor: "#00338D",
//         justifyContent: "space-between",
//         height: "50px"
//       }}
//     >
//       <div className="container-fluid dflex">
//         {/* Sidebar Toggle Button */}
//         <button
//           className="btn me-2"
//           onClick={toggleSidebar}
//           style={{ width: "40px", height: "40px", alignSelf:"left" }}
//         >
//           <List style={{ color: "white", fontSize: "24px" }} />
//         </button>

//         {/* Logo */}
//         <a className="navbar-brand p-2" href="/homepage">
//           <img src={logo} alt="KPMG" height="40px" />
//         </a>

//         {/* Navbar Content */}
//         <div className="collapse navbar-collapse p-2" id="navbarSupportedContent">
//           {/* Placeholder for additional nav items */}
//         </div>

//         {/* Username */}
//         <a className="ms-auto p-2" href="/">
//           <span className="navbar-text text-white">
//             <BoxArrowLeft style={{ fontSize: "20px", paddingRight: "2px" }} />
//             Username
//           </span>
//         </a>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

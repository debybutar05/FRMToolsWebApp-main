import React from "react";
import { Spinner } from "react-bootstrap";  // You can install Bootstrap icons for additional visual elementsimport React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css';

const UnderDevelopment = () => {

    const styles = {
        spinner: {
            marginTop: "20px",
        }
    };

    return (

        <div>
            <div className="d-flex">
                {/* Main content */}
                <div className="flex-grow-1 pt-3 pl-1">
                    <div style={{ display: "flex", justifyContent: "center", width: "100%", minHeight: "100vh", backgroundColor: "#fbfbfb" }}>
                        <div className="card flex" style={{ width: "100%", minHeight: "90%", alignSelf: "start", alignItems: "center", zIndex: "999" }}>
                            <div className="card-body col-12 d-flex flex-column" style={{ justifyContent: "flex-start", height: 'auto' }}>

                                {/* <div style={styles.pageContainer}>
                                    <div style={styles.content}> */}
                                <h1>Under Development</h1>
                                {/* <p style={styles.message}>This page is currently under construction. Please check back later.</p> */}
                                {/* <Spinner animation="border" variant="primary" style={styles.spinner} /> */}
                                {/* </div>
                                </div> */}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default UnderDevelopment;

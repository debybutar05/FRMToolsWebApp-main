import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./frontend/Login";
import Homepage from "./frontend/Homepage";

function App() {
  const [username, setUsername] = useState("");
  const [company, setCompany] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login setUsername={setUsername} setCompany={setCompany} />}
        />
        <Route
          path="/homepage"
          element={<Homepage username={username} company={company} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

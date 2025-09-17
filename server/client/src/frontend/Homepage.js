import React from "react";

export default function Homepage({ username, company }) {
  return (
    <div className="container mt-5">
      <h1>Welcome, {username}</h1>
      <p>You selected company: <strong>{company}</strong></p>
    </div>
  );
}
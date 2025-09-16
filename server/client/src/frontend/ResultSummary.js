// ResultSummary.js
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Swal from 'sweetalert2';

const ResultSummary = () => {
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/files/ecl-calculator-result.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setModalData(result.data);
          },
        });
      } catch (error) {
        Swal.fire('Error', 'Failed to load the CSV file.', 'error');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h2 className="mt-5">ECL Calculator Result Summary</h2>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-light">
          <tr>
            {Object.keys(modalData[0] || {}).map((header) => (
              <th
                key={header}
                style={{
                  textAlign: header === 'AmountOri' || header === 'CurrencyRate' ? 'right' : 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modalData.map((row, index) => (
            <tr key={index}>
              {Object.entries(row).map(([key, value], i) => (
                <td
                  key={i}
                  style={{
                    textAlign: key === 'AmountOri' || key === 'CurrencyRate' ? 'right' : 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultSummary;

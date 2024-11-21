import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css'; 

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const dropdownOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput); 
      setError('');

      const response = await axios.post('http://localhost:8080/bfhl', parsedInput);
      setResponseData(response.data);
      setFilteredResponse(null); 
    } catch (err) {
      setError('Invalid JSON Input');
      console.error(err);
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setFilterOptions(selectedOptions);
    if (responseData) {
      let filteredData = {};
      selectedOptions.forEach((option) => {
        filteredData[option.value] = responseData[option.value];
      });
      setFilteredResponse(filteredData);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">0827AL211031</h1>

      <form onSubmit={handleSubmit} className="input-form">
        <label className="label">API Input (Valid JSON format):</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data": ["A", "1", "B", "2", "z"]}'
          rows="4"
          cols="50"
          className="input-textarea"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {responseData && (
        <>
          <div className="filter-section">
            <label className="label">Multi Filter:</label>
            <Select
              isMulti
              options={dropdownOptions}
              onChange={handleFilterChange}
              className="select-filter"
            />
          </div>

          <div className="response-section">
            <h3 className="response-title">Filtered Response:</h3>
            <pre className="response-box">
              {filteredResponse
                ? JSON.stringify(filteredResponse, null, 2)
                : 'Select filters to see the response'}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

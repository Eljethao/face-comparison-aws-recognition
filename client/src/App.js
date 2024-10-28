import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KYCComponent from './KYCComponent';
import HomePage from './HomePage';

const App = () => {
  const [kycData, setKycData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<KYCComponent setKycData={setKycData} />} />
        <Route path="/home" element={<HomePage kycData={kycData} />} />
      </Routes>
    </Router>
  );
};

export default App;

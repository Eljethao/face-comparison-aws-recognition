import React from 'react';
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';

const HomePage = ({ kycData }) => {

  const navigate = useNavigate();

  // if (!kycData) {
  //   return <div className="text-center mt-5">No KYC data available. Please complete the KYC process.</div>;
  // }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">KYC Verification Results</h2>

        <div className="row mb-4">
          <div className="col-md-6">
            <h5><i className="fas fa-user"></i> Personal Details</h5>
            <hr />
            <p><strong>First Name:</strong> {kycData?.firstName}</p>
            <p><strong>Last Name:</strong> {kycData?.lastName}</p>
            <p><strong>Email:</strong> {kycData?.email}</p>
            <p><strong>Date of Birth:</strong> {kycData?.dob}</p>
          </div>

          {kycData?.matchStatus === "match" ? (
            <div className="col-md-6">
              <h5><i className="fas fa-id-card"></i> Face Comparison Result</h5>
              <hr />
              <p><strong>Face Comparison Score:</strong>
                <span className={`badge ${kycData?.similarity >= 80 ? 'badge-success' : 'badge-danger'} ml-2`}>
                  {kycData?.similarity}%
                </span>
                <span style={{padding: 10}}>
                  <i className="fas fa-check" style={{ color: "green" }}></i>
                </span>
              </p>
              <p><strong>Face Details:</strong></p>
              <pre>{JSON.stringify(kycData?.faceDetails, null, 2)}</pre>
            </div>
          ) : (
            <div className="col-md-6">
              <h5><i className="fas fa-id-card"></i> Face Comparison Result</h5>
              <hr />
              <p><strong>Face Comparison Unmatch Score:</strong>
                <span className={`badge ${kycData?.similarity >= 80 ? 'badge-danger' : 'badge-success'} ml-2`}>
                  {kycData?.similarity}%
                </span>
                <span style={{ padding: 10 }}>
                  <i className="fas fa-times" style={{ color: "red" }}></i>
                </span>
              </p>
              <p><strong>Face Details:</strong></p>
              <pre>{JSON.stringify(kycData?.faceDetails, null, 2)}</pre>
            </div>
          )}

        </div>

        {/* <div className="text-center">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Restart KYC Process
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;

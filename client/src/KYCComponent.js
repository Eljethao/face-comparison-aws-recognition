import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Spinner } from 'react-bootstrap';
import "./UploadComponent.css";

const KYCComponent = ({ setKycData }) => {
  // Form state for input fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [passportImage, setPassportImage] = useState(null);
  const [faceWithPassportImage, setFaceWithPassportImage] = useState(null);
  const [passportImagePreview, setPassportImagePreview] = useState(null);
  const [faceWithPassportImagePreview, setFaceWithPassportImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for modal

  const navigate = useNavigate(); // Hook for navigation

  // Handle image selection and preview
  const handleFileChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!firstName || !lastName || !email || !dob || !passportImage || !faceWithPassportImage) {
      alert('Please complete all fields and upload both images');
      return;
    }

    // Show loading modal
    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('dob', dob);
    formData.append('passportImage', passportImage);  // Source Image
    formData.append('faceWithPassportImage', faceWithPassportImage);  // Target Image

    try {
      // Submit form data to backend for processing
      const response = await axios.post('http://localhost:9090/submit-kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Set the KYC data in the parent component (App.js)
      setKycData({
        firstName,
        lastName,
        email,
        dob,
        similarity: response.data.similarity,
        faceDetails: response.data.faceDetails,
        matchStatus: response.data.status
      });

      // Hide loading modal and navigate to the home page
      setLoading(false);
      navigate('/home');
    } catch (error) {
      console.error('Error during KYC submission:', error);
      alert('Failed to submit KYC information.');
      setLoading(false); // Hide loading modal in case of error
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container">
        <h2 style={{ textAlign: "center" }}>User KYC</h2>
        <form onSubmit={handleSubmit} className="border p-4 shadow-lg bg-white rounded" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <div className="form-row">
            <div>
              <div className="form-group m-4">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group m-4">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div>
              <div className="form-group m-4">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group m-4">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group m-4 text-center">
            <div>
              <label>Passport Picture</label>
              <div className="custom-file-upload">
                <input
                  type="file"
                  id="passportImage"
                  className="d-none"
                  onChange={(e) => handleFileChange(e, setPassportImage, setPassportImagePreview)}
                  required
                />
                <label htmlFor="passportImage" className="image-upload-label d-flex flex-column align-items-center justify-content-center">
                  {passportImagePreview ? (
                    <img src={passportImagePreview} alt="Passport" className="img-fluid img-thumbnail" />
                  ) : (
                    <>
                      <i className="fa fa-cloud-upload" style={{ fontSize: '48px', color: '#aaa' }}></i>
                      <span className="text-primary">Select Image</span>
                      <small className="text-muted">PNG, JPG</small>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="form-group m-4 text-center">
            <label>Face Picture</label>
            <div className="custom-file-upload">
              <input
                type="file"
                id="faceWithPassportImage"
                className="d-none"
                onChange={(e) => handleFileChange(e, setFaceWithPassportImage, setFaceWithPassportImagePreview)}
                required
              />
              <label htmlFor="faceWithPassportImage" className="image-upload-label d-flex flex-column align-items-center justify-content-center">
                {faceWithPassportImagePreview ? (
                  <img src={faceWithPassportImagePreview} alt="Face with Passport" className="img-fluid img-thumbnail" />
                ) : (
                  <>
                    <i className="fa fa-cloud-upload" style={{ fontSize: '48px', color: '#aaa' }}></i>
                    <span className="text-primary">Select Image</span>
                    <small className="text-muted">PNG, JPG</small>
                  </>
                )}
              </label>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button type="submit" className="btn btn-primary btn-block m-4">Submit KYC Information</button>
          </div>
        </form>

        {/* Loading Modal */}
        <Modal show={loading} centered>
          <Modal.Body className="d-flex justify-content-center align-items-center" style={{height: "200px"}}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
            <span className="ml-2">Processing KYC Submission...</span>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default KYCComponent;

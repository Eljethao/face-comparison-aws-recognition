# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
      });

      // Navigate to the home page after submission
      navigate('/home');
    } catch (error) {
      console.error('Error during KYC submission:', error);
      alert('Failed to submit KYC information.');
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
      </div>
    </div>
  );
};

export default KYCComponent;

import React,{useState} from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Select from 'react-select';
import IMG01 from '../../assets/images/logo.png'
import IMG02 from '../../assets/images/favicon.png'
import { FiUpload, FiXCircle } from "react-icons/fi";
const Settings =()=> {
  const	state=[
    {label : "California",value : 1},
    {label : "Tasmania",value : 2},
    {label : "Auckland",value : 3},
    {label : "Marlborough",value : 4},
];
const	country=[
  {label : "India",value : 1},
  {label : "London",value : 2},
  {label : "France",value : 3},
  {label : "USA",value : 4},
];
const [selectedOption, setSelectedOption] = useState(null);
    return(
<>
  {/* Page Wrapper */}
  <div className="page-wrapper">
  <Helmet>
      <title>Settings- CRMS admin Template</title>
      <meta name="description" content="Reactify Blank Page" />
  </Helmet>
    {/* Page Content */}
    <div className="content container-fluid">
      <div className="crms-title row bg-white">
        <div className="col  p-0">
          <h3 className="page-title m-0">
            <span className="page-title-icon bg-gradient-primary text-white me-2">
              <i className="fa fa-cog" aria-hidden="true" />
            </span>{" "}
            Settings{" "}
          </h3>
        </div>
        <div className="col p-0 text-end">
          <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
            <li className="breadcrumb-item">
              <Link to="/index">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Settings</li>
          </ul>
        </div>
      </div>
      <div className="settings-menu-links">
        <ul className="nav nav-tabs menu-tabs">
          <li className="nav-item active">
            <Link className="nav-link" to="/settings">
              General Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/localization-details">
              Localization
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/payment-settings">
              Payment Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/email-settings">
              Email Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/social-settings">
              Social Media Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/social-links">
              Social Links
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/seo-settings">
              SEO Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/others-settings">
              Others
            </Link>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Website Basic Details</h5>
            </div>
            <div className="card-body pt-0">
              <form>
                <div className="settings-form">
                  <div className="form-group">
                    <label>
                      Website Name <span className="star-red">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Website Name"
                    />
                  </div>
                  <div className="form-group">
                    <p className="settings-label">
                      Logo <span className="star-red">*</span>
                    </p>
                    <div className="settings-btn">
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        id="file"                        
                        className="hide-input"
                      />
                      <label htmlFor="file" className="upload">
                        <FiUpload className="feather-upload" />
                      </label>
                    </div>
                    <h6 className="settings-size">
                      Recommended image size is <span>150px x 150px</span>
                    </h6>
                    <div className="upload-images">
                      <img src={IMG01} alt="Image" />
                      <Link
                        to="#"
                        className="btn-icon logo-hide-btn"
                      >
                        <FiXCircle className="feather-x-circle" />
                      </Link>
                    </div>
                  </div>
                  <div className="form-group">
                    <p className="settings-label">
                      Favicon <span className="star-red">*</span>
                    </p>
                    <div className="settings-btn">
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        id="files"                        
                        className="hide-input"
                      />
                      <label htmlFor="file" className="upload">
                        <FiUpload className="feather-upload" />
                      </label>
                    </div>
                    <h6 className="settings-size">
                      Recommended image size is{" "}
                      <span>16px x 16px or 32px x 32px</span>
                    </h6>
                    <h6 className="settings-size mt-1">
                      Accepted formats: only png and ico
                    </h6>
                    <div className="upload-images upload-size">
                      <img src={IMG02} alt="Image" />
                      <a
                        href="#"
                        className="btn-icon logo-hide-btn"
                      >
                        <FiXCircle className="feather-x-circle" />
                      </a>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-5 col-md-6">
                      <div className="form-group">
                        <div className="status-toggle d-flex justify-content-between align-items-center">
                          <p className="mb-0">RTL</p>
                          <input
                            type="checkbox"
                            id="status_1"
                            className="check"
                          />
                          <label htmlFor="status_1" className="checktoggle">
                            checkbox
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-0">
                    <div className="settings-btns">
                      <button
                        type="submit"
                        className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      >
                        Update
                      </button>
                      &nbsp;&nbsp;
                      <button
                        type="submit"
                        className="btn btn-secondary btn-rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Address Details</h5>
            </div>
            <div className="card-body pt-0">
              <form>
                <div className="settings-form">
                  <div className="form-group">
                    <label>
                      Address Line 1 <span className="star-red">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Address Line 1"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Address Line 2 <span className="star-red">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Address Line 2"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          City <span className="star-red">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          State/Province <span className="star-red">*</span>
                        </label>
                        <Select
                          placeholder = "Select"
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={state}
                      />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          Zip/Postal Code <span className="star-red">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          Country <span className="star-red">*</span>
                        </label>
                        <Select
                          placeholder = "Select"
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={country}
                      />
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-0">
                    <div className="settings-btns">
                      <button
                        type="submit"
                        className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      >
                        Update
                      </button>
                      &nbsp;&nbsp;
                      <button
                        type="submit"
                        className="btn btn-secondary btn-rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* /Page Content */}
  </div>
  {/* /Page Wrapper */}
</>

    )
  };
export default Settings;

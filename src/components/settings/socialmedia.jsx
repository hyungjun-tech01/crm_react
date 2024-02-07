import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
const Socialmedia =()=> {
    return(
<>
  {/* Page Content */}
  <div className="page-wrapper"> 
    <Helmet>
        <title>Settings- CRMS admin Template</title>
        <meta name="description" content="Reactify Blank Page" />
    </Helmet>
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
        <li className="nav-item ">
          <Link className="nav-link" to="/settings">
            General Settings
          </Link>
        </li>
        <li className="nav-item ">
          <Link className="nav-link" to="/localization-details">
            Localization
          </Link>
        </li>
        <li className="nav-item ">
          <Link className="nav-link" to="/payment-settings">
            Payment Settings
          </Link>
        </li>
        <li className="nav-item ">
          <Link className="nav-link" to="/email-settings">
            Email Settings
          </Link>
        </li>
        <li className="nav-item active">
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
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title">Google Login Credential</h5>
            <div className="status-toggle d-flex justify-content-between align-items-center">
              <input
                type="checkbox"
                id="status_1"
                className="check"
                defaultChecked=""
              />
              <label htmlFor="status_1" className="checktoggle">
                checkbox
              </label>
            </div>
          </div>
          <div className="card-body pt-0">
            <form>
              <div className="settings-form">
                <div className="form-group form-placeholder">
                  <label>
                    Client ID <span className="star-red">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group form-placeholder">
                  <label>
                    Client Secret <span className="star-red">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group mb-0">
                  <div className="settings-btns">
                    <button
                      type="submit"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                    >
                      Save
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
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title">Facebook</h5>
            <div className="status-toggle d-flex justify-content-between align-items-center">
              <input
                type="checkbox"
                id="status_2"
                className="check"
                defaultChecked=""
              />
              <label htmlFor="status_2" className="checktoggle">
                checkbox
              </label>
            </div>
          </div>
          <div className="card-body pt-0">
            <form>
              <div className="settings-form">
                <div className="form-group form-placeholder">
                  <label>
                    App ID <span className="star-red">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group form-placeholder">
                  <label>
                    App Secret <span className="star-red">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group mb-0">
                  <div className="settings-btns">
                    <button
                      type="submit"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                    >
                      Save
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
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title">Twiter Login Credential</h5>
            <div className="status-toggle d-flex justify-content-between align-items-center">
              <input type="checkbox" id="status_3" className="check" />
              <label htmlFor="status_3" className="checktoggle">
                checkbox
              </label>
            </div>
          </div>
          <div className="card-body pt-0">
            <form>
              <div className="settings-form">
                <div className="form-group form-placeholder">
                  <label>
                    Client ID <span className="star-red">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group form-placeholder">
                  <label>
                    Client Secret <span className="star-red">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group mb-0">
                  <div className="settings-btns">
                    <button
                      type="submit"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                    >
                      Save
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
  </div>
  {/* /Page Content */}
</>

)};
export default Socialmedia;        
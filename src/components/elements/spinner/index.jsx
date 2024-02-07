import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
const Spinner =()=>{
    return(
<>
  {/* Page Wrapper */}
  <div className="page-wrapper">
  <Helmet>
    <title>Dashboard- CRMS admin Template</title>
    <meta name="description" content="Reactify Blank Page" />
  </Helmet>
    <div className="content container-fluid">
      {/* Page Header */}
      <div className="crms-title row bg-white mb-4">
        <div className="col">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white me-2">
              <i className="fas fa-table" />
            </span>{" "}
            <span>Spinner</span>
          </h3>
        </div>
        <div className="col text-end">
          <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
            <li className="breadcrumb-item">
              <Link to="/index">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Spinner</li>
          </ul>
        </div>
      </div>
      {/* /Page Header */}
      <div className="row">
        {/* Spinner */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Border Spinner</h5>
            </div>
            <div className="card-body">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        {/* /Spinner */}
        {/* Spinner */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Colored Spinner</h5>
            </div>
            <div className="card-body">
              <div className="spinner-border text-primary me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-secondary me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-success me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-danger me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-warning me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-info me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-light me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-dark me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        {/* /Spinner */}
        {/* Spinner */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Grow Spinner</h5>
            </div>
            <div className="card-body">
              <div className="spinner-grow me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        {/* /Spinner */}
        {/* Spinner */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Colored Grow Spinner</h5>
            </div>
            <div className="card-body">
              <div className="spinner-grow text-primary me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-secondary me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-success me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-danger me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-warning me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-info me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-light me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-dark me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        {/* /Spinner */}
        {/* Spinner */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Flex Alignment</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <strong>Loading...</strong>
                <div
                  className="spinner-border"
                  role="status"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
        {/* /Spinner */}
        {/* Spinner */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Float Alignment</h5>
            </div>
            <div className="card-body">
              <div className="spinner-border float-end me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        {/* /Spinner */}
        {/* Spinner */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Different Sizes</h5>
            </div>
            <div className="card-body">
              <div className="spinner-border spinner-border-sm me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow spinner-grow-sm me-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow me-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border spinner-border-lg me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow spinner-grow-lg me-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        {/* /Spinner */}
        {/* Spinner */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Buttons</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-primary mb-1 me-1"
                type="button"
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="sr-only">Loading...</span>
              </button>
              <button
                className="btn btn-primary mb-1 me-1"
                type="button"
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </button>
              <button
                className="btn btn-primary mb-1 me-1"
                type="button"
                disabled
              >
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="sr-only">Loading...</span>
              </button>
              <button
                className="btn btn-primary mb-1 me-1"
                type="button"
                disabled
              >
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </button>
            </div>
          </div>
        </div>
        {/* /Spinner */}
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

)};
export default Spinner;        
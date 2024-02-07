import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactStickyNotes from '@react-latest-ui/react-sticky-notes';
const Stickynote = () => {
  return (
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
                <span>Sticky Note</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Sticky Note</li>
              </ul>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Sticky */}
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">
                    Sticky Note{" "}                    
                  </h5>
                </div>
                <div className="card-body">
                  <ReactStickyNotes />
                </div>
              </div>
            </div>
            {/* /Sticky */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>

  )
};
export default Stickynote;        
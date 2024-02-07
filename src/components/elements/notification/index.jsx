import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import alertify from "alertifyjs";
import "../../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../../node_modules/alertifyjs/build/css/themes/semantic.css";
const Notification = () => {
 
  const handleSuccess = () => {   
    alertify.success("Success message");
  }

  const handleError = () => {    
    alertify.error("Error message");
  }

  const handleWarning = () => {    
    alertify.warning("Warning message");
  }

  const handleAlertBoxClick = () => {
    alertify.alert("Custom Heading", "This is an alert dialog.", function () {      
      alertify.success("OK");
    });
  }

  const handleOkCancelConfirmation = () => {
    alertify.confirm(
      "Custom Heading",
      "This is a confirm dialog.",
      function () {
        alertify.success("Ok");
      },
      function () {
        alertify.error("Cancel");
      }
    );
  }

  const handlePrompt= () => {
    alertify.prompt(
      "Custom Heading",
      "This is a prompt dialog.",
      "Default value",
      function (evt, value) {
        alertify.success("Ok: " + value);
      },
      function () {
        alertify.error("Cancel");
      }
    );
  }
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
                <span>Notification</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Notification</li>
              </ul>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Alert */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Alert</div>
                </div>
                <div className="card-body">
                  <Link
                    to="#"
                    id="alert"
                    className="btn btn-primary waves-effect waves-light"
                    onClick={handleAlertBoxClick}
                  >
                    Click me
                  </Link>
                </div>
              </div>
            </div>
            {/* /Alert */}
            {/* Alert */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Confirm</div>
                </div>
                <div className="card-body">
                  <Link
                    to="#"
                    id="alert-confirm"
                    className="btn btn-primary waves-effect waves-light"
                    onClick={handleOkCancelConfirmation}
                  >
                    Click me
                  </Link>
                </div>
              </div>
            </div>
            {/* /Alert */}
            {/* Alert */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Prompt</div>
                </div>
                <div className="card-body">
                  <Link
                    to="#"
                    id="alert-prompt"
                    className="btn btn-primary waves-effect waves-light"
                    onClick={handlePrompt}
                  >
                    Click me
                  </Link>
                </div>
              </div>
            </div>
            {/* /Alert */}
            {/* Alert */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Success Alert</div>
                </div>
                <div className="card-body">
                  <Link
                    to="#"
                    id="alert-success"
                    className="btn btn-primary btn-sm waves-effect waves-light"
                    onClick={handleSuccess}
                  >
                    Click me
                  </Link>
                </div>
              </div>
            </div>
            {/* /Alert */}
            {/* Alert */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Error Alert</div>
                </div>
                <div className="card-body">
                  <Link
                    to="#"
                    id="alert-error"
                    className="btn btn-primary btn-sm waves-effect waves-light"
                    onClick={handleError}
                  >
                    Click me
                  </Link>
                </div>
              </div>
            </div>
            {/* /Alert */}
            {/* Alert */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Warning Alert</div>
                </div>
                <div className="card-body">
                  <Link
                    to="#"
                    id="alert-warning"
                    className="btn btn-primary btn-sm waves-effect waves-light"
                    onClick={handleWarning}
                  >
                    Click me
                  </Link>
                </div>
              </div>
            </div>
            {/* /Alert */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>

  )
};
export default Notification;        
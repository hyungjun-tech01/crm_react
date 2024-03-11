import React from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
const Invoicesettings = () => {
  return (
    <>
      {/* Page Wrapper */}
      <HelmetProvider>
        <div className="page-wrapper">
          <Helmet>
            <title>Invoice- CRMS admin Template</title>
            <meta name="description" content="Reactify Blank Page" />
          </Helmet>
          {/* Page Content */}
          <div className="content container-fluid">
            <div className="crms-title row bg-white">
              <div className="col  p-0">
                <h3 className="page-title m-0">
                  <span className="page-title-icon bg-gradient-primary text-white me-2">
                    <i className="fa fa-file" aria-hidden="true" />
                  </span>{" "}
                  Invoice{" "}
                </h3>
              </div>
              <div className="col p-0 text-end">
                <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                  <li className="breadcrumb-item">
                    <Link to="/index">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Invoice</li>
                </ul>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-xl-3 col-md-4">
                <div className="widget settings-menu">
                  <ul>
                    <li className="nav-item">
                      <Link to="/invoices-settings" className="nav-link active">
                        <i className="fa fa-cog me-2" aria-hidden="true" />
                        <span>General Settings</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/tax-settings" className="nav-link">
                        <i className="fa fa-bookmark me-2" />{" "}
                        <span>Tax Settings</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/bank-settings" className="nav-link">
                        <i className="fa fa-university me-2" />{" "}
                        <span>Bank Settings</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-9 col-md-8">
                <div className="card invoices-settings-card">
                  <div className="card-header px-3">
                    <h5 className="card-title">General Settings</h5>
                  </div>
                  <div className="card-body">
                    {/* Form */}
                    <form action="#" className="invoices-settings-form">
                      <div className="row align-items-center form-group">
                        <label
                          htmlFor="name"
                          className="col-sm-3 col-form-label input-label"
                        >
                          Invoice Status
                        </label>
                        <div className="col-sm-9">
                          <label className="custom_check">
                            <input type="checkbox" name="invoice" />
                            <span className="checkmark" /> Change invoice status
                            to paid after an order is complete
                          </label>
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <label
                          htmlFor="email"
                          className="col-sm-3 col-form-label input-label"
                        >
                          Invoice Amount
                        </label>
                        <div className="col-sm-9">
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <label
                          htmlFor="phone"
                          className="col-sm-3 col-form-label input-label"
                        >
                          Invoice number starts with
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="$"
                            defaultValue="$"
                          />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <label
                          htmlFor="addressline1"
                          className="col-sm-3 col-form-label input-label"
                        >
                          Prefix
                        </label>
                        <div className="col-sm-9">
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <label
                          htmlFor="addressline2"
                          className="col-sm-3 col-form-label input-label"
                        >
                          Number Reset
                        </label>
                        <div className="col-sm-9">
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <label
                          htmlFor="zipcode"
                          className="col-sm-3 col-form-label input-label"
                        >
                          Default Due Time
                        </label>
                        <div className="col-sm-9">
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="row align-items-center form-group ">
                        <label
                          htmlFor="zipcode"
                          className="col-sm-3 col-form-label input-label"
                        >
                          Default Digital Signatory
                        </label>
                        <div className="col-sm-9">
                          <div className="invoices-upload-btn">
                            <input
                              type="file"
                              accept="image/*"
                              name="image"
                              id="file"
                              className="hide-input"
                            />
                            <label htmlFor="file" className="upload">
                              upload File
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <label
                          htmlFor="zipcode"
                          className="col-sm-3 col-form-label input-label"
                        >
                          Default Digital Name
                        </label>
                        <div className="col-sm-9">
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="invoice-setting-btn text-end">
                        <button type="submit" className="btn cancel-btn me-2">
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                    {/* /Form */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Content */}
        </div>
      </HelmetProvider>
      {/* /Page Wrapper */}
    </>
  );
};
export default Invoicesettings;

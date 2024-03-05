import React, { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { BiData } from "react-icons/bi";
import DatePicker from "react-datepicker";
import { C_logo, C_logo2, CircleImg } from '../imagepath';
import { atomCurrentCompany } from "../../atoms/atoms";

const CompanyDetailInfo = () => {
  const currentCompany = useRecoilValue(atomCurrentCompany);
  const [selectedDate1, setSelectedDate1] = useState(new Date());

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Companies - CRMS admin Template</title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
      <div className="content container-fluid">
        <div className="crms-title row bg-white">
          <div className="col">
            <h3 className="page-title m-0">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                {/* <i className="feather-database" /> */}
                <i>
                  <BiData />
                </i>
              </span>{" "}
              Company Detail Infos.{" "}
            </h3>
          </div>
          <div className="col text-end">
            <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Companies</li>
            </ul>
          </div>
        </div>
        {/* Page Header */}
        <div className="page-header pt-3 mb-0 ">
          <div className="row">
            <div className="col text-end">
              <ul className="list-inline-item pl-0">
                <li className="nav-item dropdown list-inline-item add-lists">
                  <a
                    className="nav-link dropdown-toggle"
                    id="profileDropdown"
                    href="#"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="nav-profile-text">
                      <i className="fa fa-th" aria-hidden="true" />
                    </div>
                  </a>
                  <div
                    className="dropdown-menu navbar-dropdown"
                    aria-labelledby="profileDropdown"
                  >
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#add-new-list"
                    >
                      Add New List View
                    </a>
                  </div>
                </li>
                <li className="list-inline-item">
                  <button
                    className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                    id="add-task"
                    data-bs-toggle="modal"
                    data-bs-target="#add_company"
                  >
                    New Company
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        <div className="row w-100">
            <div className="col-md-7 account d-flex">
              <div className="company_img">
                <img
                  src={C_logo}
                  alt="User"
                  className="user-image"
                />
              </div>
              <div>
                <p className="mb-0">Company</p>
                <span className="modal-title">{currentCompany.company_name}</span>
                <span className="rating-star">
                  <i className="fa fa-star" aria-hidden="true" />
                </span>
                <span className="lock">
                  <i className="fa fa-lock" aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <form>
                    <h4>Organization Name</h4>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <label className="col-form-label">
                          Organization Name{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Organization Name"
                          name="organization"
                          value={currentCompany.company_name}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Organization</label>
                        <select className="form-control">
                          <option>Select</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          placeholder="Title"
                        />
                      </div>
                    </div>
                    <h4>Organization Contact Details</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          placeholder="Phone"
                          value={currentCompany.company_phone_number}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Fax</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fax"
                          placeholder="Fax"
                          value={currentCompany.company_fax_number}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Website</label>
                        <input
                          type="text"
                          className="form-control"
                          name="website"
                          placeholder="Website"
                          value={currentCompany.homepage}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Linkedin</label>
                        <input
                          type="text"
                          className="form-control"
                          name="linkedin"
                          placeholder="Linkedin"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Facebook</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fb"
                          placeholder="Facebook"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Twitter</label>
                        <input
                          type="text"
                          className="form-control"
                          name="twitter"
                          placeholder="Twitter"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Email Domains</label>
                        <input
                          type="text"
                          className="form-control"
                          name="domains"
                          placeholder="Email Domains"
                          value={currentCompany.email}
                        />
                      </div>
                    </div>
                    <h4>Address Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">
                          Billing Address
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          name="billing-address"
                          placeholder="Billing Address"
                          defaultValue={""}
                          value={currentCompany.company_address}
                        />
                      </div>
                      <div className="col-sm-6 mt-3">
                        <label className="col-form-label" />
                        <br />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Billing City"
                          name="billing-city"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Billing State"
                          name="billing-state"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Billing Postal code"
                          name="billing-postal-code"
                          value={currentCompany.company_zip_code}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">
                          Billing Country
                        </label>
                        <select className="form-control">
                          <option>India</option>
                          <option>US</option>
                          <option>Japan</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">
                          Shipping Address
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          name="shipping-address"
                          placeholder="Shipping Address"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Shipping City"
                          name="shipping-city"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Shipping State"
                          name="shipping-state"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Shipping Postal code"
                          name="shipping-postal-code"
                        />
                      </div>
                      <div className="col-sm-6">
                        <select className="form-control">
                          <option>India</option>
                          <option>US</option>
                          <option>Japan</option>
                        </select>
                      </div>
                    </div>
                    <h4>Additional Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">
                          Dates To Remember{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="cal-icon">
                          <DatePicker
                            className="form-control"
                            selected={selectedDate1}
                            onChange={handleDateChange1}
                            dateFormat="dd/MM/yyyy"
                            showDayMonthYearPicker
                          />
                        </div>
                      </div>
                    </div>
                    <h4>Description Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <label className="col-form-label">Description </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          id="description"
                          placeholder="Description"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <h4>Tag Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <label className="col-form-label">Tag List</label>
                        <input
                          type="text"
                          className="form-control"
                          name="tag-name"
                          placeholder="Tag List"
                        />
                      </div>
                    </div>
                    <h4>Permissions</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Permission</label>
                        <select className="form-control">
                          <option>Task Visibility</option>
                          <option>Private Task</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-center py-3">
                      <button
                        type="button"
                        className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      >
                        Save
                      </button>
                      &nbsp;&nbsp;
                      <button
                        type="button"
                        className="btn btn-secondary btn-rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};
export default CompanyDetailInfo;

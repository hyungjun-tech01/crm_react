import React,{useState} from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Select from 'react-select';
const Localization =()=> {
  const	time=[
    {label : "(UTC +5:30) Antarctica/Palmer",value : 1},
    {label : "(UTC+05:30) India",value : 2},
];
  const	hours=[
    {label : "12 Hours",value : 1},
    {label : "24 Hours",value : 2},
    {label : "36 Hours",value : 3},
    {label : "48 Hours",value : 4},
    {label : "60 Hours",value : 5},
];
  const	symbol=[
    {label : "$",value : 1},
    {label : "₹",value : 2},
    {label : "£",value : 3},
    {label : "€",value : 4}    
];
const	date=[
  {label : "15 May 2016",value : 1},
  {label : "15/05/2016",value : 2},
  {label : "15.05.2016",value : 3},
  {label : "15-05-2016",value : 4},
  {label : "05/15/2016",value : 5},
  {label : "2016/05/15",value : 6},
  {label : "2016-05-15",value : 7},
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
          <li className="nav-item ">
            <Link className="nav-link" to="/settings">
              General Settings
            </Link>
          </li>
          <li className="nav-item active">
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
              <h5 className="card-title">Localization Details</h5>
            </div>
            <div className="card-body pt-0">
              <form>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Time Zone</label>
                    <Select
                          placeholder = "Select"
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={time}
                      />
                  </div>
                  <div className="form-group">
                    <label>Date Format</label>
                    <Select
                          placeholder = "Select"
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={date}
                      />
                  </div>
                  <div className="form-group">
                    <label>Time Format</label>
                    <Select
                          placeholder = "Select"
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={hours}
                      />
                  </div>
                  <div className="form-group">
                    <label>Currency Symbol</label>
                    <Select
                          placeholder = "Select"
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={symbol}
                      />
                  </div>
                  <div className="form-group mb-0">
                    <div className="settings-btns">
                      <button
                        type="submit"
                        className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      >
                        Update
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

)};
export default Localization;
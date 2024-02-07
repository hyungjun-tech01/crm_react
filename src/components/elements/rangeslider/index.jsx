import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../../../assets/plugins/ion-rangeslider/css/ion.rangeSlider.min.css"
import "../../../assets/plugins/ion-rangeslider/js/ion.rangeSlider.min.js"
import "../../../assets/plugins/ion-rangeslider/js/custom-rangeslider.js"

const Rangeslider = () => {
  
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
                <span>Range Slider</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Range Slider</li>
              </ul>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Default</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_01" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Min-Max</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_02" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Prefix</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_03" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Range</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_04" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Step</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_05" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Custom Values</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_06" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Modern skin</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_13" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Sharp Skin</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_14" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Round skin</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_15" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
            {/* Rangeslider */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Square Skin</h5>
                </div>
                <div className="card-body">
                  <input type="text" id="range_16" />
                </div>
              </div>
            </div>
            {/* /Rangeslider */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>

  )
};
export default Rangeslider;        
import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
const Ribbon =()=>{
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
            <span>Ribbons</span>
          </h3>
        </div>
        <div className="col text-end">
          <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
            <li className="breadcrumb-item">
              <Link to="/index">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Ribbons</li>
          </ul>
        </div>
      </div>
      {/* /Page Header */}
      <div className="row">
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-primary">Ribbon</div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-secondary">Ribbon</div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-success">Ribbon</div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-primary ribbon-right">Ribbon</div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-secondary  ribbon-right">
                Ribbon
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-success ribbon-right">Ribbon</div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-vertical-left-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-primary ribbon-vertical-left">
                <i className="fa fa-gift" />
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-vertical-left-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-secondary  ribbon-vertical-left">
                <i className="fa fa-gift" />
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-vertical-left-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-success ribbon-vertical-left">
                <i className="fa fa-gift" />
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-vertical-right-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-primary ribbon-vertical-right">
                <i className="fa fa-gift" />
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-vertical-right-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-secondary  ribbon-vertical-right">
                <i className="fa fa-gift" />
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
        {/* Ribbon */}
        <div className="col-md-4 col-sm-6">
          <div className="ribbon-vertical-right-wrapper card">
            <div className="card-body">
              <div className="ribbon ribbon-success ribbon-vertical-right">
                <i className="fa fa-gift" />
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

)};
export default Ribbon;        
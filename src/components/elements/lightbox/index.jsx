import React from 'react';
import { Link } from "react-router-dom";
import SimpleReactLightbox from 'simple-react-lightbox'
import { SRLWrapper } from "simple-react-lightbox";
import {IMG01,IMG02,IMG03,IMG04,IMG05} from './img.jsx'
import { Helmet } from "react-helmet";
import MyComponent from './mycomponent.jsx';
import Description from './description'

const LightBox =()=>{
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
            <span>Lightbox</span>
          </h3>
        </div>
        <div className="col text-end">
          <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
            <li className="breadcrumb-item">
              <Link to="/index">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Lightbox</li>
          </ul>
        </div>
      </div>
      {/* /Page Header */}
      <div className="row">
        {/* Lightbox */}
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Single Image Lightbox</div>
            </div>
            <div className="card-body">
            <SimpleReactLightbox>
                <MyComponent/>
            </SimpleReactLightbox>
            </div>
          </div>
        </div>
        {/* /Lightbox */}
        {/* Lightbox */}
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Image with Description</div>
            </div>
            <div className="card-body">
            <SimpleReactLightbox>
                <Description/>
            </SimpleReactLightbox>
            </div>
          </div>
        </div>
        {/* /Lightbox */}
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

)};
export default LightBox;        
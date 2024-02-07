/**
 * Blank Page
 */
 import React from 'react';
 import { Helmet } from "react-helmet";
 import { Link } from "react-router-dom";
 
const Blank =()=> {
     return (
         
            <div className="page-wrapper">
              <Helmet>
               <title>Blank Page - CRMS admin Template</title>
               <meta name="description" content="Reactify Blank Page" />
             </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
            {/* Page Header */}
            <div className="crms-title row bg-white mb-4">
              <div className="col  p-0">
                <h3 className="page-title">
                  <span className="page-title-icon bg-gradient-primary text-white me-2">
                    <i className="fas fa-columns" />
                  </span> Blank Page </h3>
              </div>
              <div className="col p-0 text-end">
                <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                  <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Blank Page</li>
                </ul>
              </div>
            </div>
            {/* /Page Header */}
            {/* Content Starts */}
            Content Starts Here
            {/* /Content End */}
            </div>
            {/* /Page Content */}
          </div>
         
     );
   }
export default Blank;
 
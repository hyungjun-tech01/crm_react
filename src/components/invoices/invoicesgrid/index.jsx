import React from 'react';
import { Link } from "react-router-dom";
import InvoicesReport from './report.jsx'
import { Helmet } from "react-helmet";
import { FiGrid, FiList } from 'react-icons/fi';

const InvoicesGrid =()=>{
    return(
        <>
        {/* Page Wrapper */}
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
                <div className="row align-items-center">
                    <div className="col"></div>
                    <div className="col-auto py-3">
                    <Link to="/invoices" className="invoices-links ">
                        <FiList /> 
                    </Link>
                    <Link to="/invoice-grid" className="invoices-links active">
                        <FiGrid /> 
                    </Link>
                    </div>
                </div>
                <InvoicesReport/>
            </div>
            {/* /Page Content */}
        </div>
        {/* /Page Wrapper */}
        </>
    )};
    export default InvoicesGrid;    
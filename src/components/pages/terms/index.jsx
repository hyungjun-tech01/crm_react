import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Terms =()=> {
    return (
      <div className="page-wrapper">
      <Helmet>
        <title>Terms - CRMS admin Template</title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
        <div className="content container-fluid">
            <div className="crms-title row bg-white mb-4">
                <div className="col  p-0">
                    <h3 className="page-title m-0">
                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span> Terms </h3>
                </div>
                <div className="col p-0 text-end">
                    <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Terms</li>
                    </ul>
                </div>
            </div>
            <div className="small-container card p-3">
                <div className="inner-content">
                    <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <h3>Etiam blandit   lacus</h3>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <h3>Maecenas sit amet</h3>
                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

            </div>
        </div>
      </div>
    );
  }
export default Terms;

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Error404 =()=> {
  // useEffect(() => {
  //   document.body.classList.add('error-page');
  //   return () => document.body.classList.remove("error-page");
  // }, [])
    return (
        <>
          <Helmet>
                <title>Error 404 - CRMS Admin Template</title>
                <meta name="description" content="Login page"/>					
          </Helmet>
          <div className="error-box">
            <h1>404</h1>
            <h3> <i className="fa fa-warning"></i> Oops! Page not found! </h3>
            <p>The page you requested was not found.</p>
            {/* <Link onClick={() => localStorage.setItem("firstload", "true")} to="/index" className="btn btn-custom btn-gradient-primary btn-rounded">Back to Home</Link > */}
            <a href="/index" className="btn btn-custom btn-gradient-primary btn-rounded">Back to Home</a>
          </div>
        </>
    );
  }
export default Error404;

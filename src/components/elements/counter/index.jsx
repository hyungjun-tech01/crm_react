import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import CountUp from 'react-countup';
const Counter = () => {
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
                <span>Counter</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Counter</li>
              </ul>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Counter */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5>Clients</h5>
                  <h6 className="counter"><CountUp end={3000} /></h6>
                </div>
              </div>
            </div>
            {/* /Counter */}
            {/* Counter */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5>Total Sales</h5>
                  <h6 className="counter"><CountUp end={10000} /></h6>
                </div>
              </div>
            </div>
            {/* /Counter */}
            {/* Counter */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5>Total Projects</h5>
                  <h6 className="counter"><CountUp end={15000} /></h6>
                </div>
              </div>
            </div>
            {/* /Counter */}
            {/* Counter */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Count Down</h5>
                </div>
                <div className="card-body">
                  <h6>Time Count from 3</h6>
                  <CountUp
                    start={60}
                    end={0}
                    duration={60}
                    prefix="00 Day 00 : 03 :"
                  />
                </div>
              </div>
            </div>
            {/* /Counter */}
            {/* Counter */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Count Up</h5>
                </div>
                <div className="card-body">
                  <h6>Time Counting From 0</h6>
                  <CountUp
                    end={60}
                    duration={60}
                    prefix="00 Day 00 : 00 :"
                  />
                </div>
              </div>
            </div>
            {/* /Counter */}
            {/* Counter */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Count Inbetween</h5>
                </div>
                <div className="card-body">
                  <h6>Time counting from 30 to 20</h6>
                  <CountUp
                    end={30}
                    duration={10}
                    prefix="00 Day 00 : 00 :"
                  />
                </div>
              </div>
            </div>
            {/* /Counter */}
            {/* Counter */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Count Callback</h5>
                </div>
                <div className="card-body">
                  <h6>Count from 10 to 0 and calls timer end callback</h6>
                  <CountUp
                    start={10}
                    end={0}
                    duration={10}
                    prefix="00 Day 00 : 00 :"
                    onEnd={() => { return "calls timer end" }}
                  />
                </div>
              </div>
            </div>
            {/* /Counter */}
            {/* Counter */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Custom Output</h5>
                </div>
                <div className="card-body">
                  <h6>Changed output pattern</h6>
                  <span id="timer-outputpattern" />
                  <CountUp
                    start={60}
                    end={0}
                    duration={60}
                    prefix="02 Days 23 Hour 59 Min "
                    suffix=' Sec..'
                  />
                </div>
              </div>
            </div>
            {/* /Counter */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>


  )
};
export default Counter;        
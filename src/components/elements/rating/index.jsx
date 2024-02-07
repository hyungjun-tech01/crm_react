import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../../../assets/css/font-awesome.min.css"
import ReactStars from "react-rating-stars-component";
import { Rate } from 'antd';
const Rating = () => {
  const ratingChanged = (newRating) => {
    console.log(newRating);
  };
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
                <span>Rating</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Rating</li>
              </ul>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Rating */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Default Rating</h5>
                </div>
                <div className="card-body">
                  <p>This is the most basic example of ratings.</p>
                  <div className="rating rating-default" />
                  <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                  />
                </div>
              </div>
            </div>
            {/* /Rating */}
            {/* Rating */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Score</h5>
                </div>
                <div className="card-body">
                  <p>Stars with a saved rating.</p>
                  <div className="rating rating-score" />
                  <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                    value={3}
                  />
                </div>
              </div>
            </div>
            {/* /Rating */}
            {/* Rating */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Max Number</h5>
                </div>
                <div className="card-body">
                  <p>Change the max numbers of stars</p>
                  <div className="rating rating-number" />
                  <ReactStars
                    count={10}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                  />
                </div>
              </div>
            </div>
            {/* /Rating */}
            {/* Rating */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Read Only</h5>
                </div>
                <div className="card-body">
                  <p>Prevent users from voting</p>
                  <div className="rating rating-read-only2" />
                  <Rate disabled defaultValue={2} />
                </div>
              </div>
            </div>
            {/* /Rating */}
            {/* Rating */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Half Rating</h5>
                </div>
                <div className="card-body">
                  <p>You can represent a float score as a half star icon.</p>
                  <div className="rating rating-half-enable" />
                  <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                    value={3.5}
                    isHalf={true}
                  />
                </div>
              </div>
            </div>
            {/* /Rating */}
            {/* Rating */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Custom Icon</h5>
                </div>
                <div className="card-body">
                  <p>Use any icon you want.</p>                  
                  <ReactStars
                    count={5}
                    icon={<i className="fa fa-heart-o"></i>}                    
                    size={24}
                    activeColor="#FF0000"                    
                  />
                </div>
              </div>
            </div>
            {/* /Rating */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>

  )
};
export default Rating;        
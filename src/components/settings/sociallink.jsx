import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FiFacebook, FiLinkedin, FiTrash, FiTrash2, FiTwitter, FiYoutube } from "react-icons/fi";
const Sociallink =()=> {
  useEffect(() => {
      $(document).on("click",".add-links",function () {
        var experiencecontent = '<div class="links-info"><div class="row form-row links-cont">' +
                '<div class="form-group form-placeholder d-flex">' +
                    '<button class="btn social-icon"><i class="feather-github"></i></button>' +
                    '<input type="text" class="form-control me-1" placeholder="Social Link">' +
                    '<a href="#" class="btn trash">' +
                    <FiTrash2 class="feather-trash-2"/> +
                    '</a>'+
                '</div>' +
            '</div>' +
        '</div>';
        
        $(".settings-form").append(experiencecontent);
        return false;
    });
    $(".settings-form").on('click','.trash', function () {
      $(this).closest('.links-cont').remove();
      return false;
  });
  }, [])
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
              <Link to="/">Dashboard</Link>
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
          <li className="nav-item ">
            <Link className="nav-link" to="/localization-details">
              Localization
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="/payment-settings">
              Payment Settings
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="/email-settings">
              Email Settings
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="/social-settings">
              Social Media Login
            </Link>
          </li>
          <li className="nav-item active">
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
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Social Link Settings</h5>
            </div>
            <div className="card-body pt-0">
              <form>
                <div className="settings-form">
                  <div className="links-info">
                    <div className="row form-row links-cont">
                      <div className="form-group form-placeholder d-flex">
                        <button className="btn social-icon">
                          <FiFacebook />
                        </button>
                        <input
                          type="text"
                          className="form-control me-1"
                          placeholder="https://www.facebook.com"
                        />
                        <a href="/#" className="btn trash">
                          <FiTrash />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="links-info">
                    <div className="row form-row links-cont">
                      <div className="form-group form-placeholder d-flex">
                        <button className="btn social-icon">
                          <FiTwitter />
                        </button>
                        <input
                          type="text"
                          className="form-control me-1"
                          placeholder="https://www.twitter.com"
                        />
                        <a href="#" className="btn trash">
                          <FiTrash />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="links-info">
                    <div className="row form-row links-cont">
                      <div className="form-group form-placeholder d-flex">
                        <button className="btn social-icon">
                          <FiYoutube />
                        </button>
                        <input
                          type="text"
                          className="form-control me-1"
                          placeholder="https://www.youtube.com"
                        />
                        <a href="#" className="btn trash">
                          <FiTrash />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="links-info">
                    <div className="row form-row links-cont">
                      <div className="form-group form-placeholder d-flex">
                        <button className="btn social-icon">
                          <FiLinkedin />
                        </button>
                        <input
                          type="text"
                          className="form-control me-1"
                          placeholder="https://www.linkedin.com"
                        />
                        <a href="#" className="btn trash">
                          <FiTrash />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group text-end">
                  <a href="#" className="btn add-links">
                    <i className="fa fa-plus me-1" /> Add More
                  </a>
                </div>
                <div className="form-group mb-0">
                  <div className="settings-btns">
                    <button
                      type="submit"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded me-1"
                    >
                      Submit
                    </button>
                    <button
                      type="submit"
                      className="btn btn-secondary btn-rounded me-1"
                    >
                      Cancel
                    </button>
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
export default Sociallink;
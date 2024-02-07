import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo,S_Logo,avatar02,avatar03,avatar05,avatar06,avatar08,avatar09,
      avatar13,avatar17,avatar21,Flag_de,Flag_es,Flag_fr,Flag_us } from '../imagepath';
import { FiBell, FiSearch } from "react-icons/fi";
import { BiMessageRounded } from "react-icons/bi";

const Header =(props)=> {
    const exclusionArray = ["login", "register", "forgot-password", "error-404", "error-500"];
    if (
      exclusionArray.indexOf(props.location.pathname.split("/")[1]) >= 0
    ) {
      return "";
    }
    const {  location } = props
    let pathname = location.pathname

    return (
      <div className="header" id="heading">
        {/* Logo */}
        <div className="header-left">
          <a href="/" className="logo">
            <img src={Logo} alt="Logo" className="sidebar-logo" />
            <img src={S_Logo} alt="Logo" className="mini-sidebar-logo" />
          </a>
        </div>
        {/* /Logo */}
        <a id="toggle_btn">
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </a>
        {/* Header Title */}
        <div className="page-title-box">
          <div className="top-nav-search">
            <a className="responsive-search">
              <i className="fa fa-search" />
            </a>
            <form action="search.html">
              <input className="form-control" type="text" placeholder="Search here" />
              <button className="btn" type="submit"><FiSearch /></button>
            </form>
          </div>
        </div>
        {/* /Header Title */}
        <a id="mobile_btn" className="mobile_btn" href="#sidebar"><i className="fa fa-bars" /></a>
        {/* Header Menu */}
        <ul className="nav user-menu">
          {/* Search */}
          <li className="nav-item">
          </li>
          {/* /Search */}
          {/* Flag */}
          <li className="nav-item dropdown has-arrow flag-nav">
            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button">
              <img src={Flag_us} alt="" height={20} /> <span>English</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item">
                <img src={Flag_us} alt="" height={16} /> English
              </a>
              <a className="dropdown-item">
                <img src={Flag_fr} alt="" height={16} /> French
              </a>
              <a className="dropdown-item">
                <img src={Flag_es} alt="" height={16} /> Spanish
              </a>
              <a className="dropdown-item">
                <img src={Flag_de} alt="" height={16} /> German
              </a>
            </div>
          </li>
          {/* /Flag */}
          {/* Notifications */}
          <li className="nav-item dropdown">
            <a className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
              <FiBell /> <span className="badge badge-pill">3</span>
            </a>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <a className="clear-noti"> Clear All </a>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message">
                    <a href="/activities">
                      <div className="media">
                        <span className="avatar">
                          <img alt="" src={avatar02} />
                        </span>
                        <div className="media-body">
                          <p className="noti-details"><span className="noti-title">John Doe</span> added new task <span className="noti-title">Patient appointment booking</span></p>
                          <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="/activities">
                      <div className="media">
                        <span className="avatar">
                          <img alt="" src={avatar03} />
                        </span>
                        <div className="media-body">
                          <p className="noti-details"><span className="noti-title">Tarah Shropshire</span> changed the task name <span className="noti-title">Appointment booking with payment gateway</span></p>
                          <p className="noti-time"><span className="notification-time">6 mins ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="/activities">
                      <div className="media">
                        <span className="avatar">
                          <img alt="" src={avatar06} />
                        </span>
                        <div className="media-body">
                          <p className="noti-details"><span className="noti-title">Misty Tison</span> added <span className="noti-title">Domenic Houston</span> and <span className="noti-title">Claire Mapes</span> to project <span className="noti-title">Doctor available module</span></p>
                          <p className="noti-time"><span className="notification-time">8 mins ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="/activities">
                      <div className="media">
                        <span className="avatar">
                          <img alt="" src={avatar17} />
                        </span>
                        <div className="media-body">
                          <p className="noti-details"><span className="noti-title">Rolland Webber</span> completed task <span className="noti-title">Patient and Doctor video conferencing</span></p>
                          <p className="noti-time"><span className="notification-time">12 mins ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="/activities">
                      <div className="media">
                        <span className="avatar">
                          <img alt="" src={avatar13} />
                        </span>
                        <div className="media-body">
                          <p className="noti-details"><span className="noti-title">Bernardo Galaviz</span> added new task <span className="noti-title">Private chat module</span></p>
                          <p className="noti-time"><span className="notification-time">2 days ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <a href="/activities">View all Notifications</a>
              </div>
            </div>
          </li>
          {/* /Notifications */}
          {/* Message Notifications */}
          
          <li className="nav-item dropdown">
            <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
              <BiMessageRounded /> <span className="badge badge-pill">8</span>
            </a>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Messages</span>
                <a href="" className="clear-noti"> Clear All </a>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message">
                    <a href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={avatar09} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Richard Miles </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={avatar02} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">John Doe</span>
                          <span className="message-time">6 Mar</span>
                          <div className="clearfix" />
                          <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={avatar03} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Tarah Shropshire </span>
                          <span className="message-time">5 Mar</span>
                          <div className="clearfix" />
                          <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={avatar05} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Mike Litorus</span>
                          <span className="message-time">3 Mar</span>
                          <div className="clearfix" />
                          <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={avatar08} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Catherine Manseau </span>
                          <span className="message-time">27 Feb</span>
                          <div className="clearfix" />
                          <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <a href="#">View all Messages</a>
              </div>
            </div>
          </li>
          {/* /Message Notifications */}
          <li className="nav-item dropdown has-arrow main-drop">
            <a className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
              <span className="user-img"><img src={avatar21} alt="" />
                <span className="status online" /></span>
              <span>Admin</span>
            </a>
            <div className="dropdown-menu">
              <Link className="dropdown-item" to="/profile">My Profile</Link>
              <Link className="dropdown-item" to="/settings">Settings</Link>
              <Link className="dropdown-item" to="/login">Logout</Link>
            </div>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}        
        <div className="dropdown mobile-user-menu">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v"></i>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="/profile">My Profile</Link>
            <Link className="dropdown-item" to="/settings">Settings</Link>
            <Link className="dropdown-item" to="/">Logout</Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    );
  }
export default Header;

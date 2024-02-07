import React from "react";
import { Link, withRouter } from "react-router-dom";

const SidebarNav =()=> {
  const goToBackPage = () => {
    window.location.href = "/index";
  }
   return (
    <div className="sidebar" id="sidebar">
    <div className="sidebar-inner slimscroll">
      <form action="search.html" className="mobile-view">
        <input className="form-control" type="text" placeholder="Search here" />
        <button className="btn" type="button"><i className="fa fa-search" /></button>
      </form>
      <div className="sidebar-menu">
        <ul>
        <li> 
            <button onClick={goToBackPage} className="email-back-btn"><i className="fa fa-home" aria-hidden="true" /> <span>Back to Home</span></button>
          </li>
          <li className="active"> 
            <Link to="/email"><i className="fa fa-envelope menu-icon" aria-hidden="true" /> <span>Inbox <span className="mail-count">(21)</span></span></Link>
          </li>
          <li> 
            <Link to="#"><i className="fa fa-star menu-icon" aria-hidden="true" /> <span>Starred</span></Link>
          </li>
          <li> 
            <Link to="#"><i className="fa fa-paper-plane menu-icon" aria-hidden="true" /> <span>Sent Mail</span></Link>
          </li>
          <li> 
            <Link to="#"><i className="fa fa-trash menu-icon" aria-hidden="true" /> <span>Trash</span></Link>
          </li>
          <li> 
            <Link to="#"><i className="fa fa-folder-open-o menu-icon" aria-hidden="true" /> <span>Draft <span className="mail-count">(8)</span></span></Link>
          </li>
          <li className="menu-title xs-hidden">Label <Link to="#" className="label-icon"><i className="fa fa-plus" /></Link></li>
          <li className="xs-hidden"> 
            <Link to="#"><i className="fa fa-circle text-success mail-label" /> Work</Link>
          </li>
          <li className="xs-hidden"> 
            <Link to="#"><i className="fa fa-circle text-danger mail-label" /> Office</Link>
          </li>
          <li className="xs-hidden"> 
            <Link to="#"><i className="fa fa-circle text-warning mail-label" /> Personal</Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
  );
}
export default withRouter(SidebarNav);

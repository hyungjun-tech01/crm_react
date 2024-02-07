import React from "react";
import { Link, withRouter } from "react-router-dom";

const SidebarNav = (props) => {
  const goToBackPage = () => {
    window.location.href = "/index";
  }
  return (
    <div className="sidebar stickyside" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <form action="/search" className="mobile-view">
          <input className="form-control" type="text" placeholder="Search here" />
          <button className="btn" type="button"><i className="fa fa-search" /></button>
        </form>
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li>
              <button className="backk-btn" onClick={goToBackPage} >Back To Home</button>
            </li>
            <li className="menu-title">
              Components
            </li>
            <li>
              <a href="#comp_alerts">Alerts</a>
            </li>
            <li>
              <a href="#comp_breadcrumbs">Breadcrumbs</a>
            </li>
            <li>
              <a href="#comp_buttons">Buttons</a>
            </li>
            <li>
              <a href="#comp_cards">Cards</a>
            </li>
            <li>
              <a href="#comp_dropdowns">Dropdowns</a>
            </li>
            <li>
              <a href="#comp_pagination">Pagination</a>
            </li>
            <li>
              <a href="#comp_progress">Progress</a>
            </li>
            <li>
              <a href="#comp_tabs">Tabs</a>
            </li>
            <li>
              <a href="#comp_typography">Typography</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default withRouter(SidebarNav);

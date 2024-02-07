import React, { useEffect, useState } from "react";
import config from "config";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Header from "./components/header/index";
//dashboard
import Dashboard from "./components/dashboard";
import ProjectDashboard from "./components/dashboard/projectdashboard";
import LeadDashboard from "./components/dashboard/leaddashboard";
//pages
import FAQ from "./components/pages/faq";
import Privacypolicy from "./components/pages/privacy";
import Terms from "./components/pages/terms";
import BlankPage from "./components/pages/blank";
//error
import Error404 from "./components/error/error-404";
import Error500 from "./components/error/error-500";
//email
import Components from "./components/components";
//component
import Email from "./components/email";
import Mailview from "./components/email/mail-view";
import Lead from "./components/lead";
import Task from "./components/task";
import BasicTable from "./components/table/basictable";
import DataTable from "./components/table/datatable";
import BasicInput from "./components/forms/basic-input";
import InputGroup from "./components/forms/form-input-group";
import HorizontalForm from "./components/forms/horizontal-form";
import VerticalForm from "./components/forms/vertical-form";
import FormMask from "./components/forms/form-mask";
import Project from "./components/project";
import Projectkanbanview from "./components/project/kanbanview";
//activities
import Reports from "./components/report";
import Activities from "./components/activites";
import Deals from "./components/deals";
import Dealskanbanview from "./components/deals/dealskanbanview";

//blogs
import Blogs from "./components/blogs/blogs";
import PendingBlog from "./components/blogs/blogs/pendingblog";
import AddBlog from "./components/blogs/addblog/index";
import EditBlog from "./components/blogs/editblog/index";
import Categories from "./components/blogs/categories/index";

//Invoices
import Invoiceslist from "./components/invoices/invoiceslist/invoices";
import InvoicesPaid from "./components/invoices/invoiceslist/paid";
import InvoicesOverdue from "./components/invoices/invoiceslist/overdue";
import InvoicesDraft from "./components/invoices/invoiceslist/draft";
import InvoicesRecurring from "./components/invoices/invoiceslist/recurring";
import InvoicesCancelled from "./components/invoices/invoiceslist/cancelled";
import InvoicesGrid from "./components/invoices/invoicesgrid/index";
import AddInvoices from "./components/invoices/addinvoices/index";
import EditInvoices from "./components/invoices/editinvoices/index";
import ViewInvoices from "./components/invoices/invocesdetails/index";
import Invoicesettings from "./components/invoices/invoicesettings/index";
import Taxsettings from "./components/invoices/invoicesettings/taxsettings";
import Banksettings from "./components/invoices/invoicesettings/banksettings";

// Elements
import Sweetalerts from './components/elements/sweetalerts/index'
import Tooltip from './components/elements/tooltip/index'
import Popover from './components/elements/popover/index'
import Ribbon from './components/elements/ribbon/index'
import Clipboard from './components/elements/clipboard/index'
import Dragdrop from './components/elements/dragdrop/dragdrop'
import Rangeslider from './components/elements/rangeslider/index'
import Rating from './components/elements/rating/index'
import Toastr from './components/elements/toastr/index'
import Texteditor from './components/elements/texteditor/index'
import Counter from './components/elements/counter/index'
import Scrollbar from './components/elements/scrollbar/index'
import Spinner from './components/elements/spinner/index'
import Notification from './components/elements/notification/index'
import Lightbox from './components/elements/lightbox/index'
import Stickynote from './components/elements/stickynote/index'
import Timeline from './components/elements/timeline/index'
import Horizontaltimeline from './components/elements/horizontaltimeline/index'
import Formwizard from './components/elements/formwizard/index'


// Charts
import ApexCharts from "./components/charts/apexcharts/index";
import ChartJs from "./components/charts/chartjs/index";
import MorrisChart from "./components/charts/morrischarts/index";
import FlotChart from "./components/charts/flotcharts/index";
import C3Charts from "./components/charts/c3charts/index";
import PeityCharts from "./components/charts/peitycharts/index";

// Icons
import Fontawesome from "./components/icons/font-awesome/index";
import Feather from "./components/icons/feather/index";
import Flag from "./components/icons/flag/index";
import Ionic from "./components/icons/ionic/index";
import Material from "./components/icons/material/index";
import PE7 from "./components/icons/pe7/index";
import Simpleline from "./components/icons/simpleline/index";
import Themify from "./components/icons/themify/index";
import Typicon from "./components/icons/typicon/index";
import Weather from "./components/icons/weather/index";
// Settings
import Settings from "./components/settings";
import Emailsettings from "./components/settings/email";
import Localization from "./components/settings/localization";
import Othersettings from "./components/settings/othersettings";
import Payment from "./components/settings/payment";
import Seosettings from "./components/settings/seosettings.jsx";
import Sociallink from "./components/settings/sociallink";
import Socialmedia from "./components/settings/socialmedia";

import FormValidation from "./components/forms/form-validation";
import Profile from "./components/profile";
import Contacts from "./components/contact";
import Company from "./components/company";
import Sidebarnav from "./components/sidebar";


// Login & Register
import Login from "./components/login";
import Register from "./components/register";


import 'antd/dist/antd.css';
import "./assets/css/bootstrap.min.css"
import "./assets/css/font-awesome.min.css"
import "./assets/css/feather.css";
import "./assets/css/line-awesome.min.css";
import "./assets/css/theme-settings.css";
import "./assets/css/style.css";


import "react-datepicker/dist/react-datepicker.css";
import "./assets/js/bootstrap.bundle.js";
import "./assets/js/jquery.slimscroll.min.js";
import "./assets/js/theme-settings.js";
import "./assets/js/app.js";
import SystemUserModel from "./components/task/SystemUserModel";
import TaskDetailModel from "./components/task/TaskDetailModel";
import CompanyDetailsModel from "./components/company/CompanyDetailsModel";
import LeadsDetailsModel from "./components/lead/LeadsDetailsModel";
import Leadskanbanview from "./components/lead/kanbanview";
import DealDetailsModel from "./components/deals/DealDetailsModel";
import CompanyDetails from "./components/deals/CompanyDetails";
import ProjectDetailsModel from "./components/project/ProjectDetailsModel";
import InvoicesReport from "./components/invoices/invoicesgrid/report";

const AppUniversal = (props) => {  
//   function toggleTheme(e) {     
//   if($('.themecls').length > 0) {    
//     const currentTheme = localStorage.getItem('theme');
//     var app = document.getElementsByClassName("themecls")[0];
//     if (currentTheme) {
//         app.href = "../src/css/"+currentTheme+".css";
//     }    
//         app.href = "../src/css/"+e+".css";
//         localStorage.setItem('theme', e);
//     }

// }
  useEffect(() => {    
    document.querySelector(".roboto-font").onclick = function () {
      document.body.classList.add("roboto");
      document.body.classList.remove("inter");
      document.body.classList.remove("monstret");
      document.body.classList.remove("poppins");
    };
    document.querySelector(".poppins-font").onclick = function () {
      document.body.classList.remove("roboto");
      document.body.classList.remove("inter");
      document.body.classList.remove("monstret");
      document.body.classList.add("poppins");
    };
    document.querySelector(".montserrat-font").onclick = function () {
      document.body.classList.remove("roboto");
      document.body.classList.remove("inter");
      document.body.classList.add("monstret");
      document.body.classList.remove("poppins");
    };

    document.querySelector(".inter-font").onclick = function () {
      document.body.classList.remove("roboto");
      document.body.classList.add("inter");
      document.body.classList.remove("monstret");
      document.body.classList.remove("poppins");
    };

    document.querySelector(".font-Default").onclick = function () {
      document.body.classList.remove("roboto");
      document.body.classList.add("inter");
      document.body.classList.remove("monstret");
      document.body.classList.remove("poppins");
    }
  }, [])

  const url = props.location.pathname.split("/")[1];
  const exclusionArray = ["login", "register", "forgot-password", "error-404", "error-500"];
  return (
    <Router basename={`${config.publicPath}`}>
      <div className="main-wrapper">
        <Route render={(props) => <Header {...props} />} />        
            <Route render={(props) => <Sidebarnav {...props} />} />
        <Switch>
          {/* Dashboard */}
          <Route path="/" exact component={Dashboard} />
          <Route path="/index" exact component={Dashboard} />
          <Route path="/projects-dashboard" exact component={ProjectDashboard} />
          <Route path="/leads-dashboard" exact component={LeadDashboard} />
          <Route path="/tasks" exact component={Task} />
          <Route path="/SystemUserModel" exact component={SystemUserModel} />
          <Route path="/TaskDetailModel" exact component={TaskDetailModel} />
          <Route path="/contacts" exact component={Contacts} />
          <Route path="/companies" exact component={Company} />
          <Route path="/CompanyDetailsModel" exact component={CompanyDetailsModel} />
          <Route path="/leads" exact component={Lead} />
          <Route path="/LeadsDetailsModel" exact component={LeadsDetailsModel} />
          <Route path="/leads-kanban-view" exact component={Leadskanbanview} />
          <Route path="/deals" exact component={Deals} />
          <Route path="/DealDetailsModel" exact component={DealDetailsModel} />
          <Route path="/CompanyDetails" exact component={CompanyDetails} />
          <Route path="/deals-kanban-view" exact component={Dealskanbanview} />
          <Route path="/projects" exact component={Project} />
          <Route path="/ProjectDetailsModel" exact component={ProjectDetailsModel} />
          <Route path="/projects-kanban-view" exact component={Projectkanbanview} />
          <Route path="/reports" exact component={Reports} />
          <Route path="/activities" exact component={Activities} />
          <Route path="/blog" exact component={Blogs} />
          <Route path="/pending-blog" exact component={PendingBlog} />
          <Route path="/add-blog" exact component={AddBlog} />
          <Route path="/edit-blog" exact component={EditBlog} />
          <Route path="/categories" exact component={Categories} />

          {/* Invoices */}
          <Route path="/invoices" exact component={Invoiceslist} />
          <Route path="/invoices-paid" exact component={InvoicesPaid} />
          <Route path="/invoices-overdue" exact component={InvoicesOverdue} />
          <Route path="/invoices-draft" exact component={InvoicesDraft} />
          <Route path="/invoices-recurring" exact component={InvoicesRecurring} />
          <Route path="/invoices-cancelled" exact component={InvoicesCancelled} />
          <Route path="/invoice-grid" exact component={InvoicesGrid} />
          <Route path="/InvoicesReport" exact component={InvoicesReport} />
          <Route path="/add-invoice" exact component={AddInvoices} />
          <Route path="/edit-invoice" exact component={EditInvoices} />
          <Route path="/view-invoice" exact component={ViewInvoices} />
          <Route path="/invoices-settings" exact component={Invoicesettings} />
          <Route path="/tax-settings" exact component={Taxsettings} />
          <Route path="/bank-settings" exact component={Banksettings} />

          {/* Settings */}
          <Route path="/email-settings" exact component={Emailsettings} />
          <Route path="/localization-details" exact component={Localization} />
          <Route path="/others-settings" exact component={Othersettings} />
          <Route path="/payment-settings" exact component={Payment} />
          <Route path="/seo-settings" exact component={Seosettings} />
          <Route path="/social-links" exact component={Sociallink} />
          <Route path="/social-settings" exact component={Socialmedia} />
          {/* Email   */}
          <Route path="/email" exact component={Email} />
          <Route path="/mail-view" exact component={Mailview} />
          {/* Error Pages */}
          <Route path="/error-404" exact component={Error404} />
          <Route path="/error-500" exact component={Error500} />
          {/* Pages */}
          <Route path="/faq" exact component={FAQ} />
          <Route path="/terms" exact component={Terms} />
          <Route path="/privacy-policy" exact component={Privacypolicy} />
          <Route path="/blank-page" exact component={BlankPage} />
          {/* UI Interface */}
          <Route path="/components" exact component={Components} />

          {/* Elements */}
          <Route path="/sweetalerts" exact component={Sweetalerts} />
          <Route path="/popover" exact component={Popover} />
          <Route path="/ribbon" exact component={Ribbon} />
          <Route path="/clipboard" exact component={Clipboard} />
          <Route path="/drag-drop" exact component={Dragdrop} />
          <Route path="/rating" exact component={Rating} />
          <Route path="/toastr" exact component={Toastr} />
          <Route path="/text-editor" exact component={Texteditor} />
          <Route path="/counter" exact component={Counter} />
          <Route path="/scrollbar" exact component={Scrollbar} />
          <Route path="/spinner" exact component={Spinner} />
          <Route path="/notification" exact component={Notification} />
          <Route path="/lightbox" exact component={Lightbox} />
          <Route path="/stickynote" exact component={Stickynote} />
          <Route path="/timeline" exact component={Timeline} />

          <Route path="/tooltip" exact component={Tooltip} />
          <Route path="/rangeslider" exact component={Rangeslider} />
          <Route path="/horizontal-timeline" exact component={Horizontaltimeline} />
          <Route path="/form-wizard" exact component={Formwizard} />

          {/* Charts */}
          <Route path="/chart-apex" exact component={ApexCharts} />
          <Route path="/chart-js" exact component={ChartJs} />
          <Route path="/chart-morris" exact component={MorrisChart} />
          <Route path="/chart-flot" exact component={FlotChart} />
          <Route path="/chart-peity" exact component={PeityCharts} />
          <Route path="/chart-c3" exact component={C3Charts} />

          {/* Icons */}
          <Route path="/icon-fontawesome" exact component={Fontawesome} />
          <Route path="/icon-feather" exact component={Feather} />
          <Route path="/icon-ionic" exact component={Ionic} />
          <Route path="/icon-material" exact component={Material} />
          <Route path="/icon-pe7" exact component={PE7} />
          <Route path="/icon-simpleline" exact component={Simpleline} />
          <Route path="/icon-themify" exact component={Themify} />
          <Route path="/icon-weather" exact component={Weather} />
          <Route path="/icon-typicon" exact component={Typicon} />
          <Route path="/icon-flag" exact component={Flag} />

          {/* Forms */}
          <Route path="/form-basic-inputs" exact component={BasicInput} />
          <Route path="/form-input-groups" exact component={InputGroup} />
          <Route path="/form-horizontal" exact component={HorizontalForm} />
          <Route path="/form-vertical" exact component={VerticalForm} />
          <Route path="/form-mask" exact component={FormMask} />
          <Route path="/form-validation" exact component={FormValidation} />
          {/* ForTablesms */}
          <Route path="/tables-basic" exact component={BasicTable} />
          <Route path="/data-tables" exact component={DataTable} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/settings" exact component={Settings} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />

        </Switch>
      </div>      
      {/*theme settings modal*/}
      <div className="modal right fade settings" id="settings" role="dialog" aria-modal="true">
        <div className="toggle-close">
          <div className="toggle" data-bs-toggle="modal" data-bs-target="#settings"><i className="fa fa-cog fa-w-16 fa-spin fa-2x" />
          </div>
        </div>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header p-3">
              <h4 className="modal-title" id="myModalLabel2">Theme Customizer</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pb-3">
              <div className="scroll">
                {/* <div>
                  <ul className="list-group">
                    <li className="list-group-item border-0">
                      <div className="row">
                        <div className="col">
                          <h5 className="pb-2">Primary Skin</h5>
                        </div>
                        <div className="col text-end">
                          <a className="reset text-white bg-dark" id="ChangeprimaryDefault">Reset Default</a>
                        </div>
                      </div>
                      <div className="theme-settings-swatches">
                        <div className="themes">
                          <div className="themes-body">
                            <ul id="theme-changes" class="theme-colors border-0 list-inline-item list-unstyled mb-0">

                              <li class="theme-title">Solid Color</li>
                              <li class="list-inline-item"><span class="theme-defaults bg-warnings" onClick={() =>toggleTheme('style')}></span></li>
                              <li class="list-inline-item"><span class="theme-solid-purple bg-warning1" onClick={() =>toggleTheme('style-green')}></span></li>
                              <li class="list-inline-item"><span class="theme-solid-black bg-blue" onClick={() =>toggleTheme('style-blue')}></span></li>
                              <li class="list-inline-item"><span class="theme-solid-pink bg-orange" onClick={() =>toggleTheme('style-orange')}></span></li>
                              <li class="list-inline-item"><span class="theme-solid-pink bg-pink" onClick={() =>toggleTheme('style-pink')}></span></li>
                              <li class="list-inline-item"><span class="theme-solid-purle bg-purple" onClick={() =>toggleTheme('style-purple')}></span></li>
                              <li class="list-inline-item"><span class="theme-solid-danger bg-dangers" onClick={() =>toggleTheme('style-red')}></span></li>
                              <li><br /></li>
                              <li><hr /></li>

                              <li class="theme-title">Gradient Color</li>


                              <li class="list-inline-item"><span class="theme-orange bg-sunny-mornings" onClick={() =>toggleTheme('style-gradient-blue')}></span></li>
                              <li class="list-inline-item"><span class="theme-blue bg-tempting-azures" onClick={() =>toggleTheme('style-gradient-green')}></span></li>
                              <li class="list-inline-item"><span class="theme-grey bg-amy-crisps" onClick={() =>toggleTheme('style-gradient-maroon')}></span></li>
                              <li class="list-inline-item"><span class="theme-lgrey bg-mean-fruits" onClick={() =>toggleTheme('style-gradient-orange')}></span></li>
                              <li class="list-inline-item"><span class="theme-dblue bg-malibu-beachs" onClick={() =>toggleTheme('style-gradient-pink')}></span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div> */}
                <div>
                  <ul className="list-group">
                    <li className="list-group-item border-0">
                      <div className="row">
                        <div className="col">
                          <h5 className="pb-2">Header Style</h5>
                        </div>
                        <div className="col text-end">
                          <a className="reset text-white bg-dark" id="ChageheaderDefault">Reset Default</a>
                        </div>
                      </div>
                      <div className="theme-settings-swatches">
                        <div className="themes">
                          <div className="themes-body">
                            <ul id="theme-change1" className="theme-colors border-0 list-inline-item list-unstyled mb-0">
                              <li className="theme-title">Solid Color</li>
                              <li className="list-inline-item"><span className="header-solid-black bg-black" /></li>
                              <li className="list-inline-item"><span className="header-solid-pink bg-primary" /></li>
                              <li className="list-inline-item"><span className="header-solid-orange bg-secondary1" /></li>
                              <li className="list-inline-item"><span className="header-solid-purple bg-success" /></li>
                              {/* <li class="list-inline-item"><span class="header-solid-blue bg-info"></span></li> */}
                              <li className="list-inline-item"><span className="header-solid-green bg-warnings" /></li>
                              <li><br /></li>
                              <li><hr /></li>
                              <li className="theme-title">Gradient Color</li>
                              <li className="list-inline-item"><span className="header-gradient-color1 bg-sunny-morning" /></li>
                              <li className="list-inline-item"><span className="header-gradient-color2 bg-tempting-azure" /></li>
                              <li className="list-inline-item"><span className="header-gradient-color3 bg-amy-crisp" /></li>
                              <li className="list-inline-item"><span className="header-gradient-color4 bg-mean-fruit" /></li>
                              <li className="list-inline-item"><span className="header-gradient-color5 bg-malibu-beach" /></li>
                              <li className="list-inline-item"><span className="header-gradient-color6 bg-ripe-malin" /></li>
                              <li className="list-inline-item"><span className="header-gradient-color7 bg-plum-plate" /></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="list-group m-0">
                    <li className="list-group-item border-0">
                      <div className="row">
                        <div className="col">
                          <h5 className="pb-2">Apps Sidebar Style</h5>
                        </div>
                        <div className="col  text-end">
                          <a className="reset text-white bg-dark" id="ChagesidebarDefault">Reset Default</a>
                        </div>
                      </div>
                      <div className="theme-settings-swatches">
                        <div className="themes">
                          <div className="themes-body">
                            <ul id="theme-change2" className="theme-colors border-0 list-inline-item list-unstyled">
                              <li className="theme-title">Solid Color</li>
                              <li className="list-inline-item"><span className="sidebar-solid-black bg-black" /></li>
                              <li className="list-inline-item"><span className="sidebar-solid-pink bg-primary" /></li>
                              <li className="list-inline-item"><span className="sidebar-solid-orange bg-secondary1" /></li>
                              <li className="list-inline-item"><span className="sidebar-solid-purple bg-success" /></li>
                              {/* <li class="list-inline-item"><span class="sidebar-solid-blue bg-info"></span></li> */}
                              <li className="list-inline-item"><span className="sidebar-solid-green bg-warnings" /></li>
                              <li><br /></li>
                              <li><hr /></li>
                              <li className="theme-title">Gradient Color</li>
                              <li className="list-inline-item"><span className="sidebar-gradient-color1 bg-sunny-morning" /></li>
                              <li className="list-inline-item"><span className="sidebar-gradient-color2 bg-tempting-azure" /></li>
                              <li className="list-inline-item"><span className="sidebar-gradient-color3 bg-amy-crisp" /></li>
                              <li className="list-inline-item"><span className="sidebar-gradient-color4 bg-mean-fruit" /></li>
                              <li className="list-inline-item"><span className="sidebar-gradient-color5 bg-malibu-beach" /></li>
                              <li className="list-inline-item"><span className="sidebar-gradient-color6 bg-ripe-malin" /></li>
                              <li className="list-inline-item"><span className="sidebar-gradient-color7 bg-plum-plate" /></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="row Default-font">
                    <div className="col">
                      <h5 className="pb-2">Font Style</h5>
                    </div>
                    <div className="col text-end">
                      <a className="reset text-white bg-dark font-Default">Reset Default</a>
                    </div>
                  </div>
                  <ul className="list-inline-item list-unstyled font-family border-0 p-0">
                    <li className="list-inline-item roboto-font">Roboto</li>
                    <li className="list-inline-item poppins-font">Poppins</li>
                    <li className="list-inline-item montserrat-font">Montserrat</li>
                    <li className="list-inline-item inter-font">Inter</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/*theme settings*/}
      {exclusionArray.indexOf(url) >= 0 ? "" : <div className="sidebar-contact">
        <div className="toggle" data-bs-toggle="modal" data-bs-target="#settings"><i className="fa fa-cog fa-w-16 fa-spin fa-2x" /></div>
      </div>}
    </Router>
  );
}
export default AppUniversal;

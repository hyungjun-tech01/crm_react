import React from 'react';
import { C_logo, C_logo2, Circle1, CircleImg } from '../imagepath';
import 'antd/dist/antd.css';
import { Collapse } from 'antd';
import { Link } from "react-router-dom";

const CompanyDetails = () => {
  const { Panel } = Collapse;
    return (
        <>
         <div className="modal right fade" id="company-details" tabIndex={-1} role="dialog" aria-modal="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <div className="row w-100">
            <div className="col-md-7 account d-flex">
              <div className="company_img">
                <img
                  src={C_logo}
                  alt="User"
                  className="user-image"
                />
              </div>
              <div>
                <p className="mb-0">Company</p>
                <span className="modal-title">Globex</span>
                <span className="rating-star">
                  <i className="fa fa-star" aria-hidden="true" />
                </span>
                <span className="lock">
                  <i className="fa fa-lock" aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="col-md-5 text-end">
              <ul className="list-unstyled list-style-none">
                <li className="dropdown list-inline-item">
                  <br />
                  <Link
                    className="dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {" "}
                    Actions{" "}
                  </Link>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="#">
                      Edit This Company
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Change Organization Image
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Delete This Organization
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Change Record Owner
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Generate Merge Document
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Print This Organization
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Add New Task For Organization
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Add New Event For Organization
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Add Activity Set To Organization
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Add New Contact For Organization
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Add New Opportunity For Organization
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Add New Opportunity For Organization
                    </Link>
                    <Link className="dropdown-item" to="#">
                      Add New Project For Organization
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            className="btn-close xs-close"
            data-bs-dismiss="modal"
          />
        </div>
        <div className="card due-dates">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <span>Title</span>
                <p>Lorem ipsum</p>
              </div>
              <div className="col">
                <span>Companies</span>
                <p>Claimpett Corp</p>
              </div>
              <div className="col">
                <span>Phone</span>
                <p>9876764875</p>
              </div>
              <div className="col">
                <span>Email</span>
                <p>johndoe@gmail.com</p>
              </div>
              <div className="col">
                <span>Contact owner</span>
                <p>John Doe</p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="task-infos">
            <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="#task-details"
                  data-bs-toggle="tab"
                >
                  Details
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#task-related"
                  data-bs-toggle="tab"
                >
                  Related
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#task-activity"
                  data-bs-toggle="tab"
                >
                  Activity
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#task-news" data-bs-toggle="tab">
                  News
                </Link>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane show active" id="task-details">
                <div className="crms-tasks">
                  <div className="tasks__item crms-task-item active">
                    <Collapse accordion expandIconPosition='right'>
                          <Panel header="Organization Name" key="1">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="border-0">Record ID</td>
                              <td className="border-0">124192692</td>
                            </tr>
                            <tr>
                              <td>Organization Name</td>
                              <td>Clampett Oil and Gas Corp.</td>
                            </tr>
                          </tbody>
                        </table>
                        </Panel>
                        </Collapse>
                  </div>
                  <div className="tasks__item crms-task-item">
                    <Collapse accordion expandIconPosition='right'>
                          <Panel header="Organization Contact Details" key="1">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="border-0">Phone</td>
                              <td className="border-0">(626) 847-1294</td>
                            </tr>
                            <tr>
                              <td>Fax</td>
                              <td>1234</td>
                            </tr>
                            <tr>
                              <td>Website</td>
                              <td>google.com</td>
                            </tr>
                            <tr>
                              <td>LinkedIn</td>
                              <td>Lorem Ipsum</td>
                            </tr>
                            <tr>
                              <td>Facebook</td>
                              <td>Lorem ipsum</td>
                            </tr>
                            <tr>
                              <td>Twitter</td>
                              <td>Not Started</td>
                            </tr>
                            <tr>
                              <td>Email Domains</td>
                              <td>abc@gmail.com</td>
                            </tr>
                          </tbody>
                        </table>
                        </Panel>
                        </Collapse>
                  </div>
                  <div className="tasks__item crms-task-item">
                    <Collapse accordion expandIconPosition='right'>
                          <Panel header="Address Information" key="1">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="border-0">Billing Address</td>
                              <td className="border-0">
                                1000 Escalon Street, Palo Alto, CA, 94020,
                                United States map
                              </td>
                            </tr>
                            <tr>
                              <td>Shipping Addres</td>
                              <td>Escalon Street</td>
                            </tr>
                          </tbody>
                        </table>
                        </Panel>
                        </Collapse>
                  </div>
                  <div className="tasks__item crms-task-item">
                    <Collapse accordion expandIconPosition='right'>
                          <Panel header="Additional Information" key="1">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Dates to remember</td>
                              <td>09/01/2020</td>
                            </tr>
                            <tr>
                              <td>Organization Created</td>
                              <td>03-Jun-20 1:14 AM</td>
                            </tr>
                            <tr>
                              <td>Date of Next Activity </td>
                              <td>03/03/2018</td>
                            </tr>
                            <tr>
                              <td>Date of Last Activity </td>
                              <td>03/03/2020</td>
                            </tr>
                          </tbody>
                        </table>
                        </Panel>
                        </Collapse>
                  </div>
                  <div className="tasks__item crms-task-item">
                    <Collapse accordion expandIconPosition='right'>
                          <Panel header="Description Information" key="1">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Description</td>
                              <td>Lorem ipsum </td>
                            </tr>
                          </tbody>
                        </table>
                        </Panel>
                        </Collapse>
                  </div>
                  <div className="tasks__item crms-task-item">
                    <Collapse accordion expandIconPosition='right'>
                          <Panel header="Tag Information" key="1">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="border-0">Tag List</td>
                              <td className="border-0">Lorem Ipsum</td>
                            </tr>
                          </tbody>
                        </table>
                        </Panel>
                        </Collapse>
                  </div>
                </div>
              </div>
              <div className="tab-pane task-related" id="task-related">
                <div className="row">
                  <div className="col-md-4">
                    <div className="card bg-gradient-danger card-img-holder text-white h-100">
                      <div className="card-body">
                        <img
                          src={CircleImg}
                          className="card-img-absolute"
                          alt="circle-image"
                        />
                        <h4 className="font-weight-normal mb-3">Companies</h4>
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-gradient-info card-img-holder text-white h-100">
                      <div className="card-body">
                        <img
                          src={CircleImg}
                          className="card-img-absolute"
                          alt="circle-image"
                        />
                        <h4 className="font-weight-normal mb-3">Deals</h4>
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-gradient-success card-img-holder text-white h-100">
                      <div className="card-body">
                        <img
                          src={CircleImg}
                          className="card-img-absolute"
                          alt="circle-image"
                        />
                        <h4 className="font-weight-normal mb-3">Projects</h4>
                        <span>1</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-md-4">
                    <div className="card bg-gradient-success card-img-holder text-white h-100">
                      <div className="card-body">
                        <img
                          src={CircleImg}
                          className="card-img-absolute"
                          alt="circle-image"
                        />
                        <h4 className="font-weight-normal mb-3">Contacts</h4>
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-gradient-danger card-img-holder text-white h-100">
                      <div className="card-body">
                        <img
                          src={CircleImg}
                          className="card-img-absolute"
                          alt="circle-image"
                        />
                        <h4 className="font-weight-normal mb-3">Notes</h4>
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-gradient-info card-img-holder text-white h-100">
                      <div className="card-body">
                        <img
                          src={CircleImg}
                          className="card-img-absolute"
                          alt="circle-image"
                        />
                        <h4 className="font-weight-normal mb-3">Files</h4>
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="crms-tasks  p-2">
                    <div className="tasks__item crms-task-item active">
                      <Collapse accordion expandIconPosition='right'>
                          <Panel header="Companies" key="1">
                            <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                              <thead>
                                <tr>
                                  <th>Company Name</th>
                                  <th>Phone</th>
                                  <th>Billing Country</th>
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <Link to="#" className="avatar">
                                      <img
                                        alt=""
                                        src={C_logo2}
                                      />
                                    </Link>
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#company-details"
                                    >
                                      Clampett Oil and Gas Corp.
                                    </Link>
                                  </td>
                                  <td>8754554531</td>
                                  <td>United States</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <Link to="#" className="avatar">
                                      <img alt="" src={C_logo} />
                                    </Link>
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#company-details"
                                    >
                                      Acme Corporation
                                    </Link>
                                  </td>
                                  <td>8754554531</td>
                                  <td>United States</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            </Panel>
                        </Collapse>
                    </div>
                    <div className="tasks__item crms-task-item">
                      <Collapse accordion expandIconPosition='right'>
                          <Panel header="Deals" key="1">
                            <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                              <thead>
                                <tr>
                                  <th>Deal Name</th>
                                  <th>Company</th>
                                  <th>User Responsible</th>
                                  <th>Deal Value</th>
                                  <th />
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Bensolet</td>
                                  <td>Globex</td>
                                  <td>John Doe</td>
                                  <td>USD $‎180</td>
                                  <td>
                                    <i
                                      className="fa fa-star"
                                      aria-hidden="true"
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Ansanio tech</td>
                                  <td>Lecto</td>
                                  <td>John Smith</td>
                                  <td>USD $‎180</td>
                                  <td>
                                    <i
                                      className="fa fa-star"
                                      aria-hidden="true"
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            </Panel>
                        </Collapse>
                    </div>
                    <div className="tasks__item crms-task-item">
                      <Collapse accordion expandIconPosition='right'>
                          <Panel header="Projects" key="1">
                            <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                              <thead>
                                <tr>
                                  <th>Project Name</th>
                                  <th>Status</th>
                                  <th>User Responsible</th>
                                  <th>Date Created</th>
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Wilmer Deluna</td>
                                  <td>Completed</td>
                                  <td>Williams</td>
                                  <td>13-Jul-20 11:37 PM</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            </Panel>
                        </Collapse>
                    </div>
                    <div className="tasks__item crms-task-item">
                      <Collapse accordion expandIconPosition='right'>
                          <Panel header="Contacts" key="1">
                            <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Title</th>
                                  <th>phone</th>
                                  <th>Email</th>
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Wilmer Deluna</td>
                                  <td>Call Enquiry</td>
                                  <td>987675656</td>
                                  <td>william@gmail.com</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>John Doe</td>
                                  <td>Enquiry</td>
                                  <td>987675656</td>
                                  <td>john@gmail.com</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            </Panel>
                        </Collapse>
                    </div>
                    <div className="tasks__item crms-task-item">
                      <Collapse accordion expandIconPosition='right'>
                          <Panel header="Notes" key="1">
                            <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Size</th>
                                  <th>Category</th>
                                  <th>Date Added</th>
                                  <th>Added by</th>
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Document</td>
                                  <td>50KB</td>
                                  <td>Phone Call</td>
                                  <td>13-Jul-20 11:37 PM</td>
                                  <td>John Doe</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Finance</td>
                                  <td>100KB</td>
                                  <td>Email Enquiry</td>
                                  <td>13-Jul-20 11:37 PM</td>
                                  <td>Smith</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            </Panel>
                        </Collapse>
                    </div>
                    <div className="tasks__item crms-task-item">
                      <Collapse accordion expandIconPosition='right'>
                          <Panel header="Files" key="1">
                            <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Size</th>
                                  <th>Category</th>
                                  <th>Date Added</th>
                                  <th>Added by</th>
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Document</td>
                                  <td>50KB</td>
                                  <td>Phone Call</td>
                                  <td>13-Jul-20 11:37 PM</td>
                                  <td>John Doe</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Finance</td>
                                  <td>100KB</td>
                                  <td>Email Enquiry</td>
                                  <td>13-Jul-20 11:37 PM</td>
                                  <td>Smith</td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Edit Link
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Delete Link
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            </Panel>
                        </Collapse>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane" id="task-activity">
                <div className="row ">
                  <div className="col-md-4">
                    <div className="card bg-gradient-danger card-img-holder text-white h-100">
                      <div className="card-body">
                        <img
                          src={CircleImg}
                          className="card-img-absolute"
                          alt="circle-image"
                        />
                        <h4 className="font-weight-normal mb-3">
                          Total Activities
                        </h4>
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-gradient-info card-img-holder text-white h-100">
                      <div className="card-body">
                        <img
                          src={CircleImg}
                          className="card-img-absolute"
                          alt="circle-image"
                        />
                        <h4 className="font-weight-normal mb-3">
                          Last Activity
                        </h4>
                        <span>1</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="crms-tasks  p-2">
                    <div className="tasks__item crms-task-item active">
                      <Collapse accordion expandIconPosition='right'>
                          <Panel header="Upcoming Activity" key="1">
                            <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Activity Name</th>
                                  <th>Assigned To</th>
                                  <th>Due Date</th>
                                  <th>Status</th>
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Meeting</td>
                                  <td>Call Enquiry</td>
                                  <td>John Doe</td>
                                  <td>13-Jul-20 11:37 PM</td>
                                  <td>
                                    <label className="container-checkbox">
                                      <input
                                        type="checkbox"
                                        defaultChecked=""
                                      />
                                      <span className="checkmark" />
                                    </label>
                                  </td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Add New Task
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Add New Event
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Meeting</td>
                                  <td>Phone Enquiry</td>
                                  <td>David</td>
                                  <td>13-Jul-20 11:37 PM</td>
                                  <td>
                                    <label className="container-checkbox">
                                      <input
                                        type="checkbox"
                                        defaultChecked=""
                                      />
                                      <span className="checkmark" />
                                    </label>
                                  </td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Add New Task
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Add New Event
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            </Panel>
                        </Collapse>
                    </div>
                    <div className="tasks__item crms-task-item">
                      <Collapse accordion expandIconPosition='right'>
                          <Panel header="Past Activity" key="1">
                            <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Activity Name</th>
                                  <th>Assigned To</th>
                                  <th>Due Date</th>
                                  <th>Status</th>
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Meeting</td>
                                  <td>Call Enquiry</td>
                                  <td>John Doe</td>
                                  <td>13-Jul-20 11:37 PM</td>
                                  <td>
                                    <label className="container-checkbox">
                                      <input
                                        type="checkbox"
                                        defaultChecked=""
                                      />
                                      <span className="checkmark" />
                                    </label>
                                  </td>
                                  <td className="text-center">
                                    <div className="dropdown dropdown-action">
                                      <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="material-icons">
                                          more_vert
                                        </i>
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Add New Task
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          Add New Event
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            </Panel>
                        </Collapse>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane" id="task-news">
                <div className="row">
                  <div className="col-md-12">
                    <h4>News Items</h4>
                    <p>
                      Current news items about this Organization are sourced
                      from Google News
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* modal-content */}
    </div>
    {/* modal-dialog */}
  </div>
        </>
    );
}

export default CompanyDetails;
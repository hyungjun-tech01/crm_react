import React from 'react';
import { Circle1, CircleImg, Task1 } from '../imagepath';
import 'antd/dist/antd.css';
import { Collapse } from 'antd';
import { Link } from "react-router-dom";

const TaskDetailModel = () => {
  const { Panel } = Collapse;
  return (
    <>
      <div className="modal right fade" id="task-details-modal" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <div className="col-md-7 account d-flex">
                  <div className="company_img">
                    <img
                      src={Task1}
                      alt="User"
                      className="user-image"
                    />
                  </div>
                  <div>
                    <p className="mb-0">Task</p>
                    <span className="modal-title">Personalize your Account</span>
                    <span className="rating-star">
                      <i className="fa fa-star" aria-hidden="true" />
                    </span>
                    <span className="lock">
                      <i className="fa fa-lock" aria-hidden="true" />
                    </span>
                  </div>
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
                    <span>Due Date</span>
                    <p>03-Jul-2020</p>
                  </div>
                  <div className="col">
                    <span>Priority</span>
                    <p>Medium</p>
                  </div>
                  <div className="col">
                    <span>Status</span>
                    <p>Not Started</p>
                  </div>
                  <div className="col">
                    <span>Progress</span>
                    <p>0</p>
                  </div>
                  <div className="col">
                    <span>Assigned To</span>
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
                      to="#tasks-details"
                      data-bs-toggle="tab"
                    >
                      Details
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#tasks-related"
                      data-bs-toggle="tab"
                    >
                      Related
                    </Link>
                  </li>
                </ul>
                <div className="tab-content">
                  <div className="tab-pane show active" id="tasks-details">
                    <div className="crms-tasks">
                      <div className="tasks__item crms-task-item active">

                        <Collapse accordion expandIconPosition='right'>
                          <Panel header=" Name &amp; Occupation" key="1">


                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="border-0">Record ID</td>
                                  <td className="border-0">124192692</td>

                                </tr>
                                <tr>
                                  <td className="border-0">Name</td>
                                  <td className="border-0">John Doe</td>
                                </tr>
                                <tr>
                                  <td>Company</td>
                                  <td>Claimpitt</td>
                                </tr>
                                <tr>
                                  <td>Title</td>
                                  <td>Phone Call</td>
                                </tr>
                              </tbody>
                            </table>

                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item">

                        <Collapse accordion expandIconPosition='right'>
                          <Panel header="Task Details" key="1">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="border-0">Record ID</td>
                                  <td className="border-0">124192692</td>
                                </tr>
                                <tr>
                                  <td>Task Name</td>
                                  <td>1. Personalize your account</td>
                                </tr>
                                <tr>
                                  <td>Assigned To</td>
                                  <td>John Doe</td>
                                </tr>
                                <tr>
                                  <td>Category</td>
                                  <td>
                                    <label className="badge badge-gradient-danger">
                                      Get Started
                                    </label>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Date Due</td>
                                  <td>07/12/2000</td>
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
                                  <td>Start Date</td>
                                  <td>05/10/2012</td>
                                </tr>
                                <tr>
                                  <td>Reminder Date</td>
                                  <td>05/01/2012</td>
                                </tr>
                                <tr>
                                  <td>Repeats</td>
                                  <td>Lorem</td>
                                </tr>
                                <tr>
                                  <td>Progress</td>
                                  <td>0%</td>
                                </tr>
                                <tr>
                                  <td>Priorit</td>
                                  <td>Medium</td>
                                </tr>
                                <tr>
                                  <td>Status</td>
                                  <td>Not Started</td>
                                </tr>
                                <tr>
                                  <td>Last Updated</td>
                                  <td>04-Jun-20</td>
                                </tr>
                                <tr>
                                  <td>Created</td>
                                  <td>03-Jun-20 1:14 AM</td>
                                </tr>
                                <tr>
                                  <td>Task Created By</td>
                                  <td>John Doe</td>
                                </tr>
                                <tr>
                                  <td>Task Owner</td>
                                  <td>John Doe</td>
                                </tr>
                              </tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item">
                        <Collapse accordion expandIconPosition='right'>
                          <Panel header="Related To" key="1">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>Related To</td>
                                  <td>Lorem Ipsum</td>
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
                                  <td className="border-0">Description</td>
                                  <td className="border-0">Lorem Ipsum</td>
                                </tr>
                              </tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item">

                        <Collapse accordion expandIconPosition='right'>
                          <Panel header="Task Comments" key="1">
                            <button className="btn btn-secondary text-white w-25">
                              Add Comments
                            </button>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item">

                        <Collapse accordion expandIconPosition='right'>
                          <Panel header="Permissions" key="1">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>Task visibility</td>
                                  <td>Private</td>
                                </tr>
                              </tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane task-related" id="tasks-related">
                    <div className="row pt-2">
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
                        <div className="card bg-gradient-danger card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle-image"
                            />
                            <h4 className="font-weight-normal mb-3">Companies</h4>
                            <span />
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
                            <h4 className="font-weight-normal mb-3">Leads</h4>
                            <span>1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="crms-tasks  p-2">
                        <div className="tasks__item crms-task-item active">

                          <Collapse accordion expandIconPosition='right'>
                            <Panel header="Contacts" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>phone</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Wilmer Deluna</td>
                                    <td>Call Enquiry</td>
                                    <td>987675656</td>
                                    <td>william@gmail.com</td>
                                    <td>
                                      <label className="badge badge-gradient-success">
                                        Not Started
                                      </label>
                                    </td>
                                    <td className="text-end">
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
                                    <td>
                                      <label className="badge badge-gradient-info">
                                        Not Started
                                      </label>
                                    </td>
                                    <td className="text-end">
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
                            <Panel header="Deals " key="1">
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
                                    <td className="text-end">
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
                                    <td className="text-end">
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
                            <Panel header="Projects " key="1">
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
                                    <td className="text-end">
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
                            <Panel header="Companies" key="1">
                              <p>There are no companies added.</p>
                            </Panel>
                          </Collapse>
                        </div>
                        <div className="tasks__item crms-task-item">

                          <Collapse accordion expandIconPosition='right'>
                            <Panel header="Leads " key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Full Name</th>
                                    <th>Company</th>
                                    <th>Phone</th>
                                    <th>Lead Status</th>
                                    <th>Lead Created</th>
                                    <th>Lead Owner</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Wilmer Deluna</td>
                                    <td>Howe-Blanda LLC</td>
                                    <td>978675656</td>
                                    <td>OPEN - NotContacted </td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td>John Doe</td>
                                    <td className="text-end">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskDetailModel;
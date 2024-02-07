import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CircleImg } from "../imagepath"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from "react";
const Dealskanbanview =()=> {    
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };
    return (
      <div className="page-wrapper">
      <Helmet>
        <title>Deals Kanban View - CRMS admin Template</title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="crms-title row bg-white mb-4">
          <div className="col  p-0">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="fas fa-table" />
              </span>Deals Kanban View</h3>
          </div>
          <div className="col p-0 text-end">
            <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Deals Kanban View</li>
            </ul>
          </div>
        </div>
        <div className="page-header  mb-0 ">
          <div className="row">
            <div className="col">
              <div className="dropdown">
                <Link className="dropdown-toggle recently-viewed" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> All Deals</Link>
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to="#">Recently Viewed</Link>
                  <Link className="dropdown-item" to="#">Items I'm following</Link>
                  <Link className="dropdown-item" to="#">All Deals</Link>
                  <Link className="dropdown-item" to="#">All Closed Deals</Link>
                  <Link className="dropdown-item" to="#">All Open Deals</Link>
                  <Link className="dropdown-item" to="#">My Deals</Link>
                </div>
              </div>
            </div>
            <div className="col text-end">
              <ul className="list-inline-item pl-0">
                <li className="dropdown list-inline-item add-lists">
                  <Link className="dropdown-toggle recently-viewed pr-2" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> 
                    <div className="nav-profile-text">
                      <i className="fa fa-cog" aria-hidden="true" />
                    </div>
                  </Link>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="#">Choose Columns</Link>
                    <Link className="dropdown-item" to="#">Group Columns</Link>
                    <Link className="dropdown-item" to="#">Sharing Settings</Link>
                    <Link className="dropdown-item" to="#">Rename</Link>
                    <Link className="dropdown-item" to="#">Clone</Link>
                    <Link className="dropdown-item" to="#">Delete</Link>
                  </div>
                </li>
                <li className="nav-item dropdown list-inline-item add-lists">
                  <Link className="nav-link dropdown-toggle" id="profileDropdown" to="#" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="nav-profile-text">
                      <i className="fa fa-th" aria-hidden="true"></i>
                    </div>
                  </Link> 
                  <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">

                    <Link className="dropdown-item" to="/projects">List View</Link>
                    <Link className="dropdown-item" to="/deals-kanban-view">Kanban View</Link>
                    <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#add-new-list">Add New List View</Link> 
                  </div>
                </li>
                <li className="list-inline-item">
                  <button className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded" id="add-task" data-bs-toggle="modal" data-bs-target="#add_deal">New Deal</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row m-0">
          <div className="col-md-12 grid-margin stretch-card kanban">
            <div>
              <div className="card-body p-0 row">
                <div id="sortableKanbanBoards" className="col-md-12 kanban-views p-0">
                  <div className="panel panel-primary kanban-col m-0">
                    <div className="panel-heading bg-transparent p-0">
                      <h4>Not Contacted (1)</h4>
                      {/* <i class="fa fa-2x fa-plus-circle pull-right"></i> */}
                    </div>
                    <div className="panel-body slimScrollDiv">
                      <div id="TODO" className="kanban-centered">
                        <article className="kanban-entry grab" id="item1" draggable="true">
                          <div className="kanban-entry-inner">
                            <div className="kanban-label card bg-gradient-danger card-img-holder text-white h-100" data-bs-toggle="modal" data-bs-target="#leads-details">
                              <img src={CircleImg} className="card-img-absolute" alt="circle-image" />
                              <h2 data-bs-toggle="modal" data-bs-target="#leads">Anne Lynch</h2>
                              <ul className="list-unstyled">
                                <li>VB of Sales</li>
                                <li>Howwe-Blanda LLC</li>
                              </ul>
                            </div>
                          </div>
                        </article>
                        <article className="kanban-entry grab" id="item2" draggable="true">
                          <div className="kanban-entry-inner">
                            <div className="kanban-label card bg-gradient-info card-img-holder text-white h-100" data-bs-toggle="modal" data-bs-target="#leads-details">
                              <img src={CircleImg} className="card-img-absolute" alt="circle-image" />
                              <h2 data-bs-toggle="modal" data-bs-target="#leads">David Mathews</h2>
                              <ul className="list-unstyled">
                                <li>Finance Director</li>
                                <li>Ebert and Sons</li>
                              </ul>
                            </div>
                          </div>
                        </article>
                        <article className="kanban-entry grab" id="item4" draggable="true">
                          <div className="kanban-entry-inner">
                            <div className="kanban-label card bg-gradient-success card-img-holder text-white h-100" data-bs-toggle="modal" data-bs-target="#leads-details">
                              <img src={CircleImg} className="card-img-absolute" alt="circle-image" />
                              <h2 data-bs-toggle="modal" data-bs-target="#leads">Douglas Baker</h2>
                              <ul className="list-unstyled">
                                <li>Finance Director</li>
                                <li>Ebert and Sons</li>
                              </ul>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-primary kanban-col me-0">
                    <div className="panel-heading bg-transparent p-0">
                      <h4>Attempted Contact (0)</h4>
                      {/* <i class="fa fa-2x fa-plus-circle pull-right"></i> */}
                    </div>
                    <div className="panel-body slimScrollDiv">
                      <div id="DOING" className="kanban-centered">
                        <article className="kanban-entry grab" id="item5" draggable="true">
                          <div className="kanban-entry-inner">
                            <div className="kanban-label card bg-gradient-warning card-img-holder text-white h-100" data-bs-toggle="modal" data-bs-target="#leads-details">
                              <img src={CircleImg} className="card-img-absolute" alt="circle-image" />
                              <h2 data-bs-toggle="modal" data-bs-target="#leads">Douglas Baker</h2>
                              <ul className="list-unstyled">
                                <li>Finance Director</li>
                                <li>Ebert and Sons</li>
                              </ul>
                            </div>
                          </div>
                        </article>
                        <article className="kanban-entry grab" id="item6" draggable="true">
                          <div className="kanban-entry-inner">
                            <div className="kanban-label card bg-gradient-danger card-img-holder text-white h-100" data-bs-toggle="modal" data-bs-target="#leads-details">
                              <img src={CircleImg} className="card-img-absolute" alt="circle-image" />
                              <h2 data-bs-toggle="modal" data-bs-target="#leads">Douglas Baker</h2>
                              <ul className="list-unstyled">
                                <li>Finance Director</li>
                                <li>Ebert and Sons</li>
                              </ul>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-primary kanban-col me-0">
                    <div className="panel-heading bg-transparent p-0">
                      <h4>Contact (2)</h4>
                      {/* <i class="fa fa-2x fa-plus-circle pull-right"></i> */}
                    </div>
                    <div className="panel-body slimScrollDiv">
                      <div id="DONE" className="kanban-centered">
                        <article className="kanban-entry grab" id="item5" draggable="true">
                          <div className="kanban-entry-inner">
                            <div className="kanban-label card bg-gradient-info card-img-holder text-white h-100" data-bs-toggle="modal" data-bs-target="#leads-details">
                              <img src={CircleImg} className="card-img-absolute" alt="circle-image" />
                              <h2 data-bs-toggle="modal" data-bs-target="#leads">Douglas Baker</h2>
                              <ul className="list-unstyled">
                                <li>Finance Director</li>
                                <li>Ebert and Sons</li>
                              </ul>
                            </div>
                          </div>
                        </article>
                        <article className="kanban-entry grab" id="item6" draggable="true">
                          <div className="kanban-entry-inner">
                            <div className="kanban-label card bg-gradient-success card-img-holder text-white h-100" data-bs-toggle="modal" data-bs-target="#leads-details">
                              <img src={CircleImg} className="card-img-absolute" alt="circle-image" />
                              <h2 data-bs-toggle="modal" data-bs-target="#leads">Douglas Baker</h2>
                              <ul className="list-unstyled">
                                <li>Finance Director</li>
                                <li>Ebert and Sons</li>
                              </ul>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-primary kanban-col me-0">
                    <div className="panel-heading bg-secondary bg-transparent p-0">
                      <h4 className="closed">Closed Lost (4)</h4>
                      {/* <i class="fa fa-2x fa-plus-circle pull-right"></i> */}
                    </div>
                    <div className="panel-body slimScrollDiv">
                      <div id="closed" className="kanban-centered">
                        <article className="kanban-entry grab" id="item7" draggable="true">
                          <div className="kanban-entry-inner">
                            <div className="kanban-label card bg-gradient-warning card-img-holder text-white h-100" data-bs-toggle="modal" data-bs-target="#leads-details">
                              <img src={CircleImg} className="card-img-absolute" alt="circle-image" />
                              <h2 data-bs-toggle="modal" data-bs-target="#leads">Douglas Baker</h2>
                              <ul className="list-unstyled">
                                <li>Finance Director</li>
                                <li>Ebert and Sons</li>
                              </ul>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>		
      <div className="modal right fade" id="add_deal" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog" role="document">
          <button type="button" className="close md-close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-center">Add Deal</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <form>
                    <h4>Task Details</h4>
                    <div className="form-group row">
                      <div className="col-md-6">
                        <label className="col-form-label">Deal Name <span className="text-danger">*</span></label>
                        <input className="form-control" type="text" name="deal-name" placeholder="dealname" />
                      </div>
                      <div className="col-md-6">
                        <label className="col-form-label">Company</label>
                        <select className="form-control">
                          <option>Select</option>
                        </select>
                      </div>
                    </div>
                    <h4>Additional Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Caregory</label>
                        <select className="form-control">
                          <option>Email</option>
                          <option>Follow up</option>
                          <option>Get Started</option>
                          <option>Meeting</option>
                          <option>Phone call</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Probability Of Winning</label>
                        <input className="form-control" type="text" name="probability" placeholder="Probability Of Winning" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Forecast Close Date <span className="text-danger">*</span></label>
                        <div className="cal-icon">
                        <DatePicker
                            className="form-control"
                            selected={selectedDate1}
                            onChange={handleDateChange1}
                            dateFormat="dd/MM/yyyy"
                            showDayMonthYearPicker />
                          </div>
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Actual Close Date <span className="text-danger">*</span></label>
                        <div className="cal-icon">
                        <DatePicker
                            className="form-control"
                            selected={selectedDate2}
                            onChange={handleDateChange2}
                            dateFormat="dd/MM/yyyy"
                            showDayMonthYearPicker />
                          </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">User Responsible</label>
                        <select className="form-control">
                          <option>John Doe</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Deal Value</label>
                        <div className="row">
                          <div className="col-md-4">
                            <select className="form-control">
                              <option>USD $</option>
                              <option>UGX $</option>
                            </select>
                          </div>
                          <div className="col-md-4">
                            <input type="text" name="amt" className="form-control" placeholder="Bid Amount" />
                          </div>
                          <div className="col-md-4">
                            <select className="form-control">
                              <option>Fixed Bid</option>
                              <option>Per Hour</option>
                              <option>Per Day</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4>Description Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <label className="col-form-label">Description </label>
                        <textarea className="form-control" rows={3} id="description" placeholder="Description" defaultValue={""} />
                      </div>
                    </div>
                    <h4>Tag Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <label className="col-form-label">Tag List</label>
                        <input type="text" className="form-control" name="tag-name" placeholder="Tag List" />
                      </div>
                    </div>
                    <h4>Pipeline &amp; Stages</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Pipeline</label>
                        <select className="form-control">
                          <option>Deal Pipeline</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="col-form-label">Stage</label>
                        <select className="form-control">
                          <option>select</option>
                        </select>
                      </div>
                    </div>
                    <h4>Permissions</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Visibility</label>
                        <select className="form-control">
                          <option>Everyone</option>
                          <option>Select a team</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-center py-3">
                      <button type="button" className="border-0 btn btn-primary btn-gradient-primary btn-rounded">Save</button>&nbsp;&nbsp;
                      <button type="button" className="btn btn-secondary btn-rounded">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>{/* modal-content */}
        </div>{/* modal-dialog */}
      </div>
      {/*modal section starts here*/}
      <div className="modal fade" id="add-new-list">
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title">Add New List View</h4>
              <button type="button" className="close" data-bs-dismiss="modal">×</button>
            </div>
            {/* Modal body */}
            <div className="modal-body">
              <form className="forms-sample">
                <div className="form-group row">
                  <label htmlFor="view-name" className="col-sm-4 col-form-label">New View Name</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="view-name" placeholder="New View Name" />
                  </div>
                </div>
                <div className="form-group row pt-4">
                  <label className="col-sm-4 col-form-label">Sharing Settings</label>
                  <div className="col-sm-8">
                    <div className="form-group">
                      <div className="form-check">
                        <label className="form-check-label">
                          <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" defaultValue /> Just For Me <i className="input-helper" /></label>
                      </div><br />
                      <div className="form-check">
                        <label className="form-check-label">
                          <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios2" defaultValue="option2" defaultChecked /> Share Filter with Everyone <i className="input-helper" /></label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
                  <button className="btn btn-light">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
export default Dealskanbanview;

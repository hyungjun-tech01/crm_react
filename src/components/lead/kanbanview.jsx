import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CircleImg } from "../imagepath"

const Leadskanbanview =()=> {
    return (
        <div className="page-wrapper">
        <Helmet>
          <title>Leads Kanban View - CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="crms-title row bg-white mb-4">
            <div className="col  p-0">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="fas fa-table" />
                </span>Leads Kanban View</h3>
            </div>
            <div className="col p-0 text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                <li className="breadcrumb-item active">Leads Kanban View</li>
              </ul>
            </div>
          </div>
          <div className="page-header  mb-0 ">
            <div className="row">
              <div className="col">
                <div className="dropdown">
                  <a className="dropdown-toggle recently-viewed" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> All Leads</a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">Recently Viewed</a>
                    <a className="dropdown-item" href="#">Items I'm following</a>
                    <a className="dropdown-item" href="#">All Leads</a>
                    <a className="dropdown-item" href="#">All Closed Leads</a>
                    <a className="dropdown-item" href="#">All Open Leads</a>
                    <a className="dropdown-item" href="#">Converted Leads</a>
                    <a className="dropdown-item" href="#">My Open Leads</a>
                    <a className="dropdown-item" href="#">Todays Leads</a>
                  </div>
                </div>
              </div>
              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  <li className="dropdown list-inline-item add-lists">
                    <a className="dropdown-toggle recently-viewed pr-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> 
                      <div className="nav-profile-text">
                        <i className="fa fa-cog" aria-hidden="true" />
                      </div>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="#">Choose Columns</a>
                      <a className="dropdown-item" href="#">Group Columns</a>
                      <a className="dropdown-item" href="#">Sharing Settings</a>
                      <a className="dropdown-item" href="#">Rename</a>
                      <a className="dropdown-item" href="#">Clone</a>
                      <a className="dropdown-item" href="#">Delete</a>
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
                    <Link className="dropdown-item" to="/leads-kanban-view">Kanban View</Link>
                    <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#add-new-list">Add New List View</Link> 
                  </div>
                </li>
                  <li className="list-inline-item">
                    <button className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded" id="add-task" data-bs-toggle="modal" data-bs-target="#add_lead">New Lead</button>
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
                                <h2 data-bs-toggle="modal" data-target="#leads">Douglas Baker</h2>
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
                                <h2 data-bs-toggle="modal" data-target="#leads">Douglas Baker</h2>
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
        {/*add lead modal*/}
        <div className="modal right fade" id="add_lead" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog" role="document">
            <button type="button" className="close md-close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-center">Add Lead</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <form>
                      <h4>Lead Information</h4>
                      <div className="form-group row">
                        <div className="col-md-12"><label className="col-form-label">Name <span className="text-danger">*</span></label></div>
                        <div className="col-md-4">
                          <input className="form-control" type="text" placeholder="Prefix" name="prefix" />
                        </div>
                        <div className="col-md-4">
                          <input className="form-control" type="text" placeholder="First name" name="prefix-name" />
                        </div>
                        <div className="col-md-4">
                          <input className="form-control" type="text" placeholder="Last name" name="last-name" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Organization</label>
                          <select className="form-control">
                            <option>Select</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Title</label>
                          <input type="text" className="form-control" name="title" placeholder="Title" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Lead Status</label>
                          <select className="form-control">
                            <option>Select</option>
                            <option>Open - Contacted</option>
                            <option>Open - Not Contacted</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">User Responsible</label>
                          <select className="form-control">
                            <option>Select</option>
                            <option>John Doe</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Lead Rating</label>
                          <input type="number" className="form-control" name="rating" placeholder="Rating" />
                        </div>
                      </div>
                      <h4>Additional Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Email</label>
                          <input type="text" className="form-control" name="email" placeholder="Email" />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Email Opted out</label>
                          <div>
                            <div className="form-check m-0">
                              <label className="form-check-label">
                                <input className="checkbox" type="checkbox" /> <i className="input-helper" /><i className="input-helper" /></label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Phone</label>
                          <input type="text" className="form-control" name="phone" placeholder="Phone" />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Mobile Phone</label>
                          <input type="text" className="form-control" name="m-phone" placeholder="Phone" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Fax</label>
                          <input type="text" className="form-control" name="fax" placeholder="Fax" />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Website</label>
                          <input type="text" className="form-control" name="website" placeholder="Website" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Industry</label>
                          <input type="text" className="form-control" name="assistant-phone" placeholder="Industry" />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Number of Employees</label>
                          <input type="text" className="form-control" name="employees" placeholder="Number of Employees" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Lead Source</label>
                          <select className="form-control">
                            <option>Web</option>
                            <option>Phone Enquiry</option>
                            <option>Partner Referral</option>
                            <option>Purchased List</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <h4>Address Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">Mailing Address</label>
                          <textarea className="form-control" rows={3} name="address" placeholder="Address" defaultValue={""} />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <input type="text" className="form-control" placeholder="City" name="city" />
                        </div>
                        <div className="col-sm-6">
                          <input type="text" className="form-control" placeholder="State/Provience" name="state" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <input type="text" className="form-control" placeholder="Postal Code" name="postal" />
                        </div>
                        <div className="col-sm-6">
                          <select className="form-control">
                            <option>India</option>
                            <option>US</option>
                            <option>Japan</option>
                          </select>
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
                      <h4>Permissions</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Permission</label>
                          <select className="form-control">
                            <option>Task Visibility</option>
                            <option>Private Task</option>
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
        </div>{/* modal */}		
      </div>
    );
  }
export default Leadskanbanview;

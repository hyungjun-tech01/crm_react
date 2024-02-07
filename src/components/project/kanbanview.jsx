import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CircleImg } from "../imagepath"

const Projectkanbanview =()=> {
    return (
        <div className="page-wrapper">
        <Helmet>
          <title>Projects Kanban View - CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="crms-title row bg-white mb-4">
            <div className="col  p-0">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="fas fa-table" />
                </span>Projects Kanban View</h3>
            </div>
            <div className="col p-0 text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                <li className="breadcrumb-item active">Projects Kanban View</li>
              </ul>
            </div>
          </div>
          <div className="page-header  mb-0 ">
            <div className="row">
              <div className="col">
                <div className="dropdown">
                  <a className="dropdown-toggle recently-viewed" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> All Projects</a>
                  <div className="dropdown-menu" x-placement="bottom-start">
                    <a className="dropdown-item" href="#">Recently Viewed</a>
                    <a className="dropdown-item" href="#">Items I'm following</a>
                    <a className="dropdown-item" href="#">All Projects</a>
                    <a className="dropdown-item" href="#">All Closed Deals</a>
                    <a className="dropdown-item" href="#">All Open Deals</a>
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
                    <Link className="dropdown-item" to="/projects-kanban-view">Kanban View</Link>
                    <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#add-new-list">Add New List View</Link> 
                  </div>
                </li>
                  <li className="list-inline-item">
                    <button className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded" id="add-task" data-bs-toggle="modal" data-bs-target="#add_project">New Project</button>
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
                              <div className="kanban-label card bg-gradient-danger card-img-holder text-white h-100" data-bs-toggle="modal" data-target="#leads-details">
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
                              <div className="kanban-label card bg-gradient-info card-img-holder text-white h-100" data-bs-toggle="modal" data-target="#leads-details">
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
                              <div className="kanban-label card bg-gradient-success card-img-holder text-white h-100" data-bs-toggle="modal" data-target="#leads-details">
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
                              <div className="kanban-label card bg-gradient-warning card-img-holder text-white h-100" data-bs-toggle="modal" data-target="#leads-details">
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
                              <div className="kanban-label card bg-gradient-danger card-img-holder text-white h-100" data-bs-toggle="modal" data-target="#leads-details">
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
                              <div className="kanban-label card bg-gradient-info card-img-holder text-white h-100" data-bs-toggle="modal" data-target="#leads-details">
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
                              <div className="kanban-label card bg-gradient-success card-img-holder text-white h-100" data-bs-toggle="modal" data-target="#leads-details">
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
        <div className="modal right fade" id="add_project" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog" role="document">
          <button type="button" className="close md-close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-center">Add Project</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <form>
                    <h4>Project Details</h4>
                    <div className="form-group row">
                      <div className="col-md-6">
                        <label className="col-form-label">Project Name <span className="text-danger">*</span></label>
                        <input className="form-control" type="text" name="deal-name" />
                      </div>
                      <div className="col-md-6">
                        <label className="col-form-label">Status</label>
                        <select className="form-control">
                          <option>In progress</option>
                          <option>Deferred</option>
                          <option>Cancelled</option>
                          <option>Abandoned</option>
                          <option>Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-6">
                        <label className="col-form-label">Category</label>
                        <select className="form-control">
                          <option>Email</option>
                          <option>Follow up</option>
                          <option>Get Started</option>
                          <option>Meeting</option>
                          <option>Phone call</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="col-form-label">User Responsible</label>
                        <select className="form-control">
                          <option>Nothing selected</option>
                          <option>ohn Doe</option> 
                        </select>
                      </div>
                    </div>
                    <h4>Pipeline and Stage</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Pipeline</label>
                        <select className="form-control">
                          <option>Nothing selected </option>
                          <option>Project Pipeline </option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Stage</label>
                        <select className="form-control">
                          <option>Nothing selected </option>
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
                  <button type="submit" className="btn btn-gradient-primary me-2 btn-rounded">Submit</button>
                  <button className="btn btn-light cancel-button rounded">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
export default Projectkanbanview;

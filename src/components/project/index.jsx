import React from "react";
import { Helmet } from "react-helmet";
import { Table } from 'antd';
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import "../antdstyle.css"
import { itemRender, onShowSizeChange } from "../paginationfunction"
import ProjectDetailsModel from "./ProjectDetailsModel";
import SystemUserModel from "../task/SystemUserModel";
import { BiGridAlt } from "react-icons/bi";

const Project = () => {

  const data = [
    {
      id: 1,
      projectName: "Astronaut",
      projectStatus: "In Progress",
      userresponsible: "John Doe",
      project: "Phone call",
      category: "Phone call",
      created: "03-Jun-20 1:14 AM",
      text1: "won noselect tipped-top planing",
      text2: "won noselect tipped-top planing",
      text3: "won noselect tipped-top",
      text4: "won noselect tipped-top"
    },
    {
      id: 2,
      projectName: "Barcelona",
      projectStatus: "Completed",
      userresponsible: "John Doe",
      project: "Phone call",
      category: "-",
      created: "03-Jun-20 1:14 AM",
      text1: "won noselect tipped-top",
      text2: "won noselect tipped-top planing",
      text3: "won noselect tipped-top",
      text4: "won noselect tipped-top"
    },
    {
      id: 3,
      projectName: "Casanova",
      projectStatus: "Not Started",
      userresponsible: "John Doe",
      project: "Meeting",
      category: "Meeting",
      created: "03-Jun-20 1:14 AM",
      text1: "won noselect tipped-top",
      text2: "won noselect tipped-top",
      text3: "won noselect tipped-top",
      text4: "won noselect tipped-top planing"
    },
    {
      id: 4,
      projectName: "Charming",
      projectStatus: "Completed",
      userresponsible: "Micheal",
      project: "-",
      category: "-",
      created: "03-Jun-20 1:14 AM",
      text1: "won noselect tipped-top planing",
      text2: "won noselect tipped-top",
      text3: "won noselect tipped-top",
      text4: "won noselect tipped-top"

    },
    {
      id: 5,
      projectName: "Fireball",
      projectStatus: "In Progress",
      userresponsible: "John Smith",
      project: "Follow up",
      category: "Follow up",
      created: "03-Jun-20 1:14 AM",
      text1: "won noselect tipped-top",
      text2: "won noselect tipped-top planing",
      text3: "won noselect tipped-top planing",
      text4: "won noselect tipped-top"
    },
    {
      id: 6,
      projectName: "Gray Panthers",
      projectStatus: "In Progress",
      userresponsible: "Samsun David",
      project: "Email",
      category: "Email",
      created: "03-Jun-20 1:14 AM",
      text1: "won noselect tipped-top planing",
      text2: "won noselect tipped-top planing",
      text3: "won noselect tipped-top",
      text4: "won noselect tipped-top"
    },
    {
      id: 7,
      projectName: "Gray Panthers",
      projectStatus: "In Progress",
      userresponsible: "Samsun David",
      project: "Email",
      category: "Email",
      created: "03-May-20 1:14 AM",
      text1: "won noselect tipped-top planing",
      text2: "won noselect tipped-top planing",
      text3: "won noselect tipped-top",
      text4: "won noselect tipped-top"
    }
  ];
  const columns = [

    {
      title: "Project Name",
      dataIndex: "projectName",
      render: (text, record) => (
        <><a href="#"><span className="person-circle-a person-circle">{text.charAt(0)}</span></a>
          <a href="#" data-bs-toggle="modal" data-bs-target="#project-details">{text} </a></>
      ),
      sorter: (a, b) => a.projectName.length - b.projectName.length,
    },
    {
      title: "Project Status",
      dataIndex: "projectStatus",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.projectStatus.length - b.projectStatus.length,
    },
    {
      title: "User Responsible",
      dataIndex: "userresponsible",
      render: (text, record) => (
        <><a href="#" data-bs-toggle="modal" data-bs-target="#system-user">{text}</a></>
      ),
      sorter: (a, b) => a.projectStatus.length - b.projectStatus.length,
    },
    {
      title: "Project Category",
      dataIndex: "category",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.projectStatus.length - b.projectStatus.length,
    },
    {
      title: "Pipeline",
      render: (text, record) => (
        <>
          <div className="pipeline-small flat pipeline-project">
            <a className={record.text1} data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Pipeline: Deal Pipeline, stage: plan">&nbsp;
              <span className="stretched-link" data-bs-toggle="modal" data-bs-target="#project-details"></span>
            </a>
            <a className={record.text2} data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Pipeline: Deal Pipeline, stage: plan">
              <span className="stretched-link" data-bs-toggle="modal" data-bs-target="#project-details"></span>
            </a>
            <a className={record.text3} data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Pipeline: Deal Pipeline">
              <span className="stretched-link" data-bs-toggle="modal" data-bs-target="#project-details"></span>
            </a>
            <a className={record.text4} data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Pipeline: Deal Pipeline">
              <span className="stretched-link" data-bs-toggle="modal" data-bs-target="#project-details"></span>
            </a>
          </div>
        </>
      ),

    },

    {
      title: "Project Created",
      dataIndex: "created",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.created.length - b.created.length,
    },
    {
      title: "",
      render: (text, record) => (
        <i className="fa fa-star" aria-hidden="true" />
      ),

    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action">
          <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item" href="#">Edit This Project</a>
            <a className="dropdown-item" href="#">Change Project Image</a>
            <a className="dropdown-item" href="#">Clone This Project</a>
            <a className="dropdown-item" href="#">Delete This Project</a>
            <a className="dropdown-item" href="#">Change Record Owner</a>
            <a className="dropdown-item" href="#">Generate Merge Document</a>
            <a className="dropdown-item" href="#">Print This Project</a>
            <a className="dropdown-item" href="#">Add New Task For Project</a>
            <a className="dropdown-item" href="#">Add New Event For Project</a>
            <a className="dropdown-item" href="#">Add Activity Set To Project</a>
          </div>
        </div>
      ),
    }
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: record => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red"
    })
  };
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Projects - CRMS admin Template</title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
      <div className="content container-fluid">
        <div className="crms-title row bg-white">
          <div className="col  p-0">
            <h3 className="page-title m-0">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                {/* <i className="feather-grid" /> */}
                <i><BiGridAlt/></i>
              </span> Projects </h3>
          </div>
          <div className="col p-0 text-end">
            <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Projects</li>
            </ul>
          </div>
        </div>

        <div className="page-header pt-3 mb-0 ">
          <div className="row">
            <div className="col">
              <div className="dropdown">
                <a className="dropdown-toggle recently-viewed" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> All Projects</a>
                <div className="dropdown-menu">
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
                <li className="nav-item dropdown list-inline-item add-lists">
                  <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="nav-profile-text">
                      <i className="fa fa-th" aria-hidden="true"></i>
                    </div>
                  </a>
                  <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">

                    <Link className="dropdown-item" to="/projects">List View</Link>
                    <Link className="dropdown-item" to="/projects-kanban-view">Kanban View</Link>
                    <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#add-new-list">Add New List View</a>
                  </div>
                </li>
                <li className="list-inline-item">
                  <button className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded" id="add-task" data-bs-toggle="modal" data-bs-target="#add_project">New Project</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-0">
              <div className="card-body">
                <div className="table-responsive">
                  <Table
                    rowSelection={rowSelection}
                    pagination={{
                      total: data.length,
                      showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                      showSizeChanger: true, onShowSizeChange: onShowSizeChange, itemRender: itemRender
                    }}
                    className="table table-striped table-nowrap custom-table mb-0 datatable dataTable no-footer"
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.id}
                  />


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
                        <select className="form-control" id="assigned-to">
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
      <ProjectDetailsModel />
      <SystemUserModel />
    </div>

  );
}

export default Project;

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { avatar11, avatar10, avatar25, avatar26 } from "../imagepath"
import { itemRender, onShowSizeChange } from "../paginationfunction"
import "../antdstyle.css"
import SystemUserModel from "../task/SystemUserModel";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BiMobileAlt } from "react-icons/bi";
const Contacts = () => {
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };
  const data = [
    {
      id: 1,
      name: "Wilmer Deluna",
      title: "Facility Manager",
      phone: "875455453",
      email: "wilmer@gmail.com",
      tag: "Sample_data",
      image: avatar11,
      className: "badge badge-gradient-success"
    },
    {
      id: 2,
      name: "Manager",
      title: "Facility Manager",
      phone: "875455453",
      email: "john@gmail.com",
      tag: "Sample_data",
      image: avatar10,
      className: "badge badge-gradient-info"
    },
    {
      id: 3,
      name: "CMO",
      title: "Facility Manager",
      phone: "875455453",
      email: "john@gmail.com",
      tag: "Sample_data",
      image: avatar25,
      className: "badge badge-gradient-danger"
    },
    {
      id: 4,
      name: "Manager",
      title: "Property Manager",
      phone: "875455453",
      email: "john@gmail.com",
      tag: "Sample_data",
      image: avatar26,
      className: "badge badge-gradient-warning"
    },

  ];
  const columns = [

    {
      title: "Full Name",
      dataIndex: "name",
      render: (text, record) => (
        <><a className="avatar"><img alt="" src={record.image} /></a>
          <a href="#" data-bs-toggle="modal" data-bs-target="#system-user">{text}</a></>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Tag List",
      dataIndex: "tag",
      render: (text, record) => (
        <span className={record.className}>{text}</span>
      ),
      sorter: (a, b) => a.tag.length - b.tag.length,
    },

    {
      title: "",
      dataIndex: "star",
      render: (text, record) => (
        <i className="fa fa-star"></i>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },

    {
      title: "Action",
      dataIndex: "status",
      render: (text, record) => (
        <div className="dropdown dropdown-action">
          <a className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item" href="#">Edit This Contact</a>
            <a className="dropdown-item" href="#">Change Contact Image</a>
            <a className="dropdown-item" href="#">Delete This Contact</a>
            <a className="dropdown-item" href="#">Clone This Contact</a>
            <a className="dropdown-item" href="#">Change Record Owner</a>
            <a className="dropdown-item" href="#">Generate Merge Document</a>
            <a className="dropdown-item" href="#">Change Contact To Lead</a>
            <a className="dropdown-item" href="#">Print This Contact</a>
            <a className="dropdown-item" href="#">Email This Contact</a>
            <a className="dropdown-item" href="#">Add New Task For Contact</a>
            <a className="dropdown-item" href="#">Add New Event For Contact</a>
            <a className="dropdown-item" href="#">Add Activity Set To Contact</a>
            <a className="dropdown-item" href="#">Add New Deal For Contact</a>
            <a className="dropdown-item" href="#">Add New Project For Contact</a>
          </div>
        </div>
      ),

    },
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
        <title>Contacts - CRMS admin Template</title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
      <div className="content container-fluid">
        <div className="crms-title row bg-white">
          <div className="col ">
            <h3 className="page-title m-0">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                {/* <i className="feather-smartphone" /> */}
                <i><BiMobileAlt/></i>
              </span> Contacts </h3>
          </div>
          <div className="col text-end">
            <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Contacts</li>
            </ul>
          </div>
        </div>
        {/* Page Header */}
        <div className="page-header pt-3 mb-0 ">
          <div className="row">
            <div className="col">
              <div className="dropdown">
                <a className="dropdown-toggle recently-viewed" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Recently Viewed</a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">Recently Viewed</a>
                  <a className="dropdown-item" href="#">Items I'm following</a>
                  <a className="dropdown-item" href="#">All Contacts</a>
                  <a className="dropdown-item" href="#">Contacts added in the last 24 hours</a>
                  <a className="dropdown-item" href="#">Contacts added in the last 7 days</a>
                  <a className="dropdown-item" href="#">Contacts with no notes in the last month</a>
                  <a className="dropdown-item" href="#">Contacts with no notes in the last 7 days</a>
                </div>
              </div>
            </div>
            <div className="col text-end">
              <ul className="list-inline-item pl-0">
                <li className="nav-item dropdown list-inline-item add-lists">
                  <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="nav-profile-text">
                      <i className="fa fa-th" aria-hidden="true" />
                    </div>
                  </a>
                  <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">
                    <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#add-new-list">Add New List View</a>
                  </div>
                </li>
                <li className="list-inline-item">
                  <button className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded" id="add-task" data-bs-toggle="modal" data-bs-target="#add_contact">New Contact</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}

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
                    className="table"
                    style={{ overflowX: "auto" }}
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
      {/* Modal */}
      <div className="modal right fade" id="add_contact" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog" role="document">
          <button type="button" className="close md-close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-center">Add Contact</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <form>
                    <h4>Name &amp; Occupation</h4>
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
                    <h4>Contact Details</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Email</label>
                        <input type="text" className="form-control" name="email" placeholder="Email" />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Email Opted out</label>
                        <div>
                          <label className="container-checkbox">
                            <input type="checkbox" />
                            <span className="checkmark" />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Phone</label>
                        <input type="text" className="form-control" name="phone" placeholder="Phone" />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Home Phone</label>
                        <input type="text" className="form-control" name="h-phone" placeholder="Phone" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Mobile Phone</label>
                        <input type="text" className="form-control" name="m-phone" placeholder="Phone" />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Other Phone</label>
                        <input type="text" className="form-control" id="o-phone" name="o-phone" placeholder="Phone" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Assistant Phone</label>
                        <input type="text" className="form-control" name="assistant-phone" placeholder="Phone" />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Assistant Name</label>
                        <input type="text" className="form-control" name="assistant-name" placeholder="Assistant Name" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Fax</label>
                        <input type="text" className="form-control" name="fax" placeholder="Fax" />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Linkedin</label>
                        <input type="text" className="form-control" name="linkedin" placeholder="linkedin" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Facebook</label>
                        <input type="text" className="form-control" name="fb" placeholder="Facebook" />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Twitter</label>
                        <input type="text" className="form-control" name="twitter" placeholder="Twitter" />
                      </div>
                    </div>
                    <h4>Address Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Mailing Address</label>
                        <textarea className="form-control" rows={3} name="mailing-address" placeholder="Address" defaultValue={""} />
                      </div>
                      <div className="col-sm-6 mt-3">
                        <label className="col-form-label" /><br />
                        <input type="text" className="form-control" placeholder="Mailing City" name="mailing-city" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Mailing State" name="mailing-state" />
                      </div>
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Mailing Postal code" name="mailing-postal-code" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Mailing Country</label>
                        <select className="form-control">
                          <option>India</option>
                          <option>US</option>
                          <option>Japan</option>
                        </select>
                      </div>
                      <div className="col-sm-6 mt-3">
                        <label className="col-form-label">Other Address</label>
                        <textarea className="form-control" rows={3} name="other-address" placeholder="Address" defaultValue={""} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Other City" name="other-city" />
                      </div>
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Other State" name="other-state" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Other Postal code" name="other-postal-code" />
                      </div>
                      <div className="col-sm-6">
                        <select className="form-control">
                          <option>India</option>
                          <option>US</option>
                          <option>Japan</option>
                        </select>
                      </div>
                    </div>
                    <h4>Dates To Remember</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Due Date <span className="text-danger">*</span></label>
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
                        <label className="col-form-label">Date of Birth <span className="text-danger">*</span></label>
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
      </div>
      <SystemUserModel />
    </div>
  )
};

export default Contacts;

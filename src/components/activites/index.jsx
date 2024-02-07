import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { SystemUser, CircleImg, C_logo, C_logo2 } from "../imagepath"
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from "../paginationfunction"
import "../antdstyle.css"
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import DealDetailsModel from "../deals/DealDetailsModel";
import ProjectDetailsModel from "../project/ProjectDetailsModel";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BiClipboard } from "react-icons/bi";
const Activities = () => {
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
      subject: "Call",
      deal: "Ansanio tech",
      contact: "Cravo Ansanio",
      email: "anson@gmail.com",
      phone: "9874565464",
      companies: "Soylent Corp",
    },

    {
      id: 2,
      subject: "Call",
      deal: "Ansanio tech",
      contact: "Cravo Ansanio",
      email: "johndoe@gmail.com",
      phone: "9874565464",
      companies: "Soylent Corp",
    },
    {
      id: 3,
      subject: "Call",
      deal: "Lunch",
      contact: "John Doe",
      email: "johndoe@gmail.com",
      phone: "9874565464",
      companies: "Acme Corporation"
    },
    {
      id: 4,
      subject: "Call",
      deal: "Lunch",
      contact: "John Doe",
      email: "johndoe@gmail.com",
      phone: "9874565464",
      companies: "Acme Corporation"
    },
    {
      id: 5,
      subject: "Phone",
      deal: "Lunch",
      contact: "John Doe",
      email: "johndoe@gmail.com",
      phone: "9874565464",
      companies: "Acme Corporation"
    },


  ];

  const columns = [

    {
      title: "Subject",
      dataIndex: "subject",
      render: (text, record) => (
        <><a href="#" data-bs-toggle="modal" data-bs-target="#add_activity">{text}</a></>
      ),
      sorter: (a, b) => a.subject.length - b.subject.length,
    },

    {
      title: "Deal",
      dataIndex: "deal",
      render: (text, record) => (
        <><a href="#" data-bs-toggle="modal" data-bs-target="#company-details">{text}</a></>
      ),
      sorter: (a, b) => a.deal.length - b.deal.length,
    },
    {
      title: "Contact Person",
      dataIndex: "contact",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.contact.length - b.contact.length,
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
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Companies",
      dataIndex: "companies",
      render: (text, record) => (
        <><a href="#" data-bs-toggle="modal" data-bs-target="#company-details">{text}</a></>
      ),
      sorter: (a, b) => a.companies.length - b.companies.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-center">
          <a className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="material-icons">more_vert</i></a>
          <div className="dropdown-menu dropdown-menu-right h-100">
            <a style={{ display: "initial" }} className="dropdown-item">Edit</a>
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
        <title>Activities - CRMS admin Template</title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        <div className="crms-title row bg-white">
          <div className="col  p-0">
            <h3 className="page-title m-0">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                {/* <i className="feather-calendar" /> */}
                <i><BiClipboard /></i>
              </span> Activities </h3>
          </div>
          <div className="col p-0 text-end">
            <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Activities</li>
            </ul>
          </div>
        </div>
        <div className="page-header pt-3 mb-0 ">
          <div className="row">
            <div className="col">
              <div className="dropdown">
                <a className="dropdown-toggle recently-viewed" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Propose Times </a>
                <div className="dropdown-menu">
                  <a className="dropdown-item">Recently Viewed</a>
                  <a className="dropdown-item">Items I'm following</a>
                  <a className="dropdown-item">All Activity</a>
                  <a className="dropdown-item">All Closed Activity</a>
                  <a className="dropdown-item">All Open Activity</a>
                  <a className="dropdown-item">My Activity</a>
                </div>
              </div>
            </div>
            <div className="col text-end">
              <ul className="list-inline-item pl-0">
                <li className="list-inline-item">
                  <button className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded" id="add-task" data-bs-toggle="modal" data-bs-target="#add_activity">Add Activity</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Content Starts */}
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-0">
              <div className="card-body">
                <div className="table-responsive activity-tables">
                  <Table
                    rowSelection={{

                      ...rowSelection,
                    }}
                    pagination={{
                      total: data.length,
                      showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                      showSizeChanger: true, onShowSizeChange: onShowSizeChange, itemRender: itemRender
                    }}
                    style={{ overflowX: 'auto' }}
                    columns={columns}
                    bordered
                    dataSource={data}
                    rowKey={record => record.id}
                  // onChange={handleTableChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Content End */}
      </div>
      <SystemUserModel />
      <CompanyDetailsModel />
      <DealDetailsModel />
      <ProjectDetailsModel />
      {/* /Page Content */}

      <div className="modal right fade" id="add_activity" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <button type="button" className="close md-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Schedule an Activity</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form className="forms-sampme">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <input className="form-control" type="text" name="deal-name" id="deal-name" defaultValue="Call" />
                    </div>
                    <div className="btn-group mb-3">
                      <button type="button" className="btn btn-light"><i className="fa fa-phone" aria-hidden="true" /></button>
                      <button type="button" className="btn btn-light"><i className="fa fa-users" aria-hidden="true" /></button>
                      <button type="button" className="btn btn-light"><i className="fa fa-clock-o" aria-hidden="true" /></button>
                      <button type="button" className="btn btn-light"><i className="fa fa-flag" aria-hidden="true" /></button>
                      <button type="button" className="btn btn-light"><i className="fa fa-paper-plane-o" aria-hidden="true" /></button>
                      <button type="button" className="btn btn-light"><i className="fa fa-cutlery" aria-hidden="true" /></button>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-3">
                          <div className="cal-icon">
                            <DatePicker
                              className="form-control"
                              selected={selectedDate1}
                              onChange={handleDateChange1}
                              dateFormat="dd/MM/yyyy"
                              showDayMonthYearPicker />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <select className="form-control">
                            <option>02:00</option>
                            <option>03:00</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select className="form-control">
                            <option>02:00</option>
                            <option>03:00</option>
                          </select>
                        </div>
                        <div className="col-md-3">
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
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <div className="row m-0">
                        <p>Add <a >Guests</a>, <a>Location</a>, <a>Description</a></p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <select className="form-control">
                        <option>Busy</option>
                        <option>Free</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <textarea className="form-control mb-2" rows={3} placeholder="Notes" defaultValue={""} />
                      <span className="pt-2">Notes are private and visible only within your Pipedrive account</span>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <select className="form-control">
                        <option>John Doe</option>
                        <option>John Smith</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="Deal or Lead" />
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="People" />
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="Organization" />
                    </div>
                  </div>
                </div>
                <div className="submit-section mt-0">
                  <div className="custom-check mb-4">
                    <input type="checkbox" id="mark-as-done" />
                    <label htmlFor="mark-as-done">Mark as Done</label>
                  </div>
                </div>
                <div className="text-center">
                  <button type="button" className="border-0 btn btn-primary btn-gradient-primary btn-rounded">Save</button>&nbsp;&nbsp;
                  <button type="button" className="btn btn-secondary btn-rounded">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>{/* modal */}
      {/* cchange pipeline stage Modal */}
      <div className="modal" id="pipeline-stage">
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title">Change Pipeline Stage</h4>
              <button type="button" className="close" data-bs-dismiss="modal">×</button>
            </div>
            {/* Modal body */}
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label className="col-form-label">New Stage</label>
                  <select className="form-control" id="related-to">
                    <option>Plan</option>
                    <option>Design</option>
                    <option>Develop</option>
                    <option>Complete</option>
                  </select>
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <div className="modal-footer text-center">
              <button type="button" className="border-0 btn btn-primary btn-gradient-primary btn-rounded">Save</button>&nbsp;&nbsp;
              <button type="button" className="btn btn-secondary btn-rounded cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Activities;

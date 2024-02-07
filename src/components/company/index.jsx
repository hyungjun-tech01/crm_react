import React, { Component, useState } from "react";
import { Helmet } from "react-helmet";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { C_logo,C_logo2,C_logo3 } from "../imagepath"
import {itemRender,onShowSizeChange} from "../paginationfunction"
import CompanyDetailsModel from "./CompanyDetailsModel";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BiData } from "react-icons/bi";

const Company =()=> {
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

      const data = [
        {
          id: 1,
        company:"Clampett Oil and Gas Corp.",
        phone: "8754554531",
        billing: "Palo Alto",
        state:"CA",
        country: "USA",
        image :C_logo
         },
         {
            id: 2,
          company:"Soylent Corp",
          phone: "8754554531",
          billing: "Havier Street",
          state:"CA",
          country: "India",
          image :C_logo2
           },
           {
            id: 3,
          company:"Umbrella",
          phone: "8754554531",
          billing: "Havier Street",
          state:"CA",
          country: "India",
          image :C_logo3
           },
           {
            id: 4,
          company:"Umbrella",
          phone: "8754554531",
          billing: "Havier Street",
          state:"CA",
          country: "India",
          image :C_logo2
           },
  
      ];

      const columns = [
     
        {
          title: "Company Name",
          dataIndex: "company",
          render: (text, record) => (
            <><a href="#" className="avatar"><img alt="" src={record.image} /></a>
            <a href="#" data-bs-toggle="modal" data-bs-target="#company-details">{text}</a></>
            ),
          sorter: (a, b) => a.company.length - b.company.length,
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
          title: "Billing Street",
          dataIndex: "billing",
          render: (text, record) => (
            <>{text}</>
            ),
          sorter: (a, b) => a.billing.length - b.billing.length,
        },
        {
          title: "Billing State",
          dataIndex: "state",
          render: (text, record) => (
            <>{text}</>
            ),
          sorter: (a, b) => a.state.length - b.state.length,
        },
        {
          title: "Billing Country",
          dataIndex: "country",
          render: (text, record) => (
          <>{text}</>
            ),
          sorter: (a, b) => a.status.length - b.status.length,
        },
        {
          title: "",
          dataIndex: "star",
          render: (text, record) => (
            <i className="fa fa-star" aria-hidden="true" />
          ),
          sorter: (a, b) => a.status.length - b.status.length,
        },
  
        {
          title: "Actions",
          dataIndex: "status",
          render: (text, record) => (
            <div className="dropdown dropdown-action">
              <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="#">Edit This Company</a>
                <a className="dropdown-item" href="#">Change Organization Image</a>
                <a className="dropdown-item" href="#">Delete This Organization</a>
                <a className="dropdown-item" href="#">Change Record Owner</a>
                <a className="dropdown-item" href="#">Generate Merge Document</a>
                <a className="dropdown-item" href="#">Print This Organization</a>
                <a className="dropdown-item" href="#">Add New Task For Organization</a>
                <a className="dropdown-item" href="#">Add New Event For Organization</a>
                <a className="dropdown-item" href="#">Add Activity Set To Organization</a>
                <a className="dropdown-item" href="#">Add New Contact For Organization</a>
                <a className="dropdown-item" href="#">Add New Opportunity For Organization</a>
                <a className="dropdown-item" href="#">Add New Opportunity For Organization</a>
                <a className="dropdown-item" href="#">Add New Project For Organization</a>
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
          <title>Companies - CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
          <div className="content container-fluid">
            <div className="crms-title row bg-white">
              <div className="col">
                <h3 className="page-title m-0">
                  <span className="page-title-icon bg-gradient-primary text-white me-2">
                    {/* <i className="feather-database" /> */}
                    <i><BiData /></i>
                  </span> Companies </h3>
              </div>
              <div className="col text-end">
                <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                  <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Companies</li>
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
                      <a className="dropdown-item" href="#">All Companies</a>
                      <a className="dropdown-item" href="#">Companies added in the last 24 hours</a>
                      <a className="dropdown-item" href="#">Companies added in the last 7 days</a>
                      <a className="dropdown-item" href="#">Companies with no notes in the last month</a>
                      <a className="dropdown-item" href="#">Companies with no notes in the last 7 days</a>
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
                      <button className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded" id="add-task" data-bs-toggle="modal" data-bs-target="#add_company">New Company</button>
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
                        pagination= { {total : data.length,
                          showTotal : (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger : true,onShowSizeChange: onShowSizeChange ,itemRender : itemRender } }
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
        <div className="modal right fade" id="add_company" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog" role="document">
          <button type="button" className="close md-close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-center">Add Company</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <form>
                    <h4>Organization Name</h4>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <label className="col-form-label">Organization Name <span className="text-danger">*</span></label>
                        <input className="form-control" type="text" placeholder="Organization Name" name="organization" />
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
                    <h4>Organization Contact Details</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Phone</label>
                        <input type="text" className="form-control" name="phone" placeholder="Phone" />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Fax</label>
                        <input type="text" className="form-control" name="fax" placeholder="Fax" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Website</label>
                        <input type="text" className="form-control" name="website" placeholder="Website" />
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Linkedin</label>
                        <input type="text" className="form-control" name="linkedin" placeholder="Linkedin" />
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
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Email Domains</label>
                        <input type="text" className="form-control" name="domains" placeholder="Email Domains" />
                      </div>
                    </div>
                    <h4>Address Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Billing Address</label>
                        <textarea className="form-control" rows={3} name="billing-address" placeholder="Billing Address" defaultValue={""} />
                      </div>
                      <div className="col-sm-6 mt-3">
                        <label className="col-form-label" /><br />
                        <input type="text" className="form-control" placeholder="Billing City" name="billing-city" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Billing State" name="billing-state" />
                      </div>
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Billing Postal code" name="billing-postal-code" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Billing Country</label>
                        <select className="form-control">
                          <option>India</option>
                          <option>US</option>
                          <option>Japan</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="col-form-label">Shipping Address</label>
                        <textarea className="form-control" rows={3} name="shipping-address" placeholder="Shipping Address" defaultValue={""} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Shipping City" name="shipping-city" />
                      </div>
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Shipping State" name="shipping-state" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Shipping Postal code" name="shipping-postal-code" />
                      </div>
                      <div className="col-sm-6">
                        <select className="form-control">
                          <option>India</option>
                          <option>US</option>
                          <option>Japan</option>
                        </select>
                      </div>
                    </div>
                    <h4>Additional Information</h4>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="col-form-label">Dates To Remember <span className="text-danger">*</span></label>
                        <div className="cal-icon">
                          <DatePicker
                            className="form-control"
                            selected={selectedDate1}
                            onChange={handleDateChange1}
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
        <CompanyDetailsModel />
      </div>
    )};
export default Company;

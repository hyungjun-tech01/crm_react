import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IMG01, IMG02, IMG03, IMG04, IMG06, IMG07, IMG08, IMG09, IMG10 } from "./img";
import { Table } from "antd";
import { itemRender, onShowSizeChange } from "../../paginationfunction"
import { FiBookOpen, FiBookmark, FiCalendar, FiGrid, FiList, FiPlusCircle, FiSettings, FiUserPlus } from "react-icons/fi";
import "../../antdstyle.css"
const Invoices = () => {
  const [isShown1, setIsShown1] = useState(true);
  const [isShown2, setIsShown2] = useState(true);
  const [isShown3, setIsShown3] = useState(true);
  const [isShown4, setIsShown4] = useState(true);
  const dropdown1 = (event) => {
    setIsShown1(current => !current);
  };
  const dropdown2 = (event) => {
    setIsShown2(current => !current);
  };
  const dropdown3 = (event) => {
    setIsShown3(current => !current);
  };
  const dropdown4 = (event) => {
    setIsShown4(current => !current);
  };
  let pathname = window.location.pathname
  const [active, setActive] = useState(false);
  const url = pathname.split("/").slice(0, -1).join("/");

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
      Invoice: "IN093439#@09",
      Category: "Advertising",
      Created: "16 Mar 2022",
      to: "Barbara Moore",
      Amount: "$1,54,220",
      date: "23 Mar 2022",
      Status: "Paid",
      className: "badge bg-success-light",
      image: IMG06
    },
    {
      id: 2,
      Invoice: "IN093439#@10",
      Category: "Food",
      Created: "14 Mar 2022",
      to: "Karlene Chaidez",
      Amount: "$1,222",
      date: "18 Mar 2022",
      Status: "Overdue",
      className: "badge bg-danger-light",
      image: IMG07
    },
    {
      id: 3,
      Invoice: "IN093439#@11",
      Category: "Marketing",
      Created: "7 Mar 2022",
      to: "Russell Copeland",
      Amount: "$3,470",
      date: "10 Mar 2022",
      Status: "Cancelled",
      className: "badge bg-primary-light",
      image: IMG08
    },
    {
      id: 4,
      Invoice: "IN093439#@12",
      Category: "Repairs",
      Created: "24 Mar 2022",
      to: "Joseph Collins",
      Amount: "$8,265",
      date: "30 Mar 2022",
      Status: "Paid",
      className: "badge bg-success-light",
      image: IMG09
    },
    {
      id: 5,
      Invoice: "IN093439#@13",
      Category: "Software",
      Created: "17 Mar 2022",
      to: "Jennifer Floyd",
      Amount: "$5,200",
      date: "20 Mar 2022",
      Status: "Overdue",
      className: "badge bg-danger-light",
      image: IMG10
    }
  ];
  const columns = [

    {
      title: "Invoice ID",
      dataIndex: "Invoice",
      render: (text, record) => (
        <><Link to="/view-invoice" className="invoice-link">{text}</Link></>
      ),
      sorter: (a, b) => a.Invoice.length - b.Invoice.length,
    },

    {
      title: "Category",
      dataIndex: "Category",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.Category.length - b.Category.length,
    },
    {
      title: "Created on",
      dataIndex: "Created",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.Created.length - b.Created.length,
    },
    {
      title: "Invoice to",
      dataIndex: "to",
      render: (text, record) => (
        <>
          <Link to="/profile">
            <img
              className="avatar avatar-sm me-2 avatar-img rounded-circle"
              src={record.image}
              alt="User Image"
            />{" "}
            {text}
          </Link></>
      ),
      sorter: (a, b) => a.to.length - b.to.length,
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      render: (text, record) => (
        <><div className="text-primary">{text}</div></>
      ),
      sorter: (a, b) => a.Amount.length - b.Amount.length,
    },
    {
      title: "Due date",
      dataIndex: "date",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text, record) => (
        <span className={record.className}>{text}</span>
      ),
      sorter: (a, b) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="text-end">
          <div className="dropdown dropdown-action">
            <a
              href="#"
              className="action-icon dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="material-icons">more_vert</i>
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <a
                className="dropdown-item"
                href="edit-invoice"
              >
                <i className="fa fa-edit me-2" />
                Edit
              </a>
              <a
                className="dropdown-item"
                href="view-invoice"
              >
                <i className="fa fa-eye me-2" />
                View
              </a>
              <a
                className="dropdown-item"
                href="#"
              >
                <i className="fa fa-trash me-2" />
                Delete
              </a>
              <a
                className="dropdown-item"
                href="#"
              >
                <i className="fa fa-check-circle me-2" />
                Mark as sent
              </a>
              <a
                className="dropdown-item"
                href="#"
              >
                <i className="fa fa-paper-plane me-2" />
                Send Invoice
              </a>
              <a
                className="dropdown-item"
                href="#"
              >
                <i className="fa fa-copy me-2" />
                Clone Invoice
              </a>
            </div>
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
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <Helmet>
          <title>Invoice- CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          <div className="crms-title row bg-white">
            <div className="col  p-0">
              <h3 className="page-title m-0">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="fa fa-file" aria-hidden="true" />
                </span>{" "}
                Invoice{" "}
              </h3>
            </div>
            <div className="col p-0 text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Invoice</li>
              </ul>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col"></div>
            <div className="col-auto py-3">
              <Link to="invoices" className="invoices-links active">
                <FiList />
              </Link>
              <Link to="/invoice-grid" className="invoices-links">
                <FiGrid />
              </Link>
            </div>
          </div>
          {/* Report Filter */}
          <div className="card report-card">
            <div className="card-body pb-0">
              <div className="row">
                <div className="col-md-12">
                  <ul className="app-listing">
                    <li>
                      <div className="multipleSelection">
                        <div className="selectBox" onClick={dropdown1}>
                          <p className="mb-0">
                            <FiUserPlus
                            />{" "}
                            Select User
                          </p>
                          <span className="down-icon">
                            <i className="fa fa-angle-down" aria-hidden="true" />
                          </span>
                        </div>
                        <div id="checkBoxes" style={{ display: isShown1 ? 'none' : 'block' }}>
                          <form action="#">
                            <p className="checkbox-title">Customer Search</p>
                            <div className="form-custom">
                              <input
                                type="text"
                                className="form-control bg-grey"
                                placeholder="Enter Customer Name"
                              />
                            </div>
                            <div className="selectBox-cont">
                              <label className="custom_check w-100">
                                <input type="checkbox" name="username" />
                                <span className="checkmark" /> Brian Johnson
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="username" />
                                <span className="checkmark" /> Russell Copeland
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="username" />
                                <span className="checkmark" /> Greg Lynch
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="username" />
                                <span className="checkmark" /> John Blair
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="username" />
                                <span className="checkmark" /> Barbara Moore
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="username" />
                                <span className="checkmark" /> Hendry Evan
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="username" />
                                <span className="checkmark" /> Richard Miles
                              </label>
                            </div>
                            <button type="submit" className="btn w-100 btn-primary">
                              Apply
                            </button>
                            <button type="reset" className="btn w-100 btn-grey">
                              Reset
                            </button>
                          </form>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="multipleSelection">
                        <div className="selectBox" onClick={dropdown2}>
                          <p className="mb-0">
                            <FiCalendar
                            />{" "}
                            Select Date
                          </p>
                          <span className="down-icon">
                            <i className="fa fa-angle-down" aria-hidden="true" />
                          </span>
                        </div>
                        <div id="checkBoxes" style={{ display: isShown2 ? 'none' : 'block' }}>
                          <form action="#">
                            <p className="checkbox-title">Date Filter</p>
                            <div className="selectBox-cont selectBox-cont-one h-auto">
                              <div className="date-picker">
                                <div className="form-custom cal-icon">
                                   <DatePicker
                                    className="form-control"
                                    selected={selectedDate1}
                                    onChange={handleDateChange1}
                                    dateFormat="dd/MM/yyyy"
                                    showDayMonthYearPicker />
                                </div>
                              </div>
                              <div className="date-picker pe-0">
                                <div className="form-custom cal-icon">
                                <DatePicker
                                    className="form-control"
                                    selected={selectedDate2}
                                    onChange={handleDateChange2}
                                    dateFormat="dd/MM/yyyy"
                                    showDayMonthYearPicker />
                                </div>
                              </div>
                              <div className="date-list">
                                <ul>
                                  <li>
                                    <a href="#" className="btn date-btn">
                                      Today
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" className="btn date-btn">
                                      Yesterday
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" className="btn date-btn">
                                      Last 7 days
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" className="btn date-btn">
                                      This month
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" className="btn date-btn">
                                      Last month
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="multipleSelection">
                        <div className="selectBox" onClick={dropdown3}>
                          <p className="mb-0">
                            <FiBookOpen
                            />{" "}
                            Select Status
                          </p>
                          <span className="down-icon">
                            <i className="fa fa-angle-down" aria-hidden="true" />
                          </span>
                        </div>
                        <div id="checkBoxes" style={{ display: isShown3 ? 'none' : 'block' }}>
                          <form action="#">
                            <p className="checkbox-title">By Status</p>
                            <div className="selectBox-cont">
                              <label className="custom_check w-100">
                                <input
                                  type="checkbox"
                                  name="name"
                                  defaultChecked=""
                                />
                                <span className="checkmark" /> All Invoices
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="name" />
                                <span className="checkmark" /> Paid
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="name" />
                                <span className="checkmark" /> Overdue
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="name" />
                                <span className="checkmark" /> Draft
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="name" />
                                <span className="checkmark" /> Recurring
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="name" />
                                <span className="checkmark" /> Cancelled
                              </label>
                            </div>
                            <button type="submit" className="btn w-100 btn-primary">
                              Apply
                            </button>
                            <button type="reset" className="btn w-100 btn-grey">
                              Reset
                            </button>
                          </form>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="multipleSelection">
                        <div className="selectBox" onClick={dropdown4}>
                          <p className="mb-0">
                            <FiBookmark
                            />{" "}
                            By Category
                          </p>
                          <span className="down-icon">
                            <i className="fa fa-angle-down" aria-hidden="true" />
                          </span>
                        </div>
                        <div id="checkBoxes" style={{ display: isShown4 ? 'none' : 'block' }}>
                          <form action="#">
                            <p className="checkbox-title">Category</p>
                            <div className="form-custom">
                              <input
                                type="text"
                                className="form-control bg-grey"
                                placeholder="Enter Category Name"
                              />
                            </div>
                            <div className="selectBox-cont">
                              <label className="custom_check w-100">
                                <input type="checkbox" name="category" />
                                <span className="checkmark" /> Advertising
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="category" />
                                <span className="checkmark" /> Food
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="category" />
                                <span className="checkmark" /> Marketing
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="category" />
                                <span className="checkmark" /> Repairs
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="category" />
                                <span className="checkmark" /> Software
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="category" />
                                <span className="checkmark" /> Stationary
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" name="category" />
                                <span className="checkmark" /> Travel
                              </label>
                            </div>
                            <button type="submit" className="btn w-100 btn-primary">
                              Apply
                            </button>
                            <button type="reset" className="btn w-100 btn-grey">
                              Reset
                            </button>
                          </form>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="report-btn">
                        <a href="#" className="btn">
                          Generate report
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* /Report Filter */}
          <div className="card invoices-tabs-card">
            <div className="card-body card-body pt-0 pb-0">
              <div className="invoices-main-tabs">
                <div className="row align-items-center">
                  <div className="col-lg-8 col-md-8">
                    <div className="invoices-tabs">
                      <ul>
                        <li>
                          <Link to="/invoices" className='active'>
                            All Invoice
                          </Link>
                        </li>
                        <li>
                          <Link to="/invoices-paid" className={`${pathname.includes("invoices-paid") ? "active" : ""}`}>Paid</Link>
                        </li>
                        <li>
                          <Link to="/invoices-overdue" className={`${pathname.includes("invoices-overdue") ? "active" : ""}`}>Overdue</Link>
                        </li>
                        <li>
                          <Link to="/invoices-draft" className={`${pathname.includes("invoices-draft") ? "active" : ""}`}>Draft</Link>
                        </li>
                        <li>
                          <Link to="/invoices-recurring" className={`${pathname.includes("invoices-recurring") ? "active" : ""}`}>Recurring</Link>
                        </li>
                        <li>
                          <Link to="/invoices-cancelled" className={`${pathname.includes("invoices-cancelled") ? "active" : ""}`}>Cancelled</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="invoices-settings-btn">
                      <a
                        href="invoices-settings"
                        className="invoices-settings-icon"
                      >
                        <FiSettings />
                      </a>
                      <Link to="/add-invoice" className="btn">
                        <FiPlusCircle/> New Invoice
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card inovices-card">
                <div className="card-body">
                  <div className="inovices-widget-header">
                    <span className="inovices-widget-icon">
                      <img src={IMG01} alt="" />
                    </span>
                    <div className="inovices-dash-count">
                      <div className="inovices-amount">$8,78,797</div>
                    </div>
                  </div>
                  <p className="inovices-all">
                    All Invoices <span>50</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card inovices-card">
                <div className="card-body">
                  <div className="inovices-widget-header">
                    <span className="inovices-widget-icon">
                      <img src={IMG02} alt="" />
                    </span>
                    <div className="inovices-dash-count">
                      <div className="inovices-amount">$4,5884</div>
                    </div>
                  </div>
                  <p className="inovices-all">
                    Paid Invoices <span>60</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card inovices-card">
                <div className="card-body">
                  <div className="inovices-widget-header">
                    <span className="inovices-widget-icon">
                      <img src={IMG03} alt="" />
                    </span>
                    <div className="inovices-dash-count">
                      <div className="inovices-amount">$2,05,545</div>
                    </div>
                  </div>
                  <p className="inovices-all">
                    Unpaid Invoices <span>70</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card inovices-card">
                <div className="card-body">
                  <div className="inovices-widget-header">
                    <span className="inovices-widget-icon">
                      <img src={IMG04} alt="" />
                    </span>
                    <div className="inovices-dash-count">
                      <div className="inovices-amount">$8,8,797</div>
                    </div>
                  </div>
                  <p className="inovices-all">
                    Cancelled Invoices <span>80</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <Table
                      rowSelection={rowSelection}
                      pagination={{
                        total: data.length,
                        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true, onShowSizeChange: onShowSizeChange, itemRender: itemRender
                      }}
                      className="table table-striped table-nowrap custom-table mb-0 datatable dataTable no-footer"
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
        {/* /Page Content */}
      </div>
      {/* /Page Wrapper */}
    </>

  )
};
export default Invoices;
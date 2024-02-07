import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from "react-router-dom";
import { IMG02, IMG03, IMG04, IMG05, IMG06, IMG07, IMG08, IMG09 } from './img.jsx';
import { FiBookOpen, FiBookmark, FiCalendar, FiGrid, FiList, FiPlusCircle, FiPlusSquare, FiSettings, FiUserPlus } from "react-icons/fi";

const InvoicesReport = () => {
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
    const [selectedDate1, setSelectedDate1] = useState(new Date());
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const handleDateChange1 = (date) => {
        setSelectedDate1(date);
    };
    const handleDateChange2 = (date) => {
        setSelectedDate2(date);
    };

    return (
        <>
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
                            <div className="col-lg-8 col-md-8"></div>
                            <div className="col-lg-4 col-md-4">
                                <div className="invoices-settings-btn">
                                    <Link to="/invoices-settings"
                                        className="invoices-settings-icon"
                                    >
                                        <FiSettings />
                                    </Link>
                                    <Link to="/add-invoice" className="btn">
                                        <FiPlusCircle /> New Invoice
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <div className="card invoices-grid-card w-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Link to="/view-invoice" className="invoice-grid-link">
                                IN093439#@09
                            </Link>
                            <div className="dropdown dropdown-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/edit-invoice">
                                        <i className="fa fa-edit me-2" />
                                        Edit
                                    </Link>
                                    <Link className="dropdown-item" to="/view-invoice">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </Link>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-trash-alt me-2" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-middle">
                            <h2 className="card-middle-avatar">
                                <Link to="/profile">
                                    <img
                                        className="avatar avatar-sm me-2 avatar-img rounded-circle"
                                        src={IMG02}
                                        alt="User Image"
                                    />{" "}
                                    Barbara Moore
                                </Link>
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <span>
                                        <i className="fa fa-money-bill-alt" /> Amount
                                    </span>
                                    <h6 className="mb-0">$1,54,220</h6>
                                </div>
                                <div className="col-auto">
                                    <span>
                                        <i className="fa fa-calendar-alt" /> Due Date
                                    </span>
                                    <h6 className="mb-0">23 Mar, 2022</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <span className="badge bg-success-dark">Paid</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <div className="card invoices-grid-card w-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Link to="/view-invoice" className="invoice-grid-link">
                                IN093439#@10
                            </Link>
                            <div className="dropdown dropdown-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/edit-invoice">
                                        <i className="fa fa-edit me-2" />
                                        Edit
                                    </Link>
                                    <Link className="dropdown-item" to="/view-invoice">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </Link>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-trash-alt me-2" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-middle">
                            <h2 className="card-middle-avatar">
                                <Link to="/profile">
                                    <img
                                        className="avatar avatar-sm me-2 avatar-img rounded-circle"
                                        src={IMG03}
                                        alt="User Image"
                                    />{" "}
                                    Karlene Chaidez
                                </Link>
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <span>
                                        <i className="fa fa-money-bill-alt" /> Amount
                                    </span>
                                    <h6 className="mb-0">$1,222</h6>
                                </div>
                                <div className="col-auto">
                                    <span>
                                        <i className="fa fa-calendar-alt" /> Due Date
                                    </span>
                                    <h6 className="mb-0">18 Mar 2022</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <span className="badge bg-danger-dark">Overdue</span>
                                </div>
                                <div className="col text-end">
                                    <span className="text-danger text-sm">Overdue 14 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <div className="card invoices-grid-card w-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Link to="/view-invoice" className="invoice-grid-link">
                                IN093439#@11
                            </Link>
                            <div className="dropdown dropdown-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/edit-invoice">
                                        <i className="fa fa-edit me-2" />
                                        Edit
                                    </Link>
                                    <Link className="dropdown-item" to="/view-invoice">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </Link>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-trash-alt me-2" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-middle">
                            <h2 className="card-middle-avatar">
                                <Link to="/profile">
                                    <img
                                        className="avatar avatar-sm me-2 avatar-img rounded-circle"
                                        src={IMG04}
                                        alt="User Image"
                                    />{" "}
                                    Russell Copeland
                                </Link>
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <span>
                                        <i className="fa fa-money-bill-alt" /> Amount
                                    </span>
                                    <h6 className="mb-0">$3,470</h6>
                                </div>
                                <div className="col-auto">
                                    <span>
                                        <i className="fa fa-calendar-alt" /> Due Date
                                    </span>
                                    <h6 className="mb-0">10 Mar 2022</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <span className="badge bg-secondary-dark">Cancelled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <div className="card invoices-grid-card w-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Link to="/view-invoice" className="invoice-grid-link">
                                IN093439#@12
                            </Link>
                            <div className="dropdown dropdown-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/edit-invoice">
                                        <i className="fa fa-edit me-2" />
                                        Edit
                                    </Link>
                                    <Link className="dropdown-item" to="/view-invoice">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </Link>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-trash-alt me-2" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-middle">
                            <h2 className="card-middle-avatar">
                                <Link to="/profile">
                                    <img
                                        className="avatar avatar-sm me-2 avatar-img rounded-circle"
                                        src={IMG05}
                                        alt="User Image"
                                    />{" "}
                                    Joseph Collins
                                </Link>
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <span>
                                        <i className="fa fa-money-bill-alt" /> Amount
                                    </span>
                                    <h6 className="mb-0">$8,265</h6>
                                </div>
                                <div className="col-auto">
                                    <span>
                                        <i className="fa fa-calendar-alt" /> Due Date
                                    </span>
                                    <h6 className="mb-0">30 Mar 2022</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <span className="badge bg-primary-dark">Sent</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <div className="card invoices-grid-card w-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Link to="/view-invoice" className="invoice-grid-link">
                                IN093439#@13
                            </Link>
                            <div className="dropdown dropdown-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/edit-invoice">
                                        <i className="fa fa-edit me-2" />
                                        Edit
                                    </Link>
                                    <a className="dropdown-item" href="view-invoice">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </a>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-trash-alt me-2" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-middle">
                            <h2 className="card-middle-avatar">
                                <Link to="/profile">
                                    <img
                                        className="avatar avatar-sm me-2 avatar-img rounded-circle"
                                        src={IMG06}
                                        alt="User Image"
                                    />{" "}
                                    Jennifer Floyd
                                </Link>
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <span>
                                        <i className="fa fa-money-bill-alt" /> Amount
                                    </span>
                                    <h6 className="mb-0">$5,200</h6>
                                </div>
                                <div className="col-auto">
                                    <span>
                                        <i className="fa fa-calendar-alt" /> Due Date
                                    </span>
                                    <h6 className="mb-0">20 Mar 2022</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <span className="badge bg-secondary-dark">Cancelled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <div className="card invoices-grid-card w-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Link to="/view-invoice" className="invoice-grid-link">
                                IN093439#@14
                            </Link>
                            <div className="dropdown dropdown-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/edit-invoice">
                                        <i className="fa fa-edit me-2" />
                                        Edit
                                    </Link>
                                    <Link className="dropdown-item" to="/view-invoice">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </Link>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-trash-alt me-2" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-middle">
                            <h2 className="card-middle-avatar">
                                <Link to="/profile">
                                    <img
                                        className="avatar avatar-sm me-2 avatar-img rounded-circle"
                                        src={IMG07}
                                        alt="User Image"
                                    />{" "}
                                    Leatha Bailey
                                </Link>
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <span>
                                        <i className="fa fa-money-bill-alt" /> Amount
                                    </span>
                                    <h6 className="mb-0">$480</h6>
                                </div>
                                <div className="col-auto">
                                    <span>
                                        <i className="fa fa-calendar-alt" /> Due Date
                                    </span>
                                    <h6 className="mb-0">15 Mar 2022</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <span className="badge bg-primary-dark">Sent</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <div className="card invoices-grid-card w-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Link to="/view-invoice" className="invoice-grid-link">
                                IN093439#@15
                            </Link>
                            <div className="dropdown dropdown-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/edit-invoice">
                                        <i className="fa fa-edit me-2" />
                                        Edit
                                    </Link>
                                    <Link className="dropdown-item" to="/view-invoice">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </Link>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-trash-alt me-2" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-middle">
                            <h2 className="card-middle-avatar">
                                <Link to="/profile">
                                    <img
                                        className="avatar avatar-sm me-2 avatar-img rounded-circle"
                                        src={IMG08}
                                        alt="User Image"
                                    />{" "}
                                    Alex Campbell
                                </Link>
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <span>
                                        <i className="fa fa-money-bill-alt" /> Amount
                                    </span>
                                    <h6 className="mb-0">$1,999</h6>
                                </div>
                                <div className="col-auto">
                                    <span>
                                        <i className="fa fa-calendar-alt" /> Due Date
                                    </span>
                                    <h6 className="mb-0">08 Mar 2022</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <span className="badge bg-danger-dark">Overdue</span>
                                </div>
                                <div className="col text-end">
                                    <span className="text-danger text-sm">Overdue 10 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <div className="card invoices-grid-card w-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Link to="/view-invoice" className="invoice-grid-link">
                                IN093439#@016
                            </Link>
                            <div className="dropdown dropdown-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/edit-invoice">
                                        <i className="fa fa-edit me-2" />
                                        Edit
                                    </Link>
                                    <Link className="dropdown-item" to="/view-invoice">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </Link>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-trash-alt me-2" />
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-middle">
                            <h2 className="card-middle-avatar">
                                <Link to="/profile">
                                    <img
                                        className="avatar avatar-sm me-2 avatar-img rounded-circle"
                                        src={IMG09}
                                        alt="User Image"
                                    />{" "}
                                    Marie Canales
                                </Link>
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <span>
                                        <i className="fa fa-money-bill-alt" /> Amount
                                    </span>
                                    <h6 className="mb-0">$2,700</h6>
                                </div>
                                <div className="col-auto">
                                    <span>
                                        <i className="fa fa-calendar-alt" /> Due Date
                                    </span>
                                    <h6 className="mb-0">18 Mar, 2022</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <span className="badge bg-success-dark">Paid</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="invoice-load-btn">
                        <a href="#" className="btn">
                            <span className="spinner-border text-primary" /> Load more
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
};
export default InvoicesReport;      
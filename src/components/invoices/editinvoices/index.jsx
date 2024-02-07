import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import InvoicesModal from '../addinvoices/modal.jsx'
import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from "react-datepicker";
import Select from 'react-select';
import { FiChevronDown } from 'react-icons/fi';
const EditInvoices = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const month = [
    { label: "March", value: 1 },
    { label: "April", value: 2 },
    { label: "May", value: 3 },
    { label: "June", value: 3 },
    { label: "July", value: 3 },
  ];
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };
  const [isShown, setIsShown] = useState(true);
  const dropdown = (event) => {
    setIsShown(current => !current);
  };
  useEffect(() => {
    $("input[name='invoice']").click(function () {
      if ($("#chkYes").is(":checked")) {
        $("#show-invoices").show();
      } else {
        $("#show-invoices").hide();
      }
    });
    $(".add-table-items").on('click', '.remove-btn', function () {
      $(this).closest('.add-row').remove();
      return false;
    });

    // Invoices Table Add More

    $(".add-table-items").on('click', '.remove-btn', function () {
      $(this).closest('.add-row').remove();
      return false;
    });

    $(document).on("click", ".add-btns", function () {
      var experiencecontent = '<tr class="add-row">' +
        '<td>' +
        '<input type="text" class="form-control">' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control">' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control">' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control">' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control">' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control">' +
        '</td>' +
        '<td class="add-remove text-end">' +
        ' <Link to="#" class="add-btns me-2"><i class="fa fa-plus-circle"></i></Link> ' +
        ' <Link to="#" class="copy-btn me-2"><i class="fa fa-copy"></i></Link>' +
        '<Link to="#" class="remove-btn"><i class="fa fa-trash"></i></Link>' +
        '</td>' +
        '</tr>';

      $(".add-table-items").append(experiencecontent);
      return false;
    });
    $(document).on("click", ".add-links1", function () {
      var experiencecontent = '<div class="links-cont">' +
        '<div class="service-amount">' +
        '<Link to="#" class="service-trash1"><i class="fa fa-minus-circle me-1"></i>Service Charge</Link> <span>$ 4</span' +
        '</div>' +
        '</div>';

      $(".links-info-one").append(experiencecontent);
      return false;
    });
    $(".links-info-one").on('click', '.service-trash1', function () {
      $(this).closest('.links-cont').remove();
      return false;
    });


    $(".links-info-discount").on('click', '.service-trash-one', function () {
      $(this).closest('.links-cont-discount').remove();
      return false;
    });
    $(document).on("click", ".add-links-one", function () {
      var experiencecontent = '<div class="links-cont-discount">' +
        '<div class="service-amount">' +
        '<Link to="#" class="service-trash-one"><i class="fa fa-minus-circle me-1"></i>Offer new</Link> <span>$ 4 %</span' +
        '</div>' +
        '</div>';

      $(".links-info-discount").append(experiencecontent);
      return false;
    });
  }, [])
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <Helmet>
          <title>Invoice- CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header invoices-page-header">
            <div className="row align-items-center">
              <div className="col">
                <ul className="breadcrumb invoices-breadcrumb">
                  <li className="breadcrumb-item invoices-breadcrumb-item">
                    <Link to="/invoices">
                      <i className="fa fa-chevron-left" /> Back to Invoice List
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-auto">
                <div className="invoices-create-btn">
                  <Link
                    className="invoices-preview-link"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#invoices_preview"
                  >
                    <i className="fa fa-eye" /> Preview
                  </Link>
                  <Link
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#delete_invoices_details"
                    className="btn delete-invoice-btn"
                  >
                    Delete Invoice
                  </Link>
                  <Link
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#save_invocies_details"
                    className="btn save-invoice-btn"
                  >
                    Save Draft
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="card invoices-add-card">
                <div className="card-body">
                  <form action="#" className="invoices-form">
                    <div className="invoices-main-form">
                      <div className="row">
                        <div className="col-xl-4 col-md-6 col-sm-12 col-12">
                          <div className="form-group">
                            <label>Customer Name</label>
                            <div className="multipleSelection">
                              <div className="selectBox" onClick={dropdown}>
                                <p className="mb-0">Select Customer</p>
                                <span className="down-icon">
                                  <FiChevronDown className="feather-chevron-down" />
                                </span>
                              </div>
                              <div id="checkBoxes-one" style={{ display: isShown ? 'none' : 'block' }}>
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
                                <button
                                  type="submit"
                                  className="btn w-100 btn-primary"
                                >
                                  Apply
                                </button>
                                <button type="reset" className="btn w-100 btn-grey">
                                  Reset
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Po Number</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter Reference Number"
                            />
                          </div>
                        </div>
                        <div className="col-xl-5 col-md-6 col-sm-12 col-12">
                          <h4 className="invoice-details-title">Invoice details</h4>
                          <div className="invoice-details-box">
                            <div className="invoice-inner-head">
                              <span>
                                Invoice No.{" "}
                                <Link to="/view-invoice">IN093439#@09</Link>
                              </span>
                            </div>
                            <div className="invoice-inner-footer">
                              <div className="row align-items-center">
                                <div className="col-lg-6 col-md-6">
                                  <div className="invoice-inner-date">
                                    <span>
                                      Date{" "}
                                      <DatePicker
                                        className="form-control"
                                        selected={selectedDate1}
                                        onChange={handleDateChange1}
                                        dateFormat="dd/MM/yyyy"
                                        showDayMonthYearPicker />
                                    </span>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="invoice-inner-date invoice-inner-datepic">
                                    <span>
                                      Due Date{" "}
                                      <DatePicker
                                        className="form-control"
                                        selected={selectedDate2}
                                        onChange={handleDateChange2}
                                        dateFormat="dd/MM/yyyy"
                                        showDayMonthYearPicker />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-12 col-sm-12 col-12">
                          <div className="inovices-month-info">
                            <div className="form-group mb-0">
                              <label className="custom_check w-100">
                                <input
                                  type="checkbox"
                                  id="enableTax"
                                  name="invoice"
                                />
                                <span className="checkmark" /> Enable tax
                              </label>
                              <label className="custom_check w-100">
                                <input type="checkbox" id="chkYes" name="invoice" />
                                <span className="checkmark" /> Recurring Invoice
                              </label>
                            </div>
                            <div id="show-invoices">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <Select
                                      placeholder="Select"
                                      defaultValue={selectedOption}
                                      onChange={setSelectedOption}
                                      options={month}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Enter Months"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="invoice-item">
                      <div className="row">
                        <div className="col-xl-4 col-lg-6 col-md-6">
                          <div className="invoice-info">
                            <strong className="customer-text">
                              Invoice From{" "}
                              <Link className="small" to="/edit-invoice">
                                Edit Address
                              </Link>
                            </strong>
                            <p className="invoice-details invoice-details-two">
                              Darren Elder <br />
                              806 Twin Willow Lane, Old Forge,
                              <br />
                              Newyork, USA <br />
                            </p>
                          </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6">
                          <div className="invoice-info">
                            <strong className="customer-text">Invoice To</strong>
                            <p className="invoice-details invoice-details-two">
                              Walter Roberson <br />
                              299 Star Trek Drive, Panama City, <br />
                              Florida, 32405, USA <br />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="invoice-add-table">
                      <h4>Item Details</h4>
                      <div className="table-responsive">
                        <table className="table table-striped table-nowrap  mb-0 no-footer add-table-items">
                          <thead>
                            <tr>
                              <th>Items</th>
                              <th>Category</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Amount</th>
                              <th>Discount</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="add-row">
                              <td>
                                <input type="text" className="form-control" placeholder="Item Name" />
                              </td>
                              <td>
                                <input type="text" className="form-control" placeholder="Category Name" />
                              </td>
                              <td>
                                <input type="text" className="form-control" placeholder="2" />
                              </td>
                              <td>
                                <input type="text" className="form-control" placeholder="$10" />
                              </td>
                              <td>
                                <input type="text" className="form-control" placeholder="$20" />
                              </td>
                              <td>
                                <input type="text" className="form-control" placeholder="4%" />
                              </td>
                              <td className="add-remove text-end">
                                <Link
                                  to="#"
                                  className="add-btns me-2"
                                >
                                  <i className="fa fa-plus-circle" />
                                </Link>
                                <Link to="#" className="copy-btn me-2">
                                  <i className="fa fa-copy" />
                                </Link>
                                <Link
                                  to="#"
                                  className="remove-btn"
                                >
                                  <i className="fa fa-trash" />
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-7 col-md-6">
                        <div className="invoice-fields">
                          <h4 className="field-title">More Fields</h4>
                          <div className="payment-details">
                            <p>Debit Card XXXXXXXXXXXX-2541 HDFC Bank</p>
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_bank_details"
                            >
                              <i className="fa fa-trash" />
                            </Link>
                          </div>
                        </div>
                        <div className="invoice-faq">
                          <div
                            className="panel-group"
                            id="accordion"
                            role="tablist"
                            aria-multiselectable="true"
                          >
                            <div className="faq-tab">
                              <div className="panel panel-default">
                                <div className="panel-heading" role="tab" id="headingTwo">
                                  <p className="panel-title">
                                    <Link
                                      className="collapsed"
                                      data-bs-toggle="collapse"
                                      data-bs-parent="#accordion"
                                      to="#collapseTwo"
                                      aria-expanded="false"
                                      aria-controls="collapseTwo"
                                    >
                                      <i className="fa fa-plus-circle me-1" /> Add Terms &amp;
                                      Conditions
                                    </Link>
                                  </p>
                                </div>
                                <div
                                  id="collapseTwo"
                                  className="panel-collapse collapse"
                                  role="tabpanel"
                                  aria-labelledby="headingTwo"
                                  data-bs-parent="#accordion"
                                >
                                  <div className="panel-body">
                                    <textarea className="form-control" defaultValue={""} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="faq-tab">
                              <div className="panel panel-default">
                                <div className="panel-heading" role="tab" id="headingThree">
                                  <p className="panel-title">
                                    <Link
                                      className="collapsed"
                                      data-bs-toggle="collapse"
                                      data-bs-parent="#accordion"
                                      to="#collapseThree"
                                      aria-expanded="false"
                                      aria-controls="collapseThree"
                                    >
                                      <i className="fa fa-plus-circle me-1" /> Add Notes
                                    </Link>
                                  </p>
                                </div>
                                <div
                                  id="collapseThree"
                                  className="panel-collapse collapse"
                                  role="tabpanel"
                                  aria-labelledby="headingThree"
                                  data-bs-parent="#accordion"
                                >
                                  <div className="panel-body">
                                    <textarea className="form-control" defaultValue={""} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-5 col-md-6">
                        <div className="invoice-total-card">
                          <h4 className="invoice-total-title">Summary</h4>
                          <div className="invoice-total-box">
                            <div className="invoice-total-inner">
                              <p>
                                Taxable Amount <span>$21</span>
                              </p>
                              <p>
                                Round Off
                                <input type="checkbox" id="status_1" className="check" />
                                <label htmlFor="status_1" className="checktoggles">
                                  checkbox
                                </label>
                                <span>$54</span>
                              </p>
                              <div className="links-info-one">
                                <div className="links-info">
                                  <div className="links-cont">
                                    <Link to="#" className="service-trash"></Link>
                                  </div>
                                </div>
                              </div>
                              <Link to="#" className="add-links1">
                                <i className="fa fa-plus-circle me-1" /> Additional Charges
                              </Link>
                              <div className="links-info-discount">
                                <div className="links-cont-discount">
                                  <Link to="#" className="add-links-one">
                                    <i className="fa fa-plus-circle me-1" /> Add more Discount
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="invoice-total-footer">
                              <h4>
                                Total Amount <span>$ 894.00</span>
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="upload-sign">
                          <div className="form-group service-upload">
                            <span>Upload Sign</span>
                            <input type="file" multiple="" />
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Name of the Signatuaory"
                            />
                          </div>
                          <div className="form-group float-end mb-0">
                            <button className="btn btn-primary" type="submit">
                              Save Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal custom-modal fade"
        id="delete_bank_details"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Bank Details</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-continue-btn"
                    >
                      Delete
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* /Page Wrapper */}
      <InvoicesModal />
    </>

  )
};
export default EditInvoices;    
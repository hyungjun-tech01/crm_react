import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import PurchaseDetailsModel from "./PurchaseDetailsModel";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ShoppingBagOutlined } from "@mui/icons-material";
import { PurchaseRepo } from "../../repository/purchase";
import { atomAllPurchases, defaultPurchase } from "../../atoms/atoms";
import { compareText, formateDate } from "../../constants/functions";

const Purchase = () => {
  const { loadAllPurchases, modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);
  const allPurchaseData = useRecoilValue(atomAllPurchases);
  const [ purchaseChange, setPurchaseChange ] = useState(null);
  const [ cookies ] = useCookies(["myLationCrmUserName",  "myLationCrmUserId"]);
  // const [ selectedEstablishDate, setSelectedEstablishDate ] = useState(null);
  // const [ selectedCloseDate, setSelectedCloseDate ] = useState(null);

  // --- Functions used for Table ------------------------------
  const handleClickPurchase = useCallback((id)=>{
    console.log('[Purchase] set current purchase : ', id);
    setCurrentPurchase(id);
  },[setCurrentPurchase]);

  const handleAddNewPurchaseClicked = useCallback(() => {
    initializePurchaseTemplate();
  }, []);

  // --- Functions used for Add New Purchase ------------------------------
  const initializePurchaseTemplate = useCallback(() => {
    setPurchaseChange({...defaultPurchase});
    document.querySelector("#add_new_purchase_form").reset();
  }, []);

  // const handleEstablishDateChange = useCallback((date) => {
  //   console.log(`[ handleEstablishDateChange ] ${date}`);
  //   setSelectedEstablishDate(date);
  //   purchaseChange.establishment_date = date;
  // },[]);

  // const handleCloseDateChange = useCallback((date) => {
  //   console.log(`[ handleEstablishDateChange ] ${date}`);
  //   setSelectedCloseDate(date);
  // },[]);

  const handlePurchaseChange = useCallback((e)=>{
    let input_data = null;
    if(e.target.name === 'establishment_date' || e.target.name === 'closure_date'){
      const date_value = new Date(e.target.value);
      if(!isNaN(date_value.valueOf())){
        input_data = formateDate(date_value);
      };
    } else {
      input_data = e.target.value;
    }
    const modifiedData = {
      ...purchaseChange,
      [e.target.name]: input_data,
    };
    setPurchaseChange(modifiedData);
  }, [purchaseChange]);

  const handleAddNewPurchase = useCallback((event)=>{
    // Check data if they are available
    if(purchaseChange.purchase_name === null
      || purchaseChange.purchase_name === '')
    {
      console.log("Purchase Name must be available!");
      return;
    };

    const newComData = {
      ...purchaseChange,
      action_type: 'ADD',
      purchase_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewPurchase ]`, newComData);
    const result = modifyPurchase(newComData);
    if(result){
      initializePurchaseTemplate();
      //close modal ?
    };
  },[purchaseChange, cookies.myLationCrmUserName, initializePurchaseTemplate, modifyPurchase]);

  const columns = [
    {
      title: "Purchase Type",
      dataIndex: "product_type",
      render: (text, record) => (
        <>
          <a href="#" data-bs-toggle="modal" data-bs-target="#purchase-details" onClick={()=>{handleClickPurchase(record.purchase_code);}}>
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.purchase_type, b.purchase_type),
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.product_name, b.product_name),
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.serial_number, b.serial_number),
    },
    {
      title: "Delivery Date",
      dataIndex: "delivery_date",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.delivery_date - b.delivery_date,
    },
    {
      title: "MA Contact Date",
      dataIndex: "MA_contact_date",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.MA_contact_date - b.MA_contact_date,
    },
    {
      title: "MA Finish Date",
      dataIndex: "MA_finish_date",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.MA_finish_date - b.MA_finish_date,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.currency - b.currency,
    },
    {
      title: "Register",
      dataIndex: "register",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.register - b.register,
    },
    {
      title: "Registration Date",
      dataIndex: "registration_date",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.registration_date - b.registration_date,
    },
    {
      title: "Registration Code",
      dataIndex: "regcode",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.regcode, b.regcode),
    },
    // {
    //   title: "",
    //   dataIndex: "star",
    //   render: (text, record) => (
    //     <i className="fa fa-star" aria-hidden="true" />
    //   ),
    //   sorter: (a, b) => a.status.length - b.status.length,
    // },
    // {
    //   title: "Actions",
    //   dataIndex: "status",
    //   render: (text, record) => (
    //     <div className="dropdown dropdown-action">
    //       <a
    //         href="#"
    //         className="action-icon dropdown-toggle"
    //         data-bs-toggle="dropdown"
    //         aria-expanded="false"
    //       >
    //         <i className="material-icons">more_vert</i>
    //       </a>
    //       <div className="dropdown-menu dropdown-menu-right">
    //         <a className="dropdown-item" href="#">
    //           Edit This Purchase
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Change Organization Image
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Delete This Organization
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Change Record Owner
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Generate Merge Document
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Print This Organization
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Add New Task For Organization
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Add New Event For Organization
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Add Activity Set To Organization
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Add New Contact For Organization
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Add New Opportunity For Organization
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Add New Opportunity For Organization
    //         </a>
    //         <a className="dropdown-item" href="#">
    //           Add New Project For Organization
    //         </a>
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red",
    }),
  };

  useEffect(() => {    
    if (allPurchaseData.length === 0) {
      loadAllPurchases();
    };
    initializePurchaseTemplate();
  }, [allPurchaseData, initializePurchaseTemplate, loadAllPurchases]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>Purchase - CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          <div className="crms-title row bg-white">
            <div className="col">
              <h3 className="page-title m-0">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  {/* <i className="feather-database" /> */}
                  <i>
                    <ShoppingBagOutlined />
                  </i>
                </span>{" "}
                Purchase{" "}
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Purchase</li>
              </ul>
            </div>
          </div>
          {/* Page Header */}
          <div className="page-header pt-3 mb-0 ">
            <div className="row">
              <div className="col">
                <div className="dropdown">
                  <a
                    className="dropdown-toggle recently-viewed"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {" "}
                    Recently Viewed
                  </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">
                      Recently Viewed
                    </a>
                    <a className="dropdown-item" href="#">
                      Items I'm following
                    </a>
                    <a className="dropdown-item" href="#">
                      All Purchase
                    </a>
                    <a className="dropdown-item" href="#">
                      Purchase added in the last 24 hours
                    </a>
                    <a className="dropdown-item" href="#">
                      Purchase added in the last 7 days
                    </a>
                    <a className="dropdown-item" href="#">
                      Purchase with no notes in the last month
                    </a>
                    <a className="dropdown-item" href="#">
                      Purchase with no notes in the last 7 days
                    </a>
                  </div>
                </div>
              </div>
              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  <li className="nav-item dropdown list-inline-item add-lists">
                    <a
                      className="nav-link dropdown-toggle"
                      id="profileDropdown"
                      href="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nav-profile-text">
                        <i className="fa fa-th" aria-hidden="true" />
                      </div>
                    </a>
                    <div
                      className="dropdown-menu navbar-dropdown"
                      aria-labelledby="profileDropdown"
                    >
                      <a
                        className="dropdown-item"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add-new-list"
                      >
                        Add New List View
                      </a>
                    </div>
                  </li>
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
                      data-bs-toggle="modal"
                      data-bs-target="#add_purchase"
                      onClick={handleAddNewPurchaseClicked}
                    >
                      New Purchase
                    </button>
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
                        total: allPurchaseData.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      className="table"
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={allPurchaseData}
                      rowKey={(record) => record.purchase_code}
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
                <button type="button" className="close" data-bs-dismiss="modal">
                  ×
                </button>
              </div>
              {/* Modal body */}
              <div className="modal-body">
                <form className="forms-sample">
                  <div className="form-group row">
                    <label
                      htmlFor="view-name"
                      className="col-sm-4 col-form-label"
                    >
                      New View Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="view-name"
                        placeholder="New View Name"
                      />
                    </div>
                  </div>
                  <div className="form-group row pt-4">
                    <label className="col-sm-4 col-form-label">
                      Sharing Settings
                    </label>
                    <div className="col-sm-8">
                      <div className="form-group">
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="optionsRadios"
                              id="optionsRadios1"
                              defaultValue
                            />{" "}
                            Just For Me <i className="input-helper" />
                          </label>
                        </div>
                        <br />
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="optionsRadios"
                              id="optionsRadios2"
                              defaultValue="option2"
                              defaultChecked
                            />{" "}
                            Share Filter with Everyone{" "}
                            <i className="input-helper" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-gradient-primary me-2"
                    >
                      Submit
                    </button>
                    <button className="btn btn-light">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
        <div
          className="modal right fade"
          id="add_purchase"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" role="document">
            <button
              type="button"
              className="close md-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-center"><b>Add Purchase</b></h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <form id="add_new_purchase_form">
                      <h4>Organization Name</h4>
                      <div className="form-group row">
                        {/* <div className="col-md-12">
                          <label className="col-form-label">
                            Organization Name{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Organization Name"
                            name="organization"
                          />
                        </div> */}
                        <div className="col-sm-6">
                          <label className="col-form-label">
                            Organization Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Organization Name"
                            name="purchase_name"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">English Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="English Name"
                            name="purchase_name_eng"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                      </div>
                      <h4>Organization Information Details</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Group</label>
                          <select className="form-control"  name="group_" onChange={handlePurchaseChange}>
                            <option value="">choose proper group</option>
                            <optgroup label="Shared Group">
                              <option value="prospective">Prospective Customer</option>
                              <option value="current">Current Customer</option>
                              <option value="etc">Etc</option>
                            </optgroup>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Purchase Scale</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Purchase Scale"
                              name="purchase_scale"
                              onChange={handlePurchaseChange}
                            />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Deal Type</label>
                          <select className="form-control" name="deal_type" onChange={handlePurchaseChange}>
                            <option value="">choose proper deal type</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Bussiness Registration Code</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Bussiness Registration Code"
                              name="business_registration_code"
                              onChange={handlePurchaseChange}
                            />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Establishment Date</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Establishment Date"
                            name="establishment_date"
                            onChange={handlePurchaseChange}
                          />
                          {/* <div className="cal-icon">
                            <DatePicker
                              className="form-control"
                              selected={selectedEstablishDate}
                              onChange={handleEstablishDateChange}
                              dateFormat="yyyy.MM.dd"
                              showDayMonthYearPicker
                            />
                          </div> */}
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Closure Date</label>
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Closure Date"
                            name="closure_date"
                            onChange={handlePurchaseChange}
                          />
                          {/* <div className="cal-icon">
                            <DatePicker
                              className="form-control"
                              selected={selectedCloseDate}
                              onChange={handleCloseDateChange}
                              dateFormat="yyyy.MM.dd"
                              showDayMonthYearPicker
                            />
                          </div> */}
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">CEO Name</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="CEO Name"
                              name="ceo_name"
                              onChange={handlePurchaseChange}
                            />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Business Type</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Business Type"
                            name="business_type"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Business Item</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Business Item"
                            name="business_item"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Industry Type</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Industry Type"
                            name="industry_type"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                      </div>
                      <h4>Organization Contact Details</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Phone"
                            name="purchase_phone_number"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Fax</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Fax"
                            name="purchase_fax_number"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Website</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Website"
                            name="homepage"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Linkedin</label>
                          <input
                            type="text"
                            className="form-control"
                            name="linkedin"
                            placeholder="Linkedin"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Facebook</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fb"
                            placeholder="Facebook"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Twitter</label>
                          <input
                            type="text"
                            className="form-control"
                            name="twitter"
                            placeholder="Twitter"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">
                            Email Domains
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="domains"
                            placeholder="Email Domains"
                          />
                        </div>
                      </div>
                      <h4>Address Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Address</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Address"
                            defaultValue={""}
                            name="purchase_address"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6 mt-3">
                          <label className="col-form-label" />
                          <br />
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Postal code"
                            name="purchase_zip_code"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                      </div>
                      <h4>Additional Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Bank Account</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Bank Account"
                            name="acount_code"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Bank Name</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Bank Name"
                            name="bank_name"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Account Owner</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Account Owner"
                            name="account_owner"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Sales Resource</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Sales Resource"
                            name="sales_resource"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Application Engineer</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Application Engineer"
                            name="application_engineer"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Region</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Region"
                            name="region"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                      </div>
                      <h4>Memo</h4>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">Memo</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Memo"
                            defaultValue={""}
                            name="memo"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                      </div>
                      <div className="text-center py-3">
                        <button
                          type="button"
                          className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          onClick={handleAddNewPurchase}
                        >
                          Save
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className="btn btn-secondary btn-rounded"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* modal-content */}
          </div>
          {/* modal-dialog */}
        </div>
        <PurchaseDetailsModel />
      </div>
    </HelmetProvider>
  );
};
export default Purchase;

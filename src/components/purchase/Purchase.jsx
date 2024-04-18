import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import PurchaseDetailsModel from "./PurchaseDetailsModel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { MoreVert } from '@mui/icons-material';
import { BiShoppingBag } from "react-icons/bi";
import { PurchaseRepo } from "../../repository/purchase";
import { atomAllLeads, atomAllPurchases, defaultPurchase } from "../../atoms/atoms";
import { compareText } from "../../constants/functions";
import { LeadRepo } from "../../repository/lead";

const Purchase = () => {
  const { loadAllLeads } = useRecoilValue(LeadRepo);
  const { loadAllPurchases, modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allPurchaseData = useRecoilValue(atomAllPurchases);
  const [ cookies ] = useCookies(["myLationCrmUserName",  "myLationCrmUserId"]);

  const [ purchaseChange, setPurchaseChange ] = useState(null);
  const [ leadForSelection, setLeadForSelection ] = useState(null);

  const [ deliveryDate, setDeliveryDate ] = useState(new Date());
  const [ contactDate, setContactDate ] = useState(new Date());
  const [ finishDate, setFinishDate ] = useState(new Date());
  const [ registerDate, setRegisterDate ] = useState(new Date());

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
  }, [defaultPurchase]);

  const handleLeadSelectionChange = useCallback((value) => {
    purchaseChange.lead_code = value.value.lead_code;
    purchaseChange.company_code = value.value.company_code;
  });

  const handleDeliveryDateChange = useCallback((date) => {
    console.log(`[ handleDeliveryDateChange ] ${date}`);
    setDeliveryDate(date);
    purchaseChange.delivery_date = date;
  },[purchaseChange, setDeliveryDate]);

  const handleContactDateChange = useCallback((date) => {
    console.log(`[ handleContactDateChange ] ${date}`);
    setContactDate(date);
    purchaseChange.MA_contact_date = date;
  },[purchaseChange, setContactDate]);

  const handleFinishDateChange = useCallback((date) => {
    console.log(`[ handleContactDateChange ] ${date}`);
    setFinishDate(date);
    purchaseChange.MA_finish_date = date;
  },[purchaseChange, setFinishDate]);

  const handleRegisterDateChange = useCallback((date) => {
    console.log(`[ handleContactDateChange ] ${date}`);
    setRegisterDate(date);
    purchaseChange.registration_date = date;
  },[purchaseChange, setFinishDate]);

  const handlePurchaseChange = useCallback((e)=>{
    const modifiedData = {
      ...purchaseChange,
      [e.target.name]: e.target.value,
    };
    setPurchaseChange(modifiedData);
  }, [purchaseChange]);

  const handleAddNewPurchase = useCallback((event)=>{
    // Check data if they are available
    if(purchaseChange.company_code === null
      || purchaseChange.product_code === null)
    {
      console.log("Necessary inputs must be available!");
      return;
    };

    const newPurchaseData = {
      ...purchaseChange,
      action_type: 'ADD',
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewPurchase ]`, newPurchaseData);
    const result = modifyPurchase(newPurchaseData);
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
          {text}
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
      render: (text, record) =>
        <>
          <a href="#" data-bs-toggle="modal" data-bs-target="#purchase-details" onClick={()=>{handleClickPurchase(record.purchase_code);}}>
            {text}
          </a>
        </>,
      sorter: (a, b) => compareText(a.serial_number, b.serial_number),
    },
    {
      title: "Delivery Date",
      dataIndex: "delivery_date",
      render: (text, record) =>
        <>
          { (text && text !=="") && new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'}) }
        </>,
      sorter: (a, b) => a.delivery_date - b.delivery_date,
    },
    {
      title: "MA Contact Date",
      dataIndex: "MA_contact_date",
      render: (text, record) =>
        <>
          { (text && text !=="") && new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'}) }
        </>,
      sorter: (a, b) => a.MA_contact_date - b.MA_contact_date,
    },
    {
      title: "MA Finish Date",
      dataIndex: "MA_finish_date",
      render: (text, record) =>
        <>
          { (text && text !=="") && new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'}) }
        </>,
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
      render: (text, record) => 
      <>
        { (text && text !=="") && new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'}) }
      </>,
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
    //         <MoreVert />
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
    if(allLeadData.length === 0) {
      loadAllLeads();
    } else {
      const temp_data = allLeadData.map(lead => {return {
        label : lead.lead_name,
        value : {
          lead_code: lead.lead_code,
          company_code: lead.company_code,
        }
      }});
      temp_data.sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      setLeadForSelection(temp_data);
    };
    if (allPurchaseData.length === 0) {
      loadAllPurchases();
    };
    initializePurchaseTemplate();
  }, [allLeadData, allPurchaseData, initializePurchaseTemplate, loadAllPurchases]);

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
                    <BiShoppingBag />
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
                      <h4>Lead</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">
                            Lead Name
                            <span className="text-danger">*</span>
                          </label>
                          <Select options={leadForSelection} onChange={handleLeadSelectionChange}/>
                        </div>
                      </div>
                      <h4>Product</h4>
                      <h4>Deal</h4>
                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="col-form-label">Quantity</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Quantity"
                            name="quantity"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Price</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Price"
                            name="price"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-3">
                          <label className="col-form-label">Currency</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Currency"
                            name="currency"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-4">
                          <label className="col-form-label">Delivery Date</label>
                          <DatePicker
                            className="form-control"
                            selected={deliveryDate}
                            dateFormat="yyyy.MM.dd"
                            onChange={handleDeliveryDateChange}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label className="col-form-label">MA Contact Date</label>
                          <DatePicker
                            className="form-control"
                            selected={contactDate}
                            dateFormat="yyyy.MM.dd"
                            onChange={handleContactDateChange}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label className="col-form-label">MA Finish Date</label>
                          <DatePicker
                            className="form-control"
                            selected={finishDate}
                            dateFormat="yyyy.MM.dd"
                            onChange={handleFinishDateChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-4">
                          <label className="col-form-label">Register</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Register"
                            name="register"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label className="col-form-label">Register Code</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Register Code"
                            name="regcode"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label className="col-form-label">Registration Date</label>
                          <DatePicker
                            className="form-control"
                            selected={registerDate}
                            dateFormat="yyyy.MM.dd"
                            onChange={handleRegisterDateChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">Momo</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            name="purchase_memo"
                            placeholder="Memo"
                            onChange={handlePurchaseChange}
                          />
                        </div>
                      </div>
                      <h4>Status Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <textarea
                            className="form-control"
                            rows={2}
                            name="status"
                            placeholder="Status"
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

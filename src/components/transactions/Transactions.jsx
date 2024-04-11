import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { Table } from "antd";
import "antd/dist/reset.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import "../antdstyle.css";
import TransactionsDetailsModel from "./TransactionsDetailsModel";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { BiReceipt } from "react-icons/bi";
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { TransactionRepo } from "../../repository/transaction";
import { atomAllCompanies, atomAllLeads, atomAllTransactions, defaultTransaction } from "../../atoms/atoms";
import { compareCompanyName , compareText, formateDate} from "../../constants/functions";

const Transactions = () => {
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allTransactionData = useRecoilValue(atomAllTransactions);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);
  const { loadAllTransactions, modifyTransaction, setCurrentTransaction } = useRecoilValue(TransactionRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName"]);

  const [ leadsForSelection, setLeadsForSelection ] = useState(null);
  const [ transactionChange, setTransactionChange ] = useState(null);
  const [ publishDate, setPublishDate ] = useState(new Date());

  const handlePublishDateChange = useCallback((date) => {
    setPublishDate(date);
    const localDate = formateDate(date);
    const tempChanges = {
      ...transactionChange,
      publish_date: localDate,
    };
    setTransactionChange(tempChanges);
  }, [transactionChange]);

  const handleSelectLead = useCallback((selected) => {
    const found_idx = allCompnayData.findIndex(com => com.company_code === selected.value.company_code);
    if(found_idx !== -1){
      const tempChanges = {
        ...transactionChange,
        lead_code: selected.value.lead_code,
        company_name: allCompnayData[found_idx].company_name,
        ceo_name: allCompnayData[found_idx].ceo_name,
        company_address: allCompnayData[found_idx].company_address,
        business_type: allCompnayData[found_idx].business_type,
        business_item: allCompnayData[found_idx].business_item,
        business_registration_code: allCompnayData[found_idx].business_registration_code,
      };
      setTransactionChange(tempChanges);
    } else {
      console.error('[ Transaction ] No matched Company!');
    }
    
  }, [])
  
  // --- Functions used for Add New Transaction ------------------------------
  const handleAddNewTransactionClicked = useCallback(() => {
    initializeTransactionTemplate();
  }, []);

  const initializeTransactionTemplate = useCallback(() => {
    setTransactionChange({ ...defaultTransaction });
    document.querySelector("#add_new_transaction_form").reset();
  }, []);

  const handleTransactionChange = useCallback((e) => {
    const modifiedData = {
      ...transactionChange,
      [e.target.name]: e.target.value,
    };
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleAddNewTransaction = useCallback((event)=>{
    // Check data if they are available
    if(transactionChange.company_code === null)
    {
      console.log("Company Name must be available!");
      return;
    };

    const newTransactionData = {
      ...transactionChange,
      action_type: 'ADD',
      recent_user: cookies.myLationCrmUserName,
    };
    console.log(`[ handleAddNewTransaction ]`, newTransactionData);
    const result = modifyTransaction(newTransactionData);
    if(result){
      initializeTransactionTemplate();
      //close modal ?
    };
  },[cookies.myLationCrmUserName, initializeTransactionTemplate, transactionChange, modifyTransaction]);

  // --- Section for Table ------------------------------
  const columns = [
    {
      title: "Compay",
      dataIndex: "company_name",
      render: (text, record) => (
        <>
          <a href="#" data-bs-toggle="modal"
            data-bs-target="#company-details"
            onClick={()=>setCurrentCompany(record.company_code)}
          >
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareCompanyName(a.company_name, b.company_name),
    },
    {
      title: "Title",
      dataIndex: "transaction_title",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#transactions-details"
            onClick={()=>setCurrentTransaction(record.transaction_code)}
          >
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.transaction_title, b.transaction_title),
    },
    {
      title: "Type",
      dataIndex: "transaction_type",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#transactions-details"
            onClick={()=>setCurrentTransaction(record.transaction_code)}
          >
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.transaction_type, b.transaction_type),
    },
    {
      title: "Publish Date",
      dataIndex: "publish_date",
      render: (text, record) => 
        <>
          {new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'})}
        </>,
      sorter: (a, b) => a.publish_date - b.publish_date,
    },
    {
      title: "Publish Type",
      dataIndex: "publish_type",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.publish_type, b.publish_type),
    },
    {
      title: "Payment Type",
      dataIndex: "payment_type",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.payment_type, b.payment_type),
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-center">
          <a
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </a>
          <div className="dropdown-menu dropdown-menu-right h-100">
            <a style={{ display: "initial" }} className="dropdown-item">
              Edit
            </a>
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
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red",
    }),
  };

  useEffect(() => {
    if (allCompnayData.length === 0) {
      loadAllCompanies();
    };
    if (allLeadData.length === 0) {
      loadAllLeads();
    } else {
      const lead_subset = allLeadData.map((data) => {
        return {
          label: data.lead_name,
          value: {
            lead_code: data.lead_code,
            company_code: data.company_code,
          },
        }
      });
      lead_subset.sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      setLeadsForSelection(lead_subset);
    };
    if (allTransactionData.length === 0) {
      loadAllTransactions();
    };
    initializeTransactionTemplate();
  }, [allCompnayData, allTransactionData, allTransactionData]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>Transactions - CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          <div className="crms-title row bg-white">
            <div className="col  p-0">
              <h3 className="page-title m-0">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  {/* <i className="feather-calendar" /> */}
                  <i>
                    <BiReceipt />
                  </i>
                </span>{" "}
                Transactions{" "}
              </h3>
            </div>
            <div className="col p-0 text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Transactions</li>
              </ul>
            </div>
          </div>
          <div className="page-header pt-3 mb-0 ">
            <div className="row">
              <div className="col">
                <div className="dropdown">
                  <a
                    className="dropdown-toggle recently-viewed"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {" "}
                    Propose Times{" "}
                  </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item">Recently Viewed</a>
                    <a className="dropdown-item">Items I'm following</a>
                    <a className="dropdown-item">All Transactions</a>
                    <a className="dropdown-item">All Closed Transactions</a>
                    <a className="dropdown-item">All Open Transactions</a>
                    <a className="dropdown-item">My Transactions</a>
                  </div>
                </div>
              </div>
              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
                      data-bs-toggle="modal"
                      data-bs-target="#add_new_transaction"
                      onClick={handleAddNewTransactionClicked}
                    >
                      Add Transaction
                    </button>
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
                        total: allTransactionData.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={allTransactionData}
                      rowKey={(record) => record.transaction_code}
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
        <TransactionsDetailsModel />
        {/* /Page Content */}

        <div
          className="modal right fade"
          id="add_new_transaction"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
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
                <h4 className="modal-title">Transaction</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
              <div className="row">
                  <div className="col-md-12">
                    <form id="add_new_transaction_form">
                      <h4>Transaction Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-9">
                          <label className="col-form-label">Name <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            name="transaction_title"
                            onChange={handleTransactionChange}
                          />
                        </div>
                        <div className="col-sm-3">
                          <label className="col-form-label">Type</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type"
                            name="transaction_type"
                            onChange={handleTransactionChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-8">
                          <label className="col-form-label">Publish Date</label>
                          <DatePicker
                            className="form-control"
                            selected={publishDate}
                            onChange={handlePublishDateChange}
                            dateFormat="yyyy.MM.dd"
                          />
                        </div>
                        <div className="col-sm-4">
                          <label className="col-form-label">Publish Type</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Publish Type"
                            name="publish_type"
                            onChange={handleTransactionChange}
                          />
                        </div>
                      </div>
                      <h4>Lead Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Lead Name</label>
                          <Select options={leadsForSelection} onChange={handleSelectLead} />
                        </div>
                      </div>
                      { (transactionChange && transactionChange.lead_code) && 
                        <>
                          <h4>Company Information</h4>
                          <div className="form-group row">
                            <div className="col-sm-6">
                              <label className="col-form-label">Organization</label>
                              <label className="col-form-label">{transactionChange.company_name}</label>
                            </div>
                            <div className="col-sm-6">
                              <label className="col-form-label">CEO Name</label>
                              <label className="col-form-label">{transactionChange.ceo_name}</label>
                            </div>
                          </div>
                          <div className="form-group row">
                            <div className="col-sm-12">
                              <label className="col-form-label">Address</label>
                              <label className="col-form-label">{transactionChange.company_address}</label>
                            </div>
                          </div>
                          <div className="form-group row">
                            <div className="col-sm-6">
                              <label className="col-form-label">Business Type </label>
                              <label className="col-form-label">{transactionChange.business_type}</label>
                            </div>
                            <div className="col-sm-6">
                              <label className="col-form-label">Business Item </label>
                              <label className="col-form-label">{transactionChange.business_item}</label>
                            </div>
                          </div>
                          <div className="form-group row">
                            <div className="col-sm-12">
                              <label className="col-form-label">Registration No.</label>
                              <label className="col-form-label">{transactionChange.business_registration_code}</label>
                            </div>
                          </div>
                        </>
                      }
                      <h4>Price Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Supply Price</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Supply Price"
                            name="supply_price"
                            onChange={handleTransactionChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Tax</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tax"
                            name="tax_price"
                            onChange={handleTransactionChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Total Price</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Total Price"
                            name="total_price"
                            onChange={handleTransactionChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Currency</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Currency"
                            name="currency"
                            onChange={handleTransactionChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Payment Type</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Payment Type"
                            name="payment_type"
                            onChange={handleTransactionChange}
                          />
                        </div>
                      </div>
                      <div className="text-center py-3">
                        <button
                          type="button"
                          className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          onClick={handleAddNewTransaction}
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
          </div>
        </div>
        {/* modal */}
        {/* cchange pipeline stage Modal */}
        <div className="modal" id="pipeline-stage">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Change Pipeline Stage</h4>
                <button type="button" className="close" data-bs-dismiss="modal">
                  ×
                </button>
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
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                >
                  Save
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-secondary btn-rounded cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Transactions;

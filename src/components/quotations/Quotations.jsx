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
import QuotationsDetailsModel from "./QuotationsDetailsModel";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import DealDetailsModel from "../deals/DealDetailsModel";
import ProjectDetailsModel from "../project/ProjectDetailsModel";
import LeadsDetailsModel from "../leads/LeadsDetailsModel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { BiCalculator } from "react-icons/bi";
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { QuotationRepo, QuotationSendTypes } from "../../repository/quotation";
import { atomAllCompanies, atomAllQuotations, atomAllLeads, defaultQuotation } from "../../atoms/atoms";
import { compareCompanyName, compareText, formateDate } from "../../constants/functions";

const Quotations = () => {
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allQuotationData = useRecoilValue(atomAllQuotations);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);
  const { loadAllQuotations, modifyQuotation, setCurrentQuotation } = useRecoilValue(QuotationRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName"]);

  const [ companiesForSelection, setCompaniesForSelection ] = useState([]);
  const [ leadsForSelection, setLeadsForSelection] = useState([]);
  const [ quotationChange, setQuotationChange ] = useState(null);
  const [ selectedLead, setSelectedLead ] = useState(null);
  const [ receiptDate, setReceiptDate ] = useState(new Date());

  const handleReceiptDateChange = (date) => {
    setReceiptDate(date);
    const localDate = formateDate(date);
    const localTime = date.toLocaleTimeString('ko-KR');
    const tempChanges = {
      ...quotationChange,
      receipt_date: localDate,
      receipt_time: localTime,
    };
    setQuotationChange(tempChanges);
  };

  // --- Functions used for Add New Quotation ------------------------------
  const handleAddNewQuotationClicked = useCallback(() => {
    initializeQuotationTemplate();
  }, []);

  const initializeQuotationTemplate = useCallback(() => {
    setQuotationChange({ ...defaultQuotation });
    setSelectedLead(null);
    document.querySelector("#add_new_quotation_form").reset();
  }, []);

  const handleQuotationChange = useCallback((e) => {
    const modifiedData = {
      ...quotationChange,
      [e.target.name]: e.target.value,
    };
    setQuotationChange(modifiedData);
  }, [quotationChange]);

  const handleSelectLead = useCallback((value) => {
    const tempChanges = {
      ...quotationChange,
      lead_code: value.code,
      lead_name: value.name,
      department: value.department,
      position: value.position,
      mobile_number: value.mobile,
      phone_number: value.phone,
      email: value.email,
      company_name: value.company,
      company_code: companiesForSelection[value.company],
    };
    setQuotationChange(tempChanges);
  }, [companiesForSelection, quotationChange]);

  const handleSelectQuotationType = useCallback((value) => {
    const tempChanges = {
      ...quotationChange,
      quotation_type: value.value,
    };
    setQuotationChange(tempChanges);
  }, [quotationChange]);

  const handleAddNewQuotation = useCallback((event)=>{
    // Check data if they are available
    if(quotationChange.lead_name === null
      || quotationChange.lead_name === ''
      || quotationChange.quotation_type === null
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };

    const newQuotationData = {
      ...quotationChange,
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserName,
    };
    console.log(`[ handleAddNewQuotation ]`, newQuotationData);
    const result = modifyQuotation(newQuotationData);
    if(result){
      initializeQuotationTemplate();
      //close modal ?
    };
  }, [cookies.myLationCrmUserName, initializeQuotationTemplate, quotationChange, modifyQuotation]);

  // --- Section for Table ------------------------------
  const columns = [
    {
      title: "Company",
      dataIndex: "company_name",
      render: (text, record) => (
        <>
          <a href="#" data-bs-toggle="modal"
            data-bs-target="#company-details"
            onClick={(event)=>{
              console.log("[Quotation] set current company : ", record.company_code);
              setCurrentCompany(record.company_code);
            }}
          >
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareCompanyName(a.company_name, b.company_name),
    },
    {
      title: "Type",
      dataIndex: "quotation_type",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#quotations-details"
            onClick={()=>{
              console.log("[Quotation] set current quotation : ", record.quotation_code);
              setCurrentQuotation(record.quotation_code);
          }}>
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.quotation_type, b.quotation_type),
    },
    {
      title: "Title",
      dataIndex: "quotation_title",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#quotations-details"
            onClick={()=>{
              console.log("[Quotation] set current quotation : ", record.quotation_code);
              setCurrentQuotation(record.quotation_code);
          }}>
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.quotation_title, b.quotation_title),
    },
    {
      title: "Date",
      dataIndex: "quotation_date",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#quotations-details"
            onClick={()=>{
              console.log("[Quotation] set current quotation : ", record.quotation_code);
              setCurrentQuotation(record.quotation_code);
          }}>
            {new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'})}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.quotation_date, b.quotation_date),
    },
    {
      title: "Lead",
      dataIndex: "lead_name",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#leads-details"
            onClick={()=>{
              console.log("[Quotation] set current lead : ", record.lead_code);
              setCurrentLead(record.lead_code);}}
          >
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.lead_name, b.lead_name),
    },
    {
      title: "Mobile",
      dataIndex: "mobile_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.mobile_number, b.mobile_number),
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.phone_number, b.phone_number),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.email, b.email),
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
    } else {
      let company_subset = {};
      allCompnayData.forEach((data) => {
        company_subset[data.company_name] = data.company_code;
      });
      setCompaniesForSelection(company_subset);
    }
    if (allLeadData.length === 0) {
      loadAllLeads();
    } else {
      const temp_data = allLeadData.map(lead => {
        return {
          label : lead.lead_name,
          value : {
            code: lead.lead_code,
            name: lead.lead_name,
            department: lead.department,
            position: lead.position,
            mobile: lead.mobile_number,
            phone: lead.phone_number,
            email: lead.email,
            company: lead.company_name,
          }
        }
      });
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
      setLeadsForSelection(temp_data);
    };
    if (allQuotationData.length === 0) {
      loadAllQuotations();
    };
    initializeQuotationTemplate();
  }, [allCompnayData, allLeadData, allQuotationData]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>Quotations - CRMS admin Template</title>
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
                    <BiCalculator />
                  </i>
                </span>{" "}
                Quotations{" "}
              </h3>
            </div>
            <div className="col p-0 text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Quotations</li>
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
                    <a className="dropdown-item">All Quotations</a>
                    <a className="dropdown-item">All Closed Quotations</a>
                    <a className="dropdown-item">All Open Quotations</a>
                    <a className="dropdown-item">My Quotations</a>
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
                      data-bs-target="#add_quotation"
                      onClick={handleAddNewQuotationClicked}
                    >
                      Add Quotation
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
                        total: allQuotationData.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={allQuotationData}
                      rowKey={(record) => record.quotation_code}
                      // onChange={handleTableChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Content End */}
        </div>
        {/* /Page Content */}

{/*---- Start : Add New Quotation Modal-------------------------------------------------------------*/}
        <div
          className="modal right fade"
          id="add_quotation"
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
                <h4 className="modal-title"><b>Add New Quotation</b></h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <form className="forms-sampme" id="add_new_quotation_form">
                  <h4>Lead Information</h4>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label>Name</label>
                    </div>
                    <div className="col-sm-8">
                      <Select options={leadsForSelection} onChange={(value) => { 
                        handleSelectLead(value.value);
                        setSelectedLead({...value.value}); }}/>
                    </div>
                  </div>
                  { (selectedLead !== null) &&
                    <>
                      <div className="form-group row">
                        <div className="col-sm-12">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>Department</td>
                                  <td>{selectedLead.department}</td>
                                </tr>
                                <tr>
                                  <td>Position</td>
                                  <td>{selectedLead.position}</td>
                                </tr>
                                <tr>
                                  <td>Mobile</td>
                                  <td>{selectedLead.mobile}</td>
                                </tr>
                                <tr>
                                  <td>Phone</td>
                                  <td>{selectedLead.phone}</td>
                                </tr>
                                <tr>
                                  <td>Email</td>
                                  <td>{selectedLead.email}</td>
                                </tr>
                              </tbody>
                            </table>
                        </div>
                      </div>
                      <h4>Company Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label>Company Name</label>
                        </div>
                        <div className="col-sm-6">
                          <label>{selectedLead.company}</label>
                        </div>
                      </div>
                    </>}
                  <h4>Quotation Information</h4>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">Type</label>
                      <Select options={QuotationSendTypes} onChange={handleSelectQuotationType} />
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">Receipt</label>
                        <div className="cal-icon">
                          <DatePicker
                            className="form-control"
                            selected={receiptDate}
                            onChange={handleReceiptDateChange}
                            dateFormat="yyyy.MM.dd hh:mm:ss"
                            showTimeSelect
                          />
                        </div>
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">Receiver</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Receiver"
                        name="receiver"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label className="col-form-label">Lead Time</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Lead Time"
                        name="lead_time"
                        onChange={handleQuotationChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="col-form-label">Request Type</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Request Type"
                        name="request_type"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label className="col-form-label">Request Content</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Request Content"
                        name="request_content"
                        defaultValue={""}
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label className="col-form-label">Action Content</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Action Content"
                        name="action_content"
                        defaultValue={""}
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label className="col-form-label">Sales Representative</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Sales Representative"
                        name="sales_representati"
                        onChange={handleQuotationChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="col-form-label">Status</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Status"
                        name="status"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  {/* <div className="submit-section mt-0">
                    <div className="custom-check mb-4">
                      <input type="checkbox" id="mark-as-done" />
                      <label htmlFor="mark-as-done">Mark as Done</label>
                    </div>
                  </div> */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      onClick={handleAddNewQuotation}
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
{/*---- End : Add New Quotation Modal-------------------------------------------------------*/}
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
        <SystemUserModel />
        <CompanyDetailsModel />
        <DealDetailsModel />
        <ProjectDetailsModel />
        <LeadsDetailsModel />
        <QuotationsDetailsModel />
      </div>
    </HelmetProvider>
  );
};

export default Quotations;

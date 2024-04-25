import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Table } from "antd";
import "antd/dist/reset.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import "../antdstyle.css";
import QuotationsDetailsModel from "./QuotationsDetailsModel";
import QuotationAddNewModal from "./QuotationAddNewModal";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import LeadsDetailsModel from "../leads/LeadsDetailsModel";
import "react-datepicker/dist/react-datepicker.css";

import { MoreVert } from '@mui/icons-material';
import { BiCalculator } from "react-icons/bi";
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { QuotationRepo } from "../../repository/quotation";
import { atomAllCompanies, atomAllQuotations, atomAllLeads, } from "../../atoms/atoms";
import { compareCompanyName, compareText } from "../../constants/functions";

const Quotations = () => {
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allQuotationData = useRecoilValue(atomAllQuotations);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);
  const { loadAllQuotations, setCurrentQuotation } = useRecoilValue(QuotationRepo);
  const [ initAddNewQuotation, setInitAddNewQuotation ] = useState(false);

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
            <MoreVert />
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
        `selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red",
    }),
  };

  const handleAddNewQuotation = useCallback(() => {
    setInitAddNewQuotation(!initAddNewQuotation);
  }, [initAddNewQuotation]);

  useEffect(() => {
    if (allCompanyData.length === 0) {
      loadAllCompanies();
    };
    if (allLeadData.length === 0) {
      loadAllLeads();
    };
    if (allQuotationData.length === 0) {
      loadAllQuotations();
    };
  }, [allCompanyData, allLeadData, allQuotationData]);

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
                      onClick={handleAddNewQuotation}
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
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Content End */}
        </div>
        {/* /Page Content */}
        <QuotationAddNewModal init={initAddNewQuotation} handleInit={setInitAddNewQuotation}/>
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
        <LeadsDetailsModel />
        <QuotationsDetailsModel />
      </div>
    </HelmetProvider>
  );
};

export default Quotations;

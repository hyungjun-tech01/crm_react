import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Table } from "antd";
import "antd/dist/reset.css";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import QuotationsDetailsModel from "./QuotationsDetailsModel";
import QuotationAddNewModal from "./QuotationAddNewModal";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import LeadsDetailsModel from "../leads/LeadsDetailsModel";
import "react-datepicker/dist/react-datepicker.css";

import { MoreVert } from '@mui/icons-material';
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { QuotationRepo } from "../../repository/quotation";
import { atomAllCompanies, atomAllQuotations, atomAllLeads, atomFilteredQuotation, } from "../../atoms/atoms";
import { compareCompanyName, compareText } from "../../constants/functions";

import { useTranslation } from "react-i18next";

const Quotations = () => {
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allQuotationData = useRecoilValue(atomAllQuotations);
  const filteredQuotation= useRecoilValue(atomFilteredQuotation);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);
  const { loadAllQuotations, setCurrentQuotation , filterQuotations} = useRecoilValue(QuotationRepo);
  const [ initAddNewQuotation, setInitAddNewQuotation ] = useState(false);

  const [searchCondition, setSearchCondition] = useState("");
  const [expanded, setExpaned] = useState(false);

  const { t } = useTranslation();

  const [statusSearch, setStatusSearch] = useState('common.all');

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    loadAllQuotations();

    setExpaned(false);
    setSearchCondition("");
  }

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    filterQuotations(statusSearch, newValue);
  };

  // --- Section for Table ------------------------------
  const columns = [
    {
      title: t('company.company_name'),
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
      title: t('quotation.quotation_type'),
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
      title: t('common.title'),
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
      title: t('quotation.quotation_date'),
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
      title: t('lead.full_name'),
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
      title: t('lead.mobile'),
      dataIndex: "mobile_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.mobile_number, b.mobile_number),
    },
    {
      title: t('common.phone_no'),
      dataIndex: "phone_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.phone_number, b.phone_number),
    },
    {
      title: t('lead.email'),
      dataIndex: "email",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.email, b.email),
    },
    {
      title: t('lead.actions'),
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
          <title>{t('quotation.quotation')}</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          <div className="page-header pt-3 mb-0 ">
            <div className="row">
              <div className="text-start" style={{width:'120px'}}>
                <div className="dropdown">
                  <button className="dropdown-toggle recently-viewed" type="button" onClick={()=>setExpaned(!expanded)}data-bs-toggle="dropdown" aria-expanded={expanded}style={{ backgroundColor: 'transparent',  border: 'none', outline: 'none' }}> {statusSearch === "" ? t('common.all'):t(statusSearch)}</button>
                    <div className={`dropdown-menu${expanded ? ' show' : ''}`}>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.all')}>{t('common.all')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.company_name')}>{t('company.company_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('quotation.quotation_type')}>{t('quotation.quotation_type')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.title')}>{t('common.title')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.full_name')}>{t('lead.full_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.mobile')}>{t('lead.mobile')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.phone_no')}>{t('common.phone_no')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.email')}>{t('lead.email')}</button>
                    </div>
                </div>
              </div>
              <div className="col text-start" style={{width:'400px'}}>
                <input
                      id = "searchCondition"
                      className="form-control" 
                      type="text"
                      placeholder= ""
                      style={{width:'300px', display: 'inline'}}
                      value={searchCondition}
                      onChange ={(e) => handleSearchCondition(e.target.value)}
                />  
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
                      {t('quotation.add_new_quotation')}
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
                  {searchCondition=== "" ? 
                    <Table
                      pagination={{
                        total: allQuotationData.length,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={allQuotationData}
                      rowKey={(record) => record.quotation_code}
                    />
                    :
                    <Table
                      pagination={{
                        total: filteredQuotation.length >0 ? filteredQuotation.length:0,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={filteredQuotation.length >0 ? filteredQuotation:null}
                      rowKey={(record) => record.quotation_code}
                    />
                  }
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

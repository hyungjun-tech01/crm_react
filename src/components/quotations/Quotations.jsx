import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import "antd/dist/reset.css";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import QuotationDetailsModel from "./QuotationDetailsModel";
import QuotationAddModel from "./QuotationAddModel";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import LeadDetailsModel from "../leads/LeadDetailsModel";

import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { QuotationRepo } from "../../repository/quotation";
import { UserRepo } from "../../repository/user";
import {
  atomCompanyState,
  atomAllQuotations,
  atomFilteredQuotation,
  atomLeadState,
  atomQuotationState,
} from "../../atoms/atoms";
import { atomUserState } from "../../atoms/atomsUser";
import { compareCompanyName, compareText, ConvertCurrency, formatDate } from "../../constants/functions";


const Quotations = () => {
  const { t } = useTranslation();


  //===== [RecoilState] Related with Company ==========================================
  const companyState = useRecoilValue(atomCompanyState);
  const { tryLoadAllCompanies } = useRecoilValue(CompanyRepo);
  const { setCurrentCompany } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Lead =============================================
  const leadState = useRecoilValue(atomLeadState);
  const { tryLoadAllLeads } = useRecoilValue(LeadRepo);


  //===== [RecoilState] Related with Quotation ========================================
  const quotationState = useRecoilValue(atomQuotationState);
  const allQuotationData = useRecoilValue(atomAllQuotations);
  const filteredQuotation = useRecoilValue(atomFilteredQuotation);
  const { tryLoadAllQuotations, setCurrentQuotation, filterQuotations } = useRecoilValue(QuotationRepo);


  //===== [RecoilState] Related with Lead =============================================
  const userState = useRecoilValue(atomUserState);
  const { tryLoadAllUsers } = useRecoilValue(UserRepo);


  //===== Handles to edit this ========================================================
  const [ nowLoading, setNowLoading ] = useState(true);
  const [initAddNewQuotation, setInitAddNewQuotation] = useState(false);

  const [searchCondition, setSearchCondition] = useState("");
  const [expanded, setExpaned] = useState(false);


  const [statusSearch, setStatusSearch] = useState('common.all');

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    tryLoadAllQuotations();

    setExpaned(false);
    setSearchCondition("");
  }

  const handleSearchCondition = (newValue) => {
    setSearchCondition(newValue);
    filterQuotations(statusSearch, newValue);
  };

  const handleClickCompany = useCallback((code) => {
    console.log("[Consulting] set current company : ", code);
    setCurrentCompany(code);
    let myModal = new bootstrap.Modal(document.getElementById('company-details'), {
      keyboard: false
    })
    myModal.show();
  }, []);

  const handleClickLead = useCallback((code) => {
    console.log("[Consulting] set current lead : ", code);
    setCurrentCompany(code);
    let myModal = new bootstrap.Modal(document.getElementById('leads-details'), {
      keyboard: false
    })
    myModal.show();
  }, []);

  const handleClickQuotation = useCallback((code) => {
    console.log("[Quotation] set current quotation : ", code);
    setCurrentQuotation(code);
    let myModal = new bootstrap.Modal(document.getElementById('quotation-details'), {
      keyboard: false
    })
    myModal.show();
  }, []);

  // --- Section for Table ------------------------------
  const columns = [
    {
      title: t('quotation.quotation_date'),
      dataIndex: "quotation_date",
      render: (text, record) => (
        <div style={{color:'#0d6efd'}}>
          {formatDate(text)}
        </div>
      ),
      sorter: (a, b) => compareText(a.quotation_date, b.quotation_date),
    },
    {
      title: t('company.company_name'),
      dataIndex: "company_name",
      render: (text, record) => (
        <div className="table_company" style={{color:'#0d6efd'}}
          onClick={() => {
            handleClickCompany(record.company_code);
          }}
        >
          {text}
        </div>
      ),
      sorter: (a, b) => compareCompanyName(a.company_name, b.company_name),
    },
    {
      title: t('lead.full_name'),
      dataIndex: "lead_name",
      render: (text, record) => (
        <div className="table_lead" style={{color:'#0d6efd'}}
          onClick={() => {
            handleClickLead(record.lead_code);
          }}
        >
          {text}
        </div>
      ),
      sorter: (a, b) => compareText(a.lead_name, b.lead_name),
    },
    {
      title: t('lead.mobile'),
      dataIndex: "mobile_number",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.title'),
      dataIndex: "quotation_title",
      render: (text, record) => (
        <div style={{color:'#0d6efd'}}>
          {text}
        </div>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      render: (text, record) => (
        <>{text}</>
      ),
    },
    {
      title: t('quotation.quotation_amount'),
      dataIndex: "total_quotation_amount",
      render: (text, record) => (
        <>{ConvertCurrency(record.total_quotation_amount)}</>
      ),
    },
    {
      title: t('quotation.quotation_manager'),
      dataIndex: "quotation_manager",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => compareText(a.quotation_manager, b.quotation_manager),
    },
  ];

  const handleAddNewQuotation = useCallback(() => {
    setInitAddNewQuotation(!initAddNewQuotation);
  }, [initAddNewQuotation]);

  useEffect(() => {
    tryLoadAllCompanies();
    tryLoadAllLeads();
    tryLoadAllQuotations();
    tryLoadAllUsers();
    
    if(((companyState & 1) === 1)
      && ((leadState & 1) === 1)
      && ((quotationState & 1) === 1)
      && ((userState & 1) === 1)
    ){
      setNowLoading(false);
    };
  }, [companyState, leadState, quotationState, userState]);

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
              <div className="text-start" style={{ width: '120px' }}>
                <div className="dropdown">
                  <button className="dropdown-toggle recently-viewed" type="button" onClick={() => setExpaned(!expanded)} data-bs-toggle="dropdown" aria-expanded={expanded} style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}> {statusSearch === "" ? t('common.all') : t(statusSearch)}</button>
                  <div className={`dropdown-menu${expanded ? ' show' : ''}`}>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('common.all')}>{t('common.all')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('company.company_name')}>{t('company.company_name')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('quotation.quotation_type')}>{t('quotation.quotation_type')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('common.title')}>{t('common.title')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('lead.full_name')}>{t('lead.full_name')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('lead.mobile')}>{t('lead.mobile')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('common.phone_no')}>{t('common.phone_no')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('lead.email')}>{t('lead.email')}</button>
                  </div>
                </div>
              </div>
              <div className="col text-start" style={{ width: '400px' }}>
                <input
                  id="searchCondition"
                  className="form-control"
                  type="text"
                  placeholder={t('common.search_here')}
                  style={{ width: '300px', display: 'inline' }}
                  value={searchCondition}
                  onChange={(e) => handleSearchCondition(e.target.value)}
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
                    {searchCondition === "" ?
                      <Table
                        pagination={{
                          total: allQuotationData.length,
                          showTotal: ShowTotal,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          ItemRender: ItemRender,
                        }}
                        loading={nowLoading}
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        bordered
                        dataSource={allQuotationData}
                        rowKey={(record) => record.quotation_code}
                        onRow={(record, rowIndex) => {
                          return {
                            onClick: (event) => {
                              if(event.target.className === 'table_company' || event.target.className === 'table_lead') return;
                              handleClickQuotation(record.quotation_code);
                            },
                          };
                        }}
                      />
                      :
                      <Table
                        pagination={{
                          total: filteredQuotation.length > 0 ? filteredQuotation.length : 0,
                          showTotal: ShowTotal,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          ItemRender: ItemRender,
                        }}
                        loading={nowLoading}
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        bordered
                        dataSource={filteredQuotation.length > 0 ? filteredQuotation : null}
                        rowKey={(record) => record.quotation_code}
                        onRow={(record, rowIndex) => {
                          return {
                            onClick: (event) => {
                              if(event.target.className === 'table_company' || event.target.className === 'table_lead') return;
                              handleClickQuotation(record.quotation_code);
                            },
                          };
                        }}
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
        <LeadDetailsModel />
        <QuotationAddModel init={initAddNewQuotation} handleInit={setInitAddNewQuotation} />
        <QuotationDetailsModel />
      </div>
    </HelmetProvider>
  );
};

export default Quotations;

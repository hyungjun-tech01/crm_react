import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import * as bootstrap from "../../assets/plugins/bootstrap/js/bootstrap";
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
import {
  atomAllQuotations,
  atomFilteredQuotation,
  atomCompanyState,
  atomLeadState,
  atomQuotationState,
} from "../../atoms/atoms";
import { compareCompanyName, compareText, ConvertCurrency } from "../../constants/functions";

import { useTranslation } from "react-i18next";

const Quotations = () => {
  const companyState = useRecoilValue(atomCompanyState);
  const leadState = useRecoilValue(atomLeadState);
  const quotationState = useRecoilValue(atomQuotationState);
  const allQuotationData = useRecoilValue(atomAllQuotations);
  const filteredQuotation = useRecoilValue(atomFilteredQuotation);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);
  const { loadAllQuotations, setCurrentQuotation, filterQuotations } = useRecoilValue(QuotationRepo);
  const [initAddNewQuotation, setInitAddNewQuotation] = useState(false);

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

  const handleSearchCondition = (newValue) => {
    setSearchCondition(newValue);
    filterQuotations(statusSearch, newValue);
  };

  // --- Section for Table ------------------------------
  const columns = [
    {
      title: t('quotation.quotation_date'),
      dataIndex: "quotation_date",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#quotation-details"
            onClick={() => {
              console.log("[Quotation] set current quotation : ", record.quotation_code);
              setCurrentQuotation(record.quotation_code);
            }}>
            {new Date(text).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.quotation_date, b.quotation_date),
    },
    {
      title: t('company.company_name'),
      dataIndex: "company_name",
      render: (text, record) => (
        <>
          <a href="#" data-bs-toggle="modal"
            data-bs-target="#company-details"
            onClick={(event) => {
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
      title: t('lead.full_name'),
      dataIndex: "lead_name",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#leads-details"
            onClick={() => {
              console.log("[Quotation] set current lead : ", record.lead_code);
              setCurrentLead(record.lead_code);
            }}
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
    },
    {
      title: t('common.title'),
      dataIndex: "quotation_title",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#quotation-details"
            onClick={() => {
              console.log("[Quotation] set current quotation : ", record.quotation_code);
              setCurrentQuotation(record.quotation_code);
            }}>
            {text}
          </a>
        </>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#quotation-details"
            onClick={() => {
              console.log("[Quotation] set current quotation : ", record.quotation_code);
              setCurrentQuotation(record.quotation_code);
            }}>
            {text}
          </a>
        </>
      ),
    },
    {
      title: t('quotation.quotation_amount'),
      dataIndex: "total_quotation_amount",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#quotation-details"
            onClick={() => {
              console.log("[Quotation] set current quotation : ", record.quotation_code);
              setCurrentQuotation(record.quotation_code);
            }}>
            {ConvertCurrency(record.total_quotation_amount)}
          </a>
        </>
      ),
    },
    {
      title: t('quotation.quotation_manager'),
      dataIndex: "quotation_manager",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#quotation-details"
            onClick={() => {
              console.log("[Quotation] set current quotation : ", record.quotation_code);
              setCurrentQuotation(record.quotation_code);
            }}>
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.quotation_manager, b.quotation_manager),
    },
  ];

  const handleAddNewQuotation = useCallback(() => {
    setInitAddNewQuotation(!initAddNewQuotation);
  }, [initAddNewQuotation]);

  useEffect(() => {
    console.log('Quotation called!');
    if ((companyState & 1) === 0) {
      loadAllCompanies();
    };
    if ((leadState & 1) === 0) {
      loadAllLeads();
    };
    if ((quotationState & 1) === 0) {
      loadAllQuotations();
    };
  }, [companyState, leadState, quotationState, loadAllCompanies, loadAllLeads, loadAllQuotations]);

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
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        bordered
                        dataSource={allQuotationData}
                        rowKey={(record) => record.quotation_code}
                        onRow={(record, rowIndex) => {
                          return {
                            onDoubleClick: (event) => {
                              console.log("[Quotation] set current quotation : ", record.quotation_code);
                              setCurrentQuotation(record.quotation_code);
                              let myModal = new bootstrap.Modal(document.getElementById('quotation-details'), {
                                keyboard: false
                              })
                              myModal.show();
                            }, // double click row
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
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        bordered
                        dataSource={filteredQuotation.length > 0 ? filteredQuotation : null}
                        rowKey={(record) => record.quotation_code}
                        onRow={(record, rowIndex) => {
                          return {
                            onDoubleClick: (event) => {
                              console.log("[Quotation] set current quotation : ", record.quotation_codecode);
                              setCurrentQuotation(record.quotation_codecode);
                              let myModal = new bootstrap.Modal(document.getElementById('quotation-details'), {
                                keyboard: false
                              })
                              myModal.show();
                            }, // double click row
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
        <QuotationAddModel init={initAddNewQuotation} handleInit={setInitAddNewQuotation} />
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
        <QuotationDetailsModel />
      </div>
    </HelmetProvider>
  );
};

export default Quotations;

import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import { Table } from "antd";
import "antd/dist/reset.css";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import ConsultingDetailsModel from "./ConsultingDetailsModel";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import LeadDetailsModel from "../leads/LeadDetailsModel";
import ConsultingAddModel from "./ConsultingAddModel";
import "react-datepicker/dist/react-datepicker.css";
import { CompanyRepo, CompanyStateRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { ConsultingRepo } from "../../repository/consulting";
import {
  atomCompanyState,
  atomAllConsultings,
  atomFilteredConsulting,
  atomLeadState,
  atomConsultingState,
  defaultLead,
} from "../../atoms/atoms";
import { compareCompanyName, compareText } from "../../constants/functions";

const Consultings = () => {
  const { t } = useTranslation();


  //===== [RecoilState] Related with Consulting =======================================
  const [consultingState, setConsultingState] = useRecoilState(atomConsultingState);
  const allConsultingData = useRecoilValue(atomAllConsultings);
  const filteredConsulting = useRecoilValue(atomFilteredConsulting);
  const { loadAllConsultings, setCurrentConsulting, filterConsultingOri } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Company ==========================================
  const companyState = useRecoilValue(atomCompanyState);
  const { tryLoadAllCompanies } = useRecoilValue(CompanyStateRepo);
  const { setCurrentCompany } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Lead =============================================
  const [leadState, setLeadState] = useRecoilState(atomLeadState);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);


  //===== Handles to deal 'Consultings' ========================================
  const [ nowLoading, setNowLoading ] = useState(true);
  const [searchCondition, setSearchCondition] = useState("");
  const [expanded, setExpaned] = useState(false);
  const [statusSearch, setStatusSearch] = useState('common.all');

  const handleSearchCondition = (newValue) => {
    setSearchCondition(newValue);
    filterConsultingOri(statusSearch, newValue);
  };

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    loadAllConsultings();
    setExpaned(false);
    setSearchCondition("");
  };

  // --- Functions used for Add New Consulting ------------------------------
  const handleAddNewConsultingClicked = useCallback(() => {
    setCurrentLead(defaultLead);
  }, [defaultLead]);

  // --- Section for Table ------------------------------
  const columns = [
    {
      title: t('consulting.receipt_date'),
      dataIndex: 'receipt_date',
      render: (text, record) => <>{text === null  ? '':text.toString()}</>,
    },
    {
      title: t('consulting.receiver'),
      dataIndex: "receiver",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('consulting.type'),
      dataIndex: "consulting_type",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#consulting-details"
            onClick={() => {
              console.log("[Consulting] set current consulting : ", record.consulting_code);
              setCurrentConsulting(record.consulting_code);
            }}>
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.consulting_type, b.consulting_type),
    },
    {
      title: t('company.company_name'),
      dataIndex: "company_name",
      render: (text, record) => (
        <>
          <a href="#" data-bs-toggle="modal"
            data-bs-target="#company-details"
            onClick={(event) => {
              console.log("[Consulting] set current company : ", record.company_code);
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
              console.log("[Consulting] set current lead : ", record.lead_code);
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
      sorter: (a, b) => compareText(a.mobile_number, b.mobile_number),
    },
    {
      title: t('common.phone_no'),
      dataIndex: "phone_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.phone_number, b.phone_number),
    },
  ];

  //===== useEffect functions ==========================================
  useEffect(() => {
    tryLoadAllCompanies();

    if ((leadState & 3) === 0) {
      setLeadState(2);
      loadAllLeads();
    };
    if ((consultingState & 3) === 0) {
      setConsultingState(2);
      loadAllConsultings();
    };
    if(((companyState & 1) === 1)
      && ((leadState & 1) === 1)
      && ((consultingState & 1) === 1)
    ){
      setNowLoading(false);
    };

  }, [companyState, leadState, consultingState]);


  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>{t('consulting.consulting')}</title>
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
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('consulting.type')}>{t('consulting.type')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('lead.full_name')}>{t('lead.full_name')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('lead.mobile')}>{t('lead.mobile')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('common.phone_no')}>{t('common.phone_no')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('consulting.request_content')}>{t('consulting.request_content')}</button>
                    <button className="dropdown-item" type="button" onClick={() => handleStatusSearch('consulting.action_content')}>{t('consulting.action_content')}</button>
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
                      data-bs-target="#add_consulting"
                      onClick={handleAddNewConsultingClicked}
                    >
                      {t('consulting.add_consulting')}
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
                          total: allConsultingData.length,
                          showTotal: ShowTotal,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          ItemRender: ItemRender,
                        }}
                        loading={nowLoading}
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        bordered
                        dataSource={allConsultingData}
                        rowKey={(record) => record.consulting_code}
                        onRow={(record, rowIndex) => {
                          return {
                            onClick: (event) => {
                              console.log("[Consulting] set current consulting : ", record.consulting_code);
                              setCurrentConsulting(record.consulting_code);
                              let myModal = new bootstrap.Modal(document.getElementById('consulting-details'), {
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
                          total: filteredConsulting.length > 0 ? filteredConsulting.length : 0,
                          showTotal: ShowTotal,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          ItemRender: ItemRender,
                        }}
                        loading={nowLoading}
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        bordered
                        dataSource={filteredConsulting.length > 0 ? filteredConsulting : null}
                        rowKey={(record) => record.consulting_code}
                        onRow={(record, rowIndex) => {
                          return {
                            onClick: (event) => {
                              console.log("[Consulting] set current consulting : ", record.consulting_code);
                              setCurrentConsulting(record.consulting_code);
                              let myModal = new bootstrap.Modal(document.getElementById('consulting-details'), {
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

        {/* modal */}
        <SystemUserModel />
        <CompanyDetailsModel />
        <LeadDetailsModel />
        <ConsultingDetailsModel />
        <ConsultingAddModel />
      </div>
    </HelmetProvider>
  );
};

export default Consultings;

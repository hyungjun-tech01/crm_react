import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
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
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { ConsultingRepo } from "../../repository/consulting";
import { UserRepo } from "../../repository/user";
import {
  atomCompanyState,
  atomFilteredConsultingArray,
  atomLeadState,
  atomConsultingState,
  atomSelectedCategory,
  defaultLead,
} from "../../atoms/atoms"; 
import { compareCompanyName, compareText } from "../../constants/functions";
import MultiQueryModal from "../../constants/MultiQueryModal";
import { consultingColumn } from "../../repository/consulting";

const Consultings = () => {
  const { t } = useTranslation();


  //===== [RecoilState] Related with Consulting =======================================
  const consultingState = useRecoilValue(atomConsultingState);
  const filteredConsulting = useRecoilValue(atomFilteredConsultingArray);
  const { tryLoadAllConsultings, loadAllConsultings, setCurrentConsulting, filterConsultingOri } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Company ==========================================
  const companyState = useRecoilValue(atomCompanyState);
  const { tryLoadAllCompanies } = useRecoilValue(CompanyRepo);
  const { setCurrentCompany } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Lead =============================================
  const leadState = useRecoilValue(atomLeadState);
  const { tryLoadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);


  //===== [RecoilState] Related with User =============================================
  const userState = useRecoilValue(atomLeadState);
  const { tryLoadAllUsers } = useRecoilValue(UserRepo);


  //===== Handles to deal 'Consultings' ========================================
  const [ nowLoading, setNowLoading ] = useState(true);
  const [ openAddConsulting, setOpenAddConsulting ] = useState(false);
  const setSelectedCategory = useSetRecoilState(atomSelectedCategory);

  const [searchCondition, setSearchCondition] = useState("");
  const [expanded, setExpaned] = useState(false);
  const [statusSearch, setStatusSearch] = useState('common.all');
  const [multiQueryModal, setMultiQueryModal] = useState(false);
  const [queryConditions, setQueryConditions] = useState([
    { column: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { column: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { column: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { column: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
  ]);

  const today = new Date();
  const oneYearAgo = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  oneYearAgo.setMonth(today.getMonth() - 12);

  // from date + to date picking 만들기 

  const initialState = {
    receipt_date: { fromDate: oneYearAgo, toDate: today, checked: false },
    modify_date: { fromDate: oneYearAgo, toDate: today, checked: true },
  }

  const [dates, setDates] = useState(initialState);

  const dateRangeSettings = [
    { label: t('consulting.receipt_date'), stateKey: 'receipt_date', checked: false },
    { label: t('common.modify_date'), stateKey: 'modify_date', checked: true },
  ];

    // from date date 1개짜리 picking 만들기 
    const initialSingleDate = {
      //ma_finish_date: { fromDate: oneMonthAgo,  checked: false },  
    };
  
    const [singleDate, setSingleDate] = useState(initialSingleDate);
  
    const singleDateSettings = [
      //{ label: t('company.ma_non_extended'), stateKey: 'ma_finish_date', checked: false },
    ];

  const handleMultiQueryModal = () => {
    setMultiQueryModal(true);
  }
  const handleMultiQueryModalOk = () => {

    //setCompanyState(0);
    setMultiQueryModal(false);

    // query condition 세팅 후 query
    console.log("handleMultiQueryModalOk", queryConditions);
    let tommorow = new Date();
    
    const checkedDates = Object.keys(dates).filter(key => dates[key].checked).map(key => ({
        label: key,
        fromDate: dates[key].fromDate,
        toDate: new Date( tommorow.setDate(dates[key].toDate.getDate()+1)),
        checked: dates[key].checked,
    }));


    const checkedSingleDates = Object.keys(singleDate).filter(key => singleDate[key].checked).map(key => ({
      label: key,
      fromDate: singleDate[key].fromDate,
      checked: singleDate[key].checked,
    }));
    
    const multiQueryCondi = {
      queryConditions:queryConditions,
      checkedDates:checkedDates,
      singleDate:checkedSingleDates
    }

    console.log('multiQueryCondi',multiQueryCondi);
    //tryLoadAllLeads(multiQueryCondi);   
    //loadAllLeads(multiQueryCondi);
    loadAllConsultings(multiQueryCondi);
     
  };
  const handleMultiQueryModalCancel = () => {
    setMultiQueryModal(false);
  };  

  const handleSearchCondition = (newValue) => {
    setSearchCondition(newValue);
    filterConsultingOri(statusSearch, newValue);
  };

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    tryLoadAllConsultings();
    setExpaned(false);
    setSearchCondition("");
  };

  // --- Functions used for Add New Consulting ------------------------------
  const handleAddNewConsultingClicked = useCallback(() => {
    setCurrentLead(defaultLead);
    setOpenAddConsulting(true);
    setTimeout(()=>{
      let myModal = new bootstrap.Modal(document.getElementById('add_consulting'), {
        keyboard: false,
        focus: true
      })
      myModal.show();
    }, 500)
  }, []);

  const handleClickConsulting = useCallback((code) => {
    setCurrentConsulting(code);
    setSelectedCategory({category: 'consulting', item_code: code});
    let myModal = new bootstrap.Modal(document.getElementById('consulting-details'), {
      keyboard: false
    })
    myModal.show();
  }, []);

  const handleClickCompany = useCallback((code) => {
    setCurrentCompany(code);
    setSelectedCategory({category: 'company', item_code: code});
    let myModal = new bootstrap.Modal(document.getElementById('company-details'), {
      keyboard: false
    })
    myModal.show();
  }, []);

  const handleClickLead = useCallback((code) => {
    setCurrentLead(code);
    setSelectedCategory({category: 'lead', item_code: code});
    let myModal = new bootstrap.Modal(document.getElementById('leads-details'), {
      keyboard: false
    })
    myModal.show();
  }, []);

  // --- Section for Table ------------------------------
  const columns = [
    {
      title: t('consulting.receipt_date'),
      dataIndex: 'receipt_date',
      render: (text, record) => 
        <>{record === null  ? '' : new Date(text).toLocaleString('ko-KR', {timeZone:'UTC'})}</>,
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
        <div style={{color:'#0d6efd'}}>
          {text}
        </div>
      ),
      sorter: (a, b) => compareText(a.consulting_type, b.consulting_type),
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
    tryLoadAllLeads();

     // query condition 세팅 후 query
     let tommorow = new Date();
     
     const checkedDates = Object.keys(dates).filter(key => dates[key].checked).map(key => ({
         label: key,
         fromDate: dates[key].fromDate,
         toDate: new Date( tommorow.setDate(dates[key].toDate.getDate()+1)),
         checked: dates[key].checked,
     }));
 

     const checkedSingleDates = Object.keys(singleDate).filter(key => singleDate[key].checked).map(key => ({
       label: key,
       fromDate: singleDate[key].fromDate,
       checked: singleDate[key].checked,
     }));
     
     const multiQueryCondi = {
       queryConditions:queryConditions,
       checkedDates:checkedDates,
       singleDate:checkedSingleDates
     }
 
    console.log('multiQueryCondi',multiQueryCondi);

    tryLoadAllConsultings(multiQueryCondi);

    tryLoadAllUsers();

    if(((companyState & 1) === 1)
      && ((leadState & 1) === 1)
      && ((consultingState & 1) === 1)
      && ((userState & 1) === 1)
    ){
      setNowLoading(false);
    };
  }, [companyState, leadState, consultingState, userState]);


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
              <div className="col text-start" style={{margin:'0px 20px 5px 20px'}}>
                  <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="multi-company-query"
                      onClick={handleMultiQueryModal}
                  >
                      {t('consulting.consulting_multi_query')}
                  </button>                
              </div>
              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
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
                            if(event.target.className === 'table_company' || event.target.className === 'table_lead') return;
                            handleClickConsulting(record.consulting_code);
                          },
                        };
                      }}
                    />
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
        <ConsultingAddModel open={openAddConsulting} handleOpen={setOpenAddConsulting} />
        <MultiQueryModal 
          title= {t('consulting.consulting_multi_query')}
          open={multiQueryModal}
          handleOk={handleMultiQueryModalOk}
          handleCancel={handleMultiQueryModalCancel}
          companyColumn={consultingColumn}
          queryConditions={queryConditions}
          setQueryConditions={setQueryConditions}
          dates={dates}
          setDates={setDates}
          dateRangeSettings={dateRangeSettings}
          initialState={initialState}
          singleDate={singleDate}
          setSingleDate={setSingleDate}
          singleDateSettings={singleDateSettings}
          initialSingleDate={initialSingleDate}
        />  
      </div>
    </HelmetProvider>
  );
};

export default Consultings;

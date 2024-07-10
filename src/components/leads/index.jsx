import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { Link } from "react-router-dom";
import * as bootstrap from "../../assets/plugins/bootstrap/js/bootstrap";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import LeadDetailsModel from "./LeadDetailsModel";
import { MoreVert } from '@mui/icons-material';
import { CompanyRepo } from "../../repository/company";
import { ConsultingRepo } from "../../repository/consulting";
import { QuotationRepo } from "../../repository/quotation";
import { PurchaseRepo } from "../../repository/purchase";
import { LeadRepo } from "../../repository/lead";
import { 
  atomAllLeads,
  atomFilteredLead,
  atomCompanyState,
  atomLeadState,
} from "../../atoms/atoms";
import { compareCompanyName, compareText } from "../../constants/functions";
import MultiQueryModal from "../../constants/MultiQueryModal";
import { leadColumn } from "../../repository/lead";
import { useTranslation } from "react-i18next";
import LeadAddModel from "./LeadAddMdel";

const Leads = () => {
  const companyState = useRecoilValue(atomCompanyState);
  const leadState = useRecoilValue(atomLeadState);
  
  const allLeadData = useRecoilValue(atomAllLeads);
  const filteredLead = useRecoilValue(atomFilteredLead);
  const { loadAllCompanies , setCurrentCompany} = useRecoilValue(CompanyRepo);
  const { loadCompanyConsultings} = useRecoilValue(ConsultingRepo);
  const { loadCompanyQuotations} = useRecoilValue(QuotationRepo);
  const { loadCompanyPurchases }  = useRecoilValue(PurchaseRepo);

  const { loadAllLeads, setCurrentLead, filterLeads } = useRecoilValue(LeadRepo);

  const [ initToAddLead, setInitToAddLead ] = useState(false);
  const { t } = useTranslation();

  const [searchCondition, setSearchCondition] = useState("");
  const [statusSearch, setStatusSearch] = useState('common.all');

  const [multiQueryModal, setMultiQueryModal] = useState(false);

  const [queryConditions, setQueryConditions] = useState([
    { column: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { column: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { column: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { column: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
  ]);

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  // from date + to date picking 만들기 

  const initialState = {
    registration_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
  }

  const [dates, setDates] = useState(initialState);

  const dateRangeSettings = [
    { label: t('purchase.registration_date'), stateKey: 'registration_date', checked: false },
  ];

    // from date date 1개짜리 picking 만들기 
    const initialSingleDate = {
      ma_finish_date: { fromDate: oneMonthAgo,  checked: false },  
    };
  
    const [singleDate, setSingleDate] = useState(initialSingleDate);
  
    const singleDateSettings = [
      { label: t('company.ma_non_extended'), stateKey: 'ma_finish_date', checked: false },
    ];

  const handleMultiQueryModal = () => {
    setMultiQueryModal(true);
  }
  const handleMultiQueryModalOk = () => {

    setCompanyState(0);
    setMultiQueryModal(false);

    // query condition 세팅 후 query
    console.log("queryConditions", queryConditions);
    
    const checkedDates = Object.keys(dates).filter(key => dates[key].checked).map(key => ({
        label: key,
        fromDate: dates[key].fromDate,
        toDate: dates[key].toDate,
        checked: dates[key].checked,
    }));


    const checkedSingleDates = Object.keys(singleDate).filter(key => singleDate[key].checked).map(key => ({
      label: key,
      fromDate: dates[key].fromDate,
      checked: dates[key].checked,
    }));
    
    const multiQueryCondi = {
      queryConditions:queryConditions,
      checkedDates:checkedDates,
      singleDate:checkedSingleDates
    }

     // loadAllCompanies(multiQueryCondi);

     
  };
  const handleMultiQueryModalCancel = () => {
    setMultiQueryModal(false);
  };


  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    filterLeads(statusSearch, newValue);
  };

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    loadAllLeads();

    setExpaned(false);
    setSearchCondition("");
  }
  // --- Functions used for Add New Lead ------------------------------
  const handleAddNewLeadClicked = useCallback(() => {
    setInitToAddLead(true);
  }, [setInitToAddLead]);


  const [ expanded, setExpaned ] = useState(false);

  const columns = [
    {
      title: t('lead.full_name'),
      dataIndex: "lead_name",
      render: (text, record) => (
        <>
          <a href="#">
            <span className="person-circle-a person-circle">
              {text ? text.charAt(0) : '?'}
            </span>
          </a>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#leads-details"
            onClick={()=>{
              console.log("[Lead] set current lead : ", record.lead_code);
              setCurrentLead(record.lead_code);
              setCurrentCompany(record.company_code);   // 현재 company 세팅 
              loadCompanyConsultings(record.company_code);  // 현재 company에 해당하는 consulting 조회 
              loadCompanyQuotations(record.company_code);  // 현재 company에 해당하는 quotation 조회 
              loadCompanyPurchases(record.company_code);  // 현재 company에 해당하는 purchase 조회 
          }}>
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.lead_name, b.lead_name),
    },
    {
      title: t('lead.position'),
      dataIndex: "position",
      sorter: (a, b) => compareText(a.position, b.position),
    },
    {
      title: t('lead.department'),
      dataIndex: "department",
      sorter: (a, b) => compareText(a.department, b.department),
    },
    {
      title: t('company.company_name'),
      dataIndex: "company_name",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareCompanyName(a.company_name, b.company_name),
    },
    {
      title: t('lead.mobile'),
      dataIndex: "mobile_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.mobile_number, b.mobile_number),
    },
    {
      title: t('lead.email'),
      dataIndex: "email",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.email, b.email),
    },
    {
      title: t('lead.lead_status'),
      dataIndex: "status",
      render: (text, record) => <label>{text}</label>,
      sorter: (a, b) => compareText(a.status, b.status),
    },
    {
      title: t('lead.lead_modified'),
      dataIndex: "modify_date",
      render: (text, record) => <>
        {new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'})}
      </>,
      sorter: (a, b) => compareText(a.modify_date, b.modify_date),
    },
    {
      title: t('lead.lead_sales'),
      dataIndex: "sales_resource",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.sales_resource, b.sales_resource),
    },
    // {
    //   title: "",
    //   dataIndex: "star",
    //   render: (text, record) => (
    //     <i className="fa fa-star" aria-hidden="true" />
    //   ),
    //   sorter: (a, b) => a.status.length - b.status.length,
    // },

    {
      title: t('lead.actions'),
      dataIndex: "status_",
      render: (text, record) => (
        <div className="dropdown dropdown-action">
          <a
            href="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <MoreVert />
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item" href="#">
              Edit This Lead
            </a>
            <a className="dropdown-item" href="#">
              Change Lead Image
            </a>
            <a className="dropdown-item" href="#">
              Delete This Lead
            </a>
            <a className="dropdown-item" href="#">
              Email This Lead
            </a>
            <a className="dropdown-item" href="#">
              Clone This Lead
            </a>
            <a className="dropdown-item" href="#">
              Change Record Owner
            </a>
            <a className="dropdown-item" href="#">
              Generate Merge Document
            </a>
            <a className="dropdown-item" href="#">
              Change Lead to Contact
            </a>
            <a className="dropdown-item" href="#">
              Convert Lead
            </a>
            <a className="dropdown-item" href="#">
              Print This Lead
            </a>
            <a className="dropdown-item" href="#">
              Merge Into Lead
            </a>
            <a className="dropdown-item" href="#">
              SmartMerge Lead
            </a>
            <a className="dropdown-item" href="#">
              Add Activity Set To Lead
            </a>
            <a className="dropdown-item" href="#">
              Add New Event For Lead
            </a>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    console.log('lead called!');
    if((companyState & 1) === 0) {
      loadAllCompanies();
    };
    if((leadState & 1) === 0) {
      loadAllLeads();
    };
  }, [allLeadData, companyState, leadState, loadAllCompanies, loadAllLeads]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>{t('lead.lead')}</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header pt-3 mb-0 ">
            <div className="row ">
              <div className="text-start" style={{width:'120px'}}>
                <div className="dropdown">
                  <button className="dropdown-toggle recently-viewed" type="button" onClick={()=>setExpaned(!expanded)}data-bs-toggle="dropdown" aria-expanded={expanded}style={{ backgroundColor: 'transparent',  border: 'none', outline: 'none' }}> {statusSearch === "" ? t('common.all'):t(statusSearch)}</button>
                    <div className={`dropdown-menu${expanded ? ' show' : ''}`}>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.all')}>{t('common.all')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.lead_name')}>{t('lead.lead_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.position')}>{t('lead.position')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.department')}>{t('lead.department')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.company_name')}>{t('company.company_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.mobile')}>{t('lead.mobile')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.email')}>{t('lead.email')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.lead_status')}>{t('lead.lead_status')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.lead_sales')}>{t('lead.lead_sales')}</button>
                    </div>
                </div>
              </div>
              <div className="col text-start" style={{width:'400px'}}>
                <input
                      id = "searchCondition"
                      className="form-control" 
                      type="text"
                      placeholder= {t('common.search_here')}
                      style={{width:'300px', display: 'inline'}}
                      value={searchCondition}
                      onChange ={(e) => handleSearchCondition(e.target.value)}
                />  
              </div>
              <div className="col text-start" style={{margin:'0px 20px 5px 20px'}}>
                  <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="multi-company-query"
                      onClick={handleMultiQueryModal}
                  >
                      {t('company.company_multi_query')}
                  </button>                
              </div>

              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  <li className="dropdown list-inline-item add-lists">
                    <a
                      className="dropdown-toggle recently-viewed pr-2"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nav-profile-text">
                        <i className="fa fa-cog" aria-hidden="true" />
                      </div>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="#">
                        Choose Columns
                      </a>
                      <a className="dropdown-item" href="#">
                        Group Columns
                      </a>
                      <a className="dropdown-item" href="#">
                        Sharing Settings
                      </a>
                      <a className="dropdown-item" href="#">
                        Rename
                      </a>
                      <a className="dropdown-item" href="#">
                        Clone
                      </a>
                      <a className="dropdown-item" href="#">
                        Delete
                      </a>
                    </div>
                  </li>
                  <li className="nav-item dropdown list-inline-item add-lists">
                    <Link
                      className="nav-link dropdown-toggle"
                      id="profileDropdown"
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nav-profile-text">
                        <i className="fa fa-th" aria-hidden="true"></i>
                      </div>
                    </Link>
                    <div
                      className="dropdown-menu navbar-dropdown"
                      aria-labelledby="profileDropdown"
                    >
                      <Link className="dropdown-item" to="/projects">
                        List View
                      </Link>
                      <Link className="dropdown-item" to="/leads-kanban-view">
                        Kanban View
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add-new-list"
                      >
                        Add New List View
                      </Link>
                    </div>
                  </li>
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
                      data-bs-toggle="modal"
                      data-bs-target="#add_lead"
                      onClick={handleAddNewLeadClicked}
                    >
                      {t('lead.add_lead')}
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
                    {searchCondition === "" ? 
                    <Table
                      className="table table-striped table-nowrap custom-table mb-0 datatable dataTable no-footer"
                      pagination={{
                        total: allLeadData.length,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={allLeadData}
                      rowKey={(record) => record.lead_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                              console.log("[Lead] set current lead : ", record.lead_code);
                              setCurrentLead(record.lead_code);
                              setCurrentCompany(record.company_code);   // 현재 company 세팅 
                              loadCompanyConsultings(record.company_code);  // 현재 company에 해당하는 consulting 조회 
                              loadCompanyQuotations(record.company_code);  // 현재 company에 해당하는 quotation 조회 
                              loadCompanyPurchases(record.company_code);  // 현재 company에 해당하는 purchase 조회 
                              let myModal = new bootstrap.Modal(document.getElementById('leads-details'), {
                                keyboard: false
                              });
                              myModal.show();
                          }, // double click row
                        };
                      }}
                    /> 
                    :
                    <Table
                      className="table table-striped table-nowrap custom-table mb-0 datatable dataTable no-footer"
                      pagination={{
                        total: filteredLead.length >0 ? filteredLead.length:0,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={filteredLead.length >0 ?  filteredLead:null}
                      rowKey={(record) => record.lead_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                              console.log("[Lead] set current lead : ", record.lead_code);
                              setCurrentLead(record.lead_code);
                              setCurrentCompany(record.company_code);   // 현재 company 세팅 
                              loadCompanyConsultings(record.company_code);  // 현재 company에 해당하는 consulting 조회 
                              loadCompanyQuotations(record.company_code);  // 현재 company에 해당하는 quotation 조회 
                              loadCompanyPurchases(record.company_code);  // 현재 company에 해당하는 purchase 조회 
                              let myModal = new bootstrap.Modal(document.getElementById('leads-details'), {
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
            </div>
          </div>
        </div>
        <LeadAddModel init={initToAddLead} handleInit={setInitToAddLead} />
        <LeadDetailsModel />
        <MultiQueryModal 
          title= {t('lead.lead_multi_query')}
          open={multiQueryModal}
          handleOk={handleMultiQueryModalOk}
          handleCancel={handleMultiQueryModalCancel}
          companyColumn={leadColumn}
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
export default Leads;

import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useCookies } from "react-cookie";
import * as bootstrap from "../../assets/plugins/bootstrap/js/bootstrap";
import { MoreVert } from '@mui/icons-material';
import { Table } from "antd";
import "antd/dist/reset.css";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import ConsultingsDetailsModel from "./ConsultingsDetailsModel";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import LeadsDetailsModel from "../leads/LeadsDetailsModel";
import ConsultingAddModal from "../consulting/ConsultingAddModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { ConsultingRepo, ConsultingTypes } from "../../repository/consulting";
import { atomAllCompanies, atomAllConsultings, atomAllLeads, defaultConsulting, atomFilteredConsulting } from "../../atoms/atoms";
import { compareCompanyName, compareText, formatDate } from "../../constants/functions";


import { useTranslation } from "react-i18next";

const Consultings = () => {
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allConsultingData = useRecoilValue(atomAllConsultings);
  const filteredConsulting = useRecoilValue(atomFilteredConsulting);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);
  const { loadAllConsultings, modifyConsulting, setCurrentConsulting, filterConsultingOri } = useRecoilValue(ConsultingRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName"]);

  const [ companiesForSelection, setCompaniesForSelection ] = useState([]);
  const [ leadsForSelection, setLeadsForSelection] = useState([]);
  const [ consultingChange, setConsultingChange ] = useState(null);
  const [ selectedLead, setSelectedLead ] = useState(null);
  const [ receiptDate, setReceiptDate ] = useState(new Date());
  const [searchCondition, setSearchCondition] = useState("");

  const [expanded, setExpaned] = useState(false);

  const { t } = useTranslation();

  const [statusSearch, setStatusSearch] = useState('common.all');

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    filterConsultingOri(statusSearch, newValue);
  };

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    loadAllConsultings();
    setExpaned(false);
    setSearchCondition("");
  }

  const handleReceiptDateChange = (date) => {
    setReceiptDate(date);
    const localDate = formatDate(date);
    const localTime = date.toLocaleTimeString('ko-KR');
    const tempChanges = {
      ...consultingChange,
      receipt_date: localDate,
      receipt_time: localTime,
    };
    setConsultingChange(tempChanges);
  };

  // --- Functions used for Add New Consulting ------------------------------
  const handleAddNewConsultingClicked = useCallback(() => {
    initializeConsultingTemplate();
  }, []);

  const initializeConsultingTemplate = useCallback(() => {
    setConsultingChange({ ...defaultConsulting });
    setSelectedLead(null);
    document.querySelector("#add_new_consulting_form").reset();
  }, []);

  const handleConsultingChange = useCallback((e) => {
    const modifiedData = {
      ...consultingChange,
      [e.target.name]: e.target.value,
    };
    setConsultingChange(modifiedData);
  }, [consultingChange]);

  const handleSelectLead = useCallback((value) => {
    const tempChanges = {
      ...consultingChange,
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
    setConsultingChange(tempChanges);
  }, [companiesForSelection, consultingChange]);

  const handleSelectConsultingType = useCallback((value) => {
    const tempChanges = {
      ...consultingChange,
      consulting_type: value.value,
    };
    setConsultingChange(tempChanges);
  }, [consultingChange]);

  const handleAddNewConsulting = useCallback((event)=>{
    // Check data if they are available
    if(consultingChange.lead_name === null
      || consultingChange.lead_name === ''
      || consultingChange.consulting_type === null
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };

    const newConsultingData = {
      ...consultingChange,
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserName,
    };
    console.log(`[ handleAddNewConsulting ]`, newConsultingData);
    const result = modifyConsulting(newConsultingData);
    if(result){
      initializeConsultingTemplate();
      //close modal ?
    };
  }, [cookies.myLationCrmUserName, initializeConsultingTemplate, consultingChange, modifyConsulting]);

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
      title: t('consulting.type'),
      dataIndex: "consulting_type",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#consulting-details"
            onClick={()=>{
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
      title: t('lead.full_name'),
      dataIndex: "lead_name",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#leads-details"
            onClick={()=>{
              console.log("[Consulting] set current lead : ", record.lead_code);
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

  useEffect(() => {
    if (allCompnayData.length === 0) {
      loadAllCompanies();
    } else {
      let company_subset = {};
      allCompnayData.forEach((data) => {
        company_subset[data.company_name] = data.company_code;
      });
      setCompaniesForSelection(company_subset);
    };

    if (allLeadData.length === 0) {
      loadAllLeads();
    };
    
    if(!leadsForSelection || (leadsForSelection.length !== allLeadData.length)){
      const temp_data = allLeadData.map(lead => {
        return {
          label: lead.lead_name + " / " + lead.company_name,
          value: {
            code: lead.lead_code,
            name: lead.lead_name,
            department: lead.department,
            position: lead.position,
            mobile: lead.mobile_number,
            phone: lead.phone_number,
            email: lead.email,
            company: lead.company_name
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

    if (allConsultingData.length === 0) {
      loadAllConsultings();
    };
    
    initializeConsultingTemplate();
  }, [allCompnayData, allLeadData, allConsultingData]);

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
              <div className="text-start" style={{width:'120px'}}>
                <div className="dropdown">
                  <button className="dropdown-toggle recently-viewed" type="button" onClick={()=>setExpaned(!expanded)}data-bs-toggle="dropdown" aria-expanded={expanded}style={{ backgroundColor: 'transparent',  border: 'none', outline: 'none' }}> {statusSearch === "" ? t('common.all'):t(statusSearch)}</button>
                    <div className={`dropdown-menu${expanded ? ' show' : ''}`}>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.all')}>{t('common.all')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.company_name')}>{t('company.company_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('consulting.type')}>{t('consulting.type')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.full_name')}>{t('lead.full_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('lead.mobile')}>{t('lead.mobile')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.phone_no')}>{t('common.phone_no')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('consulting.request_content')}>{t('consulting.request_content')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('consulting.action_content')}>{t('consulting.action_content')}</button>
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
                    {searchCondition=== "" ? 
                    <Table
                      pagination={{
                        total: allConsultingData.length,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={allConsultingData}
                      rowKey={(record) => record.consulting_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onDoubleClick: (event) => {
                            console.log("[Consulting] set current lead : ", record.lead_code);
                            setCurrentLead(record.lead_code);
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
                      total: filteredConsulting.length >0 ? filteredConsulting.length:0,
                      showTotal: ShowTotal,
                      showSizeChanger: true,
                      onShowSizeChange: onShowSizeChange,
                      ItemRender: ItemRender,
                    }}
                    style={{ overflowX: "auto" }}
                    columns={columns}
                    bordered
                    dataSource={filteredConsulting.length >0 ? filteredConsulting:null}
                    rowKey={(record) => record.consulting_code}
                    onRow={(record, rowIndex) => {
                      return {
                        onDoubleClick: (event) => {
                          console.log("[Consulting] set current lead : ", record.lead_code);
                          setCurrentLead(record.lead_code);
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
        <LeadsDetailsModel />
        <ConsultingsDetailsModel />
        <ConsultingAddModal currentLead='' previousModalId=''/>
      </div>
    </HelmetProvider>
  );
};

export default Consultings;

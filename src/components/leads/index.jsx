import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import LeadsDetailsModel from "./LeadsDetailsModel";
import { MoreVert } from '@mui/icons-material';
import { BiUser } from "react-icons/bi";
import { CompanyRepo } from "../../repository/company";
import {ConsultingRepo} from "../../repository/consulting"
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { atomAllCompanies, atomAllLeads, atomFilteredLead, defaultLead } from "../../atoms/atoms";
import { compareCompanyName, compareText } from "../../constants/functions";
import { useTranslation } from "react-i18next";

const Leads = () => {
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const filteredLead = useRecoilValue(atomFilteredLead);
  const { loadAllCompanies , setCurrentCompany} = useRecoilValue(CompanyRepo);
  const { loadCompanyConsultings} = useRecoilValue(ConsultingRepo);
  const { loadAllLeads, modifyLead, setCurrentLead, filterLeads } = useRecoilValue(LeadRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName",  "myLationCrmUserId",]);

  const [ leadChange, setLeadChange ] = useState(null);
  const [ companyData, setCompanyData ] = useState([]);

  const [searchCondition, setSearchCondition] = useState("");

  const { t } = useTranslation();

  const [statusSearch, setStatusSearch] = useState('common.all');

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
    initializeLeadTemplate();
  }, []);

  const initializeLeadTemplate = useCallback(() => {
    setLeadChange({ ...defaultLead });
    document.querySelector("#add_new_lead_form").reset();
  }, []);

  const handleLeadChange = useCallback((e) => {
    const modifiedData = {
      ...leadChange,
      [e.target.name]: e.target.value,
    };
    setLeadChange(modifiedData);
  }, [leadChange]);

  const handleAddNewLead = useCallback((event)=>{
    // Check data if they are available
    if(leadChange.lead_name === null
      || leadChange.lead_name === ''
      || leadChange.company_code === null)
    {
      console.log("Company Name must be available!");
      return;
    };

    const newLeadData = {
      ...leadChange,
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewLead ]`, newLeadData);
    const result = modifyLead(newLeadData);
    if(result){
      initializeLeadTemplate();
      //close modal ?
    };
  },[cookies.myLationCrmUserName, initializeLeadTemplate, leadChange, modifyLead]);

  // --- Funtions for Select ---------------------------------
  const handleSelectCompany = useCallback((value)=>{
    const selected = value.value;
    const tempLeadChange = {
      ...leadChange,
      company_code: selected.company_code,
      company_name: selected.company_name,
      company_name_en: selected.company_name_en,
      company_zip_code: (leadChange.company_zip_code !== null ? leadChange.company_zip_code : selected.company_zip_code),
      company_address: (leadChange.company_address !== null ? leadChange.company_address : selected.company_address),
    };
    setLeadChange(tempLeadChange);
  }, [leadChange]);

  const handleSelectKeyMan = useCallback((value) => {
    const selected = value.value;
    const tempLeadChange = {
      ...leadChange,
      is_keyman : selected
    };
    setLeadChange(tempLeadChange);
  },[leadChange]);

  const [expanded, setExpaned] = useState(false);

  const columns = [
    {
      title: t('lead.full_name'),
      dataIndex: "lead_name",
      render: (text, record) => (
        <>
          <a href="#">
            <span className="person-circle-a person-circle">
              {text.charAt(0)}
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
      sorter: (a, b) => compareText(a.status, b.status.length),
    },
    {
      title: t('lead.lead_modified'),
      dataIndex: "modify_date",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.modify_date - b.modify_date,
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
      const companySubSet = allCompnayData.map((data) => ({
        value: {
          company_code: data.company_code,
          company_name: data.company_name,
          company_name_en: data.company_name_en,
          company_zip_code: data.company_zip_code,
          company_address: data.company_address,
        },
        label: data.company_name,
      }));
      setCompanyData(companySubSet);
    };
    if (allLeadData.length === 0) {
      loadAllLeads();
    };
    initializeLeadTemplate();
  }, [allCompnayData, allLeadData]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>{t('lead.lead')}</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          <div className="crms-title row bg-white">
            <div className="col">
              <h3 className="page-title m-0">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  {/* <i className="feather-user" /> */}
                  <i>
                    <BiUser />
                  </i>
                </span>{" "}
                {t('lead.lead')}{" "}
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">{t('lead.lead')}</li>
              </ul>
            </div>
          </div>
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
                      className="form-control form-control-sm" 
                      type="text"
                      placeholder= ""
                      style={{width:'300px', display: 'inline'}}
                      value={searchCondition}
                      onChange ={(e) => handleSearchCondition(e.target.value)}
                />  
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
                      rowSelection={rowSelection}
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
                    /> 
                    :
                    <Table
                      rowSelection={rowSelection}
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
        {/* Modal */}
        <div
          className="modal right fade"
          id="add_lead"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" role="document">
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
                <h4 className="modal-title text-center">
                  <b>{t('lead.add_lead')}</b>
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <form id="add_new_lead_form">
                      <h4>{t('lead.lead_information')}</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('common.name')} <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Name"
                            name="lead_name"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('lead.is_keyman')}</label>
                          <Select options={KeyManForSelection} onChange={handleSelectKeyMan} />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('lead.lead_status')}</label>
                          <select className="form-control form-control-sm">
                            <option>Select</option>
                            <option>Open - Contacted</option>
                            <option>Open - Not Contacted</option>
                          </select>
                        </div>
                      </div>
                      {/* <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Lead Rating</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="rating"
                            placeholder="Rating"
                          />
                        </div>
                      </div> */}
                      <h4>{t('lead.company_information')}</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('company.company_name')}</label>
                          <Select options={companyData} onChange={handleSelectCompany} />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('lead.position')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('lead.position')}
                            name="position"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('lead.department')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('lead.department')}
                            name="department"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('company.group')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('company.group')}
                            name="group_"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('common.region')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('common.region')}
                            name="region"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      <h4>{t('common.contact_details')}</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('lead.mobile')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('lead.mobile')}
                            name="mobile_number"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('lead.email')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('lead.email')}
                            name="email"
                            onChange={handleLeadChange}
                          />
                        </div>
                        {/* <div className="col-sm-6">
                          <label className="col-form-label">
                            Email Opted out
                          </label>
                          <div>
                            <label className="container-checkbox">
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </div>
                        </div> */}
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('company.phone_number')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('company.phone_number')}
                            name="company_phone_number"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('company.fax_number')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('company.fax_number')}
                            name="company_fax_number"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">{t('company.homepage')}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={t('company.homepage')}
                            name="homepage"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      {/* <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Sales Resource</label>
                          <select className="form-control">
                            <option>Web</option>
                            <option>Phone Enquiry</option>
                            <option>Partner Referral</option>
                            <option>Purchased List</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div> */}
                      {/* <h4>Address Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">
                            Mailing Address
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            name="address"
                            placeholder="Address"
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="City"
                            name="city"
                          />
                        </div>
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="State/Provience"
                            name="state"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Postal Code"
                            name="postal"
                          />
                        </div>
                        <div className="col-sm-6">
                          <select className="form-control">
                            <option>India</option>
                            <option>US</option>
                            <option>Japan</option>
                          </select>
                        </div>
                      </div> */}
                      <h4>{t('common.additional_information')}</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">
                            {t('company.salesman')}{" "}
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Sales Resource"
                            name="sales_resource"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">
                            {t('company.engineer')}
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Application Engineer"
                            name="application_engineer"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">{t('common.status')}</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder={t('common.status')}
                            defaultValue={""}
                            name="status"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      {/* <h4>Tag Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">Tag List</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="tag-name"
                            placeholder="Tag List"
                          />
                        </div>
                      </div>
                      <h4>Permissions</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Permission</label>
                          <select className="form-control">
                            <option>Task Visibility</option>
                            <option>Private Task</option>
                          </select>
                        </div>
                      </div> */}
                      <div className="text-center py-3">
                        <button
                          type="button"
                          className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          onClick={handleAddNewLead}
                        >
                          {t('common.save')}
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className="btn btn-secondary btn-rounded"
                          data-bs-dismiss="modal"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* modal-content */}
          </div>
          {/* modal-dialog */}
        </div>
        {/* modal */}
        <LeadsDetailsModel />
      </div>
    </HelmetProvider>
  );
};
export default Leads;

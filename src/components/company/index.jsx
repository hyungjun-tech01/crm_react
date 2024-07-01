import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import * as bootstrap from "../../assets/plugins/bootstrap/js/bootstrap";

import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import { CompanyRepo } from "../../repository/company";
import { atomAllCompanies, atomFilteredCompany, atomCompanyState } from "../../atoms/atoms";
import { compareCompanyName, compareText } from "../../constants/functions";

import CompanyAddModel from "./CompanyAddMdel";
import CompanyDetailsModel from "./CompanyDetailsModel";
import MultiQueryModal from "../../constants/MultiQueryModal";
import { formatDate } from "../../constants/functions";

// import { MoreVert } from '@mui/icons-material';


const Company = () => {
  //const companyState = useRecoilValue(atomCompanyState);
  const [companyState, setCompanyState] = useRecoilState(atomCompanyState);
  const { loadAllCompanies, filterCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const filteredCompany = useRecoilValue(atomFilteredCompany);
  const [searchCondition, setSearchCondition] = useState("");
  const [statusSearch, setStatusSearch] = useState('common.all');
  const [multiQueryModal, setMultiQueryModal] = useState(false);
  const { t } = useTranslation();
  const [ initToAddCompany, setInitToAddCompany ] = useState(false);
  const [multiQueryString, setMultiQueryString] = useState("");

  const [queryConditions, setQueryConditions] = useState([
    { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
  ]);

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  // from date + to date picking 만들기 

  const initialState = {
    registration_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
    delivery_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
    hq_finish_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
    ma_finish_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
  };

  const [dates, setDates] = useState(initialState);

  const dateRangeSettings = [
    { label: t('purchase.registration_date'), stateKey: 'registration_date', checked: false },
    { label: t('purchase.delivery_date'), stateKey: 'delivery_date', checked: false },
    { label: t('purchase.hq_finish_date'), stateKey: 'hq_finish_date', checked: false },
    { label: t('purchase.ma_finish_date'), stateKey: 'ma_finish_date', checked: false },
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

    console.log("checkedDates", checkedDates);

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

      loadAllCompanies(multiQueryCondi);

     
  };
  const handleMultiQueryModalCancel = () => {
    setMultiQueryModal(false);
  };


  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    console.log('handle search', newValue);
    filterCompanies(statusSearch, newValue);
  };

  // --- Functions used for Table ------------------------------
  const handleClickCompanyName = useCallback((id)=>{
    console.log('[Company] set current company : ', id);
    setCurrentCompany(id);
  },[setCurrentCompany]);

  const columns = [
    {
      title: t('company.company_name'),
      dataIndex: "company_name",
      render: (text, record) => (
        <>
          <a href="#" className="person-circle-a person-circle">
            {text.charAt(0)}
          </a>
          <a href="#" data-bs-toggle="modal" data-bs-target="#company-details" onClick={()=>{handleClickCompanyName(record.company_code);}}>
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareCompanyName(a.company_name, b.company_name),
    },
    {
      title: t('common.phone_no'),
      dataIndex: "company_phone_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.company_phone_number, b.company_phone_number),
    },
    {
      title: t('company.address'),
      dataIndex: "company_address",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.company_address , b.company_address),
    },
    {
      title: t('company.salesman'),
      dataIndex: "sales_resource",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.sales_resource, b.sales_resource),
    },
    {
      title: t('company.engineer'),
      dataIndex: "application_engineer",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.application_engineer, b.application_engineer),
    },
  ];

  const handleAddNewCompanyClicked = useCallback(() => {
    setInitToAddCompany(true);
  }, [setInitToAddCompany]);

  useEffect(() => {   
    console.log('Company called!');
    if((companyState & 1) === 0) {

      const multiQueryCondi = {
        queryConditions:null,
        checkedDates:null,
        singleDate:null
      }
      loadAllCompanies(multiQueryCondi);
    };
  }, []);
  //}, [companyState, loadAllCompanies]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>{t('company.company')}</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header pt-3 mb-0 ">
            <div className="row">
              {/*
               <div className="text-start" style={{width:'120px'}}>
                  <div className="dropdown">
                    <button className="dropdown-toggle recently-viewed" type="button" onClick={()=>setExpaned(!expanded)}data-bs-toggle="dropdown" aria-expanded={expanded}style={{ backgroundColor: 'transparent',  border: 'none', outline: 'none' }}> {statusSearch === "" ? t('common.all'):t(statusSearch)}</button>
                      <div className={`dropdown-menu${expanded ? ' show' : ''}`}>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.all')}>{t('common.all')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.company_name')}>{t('company.company_name')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.phone_no')}>{t('common.phone_no')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.address')}>{t('company.address')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.salesman')}>{t('company.salesman')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.engineer')}>{t('company.engineer')}</button>
                      </div>
                  </div>
                </div> 
                */}
              
              <div className="col text-start" style={{width:'300px'}}>
                <input
                      id = "searchCondition"
                      className="form-control" 
                      type="text"
                      placeholder={t('common.search_here')}
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
                  <li className="nav-item dropdown list-inline-item add-lists">
                    <a
                      className="nav-link dropdown-toggle"
                      id="profileDropdown"
                      href="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nav-profile-text">
                        <i className="fa fa-th" aria-hidden="true" />
                      </div>
                    </a>
                    <div
                      className="dropdown-menu navbar-dropdown"
                      aria-labelledby="profileDropdown"
                    >
                      <a
                        className="dropdown-item"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add-new-list"
                      >
                        Add New List View
                      </a>
                    </div>
                  </li>
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
                      data-bs-toggle="modal"
                      data-bs-target="#add_company"
                      onClick={handleAddNewCompanyClicked}
                    >
                      {t('company.new_company')}
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
                    { searchCondition === "" ? 
                    <Table
                      pagination={{
                        total:  allCompanyData.length,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      className="table"
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={allCompanyData}
                      rowKey={(record) => record.company_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onDoubleClick: (event) => {
                              handleClickCompanyName(record.company_code);
                              let myModal = new bootstrap.Modal(document.getElementById('company-details'), {
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
                        total:  filteredCompany.length > 0 ? filteredCompany.length:0,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      className="table"
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={filteredCompany.length > 0 ? filteredCompany:null}
                      rowKey={(record) => record.company_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onDoubleClick: (event) => {
                              handleClickCompanyName(record.company_code)
                              let myModal = new bootstrap.Modal(document.getElementById('company-details'), {
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
              {/* Modal body */}
              <div className="modal-body">
                <form className="forms-sample">
                  <div className="form-group row">
                    <label
                      htmlFor="view-name"
                      className="col-sm-4 col-form-label"
                    >
                      New View Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="view-name"
                        placeholder="New View Name"
                      />
                    </div>
                  </div>
                  <div className="form-group row pt-4">
                    <label className="col-sm-4 col-form-label">
                      Sharing Settings
                    </label>
                    <div className="col-sm-8">
                      <div className="form-group">
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="optionsRadios"
                              id="optionsRadios1"
                              defaultValue
                            />{" "}
                            Just For Me <i className="input-helper" />
                          </label>
                        </div>
                        <br />
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="optionsRadios"
                              id="optionsRadios2"
                              defaultValue="option2"
                              defaultChecked
                            />{" "}
                            Share Filter with Everyone{" "}
                            <i className="input-helper" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-gradient-primary me-2"
                    >
                      Submit
                    </button>
                    <button className="btn btn-light">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
        <CompanyAddModel init={initToAddCompany} handleInit={setInitToAddCompany} />
        <CompanyDetailsModel />
        <MultiQueryModal 
          title= {t('company.company_multi_query')}
          open={multiQueryModal}
          handleOk={handleMultiQueryModalOk}
          handleCancel={handleMultiQueryModalCancel}
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
export default Company;

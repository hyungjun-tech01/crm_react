import React, { useCallback, useEffect, useState } from "react";
import ReactDom from 'react-dom';
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
// import { MoreVert } from '@mui/icons-material';
import { CompanyRepo } from "../../repository/company";
import { atomAllCompanies, atomFilteredCompany, defaultCompany } from "../../atoms/atoms";
import { compareCompanyName, compareText, formatDate } from "../../constants/functions";
import CompanyDetailsModel from "./CompanyDetailsModel";
import LeadsDetailsModel from "../leads/LeadsDetailsModel";
import ConsultingsDetailsModel from "../consulting/ConsultingsDetailsModel";
import QuotationsDetailsModel from "../quotations/QuotationsDetailsModel";
import TransactionsDetailsModel from "../transactions/TransactionsDetailsModel";
import PurchaseDetailsModel from "../purchase/PurchaseDetailsModel";
import AddBasicItem from "../../constants/AddBasicItem";
import PopupPostCode from "../../constants/PostCode";
import { FiSearch } from "react-icons/fi";

const PopupDom = ({ children }) => {
  const el = document.getElementById('popupDom');
  return ReactDom.createPortal(children, el);
};

const Company = () => {
  const { loadAllCompanies, filterCompanies, modifyCompany, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const filteredCompany = useRecoilValue(atomFilteredCompany);
  const [ companyChange, setCompanyChange ] = useState(null);
  const [ cookies ] = useCookies(["myLationCrmUserName",  "myLationCrmUserId"]);
  const [ establishDate, setEstablishDate ] = useState(null);
  const [searchCondition, setSearchCondition] = useState("");
  const [expanded, setExpaned] = useState(false);
  const [ isPopupOpen, setIsPopupOpen ] = useState(false);

  const { t } = useTranslation();

  const [statusSearch, setStatusSearch] = useState('common.all');

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    loadAllCompanies();

    setExpaned(false);
    setSearchCondition("");
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

  // --- Functions used for Add New Company ------------------------------
  const initializeCompanyTemplate = useCallback(() => {
    setCompanyChange({...defaultCompany});
    setEstablishDate(null);
    document.querySelector("#add_new_company_form").reset();
  }, []);

  const handleAddNewCompanyClicked = useCallback(() => {
    initializeCompanyTemplate();
  // eslint-disable-next-line no-use-before-define
  }, [initializeCompanyTemplate]);

  const handleEstablishDateChange = useCallback((date) => {
    setEstablishDate(date);
    companyChange.establishment_date = date;
  },[companyChange]);

  const handleCompanyChange = useCallback((e)=>{
    let input_data = null;
    if(e.target.name === 'establishment_date' || e.target.name === 'closure_date'){
      const date_value = new Date(e.target.value);
      if(!isNaN(date_value.valueOf())){
        input_data = formatDate(date_value);
      };
    } else {
      input_data = e.target.value;
    }
    const modifiedData = {
      ...companyChange,
      [e.target.name]: input_data,
    };
    setCompanyChange(modifiedData);
  }, [companyChange]);

  const handleAddNewCompany = useCallback((event)=>{
    // Check data if they are available
    if(companyChange.company_name === null
      || companyChange.company_name === '')
    {
      console.log("Company Name must be available!");
      return;
    };

    const newComData = {
      ...companyChange,
      action_type: 'ADD',
      company_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewCompany ]`, newComData);
    const result = modifyCompany(newComData);
    if(result){
      initializeCompanyTemplate();
      //close modal ?
    };
  },[companyChange, cookies.myLationCrmUserId, initializeCompanyTemplate, modifyCompany]);

  const option_deal_type = [
    {
      value: 'mixed', label: t('company.deal_type_mixed')
    },
    {
      value: 'sales', label: t('company.deal_type_sales')
    },
    {
      value: 'purchase', label: t('company.deal_type_purchase')
    },
    {
      value: 'etc', label: t('company.deal_type_etc')
    },
  ];

  const option_industry_type = [
    {
      value: 'aerospace', label: t('company.ind_type_aerospace')
    },
    {
      value: 'defence', label: t('company.ind_type_defence')
    },
    {
      value: 'education', label: t('company.ind_type_education')
    },
  ];

  const openPostCode = () => {
    setIsPopupOpen(true)
  };

  const closePostCode = () => {
      setIsPopupOpen(false)
  };

  const handleSetAddress = useCallback((address) => {
    console.log('handleSetAddress :', address);
    const modifiedData = {
      ...companyChange,
      company_address: address,
    };
    setCompanyChange(modifiedData);
  }, [companyChange]);

  const handleSetZipCode = useCallback((zip_code) => {
    const modifiedData = {
      ...companyChange,
      company_zip_code: zip_code,
    };
    setCompanyChange(modifiedData);
  }, [companyChange]);

  useEffect(() => {    
    if (allCompanyData.length === 0) {
      loadAllCompanies();
    };
    initializeCompanyTemplate();
  }, [allCompanyData, initializeCompanyTemplate, loadAllCompanies]);

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
              
              <div className="col text-start" style={{width:'400px'}}>
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
        <div
          className="modal right fade"
          id="add_company"
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
                <h4 className="modal-title text-center"><b>{t('company.new_company')}</b></h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <form id="add_new_company_form">
                      <div className="form-group row">
                        <AddBasicItem
                          type='text'
                          name="company_name"
                          required
                          title={t('company.company_name')}
                          onChange={handleCompanyChange}
                        />
                        <AddBasicItem
                          type='text'
                          name="company_name_eng"
                          title={t('company.eng_company_name')}
                          onChange={handleCompanyChange}
                          />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='text'
                          name="ceo_name"
                          title={t('company.ceo_name')}
                          onChange={handleCompanyChange}
                        />
                        <AddBasicItem
                          type='text'
                          name="business_registration_code"
                          title={t('company.business_registration_code')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6" >
                          <div className="add-basic-item">
                            <div className="add-basic-title" >
                                {t('company.address')}
                            </div>
                            <input
                              className="add-basic-content"
                              type="text"
                              placeholder={t('company.address')}
                            />
                            <div className="add-basic-btn" onClick={openPostCode}>
                              <FiSearch />
                            </div>
                            <div id="popupDom">
                              {isPopupOpen && (
                                <PopupDom>
                                    <PopupPostCode
                                      onSetAddress={handleSetAddress}
                                      onSetPostCode={handleSetZipCode}
                                      onClose={closePostCode}
                                    />
                                </PopupDom>
                              )}
                            </div>
                          </div>
                        </div>
                        <AddBasicItem
                          type='text'
                          name="company_phone_number"
                          title={t('company.phone_number')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6" >
                          <div className="add-basic-item">
                            <div className="add-basic-title" >
                                {t('company.zip_code')}
                            </div>
                            <label
                              className="add-basic-content label"
                            >
                              {companyChange && companyChange['company_zip_code']
                                ? companyChange.company_zip_code
                                : t('comment.search_address_first')}
                            </label>
                          </div>
                        </div>
                        <AddBasicItem
                          type='text'
                          name="company_fax_number"
                          title={t('company.fax_number')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='text'
                          name="homepage"
                          title={t('company.homepage')}
                          onChange={handleCompanyChange}
                        />
                        <AddBasicItem
                          type='text'
                          name="company_scale"
                          title={t('company.company_scale')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='select'
                          name='deal_type'
                          options={option_deal_type}
                          title={t('company.deal_type')}
                          onChange={handleCompanyChange}
                        />
                        <AddBasicItem
                          type='select'
                          name='industry_type'
                          options={option_industry_type}
                          title={t('company.industry_type')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='text'
                          name="business_type"
                          title={t('company.business_type')}
                          onChange={handleCompanyChange}
                        />
                        <AddBasicItem
                          type='text'
                          name="business_item"
                          title={t('company.business_item')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='text'
                          name="establishment_date"
                          title={t('company.establishment_date')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='text'
                          name="account_code"
                          title={t('company.account_code')}
                          onChange={handleCompanyChange}
                        />
                        <AddBasicItem
                          type='text'
                          name="bank_name"
                          title={t('company.bank_name')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='text'
                          name="account_owner"
                          title={t('company.account_owner')}
                          onChange={handleCompanyChange}
                        />
                        <AddBasicItem
                          type='text'
                          name="sales_resource"
                          title={t('company.salesman')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='text'
                          name="application_engineer"
                          title={t('company.engineer')}
                          onChange={handleCompanyChange}
                        />
                        <AddBasicItem
                          type='text'
                          name="region"
                          title={t('common.location')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="form-group row">
                        <AddBasicItem
                          type='textarea'
                          long
                          row_no={3}
                          name="memo"
                          title={t('common.memo')}
                          onChange={handleCompanyChange}
                        />
                      </div>
                      <div className="text-center py-3">
                        <button
                          type="button"
                          className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          onClick={handleAddNewCompany}
                        >
                          {t('common.save')}
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className="btn btn-secondary btn-rounded"
                          data-bs-dismiss="modal"
                          onClick={initializeCompanyTemplate}
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
        <CompanyDetailsModel />
        <LeadsDetailsModel />
        <ConsultingsDetailsModel />
        <QuotationsDetailsModel />
        <TransactionsDetailsModel />
        <PurchaseDetailsModel />
      </div>
    </HelmetProvider>
  );
};
export default Company;

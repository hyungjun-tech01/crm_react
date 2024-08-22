import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import { Table } from "antd";
import "antd/dist/reset.css";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";

import {
  atomTaxInvoiceArray,
  atomCompanyState,
  atomFilteredTaxInvoiceArray,
  atomTaxInvoiceState,
} from "../../atoms/atoms";
import { atomUserState } from "../../atoms/atomsUser";

import { CompanyRepo } from "../../repository/company";
import { TaxInvoiceRepo, taxInvoiceColumn } from "../../repository/tax_invoice";
import { UserRepo } from "../../repository/user";

import { compareCompanyName , compareText, ConvertCurrency } from "../../constants/functions";
import TaxInvoiceEditModel from "../taxinvoice/TaxInvoiceEditModel";
import SystemUserModel from "../task/SystemUserModel";
import MultiQueryModal from "../../constants/MultiQueryModal";


const TaxInovices = () => {
  const { t } = useTranslation();


  //===== [RecoilState] Related with Company ==========================================
  const companyState = useRecoilValue(atomCompanyState);
  const { tryLoadAllCompanies } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Tax Invoice ======================================
  const taxInvoiceState = useRecoilValue(atomTaxInvoiceState);
  const filteredTaxInvoices= useRecoilValue(atomFilteredTaxInvoiceArray);
  const { tryLoadTaxInvoices, setCurrentTaxInvoice , filterTaxInvoices, loadAllTaxInvoices} = useRecoilValue(TaxInvoiceRepo);


  //===== [RecoilState] Related with User =============================================
  const userState = useRecoilValue(atomUserState);
  const { tryLoadAllUsers } = useRecoilValue(UserRepo);


  //===== Handles to edit this ========================================================
  const [ nowLoading, setNowLoading ] = useState(true);
  const [ openTaxInvoice, setOpenTaxInvoice ] = useState(false);
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
    modify_date: { fromDate: oneYearAgo, toDate: today, checked: true },
  }

  const [dates, setDates] = useState(initialState);

  const dateRangeSettings = [
    { label: t('common.modify_date'), stateKey: 'modify_date', checked: true },
  ];

    // from date date 1개짜리 picking 만들기 
  const initialSingleDate = {
    // ma_finish_date: { fromDate: oneMonthAgo,  checked: false },  
  };
  
  const [singleDate, setSingleDate] = useState(initialSingleDate);
  
  const singleDateSettings = [
     // { label: t('company.ma_non_extended'), stateKey: 'ma_finish_date', checked: false },
    ];

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

    const handleMultiQueryModalOk = () => {

      //setCompanyState(0);
      setMultiQueryModal(false);
  
      // query condition 세팅 후 query
      console.log("handleMultiQueryModalOk", queryConditions);

      
      const multiQueryCondi = {
        queryConditions:queryConditions,
        checkedDates:checkedDates,
        singleDate:checkedSingleDates
      }
  
      console.log('multiQueryCondi',multiQueryCondi);
  
      loadAllTaxInvoices(multiQueryCondi);
       
    };
    const handleMultiQueryModalCancel = () => {
      setMultiQueryModal(false);
    };  
  

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    tryLoadTaxInvoices();

    setExpaned(false);
    setSearchCondition("");
  };

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    filterTaxInvoices(statusSearch, newValue);
  };

  const handleMultiQueryModal = () => {
    setMultiQueryModal(true);
  }  


  // --- Section for Table ------------------------------
  const columns = [
    {
      title: t('transaction.type'),
      dataIndex: "transaction_type",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.transaction_type, b.transaction_type),
    },
    {
      title: t('transaction.publish_date'),
      dataIndex: "create_date",
      render: (text, record) => 
        <>
          {new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'})}
        </>,
      sorter: (a, b) => a.create_date - b.create_date,
    },
    {
      title: t('company.company_name'),
      dataIndex: "company_name",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareCompanyName(a.company_name, b.company_name),
    },
    {
      title: t('company.business_registration_code'),
      dataIndex: "business_registration_code",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: "supply_price",
      render: (text, record) => <>{ConvertCurrency(text)}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: "tax_price",
      render: (text, record) => <>{ConvertCurrency(text)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: "total_price",
      render: (text, record) => <>{ConvertCurrency(text)}</>,
    },
    {
      title: t('transaction.publish_type'),
      dataIndex: "publish_type",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.publish_type, b.publish_type),
    },
    {
      title: t('common.issued_by'),
      dataIndex: "recent_user",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.publish_type, b.publish_type),
    },
  ];

  const handleAddNewTaxInvoice = useCallback(() => {
    setCurrentTaxInvoice();
    setOpenTaxInvoice(true);

    setTimeout(()=>{
      let myModal = new bootstrap.Modal(document.getElementById('edit_tax_invoice'), {
        keyboard: false
      })
      myModal.show();
    }, 1000);
  }, [setCurrentTaxInvoice]);

  const handleOpenTaxInvoice = (code) => {
    setCurrentTaxInvoice(code);
    setOpenTaxInvoice(true);

    setTimeout(()=>{
      let myModal = new bootstrap.Modal(document.getElementById('edit_tax_invoice'), {
        keyboard: false
      })
      myModal.show();
    }, 1000);
  }

  useEffect(() => {
    tryLoadAllCompanies();

    const multiQueryCondi = {
      queryConditions:queryConditions,
      checkedDates:checkedDates,
      singleDate:checkedSingleDates
    }

    console.log('multiQueryCondi',multiQueryCondi);   
    tryLoadTaxInvoices(multiQueryCondi);

    tryLoadAllUsers();

    if(((companyState & 1) === 1)
      && ((taxInvoiceState & 1) === 1)
      && ((userState & 1) === 1)
    ){
      setNowLoading(false);
    };
  }, [ companyState, taxInvoiceState, userState ]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>{t('taxinvoice.taxinvoice_manage')}</title>
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
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.ceo_name')}>{t('company.ceo_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.address')}>{t('company.address')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('taxinvoice.memo')}>{t('taxinvoice.memo')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('taxinvoice.summary')}>{t('taxinvoice.summary')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('taxinvoice.invoice_contents')}>{t('taxinvoice.invoice_contents')}</button>
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
                      {t('taxinvoice.taxinvoice_multi_query')}
                  </button>                
              </div>
              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
                      // data-bs-toggle="modal"
                      // data-bs-target="#edit_transaction"
                      onClick={handleAddNewTaxInvoice}
                    >
                      {t('taxinvoice.add_taxinvoice')}
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
                        total: filteredTaxInvoices.length,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      loading={nowLoading}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={filteredTaxInvoices}
                      rowKey={(record) => record.tax_invoice_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            if(event.target.className === 'table_company') return;
                            handleOpenTaxInvoice(record.tax_invoice_code)
                          }, // double click row
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
        {/* modal */}
        <SystemUserModel />
        <TaxInvoiceEditModel
          open={openTaxInvoice}
          close={()=>setOpenTaxInvoice(false)}
        />
        <MultiQueryModal 
          title= {t('quotation.quotation_multi_query')}
          open={multiQueryModal}
          handleOk={handleMultiQueryModalOk}
          handleCancel={handleMultiQueryModalCancel}
          companyColumn={taxInvoiceColumn}
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

export default TaxInovices;

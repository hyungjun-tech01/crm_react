import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import {
  atomFilteredPurchaseArray,
  atomPurchaseState,
  atomSelectedCategory,
} from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { PurchaseRepo } from "../../repository/purchase";
import { compareText, formatDate } from "../../constants/functions";

import PurchaseAddModel from "./PurchaseAddModel";
import PurchaseDetailsModel from "./PurchaseDetailsModel";
import { atomUserState } from "../../atoms/atomsUser";
import { UserRepo } from "../../repository/user";
import { SettingsRepo } from "../../repository/settings";

import MultiQueryModal from "../../constants/MultiQueryModal";
import { purchaseColumn } from "../../repository/purchase";


const Purchase = () => {
  const { t } = useTranslation();


  //===== [RecoilState] Related with Company =============================================
  const { setCurrentCompany, searchCompanies } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Purchase ============================================
  const purchaseState = useRecoilValue(atomPurchaseState);
  const filteredPurchase = useRecoilValue(atomFilteredPurchaseArray);
  const { tryLoadAllPurchases, filterPurchases, setCurrentPurchase, loadAllPurchases } = useRecoilValue(PurchaseRepo);
  

  //===== [RecoilState] Related with User ================================================
  const userState = useRecoilValue(atomUserState);
  const { tryLoadAllUsers } = useRecoilValue(UserRepo);


    //===== [RecoilState] Related with Settings ===========================================
    const { openModal } = useRecoilValue(SettingsRepo);


  //===== Handles to deal 'Purcahse' ====================================================
  const [ nowLoading, setNowLoading ] = useState(true);
  const [ initAddNewPurchase, setInitAddNewPurchase ] = useState(false);
  const [ tableData, setTableData ] = useState([]);
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
    //  console.log("handleMultiQueryModalOk", queryConditions);
      
      const multiQueryCondi = {
        queryConditions:queryConditions,
        checkedDates:checkedDates,
        singleDate:checkedSingleDates
      }
  
      // console.log('multiQueryCondi',multiQueryCondi);
  
      loadAllPurchases(multiQueryCondi);
       
    };
    const handleMultiQueryModalCancel = () => {
      setMultiQueryModal(false);
    };    

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    tryLoadAllPurchases();

    setExpaned(false);
    setSearchCondition("");
  }

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    filterPurchases(statusSearch, newValue);
  };

  const handleMultiQueryModal = () => {
    setMultiQueryModal(true);
  }    

  // --- Functions used for Table ------------------------------
  const handleClickPurchase = useCallback((code)=>{
    setCurrentPurchase(code);
    setSelectedCategory({category: 'purchase', item_code: code});
    openModal('purchase-details');
  },[setCurrentPurchase, setSelectedCategory]);

  const handleAddNewPurchaseClicked = useCallback(() => {
    setInitAddNewPurchase(true);
    setTimeout(() => {
      openModal('add_purchase');
    }, 500);
  }, []);

  const columns = [
    {
      title: t('purchase.delivery_date'),
      dataIndex: "delivery_date",
      render: (text, record) => <>{formatDate(record.delivery_date)}</>,
      sorter: (a, b) => compareText(a.purchase_type, b.purchase_type),
    },
    {
      title: t('company.company_name'),
      dataIndex: "company_name",
      render: (text, record) =><>{text}</>,
      sorter: (a, b) => compareText(a.company_name, b.company_name),
    },
    {
      title: t('company.company_name_en'),
      dataIndex: "company_name_en",
      render: (text, record) =><>{text}</>,
      sorter: (a, b) => compareText(a.company_name_en, b.company_name_en),
    },
    {
      title: t('purchase.product_name'),
      dataIndex: "product_name",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.product_name, b.product_name),
    },
    {
      title: t('common.quantity'),
      dataIndex: "quantity",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: t('purchase.serial_number'),
      dataIndex: "serial_number",
      render: (text, record) =>
        <div style={{color:'#0d6efd'}}>
            {text}
        </div>,
      sorter: (a, b) => compareText(a.serial_number, b.serial_number),
    },
    {
      title: t('purchase.ma_contract_date'),
      dataIndex: "ma_contact_date",
      render: (text, record) => <>{formatDate(record.ma_contact_date)}</>,
      sorter: (a, b) => a.ma_contact_date - b.ma_contact_date,
    },
    {
      title: t('purchase.ma_finish_date'),
      dataIndex: "ma_finish_date",
      render: (text, record) => <>{formatDate(record.ma_finish_date)}</>,
      sorter: (a, b) => a.ma_finish_date - b.ma_finish_date,
    },
    {
      title: t('purchase.ma_remain_date'),
      dataIndex: "ma_remain_date",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.ma_remain_date - b.ma_remain_date,
    },
  ];

  //===== useEffect functions ==========================================
  useEffect(() => {
     // query condition 세팅 후 query
    
    const multiQueryCondi = {
      queryConditions:queryConditions,
      checkedDates:checkedDates,
      singleDate:checkedSingleDates
    }

  //  console.log('tryLoadAllQuotations multiQueryCondi',multiQueryCondi);   
    tryLoadAllPurchases(multiQueryCondi);
    tryLoadAllUsers();

    if(((purchaseState & 1) === 1)
      && ((userState & 1) === 1)
    ){
      setNowLoading(false);
      const modifiedData = filteredPurchase.map(purchase => {
        let remain_date = '';
            if(purchase.ma_finish_date) {
              const calc_remain_date = Math.ceil((new Date(purchase.ma_finish_date).getTime() - new Date().getTime())/86400000);
              if(calc_remain_date >= 0){
                remain_date = calc_remain_date;
              };
            };
            return {
              ...purchase,
              //company_name: res.data[0].company_name,
              //company_name_en: res.data[0].company_name_en,
              ma_remain_date: remain_date,
            }
      });
        // const foundIdx = allCompanyData.findIndex(company => company.company_code === purchase.company_code);
        // const found = searchCompanies('company_code', purchase.company_code, true);
        //found.then(res => {
        //  if(res.result) {
            // let remain_date = '';
            // if(purchase.ma_finish_date) {
            //   const calc_remain_date = Math.ceil((new Date(purchase.ma_finish_date).getTime() - new Date().getTime())/86400000);
            //   if(calc_remain_date >= 0){
            //     remain_date = calc_remain_date;
            //   };
            // };
            // return {
            //   ...purchase,
            //   //company_name: res.data[0].company_name,
            //   //company_name_en: res.data[0].company_name_en,
            //   ma_remain_date: remain_date,
            // }
        //  } else {
        //    return null;
        //  };
      //  });
      // });
      setTableData(modifiedData);

      // 모달 내부 페이지의 히스토리 상태 추가
      history.pushState({ modalInternal: true }, '', location.href);

      const handlePopState = (event) => {
          if (event.state && event.state.modalInternal) {
          // 뒤로 가기를 방지하기 위해 다시 히스토리를 푸시
          history.pushState({ modalInternal: true }, '', location.href);
          }
      };

      // popstate 이벤트 리스너 추가 (중복 추가 방지)
      window.addEventListener('popstate', handlePopState);      

    };
  }, [dates, filteredPurchase, purchaseState, queryConditions, searchCompanies, singleDate, userState]);


  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>{t('purchase.purchase_manage')}</title>
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
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('purchase.product_class_name')}>{t('purchase.product_class_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('purchase.product_name')}>{t('purchase.product_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('purchase.licence_info')}>{t('purchase.licence_info')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.memo')}>{t('common.memo')}</button>
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
                      {t('purchase.purchase_multi_query')}
                  </button>                
              </div>              
              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  {/* <li className="nav-item dropdown list-inline-item add-lists">
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
                  </li> */}
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
                      onClick={handleAddNewPurchaseClicked}
                    >
                      {t('purchase.add_purchase')}
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
                    <Table
                      pagination={{
                        total: filteredPurchase.length >0 ? filteredPurchase.length:0,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      loading={nowLoading}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={filteredPurchase.length >0 ? filteredPurchase : null}
                      rowKey={(record) => record.purchase_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            if(event.target.className === 'table_company') return;
                            handleClickPurchase(record.purchase_code);
                          },
                        };
                      }}
                    /> 
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
                        className="form-control form-control-sm"
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
        <PurchaseAddModel init={initAddNewPurchase} handleInit={setInitAddNewPurchase} />
        <PurchaseDetailsModel />
        <MultiQueryModal 
          title= {t('purchase.purchase_multi_query')}
          open={multiQueryModal}
          handleOk={handleMultiQueryModalOk}
          handleCancel={handleMultiQueryModalCancel}
          companyColumn={purchaseColumn}
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
export default Purchase;

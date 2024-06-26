import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import * as bootstrap from "../../assets/plugins/bootstrap/js/bootstrap";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import { atomAllPurchases,
  atomFilteredPurchase,
  atomCompanyState,
  atomPurchaseState,
  atomAllCompanies,
} from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { PurchaseRepo } from "../../repository/purchase";
import { ConvertCurrency, compareText, formatDate } from "../../constants/functions";

import PurchaseAddModel from "./PurchaseAddModel";
import PurchaseDetailsModel from "./PurchaseDetailsModel";


const Purchase = () => {
  const { t } = useTranslation();


  //===== [RecoilState] Related with Company =============================================
  const companyState = useRecoilValue(atomCompanyState);
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Purchase ============================================
  const purchaseState = useRecoilValue(atomPurchaseState);
  const allPurchaseData = useRecoilValue(atomAllPurchases);
  const filteredPurchase = useRecoilValue(atomFilteredPurchase);
  const { loadAllPurchases, filterPurchases } = useRecoilValue(PurchaseRepo);


  //===== Handles to deal 'Purcahse' ====================================================
  const [ initAddNewPurchase, setInitAddNewPurchase ] = useState(false);
  const [ tableData, setTableData ] = useState([]);
  const [ selectedPurchase, setSelectedPurchase ] = useState(null);
  
  const [searchCondition, setSearchCondition] = useState("");
  const [expanded, setExpaned] = useState(false);
  const [statusSearch, setStatusSearch] = useState('common.all');

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    loadAllPurchases();

    setExpaned(false);
    setSearchCondition("");
  }

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    filterPurchases(statusSearch, newValue);
  };

  // --- Functions used for Table ------------------------------
  const handleClickPurchase = useCallback((data)=>{
    setSelectedPurchase(data);
  },[setSelectedPurchase]);

  const handleAddNewPurchaseClicked = useCallback(() => {
    setInitAddNewPurchase(true);
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
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.company_name, b.company_name),
    },
    {
      title: t('company.company_name_eng'),
      dataIndex: "company_name_eng",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.company_name_eng, b.company_name_eng),
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
        <>
          <a href="#" data-bs-toggle="modal" data-bs-target="#purchase-details" onClick={()=>{handleClickPurchase(record);}}>
            {text}
          </a>
        </>,
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
    console.log('Purchase called!');
    if((companyState & 1) === 0) {
      loadAllCompanies();
    };
    if((purchaseState & 1) === 0) {
      loadAllPurchases();
    };
    if(((companyState & 1) === 1) && ((purchaseState & 1) === 1)) {
      const modifiedData = allPurchaseData.map(purchase => {
        const foundIdx = allCompanyData.findIndex(company => company.company_code === purchase.company_code);
        if(foundIdx !== -1){
          let remain_date = '';
          if(purchase.ma_finish_date) {
            const calc_remain_date = Math.ceil((new Date(purchase.ma_finish_date).getTime() - new Date().getTime())/86400000);
            if(calc_remain_date >= 0){
              remain_date = calc_remain_date;
            };
          };
          return {
            ...purchase,
            company_name: allCompanyData[foundIdx].company_name,
            company_name_eng: allCompanyData[foundIdx].company_name_eng,
            ma_remain_date: remain_date,
          }
        } else {
          return null;
        };
      });
      setTableData(modifiedData);
    };
  }, [companyState, purchaseState, loadAllCompanies, loadAllPurchases, allPurchaseData, allCompanyData]);


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
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('purchase.product_type')}>{t('purchase.product_type')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('purchase.product_name')}>{t('purchase.product_name')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('company.company_name')}>{t('company.company_name')}</button>
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
                      data-bs-target="#add_purchase"
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
                  {searchCondition === "" ? 
                    <Table
                      pagination={{
                        total: tableData.length,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      className="table"
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={tableData}
                      rowKey={(record) => record.purchase_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onDoubleClick: (event) => {
                            handleClickPurchase(record)
                            let myModal = new bootstrap.Modal(document.getElementById('purchase-details'), {
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
                        total: filteredPurchase.length >0 ? filteredPurchase.length:0,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={filteredPurchase.length >0 ? filteredPurchase : null}
                      rowKey={(record) => record.lead_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onDoubleClick: (event) => {
                            handleClickPurchase(record);
                            let myModal = new bootstrap.Modal(document.getElementById('purchase-details'), {
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
        <PurchaseDetailsModel selected={selectedPurchase} handleSelected={setSelectedPurchase} />
      </div>
    </HelmetProvider>
  );
};
export default Purchase;

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import { Table } from "antd";
import "antd/dist/reset.css";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";

import { CompanyRepo } from "../../repository/company";
import { TransactionRepo } from "../../repository/transaction";
import {
  atomAllTransactions,
  atomFilteredTransaction,
  atomCompanyState,
  atomTransactionState,
  defaultTransaction,
} from "../../atoms/atoms";
import { atomUserState } from "../../atoms/atomsUser";
import { UserRepo } from "../../repository/user";
import { compareCompanyName , compareText, ConvertCurrency } from "../../constants/functions";
import TransactionEditModel from "./TransactionEditModel";
import TransactionEditBillModel from "./TransactionEditBillModel";


const Transactions = () => {
  const { t } = useTranslation();


  //===== [RecoilState] Related with Company ==========================================
  const companyState = useRecoilValue(atomCompanyState);
  const { tryLoadAllCompanies } = useRecoilValue(CompanyRepo);
  const { setCurrentCompany } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Transaction ======================================
  const transactionState = useRecoilValue(atomTransactionState);
  const allTransactionData = useRecoilValue(atomAllTransactions);
  const filteredTransaction= useRecoilValue(atomFilteredTransaction);
  const { tryLoadAllTransactions, setCurrentTransaction , filterTransactions} = useRecoilValue(TransactionRepo);


  //===== [RecoilState] Related with User =============================================
  const userState = useRecoilValue(atomUserState);
  const { tryLoadAllUsers } = useRecoilValue(UserRepo);

  //===== Handles to edit this ========================================================
  const [ nowLoading, setNowLoading ] = useState(true);
  const [ openTransaction, setOpenTransaction ] = useState(false);
  const [ openBill, setOpenBill ] = useState(false);
  const [ billData, setBillData ] = useState(null);
  const [ billContents, setBillContents ] = useState(null);

  const [searchCondition, setSearchCondition] = useState("");
  const [expanded, setExpaned] = useState(false);

  const [statusSearch, setStatusSearch] = useState('common.all');

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    tryLoadAllTransactions();

    setExpaned(false);
    setSearchCondition("");
  };

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    filterTransactions(statusSearch, newValue);
  };

  const handleClickCompany = useCallback((code) => {
    console.log("[Consulting] set current company : ", code);
    setCurrentCompany(code);
    let myModal = new bootstrap.Modal(document.getElementById('company-details'), {
      keyboard: false
    })
    myModal.show();
  }, []);
  
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
      dataIndex: "publish_date",
      render: (text, record) => 
        <>
          {new Date(text).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day: 'numeric'})}
        </>,
      sorter: (a, b) => a.publish_date - b.publish_date,
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
      title: t('company.business_registration_code'),
      dataIndex: "business_registration_code",
      render: (text, record) => (
        <div className="table_company" style={{color:'#0d6efd'}}
          onClick={() => {
            handleClickCompany(record.company_code);
          }}
        >
          {text}
        </div>
      ),
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

  const handleAddNewTransaction = useCallback(() => {
    setCurrentTransaction(defaultTransaction);
  }, [setCurrentTransaction]);

  const handleOpenTransactoin = (code) => {
    setCurrentTransaction(code)
    setOpenTransaction(true);

    setTimeout(()=>{
      let myModal = new bootstrap.Modal(document.getElementById('edit_transaction'), {
        keyboard: false
      })
      myModal.show();
    }, 1000);
  }

  useEffect(() => {
    tryLoadAllCompanies();
    tryLoadAllTransactions();
    tryLoadAllUsers();

    if(((companyState & 1) === 1)
      && ((transactionState & 1) === 1)
      && ((userState & 1) === 1)
    ){
      setNowLoading(false);
    };
  }, [ companyState, transactionState, userState ]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>{t('transaction.transaction')}</title>
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
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('transaction.title')}>{t('transaction.title')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('transaction.type')}>{t('transaction.type')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('transaction.publish_type')}>{t('transaction.publish_type')}</button>
                      <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('transaction.payment_type')}>{t('transaction.payment_type')}</button>
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
                      data-bs-target="#edit_transaction"
                      onClick={handleAddNewTransaction}
                    >
                      {t('transaction.add_transaction')}
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
                    { searchCondition === "" ?  
                      <Table
                        pagination={{
                          total: allTransactionData.length,
                          showTotal: ShowTotal,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          ItemRender: ItemRender,
                        }}
                        loading={nowLoading}
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        bordered
                        dataSource={allTransactionData}
                        rowKey={(record) => record.transaction_code}
                        onRow={(record, rowIndex) => {
                          return {
                            onClick: (event) => {
                              if(event.target.className === 'table_company') return;
                              handleOpenTransactoin(record.transaction_code)
                            }, // double click row
                          };
                        }}
                      />:
                      <Table
                      pagination={{
                        total: filteredTransaction.length >0 ? filteredTransaction.length:0,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      loading={nowLoading}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={filteredTransaction.length >0 ? filteredTransaction:null}
                      rowKey={(record) => record.transaction_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            if(event.target.className === 'table_company') return;
                            handleOpenTransactoin(record.transaction_code)
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
        {/* modal */}
        <SystemUserModel />
        <CompanyDetailsModel />
        <TransactionEditModel
          open={openTransaction}
          close={()=>setOpenTransaction(false)}
          openBill={()=>setOpenBill(true)}
          setBillData={setBillData}
          setBillContents={setBillContents}
        />
        <TransactionEditBillModel
          open={openBill}
          close={()=>setOpenBill(false)}
          data={billData}
          contents={billContents}
        />
      </div>
    </HelmetProvider>
  );
};

export default Transactions;

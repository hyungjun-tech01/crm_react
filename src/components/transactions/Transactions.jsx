import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import * as bootstrap from "../../assets/plugins/bootstrap/js/bootstrap";
import { Table } from "antd";
import "antd/dist/reset.css";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import TransactionDetailsModel from "./TransactionDetailsModel";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";

import { MoreVert } from '@mui/icons-material';
import { CompanyRepo } from "../../repository/company";
import { TransactionRepo } from "../../repository/transaction";
import { atomAllCompanies,
  atomAllTransactions,
  atomFilteredTransaction,
  atomCompanyState,
  atomTransationState,
} from "../../atoms/atoms";
import { compareCompanyName , compareText, ConvertCurrency } from "../../constants/functions";
import TransactionAddModel from "./TransactionAddModel";
import TransactionAddModel2 from "./TransactionAddModel2";
import { useTranslation } from "react-i18next";

const Transactions = () => {
  const companyState = useRecoilValue(atomCompanyState);
  const transactionState = useRecoilValue(atomTransationState);
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const allTransactionData = useRecoilValue(atomAllTransactions);
  const filteredTransaction= useRecoilValue(atomFilteredTransaction);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllTransactions, setCurrentTransaction , filterTransactions} = useRecoilValue(TransactionRepo);
  const [ initAddNewTransaction, setInitAddNewTransaction ] = useState(false);

  const { t } = useTranslation();

  const [searchCondition, setSearchCondition] = useState("");
  const [expanded, setExpaned] = useState(false);

  const [statusSearch, setStatusSearch] = useState('common.all');

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    loadAllTransactions();

    setExpaned(false);
    setSearchCondition("");
  }

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    filterTransactions(statusSearch, newValue);
  };
  
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
        <>
          <a href="#" data-bs-toggle="modal"
            data-bs-target="#company-details"
            onClick={()=>setCurrentCompany(record.company_code)}
          >
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareCompanyName(a.company_name, b.company_name),
    },
    {
      title: t('company.business_registration_code'),
      dataIndex: "business_registration_code",
      render: (text, record) => (
        <>
          <a href="#" data-bs-toggle="modal"
            data-bs-target="#company-details"
            onClick={()=>setCurrentCompany(record.company_code)}
          >
            {text}
          </a>
        </>
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
    setInitAddNewTransaction(!initAddNewTransaction);
  }, [initAddNewTransaction]);

  useEffect(() => {
    console.log('Transaction called!');
    if((companyState & 1) === 0) {
      loadAllCompanies();
    };
    if((transactionState & 1) === 0) {
      loadAllTransactions();
    };
  }, [allCompanyData, allTransactionData, companyState, transactionState]);

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
                      data-bs-target="#add_new_transaction2"
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
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        bordered
                        dataSource={allTransactionData}
                        rowKey={(record) => record.transaction_code}
                        onRow={(record, rowIndex) => {
                          return {
                            onDoubleClick: (event) => {
                              setCurrentTransaction(record.transaction_code)
                              let myModal = new bootstrap.Modal(document.getElementById('transaction-details'), {
                                keyboard: false
                              })
                              myModal.show();
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
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={filteredTransaction.length >0 ? filteredTransaction:null}
                      rowKey={(record) => record.transaction_code}
                      onRow={(record, rowIndex) => {
                        return {
                          onDoubleClick: (event) => {
                            setCurrentTransaction(record.transaction_code)
                            let myModal = new bootstrap.Modal(document.getElementById('transaction-details'), {
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
        {/* modal */}
        <SystemUserModel />
        <CompanyDetailsModel />
        <TransactionDetailsModel />
        <TransactionAddModel init={initAddNewTransaction} handleInit={setInitAddNewTransaction}/>
        <TransactionAddModel2 init={initAddNewTransaction} handleInit={setInitAddNewTransaction}/>
      </div>
    </HelmetProvider>
  );
};

export default Transactions;

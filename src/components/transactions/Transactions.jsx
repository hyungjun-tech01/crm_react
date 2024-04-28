import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Table } from "antd";
import "antd/dist/reset.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import "../antdstyle.css";
import TransactionsDetailsModel from "./TransactionsDetailsModel";
import SystemUserModel from "../task/SystemUserModel";
import CompanyDetailsModel from "../company/CompanyDetailsModel";
import "react-datepicker/dist/react-datepicker.css";

import { BiReceipt } from "react-icons/bi";
import { MoreVert } from '@mui/icons-material';
import { CompanyRepo } from "../../repository/company";
import { TransactionRepo } from "../../repository/transaction";
import { atomAllCompanies, atomAllTransactions } from "../../atoms/atoms";
import { compareCompanyName , compareText } from "../../constants/functions";
import TransactionAddNewModal from "./TransactionAddNewModal";
import { useTranslation } from "react-i18next";

const Transactions = () => {
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const allTransactionData = useRecoilValue(atomAllTransactions);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllTransactions, setCurrentTransaction } = useRecoilValue(TransactionRepo);
  const [ initAddNewTransaction, setInitAddNewTransaction ] = useState(false);

  const { t } = useTranslation();
  
  // --- Section for Table ------------------------------
  const columns = [
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
      title: t('transaction.title'),
      dataIndex: "transaction_title",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#transactions-details"
            onClick={()=>setCurrentTransaction(record.transaction_code)}
          >
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => compareText(a.transaction_title, b.transaction_title),
    },
    {
      title: t('transaction.type'),
      dataIndex: "transaction_type",
      render: (text, record) => (
        <>
          <a href="#"
            data-bs-toggle="modal"
            data-bs-target="#transactions-details"
            onClick={()=>setCurrentTransaction(record.transaction_code)}
          >
            {text}
          </a>
        </>
      ),
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
      title: t('transaction.publish_type'),
      dataIndex: "publish_type",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.publish_type, b.publish_type),
    },
    {
      title: t('transaction.payment_type'),
      dataIndex: "payment_type",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => compareText(a.payment_type, b.payment_type),
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

  const handleAddNewTransaction = useCallback(() => {
    setInitAddNewTransaction(!initAddNewTransaction);
  }, [initAddNewTransaction]);

  useEffect(() => {
    if (allCompanyData.length === 0) {
      loadAllCompanies();
    };
    if (allTransactionData.length === 0) {
      loadAllTransactions();
    };
  }, [allCompanyData, allTransactionData]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>{t('transaction.transaction')}</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          <div className="crms-title row bg-white">
            <div className="col  p-0">
              <h3 className="page-title m-0">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  {/* <i className="feather-calendar" /> */}
                  <i>
                    <BiReceipt />
                  </i>
                </span>{" "}
                {t('transaction.transaction')}{" "}
              </h3>
            </div>
            <div className="col p-0 text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">{t('transaction.transaction')}</li>
              </ul>
            </div>
          </div>
          <div className="page-header pt-3 mb-0 ">
            <div className="row">
              <div className="col">
                <div className="dropdown">
                  <a
                    className="dropdown-toggle recently-viewed"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {" "}
                    Propose Times{" "}
                  </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item">Recently Viewed</a>
                    <a className="dropdown-item">Items I'm following</a>
                    <a className="dropdown-item">All Transactions</a>
                    <a className="dropdown-item">All Closed Transactions</a>
                    <a className="dropdown-item">All Open Transactions</a>
                    <a className="dropdown-item">My Transactions</a>
                  </div>
                </div>
              </div>
              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
                      data-bs-toggle="modal"
                      data-bs-target="#add_new_transaction"
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
                    <Table
                      rowSelection={{
                        ...rowSelection,
                      }}
                      pagination={{
                        total: allTransactionData.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      bordered
                      dataSource={allTransactionData}
                      rowKey={(record) => record.transaction_code}
                      // onChange={handleTableChange}
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
        <CompanyDetailsModel />
        <TransactionsDetailsModel />
        <TransactionAddNewModal init={initAddNewTransaction} handleInit={setInitAddNewTransaction}/>
        {/* cchange pipeline stage Modal */}
        <div className="modal" id="pipeline-stage">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Change Pipeline Stage</h4>
                <button type="button" className="close" data-bs-dismiss="modal">
                  ×
                </button>
              </div>
              {/* Modal body */}
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label className="col-form-label">New Stage</label>
                    <select className="form-control" id="related-to">
                      <option>Plan</option>
                      <option>Design</option>
                      <option>Develop</option>
                      <option>Complete</option>
                    </select>
                  </div>
                </form>
              </div>
              {/* Modal footer */}
              <div className="modal-footer text-center">
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                >
                  Save
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-secondary btn-rounded cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Transactions;

import React, { useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { ConvertCurrency, formatDate } from "../../constants/functions";
import { Add } from "@mui/icons-material";

import { atomTransactionByCompany, defaultTransaction } from '../../atoms/atoms';
import { TransactionRepo } from '../../repository/transaction';
import { SettingsRepo } from '../../repository/settings';

const CompanyTransactionModel = (props) => {
    const { openTransaction } = props;
    const { t } = useTranslation();


    //===== [RecoilState] Related with Transaction ======================================
    const transactionByCompany = useRecoilValue(atomTransactionByCompany);
    const { setCurrentTransaction } = useRecoilValue(TransactionRepo);


    //===== [RecoilState] Related with Settings ======================================
    const { openModal } = useRecoilValue(SettingsRepo);
    
    
    // --- Variables for only Transaction ------------------------------------------------
    const [selectedTransactionRowKeys, setSelectedTransactionRowKeys] = useState([]);

    const handleSelectTransaction = (value) => {
        setCurrentTransaction(value.transaction_code);
        openTransaction(true);
        
        setTimeout(()=>{
            openModal('edit_transaction');
        }, 500);
    };

    const handleAddNewTransaction = () => {
        setCurrentTransaction();
        openTransaction(true);

        setTimeout(()=>{
            openModal('edit_transaction');
        }, 500);
    };

    const transactionRowSelection = {
        selectedRowKeys: selectedTransactionRowKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedTransactionRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected purchase ----------------------
                const selectedValue = selectedRows.at(0);
                handleSelectTransaction(selectedValue);
            } else {
                setCurrentTransaction(defaultTransaction);
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };

    const columns_transaction = [
        {
            title: t('company.deal_type'),
            dataIndex: "transaction_type",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('transaction.publish_date'),
            dataIndex: "publish_date",
            render: (text, record) => <>{formatDate(record.publish_date)}</>,
        },
        {
            title: t('company.business_registration_code'),
            dataIndex: "business_registration_code",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('transaction.title'),
            dataIndex: "transaction_title",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('transaction.supply_price'),
            dataIndex: "supply_price",
            render: (text, record) => <>{ConvertCurrency(record.supply_price)}</>,
        },
        {
            title: t('transaction.tax_price'),
            dataIndex: "tax_price",
            render: (text, record) => <>{ConvertCurrency(record.tax_price)}</>,
        },
        {
            title: t('transaction.total_price'),
            dataIndex: "total_price",
            render: (text, record) => <>{ConvertCurrency(record.total_price)}</>,
        },
        {
            title: t('transaction.publish_type'),
            dataIndex: "publish_type",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('common.issued_by'),
            dataIndex: "recent_user",
            render: (text, record) => <>{text}</>,
        },
    ];

    useEffect(() => {
        // console.log('[CompanyTransactionModel] called!');
    // 모달 내부 페이지의 히스토리 상태 추가
    history.pushState({ modalInternal: true }, '', location.href);

    const handlePopState = (event) => {
      if (event.state && event.state.modalInternal) {
        // 뒤로 가기를 방지하기 위해 다시 히스토리를 푸시
        history.replaceState({ modalInternal: true }, '', location.href);
      }
    };
  
    // popstate 이벤트 리스너 추가 (중복 추가 방지)
    window.addEventListener('popstate', handlePopState);        
    }, [transactionByCompany]);

    return (
        <div className="row">
            <div className="card mb-0">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={transactionRowSelection}
                            pagination={{
                                total: transactionByCompany.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_transaction}
                            dataSource={transactionByCompany}
                            rowKey={(record) => record.transaction_code}  // publish_date
                            title={() =>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#cccccc',
                                    fontWeight: 600,
                                    lineHeight: 1.5,
                                    height: '2.5rem',
                                    padding: '0.5rem 0.8rem',
                                    borderRadius: '5px',
                                }}
                                >
                                    <div>{t('purchase.information')}</div>
                                    <Add  onClick={() => handleAddNewTransaction()}/>
                                </div>
                            }
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setSelectedTransactionRowKeys([record.transaction_code]);
                                        handleSelectTransaction(record);
                                    }, // click row
                                };
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CompanyTransactionModel;
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { ConvertCurrency, formatDate } from "../../constants/functions";

import { TransactionRepo } from "../../repository/transaction";


const CompanyTransactionModel = (props) => {
    const { transactions } = props;
    const { setCurrentTransaction } = useRecoilValue(TransactionRepo);
    const { t } = useTranslation();

    // --- Variables for only Transaction ------------------------------------------------
    const [selectedTransactionRowKeys, setSelectedTransactionRowKeys] = useState([]);

    const handleSelectTransaction = useCallback((value) => {
        console.log('handleSelectTransaction :', value);
        setCurrentTransaction(value.transaction_code);
    }, [setCurrentTransaction]);

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
                setCurrentTransaction();
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };

    const columns_purchase = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record) => <>{record.rowIndex}</>,
        },
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
            title: t('transaction.transaction_content'),
            dataIndex: "transaction_contents",
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
        console.log('[CompanyTransactionModel] called!');
    }, [transactions]);

    return (
        <div className="row">
            <div className="card mb-0">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={transactionRowSelection}
                            pagination={{
                                total: transactions.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_purchase}
                            dataSource={transactions}
                            rowKey={(record) => record.transaction_code}
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
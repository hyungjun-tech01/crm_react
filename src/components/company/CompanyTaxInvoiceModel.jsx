import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { ConvertCurrency, formatDate } from "../../constants/functions";
import * as bootstrap from '../../assets/js/bootstrap.bundle';

import { TaxInvoiceRepo } from "../../repository/tax_invoice";


const CompanyTaxInvoiceModel = (props) => {
    const { taxInvoices, openTaxInvoice } = props;
    const { t } = useTranslation();


    //===== [RecoilState] Related with TaxInvoice ======================================
    const { setCurrentTaxInvoice } = useRecoilValue(TaxInvoiceRepo);

    
    // --- Variables for only TaxInvoice ------------------------------------------------
    const [selectedTaxInvoiceRowKeys, setSelectedTaxInvoiceRowKeys] = useState([]);

    const handleSelectTaxInvoice = useCallback((code) => {
        setCurrentTaxInvoice(code);
        openTaxInvoice(true);

        setTimeout(()=>{
            let myModal = new bootstrap.Modal(document.getElementById('edit_tax_invoice'), {
                keyboard: false
            });
            myModal.show();
        }, 500);
    }, [openTaxInvoice, setCurrentTaxInvoice]);

    const taxInvoiceRowSelection = {
        selectedRowKeys: selectedTaxInvoiceRowKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedTaxInvoiceRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected purchase ----------------------
                const selectedValue = selectedRows.at(0);
                handleSelectTaxInvoice(selectedValue);
            } else {
                setCurrentTaxInvoice();
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };

    const columns_tax_invoice = [
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
        console.log('[CompanyTaxInvoiceModel] called!');
    }, [taxInvoices]);

    return (
        <div className="row">
            <div className="card mb-0">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={taxInvoiceRowSelection}
                            pagination={{
                                total: taxInvoices.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_tax_invoice}
                            dataSource={taxInvoices}
                            rowKey={(record) => record.tax_invoice_code}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setSelectedTaxInvoiceRowKeys([record.tax_invoice_code]);
                                        handleSelectTaxInvoice(record.tax_invoice_code);
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

export default CompanyTaxInvoiceModel;
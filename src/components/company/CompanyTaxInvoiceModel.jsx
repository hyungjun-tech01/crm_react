import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { ConvertCurrency, formatDate } from "../../constants/functions";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import { Add } from "@mui/icons-material";

import { atomTaxInvoiceByCompany } from '../../atoms/atoms';
import { TaxInvoiceRepo } from '../../repository/tax_invoice';
import { SettingsRepo } from '../../repository/settings';

const CompanyTaxInvoiceModel = (props) => {
    const { openTaxInvoice } = props;
    const { t } = useTranslation();


    //===== [RecoilState] Related with TaxInvoice ======================================
    const taxInvoiceByCompany = useRecoilValue(atomTaxInvoiceByCompany);
    const { setCurrentTaxInvoice } = useRecoilValue(TaxInvoiceRepo);


    //===== [RecoilState] Related with Settings ======================================
    const { openModal } = useRecoilValue(SettingsRepo);

    
    // --- Variables for only TaxInvoice ------------------------------------------------
    const [selectedTaxInvoiceRowKeys, setSelectedTaxInvoiceRowKeys] = useState([]);

    const handleSelectTaxInvoice = (code) => {
        setCurrentTaxInvoice(code);
        openTaxInvoice(true);

        setTimeout(()=>{
            openModal('edit_tax_invoice');
        }, 500);
    };

    const handleAddNewTaxInvoice = () => {
        setCurrentTaxInvoice();
        openTaxInvoice(true);

        setTimeout(()=>{
            openModal('edit_tax_invoice');
        }, 500);
    };

    const taxInvoiceRowSelection = {
        selectedRowKeys: selectedTaxInvoiceRowKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedTaxInvoiceRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected purchase ----------------------
                const selectedValue = selectedRows.at(0);
                handleSelectTaxInvoice(selectedValue.tax_invoice_code);
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
            dataIndex: "create_date",
            render: (text, record) => <>{formatDate(record.create_date)}</>,
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

    return (
        <div className="row">
            <div className="card mb-0">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={taxInvoiceRowSelection}
                            pagination={{
                                total: taxInvoiceByCompany.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_tax_invoice}
                            dataSource={taxInvoiceByCompany}
                            rowKey={(record) => record.tax_invoice_code}
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
                                    <div>{t('taxinvoice.information')}</div>
                                    <Add  onClick={() => handleAddNewTaxInvoice()}/>
                                </div>
                            }
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
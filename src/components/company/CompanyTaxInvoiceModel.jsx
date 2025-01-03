import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { ConvertCurrency, formatDate } from "../../constants/functions";
import { Add } from "@mui/icons-material";

import { atomCurrentTaxInvoice, atomTaxInvoiceByCompany, defaultTaxInvoice } from '../../atoms/atoms';
import { SettingsRepo } from '../../repository/settings';


const CompanyTaxInvoiceModel = (props) => {
    const { openTaxInvoice } = props;
    const { t } = useTranslation();


    //===== [RecoilState] Related with TaxInvoice ======================================
    const taxInvoiceByCompany = useRecoilValue(atomTaxInvoiceByCompany);
    const setCurrentTaxInvoice = useSetRecoilState(atomCurrentTaxInvoice);


    //===== [RecoilState] Related with Settings ======================================
    const { openModal } = useRecoilValue(SettingsRepo);

    
    // --- Variables for only TaxInvoice ------------------------------------------------
    const [selectedTaxInvoiceRowKeys, setSelectedTaxInvoiceRowKeys] = useState([]);

    const handleSelectTaxInvoice = (value) => {
        setCurrentTaxInvoice(value);
        setTimeout(()=>{
            openTaxInvoice(true);
            openModal('edit_tax_invoice');
        }, 100);
    };

    const handleAddNewTaxInvoice = () => {
        setCurrentTaxInvoice(defaultTaxInvoice);
        setTimeout(()=>{
            openTaxInvoice(true);
            openModal('edit_tax_invoice');
        }, 100);
    };

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
                setCurrentTaxInvoice(defaultTaxInvoice);
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

    useEffect(() => {
        // console.log('[CompanyTaxInvoiceModel] called!');
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
    }, [taxInvoiceByCompany]);

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
                                        handleSelectTaxInvoice(record);
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
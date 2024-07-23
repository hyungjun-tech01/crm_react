import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import { ItemRender, ShowTotal } from "../paginationfunction";
import { formatDate, ConvertCurrency } from "../../constants/functions";
import { Add } from "@mui/icons-material";

import { QuotationRepo } from "../../repository/quotation";

const LeadQuotationModel = (props) => {
    const { quotations, handleInitAddQuotation } = props;
    const { t } = useTranslation();


    //===== [RecoilState] Related with Quotation ===========================================
    const { setCurrentQuotation } = useRecoilValue(QuotationRepo);


    //===== Handles to deal this component =================================================
    const [selectedKeys, setSelectedRowKeys] = useState([]);
    
    const transferToOtherModal = (id) => {
        let myModal = new bootstrap.Modal(document.getElementById(id), {
            keyboard: false
        });
        myModal.show();
    };

    const handleAddNewConsulting = () => {
        console.log('[LeadQuotationModel] handleAddNewQuotation');
        handleInitAddQuotation(true);
        transferToOtherModal('add_quotation');
    };

    const columns_quotation = [
        {
            title: t('common.title'),
            dataIndex: 'quotation_title',
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('quotation.quotation_type'),
            dataIndex: "quotation_type",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('quotation.quotation_status'),
            dataIndex: "status",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('quotation.quotation_date'),
            dataIndex: "quotation_date",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('quotation.doc_no'),
            dataIndex: "quotation_number",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('quotation.total_quotation_amount'),
            dataIndex: "total_quotation_amount",
            render: (text, record) => <>{ConvertCurrency(record.total_quotation_amount)}</>,
        },
        {
            title: t('quotation.quotation_manager'),
            dataIndex: "quotation_manager",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('quotation.sales_rep'),
            dataIndex: "sales_representative",
            render: (text, record) => <>{text}</>,
        },
    ];

    const quotationRowSelection = {
        selectedRowKeys: selectedKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected quotation ----------------------
                const selectedValue = selectedRows.at(0);
                setCurrentQuotation(selectedValue.quotation_code);
                setSelectedRowKeys([]);   //initialize the selected list about contract
            } else {
                setCurrentQuotation();
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };

    return (
        <div className="row">
            <div className="card mb-0">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={quotationRowSelection}
                            pagination={{
                                total: quotations.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_quotation}
                            dataSource={quotations}
                            rowKey={(record) => record.quotation_code}
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
                                    <div>{t('quotation.quotation_information')}</div>
                                    <Add onClick={() => handleAddNewConsulting()} />
                                </div>
                            }
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setSelectedRowKeys([record.quotation_code]);
                                        setCurrentQuotation(record.quotation_code);
                                        transferToOtherModal('quotation-details');
                                        setSelectedRowKeys([]);   //initialize the selected list about contract
                                    }, // click row
                                };
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadQuotationModel;
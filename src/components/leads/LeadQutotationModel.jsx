import React, { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";

import { SettingsRepo } from "../../repository/settings";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { formatDate, ConvertCurrency } from "../../constants/functions";
import { Add } from "@mui/icons-material";

import { atomCurrentQuotation, atomQuotationByLead, defaultQuotation } from "../../atoms/atoms";


const LeadQuotationModel = ({ handleInitAddQuotation }) => {
    const { t } = useTranslation();


    //===== [RecoilState] Related with Quotation ===========================================
    const quotationsByLead = useRecoilValue(atomQuotationByLead);
    const setCurrentQuotation = useSetRecoilState(atomCurrentQuotation);


    //===== [RecoilState] Related with Users ==========================================
    const { openModal } = useRecoilValue(SettingsRepo);


    //===== Handles to deal this component =================================================
    const [selectedKeys, setSelectedRowKeys] = useState([]);
    
    const handleAddNewQuotataion = () => {
        setCurrentQuotation(defaultQuotation);
        handleInitAddQuotation(true);
        setTimeout(() => {
            openModal('add_quotation');
        }, 500);
    };

    const columns_quotation = [
        {
            title: t('quotation.quotation_date'),
            dataIndex: "quotation_date",
            render: (text, record) => <>{formatDate(text)}</>,
        },
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
                setCurrentQuotation(selectedValue);
                setSelectedRowKeys([]);   //initialize the selected list about contract
            } else {
                setCurrentQuotation(defaultQuotation);
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };
    useEffect(()=>{
        console.log('[LeadConsultingModel] Maybe consultings are updated');
        // 모달 내부 페이지의 히스토리 상태 추가
        history.pushState({ modalInternal: true }, '', location.href);

        const handlePopState = (event) => {
        if (event.state && event.state.modalInternal) {
            // 뒤로 가기를 방지하기 위해 다시 히스토리를 푸시
            history.pushState({ modalInternal: true }, '', location.href);
        }
        };

        // popstate 이벤트 리스너 추가 (중복 추가 방지)
        window.addEventListener('popstate', handlePopState);        
    }, [])
    return (
        <div className="row">
            <div className="card mb-0">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={quotationRowSelection}
                            pagination={{
                                total: quotationsByLead.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_quotation}
                            dataSource={quotationsByLead}
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
                                    <Add onClick={() => handleAddNewQuotataion()} />
                                </div>
                            }
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setSelectedRowKeys([record.quotation_code]);
                                        setCurrentQuotation(record);
                                        setSelectedRowKeys([]);   //initialize the selected list about contract
                                        setTimeout(() => {
                                            openModal('quotation-details');
                                        }, 500);
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
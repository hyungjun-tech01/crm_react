import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import * as DOMPurify from "dompurify";

import { SettingsRepo } from "../../repository/settings";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { Add } from "@mui/icons-material";

import { atomConsultingByLead, atomCurrentConsulting, defaultConsulting } from "../../atoms/atoms";

const LeadConsultingModel = ({ handleInitAddConsulting }) => {
    const { t } = useTranslation();


    //===== [RecoilState] Related with Users ==========================================
    const { openModal } = useRecoilValue(SettingsRepo);


    //===== [RecoilState] Related with Consulting ==========================================
    const consultingsByLead = useRecoilValue(atomConsultingByLead);
    const setCurrentConsulting = useSetRecoilState(atomCurrentConsulting);


    //===== Handles to deal this component =================================================
    const [selectedKeys, setSelectedRowKeys] = useState([]);

    const handleAddNewConsulting = () => {
        handleInitAddConsulting(true);
        setCurrentConsulting(defaultConsulting);
        setTimeout(() => {
            openModal('add_consulting');
        }, 500);
    };
    
    const columns_consulting = [
        {
            title: t('consulting.receipt_date'),
            dataIndex: 'receipt_date',
            render: (text, record) => 
                <>{record === null  ? '' : new Date(text).toLocaleString('ko-KR', {timeZone:'UTC'})}</>,
        },
        {
            title: t('consulting.receiver'),
            dataIndex: "receiver",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('consulting.type'),
            dataIndex: "consulting_type",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('consulting.request_type'),
            dataIndex: "request_type",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('consulting.request_content'),
            dataIndex: "request_content",
            render: (text, record) => <div style={{maxHeight: '520px', overflow: 'auto'}}
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(text || ''),
                }} />,
        },
        {
            title: t('consulting.lead_time'),
            dataIndex: "lead_time",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('company.salesman'),
            dataIndex: "sales_representative",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('consulting.action_content'),
            dataIndex: "action_content",
            render: (text, record) => <div style={{maxHeight: '520px', overflow: 'auto'}}
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(text || ''),
                }} />,
        },
        {
            title: t('consulting.generator'),
            dataIndex: "recent_user",
            render: (text, record) => <>{text}</>,
        },
    ];

    const consultingRowSelection = {
        selectedRowKeys: selectedKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected consulting ----------------------
                const selectedValue = selectedRows.at(0);
                setCurrentConsulting(selectedValue);
                setSelectedRowKeys([]);   //initialize the selected list about contract
            } else {
                setCurrentConsulting(defaultConsulting);
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };

<<<<<<< HEAD
=======
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
    }, [consultingsByLead])

>>>>>>> c5a7b4da54db9ae0e9a55e38f8fe9737f9e77db7
    return (
        <div className="row">
            <div className="card mb-0">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={consultingRowSelection}
                            pagination={{
                                total: consultingsByLead.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_consulting}
                            dataSource={consultingsByLead}
                            rowKey={(record) => record.consulting_code}
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
                                    <div>{t('consulting.information')}</div>
                                    <Add onClick={() => handleAddNewConsulting()} />
                                </div>
                            }
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setSelectedRowKeys([record.consulting_code]);
                                        setCurrentConsulting(record);
                                        setSelectedRowKeys([]);   //initialize the selected list about contract
                                        setTimeout(() => {
                                            openModal('consulting-details');    
                                        })
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

export default LeadConsultingModel;
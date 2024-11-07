import React, { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { Table } from "antd";
import * as DOMPurify from "dompurify";

import { SettingsRepo } from "../../repository/settings";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { Add } from "@mui/icons-material";

import { atomConsultingByLead, atomCurrentConsulting, atomCurrentLead, defaultConsulting } from "../../atoms/atoms";

const LeadConsultingModel = ({ handleInitDataAddConsulting }) => {
    const { t } = useTranslation();
    const [ cookies ] = useCookies([ "myLationCrmUserName" ]);


    //===== [RecoilState] Related with Users ==========================================
    const { openModal } = useRecoilValue(SettingsRepo);


    //===== [RecoilState] Related with Consulting ==========================================
    const currentLead = useRecoilValue(atomCurrentLead);


    //===== [RecoilState] Related with Consulting ==========================================
    const consultingsByLead = useRecoilValue(atomConsultingByLead);
    const setCurrentConsulting = useSetRecoilState(atomCurrentConsulting);


    //===== Handles to deal this component =================================================
    const [selectedKeys, setSelectedRowKeys] = useState([]);

    const handleAddNewConsulting = () => {
        setCurrentConsulting(defaultConsulting);
        handleInitDataAddConsulting({
            ...defaultConsulting,
            lead_code: currentLead.lead_code,
            lead_name: currentLead.lead_name,
            department: currentLead.department,
            position: currentLead.position,
            mobile_number: currentLead.mobile_number,
            phone_number: currentLead.phone_number,
            email: currentLead.email,
            company_code: currentLead.company_code,
            company_name: currentLead.company_name,
            receiver: cookies.myLationCrmUserName,
            receipt_date: new Date(),
        });
        openModal('add_lead_consulting');
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
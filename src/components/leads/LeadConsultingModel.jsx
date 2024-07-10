import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import * as bootstrap from '../../assets/js/bootstrap';
import { ItemRender, ShowTotal } from "../paginationfunction";
import { formatDate } from "../../constants/functions";
import { Add } from "@mui/icons-material";

import { ConsultingRepo } from "../../repository/consulting";


const LeadConsultingModel = (props) => {
    const { consultings, handleAddConsulting } = props;
    const { t } = useTranslation();


    //===== [RecoilState] Related with Consulting ==========================================
    const { setCurrentConsulting } = useRecoilValue(ConsultingRepo);


    //===== Handles to deal this component =================================================
    const [selectedKeys, setSelectedRowKeys] = useState([]);
    
    const transferToOtherModal = (id) => {
        handleAddConsulting(true);
        let myModal = new bootstrap.Modal(document.getElementById(id), {
            keyboard: false
        });
        myModal.show();
    };
    
    const columns_consulting = [
        {
            title: t('consulting.receipt_date'),
            dataIndex: 'receipt_date',
            render: (text, record) => <>{text}</>,
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
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('consulting.lead_time'),
            dataIndex: "lead_time",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('company.salesman'),
            dataIndex: "sales_representati",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('consulting.action_content'),
            dataIndex: "action_content",
            render: (text, record) => <>{text}</>,
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
                setCurrentConsulting(selectedValue.consulting_code);
                setSelectedRowKeys([]);   //initialize the selected list about contract
            } else {
                setCurrentConsulting();
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
                                total: consultings.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_consulting}
                            dataSource={consultings}
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
                                    <Add onClick={() => transferToOtherModal('add_consulting')} />
                                </div>
                            }
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setSelectedRowKeys([record.consulting_code]);
                                        setCurrentConsulting(record.consulting_code);
                                        transferToOtherModal('consulting-details');
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

export default LeadConsultingModel;
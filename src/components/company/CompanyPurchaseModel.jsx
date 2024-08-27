import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { formatDate } from "../../constants/functions";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import { Add } from "@mui/icons-material";

import {
    atomCurrentPurchase,
    defaultPurchase,
    atomPurchaseByCompany,
} from "../../atoms/atoms";


const CompanyPurchaseModel = (props) => {
    const { handleInitAddPurchase } = props;
    const { t } = useTranslation();


    //===== [RecoilState] Related with Purchase =========================================
    const purchaseByCompany = useRecoilValue(atomPurchaseByCompany);
    const setCurrentPurchase = useSetRecoilState(atomCurrentPurchase);


    //===== Handles to this =============================================================
    const [selectedPurchaseRowKeys, setSelectedPurchaseRowKeys] = useState([]);

    const transferToOtherModal = (id) => {
        let myModal = new bootstrap.Modal(document.getElementById(id), {
            keyboard: false
        });
        myModal.show();
    };

    const handleSelectPurchase = (selected) => {
        setCurrentPurchase(selected);
        transferToOtherModal('purchase-details');
    };

    const handleAddNewPurchase = () => {
        setCurrentPurchase(defaultPurchase);
        handleInitAddPurchase(true);
        transferToOtherModal('add_purchase');
    };

    const columns_purchase = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record) => <>{record.rowIndex}</>,
        },
        {
            title: t('purchase.product_name'),
            dataIndex: "product_name",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('purchase.product_type'),
            dataIndex: "product_type",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('purchase.serial_number'),
            dataIndex: "serial_number",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('purchase.delivery_date'),
            dataIndex: "delivery_date",
            render: (text, record) => <>{formatDate(record.delivery_date)}</>,
        },
        {
            title: t('purchase.ma_finish_date'),
            dataIndex: "ma_finish_date",
            render: (text, record) => <>{formatDate(record.ma_finish_date)}</>,
        },
    ];

    const purchaseRowSelection = {
        selectedRowKeys: selectedPurchaseRowKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedPurchaseRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected purchase ----------------------
                const selectedValue = selectedRows.at(0);
                handleSelectPurchase(selectedValue);
            } else {
                setCurrentPurchase();
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };


    useEffect(() => {
        console.log('[CompanyPurchaseModel] called!');
    }, [purchaseByCompany]);

    return (
        <div className="row">
            <div className="card mb-2">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={purchaseRowSelection}
                            pagination={{
                                total: purchaseByCompany.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_purchase}
                            dataSource={purchaseByCompany}
                            rowKey={(record) => record.purchase_code}
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
                                    <Add  onClick={() => handleAddNewPurchase()}/>
                                </div>
                            }
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setSelectedPurchaseRowKeys([record.purchase_code]);
                                        handleSelectPurchase(record);
                                    },
                                };
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CompanyPurchaseModel;
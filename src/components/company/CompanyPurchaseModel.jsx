import React, { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { Spin, Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { formatDate } from "../../constants/functions";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import { Add } from "@mui/icons-material";

import {
    atomProductClassList,
    atomProductClassListState,
    atomAllProducts,
    atomProductsState,
    atomProductOptions,
} from "../../atoms/atoms";
import { PurchaseRepo } from "../../repository/purchase";
import { ProductClassListRepo, ProductRepo } from "../../repository/product";


const CompanyPurchaseModel = (props) => {
    const { purchases, handleInitAddPurchase } = props;
    const { t } = useTranslation();


    //===== [RecoilState] Related with Product ==========================================
    const productClassState = useRecoilValue(atomProductClassListState);
    const { tryLoadAllProductClassList } = useRecoilValue(ProductClassListRepo);
    const allProductClassList = useRecoilValue(atomProductClassList);
    const productState = useRecoilValue(atomProductsState);
    const allProducts = useRecoilValue(atomAllProducts);
    const { tryLoadAllProducts } = useRecoilValue(ProductRepo);
    const [ productOptions, setProductOptions ] = useRecoilState(atomProductOptions);


    //===== [RecoilState] Related with Purchase =========================================
    const { setCurrentPurchase } = useRecoilValue(PurchaseRepo);


    //===== Handles to this =============================================================
    const [ isAllNeededDataLoaded, setIsAllNeededDataLoaded ] = useState(false);
    const [selectedPurchaseRowKeys, setSelectedPurchaseRowKeys] = useState([]);

    const transferToOtherModal = (id) => {
        let myModal = new bootstrap.Modal(document.getElementById(id), {
            keyboard: false
        });
        myModal.show();
    };

    const handleSelectPurchase = (code) => {
        setCurrentPurchase(code);
        transferToOtherModal('purchase-details');
    };

    const handleAddNewPurchase = () => {
        setCurrentPurchase();
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
                handleSelectPurchase(selectedValue.purchase_code);
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


    // ----- useEffect for Production -----------------------------------
    useEffect(() => {
        tryLoadAllProductClassList();
        tryLoadAllProducts();
        if (((productClassState & 1) === 1)
            && ((productState & 1) === 1)
        ){
            if(productOptions.length === 0) {
                const productOptionsValue = allProductClassList.map(proClass => {
                    const foundProducts = allProducts.filter(product => product.product_class_name === proClass.product_class_name);
                    const subOptions = foundProducts.map(item => {
                        return {
                            label: <span>{item.product_name}</span>,
                            value: { product_code: item.product_code,
                                product_name: item.product_name,
                                product_class: item.product_class,
                                detail_desc: item.detail_desc,
                                cost_price: item.const_price,
                                reseller_price: item.reseller_price,
                                list_price: item.list_price,
                            }
                        }
                    });
                    return {
                        label: <span>{proClass.product_class_name}</span>,
                        title: proClass.product_class_name,
                        options: subOptions,
                    };
                });
                setProductOptions(productOptionsValue);
            };
            setIsAllNeededDataLoaded(true);
        };
    }, [allProductClassList, allProducts, productClassState, productOptions, productState, setProductOptions]);

    if (!isAllNeededDataLoaded)
        return (
            <Spin tip="Loading" size="large">
                <div
                    style={{
                        padding: 50,
                        background: "rgba(0, 0, 0, 0.05)",
                        borderRadius: 4,
                    }}
                >
                    &nbsp;&nbsp;
                </div>
            </Spin>
        );

    return (
        <div className="row">
            <div className="card mb-2">
                <div className="table-body">
                    <div className="table-responsive">
                        <Table
                            rowSelection={purchaseRowSelection}
                            pagination={{
                                total: purchases.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_purchase}
                            dataSource={purchases}
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
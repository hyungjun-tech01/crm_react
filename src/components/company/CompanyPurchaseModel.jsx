import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Button, Space, Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { ConvertCurrency, formatDate } from "../../constants/functions";
import { Add } from "@mui/icons-material";

import {
    atomCurrentPurchase,
    defaultPurchase,
    atomMAContractSet,
    defaultMAContract,
    atomProductClassList,
    atomProductClassListState,
    atomAllProducts,
    atomProductsState,
    atomProductOptions,
} from "../../atoms/atoms";
import { PurchaseRepo } from "../../repository/purchase";
import { MAContractRepo } from "../../repository/ma_contract";
import { ProductClassListRepo, ProductRepo, ProductTypeOptions } from "../../repository/product";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailSubModal from '../../constants/DetailSubModal';


const CompanyPurchaseModel = (props) => {
    const { company, purchases, handlePurchase } = props;
    const [productClassState, setProductClassState] = useRecoilState(atomProductClassListState);
    const [productState, setProductState] = useRecoilState(atomProductsState);
    const currentPurchase = useRecoilValue(atomCurrentPurchase);
    const { modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);
    const companyMAContracts = useRecoilValue(atomMAContractSet);
    const { modifyMAContract } = useRecoilValue(MAContractRepo);

    const allProductClassList = useRecoilValue(atomProductClassList);
    const { loadAllProductClassList } = useRecoilValue(ProductClassListRepo);
    const allProducts = useRecoilValue(atomAllProducts);
    const { loadAllProducts } = useRecoilValue(ProductRepo);
    const [ productOptions, setProductOptions ] = useRecoilState(atomProductOptions);

    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    const { t } = useTranslation();

    const [ isSubModalOpen, setIsSubModalOpen ] = useState(false);
    const [ subModalSetting, setSubModalSetting] = useState({ title: '' })

    const [editedOtherValues, setEditedOtherValues] = useState(null);
    const [orgTimeOther, setOrgTimeOther] = useState(null);
    const [editedOtherSelectValues, setEditedOtherSelectValues] = useState(null);
    const [isOtherItemSelected, setIsOtherItemSelected] = useState(false);

    const [selectedPurchaseRowKeys, setSelectedPurchaseRowKeys] = useState([]);


    const handleOtherItemChange = useCallback(e => {
        const tempEdited = {
            ...editedOtherValues,
            [e.target.name]: e.target.value,
        };

        setEditedOtherValues(tempEdited);
    }, [editedOtherValues]);

    const handleOtherItemTimeChange = useCallback((name, date) => {
        const tempEdited = {
            ...editedOtherValues,
            [name]: date,
        };
        setEditedOtherValues(tempEdited);
    }, [editedOtherValues]);

    const handleOtherItemSelectChange = useCallback((name, value) => {
        if (name === 'product_name') {
            const tempOtherSelect = {
                ...editedOtherSelectValues,
                product_class_name: value.value.product_class_name,
            };
            setEditedOtherSelectValues(tempOtherSelect);

            const tempNew = {
                ...editedOtherValues,
                product_name: value.value.product_name,
                product_class_name: value.value.product_class_name,
                product_code: value.value.product_code,
            };
            setEditedOtherValues(tempNew);
        } else if (name === 'product_type') {
            const tempNew = {
                ...editedOtherValues,
                product_type: value.value,
            };
            setEditedOtherValues(tempNew);
        };
    }, [editedOtherValues, editedOtherSelectValues]);

    const handleOtherItemChangeCancel = useCallback(() => {
        setCurrentPurchase();
        setEditedOtherValues(null);
        setOrgTimeOther(null);
        setSelectedPurchaseRowKeys([]);
        setIsOtherItemSelected(false);
    }, []);

    const handleOtherItemChangeSave = useCallback((code_name) => {
        if (editedOtherValues) {
            const tempSubValues = {
                ...editedOtherValues,
                action_type: "UPDATE",
                company_code: currentPurchase.company_code,
                modify_user: cookies.myLationCrmUserId,
                [code_name]: currentPurchase[code_name],
            };

            switch (code_name) {
                case 'purchase_code':
                    const res_data = modifyPurchase(tempSubValues);
                    res_data.then( res => {
                        if (res) {
                            console.log(`Succeeded to modify purchase`);
                            const modfiedPurchase = {
                                ...currentPurchase,
                                ...editedOtherValues,
                            };
                            const foundIdx = purchases.findIndex(item => item.purchase_code === currentPurchase.purchase_code);
                            if (foundIdx !== -1) {
                                const updatedPurchases = [
                                    ...purchases.slice(0, foundIdx),
                                    modfiedPurchase,
                                    ...purchases.slice(foundIdx + 1,),
                                ];
                                handlePurchase(updatedPurchases);
                            } else {
                                console.error("handleOtherItemChangeSave / Purchase : Impossible case!!!");
                            };
                            setCurrentPurchase();
                            setSelectedPurchaseRowKeys([]);
                            setIsOtherItemSelected(false);
                        } else {
                            console.error('Failed to modify company')
                        };
                    });
                    break;
                default:
                    console.log("handleOtherItemChangeSave / Impossible case!!!");
                break;
            };

            setEditedOtherValues(null);
            setOrgTimeOther(null);
        }
    }, [cookies.myLationCrmUserId, currentPurchase, editedOtherValues, handlePurchase, modifyPurchase, purchases, setCurrentPurchase]);


    // --- Functions for Editing New item ---------------------------------
    const [addNewItem, setAddNewItem] = useState(false);
    const [editedNewValues, setEditedNewValues] = useState(null);
    const [editedNewSelectValues, setEditedNewSelectValues] = useState(null);

    const handleAddNewItem = () => {
        setAddNewItem(true);
        const tempEditSelect = {
            product_name: null,
        };
        setEditedNewSelectValues(tempEditSelect);
    };

    const handleNewItemChange = useCallback(e => {
        const tempEdited = {
            ...editedNewValues,
            [e.target.name]: e.target.value,
        };

        setEditedNewValues(tempEdited);
    }, [editedNewValues]);

    const handleNewItemDateChange = useCallback((name, date) => {
        const tempEdited = {
            ...editedNewValues,
            [name]: date,
        };
        setEditedNewValues(tempEdited);
    }, [editedNewValues]);

    const handleNewItemSelectChange = useCallback((name, value) => {
        if (name === 'product_name') {
            const tempNewSelect = {
                ...editedNewSelectValues,
                product_class_name: value.value.product_class_name,
            };
            setEditedNewSelectValues(tempNewSelect);

            const tempNew = {
                ...editedNewValues,
                product_name: value.value.product_name,
                product_class_name: value.value.product_class_name,
                product_code: value.value.product_code,
            };
            setEditedNewValues(tempNew);
        } else if (name === 'product_type') {
            const tempNew = {
                ...editedNewValues,
                product_type: value.value,
            };
            setEditedNewValues(tempNew);
        };
    }, [editedNewSelectValues, editedNewValues]);

    const handleCancelNewItemChange = useCallback(() => {
        setEditedNewValues(null);
        setAddNewItem(false)
    }, []);

    const handleSaveNewItemChange = useCallback((code_name) => {
        if (editedNewValues) {
            const tempSubValues = {
                ...editedNewValues,
                action_type: "ADD",
                company_code: company.company_code,
                modify_user: cookies.myLationCrmUserId,
            };

            switch (code_name) {
                case 'purchase_code':
                    const res_data = modifyPurchase(tempSubValues);
                    res_data.then(res => {
                        if(res) {
                            console.log(`Succeeded to add purchase`);
                        } else {
                            console.error('Failed to add company')
                        };
                    });
                    break;
                default:
                    console.log("handleSaveNewItemChange / Impossible case!!!");
                    break;
            };
            setEditedNewValues(null);
            setEditedNewSelectValues(null);
            setAddNewItem(false);
        }
    }, [editedNewValues, company.company_code, cookies.myLationCrmUserId, modifyPurchase]);


    // --- Variables for only Purchase ------------------------------------------------
    const [ maContractByPurchase, setMaContractByPurchase ] = useState([]);

    const handleSelectPurchase = useCallback((purchase) => {
        setCurrentPurchase(purchase.purchase_code);
        setIsOtherItemSelected(true);

        setEditedOtherValues(null);
        setOrgTimeOther({
            receipt_date: purchase.receipt_date ? new Date(purchase.receipt_date) : null,
            delivery_date: purchase.delivery_date ? new Date(purchase.delivery_date) : null,
            ma_finish_date: purchase.ma_finish_date ? new Date(purchase.ma_finish_date) : null,
            hq_finish_date: purchase.hq_finish_date ? new Date(purchase.hq_finish_date) : null,
        });
        setEditedOtherSelectValues({
            product_class_name: purchase.product_class_name,
        });

        // Set data to edit selected purchase ----------------------
        const contractPurchase = companyMAContracts.filter(item => item.purchase_code === purchase.purchase_code);
        setMaContractByPurchase(contractPurchase);
    }, [companyMAContracts, setCurrentPurchase]);

    const add_purchase_items = [
        { key:'product_name', title:'purchase.product_name',
            detail:{
                type: 'select',
                group: 'product_class_name',
                options: productOptions,
                editing: handleNewItemSelectChange
        }},
        { key:'product_type', title:'purchase.product_type',
            detail:{
                type: 'select', options: ProductTypeOptions,
                editing:handleNewItemSelectChange
        }},
        { key:'serial_number', title:'purchase.serial_number', detail:{ type: 'label', editing: handleNewItemChange }},
        { key:'licence_info', title:'purchase.licence_info', detail:{ type: 'label', editing: handleNewItemChange }},
        { key:'module', title:'purchase.module', detail:{ type: 'label', editing: handleNewItemChange }},
        { key:'quantity', title:'common.quantity', detail:{ type: 'label', editing: handleNewItemChange }},
        { key:'receipt_date', title:'purchase.receipt_date',
            detail:{ type: 'date', editing: handleNewItemDateChange }},
        { key:'delivery_date', title:'purchase.delivery_date',
            detail:{ type: 'date', editing: handleNewItemDateChange }},
        { key:'hq_finish_date', title:'purchase.hq_finish_date',
            detail:{ type: 'date', editing: handleNewItemDateChange }},
        { key:'ma_finish_date', title:'purchase.ma_finish_date',
            detail:{ type: 'date', editing: handleNewItemDateChange }},
    ];

    const modify_purchase_items = [
        { key:'product_name', title:'purchase.product_name',
            detail:{
                type: 'select',
                group: 'product_class_name',
                options: productOptions,
                editing:handleOtherItemSelectChange
        }},
        { key:'product_type', title:'purchase.product_type',
            detail:{
                type: 'select', options: ProductTypeOptions,
                editing:handleOtherItemSelectChange
        }},
        { key:'serial_number', title:'purchase.serial_number', detail:{ type: 'label', editing: handleOtherItemChange }},
        { key:'licence_info', title:'purchase.licence_info', detail:{ type: 'label', editing: handleOtherItemChange }},
        { key:'module', title:'purchase.module', detail:{ type: 'label', editing: handleOtherItemChange }},
        { key:'quantity', title:'common.quantity', detail:{ type: 'label', editing: handleOtherItemChange }},
        { key:'receipt_date', title:'purchase.receipt_date',
            detail:{ type: 'date', editing: handleOtherItemTimeChange }},
        { key:'delivery_date', title:'purchase.delivery_date',
            detail:{ type: 'date', orgTimeData: orgTimeOther, timeDateChange: handleOtherItemTimeChange }},
        { key:'hq_finish_date', title:'purchase.hq_finish_date', detail:{ type: 'date', disabled: true }},
        { key:'ma_finish_date', title:'purchase.ma_finish_date', detail:{ type: 'date', disabled: true }},
    ];

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
                setSelectedContractRowKeys([]);   //initialize the selected list about contract
            } else {
                setCurrentPurchase(defaultPurchase);
                setEditedOtherValues(null);
                setOrgTimeOther(null);
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };


    // --- Functions for Editing MA Contract ---------------------------------
    const [subModalItems, setSubModalItems] = useState([]);
    const [orgSubModalValues, setOrgSubModalValues] = useState(null);
    const [editedSubModalValues, setEditedSubModalValues] = useState(null);
    const [selectedContractRowKeys, setSelectedContractRowKeys] = useState([]);

    const handleSubModalOk = useCallback(() => {
        const finalData = {
            ...orgSubModalValues,
            ...editedSubModalValues,
        };
        const resp = modifyMAContract(finalData);
        resp.then(result => {
            if (result) {
                const updatedContracts = maContractByPurchase.concat(result);
                setMaContractByPurchase(updatedContracts);

                // Update MA Contract end date
                if(currentPurchase 
                    && (!currentPurchase.ma_finish_date || (new Date(currentPurchase.ma_finish_date) < finalData.ma_finish_date))){
                    const modifiedPurchase = {
                        ...currentPurchase,
                        ma_finish_date: finalData.ma_finish_date,
                    };
                    const res_data = modifyPurchase(modifiedPurchase);
                    if(res_data){
                        console.log('Succeeded to update MA end date');
                    } else {
                        console.log('Fail to update MA end date');
                    };
                };
            } else {
                console.error('Failed to add/modify ma contract');
            }
        });

        setSelectedContractRowKeys([]);
        setIsSubModalOpen(false);
    }, [orgSubModalValues, editedSubModalValues, modifyMAContract, maContractByPurchase, currentPurchase, modifyPurchase]);

    const handleSubModalCancel = () => {
        setSubModalItems([]);
        setOrgSubModalValues(null);
        setSelectedContractRowKeys([]);
        setIsSubModalOpen(false);
    };

    const handleSubModalItemChange = useCallback(data => {
        setEditedSubModalValues(data);
    }, []);

    const handleAddMAContract = useCallback((company_code, purchase_code) => {
        setEditedSubModalValues(null);
        setOrgSubModalValues({
            ...defaultMAContract,
            action_type: 'ADD',
            ma_company_code: company_code,
            purchase_code: purchase_code,
            modify_user: cookies.myLationCrmUserId,
        });
        setSubModalItems([
            { name: 'ma_contract_date', title: t('contract.contract_date'), detail: { type: 'date' } },
            { name: 'ma_finish_date', title: t('contract.end_date'), detail: { type: 'date' } },
            { name: 'ma_price', title: t('common.price_1'), detail: { type: 'label' } },
            { name: 'ma_memo', title: t('common.memo'), detail: { type: 'textarea', row_no: 4 } },
        ]);
        setSubModalSetting({ title: t('contract.add_contract') });
        setIsSubModalOpen(true);
    }, [cookies.myLationCrmUserId, t]);

    const handleModifyMAContract = useCallback((code) => {
        setEditedSubModalValues(null);
        const foundMAContract = maContractByPurchase.filter(item => item.ma_code === code);
        if (foundMAContract.length > 0) {
            const selectedContract = foundMAContract[0];
            setOrgSubModalValues({
                ...selectedContract,
                ma_contract_date: new Date(selectedContract.ma_contract_date),
                ma_finish_date: new Date(selectedContract.ma_finish_date),
                action_type: 'UPDATE',
                modify_user: cookies.myLationCrmUserId,
            });
            setSubModalItems([
                { name: 'ma_contract_date', title: t('contract.contract_date'), detail: { type: 'date' } },
                { name: 'ma_finish_date', title: t('contract.end_date'), detail: { type: 'date' } },
                { name: 'ma_price', title: t('common.price_1'), detail: { type: 'label' } },
                { name: 'ma_memo', title: t('common.memo'), detail: { type: 'textarea', row_no: 4 } },
            ]);
            setSubModalSetting({ title: t('contract.add_contract') });
            setIsSubModalOpen(true);
        } else {
            console.error("Impossible Case~");
        };
    }, [cookies.myLationCrmUserId, maContractByPurchase, t]);

    const columns_ma_contract = [
        {
            title: t('contract.contract_date'),
            dataIndex: 'ma_contract_date',
            render: (text, record) => <>{formatDate(record.ma_contract_date)}</>,
        },
        {
            title: t('contract.contract_end_date'),
            dataIndex: "ma_finish_date",
            render: (text, record) => <>{formatDate(record.ma_finish_date)}</>,
        },
        {
            title: t('contract.contract_type'),
            dataIndex: "ma_contract_type",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('common.price_1'),
            dataIndex: "ma_price",
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('common.memo'),
            dataIndex: "ma_memo",
            render: (text, record) => <>{text}</>,
        },
    ];

    const contractRowSelection = {
        selectedRowKeys: selectedContractRowKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedContractRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected purchase ----------------------
                const selectedValue = selectedRows.at(0);
                handleModifyMAContract(selectedValue.ma_code);
            } else {
                setCurrentPurchase(defaultPurchase);
                setEditedOtherValues(null);
                setOrgTimeOther(null);
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
        if ((productClassState & 3) === 0) {
            console.log('[CompanyPurchaseModel] start loading product class list');
            setProductClassState(2);
            loadAllProductClassList();
        };
        if ((productState & 3) === 0) {
            console.log('[CompanyPurchaseModel] start loading product list');
            setProductState(2);
            loadAllProducts();
        };
        if (((productClassState & 1) === 1) && ((productState & 1) === 1) && (productOptions.length === 0)) {
            console.log("Check Product Options\n - ", productOptions);
            const productOptionsValue = allProductClassList.map(proClass => {
                const foundProducts = allProducts.filter(product => product.product_class_name === proClass.product_class_name);
                const subOptions = foundProducts.map(item => {
                    return {
                        label: <span>{item.product_name}</span>,
                        value: { product_code: item.product_code,
                            product_name: item.product_name,
                            product_class_name: item.product_class_name,
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
    }, [allProductClassList, allProducts, loadAllProductClassList, loadAllProducts, productClassState, productOptions, productState, setProductOptions]);


    return (
        <>
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
                                        <Add onClick={() => handleAddNewItem(company.company_code)} />
                                    </div>
                                }
                                onRow={(record, rowIndex) => {
                                    return {
                                        onClick: (event) => {
                                            setSelectedPurchaseRowKeys([record.purchase_code]);
                                            handleSelectPurchase(record);
                                            setSelectedContractRowKeys([]);   //initialize the selected list about contract
                                        }, // click row
                                    };
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isOtherItemSelected &&
                <>
                    <div className="row">
                        <div className="card mb-2">
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 600, padding: '0.5rem 0 0 1.0rem' }}>Selected Item</div>
                                <Space
                                    align="start"
                                    direction="horizontal"
                                    size="small"
                                    style={{ display: 'flex', marginBottom: '0.5rem', margineTop: '0.5rem' }}
                                    wrap
                                >
                                    {modify_purchase_items.map((item, index) =>
                                        <DetailCardItem
                                            key={index}
                                            title={t(item.title)}
                                            defaultValue={currentPurchase[item.key]}
                                            groupValue={item.detail.group? currentPurchase[item.detail.group]:null}
                                            name={item.key}
                                            edited={editedOtherValues}
                                            detail={item.detail}
                                        />
                                    )}
                                </Space>
                                <div style={{ marginBottom: '0.5rem', display: 'flex' }}>
                                    <DetailCardItem
                                        title={t('common.memo')}
                                        defaultValue={currentPurchase["purchase_memo"]}
                                        name="purchase_memo"
                                        edited={editedOtherValues}
                                        detail={{ type: 'textarea', extra: 'memo', row_no: 3, editing:handleOtherItemChange }}
                                    />
                                    <div style={{ width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                        <Button
                                            type="primary"
                                            style={{ width: '120px' }}
                                            disabled={!editedOtherValues}
                                            onClick={() => handleOtherItemChangeSave('purchase_code')}
                                        >
                                            {t('common.save')}
                                        </Button>
                                        <Button
                                            type="primary"
                                            style={{ width: '120px' }}
                                            onClick={handleOtherItemChangeCancel}
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="card mb-2">
                            <div className="table-body">
                                <div className="table-responsive">
                                    <Table
                                        rowSelection={contractRowSelection}
                                        pagination={{
                                            total: maContractByPurchase.length,
                                            showTotal: ShowTotal,
                                            showSizeChanger: true,
                                            ItemRender: ItemRender,
                                        }}
                                        className="table"
                                        style={{ overflowX: "auto" }}
                                        columns={columns_ma_contract}
                                        dataSource={maContractByPurchase}
                                        rowKey={(record) => record.ma_code}
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
                                                <div>{t('contract.contract_info')}</div>
                                                <Add onClick={() => handleAddMAContract(company.company_code, currentPurchase.purchase_code)} />
                                            </div>
                                        }
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: (event) => {
                                                    setSelectedContractRowKeys([record.ma_code]);
                                                    handleModifyMAContract(record.ma_code);
                                                }, // click row
                                            };
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            {addNewItem &&
                <div className="row">
                    <div className="card mb-0">
                        <>
                            <div style={{ fontSize: 15, fontWeight: 600, padding: '0.5rem 0 0 1.0rem' }}>{t('purchase.add_purchase')}</div>
                            <Space
                                align="start"
                                direction="horizontal"
                                size="small"
                                style={{ display: 'flex', marginBottom: '0.5rem', margineTop: '0.5rem' }}
                                wrap
                            >
                                {
                                    add_purchase_items.map((item, index) =>
                                        <DetailCardItem
                                            key={index}
                                            title={t(item.title)}
                                            defaultValue={null}
                                            name={item.key}
                                            edited={editedNewValues}
                                            detail={item.detail}
                                        />
                                    )}
                            </Space>
                            <div style={{ marginBottom: '0.5rem', display: 'flex' }}>
                                <DetailCardItem
                                    title={t('common.memo')}
                                    defaultValue=''
                                    name="purchase_memo"
                                    edited={editedNewValues}
                                    detail={{ type: 'textarea', extra: 'memo', row_no: 3, editing:handleNewItemChange }}
                                />
                                <div style={{ width: 380, display: 'flex', flexDirection: 'column', flewGrow: 0, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Button
                                        type="primary"
                                        style={{ width: '120px' }}
                                        onClick={() => handleSaveNewItemChange('purchase_code')}
                                    >
                                        {t('common.add')}
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={{ width: '120px' }}
                                        onClick={handleCancelNewItemChange}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            }
            <DetailSubModal
                title={subModalSetting.title}
                open={isSubModalOpen}
                item={subModalItems}
                original={orgSubModalValues}
                edited={editedSubModalValues}
                handleEdited={handleSubModalItemChange}
                handleOk={handleSubModalOk}
                handleCancel={handleSubModalCancel}
            />
        </>
    )
};

export default CompanyPurchaseModel;
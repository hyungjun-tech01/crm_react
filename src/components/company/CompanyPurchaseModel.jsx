import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Button, Space, Switch, Table } from "antd";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { ConverTextAmount, formatDate } from "../../constants/functions";
import { Add } from "@mui/icons-material";

import {
    atomCurrentPurchase,
    defaultPurchase,
    atomCompanyMAContracts,
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
    const { company, purchases } = props;
    const productClassState = useRecoilValue(atomProductClassListState);
    const productState = useRecoilValue(atomProductsState);
    const currentPurchase = useRecoilValue(atomCurrentPurchase);
    const { modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);
    const companyMAContracts = useRecoilValue(atomCompanyMAContracts);
    const { modifyMAContract } = useRecoilValue(MAContractRepo);

    const allProductClassList = useRecoilValue(atomProductClassList);
    const { loadAllProductClassList } = useRecoilValue(ProductClassListRepo);
    const allProducts = useRecoilValue(atomAllProducts);
    const { loadAllProducts } = useRecoilValue(ProductRepo);
    const [ productOptions, setProductOptions ] = useRecoilState(atomProductOptions);

    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    const { t } = useTranslation();

    const [ isSubModalOpen, setIsSubModalOpen ] = useState(false);
    const [subModalSetting, setSubModalSetting] = useState({ title: '' })

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
                product_class: value.value.product_class,
            };
            setEditedOtherSelectValues(tempOtherSelect);

            const tempNew = {
                ...editedOtherValues,
                product_name: value.value.product_name,
                product_class: value.value.product_class,
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
                    if (modifyPurchase(tempSubValues)) {
                        console.log(`Succeeded to modify purchase`);
                        const modfiedPurchase = {
                            ...currentPurchase,
                            ...editedOtherValues,
                        };
                        const foundIdx = purchaseByCompany.findIndex(item => item.purchase_code === currentPurchase.purchase_code);
                        if (foundIdx !== -1) {
                            const updatedPurchases = [
                                ...purchaseByCompany.slice(0, foundIdx),
                                modfiedPurchase,
                                ...purchaseByCompany.slice(foundIdx + 1,),
                            ];
                            setPurchaseByCompany(updatedPurchases);
                        } else {
                            console.error("handleOtherItemChangeSave / Purchase : Impossible case!!!");
                        };
                        setCurrentPurchase();
                        setSelectedPurchaseRowKeys([]);
                        setIsOtherItemSelected(false);
                    } else {
                        console.error('Failed to modify company')
                    };
                    break;
                default:
                    console.log("handleOtherItemChangeSave / Impossible case!!!");
                    break;
            };

            setEditedOtherValues(null);
            setOrgTimeOther(null);
        }
    }, [cookies.myLationCrmUserId, currentPurchase, editedOtherValues, modifyPurchase, setCurrentPurchase]);


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
                product_class: value.value.product_class,
            };
            setEditedNewSelectValues(tempNewSelect);

            const tempNew = {
                ...editedNewValues,
                product_name: value.value.product_name,
                product_class: value.value.product_class,
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
                    if (modifyPurchase(tempSubValues)) {
                        console.log(`Succeeded to add purchase`);

                    } else {
                        console.error('Failed to add company')
                    };
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
    const [maContractByPurchase, setMaContractByPurchase] = useState([]);

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
            product_class: purchase.product_class,
        });

        // Set data to edit selected purchase ----------------------
        const contractPurchase = companyMAContracts.filter(item => item.purchase_code === purchase.purchase_code);
        setMaContractByPurchase(contractPurchase);
    }, [companyMAContracts, setCurrentPurchase]);

    const add_purchase_items = [
        ['product_name', 'purchase.product_name',
            {
                type: 'select', group: 'product_class', options: productOptions, value: editedNewSelectValues,
                selectChange: (value) => handleNewItemSelectChange('product_name', value)
            }],
        ['product_type', 'purchase.product_type',
            {
                type: 'select', options: ProductTypeOptions,
                selectChange: (value) => handleNewItemSelectChange('product_type', value)
            }],
        ['serial_number', 'purchase.serial', { type: 'label' }],
        ['licence_info', 'purchase.licence_info', { type: 'label' }],
        ['module', 'purchase.module', { type: 'label' }],
        ['quantity', 'common.quantity', { type: 'label' }],
        ['receipt_date', 'purchase.receipt_date',
            { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],
        ['delivery_date', 'purchase.delivery_date',
            { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],
        ['hq_finish_date', 'purchase.hq_finish_date',
            { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],
        ['ma_finish_date', 'purchase.ma_finish_date',
            { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],
    ];

    const modify_purchase_items = [
        ['product_name', 'purchase.product_name',
            {
                type: 'select', group: 'product_class', options: productOptions, value: editedOtherSelectValues,
                selectChange: (value) => handleOtherItemSelectChange('product_name', value)
            }],
        ['product_type', 'purchase.product_type',
            {
                type: 'select', options: ProductTypeOptions,
                selectChange: (value) => handleOtherItemSelectChange('product_type', value)
            }],
        ['serial_number', 'purchase.serial', { type: 'label' }],
        ['licence_info', 'purchase.licence_info', { type: 'label' }],
        ['module', 'purchase.module', { type: 'label' }],
        ['quantity', 'common.quantity', { type: 'label' }],
        ['receipt_date', 'purchase.receipt_date',
            { type: 'date', orgTimeData: orgTimeOther, timeDateChange: handleOtherItemTimeChange }],
        ['delivery_date', 'purchase.delivery_date',
            { type: 'date', orgTimeData: orgTimeOther, timeDateChange: handleOtherItemTimeChange }],
        ['hq_finish_date', 'purchase.hq_finish_date', { type: 'date', orgTimeData: orgTimeOther, disabled: true }],
        ['ma_finish_date', 'purchase.ma_finish_date', { type: 'date', orgTimeData: orgTimeOther, disabled: true }],
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
            title: t('purchase.serial'),
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
            } else {
                console.error('Failed to add/modify ma contract');
            }
        });

        setSelectedContractRowKeys([]);
        setIsSubModalOpen(false);
    }, [orgSubModalValues, editedSubModalValues, modifyMAContract, maContractByPurchase]);

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
        setSubModalSetting({ title: t('contract.add_contract') })
        setIsSubModalOpen(true);
    }, [cookies.myLationCrmUserId]);

    const handleModifyMAContract = useCallback((code) => {
        setEditedSubModalValues(null);
        const foundMAContract = maContractByPurchase.filter(item => item.guid === code);
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
            setSubModalSetting({ title: t('contract.add_contract') })
            setIsSubModalOpen(true);
        } else {
            console.error("Impossible Case~");
        };
    }, [maContractByPurchase]);

    const columns_ma_contract = [
        {
            title: t('contract.contract_date'),
            dataIndex: 'ma_contract_date',
            render: (text, record) => <>{formatDate(record.ma_contract_date)}</>,
        },
        {
            title: t('contract.end_date'),
            dataIndex: "ma_finish_date",
            render: (text, record) => <>{formatDate(record.ma_finish_date)}</>,
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
                handleModifyMAContract(selectedValue.guid);
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
        console.log('[CompanyDetailModel] useEffect / Production');
        if ((productClassState & 1) === 0) {
            console.log('CompanyDetailsModel / loadAllProductClassList');
            loadAllProductClassList();
        };
        if ((productState & 1) === 0) {
            console.log('CompanyDetailsModel / loadAllProducts');
            loadAllProducts();
        };
        if (((productClassState & 1) === 1) && ((productState & 1) === 1) && (productOptions.length === 0)) {
            console.log("Check Product Options\n - ", productOptions);
            const productOptionsValue = allProductClassList.map(proClass => {
                const foundProducts = allProducts.filter(product => product.product_class === proClass.product_class_name);
                const subOptions = foundProducts.map(item => {
                    return {
                        label: <span>{item.product_name}</span>,
                        value: { product_code: item.product_code, product_name: item.product_name, product_class: item.product_class }
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
            <div className="row"> ``
                <div className="card mb-0">
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
                        <div className="card mb-0">
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
                                            defaultText={currentPurchase[item.at(0)]}
                                            edited={editedOtherValues}
                                            name={item.at(0)}
                                            title={t(item.at(1))}
                                            detail={item.at(2)}
                                            disabled={item.at(2).disabled ? item.at(2).disabled : false}
                                            editing={handleOtherItemChange}
                                        />
                                    )}
                                </Space>
                                <div style={{ marginBottom: '0.5rem', display: 'flex' }}>
                                    <DetailCardItem
                                        defaultText={currentPurchase["purchase_memo"]}
                                        edited={editedOtherValues}
                                        name="purchase_memo"
                                        title={t('common.memo')}
                                        detail={{ type: 'textarea', extra: 'memo', row_no: 3 }}
                                        editing={handleOtherItemChange}
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
                        <div className="card mb-0">
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
                                        rowKey={(record) => record.guid}
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
                                                    setSelectedContractRowKeys([record.guid]);
                                                    handleModifyMAContract(record.guid);
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
                                            defaultText=''
                                            edited={editedNewValues}
                                            name={item.at(0)}
                                            title={t(item.at(1))}
                                            detail={item.at(2)}
                                            disabled={item.at(2).disabled ? item.at(2).disabled : false}
                                            editing={handleNewItemChange}
                                        />
                                    )}
                            </Space>
                            <div style={{ marginBottom: '0.5rem', display: 'flex' }}>
                                <DetailCardItem
                                    defaultText=''
                                    edited={editedNewValues}
                                    name="purchase_memo"
                                    title={t('common.memo')}
                                    detail={{ type: 'textarea', extra: 'memo', row_no: 3 }}
                                    editing={handleNewItemChange}
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
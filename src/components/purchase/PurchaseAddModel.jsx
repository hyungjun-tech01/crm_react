import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { Table } from 'antd';
import { ItemRender, ShowTotal } from "../paginationfunction";

import {
    atomCompanyForSelection,
    atomCompanyState,
    defaultPurchase,
    atomCurrentPurchase,
    atomProductClassList,
    atomProductClassListState,
    atomAllProducts,
    atomProductsState,
    atomProductOptions,
    atomMAContractSet,
    defaultMAContract,
} from '../../atoms/atoms';
import { CompanyRepo } from '../../repository/company';
import { PurchaseRepo } from '../../repository/purchase';
import { MAContractRepo, ContractTypes } from "../../repository/ma_contract";
import { ProductClassListRepo, ProductRepo, ProductTypeOptions } from '../../repository/product';

import AddBasicItem from "../../constants/AddBasicItem";
import DetailSubModal from '../../constants/DetailSubModal';
import { ConvertCurrency, formatDate } from '../../constants/functions';
import { Add } from "@mui/icons-material";


const PurchaseAddModel = (props) => {
    const { init, handleInit } = props;
    const { t } = useTranslation();
    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);


    //===== [RecoilState] Related with Company =============================================
    const companyState = useRecoilValue(atomCompanyState);
    const companyForSelection = useRecoilValue(atomCompanyForSelection);
    const { loadAllCompanies } = useRecoilValue(CompanyRepo);


    //===== [RecoilState] Related with Purcahse ============================================
    const currentPurchase = useRecoilValue(atomCurrentPurchase);
    const { modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);


    //===== [RecoilState] Related with Product =============================================
    const productClassState = useRecoilValue(atomProductClassListState);
    const allProductClassList = useRecoilValue(atomProductClassList);
    const { loadAllProductClassList } = useRecoilValue(ProductClassListRepo);
    const productState = useRecoilValue(atomProductsState);
    const allProducts = useRecoilValue(atomAllProducts);
    const { loadAllProducts } = useRecoilValue(ProductRepo);
    const [productOptions, setProductOptions] = useRecoilState(atomProductOptions);


    //===== [RecoilState] Related with MA Contract =========================================
    const { modifyMAContract, setCurrentMAContract } = useRecoilValue(MAContractRepo);


    //===== Handles to edit 'Purchase Add' =================================================
    const [ addChange, setAddChange ] = useState({});
    const [ companyData, setCompanyData ] = useState({ company_name: '', company_code: '' });
    const [ needInit, setNeedInit ] = useState(false);
    
    const initializeAddTemplate = useCallback(() => {
        setCurrentPurchase();   // initialize current purchase
        setAddChange({
            ...defaultPurchase,
            company_name: null,
        });
        setNeedInit(false);
        document.querySelector("#add_new_purchase_form").reset();
    }, [setCurrentPurchase]);

    const handleAddChange = useCallback((e) => {
        const modifiedData = {
            ...addChange,
            [e.target.name]: e.target.value,
        };
        setAddChange(modifiedData);
    }, [addChange]);

    const handleAddSelectChange = useCallback((name, selected) => {
        let modifiedData = null;
        if (name === 'company_name') {
            const tempCompany = {
                company_code: selected.value.company_code,
                company_name: selected.value.company_name,
            };
            setCompanyData(tempCompany);

            modifiedData = {
                ...addChange,
                // company_name: selected.value.company_name,
                company_code: selected.value.company_code,
            };
        }
        else if (name === 'product_name') {
            modifiedData = {
                ...addChange,
                product_name: selected.value.product_name,
                product_class_name: selected.value.product_class_name,
                product_code: selected.value.product_code,
            };
        } else if (name === 'product_type') {
            modifiedData = {
                ...addChange,
                product_type: selected.value,
            };
        };
        setAddChange(modifiedData);
    }, [addChange]);

    const handleAddDateChange = useCallback((name, date) => {
        const modifiedData = {
            ...addChange,
            [name]: date,
        };
        setAddChange(modifiedData);
    }, [addChange]);

    const handleAddNewPurchase = useCallback((event) => {
        // Check data if they are available
        if (addChange.company_code === null
            || addChange.product_code === null) {
            console.log("Necessary inputs must be available!");
            return;
        };
        const newPurchaseData = {
            ...addChange,
            action_type: 'ADD',
            modify_user: cookies.myLationCrmUserId,
        };

        console.log(`[ handleAddNewPurchase ]`, newPurchaseData);
        const res_data = modifyPurchase(newPurchaseData);
        res_data.then((res) => {
            if(res.result) {
                setCurrentPurchase(res.code);
                setNeedInit(true);
            } else {
                console.log('[PurchaseAddModel] fail to add purchase');
            }
        });
    }, [addChange, cookies.myLationCrmUserId, modifyPurchase, setCurrentPurchase]);


    //===== Handles to edit 'MA contract' =================================================
    const [ isSubModalOpen, setIsSubModalOpen ] = useState(false);
    const [ subModalSetting, setSubModalSetting ] = useState({ title: '' })
    const [ contractLists, setContractLists ] = useState([]);
    const [ selectedMAContractRowKeys, setSelectedMAContractRowKeys ] = useState([]);
    const [ orgSubModalValues, setOrgSubModalValues ] = useState({});
    const [ editedSubModalValues, setEditedSubModalValues ] = useState({});
    
    const columns_ma_contract = [
        {
            title: t('contract.contract_date'),
            dataIndex: "ma_contract_date",
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
            render: (text, record) => <>{ConvertCurrency(record.ma_price)}</>,
        },
        {
            title: t('common.memo'),
            dataIndex: "ma_memo",
            render: (text, record) => <>{text}</>,
        },
    ];

    const maContractRowSelection = {
        selectedRowKeys: selectedMAContractRowKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedMAContractRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected purchase ----------------------
                const selectedValue = selectedRows.at(0);
                setCurrentMAContract(selectedValue.ma_code);
            } else {
                setCurrentMAContract();
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
    };
    
    const ma_contract_items = [
        { name: 'ma_contract_date', title: t('contract.contract_date'), detail: { type: 'date' } },
        { name: 'ma_finish_date', title: t('contract.end_date'), detail: { type: 'date' } },
        { name: 'ma_contract_type', title: t('contract.contract_type'), detail: { type: 'select', options: ContractTypes } },
        { name: 'ma_price', title: t('common.price_1'), detail: { type: 'label' } },
        { name: 'ma_memo', title: t('common.memo'), detail: { type: 'textarea', row_no: 4 } },
    ];

    const handleSubModalOk = useCallback(() => {
        const finalData = {
            ...orgSubModalValues,
            ...editedSubModalValues,
        };
        if(!finalData.ma_finish_date) {
            console.error('[PurchaseAddModel] no end date!');
            return;
        };
        const resp = modifyMAContract(finalData);
        resp.then(result => {
            if (result) {
                const updatedContracts = contractLists.concat(result);
                console.log(`[ handleSubModalOk ] update contract list : `, updatedContracts);
                setContractLists(updatedContracts);

                // Update MA Contract end date
                if(currentPurchase.purchase_code
                    && (!currentPurchase.ma_finish_date || (new Date(currentPurchase.ma_finish_date) < finalData.ma_finish_date))){
                    const modifiedPurchase = {
                        ...currentPurchase,
                        ma_finish_date: finalData.ma_finish_date,
                        action_type: 'UPDATE',
                        modify_user: cookies.myLationCrmUserId,
                    };
                    const res_data = modifyPurchase(modifiedPurchase);
                    res_data.then(res => {
                        if(res.result){
                            console.log('Succeeded to update MA end date');
                            const updateAddChange = {
                                ...addChange,
                                ma_finish_date: finalData.ma_finish_date,
                            };
                            setAddChange(updateAddChange);
                        } else {
                            console.log('Fail to update MA end date');
                        };
                    });
                };
            } else {
                console.error('Failed to add/modify ma contract');
            }
        });

        setSelectedMAContractRowKeys([]);
        setIsSubModalOpen(false);
    }, [addChange, contractLists, cookies.myLationCrmUserId, currentPurchase, editedSubModalValues, modifyMAContract, modifyPurchase, orgSubModalValues]);

    const handleSubModalCancel = () => {
        setOrgSubModalValues(null);
        setSelectedMAContractRowKeys([]);
        setIsSubModalOpen(false);
    };

    const handleSubModalItemChange = useCallback(data => {
        setEditedSubModalValues(data);
    }, []);

    const handleAddMAContract = useCallback((company_code, purchase_code) => {
        setOrgSubModalValues({
            ...defaultMAContract,
            action_type: 'ADD',
            ma_company_code: company_code,
            purchase_code: purchase_code,
            modify_user: cookies.myLationCrmUserId,
        });
        setSubModalSetting({ title: t('contract.add_contract') });
        setIsSubModalOpen(true);
    }, [cookies.myLationCrmUserId, t]);

    const handleModifyMAContract = useCallback((code) => {
        setEditedSubModalValues(null);
        const foundMAContract = contractLists.filter(item => item.ma_code === code);
        if (foundMAContract.length > 0) {
            const selectedContract = foundMAContract[0];
            setOrgSubModalValues({
                ...selectedContract,
                ma_contract_date: new Date(selectedContract.ma_contract_date),
                ma_finish_date: new Date(selectedContract.ma_finish_date),
                action_type: 'UPDATE',
                modify_user: cookies.myLationCrmUserId,
            });
            setSubModalSetting({ title: t('contract.add_contract') });
            setIsSubModalOpen(true);
        } else {
            console.error("Impossible Case~");
        };
    }, [contractLists, cookies.myLationCrmUserId, t]);

    //===== useEffect functions ===========================================================
    useEffect(() => {
        if (init) {
            console.log('[PurchaseAddModel] initialize!');
            initializeAddTemplate();
            handleInit(!init);
        };
    }, [init, handleInit, initializeAddTemplate]);

    useEffect(() => {
        if ((companyState & 1) === 0 && (companyState & (1 << 1)) === 0) {
            loadAllCompanies();
        };
    }, [companyState, loadAllCompanies]);

    // ----- useEffect for Production -----------------------------------
    useEffect(() => {
        console.log('[PurchaseAddModel] useEffect / Production');
        if ((productClassState & 1) === 0) {
            console.log('[PurchaseAddModel] loadAllProductClassList');
            loadAllProductClassList();
        };
        if ((productState & 1) === 0) {
            console.log('[PurchaseAddModel] loadAllProducts');
            loadAllProducts();
        };
        if (((productClassState & 1) === 1) && ((productState & 1) === 1) && (productOptions.length === 0)) {
            console.log('[PurchaseAddModel] set companies for selection');
            const productOptionsValue = allProductClassList.map(proClass => {
                const foundProducts = allProducts.filter(product => product.product_class_name === proClass.product_class_name);
                const subOptions = foundProducts.map(item => {
                    return {
                        label: <span>{item.product_name}</span>,
                        value: { product_code: item.product_code,
                            product_name: item.product_name,
                            product_class_name: item.product_class_name,
                            detail_desc: item.detail_desc ,
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
        <div
            className="modal right fade"
            id="add_purchase"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            data-bs-focus="false"
        >
            <div className="modal-dialog" role="document">
                <button
                    type="button"
                    className="close md-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">×</span>
                </button>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title text-center"><b>{t('purchase.add_purchase')}</b></h4>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12">
                                <form id="add_new_purchase_form">
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.company_name')}
                                            type='select'
                                            name="company_name"
                                            defaultValue={companyData.company_name}
                                            required
                                            long
                                            options={companyForSelection}
                                            onChange={handleAddSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.product_name')}
                                            type='select'
                                            name="product_name"
                                            defaultValue={addChange.product_name}
                                            required
                                            options={productOptions}
                                            onChange={handleAddSelectChange}
                                        />
                                        <AddBasicItem
                                            title={t('purchase.product_type')}
                                            type='select'
                                            name="product_type"
                                            defaultValue={addChange.product_type}
                                            options={ProductTypeOptions}
                                            onChange={handleAddSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.serial_number')}
                                            type='text'
                                            name="serial_number"
                                            defaultValue={addChange.serial_number}
                                            onChange={handleAddChange}
                                        />
                                        <AddBasicItem
                                            title={t('purchase.licence_info')}
                                            type='text'
                                            name="licence_info"
                                            defaultValue={addChange.licence_info}
                                            onChange={handleAddChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.module')}
                                            type='text'
                                            name="module"
                                            defaultValue={addChange.module}
                                            onChange={handleAddChange}
                                        />
                                        <AddBasicItem
                                            title={t('common.quantity')}
                                            type='text'
                                            name="quantity"
                                            defaultValue={addChange.quantity}
                                            onChange={handleAddChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.receipt_date')}
                                            type='date'
                                            name="receipt_date"
                                            time={{ data: addChange.receipt_date }}
                                            onChange={handleAddDateChange}
                                        />
                                        <AddBasicItem
                                            title={t('purchase.delivery_date')}
                                            type='date'
                                            name="delivery_date"
                                            time={{ data: addChange.delivery_date }}
                                            onChange={handleAddDateChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.hq_finish_date')}
                                            type='date'
                                            name="hq_finish_date"
                                            time={{ data: addChange.hq_finish_date }}
                                            onChange={handleAddDateChange}
                                        />
                                        <AddBasicItem
                                            title={t('purchase.ma_finish_date')}
                                            type='date'
                                            name="ma_finish_date"
                                            time={{ data: addChange.ma_finish_date }}
                                            onChange={handleAddDateChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.po_number')}
                                            type='text'
                                            name="po_number"
                                            defaultValue={addChange.po_number}
                                            onChange={handleAddChange}
                                        />
                                        <AddBasicItem
                                            title={t('common.price_1')}
                                            type='text'
                                            name="price"
                                            defaultValue={addChange.price}
                                            onChange={handleAddChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.invoice_no')}
                                            type='text'
                                            name="invoiceno"
                                            defaultValue={addChange.invoiceno}
                                            onChange={handleAddChange}
                                        />
                                        <AddBasicItem
                                            title={t('common.status')}
                                            type='text'
                                            name="status"
                                            defaultValue={addChange.status}
                                            onChange={handleAddChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.memo')}
                                            type='textarea'
                                            name="purchase_memo"
                                            long
                                            defaultValue={addChange.purchase_memo}
                                            onChange={handleAddChange}
                                        />
                                    </div>
                                    <div className="text-center py-3">
                                        { needInit ? 
                                            <button
                                                type="button"
                                                className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                                                onClick={initializeAddTemplate}
                                            >
                                                {t('common.initialize')}
                                                </button>
                                            :
                                            <button
                                                type="button"
                                                className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                                                onClick={handleAddNewPurchase}
                                            >
                                                {t('common.save')}
                                            </button>
                                        }
                                        &nbsp;&nbsp;
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-rounded"
                                            data-bs-dismiss="modal"
                                        >
                                            {t('common.cancel')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        { (currentPurchase.purchase_code) &&
                            <div className="row">
                                <div className="card mb-0">
                                    <div className="table-body">
                                        <div className="table-responsive">
                                            <Table
                                                rowSelection={maContractRowSelection}
                                                pagination={{
                                                    total: contractLists.length,
                                                    showTotal: ShowTotal,
                                                    showSizeChanger: true,
                                                    ItemRender: ItemRender,
                                                }}
                                                className="table"
                                                style={{ overflowX: "auto" }}
                                                columns={columns_ma_contract}
                                                dataSource={contractLists}
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
                                                        <Add onClick={() => handleAddMAContract(currentPurchase.company_code, currentPurchase.purchase_code)} />
                                                    </div>
                                                }
                                                onRow={(record, rowIndex) => {
                                                    return {
                                                        onClick: (event) => {
                                                            setSelectedMAContractRowKeys([record.ma_code]);
                                                            handleModifyMAContract(record.ma_code);
                                                        }, // click row
                                                    };
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <DetailSubModal
                title={subModalSetting.title}
                open={isSubModalOpen}
                item={ma_contract_items}
                original={orgSubModalValues}
                edited={editedSubModalValues}
                handleEdited={handleSubModalItemChange}
                handleOk={handleSubModalOk}
                handleCancel={handleSubModalCancel}
            />
        </div>
    );
};

export default PurchaseAddModel;
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { Table } from 'antd';
import { ItemRender, ShowTotal } from "../paginationfunction";
import * as bootstrap from "../../assets/js/bootstrap.bundle";
import {
    atomCurrentPurchase,
    defaultMAContract,
    atomCurrentCompany,
    atomSelectedCategory,
    defaultCompany,
    defaultPurchase,
    atomCurrentLead,
} from '../../atoms/atoms';
import { PurchaseRepo } from '../../repository/purchase';
import { ProductTypeOptions } from '../../repository/product';
import { MAContractRepo, ContractTypes } from "../../repository/ma_contract";

import { ConvertCurrency, formatDate } from '../../constants/functions';
import { Add } from "@mui/icons-material";

import AddBasicItem from "../../constants/AddBasicItem";
import AddSearchItem from '../../constants/AddSearchItem';
import AddSearchProduct from '../../constants/AddSearchProduct';
import DetailSubModal from '../../constants/DetailSubModal';
import MessageModal from "../../constants/MessageModal";


const PurchaseAddModel = (props) => {
    const { init, handleInit } = props;
    const { t } = useTranslation();
    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState({ title: "", message: "" });
    

    //===== [RecoilState] Related with Company =============================================
    const currentCompany = useRecoilValue(atomCurrentCompany);


    //===== [RecoilState] Related with Company =============================================
    const currentLead = useRecoilValue(atomCurrentLead);


    //===== [RecoilState] Related with Purcahse ============================================
    const currentPurchase = useRecoilValue(atomCurrentPurchase);
    const { modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);


    //===== [RecoilState] Related with MA Contract =========================================
    const { modifyMAContract, setCurrentMAContract } = useRecoilValue(MAContractRepo);


    //===== Handles to edit 'Purchase Add' =================================================
    const [purchaseChange, setPurchaseChange] = useState({});
    const [companyData, setCompanyData] = useState({ company_name: '', company_code: '' });
    const [needInit, setNeedInit] = useState(false);
    const selectedCategory = useRecoilValue(atomSelectedCategory);

    const initializePurchaseTemplate = useCallback(() => {
        document.querySelector("#add_new_purchase_form").reset();

        if((currentCompany !== defaultCompany)
            && (
                ((selectedCategory.category === 'company') && (selectedCategory.item_code === currentCompany.company_code))
                || ((selectedCategory.category === 'lead') && (selectedCategory.item_code === currentLead.lead_code))
            )
        ){
            setPurchaseChange({
                ...defaultPurchase,
                company_code: currentCompany.company_code,
            });
            setCompanyData({
                company_code: currentCompany.company_code,
                company_name: currentCompany.company_name,
            });
        } else {
            setPurchaseChange({...defaultPurchase});
        }
        setNeedInit(false);
    }, [currentCompany, selectedCategory]);

    const handleItemChange = useCallback((e) => {
        const modifiedData = {
            ...purchaseChange,
            [e.target.name]: e.target.value,
        };
        setPurchaseChange(modifiedData);
    }, [purchaseChange]);

    const handleSelectChange = useCallback((name, selected) => {
        let modifiedData = null;
        if (name === 'company_name') {
            const tempCompany = {
                company_code: selected.value.company_code,
                company_name: selected.value.company_name,
            };
            setCompanyData(tempCompany);

            modifiedData = {
                ...purchaseChange,
                // company_name: selected.value.company_name,
                company_code: selected.value.company_code,
            };
        }
        else if (name === 'product_name') {
            modifiedData = {
                ...purchaseChange,
                product_name: selected.value.product_name,
                product_class_name: selected.value.product_class_name,
                product_code: selected.value.product_code,
            };
        } else if (name === 'product_type') {
            modifiedData = {
                ...purchaseChange,
                product_type: selected.value,
            };
        };
        setPurchaseChange(modifiedData);
    }, [purchaseChange]);

    const handleDateChange = useCallback((name, date) => {
        const modifiedData = {
            ...purchaseChange,
            [name]: date,
        };
        setPurchaseChange(modifiedData);
    }, [purchaseChange]);

    const handleAddNewPurchase = useCallback((event) => {
        // Check data if they are available
        if (purchaseChange.company_code === null
            || purchaseChange.product_code === null) {
            console.log("Necessary inputs must be available!");
            return;
        };
        const newPurchaseData = {
            ...purchaseChange,
            action_type: 'ADD',
            modify_user: cookies.myLationCrmUserId,
        };

        const res_data = modifyPurchase(newPurchaseData);
        res_data.then((res) => {
            if (res.result) {
                setCurrentPurchase(res.code);
                setNeedInit(true);
                let thisModal = bootstrap.Modal.getInstance('#add_purchase');
                if(thisModal) thisModal.hide();
            } else {
                console.log('[PurchaseAddModel] fail to add purchase :', res.data);
            }
        });
    }, [purchaseChange, cookies.myLationCrmUserId, modifyPurchase, setCurrentPurchase]);


    //===== Handles to edit 'MA contract' =================================================
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [subModalSetting, setSubModalSetting] = useState({ title: '' })
    const [contractLists, setContractLists] = useState([]);
    const [selectedMAContractRowKeys, setSelectedMAContractRowKeys] = useState([]);
    const [orgSubModalValues, setOrgSubModalValues] = useState({});
    const [editedSubModalValues, setEditedSubModalValues] = useState({});

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
        if (!finalData.ma_finish_date) {
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
                if (currentPurchase.purchase_code
                    && (!currentPurchase.ma_finish_date || (new Date(currentPurchase.ma_finish_date) < finalData.ma_finish_date))) {
                    const modifiedPurchase = {
                        ...currentPurchase,
                        ma_finish_date: finalData.ma_finish_date,
                        action_type: 'UPDATE',
                        modify_user: cookies.myLationCrmUserId,
                    };
                    const res_data = modifyPurchase(modifiedPurchase);
                    res_data.then(res => {
                        if (res.result) {
                            console.log('Succeeded to update MA end date');
                            const updateAddChange = {
                                ...purchaseChange,
                                ma_finish_date: finalData.ma_finish_date,
                            };
                            setPurchaseChange(updateAddChange);
                        } else {
                            console.log('Fail to update MA end date : ', res.data);
                        };
                    });
                };
            } else {
                console.error('Failed to add/modify ma contract');
            }
        });

        setSelectedMAContractRowKeys([]);
        setIsSubModalOpen(false);
    }, [purchaseChange, contractLists, cookies.myLationCrmUserId, currentPurchase, editedSubModalValues, modifyMAContract, modifyPurchase, orgSubModalValues]);

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
        if (init){
            console.log('[PurchaseAddModel] initialize!');
            if(handleInit) handleInit(!init);
            setTimeout(()=>{
                initializePurchaseTemplate();
            }, 500);
        };
    }, [init, handleInit, initializePurchaseTemplate]);

    if (init)
        return <div>&nbsp;</div>;

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
                                        <AddSearchItem
                                            title={t('company.company_name')}
                                            category='purchase'
                                            name='company_name'
                                            defaultValue={companyData.company_name}
                                            required
                                            long
                                            edited={companyData}
                                            setEdited={setCompanyData}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddSearchProduct
                                            title={t('purchase.product_name')}
                                            name="product_name"
                                            required
                                            edited={purchaseChange}
                                            setEdited={setPurchaseChange}
                                        />
                                        <AddBasicItem
                                            title={t('purchase.product_type')}
                                            type='select'
                                            name="product_type"
                                            defaultValue={purchaseChange.product_type}
                                            options={ProductTypeOptions}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.serial_number')}
                                            type='text'
                                            name="serial_number"
                                            defaultValue={purchaseChange.serial_number}
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('purchase.licence_info')}
                                            type='text'
                                            name="licence_info"
                                            defaultValue={purchaseChange.licence_info}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.module')}
                                            type='text'
                                            name="module"
                                            defaultValue={purchaseChange.module}
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('common.quantity')}
                                            type='text'
                                            name="quantity"
                                            defaultValue={purchaseChange.quantity}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.receipt_date')}
                                            type='date'
                                            name="receipt_date"
                                            defaultValue={purchaseChange.receipt_date}
                                            onChange={handleDateChange}
                                        />
                                        <AddBasicItem
                                            title={t('purchase.delivery_date')}
                                            type='date'
                                            name="delivery_date"
                                            defaultValue={purchaseChange.delivery_date}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.hq_finish_date')}
                                            type='date'
                                            name="hq_finish_date"
                                            defaultValue={purchaseChange.hq_finish_date}
                                            onChange={handleDateChange}
                                        />
                                        <AddBasicItem
                                            title={t('purchase.ma_finish_date')}
                                            type='date'
                                            name="ma_finish_date"
                                            defaultValue={purchaseChange.ma_finish_date}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.po_number')}
                                            type='text'
                                            name="po_number"
                                            defaultValue={purchaseChange.po_number}
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('common.price_1')}
                                            type='text'
                                            name="price"
                                            defaultValue={purchaseChange.price}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('purchase.invoice_no')}
                                            type='text'
                                            name="invoice_number"
                                            defaultValue={purchaseChange.invoice_number}
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('common.status')}
                                            type='text'
                                            name="status"
                                            defaultValue={purchaseChange.status}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.memo')}
                                            type='textarea'
                                            name="purchase_memo"
                                            long
                                            defaultValue={purchaseChange.purchase_memo}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="text-center py-3">
                                        {needInit ?
                                            <button
                                                type="button"
                                                className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                                                onClick={initializePurchaseTemplate}
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
                        {(currentPurchase.purchase_code) &&
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
            <MessageModal
                title={message.title}
                message={message.message}
                open={isMessageModalOpen}
                handleOk={() => setIsMessageModalOpen(false)}
            />
        </div>
    );
};

export default PurchaseAddModel;
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { Table } from 'antd';
import { ItemRender, ShowTotal } from "../paginationfunction";
import {
    atomCurrentPurchase,
    defaultMAContract,
    atomCurrentCompany,
    defaultCompany,
    defaultPurchase,
    atomCurrentLead,
} from '../../atoms/atoms';
import { PurchaseRepo } from '../../repository/purchase';
import { ProductTypeOptions } from '../../repository/product';
import { MAContractRepo, ContractTypes } from "../../repository/ma_contract";
import { SettingsRepo } from '../../repository/settings';

import { ConvertCurrency, formatDate } from '../../constants/functions';
import { Add } from "@mui/icons-material";

import AddBasicItem from "../../constants/AddBasicItem";
import AddSearchItem from '../../constants/AddSearchItem';
import AddSearchProduct from '../../constants/AddSearchProduct';
import DetailSubModal from '../../constants/DetailSubModal';
import MessageModal from "../../constants/MessageModal";


const PurchaseAddModel = ({ init, handleInit }) => {
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


    //===== [RecoilState] Related with MA Contract =========================================
    const { openModal, closeModal } = useRecoilValue(SettingsRepo);


    //===== Handles to edit 'Purchase Add' =================================================
    const [purchaseChange, setPurchaseChange] = useState({});

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
            modifiedData = {
                ...purchaseChange,
                company_code: selected.value.company_code,
                company_name: selected.value.company_name,
                company_name_en: selected.value.company_name_en,
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


    //===== Handles to handle this ================================================= 
    const [needInit, setNeedInit] = useState(false);

    const handlePopupOpen = (open) => {
        if (open) {
            openModal('antModal');
        } else {
            closeModal();
        }
    };

    const handleOpenMessage = (msg) => {
        openModal('antModal');
        setMessage(msg);
        setIsMessageModalOpen(true);
    };

    const handleCloseMessage = () => {
        closeModal();
        setIsMessageModalOpen(false);
    };

    const handleAddNewPurchase = () => {
        // Check data if they are available
        let numberOfNoInputItems = 0;
        let noCompanyName = false;
        if (!purchaseChange.company_name || purchaseChange.company_name === "") {
            numberOfNoInputItems++;
            noCompanyName = true;
        };
        let noProductName = false;
        if (!purchaseChange.product_name || purchaseChange.product_name === "") {
            numberOfNoInputItems++;
            noProductName = true;
        };
        let noQuantity = false;
        if (!purchaseChange.quantity || purchaseChange.quantity === "") {
            numberOfNoInputItems++;
            noQuantity = true;
        };
        let noPrice = false;
        if (!purchaseChange.price || purchaseChange.price === "") {
            numberOfNoInputItems++;
            noPrice = true;
        };

        if (numberOfNoInputItems > 0) {
            const contents = (
                <>
                    <p>하기 정보는 필수 입력 사항입니다.</p>
                    {noCompanyName && <div> - 회사 이름</div>}
                    {noProductName && <div> - 제품 이름</div>}
                    {noQuantity && <div> - 제품 수량</div>}
                    {noPrice && <div> - 제품 가격</div>}
                </>
            );
            const tempMsg = {
                title: t('comment.title_check'),
                message: contents,
            };
            handleOpenMessage(tempMsg);
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
                handleClose();
            } else {
                const tempMsg = {
                    title: t('comment.title_error'),
                    message: `${t('comment.msg_fail_save')} - ${t('comment.reason')} : ${res.data}`,
                };
                handleOpenMessage(tempMsg);
            }
        });
    };

    const handleInitialize = useCallback(() => {
        // document.querySelector("#add_new_purchase_form").reset();

        if(currentCompany !== defaultCompany) {
            setPurchaseChange({
                ...defaultPurchase,
                company_code: currentCompany.company_code,
                company_name: currentCompany.company_name,
                company_name_en: currentCompany.company_name_en,
            });
        } else {
            setPurchaseChange({ ...defaultPurchase });
        }
        setNeedInit(false);
    }, [currentCompany]);

    const handleClose = () => {
        setTimeout(() => {
            closeModal();
        }, 250);
    };

    //===== useEffect functions ===========================================================
    useEffect(() => {
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
        
        if (init) {
            if (handleInit) handleInit(!init);
            setTimeout(() => {
                handleInitialize();
            }, 250);
        };
    }, [init, handleInit, handleInitialize]);

    if (init)
        return <div>&nbsp;</div>;

    return (
        <div
            className="modal right fade"
            id="add_purchase"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
        >
            <div className="modal-dialog" role="document">
                <button
                    type="button"
                    className="close md-close"
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
                            onClick={handleClose}
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
                                            defaultValue={purchaseChange.company_name}
                                            required
                                            long
                                            edited={purchaseChange}
                                            setEdited={setPurchaseChange}
                                            handleOpen={handlePopupOpen}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddSearchProduct
                                            title={t('purchase.product_name')}
                                            name="product_name"
                                            required
                                            edited={purchaseChange}
                                            setEdited={setPurchaseChange}
                                            handleOpen={handlePopupOpen}
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
                                            required
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
                                            required
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
                                                onClick={handleInitialize}
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
                                            onClick={handleClose}
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
                handleOk={handleCloseMessage}
            />
        </div>
    );
};

export default PurchaseAddModel;
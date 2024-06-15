import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';

import { atomCompanyForSelection,
    atomCompanyState,
    defaultPurchase,
    atomProductOptions,
} from '../../atoms/atoms';
import { CompanyRepo } from '../../repository/company';

import AddBasicItem from "../../constants/AddBasicItem";

const PurchaseAddModel = (props) => {
    const { init, handleInit } = props;
    const { t } = useTranslation();
    const [ cookies ] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);


    //===== [RecoilState] Related with Company =============================================
    const companyState = useRecoilValue(atomCompanyState);
    const { companyForSelection } = useRecoilValue(atomCompanyForSelection);
    const { loadAllCompanies } = useRecoilValue(CompanyRepo);


    //===== [RecoilState] Related with Company =============================================
    const { productsForSelection } = useRecoilValue(atomProductOptions);


    //===== Handles to edit 'Purchase Add' =================================================
    const [ addChange, setAddChange ] = useState({});

    const initializeAddTemplate = useCallback(() => {
        setAddChange({
            ...defaultPurchase,
            company_name: null,
        });
        document.querySelector("#add_new_purchase_form").reset();
    }, []);

    const handleAddChange = useCallback((e) => {
        const modifiedData = {
            ...addChange,
            [e.target.name]: e.target.value,
        };
        setAddChange(modifiedData);
    }, [addChange]);

    const handleAddSelectChange = useCallback((name, selected) => {
        let modifiedData = null;
        if(name === 'company_name') {
            modifiedData = {
                ...addChange,
                company_name: selected.value.company_name,
                company_code: selected.value.company_code,
            };
        } else {
            modifiedData = {
                ...addChange,
                [name]: selected.value,
            };
        };
        setAddChange(modifiedData);
    }, [addChange]);


    //===== useEffect functions ===========================================================
    useEffect(() => {
        if (init) {
            console.log('[PurchaseAddModel] initialize!');
            initializeAddTemplate();
            handleInit(!init);
        };
    }, [init, handleInit, initializeAddTemplate]);

    useEffect(() => {
        if ((companyState & 1) === 0) {
            console.log('[PurchaseAddModel] loading company data!');
            loadAllCompanies();
        };
    }, [companyState, loadAllCompanies]);

    return (
        <div
            className="modal right fade"
            id="add_lead"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
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
                                            defaultValue={addChange.company_name}
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
                                            options={productsForSelection}
                                            onChange={handleAddSelectChange}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseAddModel;
import React, { useCallback, useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { defaultCompany } from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { FiSearch } from "react-icons/fi";
import { formatDate } from '../../constants/functions';
import { option_locations, option_deal_type, option_industry_type } from "../../constants/constans";

import AddBasicItem from "../../constants/AddBasicItem";
import PopupPostCode from "../../constants/PostCode";

const PopupDom = ({ children }) => {
    const el = document.getElementById('popupDom');
    return ReactDom.createPortal(children, el);
};

const CompanyAddModel = (props) => {
    const { init, handleInit } = props;
    const { modifyCompany } = useRecoilValue(CompanyRepo);
    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    const { t } = useTranslation();
    const [companyChange, setCompanyChange] = useState(defaultCompany);
    const [establishDate, setEstablishDate] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const initializeCompanyTemplate = useCallback(() => {
        setCompanyChange(defaultCompany);
        setEstablishDate(null);
        setIsPopupOpen(false);
        document.querySelector("#add_new_company_form").reset();
    }, []);

    const handleCompanyChange = useCallback((e) => {
        let input_data = null;
        if (e.target.name === 'establishment_date') {
            const date_value = new Date(e.target.value);
            if (!isNaN(date_value.valueOf())) {
                input_data = formatDate(date_value);
            };
        } else {
            input_data = e.target.value;
        }
        const modifiedData = {
            ...companyChange,
            [e.target.name]: input_data,
        };
        setCompanyChange(modifiedData);
    }, [companyChange]);

    const handleAddNewCompany = useCallback((event) => {
        // Check data if they are available
        if (companyChange.company_name === null
            || companyChange.company_name === '') {
            console.log("Company Name must be available!");
            return;
        };

        const newComData = {
            ...companyChange,
            action_type: 'ADD',
            company_number: '99999',// Temporary
            counter: 0,
            modify_user: cookies.myLationCrmUserId,
        };
        console.log(`[ handleAddNewCompany ]`, newComData);
        const result = modifyCompany(newComData);
        if (result) {
            initializeCompanyTemplate();
            //close modal ?
        };
    }, [companyChange, cookies.myLationCrmUserId, initializeCompanyTemplate, modifyCompany]);

    const handleSelectChange = useCallback((name, selected) => {
        const modifiedData = {
            ...companyChange,
            [name]: selected.value,
        };
        setCompanyChange(modifiedData);
    }, [companyChange]);

    const handleEstablishDateChange = useCallback((date) => {
        setEstablishDate(date);
        const modifiedData = {
            ...companyChange,
            establishment_date: date,
        };
        setCompanyChange(modifiedData);
    }, [companyChange]);

    const handleSetAddress = useCallback((address) => {
        const modifiedData = {
            ...companyChange,
            company_address: address,
        };
        setCompanyChange(modifiedData);
        document.getElementById('company_input_address').value = address;
    }, [companyChange]);

    const handleSetZipCode = useCallback((zip_code) => {
        const modifiedData = {
            ...companyChange,
            company_zip_code: zip_code,
        };
        setCompanyChange(modifiedData);
    }, [companyChange]);

    useEffect(() => {
        console.log('CompanyAddModel called!');
        if(init) {
            initializeCompanyTemplate();
            handleInit(!init);
        }
    }, [handleInit, init, initializeCompanyTemplate]);

    return (
        <div
            className="modal right fade"
            id="add_company"
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
                        <h4 className="modal-title text-center"><b>{t('company.new_company')}</b></h4>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12">
                                <form id="add_new_company_form">
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="company_name"
                                            required
                                            title={t('company.company_name')}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="company_name_eng"
                                            title={t('company.eng_company_name')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="ceo_name"
                                            title={t('company.ceo_name')}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="business_registration_code"
                                            title={t('company.business_registration_code')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6" >
                                            <div className="add-basic-item">
                                                <div className="add-basic-title" >
                                                    {t('company.address')}
                                                </div>
                                                <input
                                                    className="add-basic-content"
                                                    id="company_input_address"
                                                    type="text"
                                                    placeholder={t('company.address')}
                                                    onChange={handleCompanyChange}
                                                />
                                                <div className="add-basic-btn" onClick={() => setIsPopupOpen(!isPopupOpen)}>
                                                    <FiSearch />
                                                </div>
                                                <div id="popupDom">
                                                    {isPopupOpen && (
                                                        <PopupDom>
                                                            <PopupPostCode
                                                                onSetAddress={handleSetAddress}
                                                                onSetPostCode={handleSetZipCode}
                                                                onClose={() => setIsPopupOpen(false)}
                                                            />
                                                        </PopupDom>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <AddBasicItem
                                            type='text'
                                            name="company_phone_number"
                                            title={t('company.phone_number')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6" >
                                            <div className="add-basic-item">
                                                <div className="add-basic-title" >
                                                    {t('company.zip_code')}
                                                </div>
                                                <label
                                                    className="add-basic-content label"
                                                >
                                                    {companyChange.company_zip_code
                                                        ? companyChange.company_zip_code
                                                        : t('comment.search_address_first')}
                                                </label>
                                            </div>
                                        </div>
                                        <AddBasicItem
                                            type='text'
                                            name="company_fax_number"
                                            title={t('company.fax_number')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="homepage"
                                            title={t('company.homepage')}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="company_scale"
                                            title={t('company.company_scale')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='select'
                                            options={option_deal_type.ko}
                                            title={t('company.deal_type')}
                                            onChange={(selected) => handleSelectChange('deal_type', selected)}
                                        />
                                        <AddBasicItem
                                            type='select'
                                            options={option_industry_type.ko}
                                            title={t('company.industry_type')}
                                            onChange={(selected) => handleSelectChange('industry_type', selected)}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="business_type"
                                            title={t('company.business_type')}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="business_item"
                                            title={t('company.business_item')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='date'
                                            name="establishment_date"
                                            title={t('company.establishment_date')}
                                            time={{ data: establishDate }}
                                            onChange={handleEstablishDateChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="account_code"
                                            title={t('company.account_code')}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="bank_name"
                                            title={t('company.bank_name')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="account_owner"
                                            title={t('company.account_owner')}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="sales_resource"
                                            title={t('company.salesman')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="application_engineer"
                                            title={t('company.engineer')}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            type='select'
                                            options={option_locations.ko}
                                            title={t('common.location')}
                                            onChange={(selected) => handleSelectChange('region', selected)}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='textarea'
                                            long
                                            row_no={3}
                                            name="memo"
                                            title={t('common.memo')}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="text-center py-3">
                                        <button
                                            type="button"
                                            className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                                            onClick={handleAddNewCompany}
                                        >
                                            {t('common.save')}
                                        </button>
                                        &nbsp;&nbsp;
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-rounded"
                                            data-bs-dismiss="modal"
                                            onClick={initializeCompanyTemplate}
                                        >
                                            {t('common.cancel')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* modal-content */}
            </div>
            {/* modal-dialog */}
        </div>
    )
};

export default CompanyAddModel;
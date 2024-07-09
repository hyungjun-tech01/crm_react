import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { defaultCompany } from "../../atoms/atoms";
import { atomUserState, atomEngineersForSelection, atomSalespersonsForSelection } from '../../atoms/atomsUser';
import { CompanyRepo } from "../../repository/company";
import { UserRepo } from '../../repository/user';
import { formatDate } from '../../constants/functions';
import { option_locations, option_deal_type, option_industry_type } from "../../constants/constants";

import AddBasicItem from "../../constants/AddBasicItem";
import AddAddressItem from '../../constants/AddAddressItem';


const CompanyAddModel = (props) => {
    const { init, handleInit } = props;
    const { modifyCompany } = useRecoilValue(CompanyRepo);
    const [userState, setUserState] = useRecoilState(atomUserState);
    const engineersForSelection = useRecoilValue(atomEngineersForSelection);
    const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);
    const { loadAllUsers } = useRecoilValue(UserRepo)
    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    const { t } = useTranslation();
    const [companyChange, setCompanyChange] = useState(defaultCompany);
    const [establishDate, setEstablishDate] = useState(null);

    const initializeCompanyTemplate = useCallback(() => {
        setCompanyChange(defaultCompany);
        setEstablishDate(null);
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

    useEffect(() => {
        console.log('[CompanyAddModel] called!');
        if(init) {
            initializeCompanyTemplate();
            handleInit(!init);
        }
    }, [handleInit, init, initializeCompanyTemplate]);

    useEffect(() => {
        console.log('[CompanyAddModel] loading user data!');
        if ((userState & 3) === 0) {
            const tempUserState = userState | (1 << 1); //change it to pending state
            setUserState(tempUserState);
            loadAllUsers();
        }
    }, [userState, loadAllUsers, setUserState])

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
                                            title={t('company.company_name')}
                                            type='text'
                                            name="company_name"
                                            defaultValue={companyChange.company_name}
                                            required
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.company_name_eng')}
                                            type='text'
                                            name="company_name_eng"
                                            defaultValue={companyChange.company_name_eng}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.ceo_name')}
                                            type='text'
                                            name="ceo_name"
                                            defaultValue={companyChange.ceo_name}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.business_registration_code')}
                                            type='text'
                                            name="business_registration_code"
                                            defaultValue={companyChange.business_registration_code}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddAddressItem
                                            title={t('company.address')}
                                            key_address='company_address'
                                            key_zip='company_zip_code'
                                            edited={companyChange}
                                            setEdited={setCompanyChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.phone_number')}
                                            type='text'
                                            name="company_phone_number"
                                            defaultValue={companyChange.company_phone_number}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.zip_code')}
                                            type='text'
                                            name="company_zip_code"
                                            defaultValue={companyChange.company_zip_code}
                                            disabled={true}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.fax_number')}
                                            type='text'
                                            name="company_fax_number"
                                            defaultValue={companyChange.company_fax_number}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.homepage')}
                                            type='text'
                                            name="homepage"
                                            defaultValue={companyChange.homepage}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.company_scale')}
                                            type='text'
                                            name="company_scale"
                                            defaultValue={companyChange.company_scale}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.deal_type')}
                                            type='select'
                                            name='deal_type'
                                            defaultValue={companyChange.deal_type}
                                            options={option_deal_type.ko}
                                            onChange={handleSelectChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.industry_type')}
                                            type='select'
                                            name='industry_type'
                                            defaultValue={companyChange.industry_type}
                                            options={option_industry_type.ko}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.business_type')}
                                            type='text'
                                            name="business_type"
                                            defaultValue={companyChange.business_type}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.business_item')}
                                            type='text'
                                            name="business_item"
                                            defaultValue={companyChange.business_item}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.establishment_date')}
                                            type='date'
                                            name="establishment_date"
                                            time={{ data: establishDate }}
                                            onChange={handleEstablishDateChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.account_code')}
                                            type='text'
                                            name="account_code"
                                            defaultValue={companyChange.account_code}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.bank_name')}
                                            type='text'
                                            name="bank_name"
                                            defaultValue={companyChange.bank_name}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.account_owner')}
                                            type='text'
                                            name="account_owner"
                                            defaultValue={companyChange.account_owner}
                                            onChange={handleCompanyChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.salesman')}
                                            type='select'
                                            name='sales_resource'
                                            defaultValue={companyChange.sales_resource}
                                            options={salespersonsForSelection}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.engineer')}
                                            type='select'
                                            name='application_engineer'
                                            defaultValue={companyChange.application_engineer}
                                            options={engineersForSelection}
                                            onChange={handleSelectChange}
                                        />
                                        <AddBasicItem
                                            title={t('common.location')}
                                            type='select'
                                            name='region'
                                            options={option_locations.ko}
                                            defaultValue={companyChange.region}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('common.memo')}
                                            type='textarea'
                                            long
                                            row_no={3}
                                            name="memo"
                                            defaultValue={companyChange.memo}
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
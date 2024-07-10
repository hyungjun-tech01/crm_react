import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { defaultCompany } from "../../atoms/atoms";
import { atomUserState, atomEngineersForSelection, atomSalespersonsForSelection } from '../../atoms/atomsUser';
import { CompanyRepo } from "../../repository/company";
import { UserRepo } from '../../repository/user';
import { option_locations, option_deal_type, option_industry_type } from "../../constants/constants";

import AddBasicItem from "../../constants/AddBasicItem";
import AddAddressItem from '../../constants/AddAddressItem';
import MessageModal from "../../constants/MessageModal";


const CompanyAddModel = (props) => {
    const { init, handleInit } = props;
    const { t } = useTranslation();
    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    const [ isMessageModalOpen, setIsMessageModalOpen ] = useState(false);
    const [ message, setMessage ] = useState({title:'', message: ''});


    //===== [RecoilState] Related with Company ==========================================
    const { modifyCompany } = useRecoilValue(CompanyRepo);


    //===== [RecoilState] Related with Users ============================================
    const [userState, setUserState] = useRecoilState(atomUserState);
    const engineersForSelection = useRecoilValue(atomEngineersForSelection);
    const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);
    const { loadAllUsers } = useRecoilValue(UserRepo)


    //===== Handles to edit 'CompanyAddModel' ===========================================
    const [companyChange, setCompanyChange] = useState({ ...defaultCompany });

    const initializeCompanyTemplate = useCallback(() => {
        setCompanyChange({ ...defaultCompany });
        document.querySelector("#add_new_company_form").reset();
    }, []);

    const handleDateChange = (name, date) => {
        const modifiedData = {
            ...companyChange,
            [name]: date
        };
        setCompanyChange(modifiedData);
    };

    const handleItemChange = (e) => {
        const modifiedData = {
            ...companyChange,
            [e.target.name]: e.target.value,
        };
        setCompanyChange(modifiedData);
    };

    const handleSelectChange = (name, selected) => {
        const modifiedData = {
            ...companyChange,
            [name]: selected.value,
        };
        setCompanyChange(modifiedData);
    };

    const handleAddNewCompany = useCallback((event) => {
        // Check data if they are available
        if (companyChange.company_name === null
            || companyChange.company_name === '') {
            const tempMsg = {title: '확인', message: '회사이름이 누락되었습니다.'}
            setMessage(tempMsg);
            setIsMessageModalOpen(true);
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
        result.then(res => {
            if(res) {
                initializeCompanyTemplate();
            } else {
                const tempMsg = {title: '확인', message: `저장하지 못했습니다.\n-오류 이유 : ${res}`};
                setMessage(tempMsg);
                setIsMessageModalOpen(true);
            }
        });
    }, [companyChange, cookies.myLationCrmUserId, initializeCompanyTemplate, modifyCompany]);


    useEffect(() => {
        console.log('[CompanyAddModel] called!');
        if (init) {
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
        };
    }, [userState, loadAllUsers, setUserState]);

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
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.company_name_eng')}
                                            type='text'
                                            name="company_name_eng"
                                            defaultValue={companyChange.company_name_eng}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.ceo_name')}
                                            type='text'
                                            name="ceo_name"
                                            defaultValue={companyChange.ceo_name}
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.business_registration_code')}
                                            type='text'
                                            name="business_registration_code"
                                            defaultValue={companyChange.business_registration_code}
                                            onChange={handleItemChange}
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
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.zip_code')}
                                            type='text'
                                            name="company_zip_code"
                                            defaultValue={companyChange.company_zip_code}
                                            disabled={true}
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.fax_number')}
                                            type='text'
                                            name="company_fax_number"
                                            defaultValue={companyChange.company_fax_number}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.homepage')}
                                            type='text'
                                            name="homepage"
                                            defaultValue={companyChange.homepage}
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.company_scale')}
                                            type='text'
                                            name="company_scale"
                                            defaultValue={companyChange.company_scale}
                                            onChange={handleItemChange}
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
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.business_item')}
                                            type='text'
                                            name="business_item"
                                            defaultValue={companyChange.business_item}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.establishment_date')}
                                            type='date'
                                            name="establishment_date"
                                            time={{ data: companyChange.establishment_date }}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.account_code')}
                                            type='text'
                                            name="account_code"
                                            defaultValue={companyChange.account_code}
                                            onChange={handleItemChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.bank_name')}
                                            type='text'
                                            name="bank_name"
                                            defaultValue={companyChange.bank_name}
                                            onChange={handleItemChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.account_owner')}
                                            type='text'
                                            name="account_owner"
                                            defaultValue={companyChange.account_owner}
                                            onChange={handleItemChange}
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
                                            onChange={handleItemChange}
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
            <MessageModal
                title={message.title}
                message={message.message}
                open={isMessageModalOpen}
                handleOk={()=>setIsMessageModalOpen(false)}
            />
            {/* modal-dialog */}
        </div>
    )
};

export default CompanyAddModel;
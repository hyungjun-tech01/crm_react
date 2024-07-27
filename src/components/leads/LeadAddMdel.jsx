import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { atomCompanyForSelection, atomCompanyState, defaultLead } from "../../atoms/atoms";
import { atomUserState, atomEngineersForSelection, atomSalespersonsForSelection } from '../../atoms/atomsUser';
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { option_locations } from "../../constants/constants";

import AddBasicItem from "../../constants/AddBasicItem";
import AddAddressItem from '../../constants/AddAddressItem';

const LeadAddModel = (props) => {
    const { init, handleInit } = props;
    const { t } = useTranslation();
    const [ cookies ] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    

    //===== [RecoilState] Related with Company =============================================
    const companyState = useRecoilValue(atomCompanyState);
    const companyForSelection = useRecoilValue(atomCompanyForSelection);


    //===== [RecoilState] Related with Lead ================================================
    const { modifyLead } = useRecoilValue(LeadRepo);


    //===== [RecoilState] Related with User ================================================
    const userState = useRecoilValue(atomUserState);
    const engineersForSelection = useRecoilValue(atomEngineersForSelection);
    const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);

    
    //===== Handles to edit 'Lead Add' =====================================================
    const [ isAllNeededDataLoaded, setIsAllNeededDataLoaded ] = useState(false);
    const [ leadChange, setLeadChange ] = useState(defaultLead);
    const [ disabledItems, setDisabledItems ] = useState({});

    const initializeLeadTemplate = useCallback(() => {
        setLeadChange(defaultLead);
        setDisabledItems({});
        document.querySelector("#add_new_lead_form").reset();
    }, []);

    const handleLeadChange = useCallback((e) => {
        const modifiedData = {
            ...leadChange,
            [e.target.name]: e.target.value,
        };
        setLeadChange(modifiedData);
    }, [leadChange]);

    const handleAddNewLead = useCallback((event) => {
        // Check data if they are available
        if (leadChange.lead_name === null
            || leadChange.lead_name === ''
            || leadChange.company_code === null) {
            console.log("Company Name must be available!");
            return;
        };

        const newLeadData = {
            ...leadChange,
            action_type: 'ADD',
            lead_number: '99999',// Temporary
            counter: 0,
            modify_user: cookies.myLationCrmUserId,
        };
        const result = modifyLead(newLeadData);
        if (result) {
            initializeLeadTemplate();
            //close modal ?
        };
    }, [cookies.myLationCrmUserId, initializeLeadTemplate, leadChange, modifyLead]);

    const handleSelectChange = useCallback((name, selected) => {
        console.log('[LeadAddModel] handleSelectChange :', selected);
        let modifiedData = null;
        if(name === 'company_name') {
            modifiedData = {
                ...leadChange,
                company_code: selected.value.company_code,
                company_name: selected.value.company_name,
                company_name_en: selected.value.company_name_en,
                company_zip_code: selected.value.company_zip_code,
                company_address: selected.value.company_address,
                company_phone_number: selected.value.company_phone_number,
                company_fax_number: selected.value.company_fax_number,
            };
            let tempDisabled = {
                ...disabledItems,
            };
            if(selected.value.company_name_en) {
                tempDisabled['company_name_en'] = true;
            };
            if(selected.value.company_address) {
                tempDisabled['company_address'] = true;
            };
            setDisabledItems(tempDisabled);
        } else {
            modifiedData = {
                ...leadChange,
                [name] : selected.value,
            };
        };
        setLeadChange(modifiedData);
    }, [leadChange, disabledItems]);

    useEffect(() => {
        if(((companyState & 1) === 1) && ((userState & 1) === 1)) {
            setIsAllNeededDataLoaded(true);
            if (init) {
                console.log('[LeadAddModel] initialize!');
                if(handleInit) handleInit(!init);
                setTimeout(()=>{
                    initializeLeadTemplate();
                }, 500);
            };
        }
    }, [companyState, userState, init ])

    if (!isAllNeededDataLoaded)
        return <div>&nbsp;</div>;

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
                        <h4 className="modal-title text-center"><b>{t('lead.add_lead')}</b></h4>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12">
                                <form id="add_new_lead_form">
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.lead_name')}
                                            type='text'
                                            name="lead_name"
                                            defaultValue={leadChange.lead_name}
                                            required
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            title={t('lead.position')}
                                            type='text'
                                            name="position"
                                            defaultValue={leadChange.position}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.is_keyman')}
                                            type='select'
                                            name='is_keyman'
                                            defaultValue={leadChange.is_keyman}
                                            options={KeyManForSelection}
                                            onChange={handleSelectChange}
                                        />
                                        <AddBasicItem
                                            title={t('common.region')}
                                            type='select'
                                            name='region'
                                            defaultValue={leadChange.region}
                                            options={option_locations.ko}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.company_name')}
                                            type='select'
                                            name='company_name'
                                            defaultValue={leadChange.company_name}
                                            options={companyForSelection}
                                            onChange={handleSelectChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.company_name_en')}
                                            type='text'
                                            name="company_name_en"
                                            defaultValue={leadChange.company_name_en}
                                            disabled={(disabledItems && disabledItems['company_name_en']) ? disabledItems.company_name_en : false}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.department')}
                                            type='text'
                                            name="department"
                                            defaultValue={leadChange.department}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            title={t('lead.mobile')}
                                            type='text'
                                            name="mobile_number"
                                            defaultValue={leadChange.mobile_number}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.phone_number')}
                                            type='text'
                                            name="company_phone_number"
                                            defaultValue={leadChange.company_phone_number}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            title={t('lead.fax_number')}
                                            type='text'
                                            name="company_fax_number"
                                            defaultValue={leadChange.company_fax_number}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            name="email"
                                            type='text'
                                            title={t('lead.email')}
                                            defaultValue={leadChange.email}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            title={t('lead.homepage')}
                                            type='text'
                                            name="homepage"
                                            defaultValue={leadChange.homepage}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.zip_code')}
                                            type='text'
                                            name="company_zip_code"
                                            defaultValue={leadChange.company_zip_code}
                                            disabled={true}
                                            onChange={handleLeadChange}
                                        />
                                        <AddAddressItem
                                            title={t('company.address')}
                                            key_address='company_address'
                                            key_zip='company_zip_code'
                                            disabled={(disabledItems && disabledItems['company_address']) ? disabledItems.company_address : false}
                                            edited={leadChange}
                                            setEdited={setLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.lead_sales')}
                                            type='select'
                                            name='sales_resource'
                                            defaultValue={leadChange.sales_resource}
                                            options={salespersonsForSelection}
                                            onChange={handleSelectChange}
                                        />
                                        <AddBasicItem
                                            title={t('company.engineer')}
                                            type='select'
                                            name='application_engineer'
                                            defaultValue={leadChange.application_engineer}
                                            options={engineersForSelection}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <div className={"col-sm-6"} >
                                            <div className="add-basic-item">
                                                <div className={"add-basic-title"} >
                                                    {t('lead.DMexist')}
                                                </div>
                                                <input
                                                    className={"add-basic-content"}
                                                    type="text"
                                                    placeholder={t('lead.DMexist')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('common.memo')}
                                            type='textarea'
                                            name="memo"
                                            defaultValue={leadChange.memo}
                                            long
                                            row_no={3}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="text-center py-3">
                                        <button
                                            type="button"
                                            className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                                            onClick={handleAddNewLead}
                                        >
                                            {t('common.save')}
                                        </button>
                                        &nbsp;&nbsp;
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-rounded"
                                            data-bs-dismiss="modal"
                                            onClick={initializeLeadTemplate}
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

export default LeadAddModel;
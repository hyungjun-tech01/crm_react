import React, { useCallback, useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import { atomAllCompanies, defaultLead } from "../../atoms/atoms";
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { FiSearch } from "react-icons/fi";
import { formatDate } from '../../constants/functions';
import { option_locations } from "../../constants/constans";

import AddBasicItem from "../../constants/AddBasicItem";

const PopupDom = ({ children }) => {
    const el = document.getElementById('popupDom');
    return ReactDom.createPortal(children, el);
};

const LeadAddModel = (props) => {
    const { init, handleInit } = props;
    const allCompnayData = useRecoilValue(atomAllCompanies);
    const { modifyLead } = useRecoilValue(LeadRepo);
    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    const [ companySelection, setCompanySelection ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState(null);
    const [ leadChange, setLeadChange ] = useState(defaultLead);
    const { t } = useTranslation();


    const initializeLeadTemplate = useCallback(() => {
        setLeadChange(defaultLead);
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
        console.log(`[ handleAddNewLead ]`, newLeadData);
        const result = modifyLead(newLeadData);
        if (result) {
            initializeLeadTemplate();
            //close modal ?
        };
    }, [cookies.myLationCrmUserId, initializeLeadTemplate, leadChange, modifyLead]);

    const handleSelectChange = useCallback((name, selected) => {
        const modifiedData = {
            ...leadChange,
            [name]: selected.value,
        };
        setLeadChange(modifiedData);
    }, [leadChange]);

    const handleSetAddress = useCallback((address) => {
        const modifiedData = {
            ...leadChange,
            company_address: address,
        };
        setLeadChange(modifiedData);
        document.getElementById('company_input_address').value = address;
    }, [leadChange]);

    const handleSetZipCode = useCallback((zip_code) => {
        const modifiedData = {
            ...leadChange,
            company_zip_code: zip_code,
        };
        setLeadChange(modifiedData);
    }, [leadChange]);

    const handleSelectCompany = useCallback((value)=>{
        const selected = value.value;
        setSelectedOption(value);
        const tempLeadChange = {
          ...leadChange,
          company_code: selected.company_code,
          company_name: selected.company_name,
          company_name_en: selected.company_name_en,
          company_zip_code: (leadChange.company_zip_code !== null ? leadChange.company_zip_code : selected.company_zip_code),
          company_address: (leadChange.company_address !== null ? leadChange.company_address : selected.company_address),
        };
        setLeadChange(tempLeadChange);
      }, [leadChange]);

    useEffect(() => {
        console.log('LeadAddModel called!');
        if (init) {
            initializeLeadTemplate();
            handleInit(!init);
        }
        if(companySelection.length !== allCompnayData.length){
            const companySubSet = allCompnayData.map((data) => ({
              value: {
                company_code: data.company_code,
                company_name: data.company_name,
                company_name_en: data.company_name_en,
                company_zip_code: data.company_zip_code,
                company_address: data.company_address,
              },
              label: data.company_name,
            }));
            setCompanySelection(companySubSet);
          };
    }, [allCompnayData, companySelection.length, handleInit, init, initializeLeadTemplate]);

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
                                            type='text'
                                            name="lead_name"
                                            required
                                            title={t('lead.lead_name')}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="position"
                                            title={t('lead.position')}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='select'
                                            options={KeyManForSelection}
                                            title={t('lead.is_keyman')}
                                            onChange={(selected) => handleSelectChange('is_keyman', selected)}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="region"
                                            title={t('common.region')}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="company_name"
                                            title={t('company.company_name')}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="company_name_en"
                                            title={t('company.eng_company_name')}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="department"
                                            title={t('lead.department')}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="mobile_number"
                                            title={t('lead.mobile')}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="company_phone_number"
                                            title={t('company.phone_number')}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="company_fax_number"
                                            title={t('lead.fax_number')}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="email"
                                            title={t('lead.email')}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="homepage"
                                            title={t('lead.homepage')}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="company_zip_code"
                                            title={t('lead.zip_code')}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="company_address"
                                            title={t('company.address')}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            type='text'
                                            name="sales_resource"
                                            title={t('lead.lead_sales')}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            type='text'
                                            name="application_engineer"
                                            title={t('company.engineer')}
                                            onChange={handleLeadChange}
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
                                            type='textarea'
                                            long
                                            row_no={3}
                                            name="memo"
                                            title={t('common.memo')}
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
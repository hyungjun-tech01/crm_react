import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from 'react-i18next';
import * as bootstrap from "../../assets/js/bootstrap.bundle";
import { defaultLead } from "../../atoms/atoms";
import { atomUserState, atomEngineersForSelection, atomSalespersonsForSelection } from '../../atoms/atomsUser';
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { option_locations } from "../../constants/constants";

import AddBasicItem from "../../constants/AddBasicItem";
import AddAddressItem from '../../constants/AddAddressItem';
import AddSearchItem from '../../constants/AddSearchItem';
import MessageModal from "../../constants/MessageModal";

const LeadAddModel = (props) => {
    const { init, handleInit } = props;
    const { t } = useTranslation();
    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState({ title: "", message: "" });


    //===== [RecoilState] Related with Lead ================================================
    const { modifyLead } = useRecoilValue(LeadRepo);


    //===== [RecoilState] Related with User ================================================
    const userState = useRecoilValue(atomUserState);
    const engineersForSelection = useRecoilValue(atomEngineersForSelection);
    const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


    //===== Handles to edit 'Lead Add' =====================================================
    const [ disableItems, setDisableItems ] = useState(false);
    const [ leadChange, setLeadChange ] = useState({...defaultLead});

    const handleLeadChange = useCallback((e) => {
        const modifiedData = {
            ...leadChange,
            [e.target.name]: e.target.value,
        };
        setLeadChange(modifiedData);
    }, [leadChange]);

    const handleSelectChange = useCallback((name, selected) => {
        const modifiedData = {
            ...leadChange,
            [name]: selected.value,
        };
        setLeadChange(modifiedData);
    }, [leadChange]);

    const handleCompanySelected = (data) => {
        setLeadChange(data);
        setDisableItems(true);
    };

    const initializeLeadTemplate = useCallback(() => {
        document.querySelector("#add_new_lead_form").reset();

        setLeadChange({...defaultLead});
        setDisableItems(false);
        // setDisableItemsChecked({
        //     company_name_en': false,
        //     company_address': false,
        //     company_zip_code': false,
        //     homepage': false,
        //     company_fax_number': false,
        //     site_id': false,
        //     sales_resource': false,
        // });
    }, []);

    const handleAddNewLead = () => {
        // Check data if they are available
        let numberOfNoInputItems = 0;
        let noLeadName = false;
        if(!leadChange.lead_name || leadChange.lead_name === ""){
            numberOfNoInputItems++;
            noLeadName = true;
        };
        let noCompanyCode = false;
        if(!leadChange.company_code || leadChange.company_code === ""){
            numberOfNoInputItems++;
            noCompanyCode = true;
        };
        let noLeadMobile = false;
        if(!leadChange.mobile_number || leadChange.mobile_number === ""){
            numberOfNoInputItems++;
            noLeadMobile = true;
        };
        let noLeadEmail = false;
        if(!leadChange.email || leadChange.email === ""){
            numberOfNoInputItems++;
            noLeadEmail = true;
        };

        if(numberOfNoInputItems > 0){
            const contents = (
              <>
                <p>하기 정보는 필수 입력 사항입니다.</p>
                { noLeadName && <div> - 고객 이름</div> }
                { noCompanyCode && <div> - 회사 이름</div> }
                { noLeadMobile && <div> - 고객 휴대전화</div> }
                { noLeadEmail && <div> - 고객 Email(1)</div> }
              </>
            );
            const tempMsg = {
                title: t('comment.title_check'),
                message: contents,
            };
            setMessage(tempMsg);
            setIsMessageModalOpen(true);
            return;
        };

        const newLeadData = {
            ...leadChange,
            action_type: 'ADD',
            lead_number: '99999',// Temporary
            counter: 0,
            modify_user: cookies.myLationCrmUserId,
        };
        const resp = modifyLead(newLeadData);
        resp.then(res => {
            if (res.result) {
                initializeLeadTemplate();
                let thisModal = bootstrap.Modal.getInstance('#add_lead');
                if(thisModal) thisModal.hide();
            } else {
                const tempMsg = {
                    title: t('comment.title_check'),
                    message: `${t('comment.msg_fail_save')} - 오류 이유 : ${res.data}`,
                };
                setMessage(tempMsg);
                setIsMessageModalOpen(true);
            }
        });
    };

    useEffect(() => {
        if (init && (userState & 1) === 1) {
            console.log('[LeadAddModel] initialize!');
            if(handleInit) handleInit(!init);
            setTimeout(() => {
                initializeLeadTemplate();
            }, 500);
        }
    }, [userState, init]);

    if (init)
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
                                            title={t('lead.is_keyman')}
                                            type='select'
                                            name='is_keyman'
                                            defaultValue={leadChange.is_keyman}
                                            options={KeyManForSelection}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.position')}
                                            type='text'
                                            name="position"
                                            defaultValue={leadChange.position}
                                            onChange={handleLeadChange}
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
                                        <AddSearchItem
                                            title={t('company.company_name')}
                                            category='lead'
                                            name='company_name'
                                            required
                                            defaultValue={leadChange.company_name}
                                            edited={leadChange}
                                            setEdited={handleCompanySelected}
                                        />
                                        <AddBasicItem
                                            title={t('common.site_id')}
                                            type='text'
                                            name="site_id"
                                            defaultValue={leadChange.site_id}
                                            options={salespersonsForSelection}
                                            disabled={disableItems}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.company_name_en')}
                                            type='text'
                                            name="company_name_en"
                                            defaultValue={leadChange.company_name_en}
                                            disabled={disableItems}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            title={t('lead.zip_code')}
                                            type='text'
                                            name="company_zip_code"
                                            defaultValue={leadChange.company_zip_code}
                                            disabled={true}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.mobile')}
                                            type='text'
                                            name="mobile_number"
                                            required
                                            defaultValue={leadChange.mobile_number}
                                            onChange={handleLeadChange}
                                        />
                                        <AddAddressItem
                                            title={t('company.address')}
                                            key_address='company_address'
                                            key_zip='company_zip_code'
                                            disabled={disableItems}
                                            edited={leadChange}
                                            setEdited={setLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('company.phone_number')}
                                            type='text'
                                            name="company_phone_number"
                                            defaultValue={leadChange.company_phone_number}
                                            disabled={disableItems}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            title={t('lead.fax_number')}
                                            type='text'
                                            name="company_fax_number"
                                            defaultValue={leadChange.company_fax_number}
                                            disabled={disableItems}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            name="email"
                                            type='text'
                                            title={t('lead.email1')}
                                            required
                                            defaultValue={leadChange.email}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            title={t('lead.homepage')}
                                            type='text'
                                            name="homepage"
                                            defaultValue={leadChange.homepage}
                                            disabled={disableItems}
                                            onChange={handleLeadChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            name="email2"
                                            type='text'
                                            title={t('lead.email2')}
                                            defaultValue={leadChange.email2}
                                            onChange={handleLeadChange}
                                        />
                                        <AddBasicItem
                                            title={t('lead.DMexist')}
                                            type='text'
                                            name='dm_exist'
                                            defaultValue={leadChange.dm_exist}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <AddBasicItem
                                            title={t('lead.lead_sales')}
                                            type='select'
                                            name='sales_resource'
                                            defaultValue={leadChange.sales_resource}
                                            options={salespersonsForSelection}
                                            disabled={disableItems}
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
            <MessageModal
                title={message.title}
                message={message.message}
                open={isMessageModalOpen}
                handleOk={() => setIsMessageModalOpen(false)}
            />
            {/* modal-dialog */}
        </div>
    )
};

export default LeadAddModel;
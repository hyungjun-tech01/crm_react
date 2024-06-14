import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";

import { defaultConsulting,
  atomLeadsForSelection,
  atomLeadState,
} from "../../atoms/atoms";
import { atomUserState,
  atomUsersForSelection,
  atomEngineersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import { LeadRepo } from "../../repository/lead";
import {
  ConsultingRepo,
  ConsultingTypes,
  ConsultingStatusTypes,
  ConsultingTimeTypes,
  ProductTypes
} from "../../repository/consulting";
import { UserRepo } from '../../repository/user';

import { formatDate } from "../../constants/functions";
import AddBasicItem from "../../constants/AddBasicItem";


const ConsultingAddModel = ({ init, handleInit, leadCode }) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId", "myLationCrmUserName"]);


  //===== [RecoilState] Related with Consulting =======================================
  const { modifyConsulting } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Lead =============================================
  const leadsState = useRecoilValue(atomLeadState);
  const leadsForSelection = useRecoilValue(atomLeadsForSelection);
  const { loadAllLeads } = useRecoilValue(LeadRepo);


  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
  const { loadAllUsers } = useRecoilValue(UserRepo)
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to edit 'ConsultingAddModel' ========================================
  const [consultingChange, setConsultingChange] = useState({ ...defaultConsulting });
  const [receiptDate, setReceiptDate] = useState(null);

  const initializeConsultingTemplate = useCallback(() => {
    document.querySelector("#add_new_consulting_form").reset();

    // set Receipt date -------------
    const tempDate = new Date();
    setReceiptDate(tempDate);
    const localDate = formatDate(tempDate);
    const localTime = tempDate.toLocaleTimeString('ko-KR');

    if (leadCode && leadCode !=='') {
      const foundIdx = leadsForSelection.findIndex(item => item.value.lead_code === leadCode);
      if (foundIdx !== -1) {
        const found_lead_info = leadsForSelection.at(foundIdx);
        setConsultingChange({
          ...found_lead_info.value,
          receiver: cookies.myLationCrmUserName,
          receipt_date: localDate,
          receipt_time: localTime,
        });
      };
    } else {
      setConsultingChange({
        receiver: cookies.myLationCrmUserName,
        receipt_date: localDate,
        receipt_time: localTime,
      });
    };
  }, [cookies.myLationCrmUserName, leadCode, leadsForSelection]);

  const handleReceiptDateChange = (date) => {
    setReceiptDate(date);
    const localDate = formatDate(date);
    const localTime = date.toLocaleTimeString('ko-KR');
    const tempChanges = {
      ...consultingChange,
      receipt_date: localDate,
      receipt_time: localTime,
    };
    setConsultingChange(tempChanges);
  };

  const handleConsultingChange = useCallback((e) => {
    const modifiedData = {
      ...consultingChange,
      [e.target.name]: e.target.value,
    };
    setConsultingChange(modifiedData);
  }, [consultingChange]);

  const handleSelectChange = useCallback((name, selected) => {
    let modifiedData = null;
    if (name === 'lead_name') {
      modifiedData = {
        ...consultingChange,
        lead_code: selected.value.lead_code,
        lead_name: selected.value.lead_name,
        department: selected.value.department,
        position: selected.value.position,
        mobile_number: selected.value.mobile_number,
        phone_number: selected.value.phone_number,
        email: selected.value.email,
        company_name: selected.value.company_name,
        company_code: selected.value.company_code,
      };
    } else {
      modifiedData = {
        ...consultingChange,
        [name]: selected.value,
      };
    };

    setConsultingChange(modifiedData);
  }, [consultingChange]);

  const handleAddNewConsulting = useCallback(() => {
    // Check data if they are available
    if (consultingChange.lead_name === null
      || consultingChange.lead_name === ''
      || consultingChange.consulting_type === null
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };

    const newConsultingData = {
      ...consultingChange,
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewConsulting ]`, newConsultingData);
    const result = modifyConsulting(newConsultingData);
    if (result) {
      initializeConsultingTemplate();
      //close modal ?
    };
  }, [cookies.myLationCrmUserId, initializeConsultingTemplate, consultingChange, modifyConsulting]);


  //===== useEffect functions ==========================================
  useEffect(() => {
    if ((leadsState & 1) === 0) {
      loadAllLeads();
    };
  }, [leadsState, loadAllLeads]);

  useEffect(() => {
    if ((userState & 1) === 0) {
      loadAllUsers();
    } else {
      if (init) {
        console.log('[ConsultingAddModel] init');
        initializeConsultingTemplate();
        if (handleInit) handleInit(!init);
      };
    };
  }, [handleInit, init, initializeConsultingTemplate, loadAllUsers, userState]);

  
  return (
    <div
      className="modal right fade"
      id="add_consulting"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog" role="document"
      >
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
            <h4 className="modal-title"><b>{t('consulting.add_consulting')}</b></h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form className="forms-sampme" id="add_new_consulting_form">
              <div className="form-group row">
                <AddBasicItem
                  title={t('consulting.receipt_date')}
                  type='date'
                  time={{ data: receiptDate, time: true }}
                  required
                  onChange={handleReceiptDateChange}
                />
                <AddBasicItem
                  title={t('consulting.receiver')}
                  type='select'
                  name="receiver"
                  defaultValue={consultingChange.receiver}
                  options={usersForSelection}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('consulting.type')}
                  type='select'
                  name='consulting_type'
                  defaultValue={consultingChange.consulting_type}
                  options={ConsultingTypes}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('consulting.product_type')}
                  type='select'
                  name='product_type'
                  defaultValue={consultingChange.product_type}
                  options={ProductTypes}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('lead.lead_name')}
                  type='select'
                  name='lead_name'
                  defaultValue={consultingChange.lead_name}
                  options={leadsForSelection}
                  required
                  onChange={handleSelectChange}
                />
              </div>
              {(consultingChange.lead_name !== null) &&
                <div className="form-group row">
                  <div className="col-sm-12">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td><b>{t('lead.department')}</b></td>
                          <td>{consultingChange.department}</td>
                          <td><b>{t('lead.position')}</b></td>
                          <td>{consultingChange.position}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.mobile')}</b></td>
                          <td>{consultingChange.mobile}</td>
                          <td><b>{t('common.phone_no')}</b></td>
                          <td>{consultingChange.phone}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.email')}</b></td>
                          <td>{consultingChange.email}</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              }
              <div className="form-group row">
                <AddBasicItem
                  title={t('company.salesman')}
                  type='select'
                  name='sales_representati'
                  defaultValue={consultingChange.sales_representati}
                  options={salespersonsForSelection}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('company.engineer')}
                  type='select'
                  name='application_engineer'
                  defaultValue={null}
                  options={engineersForSelection}
                  onChange={(selected) => console.log("[ConsultingAddModel] No varaible for this!", selected)}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('consulting.request_content')}
                  type='textarea'
                  long
                  name='request_content'
                  defaultValue={consultingChange.request_content}
                  onChange={handleConsultingChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('consulting.status')}
                  type='select'
                  name='status'
                  defaultValue={consultingChange.status}
                  options={ConsultingStatusTypes}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('consulting.lead_time')}
                  type='select'
                  name='lead_time'
                  defaultValue={consultingChange.lead_time}
                  options={ConsultingTimeTypes}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('consulting.action_content')}
                  type='textarea'
                  name='action_content'
                  defaultValue={consultingChange.action_content}
                  onChange={handleConsultingChange}
                />
              </div>
              <div className="text-center">
                {(leadCode && leadCode !=='') ?
                  <button
                    type="button"
                    className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                    onClick={handleAddNewConsulting}
                  >
                    {t('common.save')}
                  </button>
                  :
                  <button
                    type="button"
                    className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                    data-bs-dismiss="modal"
                    onClick={handleAddNewConsulting}
                  >
                    {t('common.save')}
                  </button>
                }
                &nbsp;&nbsp;
                {(leadCode && leadCode !=='') ?
                  <button
                    type="button"
                    className="btn btn-secondary btn-rounded"
                    data-bs-dismiss="modal"
                  >
                    {t('common.cancel')}
                  </button>
                  :
                  <button
                    type="button"
                    className="btn btn-secondary btn-rounded"
                    data-bs-dismiss="modal"
                  >
                    {t('common.cancel')}
                  </button>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingAddModel;
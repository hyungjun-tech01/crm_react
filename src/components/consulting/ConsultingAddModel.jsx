import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";

import { defaultConsulting,
  atomLeadsForSelection,
  atomLeadState,
  atomCurrentLead,
  defaultLead,
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


const ConsultingAddModel = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId", "myLationCrmUserName"]);


  //===== [RecoilState] Related with Consulting =======================================
  const { modifyConsulting } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Lead =============================================
  const [leadsState, setLeadsState] = useRecoilState(atomLeadState);
  const currentLead = useRecoilValue(atomCurrentLead);
  const leadsForSelection = useRecoilValue(atomLeadsForSelection);
  const { loadAllLeads, } = useRecoilValue(LeadRepo);


  //===== [RecoilState] Related with Users ============================================
  const [userState, setUserState] = useRecoilState(atomUserState);
  const { loadAllUsers } = useRecoilValue(UserRepo)
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to edit 'ConsultingAddModel' ========================================
  const [consultingChange, setConsultingChange] = useState({ ...defaultConsulting });
  const [loaded, setLoaded] = useState(0);

  const initializeConsultingTemplate = useCallback(() => {
    // document.querySelector("#add_new_consulting_form").reset();

    // set Receipt date -------------
    const tempDate = new Date();

    if (currentLead !== defaultLead) {
      const foundIdx = leadsForSelection.findIndex(item => item.value.lead_code === currentLead.lead_code);
      if (foundIdx !== -1) {
        const found_lead_info = leadsForSelection.at(foundIdx);
        setConsultingChange({
          ...found_lead_info.value,
          receiver: cookies.myLationCrmUserName,
          receipt_date: tempDate,
        });
      };
    } else {
      setConsultingChange({
        receiver: cookies.myLationCrmUserName,
        receipt_date: tempDate,
      });
    };
  }, [cookies.myLationCrmUserName, leadsForSelection]);

  const handleDateChange = (name, date) => {
    const modifiedData = {
      ...consultingChange,
      [name]: date
    };
    setConsultingChange(modifiedData);
  };

  const handleItemChange = useCallback((e) => {
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
    if ((leadsState & 3) === 0) {
      setLeadsState(2);
      loadAllLeads();
    };
    if ((userState & 3) === 0) {
      setUserState(2);
      loadAllUsers();
    };
    if (((leadsState & 1) === 0) && ((userState & 1) === 0)) {
      initializeConsultingTemplate();
    };
  }, [leadsState, userState]);


  if((userState & 1) !== 1) return null;

  return (
    <div
      className="modal right fade"
      id="add_consulting"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      data-bs-focus="false"
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
                  name='receipt_date'
                  time={{ data: consultingChange.receipt_date, time: true }}
                  required
                  onChange={handleDateChange}
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
                          <td>{consultingChange.mobile_number}</td>
                          <td><b>{t('common.phone_no')}</b></td>
                          <td>{consultingChange.phone_number}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.fax_number')}</b></td>
                          <td>{consultingChange.fax_number}</td>
                          <td><b>{t('lead.email')}</b></td>
                          <td>{consultingChange.email}</td>
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
                  name='sales_representative'
                  defaultValue={consultingChange.sales_representative}
                  options={salespersonsForSelection}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('company.engineer')}
                  type='select'
                  name='application_engineer'
                  defaultValue={consultingChange.application_engineer}
                  options={engineersForSelection}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('consulting.request_content')}
                  type='textarea'
                  long
                  name='request_content'
                  defaultValue={consultingChange.request_content}
                  onChange={handleItemChange}
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
                  onChange={handleItemChange}
                />
              </div>
              <div className="text-center">
                {(currentLead !== defaultLead) ?
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
                {(currentLead !== defaultLead) ?
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
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import {
  atomCurrentCompany,
  atomCurrentLead,
  defaultLead,
} from "../../atoms/atoms";
import {
  atomUserState,
  atomUsersForSelection,
  atomEngineersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import {
  ConsultingRepo,
  ConsultingTypes,
  ConsultingStatusTypes,
  ConsultingTimeTypes,
  ProductTypes
} from "../../repository/consulting";

import AddBasicItem from "../../constants/AddBasicItem";
import AddSearchItem from "../../constants/AddSearchItem";
import MessageModal from "../../constants/MessageModal";
import { CompanyRepo } from "../../repository/company";


const ConsultingAddModel = (props) => {
  const { init, handleInit, leadCode } = props;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId", "myLationCrmUserName"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: "", message: "" });


  //===== [RecoilState] Related with Consulting =======================================
  const { modifyConsulting } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Lead =============================================
  const currentLead = useRecoilValue(atomCurrentLead);


  //===== [RecoilState] Related with Company ==========================================
  const currentCompany = useRecoilValue(atomCurrentCompany);
  const { setCurrentCompany } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Users ============================================
  const userState = useRecoilValue(atomUserState);
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to edit 'ConsultingAddModel' ========================================
  const [consultingChange, setConsultingChange] = useState({});

  const initializeConsultingTemplate = useCallback(() => {
    document.querySelector("#add_new_consulting_form").reset();

    // set Receipt date -------------
    const tempDate = new Date();
    let modified = {
      receiver: cookies.myLationCrmUserName,
      receipt_date: tempDate,
    };

    if (leadCode && leadCode !== "") {
      if (currentLead !== defaultLead) {
        modified['lead_code'] = currentLead.lead_code;
        modified['lead_name'] = currentLead.lead_name;
        modified['department'] = currentLead.department;
        modified['position'] = currentLead.position;
        modified['mobile_number'] = currentLead.mobile_number;
        modified['phone_number'] = currentLead.phone_number;
        modified['email'] = currentLead.email;

        setCurrentCompany(currentLead.company_code);
      };
    };
    setConsultingChange(modified);
  }, [cookies.myLationCrmUserName, currentLead, leadCode, setCurrentCompany]);

  const handleDateChange = (name, date) => {
    const modifiedData = {
      ...consultingChange,
      [name]: date
    };
    setConsultingChange(modifiedData);
  };

  const handleItemChange = (e) => {
    const modifiedData = {
      ...consultingChange,
      [e.target.name]: e.target.value,
    };
    setConsultingChange(modifiedData);
  };

  const handleSelectChange = (name, selected) => {
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
  };

  const handleAddNewConsulting = useCallback(() => {
    // Check data if they are available
    if (consultingChange.lead_name === null
      || consultingChange.lead_name === ''
      || consultingChange.consulting_type === null
    ) {
      setMessage({ title: '필요 정보 누락', message: '필요 입력 항목이 누락되었습니다.' });
      setIsMessageModalOpen(true);
      return;
    };

    const newConsultingData = {
      ...consultingChange,
      company_code: currentCompany.company_code,
      compnay_name: currentCompany.company_name,
      action_type: 'ADD',
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    const result = modifyConsulting(newConsultingData);
    result.then((res) => {
      if (res.result) {
        let thisModal = bootstrap.Modal.getInstance('#add_consulting');
        if (thisModal) thisModal.hide();
      } else {
        setMessage({ title: '저장 실패', message: '정보 저장에 실패하였습니다.' });
        setIsMessageModalOpen(true);
      };
    });
  }, [cookies.myLationCrmUserId, consultingChange, modifyConsulting, currentCompany]);


  //===== useEffect functions ==========================================
  useEffect(() => {
    if (init && ((userState & 1) === 1)) {
      console.log('[ConsultingAddModel] initialize!');
      if (handleInit) handleInit(!init);
      setTimeout(() => {
        initializeConsultingTemplate();
      }, 500);
    };
  }, [userState, init, initializeConsultingTemplate, handleInit]);

  if (init)
    return <div>&nbsp;</div>;

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
                  defaultValue={consultingChange.receipt_date}
                  time
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
                <AddSearchItem
                  title={t('lead.lead_name')}
                  category='consulting'
                  name='lead_name'
                  required
                  defaultValue={consultingChange.lead_name}
                  edited={consultingChange}
                  setEdited={setConsultingChange}
                />
              </div>
              {!!consultingChange.lead_name &&
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
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                  onClick={handleAddNewConsulting}
                >
                  {t('common.save')}
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-secondary btn-rounded"
                  data-bs-dismiss="modal"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <MessageModal
        title={message.title}
        message={message.message}
        open={isMessageModalOpen}
        handleOk={() => setIsMessageModalOpen(false)}
      />
    </div>
  );
};

export default ConsultingAddModel;
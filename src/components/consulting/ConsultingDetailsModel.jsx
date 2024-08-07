import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";

import {
  atomUserState,
  atomUsersForSelection,
  atomEngineersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import { atomConsultingState, atomCurrentConsulting, defaultConsulting } from "../../atoms/atoms";
import {
  ConsultingRepo,
  ConsultingTypes,
  ConsultingStatusTypes,
  ConsultingTimeTypes,
  ProductTypes
} from "../../repository/consulting";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";


const ConsultingDetailsModel = () => {
  const [t] = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);


  //===== [RecoilState] Related with Consulting =======================================
  const consultingState = useRecoilValue(atomConsultingState);
  const selectedConsulting = useRecoilValue(atomCurrentConsulting);
  const { modifyConsulting, setCurrentConsulting } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to deal this component ==============================================
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentConsultingCode, setCurrentConsultingCode] = useState('');

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if (checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);


  //===== Handles to edit 'Consulting Details' ========================================
  const [isAllNeededDataLoaded, setIsAllNeededDataLoaded] = useState(false);
  const [editedDetailValues, setEditedDetailValues] = useState(null);

  const handleDetailChange = useCallback((e) => {
    if (e.target.value !== selectedConsulting[e.target.name]) {
      const tempEdited = {
        ...editedDetailValues,
        [e.target.name]: e.target.value,
      };
      console.log('handleDetailChange : ', tempEdited);
      setEditedDetailValues(tempEdited);
    } else {
      if (editedDetailValues[e.target.name]) {
        delete editedDetailValues[e.target.name];
      };
    };
  }, [editedDetailValues, selectedConsulting]);

  const handleDetailDateChange = useCallback((name, date) => {
    if (date !== new Date(selectedConsulting[name])) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: date,
      };
      setEditedDetailValues(tempEdited);
    }
  }, [editedDetailValues, selectedConsulting]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    console.log('handleDetailSelectChange / start : ', selected);

    if (selectedConsulting[name] !== selected.value) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: selected.value,
      };
      console.log('handleDetailSelectChange : ', tempEdited);
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues, selectedConsulting]);

  const handleSaveAll = useCallback(() => {
    if (editedDetailValues !== null
      && selectedConsulting
      && selectedConsulting !== defaultConsulting) {
      let temp_all_saved = {
        ...editedDetailValues
      };
      temp_all_saved['action_type'] = "UPDATE";
      temp_all_saved['modify_user'] = cookies.myLationCrmUserId;
      temp_all_saved['consulting_code'] = selectedConsulting.consulting_code;

      const resp = modifyConsulting(temp_all_saved);
      resp.then(res => {
        if (res.result) {
          console.log(`Succeeded to modify company`);
        } else {
          console.error('Failed to modify company : ', res.data);
        };
      });
    } else {
      console.log("[ ConsultingDetailModel ] No saved data");
    };
    setEditedDetailValues(null);
  }, [cookies.myLationCrmUserId, modifyConsulting, editedDetailValues, selectedConsulting]);

  const handleCancelAll = useCallback(() => {
    setEditedDetailValues(null);
  }, []);

  const handleClose = useCallback(() => {
    setEditedDetailValues(null);
    setCurrentConsulting();
  }, [setCurrentConsulting]);

  const consulting_items_info = [
    { key: 'department', title: 'lead.department', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'position', title: 'lead.position', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'mobile_number', title: 'lead.mobile', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'phone_number', title: 'common.phone_no', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'email', title: 'lead.email', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'status', title: 'common.status', detail: { type: 'select', options: ConsultingStatusTypes, editing: handleDetailSelectChange } },
    { key: 'receipt_date', title: 'consulting.receipt_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'consulting_type', title: 'consulting.type', detail: { type: 'select', options: ConsultingTypes, editing: handleDetailSelectChange } },
    { key: 'lead_time', title: 'consulting.lead_time', detail: { type: 'select', options: ConsultingTimeTypes, editing: handleDetailSelectChange } },
    { key: 'product_type', title: 'consulting.product_type', detail: { type: 'select', options: ProductTypes, editing: handleDetailSelectChange } },
    { key: 'request_type', title: 'consulting.request_type', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'lead_sales', title: 'lead.lead_sales', detail: { type: 'select', options: salespersonsForSelection, editing: handleDetailSelectChange } },
    { key: 'application_engineer', title: 'company.engineer', detail: { type: 'select', options: engineersForSelection, editing: handleDetailSelectChange } },
    { key: 'receiver', title: 'consulting.receiver', detail: { type: 'select', options: usersForSelection, editing: handleDetailSelectChange } },
    { key: 'request_content', title: 'consulting.request_content', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
    { key: 'action_content', title: 'consulting.action_content', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
    { key: 'memo', title: 'common.memo', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
  ];


  //===== useEffect functions =============================================== 
  useEffect(() => {
    if ((selectedConsulting !== defaultConsulting)
      && (selectedConsulting.consulting_code !== currentConsultingCode)
    ) {
      const detailViewStatus = localStorage.getItem("isFullScreen");
      if (detailViewStatus === null) {
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if (detailViewStatus === '0') {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      setCurrentConsultingCode(selectedConsulting.consulting_code);
    };
  }, [consultingState, cookies.myLationCrmUserId, currentConsultingCode, selectedConsulting]);

  useEffect(() => {
    if (((userState & 1) === 1) && ((consultingState & 1) === 1)) {
      setIsAllNeededDataLoaded(true);
    };
  }, [userState, consultingState])

  if (!isAllNeededDataLoaded)
    return <div>&nbsp;</div>;

  return (
    <div
      className="modal right fade"
      id="consulting-details"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      data-bs-focus="false"
    >
      <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="row w-100">
              <DetailTitleItem
                original={selectedConsulting.lead_name}
                name='lead_name'
                title={t('lead.lead_name')}
                onEditing={handleDetailChange}
              />
              <DetailTitleItem
                original={selectedConsulting.company_name}
                name='company_name'
                title={t('company.company_name')}
                onEditing={handleDetailChange}
              />
              <DetailTitleItem
                original={selectedConsulting.position}
                name='position'
                title={t('lead.position')}
                onEditing={handleDetailChange}
              />
            </div>
            <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWidthChange} />
            <button
              type="button"
              className="btn-close xs-close"
              data-bs-dismiss="modal"
              onClick={handleClose}
            />
          </div>
          <div className="modal-body">
            <div className="tab-content pipeline-tabs border-0">
              <div
                role="tabpanel"
                className="tab-pane active p-0"
                id="not-contacted"
              >
                <div className="">
                  <div className="task-infos">
                    <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="#not-contact-task-details"
                          data-bs-toggle="tab"
                        >
                          {t('common.details')}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#not-contact-task-related"
                          data-bs-toggle="tab"
                        >
                          {t('common.related')}
                        </Link>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className="tab-pane show active p-0"
                        id="not-contact-task-details"
                      >
                        <div className="crms-tasks">
                          <div className="tasks__item crms-task-item">
                            <Space
                              align="start"
                              direction="horizontal"
                              size="small"
                              style={{ display: 'flex', marginBottom: '0.5rem' }}
                              wrap
                            >
                              {consulting_items_info.map((item, index) =>
                                <DetailCardItem
                                  key={index}
                                  title={t(item.title)}
                                  defaultValue={selectedConsulting[item.key]}
                                  edited={editedDetailValues}
                                  name={item.key}
                                  detail={item.detail}
                                />
                              )}
                            </Space>
                          </div>
                        </div>
                      </div>
                    </div>
                    {editedDetailValues !== null && Object.keys(editedDetailValues).length !== 0 &&
                      <div className="text-center py-3">
                        <button
                          type="button"
                          className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          onClick={handleSaveAll}
                        >
                          {t('common.save')}
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className="btn btn-secondary btn-rounded"
                          onClick={handleCancelAll}
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal-content */}
      </div>
      {/* modal-dialog */}
    </div>
  );
};

export default ConsultingDetailsModel;

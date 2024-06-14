import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";

import { atomUserState,
  atomUsersForSelection,
  atomEngineersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import { atomCurrentConsulting, defaultConsulting } from "../../atoms/atoms";
import {
  ConsultingRepo,
  ConsultingTypes,
  ConsultingStatusTypes,
  ConsultingTimeTypes,
  ProductTypes
} from "../../repository/consulting";
import { UserRepo } from "../../repository/user";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import { formatDate, formatTime } from "../../constants/functions";


const ConsultingDetailsModel = () => {
  const [ t ] = useTranslation();
  const [ cookies ] = useCookies(["myLationCrmUserId"]);


  //===== [RecoilState] Related with Consulting =======================================
  const selectedConsulting = useRecoilValue(atomCurrentConsulting);
  const { modifyConsulting, setCurrentConsulting } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
  const { loadAllUsers } = useRecoilValue(UserRepo)
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to deal this component ==============================================
  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [currentConsultingCode, setCurrentConsultingCode] = useState('');

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);


  //===== Handles to edit 'Consulting Details' ========================================
  const [ editedDetailValues, setEditedDetailValues ] = useState(null);

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
    if(editedDetailValues !== null
      && selectedConsulting
      && selectedConsulting !== defaultConsulting)
    {
      let temp_all_saved = {
        ...editedDetailValues
      };
      if(editedDetailValues.receipt_time) {
        const date_string = formatDate(editedDetailValues.receipt_time);
        const time_string = formatTime(editedDetailValues.receipt_time);
        temp_all_saved['receipt_date'] = date_string;
        temp_all_saved['receipt_time'] = time_string;
      };
      temp_all_saved['action_type'] = "UPDATE";
      temp_all_saved['modify_user'] = cookies.myLationCrmUserId;
      temp_all_saved['consulting_code'] = selectedConsulting.consulting_code;

      if (modifyConsulting(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
        if(editedDetailValues.receipt_time){
          setOrgReceiptTime(editedDetailValues.receipt_time);
        };
      } else {
        console.error('Failed to modify company')
      }
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
  }, []);

  const consulting_items_info = [
    { key: 'consulting_type', title:'consulting.type', detail:{ type:'select', options:ConsultingTypes, editing: handleDetailSelectChange}},
    { key: 'receipt_time', title:'consulting.receipt_time', detail:{ type:'date', editing: handleDetailDateChange }},
    { key: 'product_type', title:'consulting.product_type', detail:{ type:'select', options:ProductTypes, editing: handleDetailSelectChange}},
    { key: 'lead_time', title:'consulting.lead_time', detail:{ type:'select', options:ConsultingTimeTypes, editing: handleDetailSelectChange}},
    { key: 'request_type', title:'consulting.request_type', detail:{ type:'label' , editing: handleDetailChange}},
    { key: 'lead_sales', title:'lead.lead_sales', detail:{ type:'select', options: salespersonsForSelection, editing: handleDetailSelectChange}},
    { key: 'department', title:'lead.department', detail:{ type:'label' , editing: handleDetailChange}},
    { key: 'position', title:'lead.position', detail:{ type:'label' , editing: handleDetailChange}},
    { key: 'mobile_number', title:'lead.mobile', detail:{ type:'label' , editing: handleDetailChange}},
    { key: 'phone_number', title:'common.phone_no', detail:{ type:'label' , editing: handleDetailChange}},
    { key: 'email', title:'lead.email', detail:{ type:'label' , editing: handleDetailChange}},
    { key: 'company_name', title:'company.company_name', detail:{ type:'label', extra:'long' , editing: handleDetailChange}},
    { key: 'request_content', title:'consulting.request_content', detail:{ type:'textarea', extra:'long' , editing: handleDetailChange}},
    { key: 'action_content', title:'consulting.action_content', detail:{ type:'textarea', extra:'long' , editing: handleDetailChange}},
    { key: 'memo', title:'common.memo', detail:{ type:'textarea', extra:'long' , editing: handleDetailChange}},
  ];


  //===== useEffect functions =============================================== 
  useEffect(() => {
    if((selectedConsulting !== defaultConsulting)
      && (selectedConsulting.consulting_code !== currentConsultingCode)
    ){
      console.log('[ConsultingDetailsModel] useEffect / consulting! :', selectedConsulting);

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if(detailViewStatus === null){
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if(detailViewStatus === '0'){
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      setCurrentConsultingCode(selectedConsulting.consulting_code);

      // Set time from selected consulting data
      let input_time = new Date();
      if(selectedConsulting.receipt_date !== null
        && selectedConsulting.receipt_date !== '' && selectedConsulting.receipt_date !== undefined)
      {
        input_time.setTime(Date.parse(selectedConsulting.receipt_date));

        if(selectedConsulting.receipt_time !== null
          && selectedConsulting.receipt_time !== '' && selectedConsulting.receipt_time !== undefined)
        {
          let converted_time = '';
          const splitted = selectedConsulting.receipt_time.split(' ');
          if(splitted.length === 2) {
            if(splitted[0] === '오전'){
              converted_time = splitted[1] + ' AM';
            } else if(splitted[0] === '오후'){
              converted_time = splitted[1] + ' PM';
            }
          } else {
            converted_time = selectedConsulting.receipt_time;
          };

          if(converted_time !==''){
            const str_ymd = input_time.toLocaleDateString('ko-KR', {year: 'numeric', month: 'numeric', day: 'numeric'})
              + ' ' + converted_time;

            input_time.setTime(Date.parse(str_ymd));
          };
        };
      };
    };
  }, [cookies.myLationCrmUserName, selectedConsulting]);

  return (
    <div
      className="modal right fade"
      id="consulting-details"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="row w-100">
              <DetailTitleItem
                original={selectedConsulting.status}
                name='status'
                title={t('consulting.status')}
                onEditing={handleDetailChange}
              />
              <DetailTitleItem
                original={selectedConsulting.lead_name}
                name='status'
                title={t('lead.lead_name')}
                onEditing={handleDetailChange}
              />
              <DetailTitleItem
                original={selectedConsulting.receiver}
                name='status'
                title={t('consulting.receiver')}
                onEditing={handleDetailChange}
              />
            </div>
            <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWidthChange}/>
            <button
              type="button"
              className="btn-close xs-close"
              data-bs-dismiss="modal"
              onClick={ handleClose }
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
                              { consulting_items_info.map((item, index) => 
                                <DetailCardItem
                                  key={index}
                                  title={t(item.title)}
                                  defaultText={selectedConsulting[item.key]}
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
                    { editedDetailValues !== null && Object.keys(editedDetailValues).length !== 0 &&
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

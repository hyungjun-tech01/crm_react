import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";

import {
  atomUserState,
  atomUsersForSelection,
  atomEngineersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import {
  atomCurrentConsulting,
  atomSelectedCategory,
  atomRequestAttachments,
  atomActionAttachments,
  defaultConsulting, 
  atomRequestAttachmentCode,
  atomActionAttachmentCode} from "../../atoms/atoms";
import {
  ConsultingRepo,
  ConsultingTypes,
  ConsultingStatusTypes,
  ConsultingTimeTypes,
  ProductTypes
} from "../../repository/consulting";
import { AttachmentRepo } from "../../repository/attachment";
import { SettingsRepo } from "../../repository/settings";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";


const ConsultingDetailsModel = () => {
  const [t] = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);


  //===== [RecoilState] Related with Consulting =======================================
  const selectedConsulting = useRecoilValue(atomCurrentConsulting);
  const { modifyConsulting, setCurrentConsulting } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== [RecoilState] Related with Users ============================================
  const { openModal, closeModal } = useRecoilValue(SettingsRepo);


  //===== Handles to deal this component ==============================================
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentConsultingCode, setCurrentConsultingCode] = useState('');
  const [ selectedCategory, setSelectedCategory] = useRecoilState(atomSelectedCategory);
  const [ showEditor, setShowEditor ] = useState(0);

  const EDIT_REQUEST_CONTENT = 1;
  const EDIT_ACTION_CONTENT = 2;

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
      setEditedDetailValues(tempEdited);
    } else {
      if (editedDetailValues[e.target.name]) {
        delete editedDetailValues[e.target.name];
      };
    };
  }, [editedDetailValues, selectedConsulting]);

  const handleDetailDataChange = useCallback((name, date) => {
    if (date !== new Date(selectedConsulting[name])) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: date,
      };
      setEditedDetailValues(tempEdited);
    }
  }, [editedDetailValues, selectedConsulting]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    if (selectedConsulting[name] !== selected.value) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: selected.value,
      };
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues, selectedConsulting]);

  //===== Handles to attachment ========================================
  const orgRequestAttachments = useRecoilValue(atomRequestAttachments);
  const orgActionAttachments = useRecoilValue(atomActionAttachments);
  const [ requestAttachmentCode, setRequestAttachmentCode ] = useRecoilState(atomRequestAttachmentCode);
  const [ actionAttachmentCode, setActionAttachmentCode ] = useRecoilState(atomActionAttachmentCode);
  const { deleteFile, modifyAttachmentInfo } = useRecoilValue(AttachmentRepo);
  const [ requestAttachments, setRequestAttachments ] = useState([]);
  const [ actionAttachments, setActionAttachments ] = useState([]);

  const handleAddRequestContent = async (data) => {
    const {content, attachments} = data;
    
    handleDetailDataChange('request_content', content);
    
    // Check if content has all attachments ------------------------
    const totalAttachments = [
      ...requestAttachments,
      ...attachments
    ];

    let foundAttachments = [];
    let removedAttachments = [];
    orgRequestAttachments.forEach(item => {
      const coverted = {
        attachmentCode: item.attachment_code,
        attachmentIndex: item.attachemnt_index,
        dirName: item.dir_name,
        fileName: item.file_name,
        fileExxt: item.file_ext,
        uuid: item.uuid,
      };
      if(content.includes(item.dir_name)){
        foundAttachments.push(coverted);
      } else {
        removedAttachments.push(coverted);
      };
    });
    totalAttachments.forEach(item => {
      if(content.includes(item.dirName)){
        foundAttachments.push(item);
      } else {
        removedAttachments.push(item);
      };
    });

    if(removedAttachments.length > 0) {
      removedAttachments.forEach(async item => {
        const deleteResp = await deleteFile(item.dirName, item.fileName, item.fileExt);
        if(!deleteResp.result){
          console.log('Failed to remove uploaded file :', item);
          // ToDo: Then, what should we do to deal this condition!
          return;
        };
        if(!!item.uuid){
          // This is in attachment table
          const attachmentResp = await modifyAttachmentInfo({
            actionType: 'DELETE',
            uuid: item.uuid,
            creator : cookies.myLationCrmUserId,
          });
          console.log('delete files :', attachmentResp);
        };
      });
    };

    // add attachment info
    let finalAttachments = [];

    if(foundAttachments.length > 0){
      let tempAttachmentCode = '';
      let tempAttachments = null;

      if(!requestAttachmentCode) {
        // attachmentCode가 없는 경우, 첫번째 정보를 upload 후 code를 받아오자.
        const firstAttachment = foundAttachments[0];
        const firstResp = await modifyAttachmentInfo({
          attachmentCode: null,
          actionType: 'ADD',
          dirName: firstAttachment.dirName,
          fileName: firstAttachment.fileName,
          fileExt: firstAttachment.fileExt,
          creator : cookies.myLationCrmUserId,
        });
        if(!firstResp.result){
          console.log('handleAddRequestContent / after modifyAttachmentInfo ', firstResp.message);
          return;
        };
        finalAttachments.push({
          ...firstAttachment,
          uuid: firstResp.data.uuid,
          attachmentCode: firstResp.data.attachmentCode,
          attachmentIndex: firstResp.data.index ,
        });
        tempAttachments = [ ...foundAttachments.slice(1,)];

        tempAttachmentCode = firstResp.data.attachmentCode;
        setRequestAttachmentCode(firstResp.data.attachmentCode);
      } else {
        tempAttachmentCode = requestAttachmentCode;
        tempAttachments = [ ...foundAttachments ];
      };

      const remainAttachments = await Promise.all(tempAttachments.map(async item => {
        if(!item.uuid){
          const resp = await modifyAttachmentInfo({
            attachmentCode: tempAttachmentCode,
            actionType: 'ADD',
            dirName: item.dirName,
            fileName: item.fileName,
            fileExt: item.fileExt,
            creator : cookies.myLationCrmUserId,
          });
          if(resp.result){
            return {
              ...item,
              uuid: resp.data.uuid,
              attachmentCode: resp.data.attachmentCode,
              attachmentIndex: resp.data.index ,
            };
          } else {
            console.log('handleAddRequestContent / after modifyAttachmentInfo ', resp.message);
          }
        }
      }));
      finalAttachments.push(...remainAttachments);
      setRequestAttachments(finalAttachments);
    };
  };

  const handleAddActionContent = async (data) => {
    const {content, attachments} = data;
    
    handleDetailDataChange('action_content', content);

    // Check if content has all attachments ------------------------
    const totalAttachments = [
      ...actionAttachments,
      ...attachments
    ];

    let foundAttachments = [];
    let removedAttachments = [];
    orgActionAttachments.forEach(item => {
      const coverted = {
        attachmentCode: item.attachment_code,
        attachmentIndex: item.attachemnt_index,
        dirName: item.dir_name,
        fileName: item.file_name,
        fileExxt: item.file_ext,
        uuid: item.uuid,
      };
      if(content.includes(item.dir_name)){
        foundAttachments.push(coverted);
      } else {
        removedAttachments.push(coverted);
      };
    });
    totalAttachments.forEach(item => {
      if(content.includes(item.dirName)){
        foundAttachments.push(item);
      } else {
        removedAttachments.push(item);
      };
    });

    if(removedAttachments.length > 0) {
      removedAttachments.forEach(async item => {
        const deleteResp = await deleteFile(item.dirName, item.fileName, item.fileExt);
        if(!deleteResp.result){
          console.log('Failed to remove uploaded file :', item);
          // ToDo: Then, what should we do to deal this condition!
          return;
        };
        if(!!item.uuid){
          // This is in attachment table
          const attachmentResp = await modifyAttachmentInfo({
            actionType: 'DELETE',
            uuid: item.uuid,
            creator : cookies.myLationCrmUserId,
          });
          console.log('delete files :', attachmentResp);
        };
      });
    };

    // add attachment info
    let finalAttachments = [];

    if(foundAttachments.length > 0){
      let tempAttachmentCode = '';
      let tempAttachments = null;

      if(!actionAttachmentCode) {
        // attachmentCode가 없는 경우, 첫번째 정보를 upload 후 code를 받아오자.
        const firstAttachment = foundAttachments[0];
        const firstResp = await modifyAttachmentInfo({
          attachmentCode: null,
          actionType: 'ADD',
          dirName: firstAttachment.dirName,
          fileName: firstAttachment.fileName,
          fileExt: firstAttachment.fileExt,
          creator : cookies.myLationCrmUserId,
        });
        if(!firstResp.result){
          console.log('handleAddRequestContent / after modifyAttachmentInfo ', firstResp.message);
          return;
        };
        finalAttachments.push({
          ...firstAttachment,
          uuid: firstResp.data.uuid,
          attachmentCode: firstResp.data.attachmentCode,
          attachmentIndex: firstResp.data.index ,
        });
        tempAttachments = [ ...foundAttachments.slice(1,)];

        tempAttachmentCode = firstResp.data.attachmentCode;
        setActionAttachmentCode(firstResp.data.attachmentCode);
      } else {
        tempAttachmentCode = actionAttachmentCode;
        tempAttachments = [ ...foundAttachments ];
      };

      const remainAttachments = await Promise.all(tempAttachments.map(async item => {
        if(!item.uuid){
          const resp = await modifyAttachmentInfo({
            attachmentCode: tempAttachmentCode,
            actionType: 'ADD',
            dirName: item.dirName,
            fileName: item.fileName,
            fileExt: item.fileExt,
            creator : cookies.myLationCrmUserId,
          });
          if(resp.result){
            return {
              ...item,
              uuid: resp.data.uuid,
              attachmentCode: resp.data.attachmentCode,
              attachmentIndex: resp.data.index ,
            };
          } else {
            console.log('handleAddRequestContent / after modifyAttachmentInfo ', resp.message);
          }
        }
      }));
      finalAttachments.push(...remainAttachments);
      setActionAttachments(finalAttachments);
    };
  };

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
          handleClose();
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
    handleClose();
  }, []);

  const handleClose = useCallback(() => {
    if(selectedCategory.category === 'consulting'){
      setSelectedCategory({category: null, item_code: null});
    };
    setEditedDetailValues(null);
    setActionAttachments([]);
    setRequestAttachments([]);
    setCurrentConsulting();
  }, [setCurrentConsulting]);

  const consultingItemsInfo = [
    { key: 'department', title: 'lead.department', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'position', title: 'lead.position', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'mobile_number', title: 'lead.mobile', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'phone_number', title: 'common.phone_no', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'email', title: 'lead.email', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'status', title: 'common.status', detail: { type: 'select', options: ConsultingStatusTypes, editing: handleDetailSelectChange } },
    { key: 'receipt_date', title: 'consulting.receipt_date', detail: { type: 'date', editing: handleDetailDataChange } },
    { key: 'consulting_type', title: 'consulting.type', detail: { type: 'select', options: ConsultingTypes, editing: handleDetailSelectChange } },
    { key: 'lead_time', title: 'consulting.lead_time', detail: { type: 'select', options: ConsultingTimeTypes, editing: handleDetailSelectChange } },
    { key: 'product_type', title: 'consulting.product_type', detail: { type: 'select', options: ProductTypes, editing: handleDetailSelectChange } },
    { key: 'request_type', title: 'consulting.request_type', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'lead_sales', title: 'lead.lead_sales', detail: { type: 'select', options: salespersonsForSelection, editing: handleDetailSelectChange } },
    { key: 'application_engineer', title: 'company.engineer', detail: { type: 'select', options: engineersForSelection, editing: handleDetailSelectChange } },
    { key: 'receiver', title: 'consulting.receiver', detail: { type: 'select', options: usersForSelection, editing: handleDetailSelectChange } },
  ];

  const consultingItemsInfo2 = [
    { key: 'request_content', title: 'consulting.request_content', detail: { type: 'content', editable: (showEditor & EDIT_REQUEST_CONTENT), editableKey: EDIT_REQUEST_CONTENT, handleEditable: setShowEditor, editing: handleAddRequestContent } },
    { key: 'action_content', title: 'consulting.action_content', detail: { type: 'content', editable: (showEditor & EDIT_ACTION_CONTENT), editableKey: EDIT_ACTION_CONTENT, handleEditable: setShowEditor, editing: handleAddActionContent } },
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
  }, [cookies.myLationCrmUserId, currentConsultingCode, selectedConsulting]);

  useEffect(() => {
    if ((userState & 1) === 1) {
      setIsAllNeededDataLoaded(true);
    };
  }, [userState])

  if (!isAllNeededDataLoaded)
    return <div>&nbsp;</div>;

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
                original={selectedConsulting}
                name='lead_name'
                title={t('lead.lead_name')}
                onEditing={handleDetailChange}
              />
              <DetailTitleItem
                original={selectedConsulting}
                name='company_name'
                title={t('company.company_name')}
                onEditing={handleDetailChange}
              />
              <DetailTitleItem
                original={selectedConsulting}
                name='position'
                title={t('lead.position')}
                onEditing={handleDetailChange}
              />
            </div>
            <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWidthChange} />
            <button
              type="button"
              className="btn-close xs-close"
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
                          style={{width:"50%"}}
                        >
                          {t('common.details')}
                        </Link>
                      </li>
                      {/*<li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#not-contact-task-related"
                          data-bs-toggle="tab"
                        >
                          {t('common.related')}
                        </Link> 
                      </li> */}
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
                              { consultingItemsInfo.map((item, index) =>
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
                            <Space
                              align="start"
                              direction="horizontal"
                              size="small"
                              style={{ display: 'flex', marginBottom: '0.5rem' }}
                              wrap
                            >
                              { consultingItemsInfo2.map((item, index) =>
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

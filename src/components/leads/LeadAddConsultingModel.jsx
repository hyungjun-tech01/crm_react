import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import * as DOMPurify from "dompurify";

import {
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
import { AttachmentRepo } from "../../repository/attachment";
import { SettingsRepo } from "../../repository/settings";

import AddBasicItem from "../../constants/AddBasicItem";
import AddSearchItem from "../../constants/AddSearchItem";
import MessageModal from "../../constants/MessageModal";
import QuillEditor from "../../constants/QuillEditor";
import { defaultConsulting } from "../../atoms/atoms";


const LeadAddConsultingModel = ({ initData }) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId", "myLationCrmUserName"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: "", message: "" });


  //===== [RecoilState] Related with Consulting =======================================
  const { modifyConsulting } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Users ============================================
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== [RecoilState] Related with Users ============================================
  const { openModal, closeModal } = useRecoilValue(SettingsRepo);

  const handleItemChange = (e) => {
    const modifiedData = {
      ...consultingChange,
      [e.target.name]: e.target.value,
    };
    setConsultingChange(modifiedData);
  };

  const handleSelectChange = (name, selected) => {
    const modifiedData = {
      ...consultingChange,
      [name]: selected.value,
    };
    setConsultingChange(modifiedData);
  };

  const handleDataChange = (name, data) => {
    const modifiedData = {
      ...consultingChange,
      [name]: data
    };
    setConsultingChange(modifiedData);
  };

  const handleLeadSelected = (data) => {
    setConsultingChange(data);
  };


  //===== Handles to edit 'Add Consulting' ========================================
  const [ consultingChange, setConsultingChange] = useState({...defaultConsulting});


  //===== Handles to attachment ========================================
  const { deleteFile, modifyAttachmentInfo } = useRecoilValue(AttachmentRepo);
  const [ requestAttachmentCode, setRequestAttachmentCode ] = useState(null);
  const [ actionAttachmentCode, setActionAttachmentCode ] = useState(null);
  const [ attachmentsForRequest, setAttachmentsForRequest ] = useState([]);
  const [ attachmentsForAction, setAttachmentsForAction ] = useState([]);

  const handleAddRequestContent = async (data) => {
    const { content, attachments } = data;

    // Check if content has all attachments ------------------------
    const totalAttachments = [
      ...attachmentsForRequest,
      ...attachments
    ];

    let foundAttachments = [];
    let removedAttachments = [];
    totalAttachments.forEach(item => {
      if(content.includes(item.dirName)){
        foundAttachments.push(item);
      } else {
        removedAttachments.push(item);
      };
    });

    // delete attachment info
    if(removedAttachments.length > 0){
      removedAttachments.forEach(async item => {
        const res = await deleteFile(item.dirName, item.fileName, item.fileExt);
        if(!res.result){
          console.log('Failed to remove uploaded file :', item);
          // ToDo: Then, what should we do to deal this condition!
          return;
        };
        if(!!item.uuid){
          // This is in attachment table
          const resp = await modifyAttachmentInfo({
            actionType: 'DELETE',
            uuid: item.uuid,
            creator : cookies.myLationCrmUserId,
          });
          console.log('delete files :', resp);
        };
      })
    };

    // add attachment info
    let finalAttachments = [];
    let modifiedData = {};

    if(foundAttachments.length > 0){
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
        setRequestAttachmentCode(firstResp.data.attachmentCode);

        if(foundAttachments.length > 1) {
        // 나머지 정보를 upload하자.
          const remainAttachments = [
            ...foundAttachments.slice(1, )
          ];
          const tempAttachments = await Promise.all(remainAttachments.map(async (item) => {
            const resp = await modifyAttachmentInfo({
              attachmentCode: firstResp.data.attachmentCode,
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
          }));
          finalAttachments.push(...tempAttachments);
        };

        modifiedData = {
          ...consultingChange,
          request_content: content,
          request_attachment_code: firstResp.data.attachmentCode,
        };
      } else {
        finalAttachments = await Promise.all(foundAttachments.map(async (item) => {
          if(!item.uuid) {
            // This is not in attachment table
            const resp = await modifyAttachmentInfo({
              attachmentCode: requestAttachmentCode,
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
          } else {
            return { ...item};
          };
        }));
        modifiedData = {
          ...consultingChange,
          request_content: content,
        };
      };
      setAttachmentsForRequest(finalAttachments);
    } else {
      modifiedData = {
        ...consultingChange,
        request_content: content,
      };
    };
    setConsultingChange(modifiedData);
  };

  const handleAddActionContent = async (data) => {
    const { content, attachments } = data;

    // Check if content has all attachments ------------------------
    const totalAttachments = [
      ...attachmentsForAction,
      ...attachments
    ];

    let foundAttachments = [];
    let removedAttachments = [];
    totalAttachments.forEach(item => {
      if(content.includes(item.url)){
        foundAttachments.push(item);
      } else {
        removedAttachments.push(item);
      };
    })

    // delete attachment info
    if(removedAttachments.length > 0) {
      removedAttachments.forEach(async item => {
        const res = await deleteFile(item.dirName, item.fileName, item.fileExt);
        if(!res.result){
          console.log('Failed to remove uploaded file :', item);
          // ToDo: Then, what should we do to deal this condition!
          return;
        };
        if(!!item.uuid){
          // This is in attachment table
          const resp = await modifyAttachmentInfo({
            actionType: 'DELETE',
            uuid: item.uuid,
            creator : cookies.myLationCrmUserId,
          });
          console.log('delete files :', resp);
        };
      });
    };

    // add attachment info
    let finalAttachments = [];
    let modifiedData = {};

    if(foundAttachments.length > 0){
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
        setActionAttachmentCode(firstResp.data.attachmentCode);

        if(foundAttachments.length > 1) {
        // 나머지 정보를 upload하자.
          const remainAttachments = [
            ...foundAttachments.slice(1, )
          ];
          const tempAttachments = await Promise.all(remainAttachments.map(async (item) => {
            const resp = await modifyAttachmentInfo({
              attachmentCode: firstResp.data.attachmentCode,
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
          }));
          finalAttachments.push(...tempAttachments);
        }

        modifiedData = {
          ...consultingChange,
          action_content: content,
          action_attachment_code: firstResp.data.attachmentCode,
        };
      } else {
        finalAttachments = await Promise.all(foundAttachments.map(async (item) => {
          if(!item.uuid) {
            // This is not in attachment table
            const resp = await modifyAttachmentInfo({
              attachmentCode: actionAttachmentCode,
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
          } else {
            return { ...item};
          };
        }));
        modifiedData = {
          ...consultingChange,
          action_content: content,
        };
      }
      setAttachmentsForAction(finalAttachments);
    } else {
      modifiedData = {
        ...consultingChange,
        action_content: content,
      };
    };
    setConsultingChange(modifiedData);
  };


  //===== Handles to handle this ================================================= 
  const [ showEditor, setShowEditor ] = useState(0);
  const CLOSE_EDITOR = 0;
  const EDIT_REQUEST_CONTENT = 1;
  const EDIT_ACTION_CONTENT = 2;
  

  const handleClickRequestContent = () => {
    setShowEditor(EDIT_REQUEST_CONTENT);
  };

  const handleClickActionContent = () => {
    setShowEditor(EDIT_ACTION_CONTENT);
  };

  const handlePopupOpen = (open) => {
    if(open) {
      openModal('antModal');
    } else {
      closeModal();
    }
  };

  const handleOpenMessage = (msg) => {
    openModal('antModal');
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessage = () => {
    closeModal();
    setIsMessageModalOpen(false);
  };

  const handleAddNewConsulting = () => {
    // Check data if they are available ------------------------------------
    let numberOfNoInputItems = 0;
    let noReceiptDate = false;
    if(!consultingChange.receipt_date || consultingChange.receipt_date === ""){
      numberOfNoInputItems++;
      noReceiptDate = true;
    };
    let noLeadName = false;
    if(!consultingChange.lead_name || consultingChange.lead_name === ""){
      numberOfNoInputItems++;
      noLeadName = true;
    };
    if(numberOfNoInputItems > 0){
      const contents = (
        <>
          <p>하기 정보는 필수 입력 사항입니다.</p>
          { noReceiptDate && <div> - 접수 일자</div> }
          { noLeadName && <div> - 고객 이름</div> }
        </>
      );
      const tempMsg = {
        title: t('comment.title_check'),
        message: contents,
      };
      handleOpenMessage(tempMsg);
      return;
    };

    const newConsultingData = {
      ...consultingChange,
      action_type: 'ADD',
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };

    const result = modifyConsulting(newConsultingData);
    result.then((res) => {
      if (res.result) {
        handleClose();
      } else {
        const tempMsg = {
          title: t('comment.title_error'),
          message: `${t('comment.msg_fail_save')} - ${t('comment.reason')} : ${res.data}`,
        };
        handleOpenMessage(tempMsg);;
      };
    });
  };

  const handleClose = () => {
    setTimeout(() => {
      closeModal();
    }, 250);
  };


  //===== useEffect functions ==========================================
  useEffect(() => {
    setConsultingChange({...initData});
    setActionAttachmentCode(null);
    setRequestAttachmentCode(null);
    setAttachmentsForAction([]);
    setAttachmentsForRequest([]);
  }, [ initData ]);

  return (
    <div
      className="modal right fade"
      id="add_lead_consulting"
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
              onClick={handleClose}
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
                  onChange={handleDataChange}
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
                  title={t('consulting.consulting_product')}
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
                  setEdited={handleLeadSelected}
                  handleOpen={handlePopupOpen}
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
                <div className="col-sm-6" >
                  <div className="add-upload-item">
                    <div style={{ display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'end' }}>
                      <div className="add-upload-title" >
                        {t('consulting.request_content')}
                      </div>
                      { !(showEditor & EDIT_REQUEST_CONTENT) &&
                        <Button type='dashed' onClick={handleClickRequestContent}>Click here to edit the below</Button>
                      }
                    </div>
                    { !(showEditor & EDIT_REQUEST_CONTENT) ?
                      <div
                        className="add-upload-button"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(consultingChange.request_content || ''),
                        }}
                      />
                      :
                      <QuillEditor
                        originalContent={consultingChange.request_content || ''}
                        handleData={handleAddRequestContent}
                        handleClose={()=>setShowEditor(CLOSE_EDITOR)}
                      />
                    }
                  </div>
                </div>
                <div className="col-sm-6" >
                  <div className="add-upload-item">
                    <div style={{ display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'end' }}>
                      <div className="add-upload-title" >
                        {t('consulting.action_content')}
                      </div>
                      { !(showEditor & EDIT_ACTION_CONTENT) && 
                        <Button type='dashed' onClick={handleClickActionContent}>Click here to edit the below</Button>
                      }
                    </div>
                    { !(showEditor & EDIT_ACTION_CONTENT) ?
                      <div
                        className="add-upload-button"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(consultingChange.action_content || ''),
                        }}
                      />
                      :
                      <QuillEditor
                        originalContent={consultingChange.action_content || ''}
                        handleData={handleAddActionContent}
                        handleClose={()=>setShowEditor(CLOSE_EDITOR)}
                      />
                    }
                  </div>
                </div>
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
                  onClick={handleClose}
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
        handleOk={handleCloseMessage}
      />
    </div>
  );
};

export default LeadAddConsultingModel;
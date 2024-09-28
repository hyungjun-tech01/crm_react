import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import * as DOMPurify from "dompurify";

import {
  atomCurrentLead,
  atomSelectedCategory,
  defaultConsulting,
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
import { CompanyRepo } from "../../repository/company";
import { AttachmentRepo } from "../../repository/attachment";

import AddBasicItem from "../../constants/AddBasicItem";
import AddSearchItem from "../../constants/AddSearchItem";
import MessageModal from "../../constants/MessageModal";
import QuillEditor from "../../constants/QuillEditor";


const ConsultingAddModel = ({ open, handleOpen }) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId", "myLationCrmUserName"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: "", message: "" });


  //===== [RecoilState] Related with Consulting =======================================
  const { modifyConsulting, deleteAttachment } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Lead =============================================
  const currentLead = useRecoilValue(atomCurrentLead);


  //===== [RecoilState] Related with Company ==========================================
  const { setCurrentCompany } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Users ============================================
  const userState = useRecoilValue(atomUserState);
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to attachment ========================================
  const { deleteFile, modifyAttachmentInfo } = useRecoilValue(AttachmentRepo);
  const [ attachmentsForRequest, setAttachmentsForRequest ] = useState([]);
  const [ attachmentsForAction, setAttachmentsForAction ] = useState([]);
      
  const handleAddRequestContent = (data) => {
    const {content, attachmentData} = data;
    
    handleDataChange('request_content', content);
    
    // Check if content has all attachments ------------------------
    const totalAttachments = [
      ...attachmentsForRequest,
      ...attachmentData
    ];
    console.log('handleAddRequestContent / before checking :', totalAttachments);

    let foundAttachments = [];
    let removedAttachments = [];
    totalAttachments.forEach(item => {
      if(content.includes(item.url)){
        foundAttachments.push(item);
      } else {
        removedAttachments.push(item);
      };
    })
    console.log('handleAddRequestContent / after checking :', foundAttachments);

    setAttachmentsForRequest(foundAttachments);

    if(removedAttachments.length > 0) {
      removedAttachments.forEach(item => {
        const resp = deleteFile(item.dirName, item.fileName, item.fileExt);
        if(!resp.result){
          console.log('Failed to remove uploaded file :', item);
        };
      });
    };

    // Close editor ------------------------------------------------
    setShowEditor(CLOSE_EDITOR);
  };

  const handleAddActionContent = (data) => {
    const {content, attachmentData} = data;
    
    handleDataChange('action_content', content);

    // Check if content has all attachments ------------------------
    const totalAttachments = [
      ...attachmentsForAction,
      ...attachmentData
    ];
    console.log('handleAddRequestContent / before checking :', totalAttachments);

    let foundAttachments = [];
    let removedAttachments = [];
    totalAttachments.forEach(item => {
      if(content.includes(item.url)){
        foundAttachments.push(item);
      } else {
        removedAttachments.push(item);
      };
    })
    console.log('handleAddActionContent / after checking :', foundAttachments);

    setAttachmentsForAction(foundAttachments);

    if(removedAttachments.length > 0) {
      removedAttachments.forEach(item => {
        const resp = deleteAttachment(item.dirName, item.fileName, item.fileExt);
        if(!resp.result){
          console.log('Failed to remove uploaded file :', item);
        };
      });
    };

    // Close editor ------------------------------------------------
    setShowEditor(CLOSE_EDITOR);
  };

  //===== Handles to This ========================================
  const [ needInit, setNeedInit ] = useState(true);
  const [ consultingChange, setConsultingChange] = useState({});
  const [ showEditor, setShowEditor ] = useState(0);

  const selectedCategory = useRecoilValue(atomSelectedCategory);

  const CLOSE_EDITOR = 0;
  const EDIT_REQUEST_CONTENT = 1;
  const EDIT_ACTION_CONTENT = 2;

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

  const handleClickRequestContent = () => {
    setShowEditor(EDIT_REQUEST_CONTENT);
  };

  const handleClickActionContent = () => {
    setShowEditor(EDIT_ACTION_CONTENT);
  };

  const initializeConsultingTemplate = useCallback(() => {
    // document.querySelector("#add_new_consulting_form").reset();

    // set Receipt date -------------
    const tempDate = new Date();
    let modified = {
      ...defaultConsulting,
      receiver: cookies.myLationCrmUserName,
      receipt_date: tempDate,
    };


    if ((selectedCategory.category === 'lead')
      && (currentLead !== defaultLead)
      && (selectedCategory.item_code === currentLead.lead_code)
    ) {
      modified['lead_code'] = currentLead.lead_code;
      modified['lead_name'] = currentLead.lead_name;
      modified['department'] = currentLead.department;
      modified['position'] = currentLead.position;
      modified['mobile_number'] = currentLead.mobile_number;
      modified['phone_number'] = currentLead.phone_number;
      modified['email'] = currentLead.email;
      modified['company_code'] = currentLead.company_code;
      modified['company_name'] = currentLead.company_name;
    };
    setConsultingChange(modified);
    setAttachmentsForAction([]);
    setAttachmentsForRequest([]);
    setNeedInit(false);

  }, [cookies.myLationCrmUserName, currentLead, setCurrentCompany, selectedCategory]);


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
      setMessage(tempMsg);
      setIsMessageModalOpen(true);
      return;
    };

    // Check attachments and upload them to server if they exist-------------
    if(attachmentsForAction.length > 0) {
      attachmentsForAction.forEach(item => {
        const resp = modifyAttachmentInfo({
          attachmentCode: consultingChange['action_attachment_code'],
          actionType: 'ADD',
          dirName: item.dirName,
          fileName: item.fileName,
          fileExt: item.fileExt,
          creator : cookies.myLationCrmUserId,
        });
        if(resp.result){
          if(!consultingChange['action_attachment_code']){
            const tempData = {
              ...consultingChange,
              action_attachment_code : resp.data.attachmentCode,
            };
            setConsultingChange(tempData);
          }
        }
      })
    };

    if(attachmentsForRequest.length > 0) {
      attachmentsForRequest.forEach(item => {
        const resp = modifyAttachmentInfo({
          attachmentCode: consultingChange['request_attachment_code'],
          actionType: 'ADD',
          dirName: item.dirName,
          fileName: item.fileName,
          fileExt: item.fileExt,
          creator : cookies.myLationCrmUserId,
        });
        if(resp.result){
          if(!consultingChange['request_attachment_code']){
            const tempData = {
              ...consultingChange,
              request_attachment_code : resp.data.attachmentCode,
            };
            setConsultingChange(tempData);
          }
        }
      })
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
        let thisModal = bootstrap.Modal.getInstance('#add_consulting');
        if (thisModal) thisModal.hide();
        handleClose();
      } else {
        setMessage({ title: '저장 실패', message: '정보 저장에 실패하였습니다.' });
        setIsMessageModalOpen(true);
      };
    });
  };

  const handleClose = () => {
    setNeedInit(true);
  };


  //===== useEffect functions ==========================================
  useEffect(() => {
    if (open && needInit && ((userState & 1) === 1)) {
      console.log('[ConsultingAddModel] initialize!');
      if (handleOpen) handleOpen(!open);
      initializeConsultingTemplate();
    };

  }, [open, userState, initializeConsultingTemplate, handleOpen, needInit]);

  if (needInit)
    return <div>&nbsp;</div>;

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
          onClick={handleClose}
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
                      { !(showEditor & EDIT_REQUEST_CONTENT) && <div style={{fontSize:'13px', fontWeight: 'bold', color: '#999999'}}>
                          {t('comment.click_below_to_edit')}
                        </div>
                      }
                    </div>
                    { !(showEditor & EDIT_REQUEST_CONTENT) ?
                      <div
                        className="add-upload-button"
                        onClick={handleClickRequestContent}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(String(consultingChange.request_content || '')),
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
                      { !(showEditor & EDIT_ACTION_CONTENT) && <div style={{fontSize:'13px', fontWeight: 'bold', color: '#999999'}}>
                          {t('comment.click_below_to_edit')}
                        </div>
                      }
                    </div>
                    { !(showEditor & EDIT_ACTION_CONTENT) ?
                      <div
                        className="add-upload-button"
                        onClick={handleClickActionContent}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(String(consultingChange.action_content || '')),
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
                  data-bs-dismiss="modal"
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
        handleOk={() => setIsMessageModalOpen(false)}
      />
    </div>
  );
};

export default ConsultingAddModel;
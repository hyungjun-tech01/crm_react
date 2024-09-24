import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import { Modal, Upload } from "antd";
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';

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

import AddBasicItem from "../../constants/AddBasicItem";
import AddSearchItem from "../../constants/AddSearchItem";
import MessageModal from "../../constants/MessageModal";

import { getBase64 } from "../../constants/functions";
import Paths from "../../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


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
  const [attachmentsForRequest, setAttachmentsForRequest] = useState([]);
  const [attachmentsForAction, setAttachmentsForAction] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewWidth, setPreviewWidth] = useState(256);
  const { Dragger } = Upload;

  const handleUploadData = async (file) => {
    const fileName = file.name;
    const ext_index = fileName.lastIndexOf('.');
    const fileExt = ext_index !== -1 ? fileName.slice(ext_index + 1) : "";

    let ret = {
      fileName : fileName,
      fileExt : fileExt,
      width: '0',
      height: '0',
    };

    const getImageInfo = (file) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
          resolve({width:image.width, height: image.height});
          URL.revokeObjectURL(image.src);  
        };
        image.onerror = error => reject(error);
      });
    }

    if (file.type.startsWith('image/')) {
      const result = await getImageInfo(file);
      ret.width = result.width;
      ret.height = result.height;
      return ret;
    } else {
      return ret;
    };
  };

  const uploadRequestProps = {
    name: 'file',
    multiple: true,
    listType: "picture-card",
    // fileList: attachmentsForRequest,
    action: `${BASE_PATH}/upload`,
    data: handleUploadData,
    onChange: (info) => {
      const { lastModifiedDate, status, response } = info.file;

      if (status === 'done') {
        const tempAttachment = {
          uid: info.file.uid,
          name: response.fileName,
          status: 'done',
          attachmentId : response.id,
          attachmentDirname : response.dirName, 
          attachmentFilename : response.fileName,
          attachmentFileExt : response.fileExt,
          attachmentCreatedAt: lastModifiedDate,
          attachmentUrl: response.url,
          attachmentCoverUrl: response.coverUrl,
          attachmentImageWidth: response.imageWidth,
          attachmentImageHeight: response.imageHeight,
          createdBy: cookies.myLationCrmUserId,
        }
        console.log('new attachment :', tempAttachment);
        setAttachmentsForRequest(attachmentsForRequest.concat(tempAttachment));
      } else if (status === 'error') {
        setMessage({title: 'Error', message: `${info.file.name} file upload failed.`});
        setIsMessageModalOpen(true);
      }
    },
    onPreview : async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      };
  
      setPreviewImage(file.url || file.preview);
      setPreviewVisible(true);
      if(file.response.imageWidth) setPreviewWidth(file.response.imageWidth);
      else if(file.attachmentImageWidth) setPreviewWidth(file.attachmentImageWidth);
    },
    onRemove: async (file) => {
      const foundAttachment = attachmentsForRequest.filter(item => item.uid === file.uid);
      if(foundAttachment.length === 0 || foundAttachment.length > 1){
        console.log('Something wrong on the way to remove attachment');
        return false;
      };
      const foundOne = foundAttachment[0];
      const response = deleteAttachment(foundOne.attachmentDirname, foundOne.attachmentFilename, foundOne.attachmentFileExt);
      response
        .then(result => {
          if(!result.result) {
            console.log('Error occurs on the way to remove attachment :', result.result.message);
            return false;
          };
          const remainAttachments = attachmentsForRequest.filter(item => item.uid !== file.uid);
          setAttachmentsForRequest(remainAttachments);
          return true;
        })
    }
  };

  const uploadActionProps = {
    name: 'file',
    multiple: true,
    listType: "picture-card",
    // fileList: attachmentsForAction,
    action: `${BASE_PATH}/upload`,
    data: handleUploadData,
    onChange(info) {
      const { lastModifiedDate, status, response } = info.file;

      if (status === 'done') {
        const tempAttachment = {
          uid: info.file.uid,
          name: response.fileName,
          status: 'done',
          createdBy: cookies.myLationCrmUserId,
          attachmentId : response.id,
          attachmentDirname : response.dirName, 
          attachmentFilename : response.fileName,
          attachmentCreatedAt: lastModifiedDate,
          attachmentUrl: response.url,
          attachmentCoverUrl: response.coverUrl,
          attachmentImageWidth: response.imageWidth,
          attachmentImageHeight: response.imageHeight,
        }
        setAttachmentsForAction(attachmentsForAction.concat(tempAttachment));
      } else if (status === 'error') {
        setMessage({title: 'Error', message: `${info.file.name} file upload failed.`});
        setIsMessageModalOpen(true);
      }
    },
    onPreview : async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      };
  
      setPreviewImage(file.url || file.preview);
      setPreviewVisible(true);
    }
  };


  //===== Handles to edit 'ConsultingAddModel' ========================================
  const [ needInit, setNeedInit ] = useState(true);
  const [consultingChange, setConsultingChange] = useState({});
  const selectedCategory = useRecoilValue(atomSelectedCategory);

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

  const handleDateChange = (name, date) => {
    const modifiedData = {
      ...consultingChange,
      [name]: date
    };
    setConsultingChange(modifiedData);
  };

  const handleLeadSelected = (data) => {
    setConsultingChange(data);
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
    setNeedInit(false);

  }, [cookies.myLationCrmUserName, currentLead, setCurrentCompany, selectedCategory]);


  const handleAddNewConsulting = () => {
    // Check data if they are available
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
                    <div className="add-upload-title" >
                      {t('consulting.request_content')}
                    </div>
                    <div className="add-upload-content">
                      <textarea
                        className="add-upload-textarea"
                        name = 'request_content'
                        placeholder={t('consulting.request_content')}
                        rows={8}
                        value={consultingChange.request_content ? consultingChange.request_content : ""}
                        onChange={handleItemChange}
                      />
                      <Dragger {...uploadRequestProps}>
                        <span>
                          <AddToPhotosOutlinedIcon style={{color: "#777777"}}/>
                        </span>
                        <span style={{marginLeft: '1rem'}}>
                          {t('comment.click_drag_file_upload')}
                        </span>
                      </Dragger>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6" >
                  <div className="add-upload-item">
                    <div className="add-upload-title" >
                      {t('consulting.action_content')}
                    </div>
                    <div className="add-upload-content">
                      <textarea
                        className="add-upload-textarea"
                        name = 'action_content'
                        placeholder={t('consulting.action_content')}
                        rows={8}
                        value={consultingChange.action_content ? consultingChange.action_content : ""}
                        onChange={handleItemChange}
                      />
                      <Dragger {...uploadActionProps}>
                        <span>
                          <AddToPhotosOutlinedIcon style={{color: "#777777"}}/>
                        </span>
                        <span style={{marginLeft: '1rem'}}>
                          {t('comment.click_drag_file_upload')}
                        </span>
                      </Dragger>
                    </div>
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
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() =>{setPreviewVisible(false)}}
        width={previewWidth}
        zIndex={2005}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
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
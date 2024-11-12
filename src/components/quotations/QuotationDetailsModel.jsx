import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";
import {
  atomCurrentQuotation,
  defaultQuotation,
  atomQuotationState,
} from "../../atoms/atoms";
import {
  atomUsersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import {
  QuotationRepo,
  QuotationSendTypes,
  QuotationTypes,
  QuotationExpiry,
  QuotationDelivery,
  QuotationPayment,
  QuotationContentItems,
} from "../../repository/quotation";
import { SettingsRepo } from "../../repository/settings";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import MessageModal from "../../constants/MessageModal";
import QuotationView from "./QuotationtView";
import QuotationContents from "./QuotationContents";
import { ConvertCurrency } from "../../constants/functions";


const QuotationDetailsModel = () => {
  const [t] = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: "", message: "" });


  //===== [RecoilState] Related with Quotation ========================================
  const selectedQuotation = useRecoilValue(atomCurrentQuotation);
  const { modifyQuotation, setCurrentQuotation } = useRecoilValue(QuotationRepo);


  //===== [RecoilState] Related with Users ============================================
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== [RecoilState] Related with Settings ============================================
  const { openModal, closeModal } = useRecoilValue(SettingsRepo);


  //===== Handles to edit 'Quotation Details' =========================================
  const [editedDetailValues, setEditedDetailValues] = useState({});

  const handleDetailChange = useCallback((e) => {
    if (e.target.value !== selectedQuotation[e.target.name]) {
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
  }, [editedDetailValues, selectedQuotation]);

  const handleDetailDateChange = useCallback((name, date) => {
    if (date !== new Date(selectedQuotation[name])) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: date,
      };
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues, selectedQuotation]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    if (selected.value !== selectedQuotation[name]) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: selected.value,
      }
      setEditedDetailValues(tempEdited);
    }
  }, [editedDetailValues, selectedQuotation]);

  const qotation_items_info = [
    { key: 'quotation_type', title: 'quotation.quotation_type', detail: { type: 'select', options: QuotationTypes, editing: handleDetailSelectChange } },
    { key: 'quotation_manager', title: 'quotation.quotation_manager', detail: { type: 'select', options: usersForSelection, editing: handleDetailSelectChange } },
    { key: 'quotation_send_type', title: 'quotation.send_type', detail: { type: 'select', options: QuotationSendTypes, editing: handleDetailSelectChange } },
    { key: 'quotation_date', title: 'quotation.quotation_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'quotation_expiration_date', title: 'quotation.expiry_date', detail: { type: 'select', options: QuotationExpiry, editing: handleDetailSelectChange } },
    { key: 'comfirm_date', title: 'quotation.confirm_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'delivery_location', title: 'quotation.delivery_location', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'delivery_period', title: 'quotation.delivery_period', detail: { type: 'select', options: QuotationDelivery, editing: handleDetailSelectChange } },
    { key: 'warranty_period', title: 'quotation.warranty', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'sales_representative', title: 'quotation.sales_rep', detail: { type: 'select', options: salespersonsForSelection, editing: handleDetailSelectChange } },
    { key: 'payment_type', title: 'quotation.payment_type', detail: { type: 'select', options: QuotationPayment, editing: handleDetailSelectChange } },
    { key: 'list_price', title: 'quotation.list_price', detail: { type: 'label', price: true, editing: handleDetailChange } },
    { key: 'list_price_dc', title: 'quotation.list_price_dc', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'sub_total_amount', title: 'quotation.sub_total_amount', detail: { type: 'label', price: true, editing: handleDetailChange } },
    { key: 'dc_rate', title: 'quotation.dc_rate', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'cutoff_amount', title: 'quotation.cutoff_amount', detail: { type: 'label', price: true, editing: handleDetailChange } },
    { key: 'total_quotation_amount', title: 'quotation.total_quotation_amount', detail: { type: 'label', price: true, editing: handleDetailChange } },
    { key: 'profit', title: 'quotation.profit_amount', detail: { type: 'label', price: true, editing: handleDetailChange } },
    { key: 'profit_rate', title: 'quotation.profit_rate', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'upper_memo', title: 'quotation.upper_memo', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
    { key: 'lower_memo', title: 'quotation.lower_memo', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
    { key: 'lead_name', title: 'lead.lead_name', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'department', title: 'lead.department', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'position', title: 'lead.position', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'mobile_number', title: 'lead.mobile', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'phone_number', title: 'common.phone_no', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'fax_number', title: 'lead.fax_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'email', title: 'lead.email', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_name', title: 'company.company_name', detail: { type: 'label', extra: 'long', editing: handleDetailChange } },
  ];


  //===== Handles to handle 'Contents' =================================================
  const [contentColumns, setContentColumns] = useState([]);
  const [quotationContents, setQuotationContents] = useState([]);

  const ConvertHeaderInfosToString = (data) => {
    let ret = '';

    Object.keys(QuotationContentItems).forEach((item, index) => {
      if (item === '1')
        ret += item;
      else
        ret += '|' + item;

      ret += '|' + t(QuotationContentItems[item].title) + '|';

      const foundIdx = data.findIndex(col => col.dataIndex === item);
      if (foundIdx === -1) {
        ret += '0';
      } else {
        ret += data[foundIdx]['width'] || '100';
      }
    });

    return ret;
  };

  //===== Handles to handle this =================================================
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if (checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  const handleOpenMessage = (msg) => {
    openModal('antModal');
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessage = () => {
    closeModal();
    setIsMessageModalOpen(false);
  };

  const handleSaveAll = useCallback(() => {
    if (editedDetailValues !== null &&
      selectedQuotation &&
      selectedQuotation !== defaultQuotation
    ) {
      const tempAllSaved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        quotation_code: selectedQuotation.quotation_code,
      };
      const resp = modifyQuotation(tempAllSaved);
      resp.then(res => {
        if (res.result) {
          handleClose();
        } else {
          const tempMsg = {
            title: t('comment.title_error'),
            message: `${t('comment.msg_fail_save')} - ${t('comment.reason')} : ${res.data}`,
          };
          handleOpenMessage(tempMsg);
        };
      });
    } else {
      console.log("[ QuotationDetailModel ] No saved data");
    }
  }, [cookies.myLationCrmUserId, modifyQuotation, editedDetailValues, selectedQuotation]);

  const handleInitialize = () => {
    console.log('QuotationDetails / handleInitialize: ', selectedQuotation);
    const tempColumnValues = selectedQuotation.quotation_table.split('|');
    let tempColumns = [];
    let temp_i = 0;

    while (true) {
      const num_i = 3 * temp_i + 2;
      if (!tempColumnValues[num_i]) break;

      const numWidth = Number(tempColumnValues[num_i]);
      if (!isNaN(numWidth) && numWidth > 0) {
        const tempIndex = tempColumnValues[num_i - 2];
        const tempTitle = tempColumnValues[num_i - 1];
        tempColumns.push({
          title: tempTitle,
          dataIndex: tempIndex,
          width: numWidth,
          render: QuotationContentItems[tempIndex].type === 'price'
            ? (text, record) => <>{ConvertCurrency(text)}</>
            : (text, record) => <>{text}</>,
        })
      };
      temp_i++;
    };

    console.log('QuotationDetails / handleInitialize / columns : ', tempColumns);
    setContentColumns(tempColumns);

    const selectedContents = JSON.parse(selectedQuotation.quotation_contents);
    console.log('QuotationDetails / handleInitialize / contents : ', selectedContents);
    setQuotationContents(selectedContents);
    setEditedDetailValues(null);
  };

  const handleClose = () => {
    setTimeout(() => {
      closeModal();
    }, 250);
  };


  //===== useEffect functions =============================================== 
  useEffect(() => {
    if (selectedQuotation !== defaultQuotation) {
      handleInitialize();
    };
  }, [selectedQuotation]);

  useEffect(() => {
    const detailViewStatus = localStorage.getItem("isFullScreen");
    if (detailViewStatus === null) {
      localStorage.setItem("isFullScreen", '0');
      setIsFullScreen(false);
    } else if (detailViewStatus === '0') {
      setIsFullScreen(false);
    } else {
      setIsFullScreen(true);
    };

    // 모달 내부 페이지의 히스토리 상태 추가
    history.pushState({ modalInternal: true }, '', location.href);

    const handlePopState = (event) => {
      if (event.state && event.state.modalInternal) {
        // 뒤로 가기를 방지하기 위해 다시 히스토리를 푸시
        history.pushState({ modalInternal: true }, '', location.href);
      }
    };

    // popstate 이벤트 리스너 추가 (중복 추가 방지)
    window.addEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      <div
        className="modal right fade"
        id="quotation-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <DetailTitleItem
                  original={selectedQuotation}
                  name='quotation_title'
                  title={t('common.title')}
                  onEditing={handleDetailChange}
                />
                <DetailTitleItem
                  original={selectedQuotation}
                  name='quotation_number'
                  title={t('quotation.doc_no')}
                  onEditing={handleDetailChange}
                />
                <DetailTitleItem
                  original={selectedQuotation}
                  name='status'
                  title={t('common.status')}
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
                  <div>
                    <div className="task-infos">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            to="#sub-quotation-details"
                            data-bs-toggle="tab"
                          >
                            {t('common.details')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#sub-quotation-pdf-view"
                            data-bs-toggle="tab"
                          >
                            {t('common.view')}
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
                        {/*---- Start -- Tab : Detail Quotation-------------------------------------------------------------*/}
                        <div className="tab-pane show active p-0" id="sub-quotation-details">
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item">
                              <Space
                                align="start"
                                direction="horizontal"
                                size="small"
                                style={{ display: 'flex', marginBottom: '0.5rem' }}
                                wrap
                              >
                                {qotation_items_info.map((item, index) =>
                                  <DetailCardItem
                                    key={index}
                                    title={t(item.title)}
                                    defaultValue={selectedQuotation[item.key]}
                                    edited={editedDetailValues}
                                    name={item.key}
                                    detail={item.detail}
                                  />
                                )}
                              </Space>
                            </div>
                            <QuotationContents
                              checkData={{ name: selectedQuotation.lead_name }}
                              columns={contentColumns}
                              handleColumns={setContentColumns}
                              contents={quotationContents}
                              handleContents={setQuotationContents}
                            />
                          </div>
                          {editedDetailValues !== null &&
                            Object.keys(editedDetailValues).length !== 0 && (
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
                                  onClick={handleClose}
                                >
                                  {t('common.cancel')}
                                </button>
                              </div>
                            )}
                        </div>
                        {/*---- End   -- Tab : Detail Quotation ------------------------------------------------------------*/}
                        {/*---- Start -- Tab : PDF View - Quotation --------------------------------------------------------*/}
                        <div className="tab-pane task-related p-0" id="sub-quotation-pdf-view">
                          {selectedQuotation && (selectedQuotation.quotation_contents.length > 0) &&
                            <QuotationView />
                          }
                        </div>
                        {/*---- End   -- Tab : PDF View - Quotation---------------------------------------------------------*/}
                      </div>
                    </div>
                  </div>
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
          handleOk={handleCloseMessage}
        />
        {/* modal-dialog */}
      </div>
    </>
  );
};

export default QuotationDetailsModel;

import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { option_locations } from '../../constants/constants';

import {
  defaultQuotation,
  atomCurrentLead,
  defaultLead,
} from "../../atoms/atoms";
import {
  atomUserState,
  atomUsersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import {
  QuotationRepo,
  QuotationTypes,
  QuotationSendTypes,
  QuotationDelivery,
  QuotationExpiry,
  QuotationPayment,
  QuotationContentItems,
  QuotationDefaultColumns,
} from "../../repository/quotation";
import { SettingsRepo } from '../../repository/settings'

import AddBasicItem from "../../constants/AddBasicItem";
import AddSearchItem from "../../constants/AddSearchItem";
import MessageModal from "../../constants/MessageModal";
import { ConvertCurrency, ConvertCurrency0 } from "../../constants/functions";
import QuotationContents from "./QuotationContents";


const QuotationAddModel = ({ init, handleInit }) => {
  const [t] = useTranslation();
  const [cookies, setCookie] = useCookies(["myLationCrmUserId", "myLationCrmUserName", "myQuotationAddColumns"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: "", message: "" });


  //===== [RecoilState] Related with Quotation =======================================
  const { modifyQuotation, getQuotationDocNo } = useRecoilValue(QuotationRepo);


  //===== [RecoilState] Related with Lead ============================================
  const currentLead = useRecoilValue(atomCurrentLead);


  //===== [RecoilState] Related with Users ===========================================
  const userState = useRecoilValue(atomUserState);
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== [RecoilState] Related with Settings ===========================================
  const { openModal, closeModal } = useRecoilValue(SettingsRepo);


  //===== Handles to edit 'QuotationAddModel' ========================================
  const [quotationChange, setQuotationChange] = useState({ ...defaultQuotation });
  const [contentData, setContentData] = useState({
    name: '',
    sales_representative: '',
    quotation_expiration_date: null,
    delivery_period: null,
    payment_type: null,
    list_price: 0,
    list_price_dc: 0,
    sub_total_amount: 0,
    dc_rate: 0,
    dc_amount: 0,
    quotation_amount: 0,
    tax_amount: 0,
    cutoff_amount: 0,
    total_quotation_amount: 0,
    total_cost_price: 0,
    profit: 0,
    profit_rate: 0,
  });

  const handleItemChange = useCallback((e) => {
    const modifiedData = {
      ...quotationChange,
      [e.target.name]: e.target.value,
    };
    setQuotationChange(modifiedData);
  }, [quotationChange]);

  const handleDateChange = (name, date) => {
    const modifiedData = {
      ...quotationChange,
      [name]: date
    };
    setQuotationChange(modifiedData);
  };

  const handleSelectChange = useCallback((name, selected) => {
    const modifiedData = {
      ...quotationChange,
      [name]: selected.value,
    };
    setQuotationChange(modifiedData);

    if(name === 'sales_representative'
      || name === 'delivery_period'
      || name === 'payment_type'
    ) {
      const tempContentData = {
        ...contentData,
        [name]: selected.value
      };
      setContentData(tempContentData);
    };
  }, [quotationChange, contentData]);


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
        ret += data[foundIdx]['viewWidth'] || '100';
      }
    });

    return ret;
  };

  const handleChangeContentColumns = (data) => {
    setContentColumns(data);

    const tempContentColumns = ConvertHeaderInfosToString(data);
    
    const updatedQuotation = {
      ...quotationChange,
      quotation_table: tempContentColumns,
    };
    setQuotationChange(updatedQuotation);
  };

  const handleChangeQuotationContents = (data) => {
    if(typeof data !== 'object' || !Array.isArray(data)) return;

    setQuotationContents(data);

    let tempContents = "";
    if(data.length !== 0) {
      const modifiedContents = data.map(item => {
        const tempData = { ...item};
        delete tempData.index;
        return tempData;
      });
      tempContents = JSON.stringify(modifiedContents);
    };

    setQuotationChange(prev => ({
      ...prev,
      quotation_contents: tempContents
    }));
  };

  const handleChangeContentData = (data) => {
    let updatedValues = {};
    if(contentData.list_price !== data.list_price) updatedValues['list_price'] = data.list_price;
    if(contentData.list_price_dc !== data.list_price_dc) updatedValues['list_price_dc'] = data.list_price_dc;
    if(contentData.sub_total_amount !== data.sub_total_amount) updatedValues['sub_total_amount'] = data.sub_total_amount;
    if(contentData.dc_rate !== data.dc_rate) updatedValues['dc_rate'] = data.dc_rate;
    if(contentData.dc_amount !== data.dc_amount) updatedValues['dc_amount'] = data.dc_amount;
    if(contentData.quotation_amount !== data.quotation_amount) updatedValues['quotation_amount'] = data.quotation_amount;
    if(contentData.tax_amount !== data.tax_amount) updatedValues['tax_amount'] = data.tax_amount;
    if(contentData.cutoff_amount !== data.cutoff_amount) updatedValues['cutoff_amount'] = data.cutoff_amount;
    if(contentData.total_quotation_amount !== data.total_quotation_amount) updatedValues['total_quotation_amount'] = data.total_quotation_amount;
    if(contentData.total_cost_price !== data.total_cost_price) updatedValues['total_cost_price'] = data.total_cost_price;
    if(contentData.profit !== data.profit) updatedValues['profit'] = data.profit;
    if(contentData.profit_rate !== data.profit_rate) updatedValues['profit_rate'] = data.profit_rate;

    setContentData(data);
    setQuotationChange(prev => ({
      ...prev,
      ...updatedValues
    }));
  };


  //===== Handles to handle this =================================================
  const handlePopupOpen = (open) => {
    if(open) {
      openModal("antModal");
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

  const handleInitialize = useCallback(() => {
    setQuotationContents([]);

    let modifiedData = {
      ...defaultQuotation,
      receiver: cookies.myLationCrmUserName,
    };

    if (currentLead !== defaultLead)
    {
      modifiedData['lead_code'] = currentLead.lead_code;
      modifiedData['lead_name'] = currentLead.lead_name;
      modifiedData['department'] = currentLead.department;
      modifiedData['position'] = currentLead.position;
      modifiedData['mobile_number'] = currentLead.mobile_number;
      modifiedData['phone_number'] = currentLead.company_phone_number;
      modifiedData['fax_number'] = currentLead.company_fax_number;
      modifiedData['email'] = currentLead.email;
      modifiedData['company_code'] = currentLead.company_code;
      modifiedData['company_name'] = currentLead.company_name;

      const modifiedContentData = {
        ...contentData,
        name: currentLead.lead_name
      };
      setContentData(modifiedContentData);
    };
    
    // load or set setting of column of table ----------------------------------
    let tempQuotationColumn = null;
    if(!cookies.myQuotationAddColumns) {
      tempQuotationColumn = QuotationDefaultColumns.map(item => {
        const selectedItem = QuotationContentItems[item.dataIndex];
        if(!!item.width) {
          return {
            title: t(selectedItem.title),
            dataIndex: item.dataIndex,
            width: item.width,
            viewWidth: item.width || selectedItem.width,
            render: selectedItem.type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : (text, record) => <>{text}</>,
          }
        } else {
          return {
            title: t(selectedItem.title),
            dataIndex: item.dataIndex,
            viewWidth: item.width || selectedItem.width,
            render: selectedItem.type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : (text, record) => <>{text}</>,
          }
        };
      });
      const tempCookieValue = {
        [cookies.myLationCrmUserId] : tempQuotationColumn 
      };
      setCookie('myQuotationAddColumns', tempCookieValue);
    } else {
      const columnSettings = cookies.myQuotationAddColumns[cookies.myLationCrmUserId];
      if(!columnSettings){
        tempQuotationColumn = QuotationDefaultColumns.map(item => {
          const selectedItem = QuotationContentItems[item.dataIndex];
          if(!!item.width) {
            return {
              title: t(selectedItem.title),
              dataIndex: item.dataIndex,
              width: item.width,
              viewWidth: item.width || selectedItem.width,
              render: selectedItem.type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : ( selectedItem.type === 'price0'
                  ? (text, record) => <>{ConvertCurrency0(text)}</>
                  : (text, record) => <>{text}</>
                )
            }
          } else {
            return {
              title: t(selectedItem.title),
              dataIndex: item.dataIndex,
              viewWidth: item.width || selectedItem.width,
              render: selectedItem.type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : ( selectedItem.type === 'price0'
                  ? (text, record) => <>{ConvertCurrency0(text)}</>
                  : (text, record) => <>{text}</>
                )
            }
          };
        });
        const tempCookieValue = {
          ...cookies.myQuotationAddColumns,
          [cookies.myLationCrmUserId]: tempQuotationColumn
        };
        setCookie('myQuotationAddColumns', tempCookieValue);
      } else {
        tempQuotationColumn = columnSettings.map(col => ({
          ...col,
          render: QuotationContentItems[col.dataIndex].type === 'price'
          ? (text, record) => <>{ConvertCurrency(text)}</>
          : ( QuotationContentItems[col.dataIndex].type === 'price0'
              ? (text, record) => <>{ConvertCurrency0(text)}</>
              : (text, record) => <>{text}</>
            )
        }));
      };
    };
    setContentColumns(tempQuotationColumn);
    modifiedData['quotation_table'] = ConvertHeaderInfosToString(tempQuotationColumn);

    let newDocNo = "";
    const response = getQuotationDocNo({modify_user: cookies.myLationCrmUserId});
    response
      .then((res) => {
        if(res.result){
          newDocNo = res.docNo;
        };
        modifiedData['quotation_number'] = newDocNo;
        setQuotationChange(modifiedData);
      })
      .catch(err => {
        console.log('handleInitialize / getQuotationDocNo :', err);
        modifiedData['quotation_number'] = newDocNo;
        setQuotationChange(modifiedData);
      })

  }, [cookies.myLationCrmUserId, cookies.myLationCrmUserName, currentLead, getQuotationDocNo]);

  const handleAddNewQuotation = () => {
    // Check data if they are available
    let numberOfNoInputItems = 0;
    let noLeadName = false;
    if(!quotationChange.lead_name || quotationChange.lead_name === ""){
      numberOfNoInputItems++;
      noLeadName = true;
    };
    let noQuotationTitle = false;
    if(!quotationChange.quotation_title || quotationChange.quotation_title === ""){
      numberOfNoInputItems++;
      noQuotationTitle = true;
    };
    let noQuotationContents = false;
    if(quotationContents.length === 0){
      numberOfNoInputItems++;
      noQuotationContents = true;
    };

    if(numberOfNoInputItems > 0){
      const contents = (
        <>
          <p>하기 정보는 필수 입력 사항입니다.</p>
          { noLeadName && <div> - 고객 이름</div> }
          { noQuotationTitle && <div> - 견적 제목</div> }
          { noQuotationContents && <div> - 견적 Items</div> }
        </>
      );
      const tempMsg = {
        title: t('comment.title_check'),
        message: contents,
      };
      handleOpenMessage(tempMsg);
      return;
    };

    const newQuotationData = {
      ...quotationChange,
      action_type: 'ADD',
      modify_user: cookies.myLationCrmUserId,
    };
    const result = modifyQuotation(newQuotationData);
    result.then((res) => {
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
  };

  const handleClose = () => {
    setTimeout(() => {
      closeModal();
    }, 250);
  };


  //===== useEffect functions ==========================================
  useEffect(() => {
    if (init && ((userState & 1) === 1)) {
      if (handleInit) handleInit(!init);
      setTimeout(() => {
        handleInitialize();
      }, 250);
    };
  }, [userState, init, handleInit, handleInitialize]);

  useEffect(() => {
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
    <div
      className="modal right fade"
      id="add_quotation"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
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
            <h4 className="modal-title"><b>{t('quotation.add_new_quotation')}</b></h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form className="forms-sampme" id="add_new_quotation_form">
              <div className="form-group row">
                <AddSearchItem
                  title={t('lead.lead_name')}
                  category='quotation'
                  name='lead_name'
                  required
                  defaultValue={quotationChange.lead_name}
                  edited={quotationChange}
                  setEdited={setQuotationChange}
                  handleOpen={handlePopupOpen}
                />
              </div>
              {!!quotationChange.lead_name &&
                <div className="form-group row">
                  <div className="col-sm-12">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td><b>{t('lead.department')}</b></td>
                          <td>{quotationChange.department}</td>
                          <td><b>{t('lead.position')}</b></td>
                          <td>{quotationChange.position}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.mobile')}</b></td>
                          <td>{quotationChange.mobile_number}</td>
                          <td><b>{t('common.phone_no')}</b></td>
                          <td>{quotationChange.phone_number}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.fax_number')}</b></td>
                          <td>{quotationChange.fax_number}</td>
                          <td><b>{t('lead.email')}</b></td>
                          <td>{quotationChange.email}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              }
              <div className="form-group row">
                <AddBasicItem
                  title={t('common.title')}
                  type='text'
                  name='quotation_title'
                  defaultValue={quotationChange.quotation_title}
                  required
                  long
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.quotation_type')}
                  type='select'
                  name='quotation_type'
                  defaultValue={quotationChange.quotation_type}
                  options={QuotationTypes}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.doc_no')}
                  type='text'
                  name='quotation_number'
                  defaultValue={quotationChange.quotation_number}
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.send_type')}
                  type='select'
                  name='quotation_send_type'
                  defaultValue={quotationChange.quotation_send_type}
                  options={QuotationSendTypes}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.quotation_date')}
                  type='date'
                  name='quotation_date'
                  defaultValue={quotationChange.quotation_date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.expiry_date')}
                  type='select'
                  name='quotation_expiration_date'
                  options={QuotationExpiry}
                  defaultValue={quotationChange.quotation_expiration_date}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.confirm_date')}
                  type='date'
                  name='comfirm_date'
                  defaultValue={quotationChange.comfirm_date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.delivery_location')}
                  type='text'
                  name='delivery_location'
                  defaultValue={quotationChange.delivery_location}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('quotation.delivery_period')}
                  type='select'
                  name='delivery_period'
                  options={QuotationDelivery}
                  defaultValue={quotationChange.delivery_period}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.warranty')}
                  type='text'
                  name='warranty_period'
                  defaultValue={quotationChange.warranty_period}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('common.region')}
                  type='select'
                  name='region'
                  options={option_locations.ko}
                  defaultValue={quotationChange.region}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.payment_type')}
                  type='select'
                  name='payment_type'
                  options={QuotationPayment}
                  defaultValue={quotationChange.payment_type}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('common.status')}
                  type='text'
                  name='status'
                  defaultValue={quotationChange.status}
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.sales_rep')}
                  type='select'
                  name='sales_representative'
                  defaultValue={quotationChange.sales_representative}
                  options={salespersonsForSelection}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.quotation_manager')}
                  type='select'
                  name='quotation_manager'
                  defaultValue={quotationChange.quotation_manager}
                  options={usersForSelection}
                  onChange={handleSelectChange}
                />
              </div>
              <QuotationContents
                data={contentData}
                handleData={handleChangeContentData}
                columns={contentColumns}
                handleColumns={handleChangeContentColumns}
                contents={quotationContents}
                handleContents={handleChangeQuotationContents}
              />
              <div className="text-center">
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                  onClick={handleAddNewQuotation}
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

export default QuotationAddModel;
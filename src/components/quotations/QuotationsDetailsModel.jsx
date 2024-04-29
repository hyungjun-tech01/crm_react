import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { SystemUser } from "../imagepath";
import { Collapse } from "antd";
import { atomCurrentQuotation, defaultQuotation } from "../../atoms/atoms";
import { QuotationRepo } from "../../repository/quotation";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailDateItem from "../../constants/DetailDateItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import QuotationView from "./QuotationtView";

const QuotationsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedQuotation = useRecoilValue(atomCurrentQuotation);
  const { modifyQuotation } = useRecoilValue(QuotationRepo);
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const [ t ] = useTranslation();

  const [editedValues, setEditedValues] = useState(null);
  const [savedValues, setSavedValues] = useState(null);

  const [ orgQuotationDate, setOrgQuotationDate ] = useState(null);
  const [ quotationDate, setQuotationDate ] = useState(new Date());
  const [ orgConfirmDate, setOrgConfirmDate ] = useState(null);
  const [ confirmDate, setConfirmDate ] = useState(new Date());

  const [ quotationContents, setQuotationContents ] = useState([]);
  const [ quotationHeaders, setQuotationHeaders ] = useState([]);

  const [editedContentValues, setEditedContentValues] = useState([]);
  const [savedContentValues, setSavedContentValues] = useState(null);

  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedQuotation[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedQuotation]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if (editedValues[name] === selectedQuotation[name]) {
      const tempEdited = {
        ...editedValues,
      };
      delete tempEdited[name];
      setEditedValues(tempEdited);
      return;
    }

    const tempSaved = {
      ...savedValues,
      [name]: editedValues[name],
    };
    setSavedValues(tempSaved);

    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited[name];
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, selectedQuotation]);

  // --- Funtions for Content Editing ---------------------------------
  const handleCheckContentEditState = useCallback((input) => {
    const splitted_input = input.split('.');
    const [name, no] = splitted_input;
    return editedContentValues.at(no) !== null && name in editedContentValues.at(no);
  }, [editedContentValues]);

  const handleStartContentEdit = useCallback((input) => {
    const splitted_input = input.split('.');
    const [name, no] = splitted_input;
    const tempEdited = {
      ...editedContentValues.at(no),
      [name]: selectedQuotation.quotation_contents[no][name],
    };
    const tempContents =[
      ...selectedQuotation.quotation_contents.slice(0, no),
      tempEdited,
      ...selectedQuotation.quotation_contents.slice(no + 1, ),
    ];
    setEditedContentValues(tempContents);
  }, [editedContentValues, selectedQuotation]);

  const handleContentEditing = useCallback((e) => {
    const splitted = e.target.name.splitted('.');
    const [name, no] = splitted;
    const tempEdited = {
      ...editedContentValues.at(no),
      [name]: e.target.value,
    };
    const tempContents =[
      ...selectedQuotation.quotation_contents.slice(0, no),
      tempEdited,
      ...selectedQuotation.quotation_contents.slice(no + 1, ),
    ];
    setEditedContentValues(tempContents);
  }, [editedContentValues]);

  const handleEndContentEdit = useCallback((input) => {
    const splitted = input.split('.');
    const [name, no] = splitted;
    if (editedContentValues[no][name] === selectedQuotation.quotation_contents[no]) {
      const tempEdited = {
        ...editedContentValues.at(no),
      };
      delete tempEdited[name];
      const tempContents =[
        ...selectedQuotation.quotation_contents.slice(0, no),
        tempEdited,
        ...selectedQuotation.quotation_contents.slice(no + 1, ),
      ];
      setEditedContentValues(tempContents);
      return;
    }

    const tempSaved = {
      ...savedContentValues.at(no),
      [name]: editedContentValues[no][name],
    };
    const tempSavedContents =[
      ...selectedQuotation.quotation_contents.slice(0, no),
      tempSaved,
      ...selectedQuotation.quotation_contents.slice(no + 1, ),
    ];
    setSavedContentValues(tempSavedContents);

    const tempEdited = {
      ...editedContentValues.at(no),
    };
    delete tempEdited[name];
    const tempContents =[
      ...selectedQuotation.quotation_contents.slice(0, no),
      tempEdited,
      ...selectedQuotation.quotation_contents.slice(no + 1, ),
    ];
    setEditedContentValues(tempContents);
  }, [editedContentValues, savedContentValues, selectedQuotation]);

  // --- Funtions for Saving ---------------------------------
  const handleCheckSaved = useCallback((name) => {
    return savedValues !== null && name in savedValues;
  }, [savedValues]);

  const handleCancelSaved = useCallback((name) => {
    const tempSaved = {
      ...savedValues,
    };
    delete tempSaved[name];
    setSavedValues(tempSaved);
  }, [savedValues]);

  const handleSaveAll = useCallback(() => {
    if (
      savedValues !== null &&
      selectedQuotation &&
      selectedQuotation !== defaultQuotation
    ) {
      const temp_all_saved = {
        ...savedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        Quotation_code: selectedQuotation.Quotation_code,
      };
      if (modifyQuotation(temp_all_saved)) {
        console.log(`Succeeded to modify Quotation`);
      } else {
        console.error("Failed to modify Quotation");
      }
    } else {
      console.log("[ QuotationDetailModel ] No saved data");
    }
    setEditedValues(null);
    setSavedValues(null);
  }, [
    cookies.myLationCrmUserId,
    modifyQuotation,
    savedValues,
    selectedQuotation,
  ]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
  }, []);

  // --- Funtions for Content Saving ---------------------------------
  const handleCheckContentSaved = useCallback((input) => {
    const splitted = input.split('.');
    const [name, no] =  splitted;
    return savedContentValues.length > no && name in savedContentValues.at(no);
  }, [savedContentValues]);

  const handleCancelContentSaved = useCallback((input) => {
    const splitted = input.split('.');
    const [name, no] =  splitted;
    const tempSaved = {
      ...savedContentValues.at(no),
    };
    delete tempSaved[name];

    const tempContentSaved = [
      ...selectedQuotation.quotation_contents.slice(0, no),
      tempSaved,
      ...selectedQuotation.quotation_contents.slice(no + 1, ),
    ];
    setSavedContentValues(tempContentSaved);
  }, [savedContentValues, selectedQuotation]);

  // --- Funtions for Quotation Date ---------------------------------
  const handleStartQuotationDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      quotation_date: orgQuotationDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgQuotationDate]);
  const handleQuotationDateChange = useCallback((date) => {
    setQuotationDate(date);
  }, []);
  const handleEndQuotationDateEdit = useCallback(() => {
    if (quotationDate !== orgQuotationDate) {
      const tempSaved = {
        ...savedValues,
        quotation_date: quotationDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.quotation_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgQuotationDate, quotationDate]);

  // --- Funtions for Confirm Date ---------------------------------
  const handleStartConfirmDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      comfirm_date: orgConfirmDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgConfirmDate]);
  const handleConfirmDateChange = useCallback((date) => {
    setConfirmDate(date);
  }, []);
  const handleEndConfirmDateEdit = useCallback(() => {
    if (confirmDate !== orgConfirmDate) {
      const tempSaved = {
        ...savedValues,
        comfirm_date: confirmDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.comfirm_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgConfirmDate, confirmDate]);

  useEffect(() => {
    console.log('[QuotationsDetailsModel] called!');
    setOrgQuotationDate(
      selectedQuotation.quotation_date
        ? new Date(selectedQuotation.quotation_date)
        : null
    );
    setOrgConfirmDate(
      selectedQuotation.comfirm_date
        ? new Date(selectedQuotation.comfirm_date)
        : null
    );
    if(selectedQuotation !== defaultQuotation)
    {
      const headerValues = selectedQuotation.quotation_table.split('|');
      if(headerValues && Array.isArray(headerValues)){
        let tableHeaders = [];
        const headerCount = headerValues.length / 3;
        for(let i=0; i < headerCount; i++){
          tableHeaders.push([ headerValues.at(3*i), headerValues.at(3*i + 1),headerValues.at(3*i + 2)]);
        };
        setQuotationHeaders(tableHeaders);
      };
      const tempContents = JSON.parse(selectedQuotation.quotation_contents);
      if(tempContents && Array.isArray(tempContents)){
          setQuotationContents(tempContents);
      };
    }
  }, [ selectedQuotation, savedValues ]);

  return (
    <>
      <div
        className="modal right fade"
        id="quotations-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <div className="col-md-7 account d-flex">
                  <div className="company_img">
                    <img src={SystemUser} alt="User" className="user-image" />
                  </div>
                  <div>
                    <p className="mb-0">System User</p>
                    <span className="modal-title">{' '}</span>
                    <span className="rating-star">
                      <i className="fa fa-star" aria-hidden="true" />
                    </span>
                    <span className="lock">
                      <i className="fa fa-lock" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-close xs-close"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="card due-dates">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <span>{t('quotation.quotation')} {t('common.status')}</span>
                    <p>{selectedQuotation.status}</p>
                  </div>
                  <div className="col">
                    <span>{t('common.name')}</span>
                    <p>{selectedQuotation.lead_name}</p>
                  </div>
                  <div className="col">
                    <span>{t('quotation.quotation_owner')}</span>
                    <p>{selectedQuotation.sales_representative}</p>
                  </div>
                </div>
              </div>
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
                            to="#quotation-details"
                            data-bs-toggle="tab"
                          >
                            {t('common.details')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#quotation-products"
                            data-bs-toggle="tab"
                          >
                            {t('quotation.product_lists')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#quotation-pdf-view"
                            data-bs-toggle="tab"
                          >
                            {t('common.view')}
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
{/*---- Start -- Tab : Detail Quotation-------------------------------------------------------------*/}
                        <div className="tab-pane show active p-0" id="quotation-details">
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                              <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                                <Panel header={t('quotation.quotation_main_information')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.quotation_type}
                                        saved={savedValues}
                                        name="quotation_type"
                                        title={t('quotation.quotation_type')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.quotation_title}
                                        saved={savedValues}
                                        name="quotation_title"
                                        title={t('quotation.quotation')+' '+t('common.title')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.quotation_number}
                                        saved={savedValues}
                                        name="quotation_number"
                                        title={t('quotation.doc_no')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.quotation_manager}
                                        saved={savedValues}
                                        name="quotation_manager"
                                        title={t('quotation.quotation_manager')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.quotation_send_type}
                                        saved={savedValues}
                                        name="quotation_send_type"
                                        title={t('quotation.send_type')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailDateItem
                                        saved={savedValues}
                                        name="quotation_date"
                                        title={t('quotation.quotation_date')}
                                        orgTimeData={orgQuotationDate}
                                        timeData={quotationDate}
                                        timeDataChange={handleQuotationDateChange}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartQuotationDateEdit}
                                        endEdit={handleEndQuotationDateEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.quotation_expiration_date}
                                        saved={savedValues}
                                        name="quotation_expiration_date"
                                        title={t('quotation.expiry_date')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailDateItem
                                        saved={savedValues}
                                        name="comfirm_date"
                                        title={t('quotation.confirm_date')}
                                        orgTimeData={orgConfirmDate}
                                        timeData={confirmDate}
                                        timeDataChange={handleConfirmDateChange}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartConfirmDateEdit}
                                        endEdit={handleEndConfirmDateEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.delivery_location}
                                        saved={savedValues}
                                        name="delivery_location"
                                        title={t('quotation.delivery_location')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.delivery_period}
                                        saved={savedValues}
                                        name="delivery_period"
                                        title={t('quotation.delivery_period')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.warranty_period}
                                        saved={savedValues}
                                        name="warranty_period"
                                        title={t('quotation.warranty')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.sales_representative}
                                        saved={savedValues}
                                        name="sales_representati"
                                        title={t('quotation.sales_rep')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header={t('quotation.quotation_price_information')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.payment_type}
                                        saved={savedValues}
                                        name="payment_type"
                                        title={t('quotation.payment_type')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.currency}
                                        saved={savedValues}
                                        name="currency"
                                        title={t('common.currency')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.list_price}
                                        saved={savedValues}
                                        name="list_price"
                                        title={t('quotation.list_price')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.list_price_dc}
                                        saved={savedValues}
                                        name="list_price_dc"
                                        title={t('quotation.list_price_dc')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.sub_total_amount}
                                        saved={savedValues}
                                        name="sub_total_amount"
                                        title={t('quotation.sub_total_amount')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.dc_rate}
                                        saved={savedValues}
                                        name="dc_rate"
                                        title={t('quotation.dc_rate')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.quotation_amount}
                                        saved={savedValues}
                                        name="quotation_amount"
                                        title={t('quotation.quotation_amount')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.tax_amount}
                                        saved={savedValues}
                                        name="tax_amount"
                                        title={t('quotation.tax_amount')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.cutoff_amount}
                                        saved={savedValues}
                                        name="cutoff_amount"
                                        title={t('quotation.cutoff_amount')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.total_quotation_amount}
                                        saved={savedValues}
                                        name="total_quotation_amount"
                                        title={t('quotation.total_quotation_amount')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.total_cost_price}
                                        saved={savedValues}
                                        name="total_cost_price"
                                        title={t('quotation.total_quotation_amount')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.profit}
                                        saved={savedValues}
                                        name="profit"
                                        title={t('quotation.profit_amount')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.profit_rate}
                                        saved={savedValues}
                                        name="profit_rate"
                                        title={t('quotation.profit_rate')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailTextareaItem
                                        defaultText={selectedQuotation.upper_memo}
                                        saved={savedValues}
                                        name="upper_memo"
                                        title={t('quotation.upper_memo')}
                                        row_no='3'
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailTextareaItem
                                        defaultText={selectedQuotation.lower_memo}
                                        saved={savedValues}
                                        name="lower_memo"
                                        title={t('quotation.lower_memo')}
                                        row_no='5'
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header={t('lead.lead') + ' ' + t('common.information')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.lead_name}
                                        saved={savedValues}
                                        name="lead_name"
                                        title={t('lead.lead_name')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.department}
                                        saved={savedValues}
                                        name="department"
                                        title={t('lead.department')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.position}
                                        saved={savedValues}
                                        name="position"
                                        title={t('lead.position')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.mobile_number}
                                        saved={savedValues}
                                        name="mobile_number"
                                        title={t('lead.mobile')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.phone_number}
                                        saved={savedValues}
                                        name="phone_number"
                                        title={t('common.phone')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.fax_number}
                                        saved={savedValues}
                                        name="fax_number"
                                        title="Fax"
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.email}
                                        saved={savedValues}
                                        name="email"
                                        title={t('lead.email')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header={t('company.company') + ' ' + t('common.information')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.company_name}
                                        saved={savedValues}
                                        name="company_name"
                                        title={t('company.company_name')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header={t('common.status') + ' ' + t('common.information')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedQuotation.status}
                                        saved={savedValues}
                                        name="status"
                                        title={t('common.status')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                          </div>
                        </div>
{/*---- End   -- Tab : Detail Quotation ------------------------------------------------------------*/}
{/*---- Start -- Tab : Product Lists - Quotation ---------------------------------------------------*/}
                        <div className="tab-pane task-related p-0" id="quotation-products">
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                            { quotationContents && quotationContents.length > 0 && 
                                quotationContents.map((content, index1) => {
                                  if(content['1'] === null || content['1'] === 'null') return;
                                  return (
                                    <Collapse key={index1} accordion expandIconPosition="end">
                                      <Panel header={"No." + content["1"]} key={index1}>
                                        <table className="table">
                                          <tbody>
                                            { content['2'] && 
                                              // <tr key={1}>
                                              //   <td className="border-0">{t('common.category')}</td>
                                              //   <td className="border-0">{content['2']}</td>
                                              // </tr>
                                              <DetailLabelItem
                                                key={1}
                                                defaultText={content['2']}
                                                saved={savedContentValues}
                                                name={"category." + index1}
                                                title={t('common.category')}
                                                no_border={true}
                                                checkEdit={handleCheckContentEditState}
                                                startEdit={handleStartContentEdit}
                                                endEdit={handleEndContentEdit}
                                                editing={handleContentEditing}
                                                checkSaved={handleCheckContentSaved}
                                                cancelSaved={handleCancelContentSaved}
                                              />
                                            }
                                            { index1 === 2 && (
                                              content['2'] ?
                                                <DetailLabelItem
                                                  key={2}
                                                  defaultText={content['3']}
                                                  saved={savedContentValues}
                                                  name={"maker." + index1}
                                                  title={t('common.maker')}
                                                  checkEdit={handleCheckContentEditState}
                                                  startEdit={handleStartContentEdit}
                                                  endEdit={handleEndContentEdit}
                                                  editing={handleContentEditing}
                                                  checkSaved={handleCheckContentSaved}
                                                  cancelSaved={handleCancelContentSaved}
                                                />
                                                :
                                                <DetailLabelItem
                                                  key={2}
                                                  defaultText={content['3']}
                                                  saved={savedContentValues}
                                                  name={"maker." + index1}
                                                  title={t('common.maker')}
                                                  no_border={true}
                                                  checkEdit={handleCheckContentEditState}
                                                  startEdit={handleStartContentEdit}
                                                  endEdit={handleEndContentEdit}
                                                  editing={handleContentEditing}
                                                  checkSaved={handleCheckContentSaved}
                                                  cancelSaved={handleCancelContentSaved}
                                                />
                                            )}
                                            { quotationHeaders.map((value, index2) => (
                                              value.at(0) !== "1" && value.at(0) !== "2" && 
                                                <tr key={index2}>
                                                  <td>{value.at(1)}</td>
                                                  <td>{content[value.at(0)]}</td>
                                                </tr>
                                            ))}
                                            { content['998'] && 
                                              <tr key={998}>
                                                <td className="border-0">Comment</td>
                                                <td className="border-0">{content['998']}</td>
                                              </tr>
                                            }
                                          </tbody>
                                        </table>
                                      </Panel>
                                    </Collapse>
                              )})}
                            </div>
                          </div>
                        </div>
{/*---- End   -- Tab : Product Lists - Quotation ---------------------------------------------------*/}
{/*---- Start -- Tab : PDF View - Quotation --------------------------------------------------------*/}
                        <div className="tab-pane task-related p-0" id="quotation-pdf-view">
                          { selectedQuotation && (selectedQuotation.quotation_contents.length > 0) &&
                            <QuotationView/>
                          }
                        </div>
{/*---- End   -- Tab : PDF View - Quotation---------------------------------------------------------*/}
                      </div>
                      { savedValues !== null &&
                        Object.keys(savedValues).length !== 0 && (
                          <div className="text-center py-3">
                            <button
                              type="button"
                              className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                              onClick={handleSaveAll}
                            >
                              Save
                            </button>
                            &nbsp;&nbsp;
                            <button
                              type="button"
                              className="btn btn-secondary btn-rounded"
                              onClick={handleCancelAll}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
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
    </>
  );
};

export default QuotationsDetailsModel;

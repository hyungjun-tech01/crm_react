import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { CircleImg, SystemUser } from "../imagepath";
import { Collapse } from "antd";
import { atomCurrentTransaction, defaultTransaction } from "../../atoms/atoms";
import { TransactionRepo } from "../../repository/transaction";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailDateItem from "../../constants/DetailDateItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import TransactionView from "./TransactionView";
import { ConverTextAmount } from "../../constants/functions";

const TransactionsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedTransaction = useRecoilValue(atomCurrentTransaction);
  const { modifyTransaction } = useRecoilValue(TransactionRepo);
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const { t } = useTranslation();

  const [editedValues, setEditedValues] = useState(null);
  const [savedValues, setSavedValues] = useState(null);
  
  const [ orgPublishDate, setOrgPublishDate ] = useState(null);
  const [ publishDate, setPublishDate ] = useState(new Date());

  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedTransaction[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedTransaction]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if (editedValues[name] === selectedTransaction[name]) {
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
  }, [editedValues, savedValues, selectedTransaction]);

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
      selectedTransaction &&
      selectedTransaction !== defaultTransaction
    ) {
      const temp_all_saved = {
        ...savedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        transaction_code: selectedTransaction.transaction_code,
      };
      if (modifyTransaction(temp_all_saved)) {
        console.log(`Succeeded to modify transaction`);
      } else {
        console.error("Failed to modify transaction");
      }
    } else {
      console.log("[ TransactionDetailModel ] No saved data");
    }
    setEditedValues(null);
    setSavedValues(null);
  }, [
    cookies.myLationCrmUserId,
    modifyTransaction,
    savedValues,
    selectedTransaction,
  ]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
  }, []);

  // --- Funtions for Publish Date ---------------------------------
  const handleStartPublishDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      publish_date: orgPublishDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgPublishDate]);
  const handlePublishDateChange = useCallback((time) => {
    setPublishDate(time);
  }, []);
  const handleEndPublishDateEdit = useCallback(() => {
    if (publishDate !== orgPublishDate) {
      const tempSaved = {
        ...savedValues,
        publish_date: publishDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.publish_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgPublishDate, publishDate]);

  useEffect(() => {
    console.log("[TransactionDetailsModel] called!");
    setOrgPublishDate(
      selectedTransaction.publish_date
      ? new Date(selectedTransaction.publish_date)
      : null
    );
  }, [selectedTransaction, savedValues]);

  return (
    <div
      className="modal right fade"
      id="transactions-details"
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
          <div className="modal-body">
            <div className="tab-content pipeline-tabs border-0">
              <div className="">
                <div className="task-infos">
                  <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        to="#transaction-details"
                        data-bs-toggle="tab"
                      >
                        {t('common.details')}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#transaction-view"
                        data-bs-toggle="tab"
                      >
                        {t('common.view')}
                      </Link>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div
                      className="tab-pane show active p-0"
                      id="transaction-details"
                    >
                      <div className="crms-tasks">
                        <div className="tasks__item crms-task-item active">
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                            <Panel header={t('transaction.information')} key="1">
                              <table className="table">
                                <tbody>
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.transaction_title}
                                    saved={savedValues}
                                    name="transaction_title"
                                    title={t('common.title')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.transaction_type}
                                    saved={savedValues}
                                    name="transaction_type"
                                    title={t('transaction.type')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailDateItem
                                    saved={savedValues}
                                    name="publish_date"
                                    title={t('transaction.publish_date')}
                                    orgTimeData={orgPublishDate}
                                    timeData={publishDate}
                                    timeDataChange={handlePublishDateChange}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartPublishDateEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndPublishDateEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.publish_type}
                                    saved={savedValues}
                                    name="publish_type"
                                    title={t('transaction.publish_type')}
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
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                            <Panel header={t('company.information')} key="1">
                              <table className="table">
                                <tbody>
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.company_name}
                                    saved={savedValues}
                                    name="company_name"
                                    title={t('company.company_name')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.ceo_name}
                                    saved={savedValues}
                                    name="ceo_name"
                                    title={t('company.ceo_name')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailTextareaItem
                                    defaultText={selectedTransaction.company_address}
                                    saved={savedValues}
                                    name="company_address"
                                    title={t('company.address')}
                                    row_no={2}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.business_type}
                                    saved={savedValues}
                                    name="business_type"
                                    title={t('company.business_type')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.business_item}
                                    saved={savedValues}
                                    name="business_item"
                                    title={t('company.business_item')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.business_registration_code}
                                    saved={savedValues}
                                    name="business_registration_code"
                                    title={t('company.business_registration_code')}
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
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                            <Panel header={t('transaction.price_info')} key="1">
                              <table className="table">
                                <tbody>
                                  <DetailLabelItem
                                    defaultText={ConverTextAmount(selectedTransaction.supply_price)}
                                    saved={savedValues}
                                    name="supply_price"
                                    title={t('transaction.supply_price')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={ConverTextAmount(selectedTransaction.tax_price)}
                                    saved={savedValues}
                                    name="tax_price"
                                    title={t('transaction.tax_price')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={ConverTextAmount(selectedTransaction.total_price)}
                                    saved={savedValues}
                                    name="total_price"
                                    title={t('transaction.total_price')}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                  <DetailLabelItem
                                    defaultText={selectedTransaction.currency}
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
                                    defaultText={selectedTransaction.payment_type}
                                    saved={savedValues}
                                    name="payment_type"
                                    title={t('transaction.payment_type')}
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
                    <div
                      className="tab-pane p-0"
                      id="transaction-view"
                    >
                      <TransactionView />
                    </div>
                  </div>
                  { savedValues !== null && Object.keys(savedValues).length !== 0 &&
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
    </div>
  );
};

export default TransactionsDetailsModel;

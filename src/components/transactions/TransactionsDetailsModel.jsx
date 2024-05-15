import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";
import { atomCurrentTransaction, defaultTransaction } from "../../atoms/atoms";
import { TransactionRepo } from "../../repository/transaction";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import TransactionView from "./TransactionView";
import { ConverTextAmount } from "../../constants/functions";

const TransactionsDetailsModel = () => {
  const selectedTransaction = useRecoilValue(atomCurrentTransaction);
  const { modifyTransaction, setCurrentTransaction } = useRecoilValue(TransactionRepo);
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const { t } = useTranslation();

  const [editedValues, setEditedValues] = useState(null);
  const [savedValues, setSavedValues] = useState(null);
  
  const [ orgPublishDate, setOrgPublishDate ] = useState(null);
  const [ publishDate, setPublishDate ] = useState(new Date());
  const [ isFullscreen, setIsFullscreen ] = useState(false);

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

  const handleWidthChange = useCallback((checked) => {
    setIsFullscreen(checked);
  }, []);

  const transaction_items_info = [
    ['transaction_title','transaction.title',{ type:'label',extra:'long' }],
    ['transaction_type','transaction.type',{ type:'label' }],
    ['publish_type','transaction.publish_type',{ type:'label' }],
    ['payment_type','transaction.payment_type',{ type:'label' }],
    ['currency','common.currency',{ type:'label' }],
    ['publish_date','transaction.publish_date',
      { type:'date', time: true, orgTimeData: orgPublishDate, timeData: publishDate, timeDataChange: handlePublishDateChange, startEditTime: handleStartPublishDateEdit, endEditTime: handleEndPublishDateEdit }
    ],
    ['supply_price','transaction.supply_price',{ type:'label' }],
    ['tax_price','transaction.tax_price',{ type:'label' }],
    ['total_price','transaction.total_price',{ type:'label' }],
    ['company_address','company.address',{ type:'label',extra:'long' }],
    ['business_type','company.business_type',{ type:'label' }],
    ['business_item','company.business_item',{ type:'label' }],
  ];

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
      <div className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="row w-100">
              <DetailTitleItem
                defaultText={selectedTransaction.company_name}
                saved={savedValues}
                name='company_name'
                title={t('company.company_name')}
                type='col-md-4'
                checkEdit={handleCheckEditState}
                startEdit={handleStartEdit}
                endEdit={handleEndEdit}
                editing={handleEditing}
                checkSaved={handleCheckSaved}
                cancelSaved={handleCancelSaved}
              />
              <DetailTitleItem
                defaultText={selectedTransaction.ceo_name}
                saved={savedValues}
                name='ceo_name'
                title={t('company.ceo_name')}
                checkEdit={handleCheckEditState}
                startEdit={handleStartEdit}
                endEdit={handleEndEdit}
                editing={handleEditing}
                checkSaved={handleCheckSaved}
                cancelSaved={handleCancelSaved}
              />
              <DetailTitleItem
                defaultText={selectedTransaction.business_registration_code}
                saved={savedValues}
                name='business_registration_code'
                title={t('company.business_registration_code')}
                checkEdit={handleCheckEditState}
                startEdit={handleStartEdit}
                endEdit={handleEndEdit}
                editing={handleEditing}
                checkSaved={handleCheckSaved}
                cancelSaved={handleCancelSaved}
              />
            </div>
            <Switch checkedChildren="full" onChange={handleWidthChange}/>
            <button
              type="button"
              className="btn-close xs-close"
              data-bs-dismiss="modal"
              onClick={() => setCurrentTransaction()}
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
                          <Space
                            align="start"
                            direction="horizontal"
                            size="small"
                            style={{ display: 'flex', marginBottom: '0.5rem' }}
                            wrap
                          >
                            { transaction_items_info.map((item, index) => 
                              <DetailCardItem
                                key={index}
                                defaultText={selectedTransaction[item.at(0)]}
                                edited={editedValues}
                                saved={savedValues}
                                name={item.at(0)}
                                title={t(item.at(1))}
                                detail={item.at(2)}
                                checkEdit={handleCheckEditState}
                                startEdit={handleStartEdit}
                                editing={handleEditing}
                                endEdit={handleEndEdit}
                                checkSaved={handleCheckSaved}
                                cancelSaved={handleCancelSaved}
                              />
                            )}
                          </Space>
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

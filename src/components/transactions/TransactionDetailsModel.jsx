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

const TransactionDetailsModel = () => {
  const selectedTransaction = useRecoilValue(atomCurrentTransaction);
  const { modifyTransaction, setCurrentTransaction } = useRecoilValue(TransactionRepo);
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const { t } = useTranslation();

  const [ isFullScreen, setIsFullScreen ] = useState(false);

  const [editedValues, setEditedValues] = useState(null);
  const [ orgPublishDate, setOrgPublishDate ] = useState(null);

  // --- Funtions for Editing ---------------------------------
  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleSaveAll = useCallback(() => {
    if (
      editedValues !== null &&
      selectedTransaction &&
      selectedTransaction !== defaultTransaction
    ) {
      const temp_all_saved = {
        ...editedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        transaction_code: selectedTransaction.transaction_code,
      };
      if (modifyTransaction(temp_all_saved)) {
        console.log(`Succeeded to modify transaction`);
        if(editedValues.publish_date){
          setOrgPublishDate(editedValues.publish_date);
        };
      } else {
        console.error("Failed to modify transaction");
      }
    } else {
      console.log("[ TransactionDetailModel ] No saved data");
    }
    setEditedValues(null);
  }, [
    cookies.myLationCrmUserId,
    modifyTransaction,
    editedValues,
    selectedTransaction,
  ]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
  }, []);

  // --- Funtions for Specific Changes in Detail ---------------------------------
  const handleDateChange = useCallback((name, date) => {
    const tempEdited = {
      ...editedValues,
      [name]: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  // --- Funtions for Control Windows ---------------------------------
  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  const handleClose = useCallback(() => {
    setEditedValues(null);
    setCurrentTransaction();
  }, []);

  const transaction_items_info = [
    ['transaction_title','transaction.title',{ type:'label', extra:'long' }],
    ['transaction_type','transaction.type',{ type:'label' }],
    ['publish_type','transaction.publish_type',{ type:'label' }],
    ['payment_type','transaction.payment_type',{ type:'label' }],
    ['currency','common.currency',{ type:'label' }],
    ['publish_date','transaction.publish_date',{ type:'date', orgTimeData: orgPublishDate, timeDataChange: handleDateChange }],
    ['supply_price','transaction.supply_price',{ type:'label' }],
    ['tax_price','transaction.tax_price',{ type:'label' }],
    ['total_price','transaction.total_price',{ type:'label' }],
    ['company_address','company.address',{ type:'label', extra:'long' }],
    ['business_type','company.business_type',{ type:'label' }],
    ['business_item','company.business_item',{ type:'label', extra:'long' }],
  ];

  useEffect(() => {
    if(selectedTransaction !== defaultTransaction) {
      console.log("[TransactionDetailsModel] called!");
      setOrgPublishDate(
        selectedTransaction.publish_date
        ? new Date(selectedTransaction.publish_date)
        : null
      );

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if(detailViewStatus === null){
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if(detailViewStatus === '0'){
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };
    };
  }, [selectedTransaction, editedValues]);

  return (
    <div
      className="modal right fade"
      id="transactions-details"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="row w-100">
              <DetailTitleItem
                original={selectedTransaction.company_name}
                name='company_name'
                title={t('company.company_name')}
                size='col-md-4'
                onEditing={handleEditing}
              />
              <DetailTitleItem
                original={selectedTransaction.ceo_name}
                name='ceo_name'
                title={t('company.ceo_name')}
                onEditing={handleEditing}
              />
              <DetailTitleItem
                original={selectedTransaction.business_registration_code}
                name='business_registration_code'
                title={t('company.business_registration_code')}
                onEditing={handleEditing}
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
                                name={item.at(0)}
                                title={t(item.at(1))}
                                detail={item.at(2)}
                                editing={handleEditing}
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
                  { editedValues !== null && Object.keys(editedValues).length !== 0 &&
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

export default TransactionDetailsModel;

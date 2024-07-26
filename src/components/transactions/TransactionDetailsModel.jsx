import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";
import { atomTransactionState, atomCurrentTransaction, defaultTransaction } from "../../atoms/atoms";
import { TransactionRepo } from "../../repository/transaction";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import TransactionView from "./TransactionView";


const TransactionDetailsModel = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);


  //===== [RecoilState] Related with Transaction ======================================
  const transactionState = useRecoilValue(atomTransactionState);
  const selectedTransaction = useRecoilValue(atomCurrentTransaction);
  const { modifyTransaction, setCurrentTransaction } = useRecoilValue(TransactionRepo);


  //===== Handles to deal this component ==============================================
  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [ currentTransactionCode, setCurrentTransactionCode ] = useState('');

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  
  //===== Handles to edit 'Quotation Details' =========================================
  const [editedDetailValues, setEditedDetailValues] = useState({});

  const handleDetailChange = useCallback((e) => {
    if (e.target.value !== selectedTransaction[e.target.name]) {
      const tempEdited = {
        ...editedDetailValues,
        [e.target.name]: e.target.value,
      };
      setEditedDetailValues(tempEdited);
    } else {
      if(editedDetailValues[e.target.name]){
        delete editedDetailValues[e.target.name];
      };
    };
  }, [editedDetailValues, selectedTransaction]);

  const handleDetailDateChange = useCallback((name, date) => {
    if (date !== new Date(selectedTransaction[name])) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: date,
      };
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues, selectedTransaction]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    if(selected.value !== selectedTransaction[name]){
      const tempEdited = {
        ...editedDetailValues,
        [name]: selected.value,
      }
      setEditedDetailValues(tempEdited);
    }
  }, [editedDetailValues, selectedTransaction]);

  const handleSaveAll = useCallback(() => {
    if (
      editedDetailValues !== null &&
      selectedTransaction &&
      selectedTransaction !== defaultTransaction
    ) {
      const temp_all_saved = {
        ...editedDetailValues,
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
    setEditedDetailValues({});
  }, [
    cookies.myLationCrmUserId,
    modifyTransaction,
    editedDetailValues,
    selectedTransaction,
  ]);

  const handleCancelAll = useCallback(() => {
    setEditedDetailValues({});
  }, []);


  // --- Funtions for Control Windows ---------------------------------
  const handleClose = useCallback(() => {
    setEditedDetailValues({});
    setCurrentTransaction();
  }, []);

  const transaction_items_info = [
    { key:'transaction_title',title:'transaction.title',detail:{ type:'label',extra:'long',editing:handleDetailChange }},
    { key:'transaction_type',title:'transaction.type',detail:{ type:'label',editing:handleDetailChange }},
    { key:'publish_type',title:'transaction.publish_type',detail:{ type:'label',editing:handleDetailChange }},
    { key:'payment_type',title:'transaction.payment_type',detail:{ type:'label',editing:handleDetailChange }},
    { key:'currency',title:'common.currency',detail:{ type:'label',editing:handleDetailChange }},
    { key:'publish_date',title:'transaction.publish_date',detail:{ type:'date',editing:handleDetailChange }},
    { key:'supply_price',title:'transaction.supply_price',detail:{ type:'label',editing:handleDetailChange }},
    { key:'tax_price',title:'transaction.tax_price',detail:{ type:'label',editing:handleDetailChange }},
    { key:'total_price',title:'transaction.total_price',detail:{ type:'label',editing:handleDetailChange }},
    { key:'company_address',title:'company.address',detail:{ type:'label', extra:'long',editing:handleDetailChange }},
    { key:'business_type',title:'company.business_type',detail:{ type:'label',editing:handleDetailChange }},
    { key:'business_item',title:'company.business_item',detail:{ type:'label', extra:'long',editing:handleDetailChange }},
  ];

  useEffect(() => {
    if((selectedTransaction !== defaultTransaction)
      && (selectedTransaction.transaction_code !== currentTransactionCode)
      && ((transactionState & 1) === 1)
     ) {
      console.log("[TransactionDetailsModel] useEffect!");

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if(detailViewStatus === null){
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if(detailViewStatus === '0'){
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      setCurrentTransactionCode(selectedTransaction.transaction_code);
    };
  }, [selectedTransaction, editedDetailValues, currentTransactionCode]);

  return (
    <div
      className="modal right fade"
      id="transaction-details"
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
                onEditing={handleDetailChange}
              />
              <DetailTitleItem
                original={selectedTransaction.ceo_name}
                name='ceo_name'
                title={t('company.ceo_name')}
                onEditing={handleDetailChange}
              />
              <DetailTitleItem
                original={selectedTransaction.business_registration_code}
                name='business_registration_code'
                title={t('company.business_registration_code')}
                onEditing={handleDetailChange}
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
                                defaultValue={selectedTransaction[item.key]}
                                edited={editedDetailValues}
                                name={item.key}
                                title={t(item.title)}
                                detail={item.detail}
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
    </div>
  );
};

export default TransactionDetailsModel;

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";
import { C_logo,  } from "../imagepath";
import { option_locations, option_deal_type } from '../../constants/constans';

import { 
  atomCurrentCompany,
  defaultCompany,
  atomAllPurchases,
  atomPurchaseState,
  atomAllTransactions,
  atomTransationState,
} from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { TransactionRepo } from "../../repository/transaction";
import { PurchaseRepo } from "../../repository/purchase";
import { MAContractRepo } from "../../repository/ma_contract";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import CompanyPurchaseModel from "./CompanyPurchaseModel";
import CompanyTransactionModel from "./CompanyTransactionModel";

const CompanyDetailsModel = () => {
  const purchaseState = useRecoilValue(atomPurchaseState);
  const transactionState = useRecoilValue(atomTransationState);
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const allPurchases = useRecoilValue(atomAllPurchases);
  const { loadAllPurchases} = useRecoilValue(PurchaseRepo);
  const { loadCompanyMAContracts } = useRecoilValue(MAContractRepo);
  const allTransactions = useRecoilValue(atomAllTransactions);
  const { loadAllTransactions } = useRecoilValue(TransactionRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
  const { t } = useTranslation();

  // --- Handles to deal this component ---------------------------------------
  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [ currentCompanyCode, setCurrentCompanyCode ] = useState('');

  const handleWindowWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  const handleClose = useCallback(() => {
    setEditedDetailValues(null);
    setCurrentCompany();
    setCurrentCompanyCode('');
  }, []);
  

  // --- Handles to edit 'Company Details' ---------------------------------
  const [ validMACount, setValidMACount ] = useState(0);
  const [ editedDetailValues, setEditedDetailValues ] = useState(null);
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);
  const [ purchasesByCompany, setPurchasesByCompany] = useState([]);
  const [ transactionByCompany, setTransactionByCompany] = useState([]);

  const handleDetailEdit = useCallback((e) => {
    const tempEdited = {
      ...editedDetailValues,
      [e.target.name]: e.target.value,
    };
    setEditedDetailValues(tempEdited);
  }, [editedDetailValues]);

  const handleDetailSave = useCallback(() => {
    if(editedDetailValues !== null
      && selectedCompany !== defaultCompany)
    {
      const temp_all_saved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        company_code: selectedCompany.company_code,
      };
      if (modifyCompany(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
        if(editedDetailValues.establishment_date){
          setOrgEstablishDate(editedDetailValues.establishment_date);
        };
      } else {
        console.error('Failed to modify company')
      }
    } else {
      console.log("[ CompanyDetailModel ] No saved data");
    };
    setEditedDetailValues(null);
  }, [cookies.myLationCrmUserId, modifyCompany, editedDetailValues, selectedCompany]);

  const handleDetailCancel = useCallback(() => {
    setEditedDetailValues(null);
  }, []);

  const handleDetailDateChange = useCallback((name, date) => {
    const tempEdited = {
      ...editedDetailValues,
      [name]: date,
    };
    setEditedDetailValues(tempEdited);
  }, [editedDetailValues]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    const tempEdited = {
      ...editedDetailValues,
      [name]: selected.value,
    };
    setEditedDetailValues(tempEdited);
  }, [editedDetailValues]);

  const company_items_info = [
    ['company_address','common.address',{ type:'label', extra:'long' }],
    ['company_phone_number','common.phone_no',{ type:'label' }],
    ['company_zip_code','common.zip_code',{ type:'label' }],
    ['company_fax_number','common.fax_no',{ type:'label' }],
    ['homepage','company.homepage',{ type:'label' }],
    ['company_scale','company.company_scale',{ type:'label' }],
    ['deal_type','company.deal_type', { type:'select', options: option_deal_type.ko, selectChange: (selected) => handleDetailSelectChange('deal_type', selected) }],
    ['industry_type','company.industry_type',{ type:'label' }],
    ['business_type','company.business_type',{ type:'label' }],
    ['business_item','company.business_item',{ type:'label' }],
    ['establishment_date','company.establishment_date',
      { type:'date', orgTimeData: orgEstablishDate, timeDataChange: handleDetailDateChange }
    ],
    ['ceo_name','company.ceo_name',{ type:'label' }],
    ['account_code','company.account_code',{ type:'label' }],
    ['bank_name','company.bank_name',{ type:'label' }],
    ['account_owner','company.account_owner',{ type:'label' }],
    ['sales_resource','company.salesman',{ type:'label' }],
    ['application_engineer','company.engineer',{ type:'label' }],
    ['region','common.region', { type:'select', options: option_locations.ko, selectChange: (selected) => handleDetailSelectChange('region', selected) }],
    ['memo','common.memo',{ type:'textarea', extra:'long' }],
  ];


  // ----- useEffect for Company -----------------------------------
  useEffect(() => {
    console.log('[CompanyDetailModel] useEffect / Company');
    if((selectedCompany !== defaultCompany)
      && (selectedCompany.company_code !== currentCompanyCode))
    {
      console.log('[CompanyDetailsModel] new company is loaded!');

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if(detailViewStatus === null){
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if(detailViewStatus === '0'){
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      loadCompanyMAContracts(selectedCompany.company_code);
      setCurrentCompanyCode(selectedCompany.company_code);
    };
  }, [selectedCompany, currentCompanyCode, loadCompanyMAContracts]);

  // ----- useEffect for Purchase -----------------------------------
  useEffect(() => {
    console.log('[CompanyDetailModel] useEffect / Purchase');
    if((purchaseState & 1) === 0) {
      console.log('[CompanyDetailsModel] loadAllPurchases');
      loadAllPurchases();
    } else {
      const tempCompanyPurchases = allPurchases.filter(purchase => purchase.company_code === selectedCompany.company_code);
      if(purchasesByCompany.length !== tempCompanyPurchases.length) {
        console.log('[CompanyDetailsModel] set purchasesBycompany / set MA Count');
        setPurchasesByCompany(tempCompanyPurchases);

        let valid_count = 0;
        tempCompanyPurchases.forEach(item => {
          if(item.ma_finish_date && (new Date(item.ma_finish_date) > Date.now())) valid_count++;
        });
        setValidMACount(valid_count);
      };
    };
  }, [purchaseState, allPurchases, purchasesByCompany, loadAllPurchases, selectedCompany.company_code]);

  // ----- useEffect for Transaction -----------------------------------
  useEffect(() => {
    if((transactionState & 1) === 0) {
      console.log('CompanyDetailsModel / loadAllTransactions');
      loadAllTransactions();
    } else {
      const tempCompanyTransactions = allTransactions.filter(transaction => transaction.company_name === selectedCompany.company_name);
      if(transactionByCompany.length !== tempCompanyTransactions.length) {
        console.log('CompanyDetailsModel / update setTransactionByCompany');
        setTransactionByCompany(tempCompanyTransactions);
      };
    }
  }, [transactionState, allTransactions, loadAllTransactions, transactionByCompany.length, selectedCompany.company_name]);

  return (
    <div
      className="modal right fade"
      id="company-details"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      data-bs-focus="false"
    >
      <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="row w-100">
              <div className="col-md-4 account d-flex">
                <div className="company_img">
                  <img src={C_logo} alt="User" className="user-image" />
                </div>
                <div>
                  <p className="mb-0"><b>{t('company.company')}</b></p>
                  <span className="modal-title">
                    {selectedCompany.company_name}
                  </span>
                </div>
              </div>
              <DetailTitleItem
                defaultText={selectedCompany.company_name_eng}
                name='company_name_eng'
                title={t('company.eng_company_name')}
                onEditing={handleDetailEdit}
              />
              <DetailTitleItem
                defaultText={selectedCompany.business_registration_code}
                name='business_registration_code'
                title={t('company.business_registration_code')}
                onEditing={handleDetailEdit}
              />
            </div>
            <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWindowWidthChange}/>
            <button
              type="button"
              className="btn-close xs-close"
              data-bs-dismiss="modal"
              onClick={ handleClose }
            />
          </div>
          <div className="modal-body">
            <div className="task-infos">
              <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to="#company-details-info"
                    data-bs-toggle="tab"
                  >
                    {t('common.details')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#company-details-product"
                    data-bs-toggle="tab"
                  >
                    {t('purchase.product_info') + "(" + validMACount + "/" + purchasesByCompany.length + ")"}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#company-details-transaction"
                    data-bs-toggle="tab"
                  >
                    {t('transaction.statement_of_account') + "(" + transactionByCompany.length + ")"}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#company-details-tax-invoice"
                    data-bs-toggle="tab"
                  >
                    {t('transaction.tax_invoice')}
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#task-news"
                    data-bs-toggle="tab"
                  >
                    News
                  </Link>
                </li> */}
              </ul>
              <div className="tab-content">
                <div className="tab-pane show active" id="company-details-info">
                  <div className="crms-tasks">
                    <div className="tasks__item crms-task-item">
                      <div className="row">
                        <Space
                          align="start"
                          direction="horizontal"
                          size="small"
                          style={{ display: 'flex', marginBottom: '0.5rem' }}
                          wrap
                        >
                          { company_items_info.map((item, index) => 
                            <DetailCardItem
                              key={index}
                              title={t(item.at(1))}

                              defaultValue={selectedCompany[item.at(0)]}
                              edited={editedDetailValues}
                              name={item.at(0)}
                              detail={item.at(2)}
                              editing={handleDetailEdit}
                            />
                          )}
                        </Space>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane company-details-product" id="company-details-product">
                  <CompanyPurchaseModel 
                    company={selectedCompany}
                    purchases={purchasesByCompany}
                    handlePurchase={setPurchasesByCompany} />
                </div>
                <div className="tab-pane company-details-transaction" id="company-details-transaction">
                  <CompanyTransactionModel transactions={transactionByCompany} />
                </div>
              </div>
              { editedDetailValues !== null && Object.keys(editedDetailValues).length !== 0 &&
                <div className="text-center py-3">
                  <button
                    type="button"
                    className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                    onClick={handleDetailSave}
                  >
                    {t('common.save')}
                  </button>
                  &nbsp;&nbsp;
                  <button
                    type="button"
                    className="btn btn-secondary btn-rounded"
                    onClick={handleDetailCancel}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
        {/* modal-content */}
      </div>
    </div>
  );
};

export default CompanyDetailsModel;

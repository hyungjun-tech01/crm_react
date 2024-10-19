import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";
import { C_logo } from "../imagepath";
import { option_locations, option_deal_type } from "../../constants/constants";

import {
  atomCurrentCompany,
  atomPurchaseByCompany,
  atomTaxInvoiceByCompany,
  atomTransactionByCompany,
  defaultCompany,
} from "../../atoms/atoms";
import {
  atomEngineersForSelection,
  atomSalespersonsForSelection,
} from "../../atoms/atomsUser";
import { CompanyRepo } from "../../repository/company";
import { TransactionRepo } from "../../repository/transaction";
import { PurchaseRepo } from "../../repository/purchase";
import { MAContractRepo } from "../../repository/ma_contract";
import { TaxInvoiceRepo } from "../../repository/tax_invoice";
import { SettingsRepo } from "../../repository/settings";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import CompanyPurchaseModel from "./CompanyPurchaseModel";
import CompanyTransactionModel from "./CompanyTransactionModel";
import CompanyTaxInvoiceModel from "./CompanyTaxInvoiceModel";
import PurchaseAddModel from "../purchase/PurchaseAddModel";
import PurchaseDetailsModel from "../purchase/PurchaseDetailsModel";
import TransactionEditModel from "../transactions/TransactionEditModel";
import TaxInvoiceEditModel from "../taxinvoice/TaxInvoiceEditModel";


const CompanyDetailsModel = ({ init, handleInit }) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);


  //===== [RecoilState] Related with Company ==========================================
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Purchase =========================================
  const [ purchaseByCompany, setPurchasesByCompany ] = useRecoilState(atomPurchaseByCompany);
  const { searchPurchases } = useRecoilValue(PurchaseRepo);
  const { loadCompanyMAContracts } = useRecoilValue(MAContractRepo);


  //===== [RecoilState] Related with Transaction ======================================
  const [ transactionByCompany, setTransactionByCompany ] = useRecoilState(atomTransactionByCompany);
  const { searchTransactions } = useRecoilValue(TransactionRepo);


  //===== [RecoilState] Related with Tax Invoice ======================================
  const [ taxInvoiceByCompany, setTaxInvoiceByCompany ] = useRecoilState(atomTaxInvoiceByCompany);
  const { searchTaxInvoices } = useRecoilValue(TaxInvoiceRepo);


  //===== [RecoilState] Related with Users ============================================
  const engineerForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== [RecoilState] Related with Users ============================================
  const { closeModal } = useRecoilValue(SettingsRepo);


  //===== Handles to deal this component ==============================================
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentCompanyCode, setCurrentCompanyCode] = useState("");
  const [ openTransaction, setOpenTransaction ] = useState(false);
  const [ openTaxInvoice, setOpenTaxInvoice ] = useState(false);
  const [ taxInvoiceData, setTaxInvoiceData ] = useState(null);
  const [ taxInvoiceContents, setTaxInvoiceContents ] = useState(null);

  const handleWindowWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if (checked) localStorage.setItem("isFullScreen", "1");
    else localStorage.setItem("isFullScreen", "0");
  }, []);


  //===== Handles to edit 'Company Details' ============================================
  const [editedDetailValues, setEditedDetailValues] = useState(null);
  const [initAddPurchase, setInitAddPurchase] = useState(false);
  const [validMACount, setValidMACount] = useState(0);

  const handleDetailChange = useCallback(
    (e) => {
      if (e.target.value !== selectedCompany[e.target.name]) {
        const tempEdited = {
          ...editedDetailValues,
          [e.target.name]: e.target.value,
        };
        setEditedDetailValues(tempEdited);
      } else {
        if (editedDetailValues[e.target.name]) {
          delete editedDetailValues[e.target.name];
        }
      }
    },
    [editedDetailValues, selectedCompany]
  );

  const handleDetailDateChange = useCallback(
    (name, date) => {
      if (date !== new Date(selectedCompany[name])) {
        const tempEdited = {
          ...editedDetailValues,
          [name]: date,
        };
        setEditedDetailValues(tempEdited);
      }
    },
    [editedDetailValues, selectedCompany]
  );

  const handleDetailSelectChange = useCallback(
    (name, selected) => {
      if (selected.value !== selectedCompany[name]) {
        const tempEdited = {
          ...editedDetailValues,
          [name]: selected.value,
        };
        setEditedDetailValues(tempEdited);
      }
    },
    [editedDetailValues, selectedCompany]
  );

  const handleDetailAddressChange = useCallback(
    (obj) => {
      const tempEdited = {
        ...editedDetailValues,
        ...obj,
      };
      setEditedDetailValues(tempEdited);
    },
    [editedDetailValues]
  );

  const handleDetailSave = useCallback(() => {
    if (editedDetailValues !== null && selectedCompany !== defaultCompany) {
      const temp_all_saved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        company_code: selectedCompany.company_code,
      };
      const resp = modifyCompany(temp_all_saved);
      resp.then(res => {
        if (res.result) {
          handleClose();
        } else {
          console.error("Failed to modify company : ", res.data);
        };
      });
    } else {
      console.log("[ CompanyDetailModel ] No saved data");
    }
    setEditedDetailValues(null);
  }, [
    cookies.myLationCrmUserId,
    modifyCompany,
    editedDetailValues,
    selectedCompany,
  ]);

  const company_items_info = [
    {
      key: "company_address",
      title: "common.address",
      detail: {
        type: "address",
        extra: "long",
        key_zip: "company_zip_code",
        editing: handleDetailAddressChange,
      },
    },
    {
      key: "company_phone_number",
      title: "common.phone_no",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "company_zip_code",
      title: "common.zip_code",
      detail: { type: "label", editing: handleDetailChange, disabled: true },
    },
    {
      key: "company_fax_number",
      title: "common.fax_no",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "homepage",
      title: "company.homepage",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "company_scale",
      title: "company.company_scale",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "deal_type",
      title: "company.deal_type",
      detail: {
        type: "select",
        options: option_deal_type.ko,
        editing: handleDetailSelectChange,
      },
    },
    {
      key: "industry_type",
      title: "company.industry_type",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "business_type",
      title: "company.business_type",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "business_item",
      title: "company.business_item",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "establishment_date",
      title: "company.establishment_date",
      detail: { type: "date", editing: handleDetailDateChange },
    }, 
    {
      key: "site_id",
      title: "common.site_id",
      detail: { type: "label", editing: handleDetailChange },
    },     
    {
      key: "ceo_name",
      title: "company.ceo_name",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "account_code",
      title: "company.account_code",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "bank_name",
      title: "company.bank_name",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "account_owner",
      title: "company.account_owner",
      detail: { type: "label", editing: handleDetailChange },
    },
    {
      key: "sales_resource",
      title: "company.salesman",
      detail: {
        type: "select",
        options: salespersonsForSelection,
        editing: handleDetailSelectChange,
      },
    },        
    {
      key: "application_engineer",
      title: "company.engineer",
      detail: {
        type: "select",
        options: engineerForSelection,
        editing: handleDetailSelectChange,
      },
    },
    {
      key: "region",
      title: "common.region",
      detail: {
        type: "select",
        options: option_locations.ko,
        editing: handleDetailSelectChange,
      },
    },
    {
      key: "memo",
      title: "common.memo",
      detail: { type: "textarea", extra:"long",  editing: handleDetailChange },
    },
  ];

  const handleInitialize = () => {
    setEditedDetailValues(null);
  };
  
  const handleClose = useCallback(() => {
    setTimeout(() => {
      closeModal('initialize_company');
    }, 500);
  }, [closeModal]);

  //===== useEffect for Company ========================================================
  useEffect(() => {
    if (init) {
      const detailViewStatus = localStorage.getItem("isFullScreen");
      if (detailViewStatus === null) {
        localStorage.setItem("isFullScreen", "0");
        setIsFullScreen(false);
      } else if (detailViewStatus === "0") {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      if((selectedCompany === defaultCompany)
        || (selectedCompany.company_code === currentCompanyCode)
      ){
        handleInit(false);
        return;
      };

      loadCompanyMAContracts(selectedCompany.company_code);
      setCurrentCompanyCode(selectedCompany.company_code);

      // load purchase of selected company -----------
      const queryPurchase = searchPurchases('company_code', selectedCompany.company_code, true);
      queryPurchase
        .then(res => {
          if(res.result) {
            setPurchasesByCompany(res.data);

            let valid_count = 0;
            res.data.forEach((item) => {
              if (!!item.ma_finish_date && (new Date(item.ma_finish_date) > Date.now()))
                valid_count++;
            });
            setValidMACount(valid_count);
          } else {
            console.log('[CompanyDetailsModel] fail to get purchase :', res.message);
            setPurchasesByCompany([]);
            setValidMACount(0);
          };
        });

      // load transaction of selected company -----------
      const queryTransaction = searchTransactions('company_code', selectedCompany.company_code, true);
      queryTransaction
        .then(res => {
          if(res.result) {
            setTransactionByCompany(res.data);
          } else {
            console.log('[CompanyDetailsModel] fail to get quotation :', res.message);
            setTransactionByCompany([]);
          };
        });

      // load tax invoice of selected company -----------
      const queryTaxInvoice = searchTaxInvoices('company_code', selectedCompany.company_code, true);
      queryTaxInvoice
        .then(res => {
          if(res.result) {
            setTaxInvoiceByCompany(res.data);
          } else {
            console.log('[CompanyDetailsModel] fail to get tax invoice :', res.message);
            setTaxInvoiceByCompany([]);
          };
        });

      handleInitialize();
      handleInit(false);
    }
  }, [init, selectedCompany, currentCompanyCode, loadCompanyMAContracts, searchPurchases, searchTransactions, searchTaxInvoices, handleInit, setPurchasesByCompany, setTransactionByCompany, setTaxInvoiceByCompany]);


  return (
    <>
      <div
        className="modal right fade"
        id="company-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={isFullScreen ? "modal-fullscreen" : "modal-dialog"}
          role="document"
        >
          {!init &&
            <div className="modal-content">
              <div className="modal-header">
                <div className="row w-100">
                  <div className="col-md-4 account d-flex">
                    <div className="company_img">
                      <img src={C_logo} alt="User" className="user-image" />
                    </div>
                    <div>
                      <p className="mb-0">
                        <b>{t("company.company")}</b>
                      </p>
                      <span className="modal-title">
                        {selectedCompany.company_name}
                      </span>
                    </div>
                  </div>
                  <DetailTitleItem
                    original={selectedCompany}
                    name="company_name_en"
                    title={t("company.company_name_en")}
                    onEditing={handleDetailChange}
                  />
                  <DetailTitleItem
                    original={selectedCompany}
                    name="business_registration_code"
                    title={t("company.business_registration_code")}
                    onEditing={handleDetailChange}
                  />
                </div>
                <Switch
                  checkedChildren="full"
                  checked={isFullScreen}
                  onChange={handleWindowWidthChange}
                />
                <button
                  type="button"
                  className="btn-close xs-close"
                  onClick={handleClose}
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
                        {t("common.details")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#company-details-product"
                        data-bs-toggle="tab"
                      >
                        {t("purchase.product_info") +
                          "(" +
                          validMACount +
                          "/" +
                          purchaseByCompany.length +
                          ")"}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#company-details-transaction"
                        data-bs-toggle="tab"
                      >
                        {t("transaction.statement_of_account") +
                          "(" +
                          transactionByCompany.length +
                          ")"}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#company-details-taxinvoice"
                        data-bs-toggle="tab"
                      >
                        {t("transaction.tax_bill") +
                          "(" +
                          taxInvoiceByCompany.length +
                          ")"}
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
                              style={{ display: "flex", marginBottom: "0.5rem" }}
                              wrap
                            >
                              {company_items_info.map((item, index) => (
                                <DetailCardItem
                                  key={`${item.title}-${index}`}
                                  title={t(item.title)}
                                  defaultValue={selectedCompany[item.key]}
                                  edited={editedDetailValues}
                                  name={item.key}
                                  detail={item.detail}
                                />
                              ))}
                            </Space>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane company-details-product"
                      id="company-details-product"
                    >
                      <CompanyPurchaseModel
                        handleInitAddPurchase={setInitAddPurchase}
                      />
                    </div>
                    <div
                      className="tab-pane company-details-transaction"
                      id="company-details-transaction"
                    >
                      <CompanyTransactionModel
                        openTransaction={setOpenTransaction}
                      />
                    </div>
                    <div
                      className="tab-pane company-details-taxinvoice"
                      id="company-details-taxinvoice"
                    >
                      <CompanyTaxInvoiceModel
                        openTaxInvoice={setOpenTaxInvoice}
                      />
                    </div>
                  </div>
                  {editedDetailValues !== null &&
                    Object.keys(editedDetailValues).length !== 0 && (
                      <div className="text-center py-3">
                        <button
                          type="button"
                          className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          onClick={handleDetailSave}
                        >
                          {t("common.save")}
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className="btn btn-secondary btn-rounded"
                          onClick={handleClose}
                        >
                          {t("common.cancel")}
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <PurchaseAddModel init={initAddPurchase} handleInit={setInitAddPurchase} />
      <PurchaseDetailsModel />
      <TransactionEditModel
        open={openTransaction}
        close={() =>setOpenTransaction(false)}
        openTaxInvoice={()=>setOpenTaxInvoice(true)} 
        setTaxInvoiceData={setTaxInvoiceData}
        setTaxInvoiceContents={setTaxInvoiceContents}
      />
      <TaxInvoiceEditModel
        init={openTaxInvoice}
        handleInit={setOpenTaxInvoice}
        close={() => {
          setOpenTaxInvoice(false);
          setTaxInvoiceData(null);
          setTaxInvoiceContents(null);
        }}
        data={taxInvoiceData}
        contents={taxInvoiceContents}
      />
    </>
  );
};

export default CompanyDetailsModel;

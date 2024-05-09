import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Collapse } from "antd";
import { C_logo, C_logo2, CircleImg } from "../imagepath";
import { atomAllConsultings, atomAllLeads, atomAllPurchases, atomAllQuotations, atomAllTransactions, atomCurrentCompany, defaultCompany } from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { ConsultingRepo } from "../../repository/consulting";
import { QuotationRepo } from "../../repository/quotation";
import { TransactionRepo } from "../../repository/transaction";
import { PurchaseRepo } from "../../repository/purchase";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailDateItem from "../../constants/DetailDateItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import { MoreVert } from "@mui/icons-material";

const CompanyDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany } = useRecoilValue(CompanyRepo);
  const allLeads = useRecoilValue(atomAllLeads);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);
  const allConsultings = useRecoilValue(atomAllConsultings);
  const { loadAllConsultings } = useRecoilValue(ConsultingRepo);
  const allQuotations = useRecoilValue(atomAllQuotations);
  const { loadAllQuotations } = useRecoilValue(QuotationRepo);
  const allTransactions = useRecoilValue(atomAllTransactions);
  const { loadAllTransactions } = useRecoilValue(TransactionRepo);
  const allPurchases = useRecoilValue(atomAllPurchases);
  const { loadAllPurchases } = useRecoilValue(PurchaseRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);

  const [ editedValues, setEditedValues ] = useState(null);
  const [ savedValues, setSavedValues ] = useState(null);
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);
  const [ establishDate, setEstablishDate ] = useState(new Date());
  const [ orgCloseDate, setOrgCloseDate ] = useState(null);
  const [ closeDate, setCloseDate ] = useState(new Date());

  const [ leadsByCompany, setLeadsByCompany] = useState([]);
  const [ consultingByCompany, setConsultingByCompany] = useState([]);
  const [ quotationByCompany, setQuotationByCompany] = useState([]);
  const [ transactionByCompany, setTransactionByCompany] = useState([]);
  const [ purchaseByCompany, setPurchaseByCompany] = useState([]);
  const [ expandRelated, setExpandRelated ] = useState([]);

  const { t } = useTranslation();

  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedCompany[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedCompany]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if(editedValues[name] === selectedCompany[name]){
      const tempEdited = {
        ...editedValues,
      };
      delete tempEdited[name];
      setEditedValues(tempEdited);
      return;
    };

    const tempSaved = {
      ...savedValues,
      [name] : editedValues[name],
    }
    setSavedValues(tempSaved);  

    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited[name];
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, selectedCompany]);

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
    if(savedValues !== null
      && selectedCompany
      && selectedCompany !== defaultCompany)
    {
      const temp_all_saved = {
        ...savedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        company_code: selectedCompany.company_code,
      };
      if (modifyCompany(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
      } else {
        console.error('Failed to modify company')
      }
    } else {
      console.log("[ CompanyDetailModel ] No saved data");
    };
    setEditedValues(null);
    setSavedValues(null);
  }, [cookies.myLationCrmUserId, modifyCompany, savedValues, selectedCompany]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
  }, []);

  // --- Funtions for Establishment Date ---------------------------------
  const handleStartEstablishDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      establishment_date: orgEstablishDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgEstablishDate]);
  const handleEstablishDateChange = useCallback((date) => {
    setEstablishDate(date);
  }, []);
  const handleEndEstablishDateEdit = useCallback(() => {
    if(establishDate !== orgEstablishDate) {
      const tempSaved = {
        ...savedValues,
        establishment_date : establishDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.establishment_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgEstablishDate, establishDate]);

  // --- Funtions for Closure Date ---------------------------------
  const handleStartCloseDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      closure_date: orgCloseDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgCloseDate]);
  const handleCloseDateChange = useCallback((date) => {
    setCloseDate(date);
  }, []);
  const handleEndCloseDateEdit = useCallback(() => {
    if(closeDate !== orgCloseDate) {
      const tempSaved = {
        ...savedValues,
        closure_date : closeDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.closure_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgCloseDate, closeDate]);

  // --- Funtions for Etc ---------------------------------
  const handleCardClick = useCallback((card) => {
    if(card === "lead" && leadsByCompany.length === 0) return;
    if(card === "consulting" && consultingByCompany.length === 0) return;
    if(card === "quotation" && quotationByCompany.length === 0) return;
    if(card === "transaction" && transactionByCompany.length === 0) return;
    if(card === "purchase" && purchaseByCompany.length === 0) return;

    let tempExpanded = [];
    const foundIdx = expandRelated.findIndex(item => item === card);
    if(foundIdx === -1){
      tempExpanded = [
        ...expandRelated,
        card
      ];
      setExpandRelated(tempExpanded);
    } else {
      tempExpanded = [
        ...expandRelated.slice(0, foundIdx),
        ...expandRelated.slice(foundIdx + 1, ),
      ];
    };
    setExpandRelated(tempExpanded);
  }, [expandRelated, leadsByCompany, consultingByCompany, quotationByCompany, transactionByCompany, purchaseByCompany])

  useEffect(() => {
    console.log('[CompanyDetailsModel] called!');
    setOrgEstablishDate(selectedCompany.establishment_date ? new Date(selectedCompany.establishment_date) : null);
    setOrgCloseDate(selectedCompany.closure_date ? new Date(selectedCompany.closure_date) : null);

    if(allLeads.length === 0){
      loadAllLeads();
    } else {
      const companyleads = allLeads.filter(lead => lead.company_code === selectedCompany.company_code);
      setLeadsByCompany(companyleads);
    };
    if(allConsultings.length === 0){
      loadAllConsultings();
    } else {
      const companyConsultings = allConsultings.filter(consult => consult.company_code === selectedCompany.company_code);
      setConsultingByCompany(companyConsultings);
    };
    if(allQuotations.length === 0){
      loadAllQuotations();
    } else {
      const companyQuotations = allQuotations.filter(quotation => quotation.company_code === selectedCompany.company_code);
      setQuotationByCompany(companyQuotations);
    };
    if(allTransactions.length === 0){
      loadAllTransactions();
    } else {
      const companyTransactions = allTransactions.filter(transaction => transaction.company_name === selectedCompany.company_name);
      setTransactionByCompany(companyTransactions);
    };
    if(allPurchases.length === 0){
      loadAllPurchases();
    } else {
      const companyPurchases = allPurchases.filter(purchase => purchase.company_code === selectedCompany.company_code);
      setPurchaseByCompany(companyPurchases);
    };
  }, [selectedCompany, allLeads, allConsultings, allQuotations, allTransactions, allPurchases, loadAllLeads, loadAllConsultings, loadAllQuotations, loadAllTransactions, loadAllPurchases]);

  return (
    <>
      <div
        className="modal right fade"
        id="company-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog" role="document">
          <button
            type="button"
            className="close md-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            {" "}
          </button>
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <div className="col-md-7 account d-flex">
                  <div className="company_img">
                    <img src={C_logo} alt="User" className="user-image" />
                  </div>
                  <div>
                    <p className="mb-0">{t('company.company')}</p>
                    <span className="modal-title">
                      {selectedCompany.company_name}
                    </span>
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
                    <span>{t('company.company_name')}</span>
                    <p>{selectedCompany.company_name}</p>
                  </div>
                  <div className="col">
                    <span>{t('company.eng_company_name')}</span>
                    <p>{selectedCompany.company_name_eng}</p>
                  </div>
                  <div className="col">
                    <span>{t('company.business_registration_code')}</span>
                    <p>{selectedCompany.business_registration_code}</p> 
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div className="task-infos">
                <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      to="#task-details"
                      data-bs-toggle="tab"
                    >
                      {t('common.details')}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-related"
                      data-bs-toggle="tab"
                    >
                      {t('common.related')}
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-activity"
                      data-bs-toggle="tab"
                    >
                      Activity
                    </Link>
                  </li>
                  <li className="nav-item">
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
                  <div className="tab-pane show active" id="task-details">
                    <div className="crms-tasks">
                    <div className="tasks__item crms-task-item">
                        <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                          <Panel header= {t('company.address')} key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  defaultText={selectedCompany.company_address}
                                  saved={savedValues}
                                  name="company_address"
                                  title= {t('company.address')}
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.company_zip_code}
                                  saved={savedValues}
                                  name="company_zip_code"
                                  title= {t('company.zip_code')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.company_phone_number}
                                  saved={savedValues}
                                  name="company_phone_number"
                                  title= {t('company.phone_number')} 
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.company_fax_number}
                                  saved={savedValues}
                                  name="company_fax_number"
                                  title= {t('company.fax_number')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.homepage}
                                  saved={savedValues}
                                  name="homepage"
                                  title= {t('company.homepage')}
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
                      <div className="tasks__item crms-task-item active">
                        <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                          <Panel header= {t('company.company_details')}  key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  defaultText={selectedCompany.group_}
                                  saved={savedValues}
                                  name="group_"
                                  title={t('company.group')}
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.company_scale}
                                  saved={savedValues}
                                  name="company_scale"
                                  title={t('company.company_scale')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.deal_type}
                                  saved={savedValues}
                                  name="deal_type"
                                  title={t('company.deal_type')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.business_registration_code}
                                  saved={savedValues}
                                  name="business_registration_code"
                                  title={t('company.business_registration_code')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailDateItem
                                  saved={savedValues}
                                  name="establishment_date"
                                  title={t('company.establishment_date')}
                                  orgTimeData={orgEstablishDate}
                                  timeData={establishDate}
                                  timeDataChange={handleEstablishDateChange}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEstablishDateEdit}
                                  endEdit={handleEndEstablishDateEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailDateItem
                                  saved={savedValues}
                                  name="closure_date"
                                  title={t('company.closure_date')}
                                  orgTimeData={orgCloseDate}
                                  timeData={closeDate}
                                  timeDataChange={handleCloseDateChange}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartCloseDateEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndCloseDateEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.ceo_name}
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
                                <DetailLabelItem
                                  defaultText={selectedCompany.business_type}
                                  saved={savedValues}
                                  name="business_type"
                                  title= {t('company.business_type')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.business_item}
                                  saved={savedValues}
                                  name="business_item"
                                  title= {t('company.business_item')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.industry_type}
                                  saved={savedValues}
                                  name="industry_type"
                                  title= {t('company.industry_type')}
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
                          <Panel header= {t('common.additional_information')} key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  defaultText={selectedCompany.account_code}
                                  saved={savedValues}
                                  name="account_code"
                                  title= {t('company.account_code')}
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.bank_name}
                                  saved={savedValues}
                                  name="bank_name"
                                  title= {t('company.bank_name')} 
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.account_owner}
                                  saved={savedValues}
                                  name="account_owner"
                                  title= {t('company.account_owner')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.sales_resource}
                                  saved={savedValues}
                                  name="sales_resource"
                                  title= {t('company.salesman')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.application_engineer}
                                  saved={savedValues}
                                  name="application_engineer"
                                  title= {t('company.engineer')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedCompany.region}
                                  saved={savedValues}
                                  name="region"
                                  title= {t('common.region')}
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
                          <Panel header= {t('common.memo')}  key="1">
                            <table className="table">
                              <tbody>
                                <DetailTextareaItem
                                  defaultText={selectedCompany.memo}
                                  saved={savedValues}
                                  name="memo"
                                  title= {t('company.memo')}
                                  row_no={3}
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
                  <div className="tab-pane task-related" id="task-related">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card bg-gradient-danger card-img-holder text-white h-100">
                          <div className="card-body" onClick={()=>handleCardClick('lead')}>
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">
                              {t('lead.lead')}
                            </h4>
                            <span>{leadsByCompany.length}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-gradient-info card-img-holder text-white h-100">
                        <div className="card-body" onClick={()=>handleCardClick('consulting')}>
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">{t('consulting.consulting')}</h4>
                            <span>{consultingByCompany.length}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-gradient-success card-img-holder text-white h-100">
                        <div className="card-body" onClick={()=>handleCardClick('quotation')}>
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">{t('quotation.quotation')}</h4>
                            <span>{quotationByCompany.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row pt-3">
                      <div className="col-md-4">
                        <div className="card bg-gradient-success card-img-holder text-white h-100">
                        <div className="card-body" onClick={()=>handleCardClick('transaction')}>
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">{t('transaction.transaction')}</h4>
                            <span>{transactionByCompany.length}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-gradient-danger card-img-holder text-white h-100">
                        <div className="card-body" onClick={()=>handleCardClick('purchase')}>
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">{t('purchase.purchase')}</h4>
                            <span>{purchaseByCompany.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="crms-tasks p-2">
                        <div className="tasks__item crms-task-item active">
                          <Collapse
                            accordion expandIconPosition="end"
                            activeKey={expandRelated}
                          >
                            <Panel
                              collapsible={ leadsByCompany.length > 0 ? 'header' : 'disabled'}
                              header={t('lead.lead')}
                              key="lead"
                              onClick={()=>handleCardClick('lead')}
                            >
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>{t('lead.lead_name')}</th>
                                    <th>{t('lead.mobile')}</th>
                                    <th>{t('lead.email')}</th>
                                    <th className="text-end">{t('common.actions')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  { leadsByCompany.map((lead, index) => 
                                    <tr key={index}>
                                      <td>
                                        <Link to="#" className="avatar">
                                          <img alt="" src={C_logo2} />
                                        </Link>
                                        <Link
                                          to="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#leads-details"
                                          onClick={()=> setCurrentLead(lead.lead_code)}
                                        >
                                          {lead.lead_name}
                                        </Link>
                                      </td>
                                      <td>{lead.mobile_number}</td>
                                      <td>{lead.email}</td>
                                      <td className="text-center">
                                        <div className="dropdown dropdown-action">
                                          <Link
                                            to="#"
                                            className="action-icon dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                          >
                                            <MoreVert />
                                          </Link>
                                          <div className="dropdown-menu dropdown-menu-right">
                                            <Link
                                              className="dropdown-item"
                                              to="#"
                                            >
                                              Edit Link
                                            </Link>
                                            <Link
                                              className="dropdown-item"
                                              to="#"
                                            >
                                              Delete Link
                                            </Link>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </Panel>
                            <Panel
                              collapsible={ consultingByCompany.length > 0 ? 'header' : 'disabled'}
                              header={t('consulting.consulting')}
                              key="consulting"
                              onClick={()=>handleCardClick('consulting')}
                            >
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>{t('consulting.type')}</th>
                                    <th>{t('consulting.receipt_time')}</th>
                                    <th>{t('consulting.receiver')}</th>
                                    <th>{t('consulting.request_type')}</th>
                                    <th className="text-end">{t('common.actions')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  { consultingByCompany.map((consulting, index) =>
                                    <tr key={index}>
                                      <td>{consulting.consulting_type}</td>
                                      <td>{consulting.receipt_date && new Date(consulting.receipt_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}
                                      {consulting.receipt_time && new Date(consulting.receipt_time).toLocaleDateString('ko-KR', {hour:'numeric',minute:'numeric',second:'numeric'})}
                                      </td>
                                      <td>{consulting.receiver}</td>
                                      <td>{consulting.request_type}</td>
                                      <td className="text-center">
                                        <div className="dropdown dropdown-action">
                                          <Link
                                            to="#"
                                            className="action-icon dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                          >
                                            <MoreVert />
                                          </Link>
                                          <div className="dropdown-menu dropdown-menu-right">
                                            <Link
                                              className="dropdown-item"
                                              to="#"
                                            >
                                              Edit Link
                                            </Link>
                                            <Link
                                              className="dropdown-item"
                                              to="#"
                                            >
                                              Delete Link
                                            </Link>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </Panel>
                            <Panel
                              collapsible={ quotationByCompany.length > 0 ? 'header' : 'disabled'}
                              header={t('quotation.quotation')}
                              key="quotation"
                              onClick={()=>handleCardClick('quotation')}
                            >
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>{t('common.title')}</th>
                                    <th>{t('quotation.quotation_date')}</th>
                                    <th className="text-end">{t('common.actions')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  { quotationByCompany.map((quotation, index) =>
                                    <tr key={index}>
                                      <td>{quotation.quotation_title}</td>
                                      <td>{quotation.quotation_date && new Date(quotation.quotation_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}</td>
                                      <td className="text-center">
                                        <div className="dropdown dropdown-action">
                                          <Link
                                            to="#"
                                            className="action-icon dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                          >
                                            <MoreVert />
                                          </Link>
                                          <div className="dropdown-menu dropdown-menu-right">
                                            <Link
                                              className="dropdown-item"
                                              to="#"
                                            >
                                              Edit Link
                                            </Link>
                                            <Link
                                              className="dropdown-item"
                                              to="#"
                                            >
                                              Delete Link
                                            </Link>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </Panel>
                            <Panel
                              collapsible={ transactionByCompany.length > 0 ? 'header' : 'disabled'}
                              header={t('transaction.transaction')}
                              key="transaction"
                              onClick={()=>handleCardClick('transaction')}
                            >
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>{t('common.title')}</th>
                                    <th>{t('transaction.publish_date')}</th>
                                    <th>{t('transaction.publish_type')}</th>
                                    <th>{t('transaction.supply_price')}</th>
                                    <th className="text-end">{t('common.actions')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  { transactionByCompany.map((trans, index) =>
                                    <tr key={index}>
                                      <td>{trans.transaction_title}</td>
                                      <td>{trans.publish_date && new Date(trans.publish_date).toLocaleDateString('ko-KR',{year:'numeric',month:'short',day:'numeric'})}</td>
                                      <td>{trans.publish_type}</td>
                                      <td>{trans.supply_price}</td>
                                      <td className="text-center">
                                        <div className="dropdown dropdown-action">
                                          <Link
                                            to="#"
                                            className="action-icon dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                          >
                                            <MoreVert />
                                          </Link>
                                          <div className="dropdown-menu dropdown-menu-right">
                                            <Link
                                              className="dropdown-item"
                                              to="#"
                                            >
                                              Edit Link
                                            </Link>
                                            <Link
                                              className="dropdown-item"
                                              to="#"
                                            >
                                              Delete Link
                                            </Link>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </Panel>
                            <Panel
                              collapsible={ purchaseByCompany.length > 0 ? 'header' : 'disabled'}
                              header={t('purchase.purchase')}
                              key="purchase"
                              onClick={()=>handleCardClick('purchase')}
                            >
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>{t('purchase.product_name')}</th>
                                    <th>{t('common.title')}</th>
                                    <th>{t('purchase.price')}</th>
                                    <th>{t('purchase.delivery_date')}</th>
                                    <th>{t('purchase.registration_date')}</th>
                                    <th className="text-end">{t('common.actions')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                { purchaseByCompany.map((purchase, index) =>
                                  <tr key={index}>
                                    <td>{purchase.product_name}</td>
                                    <td>{purchase.quantity}</td>
                                    <td>{purchase.price}</td>
                                    <td>{purchase.delivery_date && new Date(purchase.delivery_date).toLocaleDateString('ko-KR',{year:'numeric',month:'short',day:'numeric'})}</td>
                                    <td>{purchase.registration_date && new Date(purchase.registration_date).toLocaleDateString('ko-KR',{year:'numeric',month:'short',day:'numeric'})}</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <MoreVert />
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                      </div>
                    </div>
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
          {/* modal-content */}
        </div>
        {/* modal-dialog */}
      </div>
    </>
  );
};

export default CompanyDetailsModel;


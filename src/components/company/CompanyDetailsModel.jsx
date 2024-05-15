import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Collapse, Space, Switch } from "antd";
import { C_logo, C_logo2, CircleImg } from "../imagepath";
import { atomAllConsultings, atomAllLeads, atomAllPurchases, atomAllQuotations, atomAllTransactions, atomCurrentCompany, defaultCompany } from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { ConsultingRepo } from "../../repository/consulting";
import { QuotationRepo } from "../../repository/quotation";
import { TransactionRepo } from "../../repository/transaction";
import { PurchaseRepo } from "../../repository/purchase";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import { MoreVert } from "@mui/icons-material";

const CompanyDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const allLeads = useRecoilValue(atomAllLeads);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);
  const allConsultings = useRecoilValue(atomAllConsultings);
  const { loadAllConsultings, setCurrentConsulting } = useRecoilValue(ConsultingRepo);
  const allQuotations = useRecoilValue(atomAllQuotations);
  const { loadAllQuotations, setCurrentQuotation } = useRecoilValue(QuotationRepo);
  const allTransactions = useRecoilValue(atomAllTransactions);
  const { loadAllTransactions, setCurrentTransaction } = useRecoilValue(TransactionRepo);
  const allPurchases = useRecoilValue(atomAllPurchases);
  const { loadAllPurchases, setCurrentPurchase } = useRecoilValue(PurchaseRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
  const { t } = useTranslation();

  const [ editedValues, setEditedValues ] = useState(null);
  const [ savedValues, setSavedValues ] = useState(null);
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);
  const [ orgCloseDate, setOrgCloseDate ] = useState(null);

  const [ leadsByCompany, setLeadsByCompany] = useState([]);
  const [ consultingByCompany, setConsultingByCompany] = useState([]);
  const [ quotationByCompany, setQuotationByCompany] = useState([]);
  const [ transactionByCompany, setTransactionByCompany] = useState([]);
  const [ purchaseByCompany, setPurchaseByCompany] = useState([]);
  const [ expandRelated, setExpandRelated ] = useState([]);
  const [ isFullscreen, setIsFullscreen ] = useState(false);

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
        if(savedValues.establishment_date){
          setOrgEstablishDate(savedValues.establishment_date);
        };
        if(savedValues.closure_date){
          setOrgCloseDate(savedValues.closure_date);
        };
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
    const tempEdited = {
      ...editedValues,
      establishment_date: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);
  const handleEndEstablishDateEdit = useCallback(() => {
    const establishDate = editedValues.establishment_date;
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
  }, [editedValues, savedValues, orgEstablishDate]);

  // --- Funtions for Closure Date ---------------------------------
  const handleStartCloseDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      closure_date: orgCloseDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgCloseDate]);
  const handleCloseDateChange = useCallback((date) => {
    const tempEdited = {
      ...editedValues,
      closure_date: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);
  const handleEndCloseDateEdit = useCallback(() => {
    const closeDate = editedValues.closure_date;
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
  }, [editedValues, savedValues, orgCloseDate]);

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
  }, [expandRelated, leadsByCompany, consultingByCompany, quotationByCompany, transactionByCompany, purchaseByCompany]);

  const handleWidthChange = useCallback((checked) => {
    setIsFullscreen(checked);
  }, []);

  const company_items_info = [
    ['company_address','company.address',{ type:'label', extra:'long' }],
    ['company_phone_number','company.phone_number',{ type:'label' }],
    ['company_zip_code','company.zip_code',{ type:'label' }],
    ['company_fax_number','company.fax_number',{ type:'label' }],
    ['homepage','company.homepage',{ type:'label' }],
    ['company_scale','company.company_scale',{ type:'label' }],
    ['deal_type','company.deal_type',{ type:'label' }],
    ['industry_type','company.industry_type',{ type:'label' }],
    ['business_type','company.business_type',{ type:'label' }],
    ['business_item','company.business_item',{ type:'label' }],
    ['establishment_date','company.establishment_date',
      { type:'date', orgTimeData: orgEstablishDate, timeDataChange: handleEstablishDateChange, startEditTime: handleStartEstablishDateEdit, endEditTime: handleEndEstablishDateEdit }
    ],
    ['ceo_name','company.ceo_name',{ type:'label' }],
    ['account_code','company.account_code',{ type:'label' }],
    ['bank_name','company.bank_name',{ type:'label' }],
    ['account_owner','company.account_owner',{ type:'label' }],
    ['sales_resource','company.salesman',{ type:'label' }],
    ['application_engineer','company.engineer',{ type:'label' }],
    ['region','common.region',{ type:'label' }],
    ['memo','common.memo',{ type:'textarea', extra:'long' }],
  ]

  useEffect(() => {
    console.log('[CompanyDetailsModel] called!');
    setOrgEstablishDate(selectedCompany.establishment_date ? new Date(selectedCompany.establishment_date) : null);
    setOrgCloseDate(selectedCompany.closure_date ? new Date(selectedCompany.closure_date) : null);
    setExpandRelated([]);

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
    <div
      className="modal right fade"
      id="company-details"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
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
                saved={savedValues}
                name='company_name_eng'
                title={t('company.eng_company_name')}
                checkEdit={handleCheckEditState}
                startEdit={handleStartEdit}
                endEdit={handleEndEdit}
                editing={handleEditing}
                checkSaved={handleCheckSaved}
                cancelSaved={handleCancelSaved}
              />
              <DetailTitleItem
                defaultText={selectedCompany.business_registration_code}
                saved={savedValues}
                name='company_name_eng'
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
              onClick={()=>setCurrentCompany()}
            />
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
                            defaultText={selectedCompany[item.at(0)]}
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
                                    <td>
                                      <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#consulting-details"
                                        onClick={()=> setCurrentConsulting(consulting.consulting_code)}
                                      >
                                        {consulting.receipt_date && new Date(consulting.receipt_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}
                                        {consulting.receipt_time && new Date(consulting.receipt_time).toLocaleDateString('ko-KR', {hour:'numeric',minute:'numeric',second:'numeric'})}
                                      </Link>
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
                                    <td>
                                      <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#quotation-details"
                                        onClick={()=> setCurrentQuotation(quotation.quotation_code)}
                                      >
                                        {quotation.quotation_title}
                                      </Link>
                                    </td>
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
                                    <td>
                                      <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#transaction-details"
                                        onClick={()=> setCurrentTransaction(trans.transaction_code)}
                                      >
                                        {trans.transaction_title}
                                      </Link>
                                    </td>
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
                                  <th>{t('common.price')}</th>
                                  <th>{t('purchase.delivery_date')}</th>
                                  <th>{t('purchase.registration_date')}</th>
                                  <th className="text-end">{t('common.actions')}</th>
                                </tr>
                              </thead>
                              <tbody>
                              { purchaseByCompany.map((purchase, index) =>
                                <tr key={index}>
                                  <td>
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#purchase-details"
                                      onClick={()=> setCurrentTransaction(purchase.purchase_code)}
                                    >
                                      {purchase.product_name}
                                    </Link>
                                  </td>
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
    </div>
  );
};

export default CompanyDetailsModel;


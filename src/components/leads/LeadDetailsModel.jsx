import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Avatar, Space, Switch } from "antd";
import { Edit } from "@mui/icons-material";

import {
  atomCurrentLead, defaultLead,
  atomAllCompanies, atomCurrentCompany, atomCompanyState, atomCompanyForSelection,
  atomPurchaseState, atomAllPurchases,
  atomConsultingState, atomAllConsultings,

  atomCompanyQuotations, atomFilteredQuotation,
} from "../../atoms/atoms";
import { atomUserState, atomEngineersForSelection, atomSalespersonsForSelection } from '../../atoms/atomsUser';
import { CompanyRepo } from "../../repository/company";
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { UserRepo } from '../../repository/user';
import { ConsultingRepo } from "../../repository/consulting";
import { QuotationRepo } from "../../repository/quotation";
import { PurchaseRepo } from "../../repository/purchase";
import { MAContractRepo } from "../../repository/ma_contract";

import CompanyPurchaseModel from "../company/CompanyPurchaseModel";
import ConsultingAddModel from "../consulting/ConsultingAddModel";
import ConsultingDetailsModel from "../consulting/ConsultingDetailsModel";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import { option_locations } from "../../constants/constans";
import LeadConsultingModel from "./LeadConsultingModel";


const LeadDetailsModel = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);


  //===== [RecoilState] Related with Lead ==========================================
  const selectedLead = useRecoilValue(atomCurrentLead);
  const { modifyLead, setCurrentLead } = useRecoilValue(LeadRepo);


  //===== [RecoilState] Related with Company =======================================
  const companyState = useRecoilValue(atomCompanyState);
  const allCompanies = useRecoilValue(atomAllCompanies);
  const currentCompany = useRecoilValue(atomCurrentCompany);
  const { loadAllCompanies, modifyCompany, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);
  const companyQuotations = useRecoilValue(atomCompanyQuotations);
  const filteredQuotations = useRecoilValue(atomFilteredQuotation);


  //===== [RecoilState] Related with Purchase =======================================
  const purchaseState = useRecoilValue(atomPurchaseState);
  const allPurchases = useRecoilValue(atomAllPurchases);
  const { loadAllPurchases } = useRecoilValue(PurchaseRepo);
  const { loadCompanyMAContracts } = useRecoilValue(MAContractRepo);


  //===== [RecoilState] Related with Consulting =======================================
  const consultingState = useRecoilValue(atomConsultingState);
  const allConsultings = useRecoilValue(atomAllConsultings);
  const { loadAllConsultings } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
  const { loadAllUsers } = useRecoilValue(UserRepo)
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to deal this component ============================================
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentLeadCode, setCurrentLeadCode] = useState('');
  const [validMACount, setValidMACount] = useState(0);

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if (checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);


  //===== Handles to edit 'Lead Details' ===============================================
  const [editedDetailValues, setEditedDetailValues] = useState(null);

  const handleDetailChange = useCallback((e) => {
    if (e.target.value !== selectedLead[e.target.name]) {
      const tempEdited = {
        ...editedDetailValues,
        [e.target.name]: e.target.value,
      };
      console.log('handleDetailChange : ', tempEdited);
      setEditedDetailValues(tempEdited);
    } else {
      if (editedDetailValues[e.target.name]) {
        delete editedDetailValues[e.target.name];
      };
    };
  }, [editedDetailValues, selectedLead]);

  const handleDetailDateChange = useCallback((name, date) => {
    if (date !== new Date(selectedLead[name])) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: date,
      };
      setEditedDetailValues(tempEdited);
    }
  }, [editedDetailValues, selectedLead]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    console.log('handleDetailSelectChange / start : ', selected);
    let tempEdited = null;
    let isChanged = false;
    if (name === 'company_name') {
      if (selectedLead.company_name !== selected.value.company_name) {
        isChanged = true;
        tempEdited = {
          ...editedDetailValues,
          company_name: selected.value.company_name,
          company_name_en: selected.value.company_name_en,
          company_zip_code: selected.value.company_zip_code,
          company_address: selected.value.company_address,
          region: selected.value.region,
        };
      };
    } else {
      if (selectedLead[name] !== selected.value) {
        isChanged = true;
        tempEdited = {
          ...editedDetailValues,
          [name]: selected.value,
        };
      };
    };
    if (isChanged) {
      console.log('handleDetailSelectChange : ', tempEdited);
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues, selectedLead]);

  const handleChangeStatus = (newStatus) => {
    const tempEdited = {
      status: newStatus,
      action_type: "UPDATE",
      modify_user: cookies.myLationCrmUserId,
      lead_code: selectedLead.lead_code,
    };

    if (modifyLead(tempEdited)) {
      console.log(`Succeeded to lead change status`);
    } else {
      console.error('Failed to modify lead')
    }
  };

  const handleClose = useCallback(() => {
    setEditedDetailValues(null);
    setCurrentLead();
    setCurrentLeadCode('');
  }, [setCurrentLead]);

  const handleSaveAll = useCallback(() => {
    if (editedDetailValues !== null
      && selectedLead !== defaultLead) {
      const temp_all_saved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        lead_code: selectedLead.lead_code,
      };
      if (modifyLead(temp_all_saved)) {
        console.log(`Succeeded to modify lead`);
        let temp_update_company = null;
        if (editedDetailValues['company_name'])
          temp_update_company['company_name'] = editedDetailValues['company_name'];
        if (editedDetailValues['company_name_en'])
          temp_update_company['company_name_eng'] = editedDetailValues['company_name_en'];
        if (editedDetailValues['company_phone_number'])
          temp_update_company['company_phone_number'] = editedDetailValues['company_phone_number'];
        if (editedDetailValues['company_fax_number'])
          temp_update_company['company_fax_number'] = editedDetailValues['company_fax_number'];
        if (editedDetailValues['company_address'])
          temp_update_company['company_address'] = editedDetailValues['company_address'];
        if (editedDetailValues['company_zip_code'])
          temp_update_company['company_zip_code'] = editedDetailValues['company_zip_code'];
        if (editedDetailValues['region'])
          temp_update_company['region'] = editedDetailValues['region'];

        if (temp_update_company !== null) {
          temp_update_company['action_type'] = 'UPDATE';
          temp_update_company['modify_user'] = cookies.myLationCrmUserId;
          temp_update_company['company_code'] = currentCompany.company_code;
          if (modifyCompany(temp_update_company)) {
            console.log(`Succeeded to modify company`);
          } else {
            console.error('Failed to modify company');
          };
        };
      } else {
        console.error('Failed to modify lead')
      };
    } else {
      console.log("[ LeadDetailModel ] No saved data");
    };
    setEditedDetailValues(null);
  }, [cookies.myLationCrmUserId, currentCompany.company_code, editedDetailValues, modifyCompany, modifyLead, selectedLead]);

  const handleCancelAll = useCallback(() => {
    setEditedDetailValues(null);
  }, []);

  const lead_items_info = [
    { key: 'lead_name', title: 'lead.lead_name', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'position', title: 'lead.position', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'is_keyman', title: 'lead.is_keyman', detail: { type: 'select', options: KeyManForSelection, editing: handleDetailSelectChange } },
    { key: 'region', title: 'common.region', detail: { type: 'select', options: option_locations.ko, editing: handleDetailSelectChange } },
    { key: 'company_name', title: 'company.company_name', detail: { type: 'select', options: companyForSelection, key: 'company_name', editing: handleDetailSelectChange } },
    { key: 'company_name_en', title: 'company.eng_company_name', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'department', title: 'lead.department', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'position', title: 'lead.position', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'mobile_number', title: 'lead.mobile', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_phone_number', title: 'company.phone_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_fax_number', title: 'company.fax_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'email', title: 'lead.email', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'homepage', title: 'lead.homepage', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_zip_code', title: 'company.zip_code', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_address', title: 'company.address', detail: { type: 'label', extra: 'long', editing: handleDetailChange } },
    { key: 'sales_resource', title: 'lead.lead_sales', detail: { type: 'select', options: salespersonsForSelection, editing: handleDetailSelectChange } },
    { key: 'application_engineer', title: 'company.engineer', detail: { type: 'select', options: engineersForSelection, editing: handleDetailSelectChange } },
    { key: 'create_date', title: 'common.regist_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'memo', title: 'common.memo', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
  ];


  //===== Handles to edit 'Purchase Details' ===============================================
  const [purchasesByCompany, setPurchasesByCompany] = useState([]);


  //===== Handles to edit 'Consulting Details' ===============================================
  const [consultingsByLead, setConsultingsByLead] = useState([]);
  const [initAddConsulting, setInitAddConsulting] = useState(false);


  //===== Handles to edit 'Quotation Details' ===============================================
  const [quotationsByLead, setQuotationsByLead] = useState([]);


  //===== Handles related with Search ===============================================  
  const [searchQuotationCondition, setSearchQuotationCondition] = useState("");
  const [searchPurchaseCondition, setSearchPurchaseCondition] = useState("");
  const { setCurrentQuotation, filterCompanyQuotation } = useRecoilValue(QuotationRepo);
  const { setCurrentPurchase, filterCompanyPurchase } = useRecoilValue(PurchaseRepo);

  const handleSearchQuotationCondition = (newValue) => {
    setSearchQuotationCondition(newValue);
    console.log("handleSearchCondition", searchQuotationCondition)
    filterCompanyQuotation(newValue);
  };


  // 상태(state) 정의
  const [selectedRow, setSelectedRow] = useState(null);


  // 각 행 클릭 시 호출되는 함수
  const handleRowClick = (row) => {
    if (selectedRow === row) {
      // 이미 선택된 행을 다시 클릭하면 선택 취소
      setSelectedRow(null);
    } else {
      // 새로운 행을 클릭하면 해당 행을 선택
      setSelectedRow(row);
    }
  };


  //===== useEffect functions ===============================================  
  useEffect(() => {
    if ((selectedLead !== defaultLead)
      && (selectedLead.lead_code !== currentLeadCode)
      && ((companyState & 1) === 1)
    ) {
      console.log('[LeadDetailsModel] useEffect / lead');

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if (detailViewStatus === null) {
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if (detailViewStatus === '0') {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      setCurrentLeadCode(selectedLead.company_code);
      const companyByLeadArray = allCompanies.filter(company => company.company_code === selectedLead.company_code);
      if (companyByLeadArray.length > 0) {
        setCurrentCompany(companyByLeadArray[0]);
        loadCompanyMAContracts(companyByLeadArray[0].company_code);
      };
    };
  }, [selectedLead, currentLeadCode, companyState, allCompanies, setCurrentCompany, loadCompanyMAContracts]);

  useEffect(() => {
    if ((companyState & 1) === 0) {
      console.log('[LeadDetailsModel] loadAllCompanies');
      loadAllCompanies();
    };
  }, [companyState, loadAllCompanies]);

  useEffect(() => {
    if ((purchaseState & 1) === 0) {
      console.log('[LeadDetailModel] loadAllPurchases');
      loadAllPurchases();
    } else {
      const tempCompanyPurchases = allPurchases.filter(purchase => purchase.company_code === currentCompany.company_code);
      if (purchasesByCompany.length !== tempCompanyPurchases.length) {
        console.log('[CompanyDetailsModel] set purchasesBycompany / set MA Count');
        setPurchasesByCompany(tempCompanyPurchases);

        let valid_count = 0;
        tempCompanyPurchases.forEach(item => {
          if (item.ma_finish_date && (new Date(item.ma_finish_date) > Date.now())) valid_count++;
        });
        setValidMACount(valid_count);
      };
    };
  }, [purchaseState, allPurchases, purchasesByCompany, loadAllPurchases, currentCompany.company_code]);

  useEffect(() => {
    if ((consultingState & 1) === 0) {
      console.log('[LeadDetailModel] loadAllConsultings');
      loadAllConsultings();
    } else {
      const tempConsultingByLead = allConsultings.filter(consulting => consulting.lead_code === selectedLead.lead_code);
      if (consultingsByLead.length !== tempConsultingByLead.length) {
        console.log('[CompanyDetailsModel] set purchasesBycompany / set MA Count');
        setConsultingsByLead(tempConsultingByLead);
      };
    };
  }, [allConsultings, consultingState, consultingsByLead.length, loadAllConsultings, selectedLead.lead_code]);

  useEffect(() => {
    console.log('[CompanyAddModel] loading user data!');
    if ((userState & 1) === 0) {
      loadAllUsers();
    }
  }, [userState, loadAllUsers])

  return (
    <>
      <div
        className="modal right fade"
        id="leads-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        data-bs-focus="false"
      >
        <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <div className="col-md-1 account d-flex">
                  <div className="company_img">
                    <Avatar size={48}>{selectedLead.lead_name === null ? "" : (selectedLead.lead_name).substring(0, 1)}</Avatar>
                  </div>
                </div>
                <DetailTitleItem
                  original={selectedLead.lead_name}
                  name='lead_name'
                  title={t('lead.lead_name')}
                  onEditing={handleDetailChange}
                />
                <DetailTitleItem
                  original={selectedLead.company_name}
                  name='company_name'
                  title={t('company.company_name')}
                  onEditing={handleDetailChange}
                />
                <DetailTitleItem
                  original={selectedLead.position}
                  name='position'
                  title={t('lead.position')}
                  onEditing={handleDetailChange}
                />
              </div>
              <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWidthChange} />
              <button
                type="button"
                className="btn-close xs-close"
                data-bs-dismiss="modal"
                onClick={handleClose}
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <ul
                    className="cd-breadcrumb triangle nav nav-tabs w-100 crms-steps"
                    role="tablist"
                  >
                    <li role="presentation">
                      <Link
                        to="#not-contacted"
                        className={selectedLead.status === "Not Contacted" || selectedLead.status === null ? "active" : ""}
                        aria-controls="not-contacted"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Not Contacted" ? "true" : "false"}
                        onClick={() => handleChangeStatus("Not Contacted")}
                      >
                        <span className="octicon octicon-light-bulb" />
                        {t('lead.not_contacted')}
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#attempted-contact"
                        className={selectedLead.status === "Attempted Contact" ? "active" : "inactive"}
                        aria-controls="attempted-contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Attempted Contact" ? "true" : "false"}
                        onClick={() => handleChangeStatus("Attempted Contact")}
                      >
                        <span className="octicon octicon-diff-added" />
                        {t('lead.attempted_contact')}
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#contact"
                        className={selectedLead.status === "Contact" ? "active" : "inactive"}
                        aria-controls="contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Contact" ? "true" : "false"}
                        onClick={() => handleChangeStatus("Contact")}
                      >
                        <span className="octicon octicon-comment-discussion" />
                        {t('lead.contact')}
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#converted"
                        className={selectedLead.status === "Converted" ? "active" : "inactive"}
                        aria-controls="contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Converted" ? "true" : "false"}
                        onClick={() => handleChangeStatus("Converted")}
                      >
                        <span className="octicon octicon-comment-discussion" />
                        {t('lead.converted')}
                      </Link>
                    </li>
                    {/* <li role="presentation" className="d-none">
                      <Link
                        to="#converted"
                        aria-controls="converted"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                      >
                        <span className="octicon octicon-verified" />
                        Converted
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="tab-content pipeline-tabs border-0">
                <div
                  role="tabpanel"
                  className="tab-pane active p-0"
                >
                  <div className="">
                    <div className="task-infos">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            to="#not-contact-task-details"
                            data-bs-toggle="tab"
                          >
                            {t('lead.detail_information')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-purchase"
                            data-bs-toggle="tab"
                          >
                            {t('purchase.product_info') + "(" + validMACount + "/" + purchasesByCompany.length + ")"}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-consult"
                            data-bs-toggle="tab"
                          >
                            {t('lead.consulting_history') + '('} {consultingsByLead.length}{')'}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-quotation"
                            data-bs-toggle="tab"
                          >
                            {t('lead.quotation_history') + '('} {companyQuotations.length === undefined ? 0 : companyQuotations.length}{')'}
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane show active p-0"
                          id="not-contact-task-details" >
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item">
                              <Space
                                align="start"
                                direction="horizontal"
                                size="small"
                                style={{ display: 'flex', marginBottom: '0.5rem' }}
                                wrap
                              >
                                {lead_items_info.map((item, index) =>
                                  <DetailCardItem
                                    key={index}
                                    title={t(item.title)}
                                    defaultValue={selectedLead[item.key]}
                                    edited={editedDetailValues}
                                    name={item.key}
                                    detail={item.detail}
                                  />
                                )}
                              </Space>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane task-related p-0"
                          id="not-contact-task-purchase" >
                          <CompanyPurchaseModel
                            company={currentCompany}
                            purchases={purchasesByCompany}
                            handlePurchase={setPurchasesByCompany}
                          />
                        </div>
                        <div className="tab-pane task-related p-0"
                          id="not-contact-task-consult" >
                          <LeadConsultingModel
                            consultings={consultingsByLead}
                            handleAddConsulting={setInitAddConsulting}
                          />
                        </div>


                        <div className="tab-pane task-related p-0"
                          id="not-contact-task-quotation" >
                          <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                            <thead>
                              <tr>
                                <div className="row">
                                  <div className="col text-start" style={{ width: '200px' }}>
                                    <input
                                      id="searchQuotationCondition"
                                      className="form-control"
                                      type="text"
                                      placeholder={t('common.search_here')}
                                      value={searchQuotationCondition}
                                      onChange={(e) => handleSearchQuotationCondition(e.target.value)}
                                      style={{ width: '300px', display: 'inline' }}
                                    />
                                  </div>
                                </div>
                              </tr>
                              <tr>
                                <th style={{ width: '80px' }}>{t('quotation.quotation_type')}</th>
                                <th style={{ width: '300px' }}>{t('common.title')}</th>
                                <th>{t('quotation.quotation_date')}</th>
                                <th>{t('lead.full_name')}</th>
                                <th>{t('quotation.quotation_manager')}</th>
                                <th>{t('quotation.total_quotation_amount')}</th>
                              </tr>
                            </thead>
                            {
                              searchQuotationCondition === "" ?
                                companyQuotations.length > 0 &&
                                <tbody>
                                  {companyQuotations.map(quotation =>
                                    <React.Fragment key={quotation.quotation_code}>
                                      <tr key={quotation.quotation_code}>
                                        <td>{quotation.quotation_type} </td>
                                        <td>{quotation.quotation_title}
                                          <a href="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#quotations-details"
                                            onClick={() => {
                                              console.log('showQuotationDetail', quotation.quotation_code);
                                              setCurrentQuotation(quotation.quotation_code);
                                            }}>
                                            <Edit fontSize="small" />
                                          </a>
                                        </td>
                                        <td>{quotation.quotation_date && new Date(quotation.quotation_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td>{quotation.lead_name}</td>
                                        <td>{quotation.quotation_manager}</td>
                                        <td className="text-end">{quotation.total_quotation_amount}</td>
                                      </tr>
                                    </React.Fragment>
                                  )}
                                </tbody>
                                :
                                filteredQuotations.length > 0 &&
                                <tbody>
                                  {filteredQuotations.map(quotation =>
                                    <tr key={quotation.quotation_code}>
                                      <td>{quotation.quotation_type}</td>
                                      <td>{quotation.quotation_title}
                                        <a href="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#quotations-details"
                                          onClick={() => {
                                            console.log('showQuotationDetail', quotation.quotation_code);
                                            setCurrentQuotation(quotation.quotation_code);
                                          }}>
                                          <Edit fontSize="small" />
                                        </a>
                                      </td>
                                      <td>{quotation.quotation_date && new Date(quotation.quotation_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                                      </td>
                                      <td>{quotation.lead_name}</td>
                                      <td>{quotation.quotation_manager}</td>
                                      <td className="text-end">{quotation.total_quotation_amount}</td>
                                    </tr>
                                  )}
                                </tbody>
                            }
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {editedDetailValues !== null && Object.keys(editedDetailValues).length !== 0 &&
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
          {/* modal-content */}
        </div>
        {/* modal-dialog */}
      </div>
      <ConsultingDetailsModel />
      <ConsultingAddModel init={initAddConsulting} handleInit={setInitAddConsulting} leadCode={selectedLead.lead_code}/>
    </>
  );
};

export default LeadDetailsModel;

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Avatar, Space, Switch } from "antd";
import {
  atomCurrentLead, defaultLead,
  atomAllCompanies, atomCurrentCompany, atomCompanyState, atomCompanyForSelection,
  atomPurchaseState, atomAllPurchases,
  atomConsultingState, atomAllConsultings,
  atomQuotationState, atomAllQuotations,
} from "../../atoms/atoms";
import { atomUserState, atomEngineersForSelection, atomSalespersonsForSelection } from '../../atoms/atomsUser';
import { CompanyRepo } from "../../repository/company";
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { ConsultingRepo } from "../../repository/consulting";
import { QuotationRepo } from "../../repository/quotation";
import { PurchaseRepo } from "../../repository/purchase";
import { MAContractRepo } from "../../repository/ma_contract";

import CompanyPurchaseModel from "../company/CompanyPurchaseModel";
import ConsultingAddModel from "../consulting/ConsultingAddModel";
import ConsultingDetailsModel from "../consulting/ConsultingDetailsModel";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import { option_locations } from "../../constants/constants";

import LeadConsultingModel from "./LeadConsultingModel";
import LeadQuotationModel from "./LeadQutotationModel"
import QuotationAddModel from "../quotations/QuotationAddModel";
import QuotationDetailsModel from "../quotations/QuotationDetailsModel";
import PurchaseDetailsModel from "../purchase/PurchaseDetailsModel";
import PurchaseAddModel from "../purchase/PurchaseAddModel";


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
  const { modifyCompany, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);


  //===== [RecoilState] Related with Purchase =======================================
  const purchaseState = useRecoilValue(atomPurchaseState);
  const { tryLoadAllPurchases } = useRecoilValue(PurchaseRepo)
  const allPurchases = useRecoilValue(atomAllPurchases);
  const { loadCompanyMAContracts } = useRecoilValue(MAContractRepo);


  //===== [RecoilState] Related with Consulting =======================================
  const consultingState = useRecoilValue(atomConsultingState);
  const { tryLoadAllConsultings } = useRecoilValue(ConsultingRepo);
  const allConsultings = useRecoilValue(atomAllConsultings);


  //===== [RecoilState] Related with Quotation ========================================
  const quotationState = useRecoilValue(atomQuotationState);
  const { tryLoadAllQuotations } = useRecoilValue(QuotationRepo);
  const allQuotations = useRecoilValue(atomAllQuotations);


  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
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
  const [isAllNeededDataLoaded, setIsAllNeededDataLoaded] = useState(false);
  const [editedDetailValues, setEditedDetailValues] = useState({});

  const handleDetailChange = useCallback((e) => {
    if (e.target.value !== selectedLead[e.target.name]) {
      const tempEdited = {
        ...editedDetailValues,
        [e.target.name]: e.target.value,
      };
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
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues, selectedLead]);

  const handleDetailAddressChange = useCallback((obj) => {
    const tempEdited = {
      ...editedDetailValues,
      ...obj,
    };
    console.log("handleDetailAddressChange :", tempEdited);
    setEditedDetailValues(tempEdited);
  },
    [editedDetailValues]
  );

  const handleChangeStatus = (newStatus) => {
    const tempEdited = {
      status: newStatus,
      action_type: "UPDATE",
      modify_user: cookies.myLationCrmUserId,
      lead_code: selectedLead.lead_code,
    };

    const resp = modifyLead(tempEdited);
    resp.then(res => {
      if (res.result) {
        console.log(`Succeeded to lead change status`);
      } else {
        console.error('Failed to modify lead : ', res.data);
      };
    })
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
        let temp_update_company = {};
        if (editedDetailValues['company_name'])
          temp_update_company['company_name'] = editedDetailValues['company_name'];
        if (editedDetailValues['company_name_en'])
          temp_update_company['company_name_en'] = editedDetailValues['company_name_en'];
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
          const resp = modifyCompany(temp_update_company);
          resp.then(res => {
            if (res.result) {
              console.log(`Succeeded to modify company`);
            } else {
              console.error('Failed to modify company : ', res.data);
            };
          });
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
    { key: 'company_name_en', title: 'company.company_name_en', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'department', title: 'lead.department', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'position', title: 'lead.position', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'mobile_number', title: 'lead.mobile', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_phone_number', title: 'company.phone_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_fax_number', title: 'company.fax_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'email', title: 'lead.email', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'homepage', title: 'lead.homepage', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_zip_code', title: 'company.zip_code', detail: { type: 'label', editing: handleDetailChange, disabled: true } },
    { key: 'company_address', title: 'company.address', detail: { type: 'address', extra: 'long', key_zip: "company_zip_code", editing: handleDetailAddressChange, } },
    { key: 'sales_resource', title: 'lead.lead_sales', detail: { type: 'select', options: salespersonsForSelection, editing: handleDetailSelectChange } },
    { key: 'application_engineer', title: 'company.engineer', detail: { type: 'select', options: engineersForSelection, editing: handleDetailSelectChange } },
    { key: 'create_date', title: 'common.regist_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'memo', title: 'common.memo', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
  ];


  //===== Handles to edit 'Purchase Add/Details' ===============================================
  const [purchasesByCompany, setPurchasesByCompany] = useState([]);
  const [initAddPurchase, setInitAddPurchase] = useState(false);


  //===== Handles to edit 'Consulting Add/Details' ===============================================
  const [consultingsByLead, setConsultingsByLead] = useState([]);
  const [initAddConsulting, setInitAddConsulting] = useState(false);


  //===== Handles to edit 'Quotation Add/Details' ===============================================
  const [quotationsByLead, setQuotationsByLead] = useState([]);
  const [initAddQuotation, setInitAddQuotation] = useState(false);


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
    if (isAllNeededDataLoaded
      && (selectedLead !== defaultLead)
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
  }, [isAllNeededDataLoaded, selectedLead, currentLeadCode, companyState, allCompanies, setCurrentCompany, loadCompanyMAContracts]);

  useEffect(() => {
    tryLoadAllPurchases();
    if ((purchaseState & 1) === 1) {
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
  }, [purchaseState, allPurchases, purchasesByCompany, currentCompany.company_code]);

  useEffect(() => {
    tryLoadAllConsultings();
    if ((consultingState & 1) === 1) {
      const tempConsultingByLead = allConsultings.filter(consulting => consulting.lead_code === selectedLead.lead_code);
      if (consultingsByLead.length !== tempConsultingByLead.length) {
        setConsultingsByLead(tempConsultingByLead);
      };
    };
  }, [allConsultings, consultingState, consultingsByLead.length, selectedLead.lead_code]);

  useEffect(() => {
    tryLoadAllQuotations();
    if ((quotationState & 1) === 1) {
      const tempQuotationsByLead = allQuotations.filter(item => item.lead_code === selectedLead.lead_code);
      if (quotationsByLead.length !== tempQuotationsByLead.length) {
        setQuotationsByLead(tempQuotationsByLead);
      };
    };
  }, [allQuotations, quotationState, quotationsByLead, selectedLead.lead_code]);

  useEffect(() => {
    if (((companyState & 1) === 1)
      && ((userState & 1) === 1)
      && ((purchaseState & 1) === 1)
      && ((consultingState & 1) === 1)
      && ((quotationState & 1) === 1)
    ) {
      console.log('[LeadDetailModel] all needed data is loaded');
      setIsAllNeededDataLoaded(true);
    };
  }, [userState, companyState, purchaseState, consultingState, quotationState]);

  if (!isAllNeededDataLoaded)
    return <div>&nbsp;</div>;

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
                            to="#sub-lead-details"
                            data-bs-toggle="tab"
                          >
                            {t('lead.detail_information')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#sub-lead-purchases"
                            data-bs-toggle="tab"
                          >
                            {t('purchase.product_info') + "(" + validMACount + "/" + purchasesByCompany.length + ")"}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#sub-lead-consultings"
                            data-bs-toggle="tab"
                          >
                            {t('lead.consulting_history') + '('} {consultingsByLead.length}{')'}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#sub-lead-quotation"
                            data-bs-toggle="tab"
                          >
                            {t('lead.quotation_history') + '('} {quotationsByLead.length}{')'}
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane show active p-0"
                          id="sub-lead-details" >
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
                          id="sub-lead-purchases" >
                          <CompanyPurchaseModel
                            purchases={purchasesByCompany}
                            handleInitAddPurchase={setInitAddPurchase}
                          />
                        </div>
                        <div className="tab-pane task-related p-0"
                          id="sub-lead-consultings" >
                          <LeadConsultingModel
                            consultings={consultingsByLead}
                            handleInitAddConsulting={setInitAddConsulting}
                          />
                        </div>
                        <div className="tab-pane task-related p-0"
                          id="sub-lead-quotation" >
                          <LeadQuotationModel
                            quotations={quotationsByLead}
                            handleInitAddQuotation={setInitAddQuotation}
                          />
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
      <ConsultingAddModel init={initAddConsulting} handleInit={setInitAddConsulting} leadCode={selectedLead.lead_code} />
      <ConsultingDetailsModel />
      <QuotationAddModel init={initAddQuotation} handleInit={setInitAddQuotation} leadCode={selectedLead.lead_code} />
      <QuotationDetailsModel />
      <PurchaseAddModel init={initAddPurchase} handleInit={setInitAddPurchase} companyCode={selectedLead.company_code} />
      <PurchaseDetailsModel />
    </>
  );
};

export default LeadDetailsModel;

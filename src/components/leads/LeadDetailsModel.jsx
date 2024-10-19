import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Avatar, Space, Switch } from "antd";
import {
  atomCurrentLead, defaultLead,
  atomCurrentCompany,
  atomPurchaseByCompany,
  atomConsultingByLead,
  atomQuotationByLead,
} from "../../atoms/atoms";
import { atomEngineersForSelection, atomSalespersonsForSelection } from '../../atoms/atomsUser';
import { CompanyRepo } from "../../repository/company";
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { ConsultingRepo } from "../../repository/consulting";
import { QuotationRepo } from "../../repository/quotation";
import { PurchaseRepo } from "../../repository/purchase";
import { MAContractRepo } from "../../repository/ma_contract";
import { SettingsRepo } from "../../repository/settings";

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


const LeadDetailsModel = ({init, handleInit}) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);


  //===== [RecoilState] Related with Lead ==========================================
  const selectedLead = useRecoilValue(atomCurrentLead);
  const { modifyLead, setCurrentLead } = useRecoilValue(LeadRepo);


  //===== [RecoilState] Related with Company =======================================
  const currentCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany, setCurrentCompany } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Purchase =======================================
  const [ purchaseByCompany, setPurchasesByCompany ] = useRecoilState(atomPurchaseByCompany);
  const { searchPurchases } = useRecoilValue(PurchaseRepo)
  const { loadCompanyMAContracts } = useRecoilValue(MAContractRepo);


  //===== [RecoilState] Related with Consulting =======================================
  const [ consultingByLead, setConsultingsByLead ] = useRecoilState(atomConsultingByLead);
  const { searchConsultings } = useRecoilValue(ConsultingRepo);


  //===== [RecoilState] Related with Quotation ========================================
  const [ quotationByLead, setQuotationsByLead ] = useRecoilState(atomQuotationByLead);
  const { searchQuotations } = useRecoilValue(QuotationRepo);


  //===== [RecoilState] Related with Users ==========================================
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== [RecoilState] Related with Users ==========================================
  const { openModal, closeModal } = useRecoilValue(SettingsRepo);


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

  const handleDetailObjectChange = useCallback((obj) => {
      const tempEdited = {
        ...editedDetailValues,
        ...obj,
      };
      setEditedDetailValues(tempEdited);
    },
    [editedDetailValues]
  );

  const handleChangeStatus = (newStatus) => {
    if (newStatus !== selectedLead['status']) {
      const tempEdited = {
        ...editedDetailValues,
        ['status']: newStatus,
      };
      setEditedDetailValues(tempEdited);
    } else {
      if (editedDetailValues['status']) {
        delete editedDetailValues['status'];
      };
    };
  };

  const handlePopupOpen = (open) => {
    if(open) {
      openModal('antModal');
    } else {
      closeModal();
    }
  };

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
              handleClose();
            } else {
              console.error('Failed to modify company : ', res.data);
            };
          });
        };
        closeModal();
      } else {
        console.error('Failed to modify lead')
      };
    } else {
      console.log("[ LeadDetailModel ] No saved data");
    };
    setEditedDetailValues(null);
  }, [cookies.myLationCrmUserId, currentCompany.company_code, editedDetailValues, modifyCompany, modifyLead, selectedLead]);

  const handleInitialize = () => {
    setEditedDetailValues(null);
  };
  const handleClose = useCallback(() => {
    setTimeout(() => {
      closeModal('initialize_lead');
    }, 500);
  }, []);

  const lead_items_info = [
    { key: 'lead_name', title: 'lead.lead_name', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'position', title: 'lead.position', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'is_keyman', title: 'lead.is_keyman', detail: { type: 'select', options: KeyManForSelection, editing: handleDetailSelectChange } },
    { key: 'region', title: 'common.region', detail: { type: 'select', options: option_locations.ko, editing: handleDetailSelectChange } },
    { key: 'company_name', title: 'company.company_name', detail: { type: 'search', key_name: 'company', editing: handleDetailObjectChange, handleOpen: handlePopupOpen } },
    { key: 'company_name_en', title: 'company.company_name_en', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'department', title: 'lead.department', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'email', title: 'lead.email1', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'mobile_number', title: 'lead.mobile', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_phone_number', title: 'company.phone_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_fax_number', title: 'company.fax_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'email2', title: 'lead.email2', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'homepage', title: 'lead.homepage', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'company_zip_code', title: 'company.zip_code', detail: { type: 'label', editing: handleDetailChange, disabled: true } },
    { key: 'company_address', title: 'company.address', detail: { type: 'address', extra: 'long', key_zip: "company_zip_code", editing: handleDetailObjectChange, } },
    { key: 'sales_resource', title: 'lead.lead_sales', detail: { type: 'select', options: salespersonsForSelection, editing: handleDetailSelectChange } },
    { key: 'application_engineer', title: 'company.engineer', detail: { type: 'select', options: engineersForSelection, editing: handleDetailSelectChange } },
    { key: 'create_date', title: 'common.regist_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'site_id', title: 'common.site_id', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'memo', title: 'common.memo', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
  ];


  //===== Handles to edit 'Purchase Add/Details' ===============================================
  const [initAddPurchase, setInitAddPurchase] = useState(false);


  //===== Handles to edit 'Consulting Add/Details' ===============================================
  const [initAddConsulting, setInitAddConsulting] = useState(false);


  //===== Handles to edit 'Quotation Add/Details' ===============================================
  const [initAddQuotation, setInitAddQuotation] = useState(false);
  const [initEditQuotation, setInitEditQuotation] = useState(false);


  //===== Handles related with Search ===============================================  
  const [searchQuotationCondition, setSearchQuotationCondition] = useState("");
  const [searchPurchaseCondition, setSearchPurchaseCondition] = useState("");
  const { setCurrentQuotation, filterCompanyQuotation } = useRecoilValue(QuotationRepo);
  const { setCurrentPurchase, filterCompanyPurchase } = useRecoilValue(PurchaseRepo);

  const handleSearchQuotationCondition = (newValue) => {
    setSearchQuotationCondition(newValue);
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

      if ((selectedLead === defaultLead)
        || (selectedLead.lead_code === currentLeadCode)
      ) {
        handleInit(false);
        return;
      }
      setCurrentCompany(selectedLead.company_code);
      loadCompanyMAContracts(selectedLead.company_code);
      setCurrentLeadCode(selectedLead.lead_code);

      // load company of selected lead -----------
      const queryCompany = searchPurchases('company_code', selectedLead.company_code, true);
      queryCompany
        .then(res => {
          if(res.result) {
            setPurchasesByCompany(res.data);
  
            let valid_count = 0;
            res.data.forEach((item) => {
              if (item.ma_finish_date && new Date(item.ma_finish_date) > Date.now())
                valid_count++;
            });
            setValidMACount(valid_count);
          } else {
            console.log('[LeadDetailsModel] fail to get purchase :', res.message);
            setPurchasesByCompany([]);
            setValidMACount(0);
          };
        });

      // load consulting of selected lead -----------
      const queryConsulting = searchConsultings('lead_code', selectedLead.lead_code, true);
      queryConsulting
        .then(res => {
          if(res.result) {
            setConsultingsByLead(res.data);
          } else {
            console.log('[LeadDetailsModel] fail to get consulting :', res.message);
            setConsultingsByLead([]);
          };
        });

      // load quotation of selected lead -----------
      const queryQuotation = searchQuotations('lead_code', selectedLead.lead_code, true);
      queryQuotation
        .then(res => {
          if(res.result) {
            setQuotationsByLead(res.data);
          } else {
            console.log('[LeadDetailsModel] fail to get quotation :', res.message);
            setQuotationsByLead([]);
          };
        });

      handleInitialize();
      handleInit(false);
    };
  }, [selectedLead, currentLeadCode, setCurrentCompany, loadCompanyMAContracts]);
  

  return (
    <>
      <div
        className="modal right fade"
        id="leads-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
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
                  original={selectedLead}
                  name='lead_name'
                  title={t('lead.lead_name')}
                  onEditing={handleDetailChange}
                />
                <DetailTitleItem
                  original={selectedLead}
                  name='company_name'
                  title={t('company.company_name')}
                  onEditing={handleDetailChange}
                />
              </div>
              <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWidthChange} />
              <button
                type="button"
                className="btn-close xs-close"
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
                    <li role="presentation"  style={{ flex: 1, textAlign: "center" }}>
                      <Link
                        to="#on-time"
                        className={selectedLead.status === "Not On Time" || selectedLead.status === null ? "active" : "inactive"}
                        style={{ width: "400px" }} 
                        aria-controls="not-contacted"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Not On Time" ? "true" : "false"}
                        onClick={() => handleChangeStatus("Not On Time")}
                      >
                        <span className="octicon octicon-light-bulb" />
                        {t('lead.not_on_time')}
                      </Link>
                    </li>
                    <li role="presentation" style={{ flex: 1, textAlign: "center" }}>
                      <Link
                        to="#on-time"
                        className={selectedLead.status === "On Time" ? "active" : "inactive"}
                        style={{ width: "400px" }} 
                        aria-controls="not-contacted"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "On Time" ? "true" : "false"}
                        onClick={() => handleChangeStatus("On Time")}
                      >
                        {/* <span className="octicon octicon-diff-added" /> */}
                        <span className="octicon octicon-light-bulb" />
                        {t('lead.on_time')}
                      </Link>
                    </li>
                    {/* <li role="presentation" className="">
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
                            {t('purchase.product_info') + "(" + validMACount + "/" + purchaseByCompany.length + ")"}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#sub-lead-consultings"
                            data-bs-toggle="tab"
                          >
                            {t('lead.consulting_history') + '('} {consultingByLead.length}{')'}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#sub-lead-quotation"
                            data-bs-toggle="tab"
                          >
                            {t('lead.quotation_history') + '('} {quotationByLead.length}{')'}
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
                            handleInitAddPurchase={setInitAddPurchase}
                          />
                        </div>
                        <div className="tab-pane task-related p-0"
                          id="sub-lead-consultings" >
                          <LeadConsultingModel
                            handleInitAddConsulting={setInitAddConsulting}
                          />
                        </div>
                        <div className="tab-pane task-related p-0"
                          id="sub-lead-quotation" >
                          <LeadQuotationModel
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
                    onClick={handleClose}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              }
            </div>
          </div>
          {/* modal-content */}
        </div>
      </div>
      <ConsultingAddModel init={initAddConsulting} handleInit={setInitAddConsulting} />
      <ConsultingDetailsModel />
      <QuotationAddModel init={initAddQuotation} handleInit={setInitAddQuotation} />
      <QuotationDetailsModel  init={initEditQuotation} handleInit={setInitEditQuotation}/>
      <PurchaseAddModel init={initAddPurchase} handleInit={setInitAddPurchase} />
      <PurchaseDetailsModel />
    </>
  );
};

export default LeadDetailsModel;

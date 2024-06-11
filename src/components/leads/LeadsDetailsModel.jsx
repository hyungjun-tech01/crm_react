import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { Collapse, Space, Switch } from "antd";
import { atomCurrentLead, defaultLead, atomCurrentCompany, defaultCompany, 
         atomCompanyConsultings,atomFilteredConsulting, atomCompanyQuotations, atomFilteredQuotation,
         atomCompanyPurchases, atomFilteredPurchase, atomCompanyState, atomCompanyForSelection } from "../../atoms/atoms";
import { atomUserState, atomEngineersForSelection, atomSalespersonsForSelection } from '../../atoms/atomsUser';
import { CompanyRepo} from "../../repository/company";
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { UserRepo } from '../../repository/user';
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import { Avatar, selectClasses } from "@mui/material";
import DetailDateItem from "../../constants/DetailDateItem";
import { ConsultingRepo } from "../../repository/consulting";
import { QuotationRepo } from "../../repository/quotation";
import { PurchaseRepo } from "../../repository/purchase";
import { ExpandMore } from "@mui/icons-material";
import ConsultingsDetailsModel from "../consulting/ConsultingsDetailsModel";
import QuotationsDetailsModel from "../quotations/QuotationsDetailsModel";
import PurchaseDetailsModel from "../purchase/PurchaseDetailsModel";
import ConsultingAddModal from "../consulting/ConsultingAddModal";
import {  Edit } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import { option_locations } from "../../constants/constans";


const LeadsDetailsModel = () => {
  const { Panel } = Collapse;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);

  //===== [RecoilState] Related with Lead ==========================================
  const selectedLead = useRecoilValue(atomCurrentLead);
  const { modifyLead, setCurrentLead } = useRecoilValue(LeadRepo);
  const filteredConsultings = useRecoilValue(atomFilteredConsulting);

  //===== [RecoilState] Related with Company =======================================
  const companyState = useRecoilValue(atomCompanyState);
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { loadAllCompanies, modifyCompany } = useRecoilValue(CompanyRepo);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);

  const companyConsultings = useRecoilValue(atomCompanyConsultings);
  
  const companyQuotations = useRecoilValue(atomCompanyQuotations);
  const filteredQuotations = useRecoilValue(atomFilteredQuotation);

  const companyPurchases = useRecoilValue(atomCompanyPurchases);
  const filteredPurchases = useRecoilValue(atomFilteredPurchase);

  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
  const { loadAllUsers } = useRecoilValue(UserRepo)
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);
  

  //===== Handles to deal this component ============================================
  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [ currentLeadCode, setCurrentLeadCode ] = useState('');

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  //===== Handles to edit 'Lead Details' ===============================================
  const [ editedDetailValues, setEditedDetailValues ] = useState(null);

  const handleDetailEditing = useCallback((e) => {
    if(e.target.value !== selectedLead[e.target.name]){
      const tempEdited = {
        ...editedDetailValues,
        [e.target.name]: e.target.value,
      };
      console.log('handleDetailEditing : ', tempEdited);
      setEditedDetailValues(tempEdited);
    } else {
      if(editedDetailValues[e.target.name]){
        delete editedDetailValues[e.target.name];
      };
    };
  }, [editedDetailValues, selectedLead]);

  const handleDetailDateChange = useCallback((name, date) => {
    if(date !== new Date(selectedLead[name])){
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
    if(name === 'company_name') {
      if(selectedLead.company_name !== selected.value.company_name){
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
      if(selectedLead[name] !== selected.value){
        isChanged = true;
        tempEdited = {
          ...editedDetailValues,
          [name]: selected.value,
        };
      };
    };
    if(isChanged){
      console.log('handleDetailSelectChange : ', tempEdited);
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues, selectedLead]);

  const handleClose = useCallback(() => {
    setEditedDetailValues(null);
    setCurrentLead();
  }, [setCurrentLead]);

  const handleSaveAll = useCallback(() => {
    if(editedDetailValues !== null
      && selectedLead !== defaultLead)
    {
      const temp_all_saved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        lead_code: selectedLead.lead_code,
      };
      if (modifyLead(temp_all_saved)) {
        console.log(`Succeeded to modify lead`);
      } else {
        console.error('Failed to modify lead')
      }
    } else {
      console.log("[ LeadDetailModel ] No saved data");
    };
    setEditedDetailValues(null);
  }, [cookies.myLationCrmUserId, editedDetailValues, modifyLead, selectedLead]);

  const handleCancelAll = useCallback(() => {
    setEditedDetailValues(null);
  }, []);


  //===== Handles to edit 'Purchase Details' ===============================================
  const [ validMACount, setValidMACount ] = useState(0);
  const [ purchasesByCompany, setPurchasesByCompany] = useState([]);

  //===== Handles to edit 'Consulting Details' ===============================================
  const [ consultingsByLead, setConsultingsByLead] = useState([]);

  //===== Handles to edit 'Quotation Details' ===============================================
  const [ quotationsByLead, setQuotationsByLead] = useState([]);

  
//===== Handles related with Search ===============================================  
  const [searchCondition, setSearchCondition] = useState("");
  const [searchQuotationCondition, setSearchQuotationCondition] = useState("");
  const [searchPurchaseCondition, setSearchPurchaseCondition] = useState("");
  const {  filterConsulting, setCurrentConsulting} = useRecoilValue(ConsultingRepo);
  const {  setCurrentQuotation, filterCompanyQuotation} = useRecoilValue(QuotationRepo);
  const {  setCurrentPurchase , filterCompanyPurchase} = useRecoilValue(PurchaseRepo);

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    console.log("handleSearchCondition", searchCondition)
    filterConsulting(newValue);  
  };

  const handleSearchQuotationCondition = (newValue)=> {
    setSearchQuotationCondition(newValue);
    console.log("handleSearchCondition", searchQuotationCondition)
    filterCompanyQuotation(newValue);  
  };

  const handleSearchPurchaseCondition = (newValue)=> {
    setSearchPurchaseCondition(newValue);
    console.log("handleSearchCondition", searchPurchaseCondition)
    filterCompanyPurchase(newValue);  
  };
  
  // 상태(state) 정의
const [selectedRow, setSelectedRow] = useState(null);

// --- Funtions for Editing ---------------------------------
  const handleAddNewConsultingClicked = useCallback(() => {
    //initializeLeadTemplate();
  }, []);

  
  //change status chage 
  const handleChangeStatus = (newStatus)=>{
    const tempEdited = {
      status:newStatus,
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

  // --- Funtions for Specific Changes in Detail ---------------------------------

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
  

  const lead_items_info = [
    { key:'lead_name',title:'lead.lead_name',detail:{type:'label',editing:handleDetailEditing}},
    { key:'position',title:'lead.position',detail:{type:'label',editing:handleDetailEditing}},
    { key:'is_keyman',title:'lead.is_keyman',detail:{type:'select',options:KeyManForSelection,editing:handleDetailSelectChange}},
    { key:'region',title:'common.region',detail:{type:'select',options:option_locations.ko,editing:handleDetailSelectChange}},
    { key:'company_name',title:'company.company_name',detail:{type:'select',options:companyForSelection,key:'company_name',editing:handleDetailSelectChange}},
    { key:'company_name_en',title:'company.eng_company_name',detail:{type:'label',editing:handleDetailEditing}},
    { key:'department',title:'lead.department',detail:{type:'label',editing:handleDetailEditing}},
    { key:'position',title:'lead.position',detail:{type:'label',editing:handleDetailEditing}},
    { key:'mobile_number',title:'lead.mobile',detail:{type:'label',editing:handleDetailEditing}},
    { key:'company_phone_number',title:'company.phone_number',detail:{type:'label',editing:handleDetailEditing}},
    { key:'company_fax_number',title:'company.fax_number',detail:{type:'label',editing:handleDetailEditing}},
    { key:'email',title:'lead.email',detail:{type:'label',editing:handleDetailEditing}},
    { key:'homepage',title:'lead.homepage',detail:{type:'label',editing:handleDetailEditing}},
    { key:'company_zip_code',title:'company.zip_code',detail:{type:'label',editing:handleDetailEditing}},
    { key:'company_address',title:'company.address',detail:{type:'label', extra:'long',editing:handleDetailEditing}},
    { key:'sales_resource',title:'lead.lead_sales',detail:{type:'select',options:salespersonsForSelection,editing:handleDetailSelectChange}},
    { key:'application_engineer',title:'company.engineer',detail:{type:'select',options:engineersForSelection,editing:handleDetailSelectChange}},
    { key:'create_date',title:'common.regist_date',detail:{type:'date',editing:handleDetailDateChange}},
  ];

  useEffect(() => {
    console.log('[LeadDetailModel] useEffect / lead');
    if((selectedLead !== defaultLead) 
      && (selectedLead.lead_code !== currentLeadCode)) {
      console.log('[LeadsDetailsModel] called!');

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if(detailViewStatus === null){
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if(detailViewStatus === '0'){
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      setCurrentLeadCode(selectedLead.company_code);
    };
  }, [selectedLead, currentLeadCode]);

  useEffect(() => {   
    console.log('[LeadsDetailsModel] useEffect / company');
    if((companyState & 1) === 0) {
      loadAllCompanies();
    };
  }, [companyState, loadAllCompanies]);

  useEffect(() => {
    console.log('[CompanyAddModel] loading user data!');
    if((userState & 1) === 0) {
        loadAllUsers();
    }
  }, [userState, loadAllUsers ])

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
                    <Avatar>{selectedLead.lead_name === null ? "":(selectedLead.lead_name).substring(0,1)}</Avatar>
                  </div>
                </div>
                <DetailTitleItem
                  original={ selectedLead.lead_name }
                  name='status'
                  title={t('lead.lead_name')}
                  onEditing={handleDetailEditing}
                />
                <DetailTitleItem
                  original={ selectedLead.company_name }
                  name='status'
                  title={t('company.company_name')}
                  onEditing={handleDetailEditing}
                />
                <DetailTitleItem
                  original={ selectedLead.status ? selectedLead.status : "Not Contacted" }
                  name='status'
                  title={t('common.status')}
                  onEditing={handleDetailEditing}
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
              <div className="row">
                <div className="col-md-12">
                  <ul
                    className="cd-breadcrumb triangle nav nav-tabs w-100 crms-steps"
                    role="tablist"
                  >
                    <li role="presentation">
                      <Link
                        to="#not-contacted"
                        className={selectedLead.status === "Not Contacted" || selectedLead.status === null ? "active":"" }
                        aria-controls="not-contacted"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Not Contacted" ? "true":"false" }
                        onClick={() => handleChangeStatus("Not Contacted")}
                      >
                        <span className="octicon octicon-light-bulb" />
                        {t('lead.not_contacted')}
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#attempted-contact"
                        className={selectedLead.status === "Attempted Contact" ? "active":"inactive" }
                        aria-controls="attempted-contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Attempted Contact" ? "true":"false" }
                        onClick={() => handleChangeStatus("Attempted Contact")}
                      >
                        <span className="octicon octicon-diff-added" />
                        {t('lead.attempted_contact')}
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#contact"
                        className={selectedLead.status === "Contact" ? "active":"inactive" }
                        aria-controls="contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Contact" ? "true":"false" }
                        onClick={() => handleChangeStatus("Contact")}
                      >
                        <span className="octicon octicon-comment-discussion" />
                        {t('lead.contact')}
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#converted"
                        className={selectedLead.status === "Converted" ? "active":"inactive" }
                        aria-controls="contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded={selectedLead.status === "Converted" ? "true":"false" }
                        onClick={() => handleChangeStatus("Converted")}
                      >
                        <span className="octicon octicon-comment-discussion" />
                        {t('lead.converted')}
                      </Link>
                    </li>
                    <li role="presentation" className="d-none">
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
                            {t('lead.purchase_product')+'('} { companyPurchases.length === undefined ? 0:companyPurchases.length }{')'}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-consult"
                            data-bs-toggle="tab"
                          >
                            {t('lead.consulting_history')+'('} { companyConsultings.length === undefined ? 0:companyConsultings.length }{')'}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-quotation"
                            data-bs-toggle="tab"
                          >
                            {t('lead.quotation_history')+'('} { companyQuotations.length === undefined ? 0:companyQuotations.length }{')'}
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
                                { lead_items_info.map((item, index) => 
                                  <DetailCardItem
                                    key={index}
                                    defaultValue={selectedLead[item.key]}
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
                        <div className="tab-pane task-related p-0"
                          id="not-contact-task-consult" >
                          <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                            <thead>
                              <tr>
                                <div className="row">
                                  <div className="col text-start" style={{width:'200px'}}>
                                    <input
                                      id = "searchCondition"
                                      className="form-control" 
                                      type="text"
                                      value={searchCondition}
                                      placeholder= {t('common.search_here')}
                                      onChange ={(e) => handleSearchCondition(e.target.value)}
                                      style={{width:'300px', display: 'inline'}}
                                    />  
                                  </div>
                                  
                                  {/*data-bs-target="#add_consulting"*/}
                                  <div className="col text-end">
                                    <button
                                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                                      id="add-task"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add_consulting"
                                      onClick={handleAddNewConsultingClicked}
                                    >
                                      {t('consulting.add_consulting')}
                                    </button>
                                  </div>
                                </div>
                              </tr>
                              <tr>
                                <th>{t('consulting.type')}</th>
                                <th>{t('consulting.receipt_date')}</th>
                                <th>{t('common.status')}</th>
                                <th>{t('consulting.receiver')}</th>
                                <th className="text-end">{t('lead.lead_name')}</th>
                              </tr>
                            </thead>
                            {
                              searchCondition === "" ? 
                              companyConsultings.length > 0 &&
                              <tbody>
                                { companyConsultings.map(consulting =>
                                <React.Fragment key={consulting.consulting_code}>
                                  <tr key={consulting.consulting_code}>
                                      <td>{consulting.consulting_type}
                                        <ExpandMore  onClick={() => handleRowClick(consulting)}/>
                                        <a href="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#consulting-details"
                                          onClick={()=>{
                                            console.log('showConsultingDetail', consulting.consulting_code);
                                            setCurrentConsulting(consulting.consulting_code);
                                        }}>
                                          <Edit fontSize="small"/>
                                        </a>
                                      </td>
                                      <td>{consulting.receipt_date && new Date(consulting.receipt_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}
                                      {consulting.receipt_time === null ? "":consulting.receipt_time }
                                      </td>
                                      <td>{consulting.satatus}</td>
                                      <td>{consulting.receiver}</td>
                                      <td className="text-end">{consulting.lead_name}</td>
                                  </tr>
                                  {selectedRow === consulting && (
                                  <tr>
                                      <td colSpan="5" >
                                        <tr>Request: {consulting.request_content && 
                                                        consulting.request_content.split('\n').map((line, index) => (
                                                        <div key={index}>{line}</div>))
                                                      }
                                        </tr>
                                        <tr>Actions: {consulting.action_content && 
                                                      consulting.action_content.split('\n').map((line, index) => (
                                                      <div key={index}>{line}</div>))
                                                    }
                                        </tr>
                                      </td>
                                  </tr>)}
                                  </React.Fragment>
                                )}
                              </tbody> 
                              : 
                              filteredConsultings.length > 0 &&
                              <tbody>
                                { filteredConsultings.map(consulting =>
                                  <tr key={consulting.consulting_code}>
                                    <td>{consulting.consulting_type}</td>
                                    <td>{consulting.receipt_date && new Date(consulting.receipt_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}
                                    {consulting.receipt_time === null ? "":consulting.receipt_time }
                                    </td>
                                    <td>{consulting.satatus}</td>
                                    <td>{consulting.receiver}</td>
                                    <td className="text-end">{consulting.lead_name}</td>
                                  </tr>
                                )}
                              </tbody> 
                            }
                          </table>
                        </div>


                        <div className="tab-pane task-related p-0"
                          id="not-contact-task-quotation" >
                          <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                            <thead>
                              <tr>
                                <div className="row">
                                  <div className="col text-start" style={{width:'200px'}}>
                                    <input
                                      id = "searchQuotationCondition"
                                      className="form-control" 
                                      type="text"
                                      placeholder= {t('common.search_here')}
                                      value={searchQuotationCondition}
                                      onChange ={(e) => handleSearchQuotationCondition(e.target.value)}
                                      style={{width:'300px', display: 'inline'}}
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
                                { companyQuotations.map(quotation =>
                                <React.Fragment key={quotation.quotation_code}>
                                  <tr key={quotation.quotation_code}>
                                      <td>{quotation.quotation_type} </td>
                                      <td>{quotation.quotation_title}
                                        <a href="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#quotations-details"
                                            onClick={()=>{
                                              console.log('showQuotationDetail', quotation.quotation_code);
                                              setCurrentQuotation(quotation.quotation_code);
                                          }}>
                                            <Edit fontSize="small"/>
                                          </a>
                                      </td>
                                      <td>{quotation.quotation_date && new Date(quotation.quotation_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}
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
                                { filteredQuotations.map(quotation =>
                                  <tr key={quotation.quotation_code}>
                                    <td>{quotation.quotation_type}</td>
                                    <td>{quotation.quotation_title}
                                        <a href="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#quotations-details"
                                            onClick={()=>{
                                              console.log('showQuotationDetail', quotation.quotation_code);
                                              setCurrentQuotation(quotation.quotation_code);
                                          }}>
                                            <Edit fontSize="small"/>
                                          </a>
                                      </td>
                                      <td>{quotation.quotation_date && new Date(quotation.quotation_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}
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

                        <div className="tab-pane task-related p-0"
                          id="not-contact-task-purchase" >
                          <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                            <thead>
                              <tr>
                                <div className="row">
                                  <div className="col text-start" style={{width:'200px'}}>
                                    <input
                                      id = "searchPurchaseCondition"
                                      className="form-control" 
                                      type="text"
                                      value={searchPurchaseCondition}
                                      placeholder= {t('common.search_here')}
                                      onChange ={(e) => handleSearchPurchaseCondition(e.target.value)}
                                      style={{width:'300px', display: 'inline'}}
                                    />  
                                  </div>
                                </div>
                              </tr>
                              <tr>
                                <th style={{ width: '80px' }}>{t('purchase.product_type')}</th>
                                <th style={{ width: '300px' }}>{t('purchase.product_name')}</th>
                                <th>{t('purchase.serial')}</th>
                                <th>{t('purchase.delivery_date')}</th>
                                <th>{t('purchase.ma_contract_date')}</th>
                                <th>{t('purchase.ma_finish_date')}</th>
                                <th>{t('common.quantity')}</th>
                              </tr>
                            </thead>
                            {
                              searchPurchaseCondition === "" ? 
                              companyPurchases.length > 0 &&
                              <tbody>
                                { companyPurchases.map(purchase =>
                                <React.Fragment key={purchase.purchase_code}>
                                  <tr key={purchase.purchase_code}>
                                      <td>{purchase.product_type} </td>
                                      <td> <a href="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#purchase-details"
                                            onClick={()=>{
                                              console.log('showPurchaseDetail', purchase.purchase_code);
                                              setCurrentPurchase(purchase.purchase_code);
                                          }}>
                                            {purchase.product_name}
                                            <Edit fontSize="small"/>
                                          </a>
                                      </td>
                                      <td>{purchase.serial_number} </td>
                                      <td>{purchase.delivery_date && new Date(purchase.delivery_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}
                                      </td>
                                      <td>{purchase.ma_contract_date && new Date(purchase.ma_contract_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}</td>
                                      <td>{purchase.ma_finish_date && new Date(purchase.ma_finish_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}</td>
                                      <td className="text-end">{purchase.quantity}</td>
                                  </tr>
                                  </React.Fragment>
                                )}
                              </tbody> 
                              : 
                              filteredPurchases.length > 0 &&
                              <tbody>
                                { filteredPurchases.map(purchase =>
                                  <tr key={purchase.purchase_code}>
                                    <td>{purchase.product_type} </td>
                                      <td> <a href="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#purchase-details"
                                            onClick={()=>{
                                              console.log('showPurchaseDetail', purchase.purchase_code);
                                              setCurrentPurchase(purchase.purchase_code);
                                          }}>
                                            {purchase.product_name}
                                            <Edit fontSize="small"/>
                                          </a>
                                      </td>
                                      <td>{purchase.serial_number} </td>
                                      <td>{purchase.delivery_date && new Date(purchase.delivery_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}
                                      </td>
                                      <td>{purchase.ma_contract_date && new Date(purchase.ma_contract_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}</td>
                                      <td>{purchase.ma_finish_date && new Date(purchase.ma_finish_date).toLocaleDateString('ko-KR', {year:'numeric',month:'short',day:'numeric'})}</td>
                                      <td className="text-end">{purchase.quantity}</td>
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
          {/* modal-content */}
        </div>
        {/* modal-dialog */}
      </div>
      <ConsultingsDetailsModel />
      <QuotationsDetailsModel  />
      <PurchaseDetailsModel  />
      <ConsultingAddModal currentLead={selectedLead.lead_code} previousModalId='#leads-details'/>
    </>
  );
};

export default LeadsDetailsModel;

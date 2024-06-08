import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { CircleImg } from "../imagepath";
import { Collapse, Space, Switch } from "antd";
import { atomCurrentLead, defaultLead, atomCurrentCompany, defaultCompany, 
         atomCompanyConsultings,atomFilteredConsulting, atomCompanyQuotations, atomFilteredQuotation,
         atomCompanyPurchases, atomFilteredPurchase } from "../../atoms/atoms";
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { CompanyRepo} from "../../repository/company";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import { Avatar } from "@mui/material";
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


const LeadsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedLead = useRecoilValue(atomCurrentLead);
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const companyConsultings = useRecoilValue(atomCompanyConsultings);
  const filteredConsultings = useRecoilValue(atomFilteredConsulting);

  const companyQuotations = useRecoilValue(atomCompanyQuotations);
  const filteredQuotations = useRecoilValue(atomFilteredQuotation);

  const companyPurchases = useRecoilValue(atomCompanyPurchases);
  const filteredPurchases = useRecoilValue(atomFilteredPurchase);
  

  const { t } = useTranslation();

  const { modifyLead, setCurrentLead } = useRecoilValue(LeadRepo);
  const { modifyCompany } = useRecoilValue(CompanyRepo);
  const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);

  const [ isFullScreen, setIsFullScreen ] = useState(false);

  const [ editedValues, setEditedValues ] = useState(null);
  const [ editedValuesCompany, setEditedValuesCompany ] = useState(null);

  const [activeTab, setActiveTab] = useState(""); // 상태 관리를 위한 useState
  
  const [searchCondition, setSearchCondition] = useState("");
  const [searchQuotationCondition, setSearchQuotationCondition] = useState("");
  const [searchPurchaseCondition, setSearchPurchaseCondition] = useState("");
  const {  filterConsulting, setCurrentConsulting} = useRecoilValue(ConsultingRepo);
  const {  setCurrentQuotation, filterCompanyQuotation} = useRecoilValue(QuotationRepo);
  const {  setCurrentPurchase , filterCompanyPurchase} = useRecoilValue(PurchaseRepo);
  const [ leadChange, setLeadChange ] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedKeyMan, setSelectedKeyMan] = useState([]);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState([]);
  
  
  // 상태(state) 정의
const [selectedRow, setSelectedRow] = useState(null);

// --- Funtions for Editing ---------------------------------
  const handleAddNewConsultingClicked = useCallback(() => {
    //initializeLeadTemplate();
  }, []);

  const initializeLeadTemplate = useCallback(() => {
    setLeadChange({ ...defaultLead });
    setSelectedOption([]);
    setSelectedKeyMan([]);
    setSelectedLeadStatus([]);
    document.querySelector("#add_new_lead_form").reset();
  }, []);

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

  // --- Funtions for Editing Detail ---------------------------------
  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleSaveAll = useCallback(() => {
    if(editedValues !== null
      && selectedLead !== defaultLead)
    {
      const temp_all_saved = {
        ...editedValues,
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
    setEditedValues(null);
  }, [editedValues, selectedLead]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
  }, []);

  // --- Funtions for Select ---------------------------------
  const handleSelectChange = useCallback((name, selected) => {
    const tempEdited = {
      ...editedValues,
      [name]: selected.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  // -- Company Modify 
  const handleEditingCompany = useCallback((e) => {
    const tempEdited = {
      ...editedValuesCompany,
      [e.target.name]: e.target.value,
    };
    setEditedValuesCompany(tempEdited);
  }, [editedValuesCompany]);

  const handleSaveAllCompany = useCallback(() => {
    if(editedValuesCompany !== null
      && selectedCompany
      && selectedCompany !== defaultCompany)
    {
      const temp_all_saved = {
        ...editedValuesCompany,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        company_code: selectedCompany.company_code,
      };
      if (modifyCompany(temp_all_saved)) {
        console.log(`Succeeded to modify lead`);
      } else {
        console.error('Failed to modify lead')
      }
    } else {
      console.log("[ LeadDetailModel ] No saved data");
    };
    setEditedValuesCompany(null);
  }, [editedValuesCompany, selectedCompany]);  

  const handleCancelAllCompany = useCallback(() => {
    setEditedValuesCompany(null);
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
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);
  const [ orgCloseDate, setOrgCloseDate ] = useState(null);

  const handleCompanyDateChange = useCallback((name, date) => {
    const tempEdited = {
      ...editedValuesCompany,
      [name]: date,
    };
    setEditedValuesCompany(tempEdited);
  }, [editedValuesCompany]);

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

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  const handleClose = useCallback(() => {
    setEditedValues(null);
    setCurrentLead();
  }, []);

  const lead_items_info = [
    ['is_keyman','lead.is_keyman',{ type:'label'}],
    ['department','lead.department',{ type:'label'}],
    ['position','lead.position',{ type:'label'}],
    ['email','lead.email',{ type:'label'}],
    ['homepage','lead.homepage',{ type:'label'}],
    ['group_','lead.lead_group',{ type:'label', extra:'long'}],
    ['region','common.region',{ type:'label'}],
    ['sales_resource','quotation.sales_rep',{ type:'label'}],
    ['application_engineer','company.engineer',{ type:'label'}],
    ['mobile_number','lead.mobile',{ type:'label'}],
    ['company_name_en','company.eng_company_name',{ type:'label'}],
    ['company_zip_code','common.zip_code',{ type:'label'}],
    ['company_address','company.address',{ type:'label', extra:'long'}],
    ['company_phone_number','common.phone_no',{ type:'label'}],
    ['company_fax_number','common.fax_no',{ type:'label'}],
  ];

  useEffect(() => {
    if(selectedLead !== defaultLead) {
      console.log('[LeadsDetailsModel] called!');
      setOrgEstablishDate(selectedCompany.establishment_date ? new Date(selectedCompany.establishment_date) : null);
      setOrgCloseDate(selectedCompany.closure_date ? new Date(selectedCompany.closure_date) : null);

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
  }, [selectedLead, editedValues, selectedCompany.establishment_date, selectedCompany.closure_date]);

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
                  onEditing={handleEditing}
                />
                <DetailTitleItem
                  original={ selectedLead.company_name }
                  name='status'
                  title={t('company.company_name')}
                  onEditing={handleEditing}
                />
                <DetailTitleItem
                  original={ selectedLead.status ? selectedLead.status : "Not Contacted" }
                  name='status'
                  title={t('common.status')}
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
                            to="#not-contact-task-related"
                            data-bs-toggle="tab"
                          >
                             {t('lead.company_information')}
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
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-purchase"
                            data-bs-toggle="tab"
                          >
                            {t('lead.purchase_product')+'('} { companyPurchases.length === undefined ? 0:companyPurchases.length }{')'}
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
                                    defaultText={selectedLead[item.at(0)]}
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
                          className="tab-pane task-related p-0"
                          id="not-contact-task-related" >
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                              <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                                <Panel header={t('company.company_name')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_name}
                                        name="company_name"
                                        title={t('company.company_name')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_name_eng}
                                        name="company_name_eng"
                                        title={t('company.eng_company_name')}
                                        no_border={true}
                                        editing={handleEditingCompany}
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
                                        name="group_"
                                        title={t('company.group')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_scale}
                                        name="company_scale"
                                        title={t('company.company_scale')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.deal_type}
                                        name="deal_type"
                                        title={t('company.deal_type')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.business_registration_code}
                                        name="business_registration_code"
                                        title={t('company.business_registration_code')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailDateItem
                                        title={t('company.establishment_date')}
                                        timeData={orgEstablishDate}
                                        timeDataChange={(date) => handleCompanyDateChange('establishment_date', date)}
                                      />
                                      <DetailDateItem
                                        name="closure_date"
                                        title={t('company.closure_date')}
                                        timeData={orgCloseDate}
                                        timeDataChange={(date) => handleCompanyDateChange('closure_date', date)}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.ceo_name}
                                        name="ceo_name"
                                        title={t('company.ceo_name')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.business_type}
                                        name="business_type"
                                        title={t('company.business_type')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.business_item}
                                        name="business_item"
                                        title={t('company.business_item')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.industry_type}
                                        name="industry_type"
                                        title={t('company.industry_type')}
                                        no_border={true}
                                        editing={handleEditingCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                                <Panel header= {t('common.contact_details')}  key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_phone_number}
                                        name="company_phone_number"
                                        title={t('company.phone_number')} 
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_fax_number}
                                        name="company_fax_number"
                                        title={t('company.fax_number')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.homepage}
                                        name="homepage"
                                        title= {t('company.homepage')}
                                        no_border={true}
                                        editing={handleEditingCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                                <Panel header= {t('company.address')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_address}
                                        name="company_address"
                                        title= {t('company.address')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_zip_code}
                                        name="company_zip_code"
                                        title= {t('company.zip_code')}
                                        no_border={true}
                                        editing={handleEditingCompany}
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
                                        name="account_code"
                                        title= {t('company.account_code')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.bank_name}
                                        name="bank_name"
                                        title= {t('company.bank_name')} 
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.account_owner}
                                        name="account_owner"
                                        title= {t('company.account_owner')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.sales_resource}
                                        name="sales_resource"
                                        title= {t('company.salesman')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.application_engineer}
                                        name="application_engineer"
                                        title= {t('company.engineer')}
                                        editing={handleEditingCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.region}
                                        name="region"
                                        title= {t('common.region')}
                                        no_border={true}
                                        editing={handleEditingCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
                                <Panel header= {t('common.memo')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailTextareaItem
                                        defaultText={selectedCompany.memo}
                                        name="memo"
                                        title= {t('company.memo')}
                                        row_no={3}
                                        no_border={true}
                                        editing={handleEditingCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
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
                { editedValuesCompany !== null && Object.keys(editedValuesCompany).length !== 0 &&
                  <div className="text-center py-3">
                    <button
                      type="button"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      onClick={handleSaveAllCompany}
                    >
                      {t('common.save')}
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      onClick={handleCancelAllCompany}
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

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { CircleImg, SystemUser } from "../imagepath";
import { Collapse } from "antd";
import { atomCurrentLead, defaultLead, atomCurrentCompany, defaultCompany, atomCompanyConsultings,atomFilteredConsulting } from "../../atoms/atoms";
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import { CompanyRepo} from "../../repository/company";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import DetailSelectItem from "../../constants/DetailSelectItem";
import { Avatar } from "@mui/material";
import DetailDateItem from "../../constants/DetailDateItem";
import {ConsultingRepo} from "../../repository/consulting"
import {ExpandMore} from "@mui/icons-material";
import ConsultingsDetailsModel from "../consulting/ConsultingsDetailsModel";
import {  Edit } from '@mui/icons-material';
import { useTranslation } from "react-i18next";


const LeadsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedLead = useRecoilValue(atomCurrentLead);
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const companyConsultings = useRecoilValue(atomCompanyConsultings);
  const filteredConsultings = useRecoilValue(atomFilteredConsulting);

  const { t } = useTranslation();

  const { modifyLead, setCurrentLead } = useRecoilValue(LeadRepo);
  const { modifyCompany } = useRecoilValue(CompanyRepo);
  const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);

  const [ editedValues, setEditedValues ] = useState(null);
  const [ savedValues, setSavedValues ] = useState(null);

  const [ editedValuesCompany, setEditedValuesCompany ] = useState(null);
  const [ savedValuesCompany, setSavedValuesCompany ] = useState(null);
  const [activeTab, setActiveTab] = useState(""); // 상태 관리를 위한 useState
  const [expanded, setExpaned] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");
  const [searchCondition, setSearchCondition] = useState("");
  const { loadCompanyConsultings, filterConsulting, setCurrentConsulting} = useRecoilValue(ConsultingRepo);
  
  // 상태(state) 정의
const [selectedRow, setSelectedRow] = useState(null);

  // --- Funtions for Editing ---------------------------------

  const handleSearchCondition =  (newValue)=> {
    setSearchCondition(newValue);
    console.log("handleSearchCondition",statusSearch, searchCondition)
    filterConsulting(statusSearch, newValue);  // filterLeads(newValue);
  };

  const handleStatusSearch = (newValue) => {
    setStatusSearch(newValue);
    if(newValue === "All"){
      loadCompanyConsultings(selectedLead.company_code); 
      setSearchCondition("");
    }else{
      filterConsulting(newValue, searchCondition);
      //loadCompanyConsultings(selectedLead.company_code); 
    }
    setExpaned(false);
   
  }

  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedLead[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedLead]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if(editedValues[name] === selectedLead[name]){
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
  }, [editedValues, selectedLead]);

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
      && selectedLead
      && selectedLead !== defaultLead)
    {
      const temp_all_saved = {
        ...savedValues,
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
    setSavedValues(null);
  }, [savedValues, selectedLead]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
  }, []);

  // --- Funtions for Select ---------------------------------
  const handleEndEditKeyMan = useCallback((value) => {
    console.log('handleEndEditKeyMan called! : ', value);
    const selected = value.value;

    if(editedValues.is_keyman === selected){
      const tempEdited = {
        ...editedValues,
      };
      delete tempEdited.is_keyman;
      setEditedValues(tempEdited);
      return;
    };

    console.log('handleEndEditKeyMan edited : ', editedValues.is_keyman);
    const tempSaved = {
      ...savedValues,
      is_keyman : selected,
    }
    setSavedValues(tempSaved); 

    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.is_keyman;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, selectedLead.is_keyman]);

  // -- Company Modify 
  const handleCheckEditStateCompany = useCallback((name) => {
    return editedValuesCompany !== null && name in editedValuesCompany;
  }, [editedValuesCompany]);  

  const handleStartEditCompany = useCallback((name) => {
    const tempEdited = {
      ...editedValuesCompany,
      [name]: selectedCompany[name],
    };
    setEditedValuesCompany(tempEdited);
  }, [editedValuesCompany, selectedCompany]);

  const handleEditingCompany = useCallback((e) => {
    const tempEdited = {
      ...editedValuesCompany,
      [e.target.name]: e.target.value,
    };
    setEditedValuesCompany(tempEdited);
  }, [editedValuesCompany]);

  const handleEndEditCompany = useCallback((name) => {
    if(editedValuesCompany[name] === selectedCompany[name]){
      const tempEdited = {
        ...editedValuesCompany,
      };
      delete tempEdited[name];
      setEditedValuesCompany(tempEdited);
      return;
    };

    const tempSaved = {
      ...savedValuesCompany,
      [name] : editedValuesCompany[name],
    }
    setSavedValuesCompany(tempSaved);  

    const tempEdited = {
      ...editedValuesCompany,
    };
    delete tempEdited[name];
    setEditedValuesCompany(tempEdited);
  }, [editedValuesCompany, savedValuesCompany, selectedCompany]);

  const handleCheckSavedCompany = useCallback((name) => {
      return savedValuesCompany !== null && name in savedValuesCompany;
  }, [savedValuesCompany]);    

  const handleCancelSavedCompany = useCallback((name) => {
    const tempSaved = {
      ...savedValuesCompany,
    };
    delete tempSaved[name];
    setSavedValuesCompany(tempSaved);
  }, [savedValuesCompany]);  

  const handleSaveAllCompany = useCallback(() => {
    if(savedValuesCompany !== null
      && selectedCompany
      && selectedCompany !== defaultCompany)
    {
      const temp_all_saved = {
        ...savedValuesCompany,
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
    setSavedValuesCompany(null);
  }, [savedValuesCompany, selectedCompany]);  

  const handleCancelAllCompany = useCallback(() => {
    setEditedValuesCompany(null);
    setSavedValuesCompany(null);
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

  // --- Funtions for Establishment Date ---------------------------------
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);
  const [ establishDate, setEstablishDate ] = useState(new Date());
  const [ orgCloseDate, setOrgCloseDate ] = useState(null);
  const [ closeDate, setCloseDate ] = useState(new Date());

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

  useEffect(() => {
    console.log('[LeadsDetailsModel] called!');
    setOrgEstablishDate(selectedCompany.establishment_date ? new Date(selectedCompany.establishment_date) : null);
    setOrgCloseDate(selectedCompany.closure_date ? new Date(selectedCompany.closure_date) : null);


    }, [selectedLead, savedValues, selectedCompany.establishment_date, selectedCompany.closure_date]);

  return (
    <>
      <div
        className="modal right fade"
        id="leads-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <div className="col-md-7 account d-flex">
                  <div className="company_img">
                  <Avatar>{selectedLead.lead_name === null ? "":(selectedLead.lead_name).substring(0,1)}</Avatar>
                  </div>
                  <div>
                    <span className="modal-title">{selectedLead.lead_name}</span>
                    <span className="rating-star">
                      <i className="fa fa-star" aria-hidden="true" />
                    </span>
                    <span className="lock">
                      <i className="fa fa-lock" aria-hidden="true" />
                    </span>
                  </div>
                </div>
                <div className="col-md-5 text-end">
                  <ul className="list-unstyled list-style-none">
                    <li className="dropdown list-inline-item">
                      <br />
                      <Link
                        className="dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {" "}
                        Actions{" "}
                      </Link>
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to="#">
                          Edit This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Lead Image
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Delete This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Email This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Clone This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Record Owner
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Generate Merge Document
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Lead to Contact
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Convert Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Print This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Merge Into Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          SmartMerge Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add Activity Set To Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Event For Lead
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="btn-close xs-close"
                data-bs-dismiss="modal"
                onClick={()=>setCurrentLead()}
              />
            </div>
            <div className="card due-dates">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <span>{t('lead.lead_status')}</span>
                    <p>{selectedLead.status=== null ? "Not Contacted":selectedLead.status}</p>
                  </div>
                  <div className="col">
                    <span>{t('lead.lead_name')}</span>
                    <p>{selectedLead.lead_name}</p>
                  </div>
                  <div className="col">
                    <span>{t('company.company_name')}</span>
                    <p>{selectedLead.company_name}</p>
                  </div>
                  <div className="col">
                    <span>{t('company.salesman')}</span>
                    <p>{selectedLead.sales_resource}</p>
                  </div>
                  <div className="col">
                    <span>{t('company.homepage')}</span>
                    <a href={selectedLead.homepage} target="_blank" rel="noopener noreferrer">{selectedLead.homepage}</a>
                  </div>
                </div>
              </div>
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
                        Not Contacted
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
                        Attempted Contact
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
                        Contact
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
                        Converted
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
                  id="not-contacted" >
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
                            {t('lead.consulting_history')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-quotation"
                            data-bs-toggle="tab"
                          >
                            {t('lead.quotation_history')}
                          </Link>
                        </li>   
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-production"
                            data-bs-toggle="tab"
                          >
                            제품관리
                          </Link>
                        </li>                                                  
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane show active p-0"
                          id="not-contact-task-details" >
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                              <Collapse accordion expandIconPosition="end" defaultActiveKey={['1']}>
                                <Panel header={t('lead.lead_information')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedLead.lead_name}
                                        saved={savedValues}
                                        name="lead_name"
                                        title={t('lead.lead_name')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.position}
                                        saved={savedValues}
                                        name="position"
                                        title={t('lead.position')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.department}
                                        saved={savedValues}
                                        name="department"
                                        title={t('lead.department')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.company_name}
                                        saved={savedValues}
                                        name="company_name"
                                        title={t('company.company_name')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailSelectItem
                                        defaultText={selectedLead.is_keyman}
                                        saved={savedValues}
                                        name="is_keyman"
                                        title={t('lead.is_keyman')}
                                        options={KeyManForSelection}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        endEdit={handleEndEditKeyMan}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.group_}
                                        saved={savedValues}
                                        name="group_"
                                        title={t('lead.lead_group')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.region}
                                        saved={savedValues}
                                        name="region"
                                        title={t('common.region')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.sales_resource}
                                        saved={savedValues}
                                        name="sales_resource"
                                        title={t('company.salesman')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.application_engineer}
                                        saved={savedValues}
                                        name="application_engineer"
                                        title={t('company.engineer')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <tr>
                                        <td className="border-0">{t('common.created')}</td>
                                        <td className="border-0">
                                          {new Date(selectedLead.create_date).toLocaleDateString('ko-KR', {year:"numeric", month: 'short', day:'numeric'})}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header={t('common.contact_details')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedLead.email}
                                        saved={savedValues}
                                        name="email"
                                        title={t('lead.email')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.mobile_number}
                                        saved={savedValues}
                                        name="mobile_number"
                                        title={t('lead.mobile')}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.homepage}
                                        saved={savedValues}
                                        name="homepage"
                                        title={t('lead.homepage')}
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
                              <Collapse accordion expandIconPosition="end">
                                <Panel header={t('company.address')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedLead.company_address}
                                        saved={savedValues}
                                        name="company_address"
                                        title={t('company.address')}
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedLead.company_zip_code}
                                        saved={savedValues}
                                        name="company_zip_code"
                                        title={t('lead.zip_code')}
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
                              <Collapse accordion expandIconPosition="end">
                                <Panel header={t('lead.lead_status')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailTextareaItem
                                        defaultText={selectedLead.status === null ? 'Not Contacted':selectedLead.status}
                                        saved={savedValues}
                                        name="status"
                                        title={t('lead.lead_status')}
                                        row_no={2}
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
                        <div
                          className="tab-pane task-related p-0"
                          id="not-contact-task-related" >
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                              <Collapse accordion expandIconPosition="end" defaultActiveKey={['1']}>
                                <Panel header={t('company.company_name')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_name}
                                        saved={savedValuesCompany}
                                        name="company_name"
                                        title={t('company.company_name')}
                                        no_border={true}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_name_eng}
                                        saved={savedValuesCompany}
                                        name="company_name_eng"
                                        title={t('company.eng_company_name')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item active">
                              <Collapse accordion expandIconPosition="end" defaultActiveKey={['1']}>
                                <Panel header= {t('company.company_details')}  key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedCompany.group_}
                                        saved={savedValuesCompany}
                                        name="group_"
                                        title={t('company.group')}
                                        no_border={true}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_scale}
                                        saved={savedValuesCompany}
                                        name="company_scale"
                                        title={t('company.company_scale')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.deal_type}
                                        saved={savedValuesCompany}
                                        name="deal_type"
                                        title={t('company.deal_type')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.business_registration_code}
                                        saved={savedValuesCompany}
                                        name="business_registration_code"
                                        title={t('company.business_registration_code')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailDateItem
                                        saved={savedValuesCompany}
                                        name="establishment_date"
                                        title={t('company.establishment_date')}
                                        orgTimeData={orgEstablishDate}
                                        timeData={establishDate}
                                        timeDataChange={handleEstablishDateChange}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEstablishDateEdit}
                                        endEdit={handleEndEstablishDateEdit}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailDateItem
                                        saved={savedValuesCompany}
                                        name="closure_date"
                                        title={t('company.closure_date')}
                                        orgTimeData={orgCloseDate}
                                        timeData={closeDate}
                                        timeDataChange={handleCloseDateChange}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartCloseDateEdit}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndCloseDateEdit}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.ceo_name}
                                        saved={savedValuesCompany}
                                        name="ceo_name"
                                        title={t('company.ceo_name')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.business_type}
                                        saved={savedValuesCompany}
                                        name="business_type"
                                        title={t('company.business_type')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.business_item}
                                        saved={savedValuesCompany}
                                        name="business_item"
                                        title={t('company.business_item')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.industry_type}
                                        saved={savedValuesCompany}
                                        name="industry_type"
                                        title={t('company.industry_type')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header= {t('common.contact_details')}  key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_phone_number}
                                        saved={savedValuesCompany}
                                        name="company_phone_number"
                                        title={t('company.phone_number')} 
                                        no_border={true}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_fax_number}
                                        saved={savedValuesCompany}
                                        name="company_fax_number"
                                        title={t('company.fax_number')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.homepage}
                                        saved={savedValuesCompany}
                                        name="homepage"
                                        title= {t('company.homepage')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header= {t('company.address')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_address}
                                        saved={savedValuesCompany}
                                        name="company_address"
                                        title= {t('company.address')}
                                        no_border={true}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.company_zip_code}
                                        saved={savedValuesCompany}
                                        name="company_zip_code"
                                        title= {t('company.zip_code')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header= {t('common.additional_information')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        defaultText={selectedCompany.account_code}
                                        saved={savedValuesCompany}
                                        name="account_code"
                                        title= {t('company.account_code')}
                                        no_border={true}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.bank_name}
                                        saved={savedValuesCompany}
                                        name="bank_name"
                                        title= {t('company.bank_name')} 
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.account_owner}
                                        saved={savedValuesCompany}
                                        name="account_owner"
                                        title= {t('company.account_owner')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.sales_resource}
                                        saved={savedValuesCompany}
                                        name="sales_resource"
                                        title= {t('company.salesman')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.application_engineer}
                                        saved={savedValuesCompany}
                                        name="application_engineer"
                                        title= {t('company.engineer')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                      <DetailLabelItem
                                        defaultText={selectedCompany.region}
                                        saved={savedValuesCompany}
                                        name="region"
                                        title= {t('common.region')}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
                                      />
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header= {t('common.memo')} key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailTextareaItem
                                        defaultText={selectedCompany.memo}
                                        saved={savedValuesCompany}
                                        name="memo"
                                        title= {t('company.memo')}
                                        row_no={3}
                                        no_border={true}
                                        checkEdit={handleCheckEditStateCompany}
                                        startEdit={handleStartEditCompany}
                                        editing={handleEditingCompany}
                                        endEdit={handleEndEditCompany}
                                        checkSaved={handleCheckSavedCompany}
                                        cancelSaved={handleCancelSavedCompany}
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
                                  <div className="text-start" style={{width:'80px'}}>
                                    <div className="dropdown">
                                      <button className="dropdown-toggle recently-viewed" type="button" onClick={()=>setExpaned(!expanded)}data-bs-toggle="dropdown" aria-expanded={expanded}style={{ backgroundColor: 'transparent',  border: 'none', outline: 'none' }}> Status</button>
                                        <div className={`dropdown-menu${expanded ? ' show' : ''}`}>
                                          <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('All')}>All</button>
                                          <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('접수')}>접수</button>
                                          <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('진행중')}>진행</button>
                                          <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('완료')}>완료</button>
                                        </div>
                                    </div>
                                  </div>
                                  <div className="col text-start" style={{width:'200px'}}>
                                    <input
                                          id = "searchCondition"
                                          className="form-control" 
                                          type="text"
                                          value={searchCondition}
                                          onChange ={(e) => handleSearchCondition(e.target.value)}
                                          placeholder="Lead Name, Receiver" 
                                          style={{width:'300px', display: 'inline'}}

                                    />  
                                  </div>
                                </div>
                                
                              </tr>
                              <tr>
                                <th>Type</th>
                                <th>Date/Time</th>
                                <th>Status</th>
                                <th>Receiver</th>
                                <th className="text-end">Lead Name</th>
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
                                          data-bs-target="#consultings-details"
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

                        <div
                          className="tab-pane p-0"
                          id="not-contact-task-activity"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Total Activities
                                  </h4>
                                  <span>2</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="card bg-gradient-success card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Last Activity
                                  </h4>
                                  <span>1</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="crms-tasks  p-2">
                              <div className="tasks__item crms-task-item active">
                                <Collapse accordion expandIconPosition="end">
                                  <Panel header="Upcoming Activity" key="1">
                                    <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                      <thead>
                                        <tr>
                                          <th>Type</th>
                                          <th>Activity Name</th>
                                          <th>Assigned To</th>
                                          <th>Due Date</th>
                                          <th>Status</th>
                                          <th className="text-end">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>Meeting</td>
                                          <td>Call Enquiry</td>
                                          <td>John Doe</td>
                                          <td>13-Jul-20 11:37 PM</td>
                                          <td>
                                            <label className="container-checkbox">
                                              <input
                                                type="checkbox"
                                                defaultChecked=""
                                              />
                                              <span className="checkmark" />
                                            </label>
                                          </td>
                                          <td className="text-center">
                                            <div className="dropdown dropdown-action">
                                              <Link
                                                to="#"
                                                className="action-icon dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                              >
                                                <i className="material-icons">
                                                  more_vert
                                                </i>
                                              </Link>
                                              <div className="dropdown-menu dropdown-menu-right">
                                                <Link
                                                  className="dropdown-item"
                                                  to="#"
                                                >
                                                  Add New Task
                                                </Link>
                                                <Link
                                                  className="dropdown-item"
                                                  to="#"
                                                >
                                                  Add New Event
                                                </Link>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Meeting</td>
                                          <td>Phone Enquiry</td>
                                          <td>David</td>
                                          <td>13-Jul-20 11:37 PM</td>
                                          <td>
                                            <label className="container-checkbox">
                                              <input
                                                type="checkbox"
                                                defaultChecked=""
                                              />
                                              <span className="checkmark" />
                                            </label>
                                          </td>
                                          <td className="text-center">
                                            <div className="dropdown dropdown-action">
                                              <Link
                                                to="#"
                                                className="action-icon dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                              >
                                                <i className="material-icons">
                                                  more_vert
                                                </i>
                                              </Link>
                                              <div className="dropdown-menu dropdown-menu-right">
                                                <Link
                                                  className="dropdown-item"
                                                  to="#"
                                                >
                                                  Add New Task
                                                </Link>
                                                <Link
                                                  className="dropdown-item"
                                                  to="#"
                                                >
                                                  Add New Event
                                                </Link>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Panel>
                                </Collapse>
                              </div>
                              <div className="tasks__item crms-task-item">
                                <Collapse accordion expandIconPosition="end">
                                  <Panel header="Past Activity" key="1">
                                    <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                      <thead>
                                        <tr>
                                          <th>Type</th>
                                          <th>Activity Name</th>
                                          <th>Assigned To</th>
                                          <th>Due Date</th>
                                          <th>Status</th>
                                          <th className="text-end">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>Meeting</td>
                                          <td>Call Enquiry</td>
                                          <td>John Doe</td>
                                          <td>13-Jul-20 11:37 PM</td>
                                          <td>
                                            <label className="container-checkbox">
                                              <input
                                                type="checkbox"
                                                defaultChecked=""
                                              />
                                              <span className="checkmark" />
                                            </label>
                                          </td>
                                          <td className="text-center">
                                            <div className="dropdown dropdown-action">
                                              <Link
                                                to="#"
                                                className="action-icon dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                              >
                                                <i className="material-icons">
                                                  more_vert
                                                </i>
                                              </Link>
                                              <div className="dropdown-menu dropdown-menu-right">
                                                <Link
                                                  className="dropdown-item"
                                                  to="#"
                                                >
                                                  Add New Task
                                                </Link>
                                                <Link
                                                  className="dropdown-item"
                                                  to="#"
                                                >
                                                  Add New Event
                                                </Link>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Panel>
                                </Collapse>
                              </div>
                            </div>
                          </div>
                        </div>
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
                      Save
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      onClick={handleCancelAll}
                    >
                      Cancel
                    </button>
                  </div>
                }
                { savedValuesCompany !== null && Object.keys(savedValuesCompany).length !== 0 &&
                  <div className="text-center py-3">
                    <button
                      type="button"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      onClick={handleSaveAllCompany}
                    >
                      Save
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      onClick={handleCancelAllCompany}
                    >
                      Cancel
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
    </>
  );
};

export default LeadsDetailsModel;

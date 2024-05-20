import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { ConsultingRepo, ConsultingTypes } from "../../repository/consulting";
import { atomAllCompanies, atomAllLeads, defaultConsulting } from "../../atoms/atoms";
import { formatDate } from "../../constants/functions";

const ConsultingAddModal = ({currentLead}) => {

  console.log('currentLead', currentLead);
  const { t } = useTranslation();
  const [ cookies ] = useCookies(["myLationCrmUserId","myLationCrmUserName"]);
  const { loadAllCompanies, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const { loadAllLeads, setCurrentLead } = useRecoilValue(LeadRepo);

  const [ companiesForSelection, setCompaniesForSelection ] = useState([]);
  const [ leadsForSelection, setLeadsForSelection] = useState([]);
  const [ consultingChange, setConsultingChange ] = useState(null);
  const [ selectedLead, setSelectedLead ] = useState(null);
  const [ receiptDate, setReceiptDate ] = useState(new Date());
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);

  const {  modifyConsulting, } = useRecoilValue(ConsultingRepo);


  useEffect(() => {
    if (allCompnayData.length === 0) {
      loadAllCompanies();
    } else {
      let company_subset = {};
      allCompnayData.forEach((data) => {
        company_subset[data.company_name] = data.company_code;
      });
      setCompaniesForSelection(company_subset);
    };

    if (allLeadData.length === 0) {
      loadAllLeads();
    };
    
    if(!leadsForSelection || (leadsForSelection.length !== allLeadData.length)){
      const temp_data = allLeadData.map(lead => {
        return {
          label: lead.lead_name + " / " + lead.company_name,
          value: {
            code: lead.lead_code,
            name: lead.lead_name,
            department: lead.department,
            position: lead.position,
            mobile: lead.mobile_number,
            phone: lead.phone_number,
            email: lead.email,
            company: lead.company_name
          }
        }
      });
      temp_data.sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      setLeadsForSelection(temp_data);
    };
    
    initializeConsultingTemplate();
  }, [allCompnayData, allLeadData]);


  const initializeConsultingTemplate = useCallback(() => {
    const localDate = formatDate(receiptDate);
    const localTime = receiptDate.toLocaleTimeString('ko-KR');

    setConsultingChange({ ...defaultConsulting, receipt_date:localDate, receipt_time:localTime });
    setSelectedLead(null);
    document.querySelector("#add_new_consulting_form").reset();
  }, []);

  const handleReceiptDateChange = (date) => {
    setReceiptDate(date);
    const localDate = formatDate(date);
    const localTime = date.toLocaleTimeString('ko-KR');
    const tempChanges = {
      ...consultingChange,
      receipt_date: localDate,
      receipt_time: localTime,
    };
    setConsultingChange(tempChanges);
  };

  const handleSelectConsultingType = useCallback((value) => {
        const tempChanges = {
          ...consultingChange,
          consulting_type: value.value,
        };
        setConsultingChange(tempChanges);
      }, [consultingChange]);

  
  const handleConsultingChange = useCallback((e) => {
        const modifiedData = {
          ...consultingChange,
          [e.target.name]: e.target.value,
        };
        setConsultingChange(modifiedData);
      }, [consultingChange]);
        
  const handleSelectLead = useCallback((value) => {
    const tempChanges = {
      ...consultingChange,
      lead_code: value.code,
      lead_name: value.name,
      department: value.department,
      position: value.position,
      mobile_number: value.mobile,
      phone_number: value.phone,
      email: value.email,
      company_name: value.company,
      company_code: companiesForSelection[value.company],
    };
    setConsultingChange(tempChanges);
  }, [companiesForSelection, consultingChange]);  
    
  const handleAddNewConsulting = useCallback((event)=>{
    // Check data if they are available
    if(consultingChange.lead_name === null
        || consultingChange.lead_name === ''
        || consultingChange.consulting_type === null
      ) {
          console.log("Necessary information isn't submitted!");
          return;
        };
    
    const newConsultingData = {
          ...consultingChange,
          action_type: 'ADD',
          lead_number: '99999',// Temporary
          counter: 0,
          modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewConsulting ]`, newConsultingData);
    const result = modifyConsulting(newConsultingData);
    if(result){
      initializeConsultingTemplate();
          //close modal ?
      };
  }, [cookies.myLationCrmUserId, initializeConsultingTemplate, consultingChange, modifyConsulting]);
    

  return (
        <div
          className="modal right fade"
          id="add_consulting"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <button
              type="button"
              className="close md-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title"><b>{t('consulting.add_consulting')}</b></h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <form className="forms-sampme" id="add_new_consulting_form">
                  <h4>{t('lead.lead')} {t('common.information')}</h4>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label>{t('common.name')}</label>
                    </div>
                    <div className="col-sm-8">
                      <Select options={leadsForSelection} onChange={(value) => { 
                        handleSelectLead(value.value);
                        setSelectedLead({...value.value}); }}/>
                    </div>
                  </div>
                  { (selectedLead !== null) &&
                    <div className="form-group row">
                      <div className="col-sm-12">
                          <table className="table">
                            <tbody>
                              <tr>
                                <td>{t('lead.department')}</td>
                                <td>{selectedLead.department}</td>
                              </tr>
                              <tr>
                                <td>{t('lead.position')}</td>
                                <td>{selectedLead.position}</td>
                              </tr>
                              <tr>
                                <td>{t('lead.mobile')}</td>
                                <td>{selectedLead.mobile}</td>
                              </tr>
                              <tr>
                              <td>{t('common.phone_no')}</td>
                                <td>{selectedLead.phone}</td>
                              </tr>
                              <tr>
                              <td>{t('lead.email')}</td>
                                <td>{selectedLead.email}</td>
                              </tr>
                            </tbody>
                          </table>
                      </div>
                    </div>
                  }
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">{t('lead.lead_sales')}</label>
                    </div>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t('lead.lead_sales')}
                        name="sales_representati"
                        onChange={handleConsultingChange}
                      />
                    </div>
                  </div>
                  <h4>{t('consulting.consulting')} {t('common.information')}</h4>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">{t('consulting.type')}</label>
                      <Select options={ConsultingTypes} onChange={handleSelectConsultingType} />
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">{t('consulting.receipt_time')}</label>
                        <div className="cal-icon">
                          <DatePicker
                            className="form-control"
                            selected={receiptDate}
                            onChange={handleReceiptDateChange}
                            dateFormat="yyyy.MM.dd hh:mm:ss"
                            showTimeSelect
                          />
                        </div>
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">{t('consulting.receiver')}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t('consulting.receiver')}
                        name="receiver"
                        onChange={handleConsultingChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label className="col-form-label">{t('consulting.lead_time')}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t('consulting.lead_time')}
                        name="lead_time"
                        onChange={handleConsultingChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="col-form-label">{t('consulting.request_type')}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t('consulting.request_type')}
                        name="request_type"
                        onChange={handleConsultingChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label className="col-form-label">{t('consulting.request_content')}</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder={t('consulting.request_content')}
                        name="request_content"
                        defaultValue={""}
                        onChange={handleConsultingChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label className="col-form-label">{t('consulting.action_content')}</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder={t('consulting.action_content')}
                        name="action_content"
                        defaultValue={""}
                        onChange={handleConsultingChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label className="col-form-label">{t('common.status')}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t('common.status')}
                        name="status"
                        onChange={handleConsultingChange}
                      />
                    </div>
                  </div>
                  {/* <div className="submit-section mt-0">
                    <div className="custom-check mb-4">
                      <input type="checkbox" id="mark-as-done" />
                      <label htmlFor="mark-as-done">Mark as Done</label>
                    </div>
                  </div> */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      onClick={handleAddNewConsulting}
                    >
                      {t('common.save')}
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      data-bs-dismiss="modal"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
  );
};

export default ConsultingAddModal;
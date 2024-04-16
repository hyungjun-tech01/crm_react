import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { Collapse } from "antd";
import "antd/dist/reset.css";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { QuotationRepo, QuotationSendTypes } from "../../repository/quotation";
import { atomAllCompanies, atomAllQuotations, atomAllLeads, defaultQuotation } from "../../atoms/atoms";
import { formateDate } from "../../constants/functions";

const quotation_type = ["FAX", "EMAIL"];
const default_quotation_headers = [
  ['1', 'No', 0],
  ['2', '분류', 0],
  ['3', '제조회사', 0],
  ['4', '모델명', 0],
  ['5', '품목', 0],
  ['6', '재질', 0],
  ['7', '타입', 0],
  ['8', '색상', 0],
  ['9', '규격', 0],
  ['10', '세부사양', 0],
  ['11', '단위', 0],
  ['12', '수량', 0],
  ['13', '소비자가', 0],
  ['14', '할인%', 0],
  ['15', '견적단가', 0],
  ['16', '견적금액', 0],
  ['17', '원가', 0],
  ['18', '이익금액', 0],
  ['19', '비고', 0],
];

const common_items = [
  "#. DX TOOL 제공 : 노드데이타 개발 솔리드웍스 속성편집기(\\2,000,000)",
  "- 설치 매뉴얼 제공",
  "- 차기 버전 Upgrade 1회",
  "- On/Off Line 기술 지원 (전화 및 원격지원, 방문 기술지원)",
  "- nodeDATA 교육 : On/Off Line 참여",
  "- Disable Request Service 제공 (라이선스 재 활성)",
  "- SOLIDWORKS CAM Standard (1,820,000원) : 유지보수 기간내 사용 가능",
  "  (SOLIDWORKS Std 이상 구매시)",
  "- SOLIDWORKS Visualize Standard (2,527,200원) : 유지보수 기간내 사용 가능",
  "   (SOLIDWORKS Pro 이상 구매시)",
];

const QuotationAddNewModal = () => {
  const { Panel } = Collapse;
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allQuotationData = useRecoilValue(atomAllQuotations);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const { loadAllLeads } = useRecoilValue(LeadRepo);
  const { modifyQuotation } = useRecoilValue(QuotationRepo);
  const [ cookies ] = useCookies(["myLationCrmUserId"]);

  const [ companiesForSelection, setCompaniesForSelection ] = useState([]);
  const [ leadsForSelection, setLeadsForSelection] = useState([]);
  const [ quotationChange, setQuotationChange ] = useState(null);
  const [ selectedLead, setSelectedLead ] = useState(null);
  const [ receiptDate, setReceiptDate ] = useState(new Date());
  const [ quotationHeaders, setQuotationHeaders ] = useState([]);
  const [ quotationContents, setQuotationContents ] = useState([]);

  const handleReceiptDateChange = (date) => {
    setReceiptDate(date);
    const localDate = formateDate(date);
    const localTime = date.toLocaleTimeString('ko-KR');
    const tempChanges = {
      ...quotationChange,
      receipt_date: localDate,
      receipt_time: localTime,
    };
    setQuotationChange(tempChanges);
  };

  // --- Functions used for Add New Quotation ------------------------------
  const initializeQuotationTemplate = useCallback(() => {
    setQuotationChange({ ...defaultQuotation });
    setSelectedLead(null);
    setQuotationHeaders(default_quotation_headers);
    setQuotationContents([]);
    document.querySelector("#add_new_quotation_form").reset();
  }, []);

  const handleQuotationChange = useCallback((e) => {
    const modifiedData = {
      ...quotationChange,
      [e.target.name]: e.target.value,
    };
    setQuotationChange(modifiedData);
  }, [quotationChange]);

  const handleSelectLead = useCallback((value) => {
    const tempChanges = {
      ...quotationChange,
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
    setQuotationChange(tempChanges);
  }, [companiesForSelection, quotationChange]);

  const handleSelectQuotationType = useCallback((value) => {
    const tempChanges = {
      ...quotationChange,
      quotation_type: value.value,
    };
    setQuotationChange(tempChanges);
  }, [quotationChange]);

  const handleAddNewQuotation = useCallback((event)=>{
    // Check data if they are available
    if(quotationChange.lead_name === null
      || quotationChange.lead_name === ''
      || quotationChange.quotation_type === null
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };

    const newQuotationData = {
      ...quotationChange,
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewQuotation ]`, newQuotationData);
    const result = modifyQuotation(newQuotationData);
    if(result){
      initializeQuotationTemplate();
      //close modal ?
    };
  }, [cookies.myLationCrmUserId, initializeQuotationTemplate, quotationChange, modifyQuotation]);

  useEffect(() => {
    // ----- Load companies and set up the relation between lead and company by company code ---
    if (allCompnayData.length === 0) {
      loadAllCompanies();
    } else {
      let company_subset = {};
      allCompnayData.forEach((data) => {
        company_subset[data.company_name] = data.company_code;
      });
      setCompaniesForSelection(company_subset);
    };

    // ----- Load Leads and set up the options of lead to select -----
    if (allLeadData.length === 0) {
      loadAllLeads();
    } else {
      const temp_data = allLeadData.map(lead => {
        return {
          label : lead.lead_name + " / " + lead.company_name,
          value : {
            code: lead.lead_code,
            name: lead.lead_name,
            department: lead.department,
            position: lead.position,
            mobile: lead.mobile_number,
            phone: lead.phone_number,
            email: lead.email,
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

    // ----- Initialize template to store values -----
    initializeQuotationTemplate();
  }, [allCompnayData, allLeadData, allQuotationData]);

  return (
        <div
          className="modal right fade"
          id="add_quotation"
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
                <h4 className="modal-title"><b>Add New Quotation</b></h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <form className="forms-sampme" id="add_new_quotation_form">
                  <h4>Lead Information</h4>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label>Name</label>
                    </div>
                    <div className="col-sm-8">
                      <Select options={leadsForSelection} onChange={(value) => { 
                        handleSelectLead(value.value);
                        setSelectedLead({...value.value}); }}/>
                    </div>
                  </div>
                  { (selectedLead !== null) &&
                    <>
                      <div className="form-group row">
                        <div className="col-sm-12">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>Department</td>
                                  <td>{selectedLead.department}</td>
                                </tr>
                                <tr>
                                  <td>Position</td>
                                  <td>{selectedLead.position}</td>
                                </tr>
                                <tr>
                                  <td>Mobile</td>
                                  <td>{selectedLead.mobile}</td>
                                </tr>
                                <tr>
                                  <td>Phone</td>
                                  <td>{selectedLead.phone}</td>
                                </tr>
                                <tr>
                                  <td>Email</td>
                                  <td>{selectedLead.email}</td>
                                </tr>
                              </tbody>
                            </table>
                        </div>
                      </div>
                    </>}
                  <h4>Quotation Information</h4>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">Type</label>
                      <Select options={QuotationSendTypes} onChange={handleSelectQuotationType} />
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">Receipt</label>
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
                      <label className="col-form-label">Receiver</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Receiver"
                        name="receiver"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label className="col-form-label">Lead Time</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Lead Time"
                        name="lead_time"
                        onChange={handleQuotationChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="col-form-label">Request Type</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Request Type"
                        name="request_type"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label className="col-form-label">Sales Representative</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Sales Representative"
                        name="sales_representati"
                        onChange={handleQuotationChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="col-form-label">Status</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Status"
                        name="status"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <h4>Price Table</h4>
                  <div className="tasks__item active">
                    <Collapse size="small" accordion expandIconPosition="end">
                      <Panel header="Header Setting" key="1">
                        <table className="table">
                          <tbody>
                          { quotationHeaders.map((header, index) =>
                            <tr key={index}>
                              <td><input key={index} type="checkbox"/></td>
                              <td>{header.at(1)}</td>
                              <td>{header.at(2)}</td>
                            </tr>
                          )}
                          </tbody>
                        </table>
                      </Panel>
                    </Collapse>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      onClick={handleAddNewQuotation}
                    >
                      Save
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
  );
};

export default QuotationAddNewModal;

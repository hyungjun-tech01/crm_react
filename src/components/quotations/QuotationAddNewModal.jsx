import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import "antd/dist/reset.css";
import { Table } from 'antd';
import { itemRender, onShowSizeChange } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AddBoxOutlined, MoreVert, IndeterminateCheckBoxOutlined, SettingsOutlined } from '@mui/icons-material';

import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { QuotationRepo, QuotationTypes, QuotationSendTypes } from "../../repository/quotation";
import { atomAllCompanies, atomAllQuotations, atomAllLeads, defaultQuotation } from "../../atoms/atoms";
import { formateDate } from "../../constants/functions";

const default_quotation_content = {
  '1': null, '2': null, '3': null, '4': null, '5': null,
  '6': null, '7': null, '8': null, '9': null, '10': null,
  '11': null, '12': null, '13': null, '14': null, '15': null,
  '16': null, '17': null, '18': null, '19': null, '998': null,
};
const default_content_array = [
  ['2', '분류'],
  ['3', '제조회사'],
  ['4', '모델명'],
  ['5', '품목'],
  ['6', '재질'],
  ['7', '타입'],
  ['8', '색상'],
  ['9', '규격'],
  ['10', '세부사양'],
  ['11', '단위'],
  ['12', '수량'],
  ['13', '소비자가'],
  ['14', '할인%'],
  ['15', '견적단가'],
  ['16', '견적금액'],
  ['17', '원가'],
  ['18', '이익금액'],
  ['19', '비고'],
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

const ConvertHeaderInfosToString = (data) => {
  let ret = 'No|1|';
  
  if(data[0]['title'] === 'No') ret += data[0]['size']
  else ret += '0';

  default_content_array.forEach(item => {
    ret += '|' + item.at(0) + '|' + item.at(1) + '|' + data[item.at(0)];
  });

  console.log('\t[ ConvertHeaderInfosToString ] Result : ', ret);
  return ret;
}

const QuotationAddNewModal = () => {
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allQuotationData = useRecoilValue(atomAllQuotations);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const { loadAllLeads } = useRecoilValue(LeadRepo);
  const { modifyQuotation } = useRecoilValue(QuotationRepo);
  const [ cookies] = useCookies(["myLationCrmUserId"]);

  const [ companiesForSelection, setCompaniesForSelection ] = useState([]);
  const [ leadsForSelection, setLeadsForSelection ] = useState([]);
  const [ selectedLead, setSelectedLead ] = useState(null);
  const [ quotationDate, setQuotationDate ] = useState(new Date());
  const [ confirmDate, setConfirmDate ] = useState(new Date());

  const [ quotationHeaders, setQuotationHeaders ] = useState([]);
  const [ quotationContents, setQuotationContents ] = useState([]);
  const [ quotationChange, setQuotationChange ] = useState(null);

  const [ contentColumns, setContentColumns ] = useState([]);
  const [ temporaryContent, setTemporaryContent ] = useState(null);
  const [ selectedRows, setSelectedRows ] = useState([]);

  const default_columns = [
    {
      title: "No",
      dataIndex: '1',
      size: 5,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Product",
      dataIndex: '5',
      size: 50,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Detail Info.",
      dataIndex: '10',
      size: 10,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Quantity",
      dataIndex: '12',
      size: 10,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Unit Price",
      dataIndex: '15',
      size: 15,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Total Price",
      dataIndex: '16',
      size: 15,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-center">
          <MoreVert onClick={() => {
            handleLoadSelectedContent(record['1'] - 1);
          }} />
        </div>
      ),
    },
  ];

  // --- Functions used for adding new quotation ------------------------------
  const initializeQuotationTemplate = useCallback(() => {
    setQuotationChange({ ...defaultQuotation });
    setSelectedLead(null);
    setQuotationHeaders([]);
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

  const handleQuotationDateChange = (date) => {
    setQuotationDate(date);
    const localDate = formateDate(date);
    const tempChanges = {
      ...quotationChange,
      quotation_date: localDate,
    };
    setQuotationChange(tempChanges);
  };

  const handleConfirmDateChange = (date) => {
    setConfirmDate(date);
    const localDate = formateDate(date);
    const tempChanges = {
      ...quotationChange,
      comfirm_date: localDate,
    };
    setQuotationChange(tempChanges);
  };

  const handleSelectQuotationType = useCallback((value) => {
    const tempChanges = {
      ...quotationChange,
      quotation_type: value.value,
    };
    setQuotationChange(tempChanges);
  }, [quotationChange]);

  const handleSelectQuotationSendType = useCallback((value) => {
    const tempChanges = {
      ...quotationChange,
      quotation_send_type: value.value,
    };
    setQuotationChange(tempChanges);
  }, [quotationChange]);

  const handleAddNewQuotation = useCallback((event) => {
    // Check data if they are available
    if (quotationChange.lead_name === null
      || quotationChange.lead_name === ''
      || quotationChange.quotation_type === null
      || quotationHeaders.length === 0
      || quotationContents.length === 0
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };
    const newQuotationData = {
      ...quotationChange,
      quotation_table: ConvertHeaderInfosToString(contentColumns),
      quotation_contents: JSON.stringify(quotationContents),
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewQuotation ]`, newQuotationData);
    const result = modifyQuotation(newQuotationData);
    if (result) {
      initializeQuotationTemplate();
      //close modal ?
    };
  }, [cookies.myLationCrmUserId, initializeQuotationTemplate, quotationChange, modifyQuotation]);

  // --- Functions dealing with contents table -------------------------------
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red",
    }),
  };

  // --- Functions used for adding new content ------------------------------
  const handleLoadNewTemporaryContent = useCallback(() => {
    const tarElem = document.querySelector("#modify_content");
    if (tarElem) {
      const tempContent = {
        ...default_quotation_content,
        '1': quotationContents.length + 1,
      };
      setTemporaryContent(tempContent);
      tarElem.style.display = "block";
      tarElem.focus();
    };
  }, [quotationContents]);

  const handleLoadSelectedContent = useCallback((index) => {
    console.log('\thandleLoadSelectedContent : ', index);
    const foundContent = {
      ...quotationContents.at(index)
    };
    setTemporaryContent(foundContent);

    const tarElem = document.querySelector("#modify_content");
    tarElem.style.display = "block";
    tarElem.focus();
  }, [quotationContents, setTemporaryContent]);

  const handleEditTemporaryContent = useCallback((event) => {
    const tempContent = {
      ...temporaryContent,
      [event.target.name]: event.target.value,
    };
    setTemporaryContent(tempContent);
  }, [temporaryContent, setTemporaryContent]);

  const handleSaveTemporaryEdit = useCallback(() => {
    const contentToSave = {
      ...temporaryContent
    };
    if(!contentToSave['1'] || !contentToSave['5'] || !contentToSave['16']){
      console.log('[ Quotation / handleSaveTemporaryEdit ] Necessary Input is ommited!');
      return;
    };
      
    let tempContents = [];
    if (contentToSave['1'] === quotationContents.length) {
      tempContents = [
        ...quotationContents,
        contentToSave
      ];
    } else {
      const temp_index = tempContents['1'] - 1;
      tempContents = [
        ...quotationContents.slice(0, temp_index),
        contentToSave,
        ...quotationContents.slice(temp_index + 1,)
      ];
    }
    setQuotationContents(tempContents);
    setTemporaryContent(null);
    const tarElem = document.querySelector("#modify_content");
    tarElem.style.display = "none";
  }, [temporaryContent, quotationContents, setQuotationContents, setTemporaryContent]);

  const handleCloseTemporaryEdit = useCallback(() => {
    const tarElem = document.querySelector("#modify_content");
    if (tarElem) {
      setTemporaryContent(null);
      tarElem.style.display = "none";
    };
  }, [setTemporaryContent]);

  // --- Functions used for remove selected contents ------------------------------
  const handleDeleteContent = useCallback((index) => {
    const tempContents = [
      ...quotationContents.slice(0, index),
      ...quotationContents.slice(index+1,)
    ];
    setQuotationContents(tempContents);
  }, [quotationContents, setQuotationContents]);

  const handleDeleteSelectedConetents = useCallback(()=>{
    console.log('handleDeleteSelectedConetents : ', selectedRows);
    // selectedRows.map(item => {
    //   handleDeleteContent(item)
    // })
  }, [selectedRows, ])

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
          label: lead.lead_name + " / " + lead.company_name,
          value: {
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
    if (contentColumns.length === 0) {
      setContentColumns(default_columns);
    }
  }, [allCompnayData, allLeadData, allQuotationData, contentColumns]);

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
                  <Select 
                    options={leadsForSelection}
                    styles={{
                      borderColor: '#e3e3e3',
                      boxShadow: 'none',
                      fontSize: '15px',
                      height: '20px'}}
                    onChange={(value) => {
                      handleSelectLead(value.value);
                      setSelectedLead({ ...value.value });
                  }} />
                </div>
              </div>
              {(selectedLead !== null) &&
                <>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Department</td>
                            <td>{selectedLead.department}</td>
                          </tr>
                          <tr>
                            <td>Mobile</td>
                            <td>{selectedLead.mobile}</td>
                          </tr>
                          <tr>
                            <td>Email</td>
                            <td>{selectedLead.email}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-sm-6">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Position</td>
                            <td>{selectedLead.position}</td>
                          </tr>
                          <tr>
                            <td>Phone</td>
                            <td>{selectedLead.phone}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>}
              <h4>Quotation Information</h4>
              <div className="form-group row">
                <div className="col-sm-9">
                  <label className="col-form-label">Title</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Title"
                    name="quotation_title"
                    onChange={handleQuotationChange}
                  />
                </div>
                <div className="col-sm-3">
                  <label className="col-form-label">Type</label>
                  <Select options={QuotationTypes} onChange={handleSelectQuotationType} />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-6">
                  <div className="form-group row">
                    <div className="col-sm-4">Document No</div>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Document No"
                        name="quotation_number"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">Send Type</div>
                    <div className="col-sm-7">
                      <Select options={QuotationSendTypes} onChange={handleSelectQuotationSendType} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">Quotation Date</label>
                    </div>
                    <div className="col-sm-7">
                      <div className="cal-icon cal-icon-sm">
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={quotationDate}
                          onChange={handleQuotationDateChange}
                          dateFormat="yyyy.MM.dd"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">Location</label>
                    </div>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Location"
                        name="delivery_location"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">Payment Type</label>
                    </div>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Payment Type"
                        name="payment_type"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">Warranty</label>
                    </div>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Warranty Period"
                        name="warranty_period"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group row">
                    <div className="col-sm-4">Delivery Period</div>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Delivery Period"
                        name="delivery_period"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">Expiry Date</div>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Expiry Date"
                        name="quotation_expiration_date"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">Status</div>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Status"
                        name="status"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <label className="col-form-label">Confirm Date</label>
                    </div>
                    <div className="col-sm-7">
                      <div className="cal-icon cal-icon-sm">
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={confirmDate}
                          onChange={handleConfirmDateChange}
                          dateFormat="yyyy.MM.dd"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-4">Representative</div>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Representative"
                        name="sales_representative"
                        onChange={handleQuotationChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <h4>Price Table</h4>
              <div className="form-group row">
                <div className="text-end flex-row">
                  <div
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <AddBoxOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={handleLoadNewTemporaryContent}
                    />
                    <IndeterminateCheckBoxOutlined 
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={handleDeleteSelectedConetents}
                      disabled={!selectedRows}
                    />
                    <SettingsOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={() => {
                        console.log('Nothing yet');
                      }} 
                    />
                  </div>
                  <div className="dropdown-menu dropdown-menu-left" id="modify_content">
                    <div>
                      <h4>Edit Content</h4>
                      {temporaryContent &&
                        <>
                          <table className="table">
                            {default_content_array.map((item, index) => {
                              if (index % 2 === 0) {
                                if (index !== default_content_array.length - 1) return;
                                return (
                                  <tr key={index}>
                                    <td>
                                      {item.at(1)}
                                    </td>
                                    <td>
                                      <input 
                                        name={item.at(0)} 
                                        className="input-group-text input-group-text-sm"
                                        type="text"
                                        defaultValue={temporaryContent[item.at(0)]}
                                        onChange={handleEditTemporaryContent}
                                      />
                                    </td>
                                  </tr>
                                )
                              };
                              return (
                                <tr key={index}>
                                  <td>
                                    {default_content_array[index - 1][1]}
                                  </td>
                                  <td>
                                    <input
                                      name={default_content_array[index - 1][0]}
                                      className="input-group-text input-group-text-sm"
                                      type="text"
                                      defaultValue={temporaryContent[default_content_array[index - 1][0]]}
                                      onChange={handleEditTemporaryContent}
                                    />
                                  </td>
                                  <td>
                                    {item.at(1)}
                                  </td>
                                  <td>
                                    <input
                                      name={item.at(0)}
                                      className="input-group-text input-group-text-sm"
                                      type="text"
                                      defaultValue={temporaryContent[item.at(0)]}
                                      onChange={handleEditTemporaryContent}
                                    />
                                  </td>
                                </tr>
                              )
                            })}
                          </table>
                          { !!temporaryContent['10'] && <div>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder='Comment'
                              defaultValue={temporaryContent['998']}
                              name='998'
                              onChange={handleEditTemporaryContent}
                            />
                          </div>}
                        </>
                      }
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                        onClick={handleSaveTemporaryEdit}
                      >
                        Save
                      </button>
                      &nbsp;&nbsp;
                      <button
                        type="button"
                        className="btn btn-secondary btn-rounded"
                        onClick={handleCloseTemporaryEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <Table
                  rowSelection={{
                    ...rowSelection,
                  }}
                  pagination={{
                    total: quotationContents.length,
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    itemRender: itemRender,
                  }}
                  style={{ overflowX: "auto" }}
                  columns={contentColumns}
                  bordered
                  dataSource={quotationContents}
                  rowKey={(record) => record['1']}
                // onChange={handleTableChange}
                />
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

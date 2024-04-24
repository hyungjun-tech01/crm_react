import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import "antd/dist/reset.css";
import { Table } from 'antd';
import { itemRender, onShowSizeChange } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AddBoxOutlined, ModeEdit, IndeterminateCheckBoxOutlined, SettingsOutlined } from '@mui/icons-material';

import { QuotationRepo, QuotationTypes, QuotationSendTypes } from "../../repository/quotation";
import { atomAllCompanies, atomAllLeads, defaultQuotation } from "../../atoms/atoms";
import { ConverTextAmount, formateDate } from "../../constants/functions";
import "./quotation.style.css";

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

const default_prices = {
  'consumer_price': 0,
  'discount_rate': 0,
  'quotation_unit_price': 0,
  'quotation_total_price': 0,
  'raw_price': 0,
  'profit': 0,
};

const ConvertHeaderInfosToString = (data) => {
  let ret = '1|No|';
  
  if(data[0]['title'] === 'No') ret += data[0]['size']
  else ret += '0';

  default_content_array.forEach(item => {
    ret += '|' + item.at(0) + '|' + item.at(1) + '|';

    const foundIdx = data.findIndex(col => col.title === item.at(1));
    if(foundIdx === -1) {
      ret += '0';
    } else {
      ret += data[foundIdx]['size'];
    }
  });

  console.log('\t[ ConvertHeaderInfosToString ] Result : ', ret);
  return ret;
};

const QuotationAddNewModal = (props) => {
  const { init, handleInit } = props;
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const { modifyQuotation } = useRecoilValue(QuotationRepo);
  const [ cookies] = useCookies(["myLationCrmUserId"]);

  const [ companiesForSelection, setCompaniesForSelection ] = useState([]);
  const [ leadsForSelection, setLeadsForSelection ] = useState([]);
  const [ selectedLead, setSelectedLead ] = useState(null);
  const [ quotationDate, setQuotationDate ] = useState(new Date());
  const [ confirmDate, setConfirmDate ] = useState(new Date());

  const [ quotationContents, setQuotationContents ] = useState([]);
  const [ quotationChange, setQuotationChange ] = useState(null);
  const [ temporaryContent, setTemporaryContent ] = useState(null);
  const [ selectedRows, setSelectedRows ] = useState([]);

  const [ contentColumns, setContentColumns ] = useState([]);
  const [ editHeaders, setEditHeaders ] = useState(false);

  const [ prices, setPrices ] = useState(default_prices);

  // --- Functions / Variables dealing with editing -------------------------------
  const selectLeadRef = useRef(null);
  const selectTypeRef = useRef(null);
  const selectSendTypeRef = useRef(null);

  const handleSelectLead = useCallback((value) => {
    if(value) {
      const selectedValue = value.value;
      const tempChanges = {
        ...quotationChange,
        lead_code: selectedValue.code,
        lead_name: selectedValue.name,
        department: selectedValue.department,
        position: selectedValue.position,
        mobile_number: selectedValue.mobile,
        phone_number: selectedValue.phone,
        email: selectedValue.email,
        company_name: selectedValue.company,
        company_code: companiesForSelection[selectedValue.company],
      };
      setQuotationChange(tempChanges);
      setSelectedLead({...selectedValue});
    }
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
    if(value) {
      const tempChanges = {
        ...quotationChange,
        quotation_type: value.value,
      };
      setQuotationChange(tempChanges);
    }
  }, [quotationChange]);

  const handleSelectQuotationSendType = useCallback((value) => {
    if(value) {
      const tempChanges = {
        ...quotationChange,
        quotation_send_type: value.value,
      };
      setQuotationChange(tempChanges);
    }
  }, [quotationChange]);

  // --- Functions / Variables dealing with contents table -------------------------------
  const default_columns = [
    {
      title: "No",
      dataIndex: '1',
      size: 5,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "품목",
      dataIndex: '5',
      size: 50,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "세부사양",
      dataIndex: '10',
      size: 10,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "수량",
      dataIndex: '12',
      size: 10,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "견적단가",
      dataIndex: '15',
      size: 15,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "견적금액",
      dataIndex: '16',
      size: 15,
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Edit",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-center">
          <ModeEdit onClick={() => {
            handleLoadSelectedContent(record);
          }} />
        </div>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRows(selectedRows);
    },
  };

  const handleHeaderCheckChange = useCallback((event) => {
    const targetName = event.target.name;
    const targetIndex = Number(targetName);

    if(event.target.checked) {
      const foundIndex = contentColumns.findIndex(
        item => Number(item.dataIndex) > targetIndex);
      
      const tempColumns = [
        ...contentColumns.slice(0, foundIndex),
        {
          title: default_content_array[targetIndex - 2][1],
          dataIndex: targetName,
          size: 0,
          render: (text, record) => <>{text}</>,
        },
        ...contentColumns.slice(foundIndex,),
      ];
      setContentColumns(tempColumns);
    } else {
      const foundIndex = contentColumns.findIndex(
        item => Number(item.dataIndex) === targetIndex);

      const tempColumns = [
        ...contentColumns.slice(0, foundIndex),
        ...contentColumns.slice(foundIndex + 1,),
      ];
      setContentColumns(tempColumns);
    }
  }, [contentColumns, setContentColumns]);

  const handleHeaderSizeChange = useCallback((event) => {
    const targetName = event.target.name;
    const foundIndex = contentColumns.findIndex(
      item => item.dataIndex === targetName);
    if(foundIndex !== -1){
      const tempColumn = {
        ...contentColumns.at(foundIndex),
        size: event.target.value,
      }
      const tempColumns = [
        ...contentColumns.slice(0, foundIndex),
        tempColumn,
        ...contentColumns.slice(foundIndex + 1,),
      ];
      setContentColumns(tempColumns);
    }
  }, [contentColumns]);

  // --- Functions used for editing content ------------------------------
  const handleLoadNewTemporaryContent = useCallback(() => {
    if(!quotationChange.lead_name) {
      console.log('\t[handleLoadNewTemporaryContent] No lead is selected');
      return;
    };

    const tempContent = {
      ...default_quotation_content,
      '1': quotationContents.length + 1,
    };
    setTemporaryContent(tempContent);
  }, [quotationContents, quotationChange]);

  const handleLoadSelectedContent = useCallback((data) => {
    setTemporaryContent(data);
  }, [setTemporaryContent]);

  const handleDeleteSelectedConetents = useCallback(()=>{
    if(selectedRows.length === 0) {
      console.log('\t[handleDeleteSelectedConetents] No row is selected');
      return;
    };

    let tempContents=[
      ...quotationContents
    ];
    selectedRows.forEach(row => {
      const filteredContents = tempContents.filter(item => item['1'] !== row['1']);
      tempContents = filteredContents;
    });
    let temp_total_amount = 0;
    const finalContents = tempContents.map((item, index) => {
      temp_total_amount += item['16'];
      return { ...item, '1': index + 1};
    });
    const tempQuotation = {
      ...quotationChange,
      total_quotation_amount : temp_total_amount,
    };
    setQuotationChange(tempQuotation);
    console.log('handleDeleteSelectedConetents / final : ', finalContents);
    setQuotationContents(finalContents);
  }, [selectedRows, quotationContents, quotationChange, setQuotationContents, setQuotationChange]);

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
    const temp_index = contentToSave['1'] - 1;
    let tempContents = [];
    let temp_total_amount = contentToSave['16'];
    if(quotationChange['total_quotation_amount']) {
      temp_total_amount = quotationChange['total_quotation_amount'];
    };
    if (temp_index === quotationContents.length) {
      tempContents = [
        ...quotationContents,
        contentToSave
      ];
    } else {
      tempContents = [
        ...quotationContents.slice(0, temp_index),
        contentToSave,
        ...quotationContents.slice(temp_index + 1,)
      ];
    }
    setQuotationContents(tempContents);
    const tempQuotationChange = {
      ...quotationChange,
      total_quotation_amount: temp_total_amount,
    };
    setQuotationChange(tempQuotationChange);
    setTemporaryContent(null);
  }, [temporaryContent, quotationContents, setQuotationContents, setTemporaryContent]);

  const handleCloseTemporaryEdit = useCallback(() => {
    setTemporaryContent(null);
  }, [setTemporaryContent]);

  // --- Functions used for adding new quotation ------------------------------
  const initializeQuotationTemplate = useCallback(() => {
    console.log('\initializeQuotationTemplate called : ', init);
    setQuotationChange({ ...defaultQuotation });
    setQuotationDate(null);
    setConfirmDate(null);
    setSelectedLead(null);
    setQuotationContents([]);
    setPrices(default_prices);

    if(selectLeadRef.current)
      selectLeadRef.current.clearValue();
    if(selectTypeRef.current)
      selectTypeRef.current.clearValue();
    if(selectSendTypeRef.current)
      selectSendTypeRef.current.clearValue();

    document.querySelector("#add_new_quotation_form").reset();

    handleInit(!init);
  }, [selectLeadRef.current, selectTypeRef.current, selectSendTypeRef.current, defaultQuotation]);

  const handleQuotationChange = useCallback((e) => {
    const modifiedData = {
      ...quotationChange,
      [e.target.name]: e.target.value,
    };
    setQuotationChange(modifiedData);
  }, [quotationChange]);

  const handleAddNewQuotation = useCallback((event) => {
    // Check data if they are available
    if (quotationChange.lead_name === null
      || quotationChange.lead_name === ''
      || quotationChange.quotation_type === null
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
  }, [quotationChange, quotationContents, contentColumns, cookies.myLationCrmUserId, modifyQuotation, initializeQuotationTemplate]);


  useEffect(() => {
    // ----- Load companies and set up the relation between lead and company by company code ---
    if(!companiesForSelection || (companiesForSelection.length !== allCompnayData.length)){
      let company_subset = {};
      allCompnayData.forEach((data) => {
        company_subset[data.company_name] = data.company_code;
      });
      setCompaniesForSelection(company_subset);
    };

    // ----- Load Leads and set up the options of lead to select -----
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
    }

    // ----- Initialize template to store values -----
    if(init) initializeQuotationTemplate();
    if(contentColumns.length === 0) setContentColumns(default_columns);
    
  }, [allCompnayData, allLeadData, init]);

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
                    ref={selectLeadRef}
                    options={leadsForSelection}
                    onChange={handleSelectLead} />
                </div>
              </div>
              {selectedLead &&
                <>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="border-0">Organization</td>
                            <td className="border-0">{selectedLead.company_name}</td>
                          </tr>
                          <tr>
                            <td>Department</td>
                            <td>{selectedLead.department}</td>
                          </tr>
                          <tr>
                            <td className="border-0">Position</td>
                            <td className="border-0">{selectedLead.position}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-sm-6">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="border-0">Mobile</td>
                            <td className="border-0">{selectedLead.mobile_number}</td>
                          </tr>
                          <tr>
                            <td>Phone</td>
                            <td>{selectedLead.phone}</td>
                          </tr>
                          <tr>
                            <td className="border-0">Email</td>
                            <td className="border-0">{selectedLead.email}</td>
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
                  <Select
                    ref={selectTypeRef}
                    options={QuotationTypes}
                    onChange={handleSelectQuotationType}
                  />
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
                      <Select
                        ref={selectSendTypeRef}
                        options={QuotationSendTypes}
                        onChange={handleSelectQuotationSendType}
                      />
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
              <h4 className="h4-price">
                <div>Price Table</div>
                <div className="text-end flex-row">
                  <div>
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
                      onClick={() => {setEditHeaders(!editHeaders);}}
                    />
                  </div>
                </div>
              </h4>
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
      {temporaryContent &&
        <div className="edit-content">
          <div className="edit-content-header">
            <h4>&nbsp;&nbsp;<b>Edit Content</b></h4>
          </div>
          <table className="table">
            <tbody>
            {default_content_array.map((item, index) => {
              if (index % 2 === 0) {
                if (index !== default_content_array.length - 1) return;
                return (
                  <tr key={index}>
                    <td>
                      <b>{item.at(1)}</b>
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
                    <b>{default_content_array[index - 1][1]}</b>
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
                    <b>{item.at(1)}</b>
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
            </tbody>
          </table>
          { !!temporaryContent['10'] &&
            <div>
              <textarea
                className="form-control"
                rows={3}
                placeholder='Comment'
                defaultValue={temporaryContent['998']}
                name='998'
                onChange={handleEditTemporaryContent}
              />
            </div>
          }
          <div className="edit-content-footer" >
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
      }
      {editHeaders && 
        <div className="edit-content">
          <div className="edit-content-header">
            <h4><b>Header Setting</b></h4>
            <button
              type="button"
              className="edit-content-close"
              onClick={()=>{setEditHeaders(!editHeaders)}}
            >
              {" "}
            </button>
          </div>
          <div className="form-group">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Visible</th>
                  <th scope="col">Size</th>
                </tr>
              </thead>
              <tbody>
              { default_content_array.map((item, index) => {
                const foundItem = contentColumns.filter(column => column.dataIndex === item.at(0))[0];
                return (
                  <tr key={index}>
                    <td>
                      {item.at(1)}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        name={item.at(0)}
                        checked={!!foundItem}
                        onChange={handleHeaderCheckChange}
                      />
                    </td>
                    <td>
                    { foundItem ?
                        <input 
                          type="text"
                          name={item.at(0)} 
                          className="input-group-text input-group-text-sm"
                          defaultValue={foundItem.size}
                          onChange={handleHeaderSizeChange}
                        /> :
                        0
                    }
                    </td>
                  </tr>
              )})}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  );
};

export default QuotationAddNewModal;

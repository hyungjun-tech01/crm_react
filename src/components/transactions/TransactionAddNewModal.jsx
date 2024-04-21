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

import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { TransactionRepo, TransactionTypes, TransactionSendTypes } from "../../repository/transaction";
import { atomAllCompanies, atomAllTransactions, atomAllLeads, defaultTransaction } from "../../atoms/atoms";
import { formateDate } from "../../constants/functions";
import "./transaction.style.css";

const default_transaction_content = {
  "transaction_code": null,
  "month_day": null,
  "product_name": null,
  "standard": null,
  "unit": null,
  "quantity": 0,
  "unit_price": 0,
  "supply_price": 0,
  "tax_price": 0,
  "total_price": 0,
  "memo": null,
  "trasaction_sub_index": null,
  "lead_code": null,
  "company_name": null,
  "statement_number": null,
  "transaction_sub_type": null,
  "modify_date": null,
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

const TransactionAddNewModal = () => {
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const allTransactionData = useRecoilValue(atomAllTransactions);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const { loadAllLeads } = useRecoilValue(LeadRepo);
  const { modifyTransaction } = useRecoilValue(TransactionRepo);
  const [ cookies] = useCookies(["myLationCrmUserId"]);

  const [ companiesForSelection, setCompaniesForSelection ] = useState([]);
  const [ leadsForSelection, setLeadsForSelection ] = useState(null);
  const [ selectedLead, setSelectedLead ] = useState(null);
  const [ transactionChange, setTransactionChange ] = useState(null);
  const [ publishDate, setPublishDate ] = useState(new Date());

  const [ transactionContents, setTransactionContents ] = useState([]);
  const [ temporaryContent, setTemporaryContent ] = useState(null);
  const [ selectedRows, setSelectedRows ] = useState([]);

  const [ contentColumns, setContentColumns ] = useState([]);

  const handlePublishDateChange = useCallback((date) => {
    setPublishDate(date);
    const localDate = formateDate(date);
    const tempChanges = {
      ...transactionChange,
      publish_date: localDate,
    };
    setTransactionChange(tempChanges);
  }, [transactionChange]);

  const selectLeadRef = useRef(null);

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

  // --- Functions used for adding new transaction ------------------------------
  const initializeTransactionTemplate = useCallback(() => {
    setTransactionChange({ ...defaultTransaction });
    setSelectedLead(null);
    setTransactionContents([]);

    if(selectLeadRef.current)
      selectLeadRef.current.clearValue();

    document.querySelector("#add_new_transaction_form").reset();
  }, [selectLeadRef, ]);

  const handleTransactionChange = useCallback((e) => {
    const modifiedData = {
      ...transactionChange,
      [e.target.name]: e.target.value,
    };
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleSelectLead = useCallback((value) => {
    const tempChanges = {
      ...transactionChange,
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
    setTransactionChange(tempChanges);
  }, [companiesForSelection, transactionChange]);

  const handleAddNewTransaction = useCallback((event) => {
    // Check data if they are available
    if (transactionChange.lead_name === null
      || transactionChange.lead_name === ''
      || transactionChange.transaction_type === null
      || transactionContents.length === 0
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };
    const newTransactionData = {
      ...transactionChange,
      transaction_contents: JSON.stringify(transactionContents),
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewTransaction ]`, newTransactionData);
    const result = modifyTransaction(newTransactionData);
    if (result) {
      initializeTransactionTemplate();
      //close modal ?
    };
  }, [transactionChange, transactionContents, contentColumns, cookies.myLationCrmUserId, modifyTransaction, initializeTransactionTemplate]);


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


  // --- Functions used for editting content ------------------------------
  const handleLoadNewTemporaryContent = useCallback(() => {
    const tempContent = {
      ...default_transaction_content,
      '1': transactionContents.length + 1,
    };
    setTemporaryContent(tempContent);
  }, [transactionContents]);

  const handleLoadSelectedContent = useCallback((data) => {
    setTemporaryContent(data);
  }, [setTemporaryContent]);

  const handleDeleteSelectedConetents = useCallback(()=>{
    console.log('handleDeleteSelectedConetents : ', selectedRows);
    let tempContents=[
      ...transactionContents
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
    const tempTransaction = {
      ...transactionChange,
      total_transaction_amount : temp_total_amount,
    };
    setTransactionChange(tempTransaction);
    console.log('handleDeleteSelectedConetents / final : ', finalContents);
    setTransactionContents(finalContents);
  }, [selectedRows, transactionContents, transactionChange, setTransactionContents, setTransactionChange]);

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
      console.log('[ Transaction / handleSaveTemporaryEdit ] Necessary Input is ommited!');
      return;
    };
    const temp_index = contentToSave['1'] - 1;
    let tempContents = [];
    let temp_total_amount = contentToSave['16'];
    if(transactionChange['total_transaction_amount']) {
      temp_total_amount = transactionChange['total_transaction_amount'];
    };
    if (temp_index === transactionContents.length) {
      tempContents = [
        ...transactionContents,
        contentToSave
      ];
    } else {
      tempContents = [
        ...transactionContents.slice(0, temp_index),
        contentToSave,
        ...transactionContents.slice(temp_index + 1,)
      ];
    }
    setTransactionContents(tempContents);
    const tempTransactionChange = {
      ...transactionChange,
      total_transaction_amount: temp_total_amount,
    };
    setTransactionChange(tempTransactionChange);
    setTemporaryContent(null);
  }, [temporaryContent, transactionContents, setTransactionContents, setTemporaryContent]);

  const handleCloseTemporaryEdit = useCallback(() => {
    setTemporaryContent(null);
  }, [setTemporaryContent]);


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

    // ----- Initialize template to store values -----
    initializeTransactionTemplate();
    if (contentColumns.length === 0) {
      setContentColumns(default_columns);
    }
  }, [allCompnayData, allLeadData, allTransactionData, initializeTransactionTemplate, loadAllCompanies, loadAllLeads]);

  return (
    <div
      className="modal right fade"
      id="add_new_transaction"
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
            <h4 className="modal-title"><b>Add New Transaction</b></h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form className="forms-sampme" id="add_new_transaction_form">
              <h4>Transaction Information</h4>
              <div className="form-group row">
                <div className="col-sm-9">
                  <label className="col-form-label">Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="transaction_title"
                    onChange={handleTransactionChange}
                  />
                </div>
                <div className="col-sm-3">
                  <label className="col-form-label">Type</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type"
                    name="transaction_type"
                    onChange={handleTransactionChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-8">
                  <label className="col-form-label">Publish Date</label>
                  <DatePicker
                    className="form-control"
                    selected={publishDate}
                    onChange={handlePublishDateChange}
                    dateFormat="yyyy.MM.dd"
                  />
                </div>
                <div className="col-sm-4">
                  <label className="col-form-label">Publish Type</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Publish Type"
                    name="publish_type"
                    onChange={handleTransactionChange}
                  />
                </div>
              </div>
              <h4>Lead Information</h4>
              <div className="form-group row">
                <div className="col-sm-6">
                  <label className="col-form-label">Lead Name</label>
                  <Select options={leadsForSelection} onChange={handleSelectLead} />
                </div>
              </div>
              { (transactionChange && transactionChange.lead_code) && 
                <>
                  <h4>Company Information</h4>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label className="col-form-label">Organization</label>
                      <label className="col-form-label">{transactionChange.company_name}</label>
                    </div>
                    <div className="col-sm-6">
                      <label className="col-form-label">CEO Name</label>
                      <label className="col-form-label">{transactionChange.ceo_name}</label>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label className="col-form-label">Address</label>
                      <label className="col-form-label">{transactionChange.company_address}</label>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label className="col-form-label">Business Type </label>
                      <label className="col-form-label">{transactionChange.business_type}</label>
                    </div>
                    <div className="col-sm-6">
                      <label className="col-form-label">Business Item </label>
                      <label className="col-form-label">{transactionChange.business_item}</label>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label className="col-form-label">Registration No.</label>
                      <label className="col-form-label">{transactionChange.business_registration_code}</label>
                    </div>
                  </div>
                </>
              }
              <h4>Price Table</h4>
              <div className="form-group row">
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
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <Table
                  rowSelection={{
                    ...rowSelection,
                  }}
                  pagination={{
                    total: transactionContents.length,
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    itemRender: itemRender,
                  }}
                  style={{ overflowX: "auto" }}
                  columns={contentColumns}
                  bordered
                  dataSource={transactionContents}
                  rowKey={(record) => record['1']}
                // onChange={handleTableChange}
                />
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                  onClick={handleAddNewTransaction}
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
    </div>
  );
};

export default TransactionAddNewModal;

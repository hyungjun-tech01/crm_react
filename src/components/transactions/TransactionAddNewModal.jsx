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
import { AddBoxOutlined, ModeEdit, IndeterminateCheckBoxOutlined } from '@mui/icons-material';

import { CompanyRepo } from "../../repository/company";
import { LeadRepo } from "../../repository/lead";
import { TransactionRepo } from "../../repository/transaction";
import { atomAllCompanies, atomAllLeads, defaultTransaction } from "../../atoms/atoms";
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

const trans_key_to_name = {
  "transaction_code": '거래코드',
  "month_day": '월일',
  "product_name": '품목',
  "standard": '규격',
  "unit": '단위',
  "quantity": '수량',
  "unit_price": '단가',
  "supply_price": '공급가액',
  "tax_price": '세액',
  "total_price": '합계금액',
  "memo": '비고',
  "trasaction_sub_index": '순번',
  "lead_code": '거래처코드',
  "company_name": '거래처명',
  "statement_number": '전표번호',
  "transaction_sub_type": '구분',
  "modify_date": '날짜',
};

const default_columns = [
  {
    title: "Month /Day",
    dataIndex: 'month_day',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Product",
    dataIndex: 'product_name',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Standard",
    dataIndex: 'standard',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Unit",
    dataIndex: 'unit',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Quantity",
    dataIndex: 'quantity',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Unit Price",
    dataIndex: 'unit_price',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Supply Price",
    dataIndex: 'supply_price',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Tax Price",
    dataIndex: 'tax_price',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Total Price",
    dataIndex: 'total_price',
    render: (text, record) => <>{text}</>,
  },
  {
    title: "Modified",
    dataIndex: 'modify_date',
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

const TransactionAddNewModal = () => {
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const { loadAllLeads } = useRecoilValue(LeadRepo);
  const { modifyTransaction } = useRecoilValue(TransactionRepo);
  const [ cookies] = useCookies(["myLationCrmUserId"]);

  const [ leadsForSelection, setLeadsForSelection ] = useState([]);
  const [ selectedCompany, setSelectedCompany ] = useState(null);
  const [ transactionChange, setTransactionChange ] = useState(null);
  const [ publishDate, setPublishDate ] = useState(new Date());

  const [ transactionContents, setTransactionContents ] = useState([]);
  const [ temporaryContent, setTemporaryContent ] = useState(null);
  const [ selectedRows, setSelectedRows ] = useState([]);

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

  // --- Functions used for adding new transaction ------------------------------
  const initializeTransactionTemplate = useCallback(() => {
    setTransactionChange({ ...defaultTransaction });
    setSelectedCompany(null);
    setTransactionContents([]);

    if(selectLeadRef.current)
      selectLeadRef.current.clearValue();

    document.querySelector("#add_new_transaction_form").reset();
  }, [selectLeadRef.current, defaultTransaction]);

  const handleTransactionChange = useCallback((e) => {
    const modifiedData = {
      ...transactionChange,
      [e.target.name]: e.target.value,
    };
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleSelectLead= useCallback((value) => {
    console.log('\thandleSelectLead / value ', value);
    if(value) {
      const tempChanges = {
        ...transactionChange,
        lead_code: value.value.lead_code,
        company_code: value.value.company_code,
        company_name: value.value.company_name,
        ceo_name: value.value.ceo_name,
        address: value.value.company_address,
        business_type: value.value.business_type,
        business_item: value.value.business_item,
        business_reg_code: value.value.business_registration_code,
      };
      console.log('\thandleSelectLead : ', tempChanges);
      setTransactionChange(tempChanges);
      setSelectedCompany(value.value.company_code)
    }
  }, [transactionChange]);

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
  }, [transactionChange, transactionContents, cookies.myLationCrmUserId, modifyTransaction, initializeTransactionTemplate]);


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


  // --- Functions used for editting content ------------------------------
  const handleLoadNewTemporaryContent = useCallback(() => {
    if(!transactionChange.company_name) {
      console.log('\t[handleLoadNewTemporaryContent] No company is selected');
      return;
    };

    const tempContent = {
      ...default_transaction_content,
      trasaction_sub_index: transactionContents.length + 1,
    };
    setTemporaryContent(tempContent);
  }, [transactionContents, transactionChange]);

  const handleDeleteSelectedConetents = useCallback(()=>{
    if(selectedRows.length === 0) {
      console.log('\t[handleDeleteSelectedConetents] No row is selected');
      return;
    };

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
    if (allCompanyData.length === 0) {
      loadAllCompanies();
    };

    // ----- Load Leads and set up the options of lead to select -----
    if (allLeadData.length === 0) {
      loadAllLeads();
    } else {
      if(allCompanyData.length > 0) {
        const temp_data = allLeadData.map(lead => {
          const foundIdx = allCompanyData.findIndex(com => com.company_code === lead.company_code);
          if(foundIdx !== -1) {
            const foundCompany = allCompanyData[foundIdx];
            return {
              label: lead.lead_name + " / " + lead.company_name,
              value: {
                lead_code: lead.lead_code,
                company_code: foundCompany.company_code,
                company_name: foundCompany.company_name,
                ceo_name: foundCompany.ceo_name,
                address: foundCompany.company_address,
                business_type: foundCompany.business_type,
                business_item: foundCompany.business_item,
                business_reg_code: foundCompany.business_registration_code,
              }
            };
          };
          return {
            label: lead.lead_name + " / " + lead.company_name,
            value: {
              lead_code: lead.lead_code,
              company_code: lead.company_code,
              company_name: lead.company_name,
              ceo_name: null,
              address: null,
              business_type: null,
              business_item: null,
              business_reg_code: null,
            }
          };
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
    };

    // ----- Initialize template to store values -----
    initializeTransactionTemplate();

  }, [allCompanyData, allLeadData, initializeTransactionTemplate, loadAllCompanies, loadAllLeads, setLeadsForSelection]);

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
                <div className="col-sm-2">
                  <label className="col-form-label">Title <span className="text-danger">*</span></label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Title"
                    name="transaction_title"
                    onChange={handleTransactionChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-4">
                  <label className="col-form-label">Type</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Type"
                    name="transaction_type"
                    onChange={handleTransactionChange}
                  />
                </div>
                <div className="col-sm-4">
                  <label className="col-form-label">Publish Date</label>
                  <div className="cal-icon cal-icon-sm">
                    <DatePicker
                      className="form-control form-control-sm"
                      selected={publishDate}
                      onChange={handlePublishDateChange}
                      dateFormat="yyyy.MM.dd"
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <label className="col-form-label">Publish Type</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Publish Type"
                    name="publish_type"
                    onChange={handleTransactionChange}
                  />
                </div>
              </div>
              <h4>Lead / Organization Information</h4>
              <div className="form-group row">
                <div className="col-sm-6">
                  <label className="col-form-label">Lead / Organization</label>
                  <Select ref={selectLeadRef} options={leadsForSelection} onChange={handleSelectLead} />
                </div>
              </div>
              { selectedCompany &&
                <div className="form-group row">
                  <div className="col-sm-6">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="border-0">CEO Name</td>
                          <td className="border-0">{transactionChange.ceo_name}</td>
                        </tr>
                        <tr>
                          <td>Registration No.</td>
                          <td>{transactionChange.business_registration_code}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-sm-6">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="border-0">Business Type</td>
                          <td className="border-0">{transactionChange.business_type}</td>
                        </tr>
                        <tr>
                          <td>Business Item</td>
                          <td>{transactionChange.business_item}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-sm-12">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="border-0">Address</td>
                          <td className="border-0">{transactionChange.company_address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              }
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
                  </div>
                </div>
              </h4>
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
                  columns={default_columns}
                  bordered
                  dataSource={transactionContents}
                  rowKey={(record) => record.trasaction_sub_index}
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
              <tr>
                <td>{trans_key_to_name.company_name}</td>
                <td>
                  <input 
                    name={temporaryContent.company_name}
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.company_name}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
                <td>{trans_key_to_name.transaction_sub_type}</td>
                <td>
                  <input 
                    name={temporaryContent.transaction_sub_type} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.transaction_sub_type}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
              </tr>
              <tr>
                <td>{trans_key_to_name.month_day}</td>
                <td>
                  <input 
                    name={temporaryContent.month_day} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.month_day}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
                <td>{trans_key_to_name.product_name}</td>
                <td>
                  <input 
                    name={temporaryContent.product_name} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.product_name}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
              </tr>
              <tr>
                <td>{trans_key_to_name.standard}</td>
                <td>
                  <input 
                    name={temporaryContent.standard} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.standard}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
                <td>{trans_key_to_name.unit}</td>
                <td>
                  <input 
                    name={temporaryContent.unit} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.unit}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
              </tr>
              <tr>
                <td>{trans_key_to_name.unit_price}</td>
                <td>
                  <input 
                    name={temporaryContent.unit_price} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.unit_price}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
                <td>{trans_key_to_name.quantity}</td>
                <td>
                  <input 
                    name={temporaryContent.quantity} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.quantity}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
              </tr>
              <tr>
                <td>{trans_key_to_name.supply_price}</td>
                <td>
                  <input 
                    name={temporaryContent.supply_price} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.supply_price}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
                <td>{trans_key_to_name.tax_price}</td>
                <td>
                  <input 
                    name={temporaryContent.tax_price}
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.tax_price}
                    onChange={handleEditTemporaryContent}
                  />
                </td>
              </tr>
              <tr>
                <td>{trans_key_to_name.total_price}</td>
                <td>
                  <input 
                    name={temporaryContent.total_price} 
                    className="input-group-text input-group-text-sm"
                    type="text"
                    defaultValue={temporaryContent.total_price}
                    onChange={handleEditTemporaryContent}
                  />
                  </td>
              </tr>
            </tbody>
          </table>
          <div>
            <textarea
              className="form-control"
              rows={3}
              placeholder='Memo'
              defaultValue={temporaryContent.memo}
              name='memo'
              onChange={handleEditTemporaryContent}
            />
          </div>
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

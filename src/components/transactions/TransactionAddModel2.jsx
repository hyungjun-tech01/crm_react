import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "antd/dist/reset.css";
import { Button, Checkbox, Col, Row, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AddBoxOutlined, ModeEdit, IndeterminateCheckBoxOutlined } from '@mui/icons-material';

import { LeadRepo } from "../../repository/lead";
import { TransactionRepo } from "../../repository/transaction";
import { atomAllCompanies, atomAllLeads, defaultTransaction } from "../../atoms/atoms";
import { ConvertCurrency, formatDate } from "../../constants/functions";

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

const TransactionAddModel = (props) => {
  const { init, handleInit } = props;
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const { loadAllLeads } = useRecoilValue(LeadRepo);
  const { modifyTransaction } = useRecoilValue(TransactionRepo);
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const { t } = useTranslation();

  const [leadsForSelection, setLeadsForSelection] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [transactionChange, setTransactionChange] = useState(null);
  const [publishDate, setPublishDate] = useState(new Date());

  const [transactionContents, setTransactionContents] = useState([]);
  const [temporaryContent, setTemporaryContent] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [supplyPrice, setSupplyPrice] = useState(0);
  const [taxyPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSale, setIsSale] = useState(true);

  const trans_types = [
    { value: '매출', label: t('company.deal_type_sales') },
    { value: '매입', label: t('company.deal_type_purchase') },
  ];


  // --- Functions / Variables dealing with editing -------------------------------
  const selectLeadRef = useRef(null);

  const handleSelectLead = useCallback((value) => {
    if (value) {
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
      setTransactionChange(tempChanges);
      setSelectedCompany(value.value.company_code)
    }
  }, [transactionChange]);

  const handlePublishDateChange = useCallback((date) => {
    setPublishDate(date);
    const localDate = formatDate(date);
    const tempChanges = {
      ...transactionChange,
      publish_date: localDate,
    };
    setTransactionChange(tempChanges);
  }, [transactionChange]);

  // --- Functions / Variables dealing with contents -------------------------------
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

  const default_columns = [
    {
      title: t('transaction.month_day'),
      dataIndex: 'month_day',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.product'),
      dataIndex: 'product_name',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.standard'),
      dataIndex: 'standard',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.unit'),
      dataIndex: 'unit',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.quantity'),
      dataIndex: 'quantity',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.unit_price'),
      dataIndex: 'unit_price',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: 'tax_price',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.modified'),
      dataIndex: 'modify_date',
      render: (text, record) => <>{text}</>,
    },
  ];

  const handleLoadNewTemporaryContent = useCallback(() => {
    if (!transactionChange.company_name) {
      console.log('\t[handleLoadNewTemporaryContent] No company is selected');
      return;
    };

    const tempContent = {
      ...default_transaction_content,
      trasaction_sub_index: transactionContents.length,
      company_name: transactionChange.company_name,
    };
    setTemporaryContent(tempContent);
  }, [transactionContents, transactionChange]);

  const handleLoadSelectedContent = useCallback((data) => {
    setTemporaryContent(data);
  }, [setTemporaryContent]);

  const handleDeleteSelectedConetents = useCallback(() => {
    if (selectedRows.length === 0) {
      console.log('\t[handleDeleteSelectedConetents] No row is selected');
      return;
    };

    let tempContents = [
      ...transactionContents
    ];
    selectedRows.forEach(row => {
      const filteredContents = tempContents.filter(item => item.trasaction_sub_index !== row.trasaction_sub_index);
      tempContents = filteredContents;
    });
    let temp_supply_price = 0;
    let temp_tax_price = 0;
    let temp_total_price = 0;
    const finalContents = tempContents.map((item, index) => {
      temp_supply_price += item.supply_price;
      temp_tax_price += item.tax_price;
      temp_total_price += item.total_price;
      return { ...item, trasaction_sub_index: index };
    });
    const tempTransaction = {
      ...transactionChange,
      supply_price: temp_supply_price,
      tax_price: temp_tax_price,
      total_price: temp_total_price,
    };
    setTransactionChange(tempTransaction);
    console.log('handleDeleteSelectedConetents / final : ', finalContents);
    setTransactionContents(finalContents);
  }, [selectedRows, transactionContents, transactionChange, setTransactionContents, setTransactionChange]);

  const handleEditTemporaryContent = useCallback((event) => {
    let temp_value = null;
    let tempContent = {
      ...temporaryContent
    };
    if (event.target.name === 'unit_price') {
      temp_value = Number(event.target.value);
      if (isNaN(temp_value)) {
        console.log('\t[ handleEditTemporaryContent ] Wrong input value');
        return;
      };
      if (temp_value !== 0) {
        tempContent.unit_price = temp_value;
        if (tempContent.quantity !== 0) {
          tempContent.supply_price = temp_value * tempContent.quantity;
          tempContent.tax_price = tempContent.supply_price * 0.1;
          tempContent.total_price = tempContent.supply_price + tempContent.tax_price;
          setSupplyPrice(tempContent.supply_price);
          setTaxPrice(tempContent.tax_price);
          setTotalPrice(tempContent.total_price);
        };
      }
    } else if (event.target.name === 'quantity') {
      temp_value = Number(event.target.value);
      if (isNaN(temp_value)) {
        console.log('\t[ handleEditTemporaryContent ] Wrong input value');
        return;
      };
      if (temp_value !== 0) {
        tempContent.quantity = temp_value;
        if (tempContent.unit_price !== 0) {
          tempContent.supply_price = temp_value * tempContent.unit_price;
          tempContent.tax_price = tempContent.supply_price * 0.1;
          tempContent.total_price = tempContent.supply_price + tempContent.tax_price;
          setSupplyPrice(tempContent.supply_price);
          setTaxPrice(tempContent.tax_price);
          setTotalPrice(tempContent.total_price);
        };
      }

    } else {
      tempContent[event.target.name] = event.target.value;
    }

    setTemporaryContent(tempContent);
  }, [temporaryContent, setTemporaryContent]);

  const handleSaveTemporaryEdit = useCallback(() => {
    const contentToSave = {
      ...temporaryContent
    };
    const temp_index = contentToSave.trasaction_sub_index;
    let tempContents = [];
    let temp_supply_price = contentToSave.supply_price;
    let temp_tax_price = contentToSave.tax_price;
    let temp_total_price = contentToSave.total_price;

    temp_supply_price += transactionChange.supply_price;
    temp_tax_price = transactionChange.tax_price;
    temp_total_price = transactionChange.total_price;

    if (temp_index === transactionContents.length) {
      tempContents = [
        ...transactionContents,
        contentToSave
      ];
    } else {
      temp_supply_price -= transactionContents[temp_index].supply_price;
      temp_tax_price -= transactionContents[temp_index].tax_price;
      temp_total_price -= transactionContents[temp_index].total_price;
      tempContents = [
        ...transactionContents.slice(0, temp_index),
        contentToSave,
        ...transactionContents.slice(temp_index + 1,)
      ];
    }
    setTransactionContents(tempContents);

    const tempTransactionChange = {
      ...transactionChange,
      supply_price: temp_supply_price,
      tax_price: temp_tax_price,
      total_price: temp_total_price,
    };
    setTransactionChange(tempTransactionChange);
    setTemporaryContent(null);
    setSupplyPrice(0);
    setTaxPrice(0);
    setTotalPrice(0);
  }, [temporaryContent, transactionContents, setTransactionContents, setTemporaryContent]);

  const handleCloseTemporaryEdit = useCallback(() => {
    setTemporaryContent(null);
    setTemporaryContent(null);
    setSupplyPrice(0);
    setTaxPrice(0);
    setTotalPrice(0);
  }, [setTemporaryContent]);

  // --- Functions used for adding/editing new transaction ------------------------------
  const initializeTransactionTemplate = useCallback(() => {
    console.log('\tinitializeTransactionTemplate called : ', init);
    setTransactionChange({ ...defaultTransaction });
    setPublishDate(null);
    setSelectedCompany(null);
    setTransactionContents([]);
    setIsSale(true);

    if (selectLeadRef.current)
      selectLeadRef.current.clearValue();

    document.querySelector("#add_new_transaction_form").reset();

    setSupplyPrice(0);
    setTaxPrice(0);
    setTotalPrice(0);

    handleInit(!init);
  }, [selectLeadRef.current, defaultTransaction]);

  const handleTransactionChange = useCallback((e) => {
    const modifiedData = {
      ...transactionChange,
      [e.target.name]: e.target.value,
    };
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleAddNewTransaction = useCallback((event) => {
    // Check data if they are available
    if (transactionChange.company_name === null
      || transactionChange.company_name === ''
      || transactionContents.length === 0
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };
    const newTransactionData = {
      ...transactionChange,
      transaction_contents: JSON.stringify(transactionContents),
      action_type: 'ADD',
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewTransaction ]`, newTransactionData);
    const result = modifyTransaction(newTransactionData);
    if (result) {
      initializeTransactionTemplate();
      //close modal ?
    };
  }, [transactionChange, transactionContents, cookies.myLationCrmUserId, modifyTransaction, initializeTransactionTemplate]);


  useEffect(() => {
    // ----- Load companies and set up the relation between lead and company by company code ---
    // if (allCompanyData.length === 0) {
    //   loadAllCompanies();
    // };

    // ----- Load Leads and set up the options of lead to select -----
    if (allLeadData.length === 0) {
      loadAllLeads();
    } else {
      if (allCompanyData.length > 0) {
        const temp_data = allLeadData.map(lead => {
          const foundIdx = allCompanyData.findIndex(com => com.company_code === lead.company_code);
          if (foundIdx !== -1) {
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
    if (init) initializeTransactionTemplate();

  }, [allLeadData, init]);

  return (
    <div
      className="modal right fade"
      id="add_new_transaction2"
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
            <h4 className="modal-title"><b>{t('transaction.add_transaction')}</b></h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form className="forms-sampme" id="add_new_transaction_form">
              <div className="card p-3">
                <Row>
                  <Col flex={13}>
                    <Row justify="space-around" align="middle">
                      <Col className="trans_title">{t("transaction.statement_of_account")}</Col>
                    </Row>
                    <Row justify="space-around" align="middle">
                      <Col flex={2}>
                        <Row justify='end' style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>{t('common.type2')} : </Col>
                        </Row>
                        <Row justify='end' style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>{t('transaction.customer_name')}: </Col>
                        </Row>
                      </Col>
                      <Col flex={3}>
                        <Row justify='space-between' style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <select name='type' onChange={(e)=>{
                              if(e.target.value==='sale'){
                                setIsSale(true);
                              }else{setIsSale(false)}}}
                            >
                              <option value='sale'>매출</option>
                              <option value='purchase'>매입</option>
                            </select>
                          </Col>
                          <Col>{t('transaction.publish_date')} : </Col>
                        </Row>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col><input type="text" /></Col>
                        </Row>
                      </Col>
                      <Col flex={3}>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col><DatePicker /></Col>
                        </Row>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <Button>{t('common.search')}</Button>
                            <Button>{t('common.list')}</Button>
                            <Button>{t('common.add')}</Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={10} style={{ border: '2px solid #ff5522', borderBottom: 0, display: 'flex', alignItems: 'stretch' }}>
                    <Col flex='25px' style={{ width: 25, borderRight: '2px solid #ff5522',textAlign:'center' }} >{t('transaction.receiver')}</Col>
                    <Col flex='auto' align='strech'>
                      <Row style={{ height: 42, borderBottom: '2px solid #ff5522' }}>
                        <Col flex='125px' style={{ borderRight: '2px solid #ff5522',textAlign:'center'}}>{t('transaction.register_no')}</Col>
                        <Col flex='auto'><input type='text' /></Col>
                      </Row>
                      <Row style={{ height: 42, borderBottom: '2px solid #ff5522' }}>
                        <Col flex='125px' style={{ borderRight: '2px solid #ff5522',textAlign:'center' }}>{t('transaction.company_name')}</Col>
                        <Col flex={1} style={{ borderRight: '2px solid #ff5522' }}><input type='text' /></Col>
                        <Col flex='25px' style={{ borderRight: '2px solid #ff5522',textAlign:'center' }}>{t('common.name2')}</Col>
                        <Col flex={1}><input type='text' /></Col>
                      </Row>
                      <Row style={{ height: 42, borderBottom: '2px solid #ff5522' }}>
                        <Col flex='125px' style={{ borderRight: '2px solid #ff5522',textAlign:'center' }}>{t('transaction.address')}</Col>
                        <Col flex='auto'><input type='text' /></Col>
                      </Row>
                      <Row style={{ height: 42 }}>
                        <Col flex='125px' style={{ borderRight: '2px solid #ff5522',textAlign:'center' }}>{t('company.business_type')}</Col>
                        <Col flex={1} style={{ borderRight: '2px solid #ff5522' }}><input type='text' /></Col>
                        <Col flex='25px' style={{ borderRight: '2px solid #ff5522',textAlign:'center' }}>{t('company.business_item')}</Col>
                        <Col flex={1}><input type='text' /></Col>
                      </Row>
                    </Col>
                  </Col>
                </Row>
                <Row align='middle'>
                  <Col flex={13} className={`trans_cell_left ${!isSale && "trans_pur"}`}>
                    <Button>열추가</Button>
                    <Button>품목추가</Button>
                    <Button>(세금)계산서</Button>
                    <Button>열삽입</Button>
                    <Button>삭제</Button>
                  </Col>
                  <Col flex={12} className={`trans_cell_right ${!isSale && "trans_pur"}`}>
                    <div style={{ flexGrow: 1 }}>과세구분 : </div>
                    <div style={{ flexGrow: 3 }}>
                      <select name='vat_type'>
                        <option value='vat_excluded'>{t('quotation.vat_excluded')}</option>
                        <option value='vat_included'>{t('quotation.vat_included')}</option>
                      </select>
                    </div>
                    <div style={{ flexGrow: 3 }}>
                      <Checkbox>소수점</Checkbox>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col flex='auto' className={`trans_table ${!isSale && "trans_pur"}`}>
                    <Table
                      rowSelection={{
                        ...rowSelection,
                      }}
                      pagination={{
                        total: transactionContents.length,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={default_columns}
                      bordered
                      dataSource={transactionContents}
                      rowKey={(record) => record.trasaction_sub_index}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col flex={5} className={`trans_border_left ${!isSale && "trans_pur"}`}>
                    <Row>
                    <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.balance_prev')}
                      </Col>
                    </Row>
                    <Row><Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>0</Col></Row>
                    <Row>
                    <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.receipt')}
                      </Col>
                    </Row>
                    <Row><Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>0</Col></Row>
                  </Col>
                  <Col flex={5}>
                    <Row>
                    <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.supply_price')}
                      </Col>
                    </Row>
                    <Row><Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>0</Col></Row>
                    <Row>
                    <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.balance_total')}
                      </Col>
                    </Row>
                    <Row><Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>0</Col></Row>
                  </Col>
                  <Col flex={5}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.tax_price')}
                      </Col>
                    </Row>
                    <Row><Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>0</Col></Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right ">
                        {t('transaction.receiver2')}
                      </Col>
                    </Row>
                    <Row><Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>0</Col></Row>
                  </Col>
                  <Col flex={5} className={`trans_border_right ${!isSale && "trans_pur"}`}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title">
                        {t('transaction.sum_price')}
                      </Col>
                    </Row>
                    <Row><Col flex='auto' className={`trans_amt ${!isSale && "trans_pur"}`}>0</Col></Row>
                    <Row>
                    <Col flex='auto' className="trans_amt_title">
                        {t('transaction.trans_pages')}
                      </Col>
                    </Row>
                    <Row><Col flex='auto' className={`trans_amt ${!isSale && "trans_pur"}`}>0</Col></Row>
                  </Col>
                </Row>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionAddModel;

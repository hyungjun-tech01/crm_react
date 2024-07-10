import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import * as bootstrap from '../../assets/js/bootstrap';
import "antd/dist/reset.css";
import { Button, Checkbox, Col, Input, InputNumber, Row, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  atomCompanyState,
  atomCompanyForSelection,
  atomCurrentTransaction,
  defaultTransaction,
} from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { DefaultTransactionContent, TransactionRepo } from "../../repository/transaction";

import { ConvertCurrency, formatDate } from "../../constants/functions";
import TransactionContentModal from "./TransactionContentModal";
import TransactionReceiptModal from "./TransactionReceiptModal";
import MessageModal from "../../constants/MessageModal";
import TransactionPrint from "./TransactionPrint";
import TransactionTaxBillModel from "./TransactionTaxBillModel";

const default_transaction_data = {
  title: '',
  is_sale: true,
  vat_included: true,
  show_decimal: false,
  valance_prev: 0,
  supply_price: 0,
  tax_price: 0,
  total_price: 0,
  receipt: 0,
  valance_final: 0,
  receiver: '',
  page_cur: 1,
  page_total: 1,
  page: '1p',
};

const TransactionAddModel = (props) => {
  const { init, handleInit } = props;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const [ isMessageModalOpen, setIsMessageModalOpen ] = useState(false);
  const [ message, setMessage ] = useState({title:'', message: ''});


  //===== [RecoilState] Related with Transaction =====================================
  const currentTransaction = useRecoilValue(atomCurrentTransaction);
  const { modifyTransaction, setCurrentTransaction } = useRecoilValue(TransactionRepo);


  //===== [RecoilState] Related with Company =========================================
  const [companyState, setCompanyState] = useRecoilState(atomCompanyState);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);


  //===== Handles to edit 'TransactionAddModel' ======================================
  const [transactionChange, setTransactionChange] = useState(null);
  const [transactionContents, setTransactionContents] = useState([]);
  const [isSale, setIsSale] = useState(true);
  const [isVatIncluded, setIsVatIncluded] = useState(true);
  const [showDecimal, setShowDecimal] = useState(false);
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);
  const [selectData, setSelectData] = useState({});

  const handleItemChange = useCallback((e) => {
    const modifiedData = {
      ...transactionChange,
      [e.target.name]: e.target.value,
    };
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleDateChange = useCallback((name, date) => {
    const modifiedData = {
      ...transactionChange,
      [name]: date
    };
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleSelectChange = useCallback((name, selected) => {
    let modifiedData = null;
    if (name === 'company_name') {
      modifiedData = {
        ...transactionChange,
        company_code: selected.value.company_code,
        company_name: selected.value.company_name,
        company_address: selected.value.company_address,
        ceo_name: selected.value.ceo_name,
        business_type: selected.value.business_type,
        business_item: selected.value.business_item,
        business_registration_code: selected.value.business_registration_code,
      };
    } else {
      if (name === 'transaction_type') {
        if (selected.value === '매출') {
          setIsSale(true);
        } else {
          setIsSale(false);
        };
      };
      modifiedData = {
        ...transactionChange,
        [name]: selected.value,
      };
    };

    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const trans_types = [
    { value: '매출', label: t('company.deal_type_sales') },
    { value: '매입', label: t('company.deal_type_purchase') },
  ];


  // --- Functions / Variables dealing with contents -------------------------------
  const rowSelection = {
    selectedRowKeys: selectedContentRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedContentRowKeys(selectedRowKeys);
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
      render: (text, record) => <>{ConvertCurrency(text, dataForTransaction.show_decimal && 4)}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForTransaction.show_decimal && 4)}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: 'tax_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForTransaction.show_decimal && 4)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForTransaction.show_decimal && 4)}</>,
    },
    {
      title: t('transaction.modified'),
      dataIndex: 'modify_date',
      render: (text, record) => <>{text}</>,
    },
  ];


  //===== Handles to edit 'Contents' =================================================
  const [dataForTransaction, setDataForTransaction] = useState({...default_transaction_data});
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [orgContentModalData, setOrgContentModalData] = useState({});
  const [editedContentModalData, setEditedContentModalData] = useState({});

  const handleFormatter = useCallback((value) => {
    if(value === undefined || value === null || value === '') return '';
    let ret = value;
    if(typeof value === 'string') {
      ret = Number(value);
      if(isNaN(ret)) return;
    };
    
    return showDecimal
      ? ret?.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      : ret?.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, [showDecimal]);

  const handleAmountCalculation = (data) => {
    let supply_price = 0, tax_price = 0, total_price = 0;
    data.forEach(item => {
      supply_price += item.supply_price;
      tax_price += item.tax_price;
      total_price += item.total_price;
    });
    const valance_final = dataForTransaction.valance_prev + total_price - dataForTransaction.receipt;
    const tempData = {
      ...dataForTransaction,
      is_sale: isSale,
      vat_included: isVatIncluded,
      show_decimal: showDecimal,
      supply_price: supply_price,
      tax_price: tax_price,
      total_price: total_price,
      valance_final: valance_final,
    };
    setDataForTransaction(tempData);
  };
  
  const handleStartAddContent = () => {
    if(!transactionChange['company_code']) return;
    const tempData = {
      ...dataForTransaction,
      title: t('quotation.add_content'),
    };
    setDataForTransaction(tempData);
    setOrgContentModalData({...DefaultTransactionContent});
    setEditedContentModalData({});
    setIsContentModalOpen(true);
  };

  const handleStartEditContent = (data) => {
    const tempData = {
      ...data,
      title: `${t('common.item')} ${t('common.edit')}`,
    };
    setDataForTransaction(tempData);
    setOrgContentModalData({...DefaultTransactionContent});
    setEditedContentModalData({});
    setIsContentModalOpen(true);
  };

  const handleContentModalOk = () => {
    if(!editedContentModalData['transaction_date']){
      const tempMsg = {title: '확인', message: '거래일 정보가 누락되었습니다.'}
      setMessage(tempMsg);
      setIsMessageModalOpen(true);
      return;
    };

    setIsContentModalOpen(false);
    const inputData = new Date(editedContentModalData.transaction_date);
    const tempDate = `${inputData.getMonth()+1}.${inputData.getDate()}`;
    const tempContent = {
      ...orgContentModalData,
      ...editedContentModalData,
      month_day: tempDate,
      transaction_sub_index: transactionContents.length + 1,
      company_code: transactionChange.company_code,
      company_name: transactionChange.company_name,
      transaction_sub_type: dataForTransaction.payment_type,
      modify_date: formatDate(new Date()),
    };
    delete tempContent.transaction_date;
    delete tempContent.product_class_name;

    const tempContents = transactionContents.concat(tempContent);
    setTransactionContents(tempContents);
    handleAmountCalculation(tempContents);
    setIsContentModalOpen(false);
    setOrgContentModalData({...DefaultTransactionContent});
    setEditedContentModalData({});
  };

  const handleContentModalCancel = () => {
    setIsContentModalOpen(false);
    setEditedContentModalData({});
    setOrgContentModalData({});
    setSelectedContentRowKeys([]);
  };

  const handleContentDelete = () => {
    if(selectedContentRowKeys.length ===0) return;
    const tempContents = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) === -1);
    setTransactionContents(tempContents);
    setSelectedContentRowKeys([]);
  };

  const handleContentMoveUp = () => {
    if(selectedContentRowKeys.length === 0) return;
    selectedContentRowKeys.sort();
    
    let tempContents = null;
    let startIdx = 0;
    const selecteds = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) !== -1);
    const unselecteds = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) === -1);
    const firstIdx = selectedContentRowKeys[0];
    if(firstIdx === 1){
      tempContents = [
        ...selecteds,
        ...unselecteds,
      ];
      startIdx = 1;
    } else {
      tempContents = [
        ...unselecteds.slice(0, firstIdx - 2),
        ...selecteds,
        ...unselecteds.slice(firstIdx - 2, ),
      ];
      startIdx = firstIdx - 1;
    };
    const finalContents = tempContents.map((item, index) => {
      const temp3 = {
        ...item,
        transaction_sub_index: index + 1,
      };
      return temp3;
    });
    setTransactionContents(finalContents);

    let tempKeys = [];
    for(let i = 0; i<selecteds.length; i++, startIdx++){
      tempKeys.push(startIdx);
    }
    setSelectedContentRowKeys(tempKeys);
  };

  const handleContentMoveDown = () => {
    if(selectedContentRowKeys.length === 0) return;
    selectedContentRowKeys.sort();

    let tempContents = null;
    let startIdx = 0;
    const selecteds = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) !== -1);
    const unselecteds = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) === -1);
    const lastIdx = selectedContentRowKeys.at(-1);
    if(lastIdx === transactionContents.length){
      tempContents = [
        ...unselecteds,
        ...selecteds,
      ];
      startIdx=lastIdx;
    } else {
      tempContents = [
        ...unselecteds.slice(0, lastIdx),
        ...selecteds,
        ...unselecteds.slice(lastIdx, ),
      ];
      startIdx=lastIdx + 1;
    };
    const finalContents = tempContents.map((item, index) => {
      const temp3 = {
        ...item,
        transaction_sub_index: index + 1,
      };
      return temp3;
    });
    setTransactionContents(finalContents);

    let tempKeys = [];
    for(let i = 0; i<selecteds.length; i++){
      tempKeys.push(startIdx--);
    }
    setSelectedContentRowKeys(tempKeys);
  };


  //===== Handles to edit 'Receipt' ==============================================
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [orgReceiptModalData, setOrgReceiptModalData] = useState({});
  const [editedReceiptModalData, setEditedReceiptModalData] = useState({});

  const handleVATChange = (e)=>{
    const tempVatInclude = e.target.value === 'vat_included';
    if(isVatIncluded !== tempVatInclude){
      console.log('handleVATChange :', tempVatInclude);
      setIsVatIncluded(tempVatInclude);
      if(tempVatInclude){
        const tempContents = transactionContents.map(item => {
          return {
            ...item,
            tax_price: item.supply_price * 0.1,
            total_price: item.supply_price * 1.1,
          };
        });
        setTransactionContents(tempContents);
        handleAmountCalculation(tempContents);
      } else {
        const tempContents = transactionContents.map(item => {
          return {
            ...item,
            tax_price: 0,
            total_price: item.supply_price,
          };
        });
        setTransactionContents(tempContents);
        handleAmountCalculation(tempContents);
      };
    }
  };

  const handleStartEditReceipt = () => {
    if(!orgReceiptModalData['payment_amount']){
      const tempReceipt = {
        payment_amount: 0,
        payment_type: '현금',
        payment_org: '',
        payment_code: '',
      };
      setOrgReceiptModalData(tempReceipt);
    };
    setIsReceiptModalOpen(true);
  };

  const handleReceiptModalOk = () => {
    setIsReceiptModalOpen(false);
    const tempOrgData = {
      ...orgReceiptModalData,
      ...editedReceiptModalData
    };
    setOrgReceiptModalData(tempOrgData);
    setEditedReceiptModalData({});
    
    const temp_valance= dataForTransaction.valance_prev + dataForTransaction.total_price - tempOrgData.payment_amount;
    const tempData={
      ...dataForTransaction,
      receipt: tempOrgData.payment_amount,
      valance_final: temp_valance,
    };
    setDataForTransaction(tempData);
  };

  const handleReceiptModalCancel = () => {
    setIsReceiptModalOpen(false);
    setEditedReceiptModalData({});
  };

  //===== Handles for special actions =============================================
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [transactionForPrint, setTransactionForPrint] = useState({});
  const [contentsForPrint, setContentsForPrint] = useState([]);

  const handleInitialize = () => {
    setIsSale(true);
    setIsVatIncluded(true);
    setShowDecimal(false);
    setDataForTransaction({...default_transaction_data});
    setTransactionChange({ ...defaultTransaction });
    setTransactionContents([]);
    setOrgReceiptModalData({});
    setEditedReceiptModalData({});
    setCurrentTransaction(defaultTransaction);
    setSelectData({trans_type: trans_types[0], tax_type: 'vat_included', company_selection: null});
  };

  const handleShowPrint = () => {
    const tempTransactionData = {
      ...transactionChange,
      ...dataForTransaction,
    };
    setTransactionForPrint(tempTransactionData);
    setContentsForPrint(transactionContents);
    setIsPrintModalOpen(true);
  };

  const handleShowTaxBill = () => {
    const tempTransactionData = {
      ...transactionChange,
      ...dataForTransaction,
    };
    console.log('handleShowTaxBill : ', tempTransactionData);
    setTransactionForPrint(tempTransactionData);
    setContentsForPrint(transactionContents);
    let myModal = new bootstrap.Modal(document.getElementById('add_new_tax_bill'), {
      keyboard: false
    })
    myModal.show();
  };

  const handleSaveNewTransaction = (value) => {
    if (transactionChange.company_name === null
      || transactionChange.company_name === ''
      || transactionContents.length === 0
    ) {
      setMessage({title: '*필수 입력 누락*', message: '업체 정보나 품목 정보가 누락되었습니다.'});
      setIsMessageModalOpen(true);
      return;
    };
    const newTransactionData = {
      ...transactionChange,
      transaction_contents: JSON.stringify(transactionContents),
      transaction_title: transactionContents.at(0).product_name + ' 외',
      action_type: 'ADD',
      modify_user: cookies.myLationCrmUserId,
    };
    const result = modifyTransaction(newTransactionData);
    result.then((res) => {
      if(res){
        if(value === 'TaxBill'){
          handleShowTaxBill();
        } else if(value === 'print'){
          handleShowPrint();
        };
        initializeTransactionTemplate();
      }
      else {
        setMessage({title: '저장 중 오류', message: `오류가 발생하여 저장하지 못했습니다.\n- ${res}`});
        setIsMessageModalOpen(true);
      };
    });
  };

  const handleAddPrintTransaction = () => {
    handleSaveNewTransaction('print');
  };

  const handleAddNewTransaction = () => {
    handleSaveNewTransaction(null);
  };

  const handleIssueTransaction = () => {
    // Save this transactions -------------------------
    if(currentTransaction === defaultTransaction) {
      handleSaveNewTransaction('TaxBill');
    } else {
      handleShowTaxBill();
    }
  };

  const handleShowDecimal = (e) => {
    if(showDecimal !== e.target.checked)
    {
      setShowDecimal(e.target.checked)
    };
  };

  const initializeTransactionTemplate = useCallback(() => {
    handleInitialize();

    document.querySelector("#add_new_transaction_form").reset();
    if(handleInit) {
      handleInit(!init);
    }
  }, [handleInit, init]);

  //===== useEffect ==============================================================
  useEffect(() => {
    console.log('Company called!');
    if ((companyState & 3) === 0) {
      setCompanyState(2);   //pending state
      loadAllCompanies();
    };
  }, [companyState, loadAllCompanies, setCompanyState]);

  useEffect(() => {
    if (init) {
      console.log('[TransactionAddModel] called to add new~~!');
      initializeTransactionTemplate();
      handleInit(!init);
    } else {
      console.log('[TransactionAddModel] called to modify the current ~~!');
      if(currentTransaction !== defaultTransaction){
        const tempTransaction = {
          ...currentTransaction,
          publish_date: new Date(currentTransaction.publish_date),
        }
        setTransactionChange(tempTransaction);

        const currentContents = JSON.parse(currentTransaction.transaction_contents);
        setTransactionContents(currentContents);

        const tempCurrentCompany = companyForSelection.filter(item => item.value.company_code === currentTransaction.company_code);
        const tempData = {
          trans_type: (currentTransaction.business_type === '매출' || currentTransaction.business_type === 'sale')
            ? trans_types[0] : trans_types[1],
          tax_type: currentTransaction.tax_price && currentTransaction.tax_price > 0 ? 'vat_included' : 'vat_excluded',
          company_selection: tempCurrentCompany.length > 0 ? tempCurrentCompany[0]: null,
        }
        setSelectData(tempData);

      };
    };
  }, [handleInit, init, initializeTransactionTemplate, currentTransaction]);

  if(!transactionChange) return null;

  return (
    <div
      className="modal right fade"
      id="add_new_transaction2"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      data-bs-focus="false"
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
                            <Select
                              className="trans_select"
                              defaultValue={selectData.trans_type}
                              onChange={selected => handleSelectChange('transaction_type', selected)}
                              options={trans_types}
                            />
                          </Col>
                          <Col>{t('transaction.publish_date')} : </Col>
                        </Row>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <Select
                              className="trans_select"
                              defaultValue={selectData.company_selection}
                              onChange={selected => handleSelectChange('company_name', selected)}
                              options={companyForSelection}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col flex={3}>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <DatePicker
                              name="publish_date"
                              selected={transactionChange['publish_date']}
                              onChange={(date) => handleDateChange('publish_date', date)}
                              dateFormat="yyyy-MM-dd"
                              className="trans_date"
                            />
                          </Col>
                        </Row>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <Button onClick={handleIssueTransaction} style={{ width: 150 }}>{t('transaction.issue')}</Button>
                            <Button onClick={handleInitialize} style={{ width: 100 }}>{t('common.initialize')}</Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={10} className={`trans_receiver trans_br ${!isSale && 'trans_pur'}`}>
                    <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`} >{isSale ? t('transaction.receiver') : t('transaction.supplier')}</Col>
                    <Col flex='auto' align='strech'>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.register_no')}</Col>
                        <Col flex='auto'>
                          <Input
                            name='business_registration_code'
                            value={transactionChange['business_registration_code']}
                            onChange={handleItemChange}
                          />
                        </Col>
                      </Row>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.company_name')}</Col>
                        <Col flex={1} className={`trans_rec_content ${!isSale && 'trans_pur'}`}>
                          <label>{transactionChange['company_name']}</label>
                        </Col>
                        <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('common.name2')}</Col>
                        <Col flex={1}>
                          <Input
                            name='ceo_name'
                            value={transactionChange['ceo_name']}
                            onChange={handleItemChange}
                          />
                        </Col>
                      </Row>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.address')}</Col>
                        <Col flex='auto'>
                          <Input
                            name='company_address'
                            value={transactionChange['company_address']}
                            onChange={handleItemChange}
                          />
                        </Col>
                      </Row>
                      <Row className="trans_rec_item_last">
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('company.business_type')}</Col>
                        <Col flex={1} className={`trans_rec_content ${!isSale && 'trans_pur'}`}>
                          <Input
                            name='business_type'
                            value={transactionChange['business_type']}
                            onChange={handleItemChange}
                          />
                        </Col>
                        <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('company.business_item')}</Col>
                        <Col flex={1}>
                          <Input
                            name='business_item'
                            value={transactionChange['business_item']}
                            onChange={handleItemChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                </Row>
                <Row align='middle'>
                  <Col flex={13} className={`trans_cell_left ${!isSale && "trans_pur"}`}>
                    <Button onClick={handleStartAddContent}>{t('transaction.add_content')}</Button>
                    <Button onClick={handleContentDelete} disabled={selectedContentRowKeys.length === 0}>{t('transaction.remove_selects')}</Button>
                    <Button onClick={handleContentMoveUp} disabled={selectedContentRowKeys.length === 0}>{t('transaction.move_up')}</Button>
                    <Button onClick={handleContentMoveDown} disabled={selectedContentRowKeys.length === 0}>{t('transaction.move_down')}</Button>
                  </Col>
                  <Col flex={12} className={`trans_cell_right ${!isSale && "trans_pur"}`}>
                    <div style={{ flexGrow: 1 }}>{t('transaction.tax_type')} : </div>
                    <div style={{ flexGrow: 3 }}>
                      <select
                        name='vat_type'
                        onChange={handleVATChange}
                        defaultValue={selectData.tax_type}
                      >
                        <option value='vat_excluded'>{t('quotation.vat_excluded')}</option>
                        <option value='vat_included'>{t('quotation.vat_included')}</option>
                      </select>
                    </div>
                    <div style={{ flexGrow: 3 }}>
                      <Checkbox onClick={handleShowDecimal}>{t('quotation.show_decimal')}</Checkbox>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col flex='auto' className={`trans_table ${!isSale && "trans_pur"}`}>
                    <Table
                      rowSelection={rowSelection}
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
                      rowKey={(record) => record.transaction_sub_index}
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            console.log('Double Click / Edit - ', record);
                            handleStartEditContent(record);
                          }, // click row
                        };
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col flex={5} className={`trans_bl ${!isSale && "trans_pur"}`}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.balance_prev')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        <InputNumber
                          value={dataForTransaction.valance_prev}
                          formatter={handleFormatter}
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                          style={{width:'180px', height:'30px',border:0,textAlign:'end'}}
                          onChange={(e)=>{
                            const value = Number(e.target.value);
                            if(isNaN(value)) return;
                            const temp={...dataForTransaction, valance_prev: value};
                            setDataForTransaction(temp);
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.receipt')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto'
                        onClick={handleStartEditReceipt}
                        className={`trans_amt low right ${!isSale && "trans_pur"}`}
                      >
                        {ConvertCurrency(dataForTransaction.receipt, dataForTransaction.show_decimal && 4)}
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={5}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.supply_price')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(dataForTransaction.supply_price, dataForTransaction.show_decimal && 4)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.balance_total')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt  low right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(dataForTransaction.valance_final, dataForTransaction.show_decimal && 4)}
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={5}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.tax_price')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(dataForTransaction.tax_price, dataForTransaction.show_decimal && 4)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right ">
                        {t('transaction.receiver2')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt low right ${!isSale && "trans_pur"}`}>
                        <Input
                          value={dataForTransaction.receiver}
                          style={{height:'30px',border:0,textAlign:'end'}}
                          onChange={(e)=>{
                            const temp={...dataForTransaction, receiver: e.target.value};
                            setDataForTransaction(temp);
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={5} className={`trans_br ${!isSale && "trans_pur"}`}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title">
                        {t('transaction.sum_price')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(dataForTransaction.total_price, dataForTransaction.show_decimal && 4)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title">
                        {t('transaction.trans_pages')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt low ${!isSale && "trans_pur"}`}>
                        {`${dataForTransaction.page_cur}/${dataForTransaction.page_total}/${dataForTransaction.page}`}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                  onClick={handleAddPrintTransaction}
                >
                  {t('transaction.save_print')}
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                  onClick={handleAddNewTransaction}
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
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-secondary btn-rounded"
                  onClick={handleShowTaxBill}
                >
                  Test
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <TransactionContentModal
        setting={dataForTransaction}
        open={isContentModalOpen}
        original={orgContentModalData}
        edited={editedContentModalData}
        handleEdited={setEditedContentModalData}
        handleOk={handleContentModalOk}
        handleCancel={handleContentModalCancel}
      />
      <TransactionReceiptModal
        open={isReceiptModalOpen}
        original={orgReceiptModalData}
        edited={editedReceiptModalData}
        handleEdited={setEditedReceiptModalData}
        handleOk={handleReceiptModalOk}
        handleCancel={handleReceiptModalCancel}
      />
      <TransactionPrint
        open={isPrintModalOpen}
        handleClose={()=>setIsPrintModalOpen(false)}
        transaction={transactionForPrint}
        contents={contentsForPrint}
      />
      <TransactionTaxBillModel
        transaction={transactionForPrint}
        contents={contentsForPrint}
      />
      <MessageModal
        title={message.title}
        message={message.message}
        open={isMessageModalOpen}
        handleOk={()=>setIsMessageModalOpen(false)}
      />
    </div>
  );
};

export default TransactionAddModel;

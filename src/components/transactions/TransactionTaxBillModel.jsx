import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "antd/dist/reset.css";
import { Button, Checkbox, Col, Input, InputNumber, Row, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classNames from 'classnames';

import {
  atomCompanyState,
  atomCompanyForSelection,
  defaultTransaction,
} from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { DefaultTransactionContent, TransactionRepo } from "../../repository/transaction";

import { ConvertCurrency, formatDate } from "../../constants/functions";
import TransactionContentModal from "./TransactionContentModal";
import TransactionReceiptModal from "./TransactionReceiptModal";
import MessageModal from "../../constants/MessageModal";
import TransactionPrint from "./TransactionPrint";

import styles from './Transaction.module.scss';

const default_transaction_data = {
  title: '',
  vat_included: false,
  show_decimal: 0,
  auto_calc: true,
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
  receipt_org: '',
  receipt_account: '',
};

const TransactionTaxBillModel = (props) => {
  const { init, handleInit } = props;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const [ isMessageModalOpen, setIsMessageModalOpen ] = useState(false);
  const [ message, setMessage ] = useState({title:'', message: ''});


  //===== [RecoilState] Related with Transaction =====================================
  const { modifyTransaction } = useRecoilValue(TransactionRepo);


  //===== [RecoilState] Related with Company =========================================
  const companyState = useRecoilValue(atomCompanyState);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);


  //===== Handles to edit 'TransactionTaxBillModel' ======================================
  const [transactionChange, setTransactionChange] = useState({});
  const [transactionContents, setTransactionContents] = useState([]);
  const [isSale, setIsSale] = useState(true);
  const [isTaxBill, setIsTaxBill] = useState(true);
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);

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
    console.log('[handleDateChange] : ', modifiedData);
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
        console.log('handleSelectChange / transaction_type :', selected);
        if (selected.value === '매출') {
          setIsSale(true);
        } else {
          setIsSale(false);
        };
      } else if(name === 'bill_type') {
        console.log('handleSelectChange / bill_type :', selected);
        if (selected.value === '세금계산서') {
          setIsTaxBill(true);
        } else {
          setIsTaxBill(false);
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
  const bill_types = [
    { value: '세금계산서', label: t('transaction.tax_bill') },
    { value: '계산서', label: t('transaction.bill') },
  ];


  // --- Functions / Variables dealing with contents -------------------------------
  const rowSelection = {
    selectedRowKeys: selectedContentRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selected :', selectedRowKeys);
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
      render: (text, record) => <>{ConvertCurrency(text, dataForTransaction.show_decimal)}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForTransaction.show_decimal)}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: 'tax_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForTransaction.show_decimal)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForTransaction.show_decimal)}</>,
    },
    {
      title: t('transaction.modified'),
      dataIndex: 'modify_date',
      render: (text, record) => <>{text}</>,
    },
  ];


  //===== Handles to edit 'Contents' =================================================
  const [dataForTransaction, setDataForTransaction] = useState(default_transaction_data);
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
    
    return dataForTransaction.show_decimal
      ? ret?.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      : ret?.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, [dataForTransaction.show_decimal]);

  const handleAmountCalculation = (data) => {
    let supply_price = 0, tax_price = 0, total_price = 0;
    data.forEach(item => {
      supply_price += item.supply_price;
      tax_price += item.tax_price;
      total_price += item.total_price;
    });
    console.log('handleAmountCalculation : ', supply_price, tax_price, total_price);
    const valance_final = dataForTransaction.valance_prev + total_price - dataForTransaction.receipt;
    const tempData = {
      ...dataForTransaction,
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
    console.log('handleContentMoveUp : ', selectedContentRowKeys);
    
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
    console.log('handleContentMoveDown :', selectedContentRowKeys);

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
    console.log('handleContentMoveUp / final value: ', finalContents);

    let tempKeys = [];
    for(let i = 0; i<selecteds.length; i++){
      tempKeys.push(startIdx--);
    }
    setSelectedContentRowKeys(tempKeys);
    console.log('handleContentMoveDown / final key : ', tempKeys);
  };


  //===== Handles to edit 'Receipt' ==============================================
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [orgReceiptModalData, setOrgReceiptModalData] = useState({});
  const [editedReceiptModalData, setEditedReceiptModalData] = useState({});

  const handleVATChange = (e)=>{
    const tempIncludeVAT = e.target.value === 'vat_included';
    if(dataForTransaction.vat_included !== tempIncludeVAT){
      const tempValues = {
        ...dataForTransaction,
        vat_included: tempIncludeVAT,
      };
      setDataForTransaction(tempValues);
      if(tempIncludeVAT){
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
    console.log('[handleReceiptModalOk] ', tempOrgData);
    
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
  const [contentsForPrint, setContentsForPrint] = useState({});

  const handleInitialize = () => {
    setDataForTransaction(default_transaction_data);
    setTransactionChange({ ...defaultTransaction });
    setTransactionContents([]);
    setOrgReceiptModalData({});
    setEditedReceiptModalData({});
  };

  const handleShowPrint = () => {
    console.log('handleShowPrint');
    const tempTransactionData = {
      ...transactionChange,
      ...dataForTransaction,
    };
    setTransactionForPrint(tempTransactionData);
    setContentsForPrint(transactionContents);
    setIsPrintModalOpen(true);
  };

  const handleShowTaxBill = () => {
    console.log('handleShowTaxBill');
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
        setMessage({title: '저장 중 오류', message: '오류가 발생하여 저장하지 못했습니다.'});
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
    handleSaveNewTransaction('TaxBill');
  };

  const handleShowDecimal = (e) => {
    const decimalValue = e.target.checked ? 4 : 0;
    const tempData = {
      ...dataForTransaction,
      show_decimal: decimalValue,
    };
    setDataForTransaction(tempData);
  };

  const initializeTransactionTemplate = useCallback(() => {
    handleInitialize();

    document.querySelector("#add_new_transaction_form").reset();

    handleInit(!init);
  }, [handleInit, init]);

  //===== useEffect ==============================================================
  useEffect(() => {
    console.log('Company called!');
    if ((companyState & 1) === 0) {
      loadAllCompanies();
    };
  }, [companyState, loadAllCompanies]);

  useEffect(() => {
    console.log('[TransactionTaxBillModel] called!');
    if (init) {
      initializeTransactionTemplate();
      handleInit(!init);
    };
  }, [handleInit, init, initializeTransactionTemplate, isSale]);

  return (
    <div
      className="modal right fade"
      id="add_new_tax_bill"
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
            <h4 className="modal-title"><b>{t('transaction.tax_bill')}</b></h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <div className="task-infos">
              <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to="#tax-bill-details"
                    data-bs-toggle="tab"
                  >
                    {t('common.details')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#tax-bill-print"
                    data-bs-toggle="tab"
                  >
                    {t('common.preview')}
                  </Link>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane show active" id="tax-bill-details">
                  <form className="forms-sampme" id="add_new_transaction_form">
                    <div className="card p-3">
                      <div className={styles.billHeader}>
                        <div>{t('common.type2')} : </div>
                        <div className={styles.billTransType}>
                          <Select
                            className="trans_select"
                            defaultValue='매출'
                            onChange={selected => handleSelectChange('transaction_type', selected)}
                            options={trans_types}
                          />
                        </div>
                        <div>{t('transaction.bill_type')} : </div>
                        <div className={styles.billBillType}>
                          <Select
                            className="trans_select"
                            defaultValue='세금계산서'
                            onChange={selected => handleSelectChange('bill_type', selected)}
                            options={bill_types}
                          />
                        </div>
                        <div style={{paddingRight:'0.5rem'}}><Checkbox /></div>
                        <div>{t('quotation.show_decimal')}</div>
                      </div>
                      <Row align='middle' justify='space-between' className={`trans_bl trans_br trans_bt ${!isSale && 'trans_pur'}`}>
                        <Col flex={8}>
                          <Row justify="center" align="middle">
                            <Col className={classNames(styles.billTitle, {'trans_pur': !isSale})}>{isTaxBill ? t("transaction.tax_bill") : t("transaction.bill")}</Col>
                          </Row>
                        </Col>
                        <Col flex={5}>
                          <Row justify="center" align="middle">
                            <Col className={`trans_text ${!isSale && 'trans_pur'}`}>({isSale ? t("transaction.for_receiver") : t('transaction.for_supplier')})</Col>
                          </Row>
                        </Col>
                        <Col flex={3}>
                          <Row align='middle' className={`trans_br trans_text ${!isSale && 'trans_pur'}`}>
                            <Col flex={24}>책 번 호&nbsp;</Col>
                          </Row>
                          <Row align='middle' className={`trans_br trans_text ${!isSale && 'trans_pur'}`}>
                            <Col flex={24}>일련번호&nbsp;</Col>
                          </Row>
                        </Col>
                        <Col flex={4}>
                          <Row align='middle' className={`trans_br trans_text ${!isSale && 'trans_pur'}`}>
                            <Col flex={24}>{ } 권&nbsp;</Col>
                          </Row>
                          <Row align='middle' className={`trans_bt trans_text ${!isSale && 'trans_pur'}`}>
                            <Col flex={24}>&nbsp;</Col>
                          </Row>
                        </Col>
                        <Col flex={4}>
                          <Row align='middle' className={`trans_text ${!isSale && 'trans_pur'}`}>
                            <Col flex={24}>호&nbsp;</Col>
                          </Row>
                          <Row align='middle' className={`trans_bt trans_text ${!isSale && 'trans_pur'}`}>
                            <Col flex={24}>&nbsp;</Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col flex={12} className={`trans_receiver ${!isSale && 'trans_pur'}`}>
                          <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`} >{t('transaction.supplier')}</Col>
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
                        <Col flex={12} className={`trans_receiver ${!isSale && 'trans_pur'}`}>
                          <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`} >{t('transaction.receiver')}</Col>
                          <Col flex='auto' align='strech' style={{borderRight: isSale ? '2px solid #ff0505' : '2px solid #0000ff'}}>
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
                      <div className={styles.billMidRow}>
                        <div className={classNames(styles.Date, styles.bdR)}>
                          <div className={classNames(styles.MidCell,{"trans_pur": !isSale})}>작성</div>
                          <div className={classNames(styles.MidCell,{"trans_pur": !isSale})}>년-월-일</div>
                          <div className={classNames(styles.MidCell,{"trans_pur": !isSale})}>2024-07-04</div>
                        </div>
                        <div className={classNames(styles.Price, styles.bdR)}>
                          <div className={classNames(styles.MidCell,{"trans_pur": !isSale})}>공급가액</div>
                          <div className={classNames(styles.Units)}>
                            <div className={classNames(styles.Unit3,styles.bdR, {"trans_pur":!isSale})}>공란수</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>백</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>십</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>억</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>천</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>백</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>십</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>만</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>천</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>백</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>십</div>
                            <div className={classNames(styles.Unit, {"trans_pur":!isSale})}>일</div>
                          </div>
                          <div className={classNames(styles.Units)}>
                            <div className={classNames(styles.Unit3,styles.bdR, {"trans_pur":!isSale})}>3</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>{''}</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>{''}</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>{''}</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>4</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>5</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                            <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                            <div className={classNames(styles.Unit, {"trans_pur":!isSale})}>0</div>
                          </div>
                        </div>
                        {isTaxBill &&
                          <div className={classNames(styles.Tax, styles.bdR)}>
                            <div className={classNames(styles.MidCell,{"trans_pur": !isSale})}>세 액</div>
                            <div className={classNames(styles.Units)}>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>십</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>억</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>천</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>백</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>십</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>만</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>천</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>백</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>십</div>
                              <div className={classNames(styles.Unit, {"trans_pur":!isSale})}>일</div>
                            </div>
                            <div className={classNames(styles.Units)}>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>{''}</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>{''}</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>4</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>5</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                              <div className={classNames(styles.Unit,styles.bdR, {"trans_pur":!isSale})}>0</div>
                              <div className={classNames(styles.Unit, {"trans_pur":!isSale})}>0</div>
                            </div>
                          </div>
                        }
                        <div className={styles.Note}>
                          <div className={classNames(styles.MidCell,{"trans_pur": !isSale})}>비고</div>
                          <div className={styles.Cell}>{''}</div>
                        </div>
                      </div>
                      <Row>
                        <Col flex='auto' className={classNames(styles.bdB,styles.bdR,styles.bdL)}>
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
                                onDoubleClick: (event) => {
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
                              합계 금액
                            </Col>
                          </Row>
                          <Row>
                            <Col flex='auto'
                              onClick={handleStartEditReceipt}
                              className={`trans_amt low right ${!isSale && "trans_pur"}`}
                            >
                              {ConvertCurrency(dataForTransaction.receipt, dataForTransaction.show_decimal)}
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={5}>
                          <Row>
                            <Col flex='auto' className="trans_amt_title right">
                              현 금
                            </Col>
                          </Row>
                          <Row>
                            <Col flex='auto' className={`trans_amt  low right ${!isSale && "trans_pur"}`}>
                              {ConvertCurrency(dataForTransaction.valance_final, dataForTransaction.show_decimal)}
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={5}>
                          <Row>
                            <Col flex='auto' className="trans_amt_title right">
                              수 표
                            </Col>
                          </Row>
                          <Row>
                            <Col flex='auto' className={`trans_amt  low right ${!isSale && "trans_pur"}`}>
                              {ConvertCurrency(dataForTransaction.valance_final, dataForTransaction.show_decimal)}
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={5}>
                          <Row>
                            <Col flex='auto' className="trans_amt_title right">
                              어 음
                            </Col>
                          </Row>
                          <Row>
                            <Col flex='auto' className={`trans_amt  low right ${!isSale && "trans_pur"}`}>
                              {ConvertCurrency(dataForTransaction.valance_final, dataForTransaction.show_decimal)}
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={5}>
                          <Row>
                            <Col flex='auto' className="trans_amt_title">
                              외상미수금
                            </Col>
                          </Row>
                          <Row>
                            <Col flex='auto' className={`trans_amt low ${!isSale && "trans_pur"}`}>
                              {ConvertCurrency(dataForTransaction.valance_final, dataForTransaction.show_decimal)}
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={5} className={`trans_br trans_bb trans_bl ${!isSale && "trans_pur"}`}>
                            <Row align='middle' justify='center'>
                              <Col>
                                이 금액을 청구함.
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
                    </div>
                  </form>
                </div>
                <div className="tab-pane show" id="tax-bill-print">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MessageModal
        title={message.title}
        message={message.message}
        open={isMessageModalOpen}
        handleOk={()=>setIsMessageModalOpen(false)}
      />
    </div>
  );
};

export default TransactionTaxBillModel;

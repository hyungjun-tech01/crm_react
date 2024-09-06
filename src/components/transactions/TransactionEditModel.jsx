import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import * as bootstrap from '../../assets/js/bootstrap.bundle';
import "antd/dist/reset.css";
import { Button, Checkbox, Col, Input, InputNumber, Row, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classNames from 'classnames';

import {
  atomCompanyState,
  atomCurrentCompany,
  atomCurrentTransaction,
  atomSelectedCategory,
  defaultCompany,
  defaultTransaction,
} from "../../atoms/atoms";
import { DefaultTransactionContent, TransactionRepo } from "../../repository/transaction";
import AddSearchItem from "../../constants/AddSearchItem";
import { ConvertCurrency, formatDate } from "../../constants/functions";
import TransactionContentModal from "./TransactionContentModal";
import TransactionReceiptModal from "./TransactionReceiptModal";
import MessageModal from "../../constants/MessageModal";
import TransactionPrint from "./TransactionPrint";

import styles from './TransactionEditModel.module.scss';

const default_transaction_data = {
  title: '',
  is_sale: true,
  vat_included: true,
  show_decimal: 0,
  valance_prev: 0,
  valance_final: 0,
  receiver: '',
  page_cur: 1,
  page_total: 1,
  page: '1p',
};

const default_receipt_data = {
  paid_money: 0,
  payment_type: '현금',
  bank_name: '',
  account_owner: '',
  account_number: '',
  card_no: '',
  card_number: '',
};

const TransactionEditModel = ({open, close, openTaxInvoice, setTaxInvoiceData, setTaxInvoiceContents}) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const [ isMessageModalOpen, setIsMessageModalOpen ] = useState(false);
  const [ message, setMessage ] = useState({title:'', message: ''});
  const [ isAdd, setIsAdd ] = useState(true);

  //===== [RecoilState] Related with Transaction =====================================
  const currentTransaction = useRecoilValue(atomCurrentTransaction);
  const { modifyTransaction } = useRecoilValue(TransactionRepo);


  //===== [RecoilState] Related with Company =========================================
  const companyState = useRecoilValue(atomCompanyState);
  const currentCompany = useRecoilValue(atomCurrentCompany);


  //===== Handles to edit 'TransactionEditModel' ======================================
  const [ disableItems, setDisableItems ] = useState(false);
  const [orgTransaction, setOrgTransaction] = useState({});
  const [transactionChange, setTransactionChange] = useState({});
  const [transactionContents, setTransactionContents] = useState([]);
  const [isSale, setIsSale] = useState(true);
  const [isVatIncluded, setIsVatIncluded] = useState(true);
  const [showDecimal, setShowDecimal] = useState(0);
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);
  const [selectData, setSelectData] = useState({});
  const [selectedCategory, setSelectedCategory] = useRecoilState(atomSelectedCategory);

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

    const tempSelect = {
      ...selectData,
      [name]: selected,
    };
    setSelectData(tempSelect);
  }, [transactionChange, selectData]);

  const handleCompanySelected = (data) => {
    setTransactionChange(data);
    setDisableItems(true);
};

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
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{ConvertCurrency(record.supply_price, dataForTransaction.show_decimal)}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: 'tax_price',
      render: (text, record) => <>{ConvertCurrency(record.tax_price, dataForTransaction.show_decimal)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{ConvertCurrency(record.total_price, dataForTransaction.show_decimal)}</>,
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
    
    return showDecimal === 0
      ? ret?.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : ret?.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }, [showDecimal]);

  const handleAmountCalculation = (data) => {
    let supply_price = 0, tax_price = 0, total_price = 0;
    data.forEach(item => {
      supply_price += item.supply_price;
      tax_price += item.tax_price;
      total_price += item.total_price;
    });
    let tempEdited = { ...transactionChange };
    if((!tempEdited['supply_price'] && currentTransaction.supply_price !== supply_price)
      || (tempEdited['supply_price'])) tempEdited['supply_price'] = supply_price;
    if((!tempEdited['tax_price'] && currentTransaction.tax_price !== tax_price)
      || (tempEdited['tax_price'])) tempEdited['tax_price'] = tax_price;
    if((!tempEdited['total_price'] && currentTransaction.total_price !== total_price)
      || (tempEdited['total_price'])) tempEdited['total_price'] = total_price;
    setTransactionChange(tempEdited);

    const valance_final = Number(dataForTransaction.valance_prev) + total_price - Number(currentTransaction.paid_money);
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
    console.log('add transaction');
    //if(!transactionChange['company_code']) return;
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
      ...dataForTransaction,
      title: `${t('common.item')} ${t('common.edit')}`,
    };
    setDataForTransaction(tempData);

    let trans_date = new Date();
    if(!!data.month_day){
      const splitted = data.month_day.split('.');
      trans_date.setMonth(splitted[0] - 1);
      trans_date.setDate(splitted[1]);
    };
    const contentData = {
      ...data,
      transaction_date: trans_date,
    };
    setOrgContentModalData(contentData);
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
    const monthDay = `${editedContentModalData.transaction_date.getMonth() -1}
      .${editedContentModalData.transaction_date.getDate()}`;

    setIsContentModalOpen(false);
    const tempContent = {
      ...orgContentModalData,
      ...editedContentModalData,
      month_day: monthDay,
      transaction_sub_index: transactionContents.length + 1,
      company_code: transactionChange.company_code,
      company_name: transactionChange.company_name,
      transaction_sub_type: dataForTransaction.transaction_type,
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
    };
    const tempSelect = {
      ...selectData,
      tax_type: e.target.value
    };
    setSelectData(tempSelect);
  };

  const handleStartEditReceipt = () => {
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

    let tempEdited = { ...transactionChange };
    if(currentTransaction.payment_type !== tempOrgData.payment_type){
      tempEdited['payment_type'] = tempOrgData.payment_type;
    };
    if(currentTransaction.paid_money !== tempOrgData.paid_money){
      tempEdited['paid_money'] = tempOrgData.paid_money;
    };
    if(currentTransaction.bank_name !== tempOrgData.bank_name){
      tempEdited['bank_name'] = tempOrgData.bank_name;
    };
    if(currentTransaction.account_owner !== tempOrgData.account_owner){
      tempEdited['account_owner'] = tempOrgData.account_owner;
    };
    if(currentTransaction.account_number !== tempOrgData.account_number){
      tempEdited['account_number'] = tempOrgData.account_number;
    };
    if(currentTransaction.card_name !== tempOrgData.card_name){
      tempEdited['card_name'] = tempOrgData.card_name;
    };
    if(currentTransaction.card_number !== tempOrgData.card_number){
      tempEdited['card_number'] = tempOrgData.card_number;
    };
    setTransactionChange(tempEdited);

    const temp_valance= Number(dataForTransaction.valance_prev) + Number(currentTransaction.total_price) - Number(tempOrgData.paid_money);
    let tempData={
      ...dataForTransaction,
      valance_final: temp_valance,
    };
    setDataForTransaction(tempData);
  };

  const handleReceiptModalCancel = () => {
    setIsReceiptModalOpen(false);
    setEditedReceiptModalData({});
  };

  //===== Handles for special actions =============================================
  const [transactionForPrint, setTransactionForPrint] = useState(null);
  const [contentsForPrint, setContentsForPrint] = useState(null);

  const handleInitialize = useCallback(() => {
    setIsAdd(true);
    setIsSale(true);
    setIsVatIncluded(true);
    setShowDecimal(0);
    setDataForTransaction({...default_transaction_data});
    setDisableItems(false);

    if((selectedCategory.category === 'company')
      && (currentCompany !== defaultCompany)
      && (selectedCategory.item_code === currentCompany.company_code))
    {
      setTransactionChange({
        company_code: currentCompany.company_code,
        company_name: currentCompany.company_name,
        ceo_name: currentCompany.ceo_name,
        company_address: currentCompany.company_address,
        business_type: currentCompany.business_type,
        business_item: currentCompany.business_item,
        business_registration_code: currentCompany.business_registration_code,
      });
    } else {
      setTransactionChange({});
    };
    setTransactionContents([]);
    setOrgReceiptModalData({...default_receipt_data});
    setEditedReceiptModalData({});
    // setCurrentTransaction(defaultTransaction);
    setSelectData({trans_type: trans_types[0], tax_type: 'vat_included', company_selection: null});
    setOrgTransaction({});
    setTransactionForPrint(null);
    setContentsForPrint(null);
    document.querySelector("#add_new_transaction_form").reset();
  }, [selectedCategory, currentCompany]);

  const handleShowPrint = () => {
    const tempTransactionData = {
      ...orgTransaction,
      ...transactionChange,
      ...dataForTransaction,
    };
    setTransactionForPrint(tempTransactionData);
    setContentsForPrint(transactionContents);
  };

  const handleShowInvoice = () => {
    // Making (Tax) Invoice data --------------------------------
    const tempTransactionData = {
      ...orgTransaction,
      ...transactionChange,
      ...dataForTransaction,
    };
    const tempTaxInvoiceData = {
      tax_invoice_code : null,
      publish_type : null,
      transaction_type : tempTransactionData.transaction_type,
      invoice_type : tempTransactionData.vat_included ? '세금계산서' : '계산서',
      index1 : null,
      index2 : null,
      receive_type : null,
      invoice_contents : null,
      //----- Company info --------------
      company_code : tempTransactionData.company_code,
      business_registration_code : tempTransactionData.business_registration_code,
      company_name : tempTransactionData.company_name,
      ceo_name : tempTransactionData.ceo_name,
      company_address : tempTransactionData.company_address,
      business_type : tempTransactionData.business_type,
      business_item : tempTransactionData.business_item,
      //----- Price info --------------
      supply_price : tempTransactionData.supply_price,
      tax_price : tempTransactionData.tax_price,
      total_price : tempTransactionData.total_price,
      cash_amount : 0,
      check_amount : 0,
      note_amount : 0,
      receivable_amount : 0,
      //----- Etc info --------------
      sequence_number: null,
      memo : '',
      summary : '',
      create_date : tempTransactionData.publish_date,
    };
    setTaxInvoiceData(tempTaxInvoiceData);

    // Making (Tax) Invoice Contents --------------------------------
    const tempInvoiceContents = transactionContents.map(item => {
      return {
        sub_index: item.transaction_sub_index,
        invoice_date: item.transaction_date,
        month_day: item.month_day,
        product_name: item.product_name,
        standard: item.standard,
        unit: item.unit,
        quantity: item.quantity,
        supply_price: item.supply_price,
        tax_price: item.tax_price,
        total_price: item.total_price,
        memo: item.memo,
      };
    });

    setTaxInvoiceContents(tempInvoiceContents);
    openTaxInvoice();

    // setTimeout(()=>{
    //     let myModal = new bootstrap.Modal(document.getElementById('edit_tax_invoice'), {
    //         keyboard: false
    //     });
    //     myModal.show();
    // }, 500);
  };

  const handleSaveTransaction = (value) => {
    let newTransactionData = {
      ...orgTransaction,
      ...transactionChange,
    };
    if (newTransactionData.company_name === null
      || newTransactionData.company_name === ''
      || newTransactionData.length === 0
      || newTransactionData.publish_date === null 
      || newTransactionData.publish_date === ''
    ) {
      setMessage({title: '*필수 입력 누락*', message: '업체 정보나 품목 정보나 발행일자가 누락되었습니다.'});
      setIsMessageModalOpen(true);
      return;
    };
    newTransactionData['transaction_contents']= JSON.stringify(transactionContents);
    newTransactionData['modify_user'] = cookies.myLationCrmUserId;

    if (isAdd){
      newTransactionData['transaction_title'] = transactionContents.at(0).product_name + ' 외';
      newTransactionData['action_type'] = 'ADD';
    } else {
      newTransactionData['action_type'] = 'UPDATE';
    }
    const resp = modifyTransaction(newTransactionData);
    resp.then((res) => {
      if(res.result){
        if(isAdd) {
          const updatedContents = transactionContents.map(item => ({
            ...item,
            transaction_code: res.code
          }));
          setTransactionContents(updatedContents);
        };

        let thisModal = bootstrap.Modal.getInstance('#edit_transaction');
        if(thisModal) thisModal.hide();

        if(value === 'Invoice'){
          handleShowInvoice();
          handleInitialize();
        } else {
          handleClose();  
        };
      }
      else {
        setMessage({title: '저장 중 오류', message: `오류가 발생하여 저장하지 못했습니다.`});
        setIsMessageModalOpen(true);
      };
    });
  };

  const handleIssueInvoice = () => {
    // Save this transactions -------------------------
    if(transactionChange && Object.keys(transactionChange).length > 0) {
      handleSaveTransaction('Invoice');
    } else {
      handleShowInvoice();
    };
  };

  const handleShowDecimal = (e) => {
    if(e.target.checked && showDecimal === 0) {
      setShowDecimal(4);
      const tempData = {...dataForTransaction, show_decimal: 4};
      setDataForTransaction(tempData);
    } else if(!e.target.checked && showDecimal !== 0) {
      setShowDecimal(0);
      const tempData = {...dataForTransaction, show_decimal: 0};
      setDataForTransaction(tempData);
    };
  };

  const handleClose = () => {
    if(selectedCategory.category && (selectedCategory.category === 'transaction')){
      setSelectedCategory({category: null, item_code: null});
    };
    handleInitialize();
    close();
  };

  //===== useEffect ==============================================================
  useEffect(() => {
    if(!open) return;
    
    if ((companyState & 1) === 0) return;
    
    // if (Object.keys(orgTransaction).length === 0) {
      
      if (currentTransaction === defaultTransaction) {
        console.log('[TransactionEditModel] Add New Transaction~');
        handleInitialize();
      } else {
        console.log('[TransactionEditModel] Modify Transaction~', currentTransaction);
        setIsAdd(false);
        const currentContents = JSON.parse(currentTransaction.transaction_contents);
        setTransactionContents(currentContents);
        
        const tempIsSale = !(currentTransaction.transaction_type === '매입' || currentTransaction.transaction_type === 'purchase');
        setIsSale(tempIsSale);

        const tempIsVatIncluded = currentTransaction.tax_price && currentTransaction.tax_price > 0;
        setIsVatIncluded(tempIsVatIncluded);

        const tempData = {
          trans_type: tempIsSale ? trans_types[0] : trans_types[1],
          tax_type: tempIsVatIncluded ? 'vat_included' : 'vat_excluded',
        };
        setSelectData(tempData);

        if(currentTransaction.paid_money > 0){
          const tempData = {
            ...dataForTransaction,
            valance_final: Number(currentTransaction.paid_money) - Number(currentTransaction.total_price),
          };
          setDataForTransaction(tempData);
        };
      };
  
      const tempTransaction = {
        ...currentTransaction,
        transaction_type: currentTransaction.transaction_type ? currentTransaction.transaction_type : '매출',
        publish_date: currentTransaction.publish_date ? new Date(currentTransaction.publish_date) : null,
      };
      setOrgTransaction(tempTransaction);

      const tempReceiptData = {
        paid_money: currentTransaction.paid_money,
        payment_type: currentTransaction.payment_type,
        bank_name: currentTransaction.bank_name,
        account_owner: currentTransaction.account_owner,
        account_number: currentTransaction.account_number,
        card_no: currentTransaction.card_no,
        card_number: currentTransaction.card_number,
      }
      setOrgReceiptModalData(tempReceiptData);
    // };
  }, [open, companyState, currentTransaction]);

  if(!open) return (
    <div>&nbsp;</div>
  );

  return (
    <div
      className="modal right fade"
      id="edit_transaction"
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
          onClick = {handleClose}
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
              onClick = {handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="task-infos">
              <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to="#transaction-details"
                    data-bs-toggle="tab"
                  >
                    {t('common.details')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#transaction-print"
                    data-bs-toggle="tab"
                    onClick={handleShowPrint}
                  >
                    {t('common.preview')}
                  </Link>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane show active" id="transaction-details">
                  <form className="forms-sampme" id="add_new_transaction_form">
                    <div className="card p-3">
                      <Row>
                        <div className={styles.upperLeft}>
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
                                    className={styles.select}
                                    value={selectData.trans_type}
                                    onChange={selected => handleSelectChange('transaction_type', selected)}
                                    options={trans_types}
                                  />
                                </Col>
                                <Col>{t('transaction.publish_date')} : </Col>
                              </Row>
                              <Row justify="start" style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                                <Col span={16}>
                                  <AddSearchItem
                                    category='transaction'
                                    name='company_name'
                                    defaultValue={orgTransaction.company_name}
                                    edited={transactionChange}
                                    setEdited={handleCompanySelected}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col flex={3}>
                              <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                                <Col>
                                  <DatePicker
                                    name="publish_date"
                                    selected={transactionChange['publish_date'] ? transactionChange['publish_date'] : orgTransaction.publish_date}
                                    onChange={(date) => handleDateChange('publish_date', date)}
                                    dateFormat="yyyy-MM-dd"
                                    className={styles.datePicker}
                                  />
                                </Col>
                              </Row>
                              <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                                <Col>
                                  <Button onClick={handleIssueInvoice} style={{ width: 150 }}>{t('transaction.issue')}</Button>
                                  <Button onClick={handleInitialize} style={{ width: 100 }}>{t('common.initialize')}</Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                        <div className={classNames(styles.upperRight, { 'trans_pur': !isSale })}>
                          <div className={classNames(styles.sm_title, styles.title_wrapper, {'trans_pur': !isSale })}>
                            <div>{isSale ? t('transaction.receiver') : t('transaction.supplier')}</div>
                          </div>
                          <div className={styles.upperItems}>
                            <div className={classNames(styles.rowItem, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.md_title, styles.title_wrapper, { 'trans_pur': !isSale })}>
                                <div>{t('transaction.register_no')}</div>
                              </div>
                              <div className={classNames(styles.rightCell, styles.title_wrapper)}>
                                <Input
                                  name='business_registration_code'
                                  value={transactionChange['business_registration_code']
                                    ? transactionChange['business_registration_code']
                                    : orgTransaction.business_registration_code}
                                  disabled={disableItems}
                                  onChange={handleItemChange}
                                />
                              </div>
                            </div>
                            <div className={classNames(styles.rowItem, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.md_title, styles.title_wrapper, { 'trans_pur': !isSale })}>
                                <div>{t('transaction.company_name')}</div>
                              </div>
                              <div className={classNames(styles.midCell, styles.title_wrapper)}>
                                <label>
                                  {transactionChange['company_name']
                                    ? transactionChange['company_name']
                                    : orgTransaction.company_name
                                  }
                                </label>
                              </div>
                              <div className={classNames(styles.sm_title, styles.title_wrapper, { 'trans_pur': !isSale })}>
                                <div>{t('common.name2')}</div>
                              </div>
                              <div className={classNames(styles.midCell, styles.title_wrapper)}>
                                <Input
                                  name='ceo_name'
                                  value={transactionChange['ceo_name'] ? transactionChange['ceo_name'] : orgTransaction.ceo_name}
                                  disabled={disableItems}
                                  onChange={handleItemChange}
                                />
                              </div>
                            </div>
                            <div className={classNames(styles.rowItem, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.md_title, styles.title_wrapper, { 'trans_pur': !isSale })}>
                                <div>{t('transaction.address')}</div>
                              </div>
                              <div className={classNames(styles.rightCell, styles.title_wrapper)}>
                                <Input
                                  name='company_address'
                                  value={transactionChange['company_address']
                                    ? transactionChange['company_address']
                                    : orgTransaction.company_address}
                                  disabled={disableItems}
                                  onChange={handleItemChange}
                                />
                              </div>
                            </div>
                            <div className={classNames(styles.rowItemLast, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.md_title, styles.title_wrapper, { 'trans_pur': !isSale })}>
                                <div>{t('company.business_type')}</div>
                              </div>
                              <div className={classNames(styles.midCell, styles.title_wrapper)}>
                                <Input
                                  name='business_type'
                                  value={transactionChange['business_type'] ? transactionChange['business_type'] : orgTransaction.business_type}
                                  disabled={disableItems}
                                  onChange={handleItemChange}
                                />
                              </div>
                              <div className={classNames(styles.sm_title, styles.title_wrapper, { 'trans_pur': !isSale })}>
                                <div>{t('company.business_item')}</div>
                              </div>
                              <div className={classNames(styles.midCell, styles.title_wrapper)}>
                                <Input
                                  name='business_item'
                                  value={transactionChange['business_item'] ? transactionChange['business_item'] : orgTransaction.business_item}
                                  disabled={disableItems}
                                  onChange={handleItemChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
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
                              name='tax_type'
                              onChange={handleVATChange}
                              value={selectData.tax_type}
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
                                onChange={(input)=>{
                                  const value = Number(input);
                                  if(isNaN(value)) return;
                                  const temp_paid_money = transactionChange['paid_money'] ? transactionChange.paid_money : currentTransaction.paid_money;
                                  const temp_valance_final = value + Number(currentTransaction.total_price) - Number(temp_paid_money);
                                  const temp={
                                    ...dataForTransaction,
                                    valance_prev: value,
                                    valance_final: temp_valance_final,
                                  };
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
                              {ConvertCurrency(transactionChange['paid_money'] !== undefined ? transactionChange['paid_money'] : currentTransaction.paid_money, dataForTransaction.show_decimal)}
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
                              {ConvertCurrency(transactionChange['supply_price'] !== undefined ? transactionChange['supply_price'] : currentTransaction.supply_price, dataForTransaction.show_decimal)}
                            </Col>
                          </Row>
                          <Row>
                            <Col flex='auto' className="trans_amt_title right">
                              {t('transaction.balance_total')}
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
                              {t('transaction.tax_price')}
                            </Col>
                          </Row>
                          <Row>
                            <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                              {ConvertCurrency(transactionChange['tax_price'] !== undefined ? transactionChange['tax_price'] : currentTransaction.tax_price, dataForTransaction.show_decimal)}
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
                              {ConvertCurrency(transactionChange['total_price'] ? transactionChange['total_price'] : currentTransaction.total_price, dataForTransaction.show_decimal)}
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
                        onClick={handleSaveTransaction}
                      >
                        {t('common.save')}
                      </button>
                      &nbsp;&nbsp;
                      <button
                        type="button"
                        className="btn btn-secondary btn-rounded"
                        data-bs-dismiss="modal"
                        onClick = {handleClose}
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="tab-pane show" id="transaction-print">
                  {transactionForPrint && 
                    <TransactionPrint data={transactionForPrint} contents={contentsForPrint}/>
                  }
                </div>
              </div>
            </div>
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
      <MessageModal
        title={message.title}
        message={message.message}
        open={isMessageModalOpen}
        handleOk={()=>setIsMessageModalOpen(false)}
      />
    </div>
  );
};

export default TransactionEditModel;

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "antd/dist/reset.css";
import { Button, Checkbox, Input, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classNames from 'classnames';
import * as bootstrap from '../../assets/js/bootstrap.bundle';

import {
  atomCompanyState,
  atomCompanyForSelection,
  atomCurrentTaxInvoice,
  defaultTaxInvoice,
} from "../../atoms/atoms";
import { DefaultTaxInvoiceContent, TaxInvoiceRepo } from "../../repository/tax_invoice";

import { ConvertCurrency } from "../../constants/functions";
import MessageModal from "../../constants/MessageModal";
import TransactionBillPrint from "../transactions/TransactionBillPrint";

import styles from './TaxInvoiceEditModel.module.scss';
import { company_info } from "../../repository/user";
import TaxInvoiceContentModal from "./TaxInvoiceContentModal";

const default_invoice_data = {
  transaction_type: '',
  invoice_type: '',
  vat_included:'',
  show_decimal: false,
  receive_type: '',

  index1:'',
  index2:'',
  serial_no:'',
  issue_date: null,
  memo: '',

  supply_price:0,
  tax_price:0,
  total_price:0,
  cash_amount:0,
  check_amount:0,
  note_amount:0,
  receivable_amount:0,

  supply_text:'',
  tax_text:'',
  vacant_count: 0,
};

const TaxInvoiceEditModel = ({open, close, data, contents}) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: '', message: '' });


  //===== [RecoilState] Related with Tax Invoice =====================================
  const currentTaxInvoice = useRecoilValue(atomCurrentTaxInvoice);
  const { modifyTaxInvoice } = useRecoilValue(TaxInvoiceRepo);


  //===== [RecoilState] Related with Company =========================================
  const companyState = useRecoilValue(atomCompanyState);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);


  //===== Handles to edit 'TaxInvoiceEditModel' ======================================
  const [receiver, setReceiver] = useState({});
  const [supplier, setSupplier] = useState({});
  const [dataForInvoice, setDataForInvoice] = useState({...default_invoice_data});
  const [taxInvoiceContents, setTaxInvoiceContents] = useState([]);
  const [isSale, setIsSale] = useState(true);
  const [isTaxInvoice, setIsTaxInvoice] = useState(true);
  const [selectValues, setSelectValue] = useState({})
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);

  const handleItemChange = useCallback((e) => {
    const modifiedData = {
      ...dataForInvoice,
      [e.target.name]: e.target.value,
    };
    setDataForInvoice(modifiedData);
  }, [dataForInvoice]);

  const handleDateChange = useCallback((name, date) => {
    const modifiedData = {
      ...dataForInvoice,
      [name]: date
    };
    console.log('[handleDateChange] : ', modifiedData);
    setDataForInvoice(modifiedData);
  }, [dataForInvoice]);

  const handleSelectChange = useCallback((name, selected) => {
    // set data for selection ------------------------------
    const tempSelectValues = {
      ...selectValues,
      [name]: selected,
    };
    setSelectValue(tempSelectValues);

    // set changed data ------------------------------------
    if (name === 'company_name') {
      if(isSale){
        setReceiver({
          company_code: selected.value.company_code,
          company_name: selected.value.company_name,
          company_address: selected.value.company_address,
          ceo_name: selected.value.ceo_name,
          business_type: selected.value.business_type,
          business_item: selected.value.business_item,
          business_registration_code: selected.value.business_registration_code,
        });
      } else {
        setSupplier({
          company_code: selected.value.company_code,
          company_name: selected.value.company_name,
          company_address: selected.value.company_address,
          ceo_name: selected.value.ceo_name,
          business_type: selected.value.business_type,
          business_item: selected.value.business_item,
          business_registration_code: selected.value.business_registration_code,
        });
      }
    } else {
      if (name === 'transaction_type') {
        console.log('handleSelectChange / transaction_type :', selected);
        if (selected.value === '매출') {
          setIsSale(true);
          if(supplier !== company_info) {
            setReceiver({...supplier});
            setSupplier(company_info);
          };
        } else {
          setIsSale(false);
          if(receiver !== company_info) {
            setSupplier({...receiver});
            setReceiver(company_info);
          };
        };
      } else if (name === 'invoice_type') {
        console.log('handleSelectChange / invoice_type :', selected);
        if (selected.value === '세금계산서') {
          setIsTaxInvoice(true);
        } else {
          setIsTaxInvoice(false);
        };
      };
      const modifiedData = {
        ...dataForInvoice,
        [name]: selected.value,
      };
      setDataForInvoice(modifiedData);
    };
  }, [dataForInvoice, isSale, receiver, selectValues, supplier]);

  const trans_types = [
    { value: '매출', label: t('company.deal_type_sales') },
    { value: '매입', label: t('company.deal_type_purchase') },
  ];
  const invoice_types = [
    { value: '세금계산서', label: t('transaction.tax_bill') },
    { value: '계산서', label: t('transaction.bill') },
  ];
  const receive_types = [
    { value: '청구', label: '청구' },
    { value: '영수', label: '영수' },
  ]


  // --- Functions / Variables dealing with contents -------------------------------
  const rowSelection = {
    selectedRowKeys: selectedContentRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selected :', selectedRowKeys);
      setSelectedContentRowKeys(selectedRowKeys);
    },
  };

  const default_columns = isTaxInvoice ? [
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
      title: t('common.quantity'),
      dataIndex: 'quantity',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{ConvertCurrency(record.supply_price, dataForInvoice.show_decimal && 4)}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: 'tax_price',
      render: (text, record) => <>{ConvertCurrency(record.tax_price, dataForInvoice.show_decimal && 4)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{ConvertCurrency(record.total_price, dataForInvoice.show_decimal && 4)}</>,
    },
    {
      title: t('common.note'),
      dataIndex: 'memo',
      render: (text, record) => <>{text}</>,
    },
  ] : [
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
      title: t('common.quantity'),
      dataIndex: 'quantity',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.unit_price'),
      dataIndex: 'unit_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForInvoice.show_decimal)}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForInvoice.show_decimal)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{ConvertCurrency(text, dataForInvoice.show_decimal)}</>,
    },
    {
      title: t('common.note'),
      dataIndex: 'memo',
      render: (text, record) => <>{text}</>,
    },
  ];


  //===== Handles to edit 'Contents' =================================================
  const [settingForContentModal, setSettingForContentModal] = useState({});
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [orgContentModalData, setOrgContentModalData] = useState({});
  const [editedContentModalData, setEditedContentModalData] = useState({});

  const handleFormatter = useCallback((value) => {
    if (value === undefined || value === null || value === '') return '';
    let ret = value;
    if (typeof value === 'string') {
      ret = Number(value);
      if (isNaN(ret)) return;
    };

    return dataForInvoice.show_decimal
      ? ret?.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      : ret?.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, [dataForInvoice.show_decimal]);

  const handleStartAddContent = () => {
    console.log('add transaction');
    const tempSetting = {
      title: t('quotation.add_content'),
    };

    setSettingForContentModal(tempSetting);
    setOrgContentModalData({
      ...DefaultTaxInvoiceContent,
      invoice_date: null,
    });
    setEditedContentModalData({});
    setIsContentModalOpen(true);
  };

  const handleStartEditContent = (data) => {
    const tempData = {
      title: `${t('common.item')} ${t('common.edit')}`,
    };
    let tempDate = new Date();
    if(!!data['month_day'] && typeof data.month_day === 'string') {
      const splitted = data.month_day.split('.');
      tempDate.setMonth(splitted[0] - 1);
      tempDate.setDate(splitted[1]);
    };

    setSettingForContentModal(tempData);
    setOrgContentModalData({...data, invoice_date: tempDate});
    setEditedContentModalData({});
    setIsContentModalOpen(true);
  };

  const handleContentModalOk = () => {
    if(!editedContentModalData['month_day']){
      const tempMsg = {title: '확인', message: '날짜 정보가 없습니다.'}
      setMessage(tempMsg);
      setIsMessageModalOpen(true);
      return;
    };
    
    setIsContentModalOpen(false);
    const tempContent = {
      ...orgContentModalData,
      ...editedContentModalData,
    };

    const tempContents = taxInvoiceContents.concat(tempContent);
    setTaxInvoiceContents(tempContents);
    setIsContentModalOpen(false);
    setOrgContentModalData({});
    setEditedContentModalData({});
  };

  const handleContentModalCancel = () => {
    setIsContentModalOpen(false);
    setEditedContentModalData({});
    setOrgContentModalData({});
    setSelectedContentRowKeys([]);
  };

  const handleContentDelete = () => {};
  
  const handleContentMoveUp = () => {
    if(selectedContentRowKeys.length === 0) return;
    selectedContentRowKeys.sort();
    
    let tempContents = null;
    let startIdx = 0;
    const selecteds = taxInvoiceContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) !== -1);
    const unselecteds = taxInvoiceContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) === -1);
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
    setTaxInvoiceContents(finalContents);

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
    const selecteds = taxInvoiceContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) !== -1);
    const unselecteds = taxInvoiceContents.filter(item => selectedContentRowKeys.indexOf(item.transaction_sub_index) === -1);
    const lastIdx = selectedContentRowKeys.at(-1);
    if(lastIdx === taxInvoiceContents.length){
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
    setTaxInvoiceContents(finalContents);

    let tempKeys = [];
    for(let i = 0; i<selecteds.length; i++){
      tempKeys.push(startIdx--);
    }
    setSelectedContentRowKeys(tempKeys);
  };

  //===== Handles for special actions =============================================
  const handleShowDecimal = (e) => {
    const tempData = {
      ...dataForInvoice,
      show_decimal: e.target.checked,
    };
    setDataForInvoice(tempData);
  };

  const handleInitialize = useCallback(() => {
    document.querySelector("#add_new_tax_invoice_form").reset();
  }, []);

  const handleSaveTaxInvoice = () => {
    let newTaxInvoice = {
      modify_user: cookies.myLationCrmUserId,
    };
    Object.keys(defaultTaxInvoice).forEach(item => {
      if((dataForInvoice[item] !== undefined) && (dataForInvoice[item] !== null)){
        newTaxInvoice[item] = dataForInvoice[item];
      };
      const companyData = isSale ? receiver : supplier;
      if((companyData[item] !== undefined) && (companyData[item] !== null)) {
        newTaxInvoice[item] = companyData[item];
      };
    });
    const updatedContents = taxInvoiceContents.map(item => {
      const newItem = {...item};
      delete newItem.index;
      return newItem;
    });
    newTaxInvoice['invoice_contents'] = JSON.stringify(updatedContents);
    if(currentTaxInvoice === defaultTaxInvoice) {
      newTaxInvoice['action_type'] = 'ADD';
    } else {
      newTaxInvoice['action_type'] = 'UPDATE';
    };

    // -------------------------------------------
    console.log('[TaxInvoiceEditModel] handleSaveTaxInvoice : ', newTaxInvoice);
    // -------------------------------------------

    const resp = modifyTaxInvoice(newTaxInvoice);
    resp.then((res) => {
      if(res.result){
        handleInitialize();
        let thisModal = bootstrap.Modal.getInstance('#edit_tax_invoice');
        if(thisModal) thisModal.hide();
      }
      else {
        setMessage({title: '저장 중 오류', message: `오류가 발생하여 저장하지 못했습니다. - ${res.message}`});
        setIsMessageModalOpen(true);
      };
    });
  };

  const handleClose = () => {
    handleInitialize();
    close();
  };

  //===== useEffect ==============================================================
  useEffect(() => {
    if(!open) return;

    if ((companyState & 1) === 1) {
      if(data) {
        console.log('[TaxInvoiceEditModel] called! :', data);
        
        // dataForInvoice ------------------------------
        const tempSelectValues = {
          transaction_type: data.transaction_type === '매출' ? trans_types[0] : trans_types[1],
          invoice_type: data.invoice_type === '세금계산서' ? invoice_types[0] : invoice_types[1],
          receive_type: receive_types[0],
          company_name: {label: data.company_name, value: data.company_name},
        };
        console.log('[TaxInvoiceEditModel] selectValues :', tempSelectValues);
        setSelectValue(tempSelectValues);

        // Text for Supply ------------------------------------
        let inputAmountText = '';
        let vacantCount = 0;

        const tempAmountText = typeof data.supply_price === 'number'
          ? data.supply_price.toString() : data.supply_price;
        const tempVacantCount = 11 - tempAmountText.length;

        if(tempVacantCount < 0){
          console.log('Too high value');
          vacantCount = 0;
          inputAmountText = tempAmountText.slice(-11);
        } else {
          vacantCount = tempVacantCount;
          for(let i=0; i < tempVacantCount; i++){
            inputAmountText += ' ';
          };
          inputAmountText += tempAmountText;
        };

        // Text for Tax ------------------------------------
        let intputTaxText = '';
        const tempTaxText = typeof data.tax_price === 'number'
          ? data.tax_price.toFixed().toString() : data.tax_price;
        if(tempTaxText.length > 10){
          intputTaxText = tempTaxText.slice(-10);
        } else {
          for(let i=0; i< 10-tempTaxText.length; i++){
            intputTaxText += ' ';
          };
          intputTaxText += tempTaxText;
        };

        const isCash = data.payment_type === '현금';

        let tempBillData = {
          ...default_invoice_data,
          transaction_type: data.transaction_type,
          invoice_type: data.invoice_type,
          show_decimal: false,
          receive_type: '청구',
          issue_date: data.publish_date,
          supply_price: data.supply_price,
          tax_price: data.tax_price,
          total_price: data.total_price,

          supply_text: inputAmountText,
          tax_text: intputTaxText,
          vacant_count: vacantCount,

          cash_amount: isCash ? data.paid_money: 0,
          check_amount: isCash ? 0 : data.paid_money,
        };

        setIsTaxInvoice(data.vat_included);
        // IsSale ------------------------------------
        if(data.transaction_type === '매출'){
          setIsSale(true);
          setSupplier(company_info);
          setReceiver({
            company_code: data.company_code,
            business_registration_code: data.business_registration_code,
            company_name: data.company_name,
            ceo_name: data.ceo_name,
            company_address: data.company_address,
            business_type: data.business_type,
            business_item: data.business_item,
          });
        } else {
          setIsSale(false);
          setSupplier({
            company_code: data.company_code,
            business_registration_code: data.business_registration_code,
            company_name: data.company_name,
            ceo_name: data.ceo_name,
            company_address: data.company_address,
            business_type: data.business_type,
            business_item: data.business_item,
          });
          setReceiver(company_info);
        };
        setDataForInvoice(tempBillData);
      } else {
        setDataForInvoice({...default_invoice_data});
      }
      // Copy contents into 'transaction contents' -------------------
      if(contents) {
        const modified = contents.map((item, index) => ({
          index: index,
          tax_invoice_code: null,
          month_day: item.month_day,
          product_name: item.product_name,
          standard: item.standard,
          quantity: item.quantity,
          supply_price: item.supply_price,
          tax_price: item.tax_price,
          total_price: item.total_price,
          memo: item.memo,
        }));
        setTaxInvoiceContents(modified);
      }
      else
        setTaxInvoiceContents([]);
    };

  }, [contents, data, companyState]);

  if(!open) return (
      <div>&nbsp;</div>
  );

  return (
    <div
      className="modal right fade"
      id="edit_tax_invoice"
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
                  <form className="forms-sampme" id="add_new_tax_invoice_form">
                    <div className="card p-3">
                      <div className={styles.billHeader}>
                        <div>{t('common.type2')} : </div>
                        <div className={styles.billTransType}>
                          <Select
                            className={styles.select}
                            defaultValue={selectValues.transaction_type}
                            value={selectValues.transaction_type}
                            onChange={selected => handleSelectChange('transaction_type', selected)}
                            options={trans_types}
                          />
                        </div>
                        <div>{t('transaction.bill_type')} : </div>
                        <div className={styles.billBillType}>
                          <Select
                            className={styles.select}
                            defaultValue={selectValues.invoice_type}
                            value={selectValues.invoice_type}
                            onChange={selected => handleSelectChange('invoice_type', selected)}
                            options={invoice_types}
                          />
                        </div>
                        <div style={{ paddingRight: '0.5rem' }}>
                          <Checkbox defaultValue={dataForInvoice.show_decimal} onChange={handleShowDecimal}/>
                        </div>
                        <div>{t('quotation.show_decimal')}</div>
                      </div>
                      <div className={classNames(styles.billRow, { 'trans_pur': !isSale })}>
                        <div className={classNames(styles.title, { 'trans_pur': !isSale })}>
                          <div>{isTaxInvoice ? t("transaction.tax_bill") : t("transaction.bill")}</div>
                        </div>
                        <div className={classNames(styles.billType, { 'trans_pur': !isSale })}>
                          <div>({isSale ? t("transaction.for_receiver") : t('transaction.for_supplier')})</div>
                        </div>
                        <div className={styles.headerIndex}>
                          <div className={styles.header}>
                            <div className={classNames(styles.first, styles.text, { 'trans_pur': !isSale })}>
                              <div>책 번 호</div>
                            </div>
                            <div className={classNames(styles.second, { 'trans_pur': !isSale })}>
                              <Input
                                className={styles.input}
                                name='index1'
                                defaultValue={dataForInvoice['index1']}
                                value={dataForInvoice['index1']}
                                onChange={handleItemChange}
                                style={{textAlign: 'end'}}
                              />
                              <div className={styles.text}><div>권</div></div>
                            </div>
                            <div className={classNames(styles.third, { 'trans_pur': !isSale })}>
                              <Input
                                className={styles.input}
                                defaultValue={dataForInvoice['index2']}
                                name='index2'
                                value={dataForInvoice['index2']}
                                onChange={handleItemChange}
                                style={{textAlign: 'end'}}
                              />
                              <div className={styles.text}><div>호</div></div>
                            </div>
                          </div>
                          <div className={styles.header}>
                            <div className={classNames(styles.first, styles.text, { 'trans_pur': !isSale })}>
                              <div>일련번호</div>
                            </div>
                            <div className={styles.fourth}>
                              <Input
                                className={styles.input}
                                name='serial_no'
                                value={dataForInvoice['serial_no']}
                                onChange={handleItemChange}
                                style={{textAlign: 'center'}}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={classNames(styles.billRow, { 'trans_pur': !isSale })}>
                        <div className={styles.Contractor}>
                          <div className={classNames(styles.subTitle, styles.text, { 'trans_pur': !isSale })} >
                            <div>{t('transaction.supplier')}</div>
                          </div>
                          <div className={styles.index} >
                            <div className={classNames(styles.cell, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.header, styles.text, { 'trans_pur': !isSale })}>
                                <div>{t('transaction.register_no')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur': !isSale })}>
                                {isSale ?
                                  <label className={styles.regNo}>{supplier.business_registration_code}</label>
                                  :
                                  <Input
                                    className={classNames(styles.input, styles.regNo)}
                                    defaultValue={supplier['business_registration_code']}
                                    name='business_registration_code'
                                    value={supplier['business_registration_code']}
                                    onChange={handleItemChange}
                                  />
                                }
                              </div>
                            </div>
                            <div className={classNames(styles.cell, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.header, styles.text, { 'trans_pur': !isSale })}>
                                <div>{t('transaction.company_name')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur': !isSale })}>
                                {isSale ?
                                  <label className={styles.textStart}>{supplier.company_name}</label>
                                  :
                                  <Select
                                    defaultValue={selectValues['company_name']}
                                    value={selectValues['company_name']}
                                    options={companyForSelection}
                                    onChange={selected => handleSelectChange('company_name', selected)}
                                  />
                                }
                              </div>
                              <div className={classNames(styles.subTitle, styles.text, { 'trans_pur': !isSale })}>
                                <div>{t('common.name2')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, styles.textStart, { 'trans_pur': !isSale })}>
                                {isSale ?
                                  <label>{supplier.ceo_name}</label>
                                  :
                                  <Input
                                    className={styles.input}
                                    name='ceo_name'
                                    value={supplier['ceo_name']}
                                    onChange={handleItemChange}
                                  />
                                }
                              </div>
                            </div>
                            <div className={classNames(styles.cell, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.header, styles.text, { 'trans_pur': !isSale })}>
                                <div>{t('transaction.address')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur': !isSale })}>
                                {isSale ?
                                  <label className={styles.textStart}>{supplier.company_address}</label>
                                  :
                                  <Input
                                    className={styles.input}
                                    name='company_address'
                                    value={supplier['company_address']}
                                    onChange={handleItemChange}
                                  />
                                }
                              </div>
                            </div>
                            <div className={classNames(styles.cellLast, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.header, styles.text, { 'trans_pur': !isSale })}>
                                <div>{t('company.business_type')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur': !isSale })}>
                                {isSale ?
                                  <label className={styles.textStart}>{supplier.business_type}</label>
                                  :
                                  <Input
                                    className={styles.input}
                                    name='business_type'
                                    value={supplier['business_type']}
                                    onChange={handleItemChange}
                                    style={{ color: 'black' }}
                                  />
                                }
                              </div>
                              <div className={classNames(styles.subTitle, styles.text, { 'trans_pur': !isSale })} >
                                <div>{t('company.business_item')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, styles.textStart, { 'trans_pur': !isSale })}>
                                {isSale ?
                                  <label>{supplier.business_item}</label>
                                  :
                                  <Input
                                    className={styles.input}
                                    name='business_item'
                                    value={supplier['business_item']}
                                    onChange={handleItemChange}
                                  />
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.Contractor}>
                          <div className={classNames(styles.subTitle, styles.text, { 'trans_pur': !isSale })} >
                            <div>{t('transaction.receiver')}</div>
                          </div>
                          <div className={styles.index}>
                            <div className={classNames(styles.cell, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.header, styles.text, { 'trans_pur_bd': !isSale })}>
                                <div>{t('transaction.register_no')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur_bd': !isSale })}>
                                {isSale ?
                                  <Input
                                    className={classNames(styles.input, styles.regNo)}
                                    name='business_registration_code'
                                    value={receiver['business_registration_code']}
                                    onChange={handleItemChange}
                                  />
                                  :
                                  <label className={styles.regNo}>{receiver.business_registration_code}</label>
                                }
                              </div>
                            </div>
                            <div className={classNames(styles.cell, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.header, styles.text, { 'trans_pur_bd': !isSale })}>
                                <div>{t('transaction.company_name')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur_bd': !isSale })}>
                                {isSale ?
                                  <Select
                                    defaultValue={selectValues['company_name']}
                                    value={selectValues['company_name']}
                                    options={companyForSelection}
                                    onChange={selected => handleSelectChange('company_name', selected)}
                                  />
                                  :
                                  <label className={styles.textStart}>{receiver.company_name}</label>
                                }
                              </div>
                              <div className={classNames(styles.subTitle, styles.text, { 'trans_pur_bd': !isSale })}>
                                <div>{t('common.name2')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur_bd': !isSale })}>
                                {isSale ?
                                  <Input
                                    className={styles.input}
                                    name='ceo_name'
                                    value={receiver['ceo_name']}
                                    onChange={handleItemChange}
                                  />
                                  :
                                  <label>{receiver.ceo_name}</label>
                                }
                              </div>
                            </div>
                            <div className={classNames(styles.cell, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.header, styles.text, { 'trans_pur_bd': !isSale })}>
                                <div>{t('transaction.address')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur_bd': !isSale })}>
                                {isSale ?
                                  <Input
                                    className={styles.input}
                                    name='company_address'
                                    value={receiver['company_address']}
                                    onChange={handleItemChange}
                                  />
                                  :
                                  <label className={styles.textStart}>{receiver.company_address}</label>
                                }
                              </div>
                            </div>
                            <div className={classNames(styles.cellLast, { 'trans_pur': !isSale })}>
                              <div className={classNames(styles.header, styles.text, { 'trans_pur_bd': !isSale })}>
                                <div>{t('company.business_type')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur_bd': !isSale })}>
                                {isSale ?
                                  <Input
                                    className={styles.input}
                                    name='business_type'
                                    value={receiver['business_type']}
                                    onChange={handleItemChange}
                                  />
                                  :
                                  <label className={styles.textStart}>{receiver.business_type}</label>
                                }
                              </div>
                              <div className={classNames(styles.subTitle, styles.text, { 'trans_pur_bd': !isSale })} >
                                <div>{t('company.business_item')}</div>
                              </div>
                              <div className={classNames(styles.content, styles.text, { 'trans_pur_bd': !isSale })}>
                                {isSale ?
                                  <Input
                                    className={styles.input}
                                    name='business_item'
                                    value={receiver['business_item']}
                                    onChange={handleItemChange}
                                  />
                                  :
                                  <label>{receiver.business_item}</label>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={classNames(styles.billRow, { 'trans_pur': !isSale })}>
                        <div className={classNames(styles.Date, { "trans_pur": !isSale })}>
                          <div className={classNames(styles.MidCell, { "trans_pur": !isSale })}>작성</div>
                          <div className={classNames(styles.MidCell, { "trans_pur": !isSale })}>년-월-일</div>
                          <div className={classNames(styles.MidCellLast, { "trans_pur": !isSale })}>
                            {/* {dataForInvoice.issue_date
                              ? dataForInvoice.issue_date.toLocaleDateString('ko-KR', {year:'numeric',month:'numeric',day:'numeric'})
                              : null} */}
                            <DatePicker
                              name="publish_date"
                              selected={dataForInvoice['issue_date']}
                              onChange={(date) => handleDateChange('issue_date', date)}
                              dateFormat="yyyy-MM-dd"
                              className="datePick"
                            />
                          </div>
                        </div>
                        <div className={classNames(styles.Price, { "trans_pur": !isSale })}>
                          <div className={classNames(styles.MidCell, { "trans_pur": !isSale })}>공급가액</div>
                          <div className={classNames(styles.Units, { "trans_pur": !isSale })}>
                            <div className={classNames(styles.Unit3, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>공란수</div>
                              <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.vacant_count}</div></div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>백</div>
                              <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(0)}</div></div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={classNames(styles.upper1, {"trans_pur": !isSale})}>십</div>
                              <div className={classNames(styles.lower1, {"trans_pur": !isSale})}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(1)}</div></div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>억</div>
                              <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(2)}</div></div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>천</div>
                              <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(3)}</div></div>
                              </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={classNames(styles.upper1, {"trans_pur": !isSale})}>백</div>
                              <div className={classNames(styles.lower1, {"trans_pur": !isSale})}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(4)}</div></div>
                              </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>십</div>
                              <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(5)}</div></div>
                              </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>만</div>
                              <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(6)}</div></div>
                              </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={classNames(styles.upper1, {"trans_pur": !isSale})}>천</div>
                              <div className={classNames(styles.lower1, {"trans_pur": !isSale})}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(7)}</div></div>
                              </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>백</div>
                              <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(8)}</div></div>
                              </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>십</div>
                              <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(9)}</div></div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper0}>원</div>
                              <div className={styles.lower0}><div style={{color:'black'}}>{dataForInvoice.supply_text.at(10)}</div></div>
                            </div>
                          </div>
                        </div>
                        {isTaxInvoice &&
                          <div className={classNames(styles.Tax, { "trans_pur": !isSale })}>
                            <div className={classNames(styles.MidCell, { "trans_pur": !isSale })}>세 액</div>
                            <div className={classNames(styles.Units, { "trans_pur": !isSale })}>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={classNames(styles.upper1, {"trans_pur": !isSale})}>십</div>
                                <div className={classNames(styles.lower1, {"trans_pur": !isSale})}>{dataForInvoice.tax_text.at(0)}</div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>억</div>
                                <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(1)}</div></div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>천</div>
                                <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(2)}</div></div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={classNames(styles.upper1, {"trans_pur": !isSale})}>백</div>
                                <div className={classNames(styles.lower1, {"trans_pur": !isSale})}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(3)}</div></div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>십</div>
                                <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(4)}</div></div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>만</div>
                                <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(5)}</div></div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={classNames(styles.upper1, {"trans_pur": !isSale})}>천</div>
                                <div className={classNames(styles.lower1, {"trans_pur": !isSale})}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(6)}</div></div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>백</div>
                                <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(7)}</div></div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>십</div>
                                <div className={styles.lower}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(8)}</div></div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper0}>원</div>
                                <div className={styles.lower0}><div style={{color:'black'}}>{dataForInvoice.tax_text.at(9)}</div></div>
                              </div>
                            </div>
                          </div>
                        }
                        <div className={styles.Note}>
                          <div className={classNames(styles.MidCell, { "trans_pur": !isSale })}>비고</div>
                          <div className={styles.Cell}>
                            <Input.TextArea
                              className={styles.inputTall}
                              name='memo'
                              row_no={2}
                              value={dataForInvoice['memo']}
                              onChange={handleItemChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={classNames(styles.billRowAdjustContent, { 'trans_pur': !isSale })}>
                        <Button onClick={handleStartAddContent}>{t('transaction.add_content')}</Button>
                        <Button onClick={handleContentDelete} disabled={selectedContentRowKeys.length === 0}>{t('transaction.remove_selects')}</Button>
                        <Button onClick={handleContentMoveUp} disabled={selectedContentRowKeys.length === 0}>{t('transaction.move_up')}</Button>
                        <Button onClick={handleContentMoveDown} disabled={selectedContentRowKeys.length === 0}>{t('transaction.move_down')}</Button>
                      </div>
                      <div className={classNames(styles.billRow, styles.table, { 'trans_pur': !isSale })}>
                        <Table
                          rowSelection={rowSelection}
                          pagination={{
                            total: taxInvoiceContents.length,
                            showTotal: ShowTotal,
                            showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            ItemRender: ItemRender,
                          }}
                          style={{ flex: 'auto', overflowX: "auto" }}
                          columns={default_columns}
                          bordered
                          dataSource={taxInvoiceContents}
                          onRow={(record, rowIndex) => {
                            return {
                              onClick: (event) => {
                                console.log('Double Click / Edit - ', record);
                                handleStartEditContent(record);
                              }, // click row
                            };
                          }}
                        />
                      </div>
                      <div className={classNames(styles.billRow, { 'trans_pur': !isSale })}>
                        <div className={classNames(styles.PriceParts, { 'trans_pur': !isSale })}>
                          <div className={styles.item}>
                            <div className={classNames(styles.header, styles.text)}>
                              <div>합계 금액</div>
                            </div>
                            <div className={classNames(styles.content, styles.text)}>
                              <div style={{textAlign:'end', paddingRight:'0.5rem'}}>{ConvertCurrency(dataForInvoice.total_price, dataForInvoice.show_decimal?4:0)}</div>
                            </div>
                          </div>
                          <div className={styles.item}>
                            <div className={classNames(styles.header, styles.text)}>
                              <div>현 금</div>
                            </div>
                            <div className={styles.content}>
                              <Input
                                className={styles.input}
                                name='cash_amount'
                                value={dataForInvoice['cash_amount']}
                                onChange={handleItemChange}
                                style={{textAlign: 'end'}}
                              />
                            </div>
                          </div>
                          <div className={styles.item}>
                            <div className={classNames(styles.header, styles.text)}>
                              <div>수 표</div>
                            </div>
                            <div className={styles.content}>
                              <Input
                                className={styles.input}
                                name='check_amount'
                                value={dataForInvoice['check_amount']}
                                onChange={handleItemChange}
                                style={{textAlign: 'end'}}
                              />
                            </div>
                          </div>
                          <div className={styles.item}>
                            <div className={classNames(styles.header, styles.text)}>
                              <div>어 음</div>
                            </div>
                            <div className={styles.content}>
                              <Input
                                className={styles.input}
                                name='note_amount'
                                value={dataForInvoice['note_amount']}
                                onChange={handleItemChange}
                                style={{textAlign: 'end'}}
                              />
                            </div>
                          </div>
                          <div className={styles.item}>
                            <div className={classNames(styles.headerLast, styles.text)}>
                              <div>외상미수금</div>
                            </div>
                            <div>
                              <Input
                                className={styles.input}
                                name='receivable_amount'
                                value={dataForInvoice['receivable_amount']}
                                onChange={handleItemChange}
                                style={{textAlign: 'end'}}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={classNames(styles.NoteParts, { 'trans_pur': !isSale })}>
                          <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center'}}>
                            <div className={styles.text}><div>이 금액을 </div></div>
                            <Select
                              value={selectValues.receive_type}
                              options={receive_types}
                              onChange={selected => handleSelectChange('receive_type', selected)}
                            />
                            <div className={styles.text}><div> 함.</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                        onClick={handleSaveTaxInvoice}
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
                <div className="tab-pane show" id="tax-bill-print">
                  <TransactionBillPrint billData={dataForInvoice} contents={contents}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TaxInvoiceContentModal
        setting={settingForContentModal}
        open={isContentModalOpen}
        original={orgContentModalData}
        edited={editedContentModalData}
        handleEdited={setEditedContentModalData}
        handleOk={handleContentModalOk}
        handleCancel={handleContentModalCancel}
      />
      <MessageModal
        title={message.title}
        message={message.message}
        open={isMessageModalOpen}
        handleOk={() => setIsMessageModalOpen(false)}
      />
    </div>
  );
};

export default TaxInvoiceEditModel;

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
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

import {
  atomCompanyState,
  atomCurrentCompany,
  atomCurrentTaxInvoice,
  defaultCompany,
  defaultTaxInvoice,
} from "../../atoms/atoms";
import { DefaultTaxInvoiceContent, TaxInvoiceRepo } from "../../repository/tax_invoice";
import { company_info } from "../../repository/user";
import { SettingsRepo } from "../../repository/settings";

import TaxInvoiceContentModal from "./TaxInvoiceContentModal";
import TaxInvoicePrint from "./TaxInvoicePrint";

import { ConvertCurrency } from "../../constants/functions";
import MessageModal from "../../constants/MessageModal";
import SelectListModal from "../../constants/SelectListModal";

import { FiSearch } from "react-icons/fi";
import styles from './TaxInvoiceEditModel.module.scss';

const default_invoice_data = {
  transaction_type: '',
  invoice_type: '',
  vat_included: '',
  show_decimal: false,
  receive_type: '',

  index1: '',
  index2: '',
  serial_no: '',
  issue_date: null,
  memo: '',

  supply_price: 0,
  tax_price: 0,
  total_price: 0,
  cash_amount: 0,
  check_amount: 0,
  note_amount: 0,
  receivable_amount: 0,

  supply_text: '',
  tax_text: '',
  vacant_count: 0,
};

const TaxInvoiceEditModel = ({ init, handleInit, data, contents }) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: '', message: '' });


  //===== [RecoilState] Related with Tax Invoice =====================================
  const currentTaxInvoice = useRecoilValue(atomCurrentTaxInvoice);
  const { modifyTaxInvoice } = useRecoilValue(TaxInvoiceRepo);


  //===== [RecoilState] Related with Company =========================================
  const companyState = useRecoilValue(atomCompanyState);
  const currentCompany = useRecoilValue(atomCurrentCompany);


  //===== [RecoilState] Related with Company =========================================
  const { openModal, closeModal } = useRecoilValue(SettingsRepo);


  //===== Handles to edit 'TaxInvoiceEditModel' ======================================
  const [receiver, setReceiver] = useState({});
  const [supplier, setSupplier] = useState({});
  const [invoiceData, setInvoiceData] = useState({ ...default_invoice_data });
  const [invoiceChange, setInvoiceChange] = useState({});
  const [invoiceContents, setInvoiceContents] = useState([]);
  const [printData, setPrintData] = useState({})
  const [isSale, setIsSale] = useState(true);
  const [isTaxInvoice, setIsTaxInvoice] = useState(true);
  const [selectValues, setSelectValue] = useState({})
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const handleItemChange = useCallback((e) => {
    const modifiedData = {
      ...invoiceChange,
      [e.target.name]: e.target.value,
    };
    setInvoiceChange(modifiedData);
  }, [invoiceChange]);

  const handleDateChange = useCallback((name, date) => {
    const modifiedData = {
      ...invoiceChange,
      [name]: date
    };
    setInvoiceChange(modifiedData);
  }, [invoiceChange]);

  const handleSelectChange = useCallback((name, selected) => {
    // set data for selection ------------------------------
    const tempSelectValues = {
      ...selectValues,
      [name]: selected,
    };
    setSelectValue(tempSelectValues);

    // set changed data ------------------------------------
    if (name === 'transaction_type') {
      if (selected.value === '매출') {
        setIsSale(true);
        if (supplier !== company_info) {
          setReceiver({ ...supplier });
          setSupplier(company_info);
        };
      } else {
        setIsSale(false);
        if (receiver !== company_info) {
          setSupplier({ ...receiver });
          setReceiver(company_info);
        };
      };
    } else if (name === 'invoice_type') {
      if (selected.value === '세금계산서') {
        setIsTaxInvoice(true);
      } else {
        setIsTaxInvoice(false);
      };
    };
    const modifiedData = {
      ...invoiceChange,
      [name]: selected.value,
    };
    setInvoiceChange(modifiedData);
  }, [invoiceChange, isSale, receiver, selectValues, supplier]);

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
      render: (text, record) => <>{ConvertCurrency(record.supply_price, invoiceData.show_decimal && 4)}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: 'tax_price',
      render: (text, record) => <>{ConvertCurrency(record.tax_price, invoiceData.show_decimal && 4)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{ConvertCurrency(record.total_price, invoiceData.show_decimal && 4)}</>,
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
      render: (text, record) => <>{ConvertCurrency(text, invoiceData.show_decimal)}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{ConvertCurrency(text, invoiceData.show_decimal)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{ConvertCurrency(text, invoiceData.show_decimal)}</>,
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

  const handleAmountCalculation = (data) => {
    let supply_price = 0, tax_price = 0, total_price = 0;
    data.forEach(item => {
      supply_price += item.supply_price;
      tax_price += item.tax_price;
      total_price += item.total_price;
    });
    let tempEdited = { ...invoiceChange };
    if ((!tempEdited['supply_price'] && invoiceData.supply_price !== supply_price)
      || (!!tempEdited['supply_price'])) tempEdited['supply_price'] = supply_price;
    if ((!tempEdited['tax_price'] && invoiceData.tax_price !== tax_price)
      || (!!tempEdited['tax_price'])) tempEdited['tax_price'] = tax_price;
    if ((!tempEdited['total_price'] && invoiceData.total_price !== total_price)
      || (!!tempEdited['total_price'])) tempEdited['total_price'] = total_price;

    const textValues = handleShowNumbers(supply_price, tax_price);
    setInvoiceChange({
      ...tempEdited,
      ...textValues,
    });
  };

  const handleStartAddContent = () => {
    console.log('add transaction');
    const tempSetting = {
      title: t('quotation.add_content'),
      vat_included: isTaxInvoice,
    };

    setSettingForContentModal(tempSetting);
    setOrgContentModalData({
      ...DefaultTaxInvoiceContent,
      sub_index: invoiceContents.length,
    });

    openModal('antModal');
    setEditedContentModalData({});
    setIsContentModalOpen(true);
  };

  const handleStartEditContent = (data) => {
    const tempData = {
      title: `${t('common.item')} ${t('common.edit')}`,
      vat_included: isTaxInvoice,
    };
    let tempDate = new Date();
    if (!!data['month_day'] && typeof data.month_day === 'string') {
      const splitted = data.month_day.split('.');
      tempDate.setMonth(splitted[0] - 1);
      tempDate.setDate(splitted[1]);
    };

    openModal('antModal');
    setSettingForContentModal(tempData);
    setOrgContentModalData({ ...data, invoice_date: tempDate });
    setEditedContentModalData({});
    setIsContentModalOpen(true);
  };

  const handleContentModalOk = () => {
    if (!orgContentModalData['invoice_date'] && !editedContentModalData['invoice_date']) {
      const contents = (
        <>
          <p>{t('comment.msg_no_necessary_data')}</p>
          <div> - 날짜</div>
        </>
      );
      const tempMsg = {
        title: t('comment.title_check'),
        message: contents,
      };
      handleOpenMessage(tempMsg);
      return;
    };
    let tempMonthDay = null;
    const editedMonthDay = editedContentModalData['invoice_date'];
    if (!!editedMonthDay) {
      tempMonthDay = `${editedMonthDay.getMonth() + 1}.${editedMonthDay.getDate()}`;
    } else {
      tempMonthDay = orgContentModalData['month_day'];
    };

    const tempContent = {
      ...orgContentModalData,
      ...editedContentModalData,
      month_day: tempMonthDay,
    };
    const foundIdx = invoiceContents.findIndex(item => item.sub_index === tempContent.sub_index);
    if (foundIdx === -1) {
      const tempContents = invoiceContents.concat(tempContent);
      setInvoiceContents(tempContents);
      handleAmountCalculation(tempContents);
    } else {
      const tempContents = [
        ...invoiceContents.slice(0, foundIdx),
        tempContent,
        ...invoiceContents.slice(foundIdx + 1,),
      ];
      setInvoiceContents(tempContents);
      handleAmountCalculation(tempContents);
    };

    closeModal();
    setIsContentModalOpen(false);
    setOrgContentModalData({});
    setEditedContentModalData({});
    setSelectedContentRowKeys([]);
  };

  const handleContentModalCancel = () => {
    closeModal();
    setIsContentModalOpen(false);
    setEditedContentModalData({});
    setOrgContentModalData({});
    setSelectedContentRowKeys([]);
  };

  const handleContentDelete = () => {
    if (selectedContentRowKeys.length === 0) return;
    const tempContents = invoiceContents.filter(item => selectedContentRowKeys.indexOf(item.sub_index) === -1);
    setInvoiceContents(tempContents);
    handleAmountCalculation(tempContents);
    setSelectedContentRowKeys([]);
  };

  const handleContentMoveUp = () => {
    if (selectedContentRowKeys.length === 0) return;
    selectedContentRowKeys.sort();

    let tempContents = null;
    let startIdx = 0;
    const selecteds = invoiceContents.filter(item => selectedContentRowKeys.indexOf(item.sub_index) !== -1);
    const unselecteds = invoiceContents.filter(item => selectedContentRowKeys.indexOf(item.sub_index) === -1);
    const firstIdx = selectedContentRowKeys[0];
    if (firstIdx === 1) {
      tempContents = [
        ...selecteds,
        ...unselecteds,
      ];
      startIdx = 1;
    } else {
      tempContents = [
        ...unselecteds.slice(0, firstIdx - 2),
        ...selecteds,
        ...unselecteds.slice(firstIdx - 2,),
      ];
      startIdx = firstIdx - 1;
    };
    const finalContents = tempContents.map((item, index) => {
      const temp3 = {
        ...item,
        sub_index: index + 1,
      };
      return temp3;
    });
    setInvoiceContents(finalContents);

    let tempKeys = [];
    for (let i = 0; i < selecteds.length; i++, startIdx++) {
      tempKeys.push(startIdx);
    }
    setSelectedContentRowKeys(tempKeys);
    setShowSaveButton(true);
  };

  const handleContentMoveDown = () => {
    if (selectedContentRowKeys.length === 0) return;
    selectedContentRowKeys.sort();

    let tempContents = null;
    let startIdx = 0;
    const selecteds = invoiceContents.filter(item => selectedContentRowKeys.indexOf(item.sub_index) !== -1);
    const unselecteds = invoiceContents.filter(item => selectedContentRowKeys.indexOf(item.sub_index) === -1);
    const lastIdx = selectedContentRowKeys.at(-1);
    if (lastIdx === invoiceContents.length) {
      tempContents = [
        ...unselecteds,
        ...selecteds,
      ];
      startIdx = lastIdx;
    } else {
      tempContents = [
        ...unselecteds.slice(0, lastIdx),
        ...selecteds,
        ...unselecteds.slice(lastIdx,),
      ];
      startIdx = lastIdx + 1;
    };
    const finalContents = tempContents.map((item, index) => {
      const temp3 = {
        ...item,
        sub_index: index + 1,
      };
      return temp3;
    });
    setInvoiceContents(finalContents);

    let tempKeys = [];
    for (let i = 0; i < selecteds.length; i++) {
      tempKeys.push(startIdx--);
    }
    setSelectedContentRowKeys(tempKeys);
    setShowSaveButton(true);
  };


  //===== Handles to edit 'Company' =================================================
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSelectCompany = (data) => {
    console.log('handleSelectCompany', data);
    if (isSale) {
      setReceiver({
        company_code: data.company_code,
        company_name: data.company_name,
        company_address: data.company_address,
        ceo_name: data.ceo_name,
        business_type: data.business_type,
        business_item: data.business_item,
        business_registration_code: data.business_registration_code,
      });
    } else {
      setSupplier({
        company_code: data.company_code,
        company_name: data.company_name,
        company_address: data.company_address,
        ceo_name: data.ceo_name,
        business_type: data.business_type,
        business_item: data.business_item,
        business_registration_code: data.business_registration_code,
      });
    };
  };


  //===== Handles for special actions =============================================
  const handleShowDecimal = (e) => {
    const tempData = {
      ...invoiceData,
      show_decimal: e.target.checked,
    };
    setInvoiceData(tempData);
  };

  const handleShowNumbers = (supply_price, tax_price) => {
    // Text for Supply ------------------------------------
    let inputAmountText = '';
    let vacantCount = 0;

    const tempAmountText = typeof supply_price === 'number'
      ? supply_price.toString() : supply_price;
    const tempVacantCount = 11 - tempAmountText.length;

    if (tempVacantCount < 0) {
      console.log('Too high value');
      vacantCount = 0;
      inputAmountText = tempAmountText.slice(-11);
    } else {
      vacantCount = tempVacantCount;
      for (let i = 0; i < tempVacantCount; i++) {
        inputAmountText += ' ';
      };
      inputAmountText += tempAmountText;
    };

    // Text for Tax ------------------------------------
    let intputTaxText = '';
    const tempTaxText = typeof tax_price === 'number'
      ? tax_price.toFixed().toString() : tax_price;
    if (tempTaxText.length > 10) {
      intputTaxText = tempTaxText.slice(-10);
    } else {
      for (let i = 0; i < 10 - tempTaxText.length; i++) {
        intputTaxText += ' ';
      };
      intputTaxText += tempTaxText;
    };

    return {
      supply_text: inputAmountText,
      tax_text: intputTaxText,
      vacant_count: vacantCount,
    };
  };

  //===== Handles to handle this =================================================
  const handleOpenMessage = (msg) => {
    openModal('antModal');
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessage = () => {
    closeModal();
    setIsMessageModalOpen(false);
  };

  const handleInitialize = useCallback(() => {
    // document.querySelector("#add_new_tax_invoice_form").reset();
    setInvoiceData({ ...default_invoice_data });
    setInvoiceChange({});
    setInvoiceContents([]);
    setPrintData({});
    setIsSale(true);
    setIsTaxInvoice(true);
    setSelectValue({});
    setShowSaveButton(false);
    setSettingForContentModal({});
    setOrgContentModalData({});
    setEditedContentModalData({});
  }, []);


  const handleSaveTaxInvoice = () => {
    const finalData = {
      ...invoiceData,
      ...invoiceChange,
    };

    let newTaxInvoice = {
      modify_user: cookies.myLationCrmUserId,
    };

    Object.keys(defaultTaxInvoice).forEach(item => {
      if ((finalData[item] !== undefined) && (finalData[item] !== null)) {
        newTaxInvoice[item] = finalData[item];
      };
      const companyData = isSale ? receiver : supplier;
      if ((companyData[item] !== undefined) && (companyData[item] !== null)) {
        newTaxInvoice[item] = companyData[item];
      };
    });

    // Check data if they are available -----------------------------------
    let numberOfNoInputItems = 0;
    let noCompanyCode = false;
    if (!newTaxInvoice.company_code || newTaxInvoice.company_code === "") {
      numberOfNoInputItems++;
      noCompanyCode = true;
    };
    let noCreateDate = false;
    if (!newTaxInvoice.create_date || newTaxInvoice.create_date === "") {
      numberOfNoInputItems++;
      noCreateDate = true;
    };
    let noInvoiceContents = false;
    if (invoiceContents.length === 0) {
      numberOfNoInputItems++;
      noInvoiceContents = true;
    };

    if (numberOfNoInputItems > 0) {
      const contents = (
        <>
          <p>{t('comment.msg_no_necessary_data')}</p>
          {noCompanyCode && <div> - 회사 이름</div>}
          {noCreateDate && <div> - 작성일</div>}
          {noInvoiceContents && <div> - 세금계산서 항목</div>}
        </>
      );
      const tempMsg = {
        title: t('comment.title_check'),
        message: contents,
      };
      handleOpenMessage(tempMsg);
      return;
    };

    const updatedContents = invoiceContents.map(item => {
      const newItem = { ...item };
      delete newItem.sub_index;
      delete newItem.invoice_date;
      return newItem;
    });

    newTaxInvoice['invoice_contents'] = JSON.stringify(updatedContents);
    if (currentTaxInvoice === defaultTaxInvoice) {
      newTaxInvoice['action_type'] = 'ADD';
    } else {
      newTaxInvoice['action_type'] = 'UPDATE';
    };

    const resp = modifyTaxInvoice(newTaxInvoice);
    resp.then((res) => {
      if (res.result) {
        handleClose();
      } else {
        const tempMsg = {
          title: t('comment.title_error'),
          message: `${t('comment.msg_fail_save')} - ${t('comment.reason')} : ${res.data}`,
        };
        handleOpenMessage(tempMsg);
      };
    });
  };

  const handleClose = () => {
    setTimeout(() => {
      closeModal();
    }, 250);
  };

  //===== useEffect functions =============================================== 
  useEffect(() => {
    if (!init) return;

    if (handleInit) handleInit(false);
    handleInitialize();

    if ((companyState & 1) === 1) {
      let inputData = null;
      if (!!data) {
        inputData = data;
        setShowSaveButton(true);
      } else {
        if (currentTaxInvoice !== defaultTaxInvoice) {
          inputData = { ...currentTaxInvoice };
          setShowSaveButton(false);
        } else {
          if (currentCompany !== defaultCompany) {
            setShowSaveButton(true);
            inputData = {
              ...default_invoice_data,
              ...defaultTaxInvoice,
              create_date: new Date(),
              transaction_type: '매출',  // default
              invoice_type: '세금계산서', // default
              payment_type: '현금', //default
              supply_price: 0,
              tax_price: 0,
              company_code: currentCompany.company_code,
              business_registration_code: currentCompany.business_registration_code,
              company_name: currentCompany.company_name,
              ceo_name: currentCompany.ceo_name,
              company_address: currentCompany.company_address,
              business_type: currentCompany.business_type,
              business_item: currentCompany.business_item,
            }
          } else {
            setShowSaveButton(false);
          };
        }
      };

      if (!!inputData && Object.keys(inputData).length > 0) {
        // invoiceData ------------------------------
        const tempSelectValues = {
          transaction_type: inputData.transaction_type === '매출' ? trans_types[0] : trans_types[1],
          invoice_type: inputData.invoice_type === '세금계산서' ? invoice_types[0] : invoice_types[1],
          receive_type: receive_types[0],
        };
        setSelectValue(tempSelectValues);

        const isCash = inputData.payment_type === '현금';
        const textValues = handleShowNumbers(inputData.supply_price, inputData.tax_price);

        let tempInvoiceData = {
          ...inputData,
          show_decimal: false,
          create_date: new Date(inputData.create_date),

          cash_amount: inputData['cash_amount']
            ? inputData.cash_amount
            : (isCash && inputData['paid_money'] ? inputData.paid_money : 0),
          check_amount: inputData['check_amount']
            ? inputData.check_amount
            : (isCash && inputData['paid_money'] ? 0 : inputData.paid_money),
          ...textValues
        };

        setIsTaxInvoice(inputData['vat_included']
          ? inputData.vat_included
          : (inputData.invoice_type === '세금계산서')
        );
        // IsSale ------------------------------------
        if (inputData.transaction_type === '매출') {
          setIsSale(true);
          setSupplier(company_info);
          setReceiver({
            company_code: inputData.company_code,
            business_registration_code: inputData.business_registration_code,
            company_name: inputData.company_name,
            ceo_name: inputData.ceo_name,
            company_address: inputData.company_address,
            business_type: inputData.business_type,
            business_item: inputData.business_item,
          });
        } else {
          setIsSale(false);
          setSupplier({
            company_code: inputData.company_code,
            business_registration_code: inputData.business_registration_code,
            company_name: inputData.company_name,
            ceo_name: inputData.ceo_name,
            company_address: inputData.company_address,
            business_type: inputData.business_type,
            business_item: inputData.business_item,
          });
          setReceiver(company_info);
        };
        setInvoiceData(tempInvoiceData);
      } else {
        setReceiver({});
        setSupplier({});
        const tempInvoiceData = {
          ...default_invoice_data,
          ...defaultTaxInvoice,
        };
        setInvoiceData(tempInvoiceData);
      };
      // Copy contents into 'transaction contents' -------------------
      if (!!contents && contents.length > 0) {
        setInvoiceContents(contents);
      } else {
        if (currentTaxInvoice !== defaultTaxInvoice) {
          const dataContents = JSON.parse(currentTaxInvoice.invoice_contents);
          const tempContents = dataContents.map((item, index) => {
            const tempDate = new Date();
            const splitted = item.month_day.split('.');
            tempDate.setMonth(splitted.at(0) - 1);
            tempDate.setDate(splitted.at(1));
            return {
              ...item,
              invoice_date: tempDate,
              sub_index: index,
            }
          });
          setInvoiceContents(tempContents);
        } else {
          setInvoiceContents([]);
        }
      }
      setInvoiceChange({});
    };
  }, [contents, data, companyState, init, currentTaxInvoice, currentCompany]);

  useEffect(() => {
    // 모달 내부 페이지의 히스토리 상태 추가
    history.pushState({ modalInternal: true }, '', location.href);

    const handlePopState = (event) => {
        if (event.state && event.state.modalInternal) {
        // 뒤로 가기를 방지하기 위해 다시 히스토리를 푸시
        history.pushState({ modalInternal: true }, '', location.href);
        }
    };

    // popstate 이벤트 리스너 추가 (중복 추가 방지)
    window.addEventListener('popstate', handlePopState);
  }, []);


  return (
    <div
      className="modal right fade"
      id="edit_tax_invoice"
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
              onClick={handleClose}
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
                    onClick={() => setPrintData({ ...invoiceData, ...invoiceChange })}
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
                          <Checkbox defaultValue={invoiceData.show_decimal} onChange={handleShowDecimal} />
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
                                defaultValue={invoiceData['index1']}
                                value={invoiceChange['index1'] ? invoiceChange.index1 : invoiceData.index1}
                                onChange={handleItemChange}
                                style={{ textAlign: 'end' }}
                              />
                              <div className={styles.text}><div>권</div></div>
                            </div>
                            <div className={classNames(styles.third, { 'trans_pur': !isSale })}>
                              <Input
                                className={styles.input}
                                defaultValue={invoiceData['index2']}
                                name='index2'
                                value={invoiceChange['index2'] ? invoiceChange.index2 : invoiceData.index2}
                                onChange={handleItemChange}
                                style={{ textAlign: 'end' }}
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
                                name='sequence_number'
                                value={invoiceChange['sequence_number'] ? invoiceChange.sequence_number : invoiceData.sequence_number}
                                onChange={handleItemChange}
                                style={{ textAlign: 'center' }}
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
                                  <div className={styles.searchWarpper}>
                                    <label className={styles.textStart}>{supplier.company_name}</label>
                                    <div className={styles.searchIcon}
                                      onClick={() => { setIsPopupOpen(!isPopupOpen); openModal('antModal'); }}
                                    >
                                      <FiSearch />
                                    </div>
                                  </div>
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
                                  <div className={styles.searchWarpper}>
                                    <label className={styles.textStart}>{receiver.company_name}</label>
                                    <div className={styles.searchIcon}
                                      onClick={() => { setIsPopupOpen(!isPopupOpen); openModal('antModal') }}
                                    >
                                      <FiSearch />
                                    </div>
                                  </div>
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
                            {/* {invoiceData.issue_date
                              ? invoiceData.issue_date.toLocaleDateString('ko-KR', {year:'numeric',month:'numeric',day:'numeric'})
                              : null} */}
                            <DatePicker
                              name="create_date"
                              selected={invoiceChange['create_date'] ? invoiceChange.create_date : invoiceData.create_date}
                              onChange={(date) => handleDateChange('create_date', date)}
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
                              <div className={styles.lower}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['vacant_count'] ? invoiceChange.vacant_count : invoiceData.vacant_count}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>백</div>
                              <div className={styles.lower}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(0) : invoiceData.supply_text.at(0)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={classNames(styles.upper1, { "trans_pur": !isSale })}>십</div>
                              <div className={classNames(styles.lower1, { "trans_pur": !isSale })}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(1) : invoiceData.supply_text.at(1)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>억</div>
                              <div className={styles.lower}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(2) : invoiceData.supply_text.at(2)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>천</div>
                              <div className={styles.lower}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(3) : invoiceData.supply_text.at(3)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={classNames(styles.upper1, { "trans_pur": !isSale })}>백</div>
                              <div className={classNames(styles.lower1, { "trans_pur": !isSale })}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(4) : invoiceData.supply_text.at(4)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>십</div>
                              <div className={styles.lower}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(5) : invoiceData.supply_text.at(5)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>만</div>
                              <div className={styles.lower}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(6) : invoiceData.supply_text.at(6)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={classNames(styles.upper1, { "trans_pur": !isSale })}>천</div>
                              <div className={classNames(styles.lower1, { "trans_pur": !isSale })}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(7) : invoiceData.supply_text.at(7)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>백</div>
                              <div className={styles.lower}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(8) : invoiceData.supply_text.at(8)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper}>십</div>
                              <div className={styles.lower}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(9) : invoiceData.supply_text.at(9)}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                              <div className={styles.upper0}>원</div>
                              <div className={styles.lower0}>
                                <div style={{ color: 'black' }}>
                                  {invoiceChange['supply_text'] ? invoiceChange.supply_text.at(10) : invoiceData.supply_text.at(10)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isTaxInvoice &&
                          <div className={classNames(styles.Tax, { "trans_pur": !isSale })}>
                            <div className={classNames(styles.MidCell, { "trans_pur": !isSale })}>세 액</div>
                            <div className={classNames(styles.Units, { "trans_pur": !isSale })}>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={classNames(styles.upper1, { "trans_pur": !isSale })}>십</div>
                                <div className={classNames(styles.lower1, { "trans_pur": !isSale })}>
                                  {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(0) : invoiceData.tax_text.at(0)}
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>억</div>
                                <div className={styles.lower}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(1) : invoiceData.tax_text.at(1)}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>천</div>
                                <div className={styles.lower}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(2) : invoiceData.tax_text.at(2)}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={classNames(styles.upper1, { "trans_pur": !isSale })}>백</div>
                                <div className={classNames(styles.lower1, { "trans_pur": !isSale })}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(3) : invoiceData.tax_text.at(3)}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>십</div>
                                <div className={styles.lower}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(4) : invoiceData.tax_text.at(4)}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>만</div>
                                <div className={styles.lower}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(5) : invoiceData.tax_text.at(5)}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={classNames(styles.upper1, { "trans_pur": !isSale })}>천</div>
                                <div className={classNames(styles.lower1, { "trans_pur": !isSale })}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(6) : invoiceData.tax_text.at(6)}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>백</div>
                                <div className={styles.lower}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(7) : invoiceData.tax_text.at(7)}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper}>십</div>
                                <div className={styles.lower}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(8) : invoiceData.tax_text.at(8)}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames(styles.Unit, { "trans_pur": !isSale })}>
                                <div className={styles.upper0}>원</div>
                                <div className={styles.lower0}>
                                  <div style={{ color: 'black' }}>
                                    {invoiceChange['tax_text'] ? invoiceChange.tax_text.at(9) : invoiceData.tax_text.at(9)}
                                  </div>
                                </div>
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
                              value={invoiceChange['memo'] ? invoiceChange.memo : invoiceData.memo}
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
                            total: invoiceContents.length,
                            showTotal: ShowTotal,
                            showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            ItemRender: ItemRender,
                          }}
                          style={{ flex: 'auto', overflowX: "auto" }}
                          columns={default_columns}
                          bordered
                          dataSource={invoiceContents}
                          rowKey={(record) => record.sub_index}
                          onRow={(record, rowIndex) => {
                            return {
                              onClick: (event) => {
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
                              <div style={{ textAlign: 'end', paddingRight: '0.5rem' }}>
                                {ConvertCurrency(
                                  invoiceChange['total_price'] ? invoiceChange.total_price : invoiceData.total_price,
                                  invoiceData.show_decimal ? 4 : 0)
                                }
                              </div>
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
                                value={invoiceChange['cash_amount'] ? invoiceChange.cash_amount : invoiceData.cash_amount}
                                onChange={handleItemChange}
                                style={{ textAlign: 'end' }}
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
                                value={invoiceChange['check_amount'] ? invoiceChange.check_amount : invoiceData.check_amount}
                                onChange={handleItemChange}
                                style={{ textAlign: 'end' }}
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
                                value={invoiceChange['note_amount'] ? invoiceChange.note_amount : invoiceData.note_amount}
                                onChange={handleItemChange}
                                style={{ textAlign: 'end' }}
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
                                value={invoiceChange['receivable_amount'] ? invoiceChange.receivable_amount : invoiceData.receivable_amount}
                                onChange={handleItemChange}
                                style={{ textAlign: 'end' }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={classNames(styles.NoteParts, { 'trans_pur': !isSale })}>
                          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <div className={styles.text}><div>이 금액을  </div></div>
                            <Select
                              value={selectValues.receive_type}
                              options={receive_types}
                              onChange={selected => handleSelectChange('receive_type', selected)}
                            />
                            <div className={styles.text}><div>  함.</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {(Object.keys(invoiceChange).length > 0 || showSaveButton) &&
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
                          onClick={handleClose}
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    }
                  </form>
                </div>
                <div className="tab-pane show" id="tax-bill-print">
                  <TaxInvoicePrint
                    invoiceData={printData}
                    contents={invoiceContents}
                    supplierData={supplier}
                    receiverData={receiver}
                  />
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
        handleOk={handleCloseMessage}
      />
      <SelectListModal
        title={`${t('company.company')} ${t('common.search')}`}
        condition={{ category: 'tax_invoice', item: 'company_name' }}
        open={isPopupOpen}
        handleChange={(data) => {
          delete data.index;
          delete data.component;
          handleSelectCompany(data);
        }}
        handleClose={() => { setIsPopupOpen(false); closeModal(); }}
      />
    </div>
  );
};

export default TaxInvoiceEditModel;

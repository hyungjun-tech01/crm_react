import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "antd/dist/reset.css";
import { Checkbox, InputNumber, Space, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import { AddBoxOutlined, ModeEdit, IndeterminateCheckBoxOutlined, SettingsOutlined } from '@mui/icons-material';
import { option_locations } from '../../constants/constants';

import {
  atomLeadState,
  atomLeadsForSelection,
  defaultQuotation,
} from "../../atoms/atoms";
import {
  atomUserState,
  atomUsersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import { UserRepo } from '../../repository/user';
import { LeadRepo } from "../../repository/lead";
import { QuotationRepo, QuotationTypes, QuotationSendTypes } from "../../repository/quotation";

import AddBasicItem from "../../constants/AddBasicItem";
import QuotationContentModal from "./QuotationContentModal";

const default_quotation_content = {
  '1': null, '2': null, '3': null, '4': null, '5': null,
  '6': null, '7': null, '8': null, '9': null, '10': null,
  '11': null, '12': null, '13': null, '14': null, '15': null,
  '16': null, '17': null, '18': null, '19': null, '998': null,
};

const QuotationAddModel = (props) => {
  const { init, handleInit, leadCode } = props;
  const [t] = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);


  //===== [RecoilState] Related with Quotation =======================================
  const { modifyQuotation } = useRecoilValue(QuotationRepo);


  //===== [RecoilState] Related with Lead =============================================
  const leadsState = useRecoilValue(atomLeadState);
  const leadsForSelection = useRecoilValue(atomLeadsForSelection);
  const { loadAllLeads } = useRecoilValue(LeadRepo);


  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
  const { loadAllUsers } = useRecoilValue(UserRepo)
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to edit 'QuotationAddModel' ========================================
  const [quotationChange, setQuotationChange] = useState({ ...defaultQuotation });
  const [quotationContents, setQuotationContents] = useState([]);
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);

  const initializeQuotationTemplate = useCallback(() => {
    document.querySelector("#add_new_quotation_form").reset();

    setQuotationContents([]);
    if (leadCode && leadCode !== '') {
      const foundIdx = leadsForSelection.findIndex(item => item.value.lead_code === leadCode);
      if (foundIdx !== -1) {
        const found_lead_info = leadsForSelection.at(foundIdx);
        console.log('[initializeQuotationTemplate] leadsForSelection :', found_lead_info);
        setQuotationChange({
          ...defaultQuotation,
          ...found_lead_info.value,
        });
      };
    } else {
      setQuotationChange({
        ...defaultQuotation,
      });
      handleContentModalCancel();
    };
    setAmountsForContent({
      sum_each_items: 0, dc_amount: 0, sum_dc_applied:0, vat_amount:0, cut_off_amount: 0, sum_final: 0
    });
  }, [leadCode, leadsForSelection]);

  const handleItemChange = useCallback((e) => {
    const modifiedData = {
      ...quotationChange,
      [e.target.name]: e.target.value,
    };
    setQuotationChange(modifiedData);
  }, [quotationChange]);

  const handleDateChange = (name, date) => {
    const modifiedData = {
      ...quotationChange,
      [name]: date
    };
    console.log('[handleDateChange] : ', modifiedData);
    setQuotationChange(modifiedData);
  };

  const handleSelectChange = useCallback((name, selected) => {
    let modifiedData = null;
    if (name === 'lead_name') {
      modifiedData = {
        ...quotationChange,
        lead_code: selected.value.lead_code,
        lead_name: selected.value.lead_name,
        department: selected.value.department,
        position: selected.value.position,
        mobile_number: selected.value.mobile_number,
        phone_number: selected.value.phone_number,
        email: selected.value.email,
        company_name: selected.value.company_name,
        company_code: selected.value.company_code,
      };
    } else {
      modifiedData = {
        ...quotationChange,
        [name]: selected.value,
      };
    };

    setQuotationChange(modifiedData);
  }, [quotationChange]);


  //===== Handles to edit 'Content Table' ============================================
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const default_content_array = [
    ['1', 'No'],
    ['2', t('common.category')],
    ['3', t('common.maker')],
    ['4', t('quotation.model_name')],
    ['5', t('common.product')],
    ['6', t('common.material')],
    ['7', t('common.type')],
    ['8', t('common.color')],
    ['9', t('common.standard')],
    ['10', t('quotation.detail_desc')],
    ['11', t('common.unit')],
    ['12', t('common.quantity')],
    ['13', t('quotation.consumer_price')],
    ['14', t('quotation.discount_rate')],
    ['15', t('quotation.quotation_unit_price')],
    ['16', t('quotation.quotation_amount')],
    ['17', t('quotation.raw_price')],
    ['18', t('quotation.profit_amount')],
    ['19', t('quotation.note')],
  ];

  const default_columns = [
    {
      title: "No",
      dataIndex: '1',
      size: 5,
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.product'),
      dataIndex: '5',
      size: 50,
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('quotation.detail_desc'),
      dataIndex: '10',
      size: 10,
      render: (text, record) => <>{record['10'] ? t('common.avail') : t('common.na')}</>,
    },
    {
      title: t('common.quantity'),
      dataIndex: '12',
      size: 10,
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('quotation.quotation_unit_price'),
      dataIndex: '15',
      size: 15,
      render: (text, record) => <>{handleFormatter(record['15'])}</>,
    },
    {
      title: t('quotation.quotation_amount'),
      dataIndex: '16',
      size: 15,
      render: (text, record) => <>{handleFormatter(record['16'])}</>,
    },
    // {
    //   title: "Edit",
    //   render: (text, record) => (
    //     <div className="dropdown dropdown-action text-center">
    //       <ModeEdit onClick={() => {
    //         handleLoadSelectedContent(record);
    //       }} />
    //     </div>
    //   ),
    // },
  ];

  const rowSelection = {
    selectedRowKeys: selectedContentRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedContentRowKeys(selectedRowKeys);
    },
  };

  const [contentColumns, setContentColumns] = useState(default_columns);
  const [editHeaders, setEditHeaders] = useState(false);

  const handleHeaderCheckChange = useCallback((event) => {
    const targetName = event.target.name;
    const targetIndex = Number(targetName);

    if (event.target.checked) {
      const foundIndex = contentColumns.findIndex(
        item => Number(item.dataIndex) > targetIndex);

      const tempColumns = [
        ...contentColumns.slice(0, foundIndex),
        {
          title: default_content_array[targetIndex - 1][1],
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
  }, [contentColumns, default_content_array]);

  const handleHeaderSizeChange = useCallback((event) => {
    const targetName = event.target.name;
    const foundIndex = contentColumns.findIndex(
      item => item.dataIndex === targetName);
    if (foundIndex !== -1) {
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

  const ConvertHeaderInfosToString = (data) => {
    let ret = '';

    default_content_array.forEach(item => {
      ret += item.at(0) + '|' + item.at(1) + '|';

      const foundIdx = data.findIndex(col => col.title === item.at(1));
      if (foundIdx === -1) {
        ret += '0';
      } else {
        ret += data[foundIdx]['size'];
      }
    });

    console.log('\t[ ConvertHeaderInfosToString ] Result : ', ret);
    return ret;
  };


  //===== Handles to edit 'Contents' =================================================
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [orgContentModalValues, setorgContentModalValues] = useState({});
  const [editedContentModalValues, setEditedContentModalValues] = useState({});
  const [settingForContent, setSettingForContent] = useState({ title: '',
    vat_included: false, unit_vat_included: false, total_only: false, auto_calc: true, show_decimal: false,
    vat_included_disabled: false, unit_vat_included_disabled: true, total_only_disabled: true, dc_rate: 0,
  });
  const [amountsForContent, setAmountsForContent] = useState({
    sum_each_items: 0, dc_amount: 0, sum_dc_applied:0, vat_amount:0, cut_off_amount: 0, sum_final: 0
  });

  const handleChangeContentSetting = (event) => {
    const target_name = event.target.name;
    const target_value = event.target.checked;
    console.log(`[handleChangeContentSetting] Target : ${target_name} / Value : ${target_value}`);

    let tempSetting = { ...settingForContent };
    switch(target_name)
    {
      case 'vat_included':
        tempSetting.vat_included = target_value;
        tempSetting.unit_vat_included_disabled = !target_value;
        if(settingForContent.auto_calc){
          const vat_amount = target_value ? amountsForContent.sum_dc_applied*0.1 : 0;
          const updatedAmount = {
            ...amountsForContent,
            vat_amount: vat_amount,
            sum_final: amountsForContent.sum_dc_applied + vat_amount - amountsForContent.cut_off_amount,
          };
          console.log('[handleContentModalOk] calcualted amount :', updatedAmount);
          setAmountsForContent(updatedAmount);
        };
        break;
      case 'unit_vat_included':
        {
          tempSetting.vat_included_disabled = target_value;
          tempSetting.unit_vat_included = target_value;
          tempSetting.total_only_disabled = !target_value;
          let updatedEachSums = 0;
          const updatedContents = quotationContents.map(item => {
            const newPrice = (target_value && !settingForContent.total_only) ? item['org_unit_prce'] / 1.1 : item['org_unit_prce'];
            const updatedAmount = newPrice*item['12'];
            updatedEachSums += updatedAmount;
            return {
              ...item,
              '15': newPrice,
              '16': updatedAmount,
            };
          });
          setQuotationContents(updatedContents);
          handleChangeEachSum(updatedEachSums);
          break;
        }
      case 'total_only':
        {
          tempSetting.unit_vat_included_disabled = target_value;
          tempSetting.total_only = target_value;
          let updatedEachSums = 0;
          const updatedContents = quotationContents.map(item => {
            const newPrice = (!target_value && settingForContent.unit_vat_included) ? item['org_unit_prce'] / 1.1 : item['org_unit_prce'];
            const updatedAmount = newPrice*item['12'];
            updatedEachSums += updatedAmount;
            return {
              ...item,
              '15': newPrice,
              '16': updatedAmount,
            };
          });
          setQuotationContents(updatedContents);
          handleChangeEachSum(target_value ? updatedEachSums / 1.1 : updatedEachSums);
          break;
        }
      case 'auto_calc':
        tempSetting.auto_calc = target_value;
        break;
      case 'show_decimal':
        tempSetting.show_decimal = target_value;
        break;
      default:
        console.log('handleChangeContentSetting - Impossible case');
        break;
    };
    setSettingForContent(tempSetting);
  };

  const handleCalculateAmounts = useCallback((items) => {
    let SumEachItems = 0;
    items.forEach(item => {
      SumEachItems += item['16'];
    });
    const sum_each_items = settingForContent.total_only ? SumEachItems / 1.1 : SumEachItems;
    const dc_amount = sum_each_items * settingForContent.dc_rate* 0.01;
    const sum_dc_applied = sum_each_items - dc_amount;
    const vat_amount = settingForContent.vat_included ? sum_dc_applied*0.1 : 0;
    const tempAmount = {
      ...amountsForContent,
      sum_each_items: sum_each_items,
      dc_amount: dc_amount,
      sum_dc_applied: sum_dc_applied,
      vat_amount: vat_amount,
      sum_final: sum_dc_applied + vat_amount - amountsForContent.cut_off_amount,
    };
    console.log('[handleContentModalOk] calcualted amount :', tempAmount);
    setAmountsForContent(tempAmount);
  }, [amountsForContent, settingForContent]);

  const handleChangeEachSum = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      sum_each_items : value,
    };
    if(settingForContent.auto_calc){
      const dc_amount = value * settingForContent.dc_rate* 0.01;
      const sum_dc_applied = value - dc_amount;
      const vat_amount = settingForContent.vat_included ? sum_dc_applied*0.1 : 0;
      updatedAmount.dc_amount = dc_amount;
      updatedAmount.sum_dc_applied = sum_dc_applied;
      updatedAmount.vat_amount = vat_amount;
      updatedAmount.sum_final = sum_dc_applied + vat_amount - amountsForContent.cut_off_amount;
      console.log('[handleContentModalOk] calcualted amount :', updatedAmount);
    };
    setAmountsForContent(updatedAmount);
  };

  const handleChangeDCRate = (value) => {
    const updatedSetting = {
      ...settingForContent,
      dc_rate : value
    };
    setSettingForContent(updatedSetting);

    if(settingForContent.auto_calc && amountsForContent.sum_each_items !==0){
      const dc_amount = amountsForContent.sum_each_items * value* 0.01;
      const sum_dc_applied = amountsForContent.sum_each_items - dc_amount;
      const vat_amount = settingForContent.vat_included ? sum_dc_applied*0.1 : 0;
      const tempAmount = {
        ...amountsForContent,
        dc_amount: dc_amount,
        sum_dc_applied: sum_dc_applied,
        vat_amount: vat_amount,
        sum_final: sum_dc_applied + vat_amount - amountsForContent.cut_off_amount,
      };
      console.log('[handleContentModalOk] calcualted amount :', tempAmount);
      setAmountsForContent(tempAmount);
    };
  };

  const handleChangeDCAmount = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      dc_amount : value
    };
    if(settingForContent.auto_calc){
      const sum_dc_applied = amountsForContent.sum_each_items - value;
      const vat_amount = settingForContent.vat_included ? sum_dc_applied*0.1 : 0;
      updatedAmount.sum_dc_applied = sum_dc_applied;
      updatedAmount.vat_amount = vat_amount;
      updatedAmount.sum_final = sum_dc_applied + vat_amount - amountsForContent.cut_off_amount;
    };
    console.log('[handleContentModalOk] calcualted amount :', updatedAmount);
    setAmountsForContent(updatedAmount);
  };

  const handleChangeDCAppliedSum = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      sum_dc_applied : value
    };
    if(settingForContent.auto_calc){
      const vat_amount = settingForContent.vat_included ? value*0.1 : 0;
      updatedAmount.vat_amount = vat_amount;
      updatedAmount.sum_final = value + vat_amount - amountsForContent.cut_off_amount;
    };
    setAmountsForContent(updatedAmount);
  };

  const handleChangeVAT = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      vat_amount : value,
    };
    if(settingForContent.auto_calc){
      updatedAmount.sum_final = amountsForContent.sum_dc_applied + value - amountsForContent.cut_off_amount;
    };
    setAmountsForContent(updatedAmount);
  };

  const handleChangeCutOffAmount = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      cut_off_amount : value
    };
    if(settingForContent.auto_calc){
      updatedAmount.sum_final = amountsForContent.sum_dc_applied + amountsForContent.vat_amount - value;
    }
    setAmountsForContent(updatedAmount);
  };

  const handleChangeFinalAmount = (value) => {
    const updatedSetting = {
      ...amountsForContent,
      sum_final : value,
    };
    setAmountsForContent(updatedSetting);
  };

  // --- Functions used for editing content ------------------------------
  const handleAddNewContent = useCallback(() => {
    if (!quotationChange.lead_name) {
      console.log('\t[handleAddNewContent] No lead is selected');
      return;
    };
    
    setSettingForContent({ ...settingForContent,
      action: 'ADD',
      index: quotationContents.length + 1,
      title: t('quotation.add_content'),
    });

    setorgContentModalValues({
      product_name: null,
      product_class_name: null,
      detail_desc_on_off: '없음',
      detail_desc: null,
      quantity: null,
      cost_price: null,
      reseller_price: null,
      list_price: null,
      quotation_amount: null,
    });

    setEditedContentModalValues({});
    setIsContentModalOpen(true);
  }, [quotationChange.lead_name, quotationContents.length, settingForContent, t]);

  const handleModifyContent = useCallback((data) => {
    if (!data) {
      console.log('\t[handleModifyContent] No Data');
      return;
    };

    setSettingForContent({ ...settingForContent,
      action: 'UPDATE',
      index: data['1'],
      title: t('quotation.modify_content'),
    });

    setorgContentModalValues({
      product_name: data['5'],
      product_class_name: data['2'],
      detail_desc_on_off: data['10'],
      detail_desc: data['998'],
      quantity: data['12'],
      reseller_price: data['13'],
      list_price: data['15'],
      cost_price: data['17'],
      quotation_amount: data['16'],
    });

    setEditedContentModalValues({});
    setIsContentModalOpen(true);
  }, [settingForContent, t]);

  const handleDeleteSelectedConetents = useCallback(() => {
    if (selectedContentRowKeys.length === 0) {
      console.log('\t[handleDeleteSelectedConetents] No row is selected');
      return;
    };

    let tempContents = [
      ...quotationContents
    ];

    selectedContentRowKeys.forEach(row => {
      console.log('[handleDeleteSelectedConetents] row :', row);
      const filteredContents = tempContents.filter(item => item['1'] !== row);
      tempContents = filteredContents;
    });

    let temp_total_amount = 0;
    const finalContents = tempContents.map((item, index) => {
      temp_total_amount += item['16'];
      return { ...item, '1': index + 1 };
    });

    const tempQuotation = {
      ...quotationChange,
      total_quotation_amount: temp_total_amount,
    };
    setQuotationChange(tempQuotation);
    setQuotationContents(finalContents);
    handleCalculateAmounts(finalContents);
    setSelectedContentRowKeys([]);

  }, [handleCalculateAmounts, quotationChange, quotationContents, selectedContentRowKeys]);

  const handleContentModalOk = useCallback(() => {
    const finalData = {
      ...orgContentModalValues,
      ...editedContentModalValues,
    };
    if (!finalData.product_name || !finalData.quotation_amount) {
      console.log("Inevitable data can't be null");
      return;
    };
    console.log('[handleContentModalOk] new content :', );

    // update Contents -------------------------------------------------
    if(settingForContent.action === "ADD") {
      const updatedContent = {
        ...default_quotation_content,
        '1': quotationContents.length + 1,
        '2': finalData.product_class_name,
        '5': finalData.product_name,
        '10': finalData.detail_desc_on_off,
        '12': finalData.quantity,
        '13': finalData.reseller_price,
        '14': settingForContent.dc_rate,
        '15': finalData.list_price,
        '16': finalData.quotation_amount,
        '17': finalData.cost_price,
        '998': finalData.detail_desc? finalData.detail_desc : '',
        'org_price': finalData.org_unit_price,
      };
      const updatedContents = quotationContents.concat(updatedContent);
      setQuotationContents(updatedContents);

      if(settingForContent.auto_calc){
        handleCalculateAmounts(updatedContents);
      };
    } else {  //Update
      const updatedContent = {
        ...default_quotation_content,
        '1': settingForContent.index,
        '2': finalData.product_class_name,
        '5': finalData.product_name,
        '10': finalData.detail_desc_on_off,
        '12': finalData.quantity,
        '13': finalData.reseller_price,
        '14': settingForContent.dc_rate,
        '15': finalData.list_price,
        '16': finalData.quotation_amount,
        '17': finalData.cost_price,
        '998': finalData.detail_desc? finalData.detail_desc : '',
        'org_price': finalData.org_unit_price,
      };
      const foundIdx = quotationContents.findIndex(item => item['1'] === settingForContent.index);
      if(foundIdx === -1){
        console.log('Something Wrong when modifying content');
        return;
      };
      const updatedContents = [
        ...quotationContents.slice(0, foundIdx),
        updatedContent,
        ...quotationContents.slice(foundIdx + 1,),
      ];
      setQuotationContents(updatedContents);

      if(settingForContent.auto_calc){
        handleCalculateAmounts(updatedContents);
      };
    };

    handleContentModalCancel();
  }, [ editedContentModalValues, handleCalculateAmounts, orgContentModalValues, quotationContents, settingForContent ]);

  const handleContentModalCancel = () => {
    setIsContentModalOpen(false);
    setEditedContentModalValues({});
    setorgContentModalValues({});
    setSelectedContentRowKeys([]);
  };

  const handleContentItemChange = useCallback(data => {
    console.log('handleContentItemChange : ', data);
    setEditedContentModalValues(data);
  }, []);

  const handleFormatter = useCallback((value) => {
    if(value === undefined || value === null || value === '') return '';
    let ret = value;
    if(typeof value === 'string') {
      ret = Number(value);
      if(isNaN(ret)) return;
    };
    
    return settingForContent.show_decimal
      ? ret?.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      : ret?.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, [settingForContent.show_decimal]);


  //===== Function for Final Actions  ==========================================
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
      dc_rate: settingForContent.dc_rate,
      dc_amount: amountsForContent.dc_amount,
      quotation_amount: amountsForContent.sum_each_items,
      tax_amount: amountsForContent.vat_amount,
      cutoff_amount: amountsForContent.cut_off_amount,
      total_quotation_amount: amountsForContent.sum_final,
      quotation_table: ConvertHeaderInfosToString(contentColumns),
      quotation_contents: JSON.stringify(quotationContents),
      action_type: 'ADD',
      lead_number: '99999', // Temporary
      counter: 0,
      currency: 'KRW',  // Temporary
      status: '견적진행', // Temporary
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewQuotation ]`, newQuotationData);
    const result = modifyQuotation(newQuotationData);
    if (result) {
      initializeQuotationTemplate();
      //close modal ?
    };
  }, [contentColumns, cookies.myLationCrmUserId, initializeQuotationTemplate, modifyQuotation, quotationChange, quotationContents]);


  //===== useEffect functions ==========================================
  useEffect(() => {
    if ((userState & 1) === 0) {
      loadAllUsers();
    } else {
      if (init) {
        initializeQuotationTemplate();
      } else {
        if (handleInit) handleInit(!init);
      };
    };
  }, [handleInit, init, initializeQuotationTemplate, loadAllUsers, userState]);

  useEffect(() => {
    if ((leadsState & 1) === 0) {
      loadAllLeads();
    };
  }, [leadsState, loadAllLeads]);
  

  return (
    <div
      className="modal right fade"
      id="add_quotation"
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
            <h4 className="modal-title"><b>{t('quotation.add_new_quotation')}</b></h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form className="forms-sampme" id="add_new_quotation_form">
              <div className="form-group row">
                <AddBasicItem
                  title={t('lead.lead_name')}
                  type='select'
                  name='lead_name'
                  defaultValue={quotationChange.lead_name}
                  options={leadsForSelection}
                  required
                  onChange={handleSelectChange}
                />
              </div>
              {(quotationChange.lead_name !== null) &&
                <div className="form-group row">
                  <div className="col-sm-12">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td><b>{t('lead.department')}</b></td>
                          <td>{quotationChange.department}</td>
                          <td><b>{t('lead.position')}</b></td>
                          <td>{quotationChange.position}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.mobile')}</b></td>
                          <td>{quotationChange.mobile_number}</td>
                          <td><b>{t('common.phone_no')}</b></td>
                          <td>{quotationChange.phone_number}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.fax_number')}</b></td>
                          <td>{quotationChange.fax_number}</td>
                          <td><b>{t('lead.email')}</b></td>
                          <td>{quotationChange.email}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              }
              <div className="form-group row">
                <AddBasicItem
                  title={t('common.title')}
                  type='text'
                  name='quotation_title'
                  defaultValue={quotationChange.quotation_title}
                  required
                  long
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.quotation_type')}
                  type='select'
                  name='quotation_type'
                  defaultValue={quotationChange.quotation_type}
                  options={QuotationTypes}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.doc_no')}
                  type='text'
                  name='quotation_number'
                  defaultValue={quotationChange.quotation_number}
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.send_type')}
                  type='select'
                  name='quotation_send_type'
                  defaultValue={quotationChange.quotation_send_type}
                  options={QuotationSendTypes}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.quotation_date')}
                  type='date'
                  name='quotation_date'
                  time={{ data: quotationChange.quotation_date }}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.expiry_date')}
                  type='text'
                  name='quotation_expiration_date'
                  defaultValue={quotationChange.quotation_expiration_date}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('quotation.confirm_date')}
                  type='date'
                  name='comfirm_date'
                  time={{ data: quotationChange.comfirm_date }}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.delivery_location')}
                  type='text'
                  name='delivery_location'
                  defaultValue={quotationChange.delivery_location}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('quotation.delivery_period')}
                  type='text'
                  name='delivery_period'
                  defaultValue={quotationChange.delivery_period}
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.warranty')}
                  type='text'
                  name='warranty_period'
                  defaultValue={quotationChange.warranty_period}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('common.region')}
                  type='select'
                  name='region'
                  options={option_locations.ko}
                  defaultValue={quotationChange.region}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.payment_type')}
                  type='text'
                  name='payment_type'
                  defaultValue={quotationChange.payment_type}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('common.status')}
                  type='text'
                  name='status'
                  defaultValue={quotationChange.status}
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.sales_rep')}
                  type='select'
                  name='sales_representative'
                  defaultValue={quotationChange.sales_representative}
                  options={salespersonsForSelection}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.quotation_manager')}
                  type='select'
                  name='quotation_manager'
                  defaultValue={quotationChange.quotation_manager}
                  options={usersForSelection}
                  onChange={handleSelectChange}
                />
              </div>
              <h4 className="h4-price">
                <div style={{ fontSize: 18, fontWeight: 600 }}>{t('common.product')}{t('common.table')}</div>
                <div className="text-end flex-row">
                  <div>
                    <AddBoxOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={handleAddNewContent}
                    />
                    <IndeterminateCheckBoxOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={handleDeleteSelectedConetents}
                      disabled={!selectedContentRowKeys}
                    />
                    {/* <SettingsOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={() => { setEditHeaders(!editHeaders); }}
                    /> */}
                  </div>
                </div>
              </h4>
              <div className="form-group row">
                <Space
                  align="center"
                  direction="horizontal"
                  size="middle"
                  style={{ display: 'flex', marginBottom: '0.25rem', marginTop: '0.25rem' }}
                  wrap
                >
                  <Checkbox
                    name='vat_included'
                    checked={settingForContent.vat_included}
                    disabled={settingForContent.vat_included_disabled}
                    onChange={handleChangeContentSetting}
                   >
                    {t('quotation.vat_included')}
                  </Checkbox>
                  <Checkbox
                    name='unit_vat_included'
                    checked={settingForContent.unit_vat_included}
                    disabled={settingForContent.unit_vat_included_disabled}
                    onChange={handleChangeContentSetting}
                   >
                    {t('quotation.unit_vat_included')}
                  </Checkbox>
                  <Checkbox
                    name='total_only'
                    checked={settingForContent.total_only}
                    disabled={settingForContent.total_only_disabled}
                    onChange={handleChangeContentSetting}
                  >
                    {t('quotation.total_applied_only')}
                  </Checkbox>
                  <Checkbox
                    name='auto_calc'
                    checked={settingForContent.auto_calc}
                    onChange={handleChangeContentSetting}
                  >
                    {t('quotation.auto_calculation')}
                  </Checkbox>
                  <Checkbox
                    name='show_decimal'
                    onChange={handleChangeContentSetting}
                  >
                    {t('quotation.show_decimal')}
                  </Checkbox>
                </Space>
              </div>
              <div className="form-group row">
                <Table
                  rowSelection={rowSelection}
                  pagination={{
                    total: quotationContents.length,
                    showTotal: ShowTotal,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    ItemRender: ItemRender,
                  }}
                  style={{ overflowX: "auto" }}
                  columns={default_columns}
                  bordered
                  dataSource={quotationContents}
                  rowKey={(record) => record['1']}
                  onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (event) => {
                          handleModifyContent(record);
                        }, // click row
                    };
                }}
                />
              </div>
              <div className="form-group row">
                <Space
                  align="center"
                  direction="horizontal"
                  size="middle"
                  style={{ display: 'flex', marginBottom: '0.25rem', marginTop: '0.25rem' }}
                >
                  <Space.Compact direction="vertical">
                    <label>{t('transaction.total_price')}</label>
                    <InputNumber
                      name='sum_each_items'
                      defaultValue={0}
                      value={amountsForContent.sum_each_items}
                      formatter={handleFormatter}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                      disabled={settingForContent.auto_calc}
                      onChange={handleChangeEachSum}
                      style={{
                        width: 180,
                      }}
                    />
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <label >{t('quotation.dc_rate')}</label>
                    <InputNumber
                      name='dc_rate'
                      min={0}
                      max={100}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value?.replace('%', '')}
                      value={settingForContent.dc_rate}
                      onChange={handleChangeDCRate}
                      style={{
                        width: 180,
                      }}
                    />
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <label >{t('quotation.dc_amount')}</label>
                    <InputNumber
                      name='dc_amount'
                      defaultValue={0}
                      value={amountsForContent.dc_amount}
                      formatter={handleFormatter}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                      disabled={settingForContent.auto_calc}
                      onChange={handleChangeDCAmount}
                      style={{
                        width: 180,
                      }}
                    />
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <label >{t('quotation.quotation_amount')}</label>
                    <InputNumber
                      name='sum_dc_applied'
                      defaultValue={0}
                      value={amountsForContent.sum_dc_applied}
                      disabled={settingForContent.auto_calc}
                      formatter={handleFormatter}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                      onChange={handleChangeDCAppliedSum}
                      style={{
                        width: 180,
                      }}
                    />
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <label >{t('quotation.tax_amount')}</label>
                    <InputNumber
                      name='vat_amount'
                      defaultValue={0}
                      value={amountsForContent.vat_amount}
                      disabled={settingForContent.auto_calc}
                      formatter={handleFormatter}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                      onChange={handleChangeVAT}
                      style={{
                        width: 180,
                      }}
                    />
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <label >{t('quotation.cutoff_amount')}</label>
                    <InputNumber
                      name='cut_off_amount'
                      defaultValue={0}
                      value={amountsForContent.cut_off_amount}
                      formatter={handleFormatter}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                      onChange={handleChangeCutOffAmount}
                      style={{
                        width: 180,
                      }}
                    />
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <label >{t('quotation.total_quotation_amount')}</label>
                    <InputNumber
                      name='sum_final'
                      defaultValue={0}
                      value={amountsForContent.sum_final}
                      disabled={settingForContent.auto_calc}
                      formatter={handleFormatter}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                      onChange={handleChangeFinalAmount}
                      style={{
                        width: 180,
                      }}
                    />
                  </Space.Compact>
                </Space>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                  onClick={handleAddNewQuotation}
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
        </div>
      </div>
      {editHeaders &&
        <div className="edit-content">
          <div className="edit-content-header">
            <h4><b>{t('quotation.header_setting')}</b></h4>
            <button
              type="button"
              className="edit-content-close"
              onClick={() => { setEditHeaders(!editHeaders) }}
            >
              {" "}
            </button>
          </div>
          <div className="form-group">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">{t('common.title')}</th>
                  <th scope="col">{t('common.visible')}</th>
                  <th scope="col">{t('common.size')}</th>
                </tr>
              </thead>
              <tbody>
                {default_content_array.map((item, index) => {
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
                        {foundItem ?
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
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      }
      <QuotationContentModal
        setting={settingForContent}
        open={isContentModalOpen}
        original={orgContentModalValues}
        edited={editedContentModalValues}
        handleEdited={handleContentItemChange}
        handleOk={handleContentModalOk}
        handleCancel={handleContentModalCancel}
      />
    </div>
  );
};

export default QuotationAddModel;

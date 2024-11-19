import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Resizable } from 'react-resizable';
import { Button, Checkbox, InputNumber, Modal, Space, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import { AddBoxOutlined, IndeterminateCheckBoxOutlined, SettingsOutlined } from '@mui/icons-material';
import { option_locations } from '../../constants/constants';

import {
  defaultQuotation,
  atomCurrentLead,
  defaultLead,
} from "../../atoms/atoms";
import {
  atomUserState,
  atomUsersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import {
  QuotationRepo,
  QuotationTypes,
  QuotationSendTypes,
  QuotationDelivery,
  QuotationExpiry,
  QuotationPayment,
  QuotationContentItems,
  QuotationDefaultColumns,
} from "../../repository/quotation";
import { SettingsRepo } from '../../repository/settings'

import AddBasicItem from "../../constants/AddBasicItem";
import AddSearchItem from "../../constants/AddSearchItem";
import QuotationContentModal from "./QuotationContentModal";
import MessageModal from "../../constants/MessageModal";
import { ConvertCurrency } from "../../constants/functions";


const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const QuotationAddModel = ({ init, handleInit }) => {
  const [t] = useTranslation();
  const [cookies, setCookie] = useCookies(["myLationCrmUserId", "myLationCrmUserName", "myQuotationAddColumns"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: "", message: "" });


  //===== [RecoilState] Related with Quotation =======================================
  const { modifyQuotation, getQuotationDocNo } = useRecoilValue(QuotationRepo);


  //===== [RecoilState] Related with Lead ============================================
  const currentLead = useRecoilValue(atomCurrentLead);


  //===== [RecoilState] Related with Users ===========================================
  const userState = useRecoilValue(atomUserState);
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== [RecoilState] Related with Settings ===========================================
  const { openModal, closeModal } = useRecoilValue(SettingsRepo);


  //===== Handles to edit 'QuotationAddModel' ========================================
  const [quotationChange, setQuotationChange] = useState({ ...defaultQuotation });
  const [quotationContents, setQuotationContents] = useState([]);
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);

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
    setQuotationChange(modifiedData);
  };

  const handleSelectChange = useCallback((name, selected) => {
    const modifiedData = {
      ...quotationChange,
      [name]: selected.value,
    };
    setQuotationChange(modifiedData);
  }, [quotationChange]);


  //===== Handles to edit 'Content Table' ============================================
  const [contentColumns, setContentColumns] = useState([]);
  const [editHeaders, setEditHeaders] = useState(false);

  const tableComponents = {
    header: {
      cell: ResizeableTitle,
    },
  };

  const rowSelection = {
    selectedRowKeys: selectedContentRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedContentRowKeys(selectedRowKeys);
    },
  };

  const handleColumnResize = index => (e, { size }) => {
    const nextColumns = [...contentColumns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    setContentColumns(nextColumns);

    // update cookie for content columns ----------------
    const tempCookies = {
      ...cookies.myQuotationAddColumns,
      [cookies.myLationCrmUserId] : [
        ...nextColumns
      ]
    };
    setCookie("myQuotationAddColumns", tempCookies);
  };

  const handleHeaderCheckChange = (event) => {
    const targetName = event.target.name;
    const targetIndex = Number(targetName);

    let tempColumns = null;
    if (event.target.checked) {
      const foundIndex = contentColumns.findIndex(
        item => Number(item.dataIndex) > targetIndex);

      if(foundIndex === -1){
        tempColumns = [
          ...contentColumns.slice(0, -1),
          {
            title: contentColumns.at(-1).title,
            dataIndex: contentColumns.at(-1).dataIndex,
            width: 100,
            render: contentColumns.at(-1).render,
          },
          {
            title: t(QuotationContentItems[targetName].title),
            dataIndex: targetName,
            render: QuotationContentItems[targetName].type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : (text, record) => <>{text}</>,
          }, 
        ];
      } else {
        tempColumns = [
          ...contentColumns.slice(0, foundIndex),
          {
            title: t(QuotationContentItems[targetName].title),
            dataIndex: targetName,
            width: 100,
            render: QuotationContentItems[targetName].type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : (text, record) => <>{text}</>,
          },
          ...contentColumns.slice(foundIndex,),
        ];
      };
    } else {
      const foundIndex = contentColumns.findIndex(
        item => Number(item.dataIndex) === targetIndex);

      tempColumns = [
        ...contentColumns.slice(0, foundIndex),
        ...contentColumns.slice(foundIndex + 1,),
      ];
    };
    
    setContentColumns(tempColumns);

    // update cookie for content columns ----------------
    const tempCookies = {
      ...cookies.myQuotationAddColumns,
      [cookies.myLationCrmUserId] : [
        ...tempColumns
      ]
    };
    setCookie("myQuotationAddColumns", tempCookies);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ConvertHeaderInfosToString = (data) => {
    let ret = '';

    Object.keys(QuotationContentItems).forEach((item, index) => {
      if (item === '1')
        ret += item;
      else
        ret += '|' + item;

      ret += '|' + t(QuotationContentItems[item].title) + '|';

      const foundIdx = data.findIndex(col => col.dataIndex === item);
      if (foundIdx === -1) {
        ret += '0';
      } else {
        ret += data[foundIdx]['width'] || '100';
      }
    });

    return ret;
  };


  //===== Handles to edit 'Content' =================================================
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [orgContentModalValues, setOrgContentModalValues] = useState({});
  const [editedContentModalValues, setEditedContentModalValues] = useState({});
  const [settingForContent, setSettingForContent] = useState({
    title: '',
    vat_included: false, unit_vat_included: false, total_only: false, auto_calc: true, show_decimal: false,
    vat_included_disabled: false, unit_vat_included_disabled: true, total_only_disabled: true, dc_rate: 0,
  });
  const [amountsForContent, setAmountsForContent] = useState({
    sub_total_amount: 0, dc_amount: 0, sum_dc_applied: 0, vat_amount: 0, cutoff_amount: 0, sum_final: 0, total_cost_price: 0
  });

  const handleChangeContentSetting = (event) => {
    const target_name = event.target.name;
    const target_value = event.target.checked;

    let tempSetting = { ...settingForContent };
    switch (target_name) {
      case 'vat_included':
        tempSetting.vat_included = target_value;
        tempSetting.unit_vat_included_disabled = !target_value;
        if (settingForContent.auto_calc) {
          const vat_amount = target_value ? amountsForContent.sum_dc_applied * 0.1 : 0;
          const updatedAmount = {
            ...amountsForContent,
            vat_amount: vat_amount,
            sum_final: amountsForContent.sum_dc_applied + vat_amount - amountsForContent.cutoff_amount,
          };
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
            const newPrice = (target_value && !settingForContent.total_only) ? item['org_unit_price'] / 1.1 : item['org_unit_price'];
            const updatedAmount = newPrice * item['12'];
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
            const newPrice = (!target_value && settingForContent.unit_vat_included) ? item['org_unit_price'] / 1.1 : item['org_unit_price'];
            const updatedAmount = newPrice * item['12'];
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
    let SumEachItems = 0, SumEachCosts = 0;
    items.forEach(item => {
      SumEachItems += item['16'];
      SumEachCosts += item['13'];
    });
    const sum_cost_items = SumEachCosts;
    const sub_total_amount = settingForContent.total_only ? SumEachItems / 1.1 : SumEachItems;
    const dc_amount = sub_total_amount * settingForContent.dc_rate * 0.01;
    const sum_dc_applied = sub_total_amount - dc_amount;
    const vat_amount = settingForContent.vat_included ? sum_dc_applied * 0.1 : 0;
    const sum_final = sum_dc_applied + vat_amount - amountsForContent.cutoff_amount;
    const tempAmount = {
      ...amountsForContent,
      sub_total_amount: sub_total_amount,
      dc_amount: dc_amount,
      sum_dc_applied: sum_dc_applied,
      vat_amount: vat_amount,
      sum_final: sum_final,
      total_cost_price: sum_cost_items,
    };
    setAmountsForContent(tempAmount);

  }, [amountsForContent, settingForContent]);

  const handleChangeEachSum = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      sub_total_amount: value,
    };
    if (settingForContent.auto_calc) {
      const dc_amount = value * settingForContent.dc_rate * 0.01;
      const sum_dc_applied = value - dc_amount;
      const vat_amount = settingForContent.vat_included ? sum_dc_applied * 0.1 : 0;
      updatedAmount.dc_amount = dc_amount;
      updatedAmount.sum_dc_applied = sum_dc_applied;
      updatedAmount.vat_amount = vat_amount;
      updatedAmount.sum_final = sum_dc_applied + vat_amount - amountsForContent.cutoff_amount;
    };
    setAmountsForContent(updatedAmount);
  };

  const handleChangeDCRate = (value) => {
    const updatedSetting = {
      ...settingForContent,
      dc_rate: value
    };
    setSettingForContent(updatedSetting);

    if (settingForContent.auto_calc && amountsForContent.sub_total_amount !== 0) {
      const dc_amount = amountsForContent.sub_total_amount * value * 0.01;
      const sum_dc_applied = amountsForContent.sub_total_amount - dc_amount;
      const vat_amount = settingForContent.vat_included ? sum_dc_applied * 0.1 : 0;
      const tempAmount = {
        ...amountsForContent,
        dc_amount: dc_amount,
        sum_dc_applied: sum_dc_applied,
        vat_amount: vat_amount,
        sum_final: sum_dc_applied + vat_amount - amountsForContent.cutoff_amount,
      };
      setAmountsForContent(tempAmount);
    };
  };

  const handleChangeDCAmount = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      dc_amount: value
    };
    if (settingForContent.auto_calc) {
      const sum_dc_applied = amountsForContent.sub_total_amount - value;
      const vat_amount = settingForContent.vat_included ? sum_dc_applied * 0.1 : 0;
      updatedAmount.sum_dc_applied = sum_dc_applied;
      updatedAmount.vat_amount = vat_amount;
      updatedAmount.sum_final = sum_dc_applied + vat_amount - amountsForContent.cutoff_amount;
    };
    setAmountsForContent(updatedAmount);
  };

  const handleChangeDCAppliedSum = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      sum_dc_applied: value
    };
    if (settingForContent.auto_calc) {
      const vat_amount = settingForContent.vat_included ? value * 0.1 : 0;
      updatedAmount.vat_amount = vat_amount;
      updatedAmount.sum_final = value + vat_amount - amountsForContent.cutoff_amount;
    };
    setAmountsForContent(updatedAmount);
  };

  const handleChangeVAT = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      vat_amount: value,
    };
    if (settingForContent.auto_calc) {
      updatedAmount.sum_final = amountsForContent.sum_dc_applied + value - amountsForContent.cutoff_amount;
    };
    setAmountsForContent(updatedAmount);
  };

  const handleChangeCutOffAmount = (value) => {
    let updatedAmount = {
      ...amountsForContent,
      cutoff_amount: value
    };
    if (settingForContent.auto_calc) {
      updatedAmount.sum_final = amountsForContent.sum_dc_applied + amountsForContent.vat_amount - value;
    }
    setAmountsForContent(updatedAmount);
  };

  const handleChangeFinalAmount = (value) => {
    const updatedSetting = {
      ...amountsForContent,
      sum_final: value,
    };
    setAmountsForContent(updatedSetting);
  };

  const handleChangeTotalCostPrice = (value) => {
    const updatedSetting = {
      ...amountsForContent,
      total_cost_price: value,
    };
    setAmountsForContent(updatedSetting);
  }

  //===== Handles to edit contents ========================================
  const handleAddNewContent = useCallback(() => {
    if (!quotationChange.lead_name) {
      const contents = (
        <>
          <p>{t('comment.msg_no_necessary_data')}</p>
          <div> - 고객 이름</div>
        </>
      );
      const tempMsg = {
        title: t('comment.title_check'),
        message: contents,
      };
      handleOpenMessage(tempMsg);
      return;
    };

    setSettingForContent({
      ...settingForContent,
      action: 'ADD',
      index: quotationContents.length + 1,
      title: t('quotation.add_content'),
    });

    setOrgContentModalValues({
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
    
    handlePopupOpen(true);
    setEditedContentModalValues({});
    setIsContentModalOpen(true);
  }, [quotationChange.lead_name, quotationContents.length, settingForContent, t]);

  const handleModifyContent = useCallback((data) => {
    if (!data) {
      const tempMsg = {
        title: t('comment.title_check'),
        message: t('comment.msg_no_data'),
      };
      handleOpenMessage(tempMsg);
      return;
    };

    setSettingForContent({
      ...settingForContent,
      action: 'UPDATE',
      index: data['1'],
      title: t('quotation.modify_content'),
    });

    setOrgContentModalValues({
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

    handlePopupOpen(true);
    setEditedContentModalValues({});
    setIsContentModalOpen(true);
  }, [settingForContent, t]);

  const handleDeleteSelectedConetents = useCallback(() => {
    if (selectedContentRowKeys.length === 0) {
      const tempMsg = {
        title: t('comment.title_check'),
        message: t('comment.msg_select_nothing'),
      };
      handleOpenMessage(tempMsg);
      return;
    };

    let tempContents = [
      ...quotationContents
    ];

    selectedContentRowKeys.forEach(row => {
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
      setMessage({ title: '필요 항목 누락', message: '필요 값 - 제품명 또는 견적 가격 - 이 없습니다.' });
      const contents = (
        <>
          <p>하기 정보는 필수 입력 사항입니다.</p>
          { !finalData.product_name && <div> - 제품명</div> }
          { !finalData.quotation_amount && <div> - 견적 가격</div> }
        </>
      );
      const tempMsg = {
        title: t('comment.title_check'),
        message: contents,
      };
      handleOpenMessage(tempMsg);
      return;
    };

    // update Contents -------------------------------------------------
    const updatedContent = {
      '1': 1,
      '2': finalData.product_class_name,
      '3': finalData.manufacturer || '',
      '4': finalData.model_name || '',
      '5': finalData.product_name || '',
      '6': finalData.material || '',
      '7': finalData.type || '',
      '8': finalData.color || '',
      '9': finalData.standard || '',
      '10': finalData.detail_desc_on_off || '',
      '11': finalData.unit || '',
      '12': finalData.quantity || '',
      '13': finalData.reseller_price || '',
      '14': settingForContent.dc_rate || '',
      '15': finalData.list_price || '',
      '16': finalData.quotation_amount || '',
      '17': finalData.cost_price || '',
      '18': finalData.profit_amount || '',
      '19': finalData.memo || '',
      '998': finalData.detail_desc || '',
      'org_unit_price': finalData.org_unit_price,
    };

    if (settingForContent.action === "ADD") {
      updatedContent['1'] = quotationContents.length + 1;
      const updatedContents = quotationContents.concat(updatedContent);
      setQuotationContents(updatedContents);

      if (settingForContent.auto_calc) {
        handleCalculateAmounts(updatedContents);
      };
    } else {  //Update
      updatedContent['1'] = settingForContent.index;
      const foundIdx = quotationContents.findIndex(item => item['1'] === settingForContent.index);
      if (foundIdx === -1) {
        console.log('Something Wrong when modifying content');
        return;
      };
      const updatedContents = [
        ...quotationContents.slice(0, foundIdx),
        updatedContent,
        ...quotationContents.slice(foundIdx + 1,),
      ];
      setQuotationContents(updatedContents);

      if (settingForContent.auto_calc) {
        handleCalculateAmounts(updatedContents);
      };
    };

    handleContentModalCancel();
  }, [editedContentModalValues, handleCalculateAmounts, orgContentModalValues, quotationContents, settingForContent]);

  const handleContentModalCancel = () => {
    handlePopupOpen(false);
    setIsContentModalOpen(false);
    setEditedContentModalValues({});
    setOrgContentModalValues({});
    setSelectedContentRowKeys([]);
  };

  const handleContentItemChange = useCallback(data => {
    setEditedContentModalValues(data);
  }, []);

  const handleOpenEditHeaders = () => {
    handlePopupOpen(true);
    setEditHeaders(true);
  };

  const handleCloseEditHeaders = () => {
    handlePopupOpen(false);
    setEditHeaders(false);
  };


  //===== Handles to handle this =================================================
  const handlePopupOpen = (open) => {
    if(open) {
      openModal("antModal");
    } else {
      closeModal();
    }
  };

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
    setQuotationContents([]);

    let modifiedData = {
      ...defaultQuotation,
      receiver: cookies.myLationCrmUserName,
    };

    if (currentLead !== defaultLead)
    {
      modifiedData['lead_code'] = currentLead.lead_code;
      modifiedData['lead_name'] = currentLead.lead_name;
      modifiedData['department'] = currentLead.department;
      modifiedData['position'] = currentLead.position;
      modifiedData['mobile_number'] = currentLead.mobile_number;
      modifiedData['phone_number'] = currentLead.phone_number;
      modifiedData['email'] = currentLead.email;
    };

    setAmountsForContent({
      sub_total_amount: 0, dc_amount: 0, sum_dc_applied: 0, vat_amount: 0, cutoff_amount: 0, sum_final: 0, total_cost_price: 0
    });

    setIsContentModalOpen(false);
    setEditedContentModalValues({});
    setOrgContentModalValues({});
    setSelectedContentRowKeys([]);

    // load or set setting of column of table ----------------------------------
    if(!cookies.myQuotationAddColumns) {
      const tempQuotationColumn = QuotationDefaultColumns.map(item => {
        const selectedItem = QuotationContentItems[item.dataIndex];
        if(!!item.width) {
          return {
            title: t(selectedItem.title),
            dataIndex: item.dataIndex,
            width: item.width,
            render: selectedItem.type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : (text, record) => <>{text}</>,
          }
        } else {
          return {
            title: t(selectedItem.title),
            dataIndex: item.dataIndex,
            render: selectedItem.type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : (text, record) => <>{text}</>,
          }
        };
      });
      const tempCookieValue = {
        [cookies.myLationCrmUserId] : tempQuotationColumn 
      }
      setContentColumns(tempQuotationColumn);
      setCookie('myQuotationAddColumns', tempCookieValue);
    } else {
      const columnSettings = cookies.myQuotationAddColumns[cookies.myLationCrmUserId];
      if(!columnSettings){
        const tempQuotationColumn = QuotationDefaultColumns.map(item => {
          const selectedItem = QuotationContentItems[item.dataIndex];
          if(!!item.width) {
            return {
              title: t(selectedItem.title),
              dataIndex: item.dataIndex,
              width: item.width,
              render: selectedItem.type === 'price'
                ? (text, record) => <>{ConvertCurrency(text)}</>
                : (text, record) => <>{text}</>,
            }
          } else {
            return {
              title: t(selectedItem.title),
              dataIndex: item.dataIndex,
              render: selectedItem.type === 'price'
                ? (text, record) => <>{ConvertCurrency(text)}</>
                : (text, record) => <>{text}</>,
            }
          };
        });
        const tempCookieValue = {
          ...cookies.myQuotationAddColumns,
          [cookies.myLationCrmUserId]: tempQuotationColumn
        };
        setContentColumns(tempQuotationColumn);
        setCookie('myQuotationAddColumns', tempCookieValue);
      } else {
        const tempQuotationColumn = columnSettings.map(col => ({
          ...col,
          render: QuotationContentItems[col.dataIndex].type === 'price'
              ? (text, record) => <>{ConvertCurrency(text)}</>
              : (text, record) => <>{text}</>,
        }));
        setContentColumns(tempQuotationColumn);
      };
    };

    let newDocNo = "";
    const response = getQuotationDocNo({modify_user: cookies.myLationCrmUserId});
    response
      .then((res) => {
        if(res.result){
          newDocNo = res.docNo;
        };
        modifiedData['quotation_number'] = newDocNo;
        setQuotationChange(modifiedData);
      })
      .catch(err => {
        console.log('handleInitialize / getQuotationDocNo :', err);
        modifiedData['quotation_number'] = newDocNo;
        setQuotationChange(modifiedData);
      })

  }, [cookies.myLationCrmUserId, cookies.myLationCrmUserName, currentLead, getQuotationDocNo]);

  const handleAddNewQuotation = () => {
    // Check data if they are available
    let numberOfNoInputItems = 0;
    let noLeadName = false;
    if(!quotationChange.lead_name || quotationChange.lead_name === ""){
      numberOfNoInputItems++;
      noLeadName = true;
    };
    let noQuotationTitle = false;
    if(!quotationChange.quotation_title || quotationChange.quotation_title === ""){
      numberOfNoInputItems++;
      noQuotationTitle = true;
    };
    let noQuotationContents = false;
    if(quotationContents.length === 0){
      numberOfNoInputItems++;
      noQuotationContents = true;
    };

    if(numberOfNoInputItems > 0){
      const contents = (
        <>
          <p>하기 정보는 필수 입력 사항입니다.</p>
          { noLeadName && <div> - 고객 이름</div> }
          { noQuotationTitle && <div> - 견적 제목</div> }
          { noQuotationContents && <div> - 견적 Items</div> }
        </>
      );
      const tempMsg = {
        title: t('comment.title_check'),
        message: contents,
      };
      handleOpenMessage(tempMsg);
      return;
    };

    const newQuotationData = {
      ...quotationChange,
      sub_total_amount: amountsForContent.sub_total_amount,
      dc_rate: settingForContent.dc_rate,
      dc_amount: amountsForContent.dc_amount,
      quotation_amount: amountsForContent.sum_dc_applied,
      tax_amount: amountsForContent.vat_amount,
      cutoff_amount: amountsForContent.cutoff_amount,
      total_quotation_amount: amountsForContent.sum_final,
      total_cost_price: amountsForContent.total_cost_price,
      quotation_table: ConvertHeaderInfosToString(contentColumns),
      quotation_contents: JSON.stringify(quotationContents),
      action_type: 'ADD',
      lead_number: '99999', // Temporary
      counter: 0,
      currency: 'KRW',  // Temporary
      status: '견적진행', // Temporary
      modify_user: cookies.myLationCrmUserId,
    };
    const result = modifyQuotation(newQuotationData);
    result.then((res) => {
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


  //===== useEffect functions ==========================================
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
    
    if (init && ((userState & 1) === 1)) {
      if (handleInit) handleInit(!init);
      setTimeout(() => {
        handleInitialize();
      }, 250);
    };
  }, [userState, init, handleInit, handleInitialize]);

  if (init)
    return <div>&nbsp;</div>;

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
          onClick={handleClose}
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
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form className="forms-sampme" id="add_new_quotation_form">
              <div className="form-group row">
                <AddSearchItem
                  title={t('lead.lead_name')}
                  category='quotation'
                  name='lead_name'
                  required
                  defaultValue={quotationChange.lead_name}
                  edited={quotationChange}
                  setEdited={setQuotationChange}
                  handleOpen={handlePopupOpen}
                />
              </div>
              {!!quotationChange.lead_name &&
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
                  defaultValue={quotationChange.quotation_date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.expiry_date')}
                  type='select'
                  name='quotation_expiration_date'
                  options={QuotationExpiry}
                  defaultValue={quotationChange.quotation_expiration_date}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.confirm_date')}
                  type='date'
                  name='comfirm_date'
                  defaultValue={quotationChange.comfirm_date}
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
                  type='select'
                  name='delivery_period'
                  options={QuotationDelivery}
                  defaultValue={quotationChange.delivery_period}
                  onChange={handleSelectChange}
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
                  type='select'
                  name='payment_type'
                  options={QuotationPayment}
                  defaultValue={quotationChange.payment_type}
                  onChange={handleSelectChange}
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
                    <SettingsOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={handleOpenEditHeaders}
                    />
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
                  bordered
                  className="resizable-antd-table"
                  components={tableComponents}
                  columns={contentColumns.map((col, index) => ({
                    ...col,
                    onHeaderCell: column => ({
                      width: column.width,
                      onResize: handleColumnResize(index),
                    }),
                  }))}
                  dataSource={quotationContents}
                  pagination={{
                    total: quotationContents.length,
                    showTotal: ShowTotal,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    ItemRender: ItemRender,
                  }}
                  rowSelection={rowSelection}
                  rowKey={(record) => record['1']}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
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
                      name='sub_total_amount'
                      defaultValue={0}
                      value={amountsForContent.sub_total_amount}
                      formatter={ConvertCurrency}
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
                      formatter={ConvertCurrency}
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
                      formatter={ConvertCurrency}
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
                      formatter={ConvertCurrency}
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
                      name='cutoff_amount'
                      defaultValue={0}
                      value={amountsForContent.cutoff_amount}
                      formatter={ConvertCurrency}
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
                      formatter={ConvertCurrency}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                      onChange={handleChangeFinalAmount}
                      style={{
                        width: 180,
                      }}
                    />
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <label >{t('quotation.total_cost_price')}</label>
                    <InputNumber
                      name='total_cost_price'
                      defaultValue={0}
                      value={amountsForContent.total_cost_price}
                      disabled={settingForContent.auto_calc}
                      formatter={ConvertCurrency}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                      onChange={handleChangeTotalCostPrice}
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
                  onClick={handleClose}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
        title={t('quotation.header_setting')}
        open={editHeaders}
        onOk={handleCloseEditHeaders}
        onCancel={handleCloseEditHeaders}
        footer={[
          <Button key="submit" type="primary" onClick={handleCloseEditHeaders}>
              Ok
          </Button>,
        ]}
        style={{ top: 120 }}
        width={360}
        zIndex={2001}
      >
        <table className="table">
          <tbody>
          {Object.keys(QuotationContentItems).map((item, index) => {
              const foundItem = contentColumns.filter(column => column.dataIndex === item)[0];
              return (
                <tr key={index}>
                  <td>
                  {t(QuotationContentItems[item].title)}
                  </td>
                  <td>
                    <Checkbox
                      name={item}
                      checked={!!foundItem}
                      onChange={handleHeaderCheckChange}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Modal>
      <QuotationContentModal
        setting={settingForContent}
        open={isContentModalOpen}
        items={contentColumns}
        original={orgContentModalValues}
        edited={editedContentModalValues}
        handleEdited={handleContentItemChange}
        handleOk={handleContentModalOk}
        handleCancel={handleContentModalCancel}
      />
      <MessageModal
        title={message.title}
        message={message.message}
        open={isMessageModalOpen}
        handleOk={handleCloseMessage}
      />
    </div>
  );
};

export default QuotationAddModel;
import React, { useCallback, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Resizable } from 'react-resizable';
import { Checkbox, InputNumber, Space, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import { AddBoxOutlined, IndeterminateCheckBoxOutlined, SettingsOutlined } from '@mui/icons-material';

import { SettingsRepo } from '../../repository/settings'

import QuotationContentModal from "./QuotationContentModal";
import MessageModal from "../../constants/MessageModal";

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


const QuotationContents = ({ checkData }) => {
    const [t] = useTranslation();
    const [cookies, setCookie] = useCookies(["myLationCrmUserId", "myLationCrmUserName", "myQuotationAddColumns"]);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState({ title: "", message: "" });

    const handleOpenMessage = (msg) => {
        openModal('antModal');
        setMessage(msg);
        setIsMessageModalOpen(true);
    };

    const handleCloseMessage = () => {
        closeModal();
        setIsMessageModalOpen(false);
    };

    const handlePopupOpen = (open) => {
        console.log('QuotationAdd / handlePopupOpen');
        if(open) {
          openModal("antModal");
        } else {
          closeModal();
        }
      };

    //===== [RecoilState] Related with Settings ===========================================
    const { openModal, closeModal } = useRecoilValue(SettingsRepo);


    //===== Handles to edit 'Content Table' ============================================
    const [contentColumns, setContentColumns] = useState([]);
    const [editHeaders, setEditHeaders] = useState(false);
    const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);
    const [settingForContent, setSettingForContent] = useState({
        title: '',
        vat_included: false, unit_vat_included: false, total_only: false, auto_calc: true, show_decimal: false,
        vat_included_disabled: false, unit_vat_included_disabled: true, total_only_disabled: true, dc_rate: 0,
    });

    const handleFormatter = useCallback((value) => {
        if (value === undefined || value === null || value === '') return '';
        let ret = value;
        if (typeof value === 'string') {
          ret = Number(value);
          if (isNaN(ret)) return value;
        };
    
        return settingForContent.show_decimal
          ? ret?.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')
          : ret?.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }, [settingForContent.show_decimal]);

    const defaultColumns = [
        {
            title: "No",
            dataIndex: '1',
            width: 50,
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('common.product'),
            dataIndex: '5',
            width: 300,
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('quotation.detail_desc'),
            dataIndex: '10',
            width: 100,
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('common.quantity'),
            dataIndex: '12',
            width: 50,
            render: (text, record) => <>{text}</>,
        },
        {
            title: t('quotation.quotation_unit_price'),
            dataIndex: '15',
            width: 150,
            render: (text, record) => <>{handleFormatter(record['15'])}</>,
        },
        {
            title: t('quotation.quotation_amount'),
            dataIndex: '16',
            render: (text, record) => <>{handleFormatter(record['16'])}</>,
        },
    ];

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
            [cookies.myLationCrmUserId]: [
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

            if (foundIndex === -1) {
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
                            ? (text, record) => <>{handleFormatter(text)}</>
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
                            ? (text, record) => <>{handleFormatter(text)}</>
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
            [cookies.myLationCrmUserId]: [
                ...tempColumns
            ]
        };
        setCookie("myQuotationAddColumns", tempCookies);
    };

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

    const handleOpenEditHeaders = () => {
        handlePopupOpen(true);
        setEditHeaders(true);
      };
    
      const handleCloseEditHeaders = () => {
        handlePopupOpen(false);
        setEditHeaders(false);
      };


    //===== Handles to edit 'Content' =================================================
    const [quotationContents, setQuotationContents] = useState([]);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [orgContentModalValues, setOrgContentModalValues] = useState({});
    const [editedContentModalValues, setEditedContentModalValues] = useState({});
    
    const [amountsForContent, setAmountsForContent] = useState({
        sub_total_amount: 0, dc_amount: 0, sum_dc_applied: 0, vat_amount: 0, cut_off_amount: 0, sum_final: 0, total_cost_price: 0
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
                        sum_final: amountsForContent.sum_dc_applied + vat_amount - amountsForContent.cut_off_amount,
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

    const handleCalculateAmounts = (items) => {
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
        const sum_final = sum_dc_applied + vat_amount - amountsForContent.cut_off_amount;
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

    };

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
            updatedAmount.sum_final = sum_dc_applied + vat_amount - amountsForContent.cut_off_amount;
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
                sum_final: sum_dc_applied + vat_amount - amountsForContent.cut_off_amount,
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
            updatedAmount.sum_final = sum_dc_applied + vat_amount - amountsForContent.cut_off_amount;
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
            updatedAmount.sum_final = value + vat_amount - amountsForContent.cut_off_amount;
        };
        setAmountsForContent(updatedAmount);
    };

    const handleChangeVAT = (value) => {
        let updatedAmount = {
            ...amountsForContent,
            vat_amount: value,
        };
        if (settingForContent.auto_calc) {
            updatedAmount.sum_final = amountsForContent.sum_dc_applied + value - amountsForContent.cut_off_amount;
        };
        setAmountsForContent(updatedAmount);
    };

    const handleChangeCutOffAmount = (value) => {
        let updatedAmount = {
            ...amountsForContent,
            cut_off_amount: value
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

    const handleAddNewContent = () => {
        if (!checkData.lead_name) {
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
    };

    const handleModifyContent = (data) => {
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
    };

    const handleDeleteSelectedConetents = () => {
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

    };

    const handleContentModalOk = () => {
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
      };
    
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

    return (
        <>
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
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.total_cost_price')}</label>
                        <InputNumber
                            name='total_cost_price'
                            defaultValue={0}
                            value={amountsForContent.total_cost_price}
                            disabled={settingForContent.auto_calc}
                            formatter={handleFormatter}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                            onChange={handleChangeTotalCostPrice}
                            style={{
                                width: 180,
                            }}
                        />
                    </Space.Compact>
                </Space>
            </div>
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
        </>
    );
}

export default QuotationContents;
import React, { useCallback, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Resizable } from 'react-resizable';
import { Button, Checkbox, Flex, InputNumber, Modal, Space, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import { AddBoxOutlined, IndeterminateCheckBoxOutlined, SettingsOutlined } from '@mui/icons-material';

import { QuotationContentItems } from '../../repository/quotation';
import { SettingsRepo } from '../../repository/settings';

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

const QuotationContents = ({ data, handleData, columns, handleColumns, contents, handleContents }) => {
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
        if (open) {
            openModal("antModal");
        } else {
            closeModal();
        }
    };


    //===== [RecoilState] Related with Settings ===========================================
    const { openModal, closeModal } = useRecoilValue(SettingsRepo);


    //===== Handles to edit 'Content Table' ============================================
    const [editHeaders, setEditHeaders] = useState(false);
    const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);

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
        const nextColumns = [...columns];
        nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
        };
        handleColumns(nextColumns);

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
            const foundIndex = columns.findIndex(item => Number(item.dataIndex) > targetIndex);

            if (foundIndex === -1) {
                tempColumns = [
                    ...columns.slice(0, -1),
                    {
                        title: columns.at(-1).title,
                        dataIndex: columns.at(-1).dataIndex,
                        width: 100,
                        render: columns.at(-1).render,
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
                    ...columns.slice(0, foundIndex),
                    {
                        title: t(QuotationContentItems[targetName].title),
                        dataIndex: targetName,
                        width: 100,
                        render: QuotationContentItems[targetName].type === 'price'
                            ? (text, record) => <>{ConvertCurrency(text)}</>
                            : (text, record) => <>{text}</>,
                    },
                    ...columns.slice(foundIndex,),
                ];
            };
        } else {
            const foundIndex = columns.findIndex(item => Number(item.dataIndex) === targetIndex);

            tempColumns = [
                ...columns.slice(0, foundIndex),
                ...columns.slice(foundIndex + 1,),
            ];
        };

        handleColumns(tempColumns);

        // update cookie for content columns ----------------
        const tempCookies = {
            ...cookies.myQuotationAddColumns,
            [cookies.myLationCrmUserId]: [...tempColumns]
        };
        setCookie("myQuotationAddColumns", tempCookies);
    };

    const handleOpenEditHeaders = () => {
        handlePopupOpen(true);
        setEditHeaders(true);
    };

    const handleCloseEditHeaders = () => {
        handlePopupOpen(false);
        setEditHeaders(false);
    };


    //===== Handles to edit 'Content Modal' =================================================
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [orgContentModalValues, setOrgContentModalValues] = useState({});
    const [editedContentModalValues, setEditedContentModalValues] = useState({});
    const [settingForContent, setSettingForContent] = useState({
        title: '',
        vat_included: false, unit_vat_included: false, total_only: false, auto_calc: true, show_decimal: false,
        vat_included_disabled: false, unit_vat_included_disabled: true, total_only_disabled: true, dc_rate: 0,
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
                    const vat_amount = target_value ? data.sum_dc_applied * 0.1 : 0;
                    const updatedAmount = {
                        ...data,
                        vat_amount: vat_amount,
                        sum_final: data.sum_dc_applied + vat_amount - data.cut_off_amount,
                    };
                    handleData(updatedAmount);
                };
                break;
            case 'unit_vat_included':
                {
                    tempSetting.vat_included_disabled = target_value;
                    tempSetting.unit_vat_included = target_value;
                    tempSetting.total_only_disabled = !target_value;
                    let updatedEachSums = 0;
                    const updatedContents = contents.map(item => {
                        const newPrice = (target_value && !settingForContent.total_only) ? item['org_unit_price'] / 1.1 : item['org_unit_price'];
                        const updatedAmount = newPrice * item['12'];
                        updatedEachSums += updatedAmount;
                        return {
                            ...item,
                            '15': newPrice,
                            '16': updatedAmount,
                        };
                    });
                    handleContents(updatedContents);
                    handleChangeEachSum(updatedEachSums);
                    break;
                }
            case 'total_only':
                {
                    tempSetting.unit_vat_included_disabled = target_value;
                    tempSetting.total_only = target_value;
                    let updatedEachSums = 0;
                    const updatedContents = contents.map(item => {
                        const newPrice = (!target_value && settingForContent.unit_vat_included) ? item['org_unit_price'] / 1.1 : item['org_unit_price'];
                        const updatedAmount = newPrice * item['12'];
                        updatedEachSums += updatedAmount;
                        return {
                            ...item,
                            '15': newPrice,
                            '16': updatedAmount,
                        };
                    });
                    handleContents(updatedContents);
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
        const sum_final = sum_dc_applied + vat_amount - data.cut_off_amount;
        const tempAmount = {
            ...data,
            sub_total_amount: sub_total_amount,
            dc_amount: dc_amount,
            sum_dc_applied: sum_dc_applied,
            vat_amount: vat_amount,
            sum_final: sum_final,
            total_cost_price: sum_cost_items,
        };
        handleData(tempAmount);

    };

    const handleChangeEachSum = (value) => {
        let updatedAmount = {
            ...data,
            sub_total_amount: value,
        };
        if (settingForContent.auto_calc) {
            const dc_amount = value * settingForContent.dc_rate * 0.01;
            const sum_dc_applied = value - dc_amount;
            const vat_amount = settingForContent.vat_included ? sum_dc_applied * 0.1 : 0;
            updatedAmount.dc_amount = dc_amount;
            updatedAmount.sum_dc_applied = sum_dc_applied;
            updatedAmount.vat_amount = vat_amount;
            updatedAmount.sum_final = sum_dc_applied + vat_amount - data.cut_off_amount;
        };
        handleData(updatedAmount);
    };

    const handleChangeDCRate = (value) => {
        const updatedSetting = {
            ...settingForContent,
            dc_rate: value
        };
        setSettingForContent(updatedSetting);

        if (settingForContent.auto_calc && data.sub_total_amount !== 0) {
            const dc_amount = data.sub_total_amount * value * 0.01;
            const sum_dc_applied = data.sub_total_amount - dc_amount;
            const vat_amount = settingForContent.vat_included ? sum_dc_applied * 0.1 : 0;
            const tempAmount = {
                ...data,
                dc_amount: dc_amount,
                sum_dc_applied: sum_dc_applied,
                vat_amount: vat_amount,
                sum_final: sum_dc_applied + vat_amount - data.cut_off_amount,
            };
            handleData(tempAmount);
        };
    };

    const handleChangeDCAmount = (value) => {
        let updatedAmount = {
            ...data,
            dc_amount: value
        };
        if (settingForContent.auto_calc) {
            const sum_dc_applied = data.sub_total_amount - value;
            const vat_amount = settingForContent.vat_included ? sum_dc_applied * 0.1 : 0;
            updatedAmount.sum_dc_applied = sum_dc_applied;
            updatedAmount.vat_amount = vat_amount;
            updatedAmount.sum_final = sum_dc_applied + vat_amount - data.cut_off_amount;
        };
        handleData(updatedAmount);
    };

    const handleChangeDCAppliedSum = (value) => {
        let updatedAmount = {
            ...data,
            sum_dc_applied: value
        };
        if (settingForContent.auto_calc) {
            const vat_amount = settingForContent.vat_included ? value * 0.1 : 0;
            updatedAmount.vat_amount = vat_amount;
            updatedAmount.sum_final = value + vat_amount - data.cut_off_amount;
        };
        handleData(updatedAmount);
    };

    const handleChangeVAT = (value) => {
        let updatedAmount = {
            ...data,
            vat_amount: value,
        };
        if (settingForContent.auto_calc) {
            updatedAmount.sum_final = data.sum_dc_applied + value - data.cut_off_amount;
        };
        handleData(updatedAmount);
    };

    const handleChangeCutOffAmount = (value) => {
        let updatedAmount = {
            ...data,
            cut_off_amount: value
        };
        if (settingForContent.auto_calc) {
            updatedAmount.sum_final = data.sum_dc_applied + data.vat_amount - value;
        }
        handleData(updatedAmount);
    };

    const handleChangeFinalAmount = (value) => {
        const updatedSetting = {
            ...data,
            sum_final: value,
        };
        handleData(updatedSetting);
    };

    const handleChangeTotalListPrice = (value) => {
        const updatedSetting = {
            ...data,
            list_price: value,
        };
        handleData(updatedSetting);
    };

    const handleChangeTotalListPriceDCRate = (value) => {
        if(data.list_price_dc !== value) {
            const tempSubTotalAmount = data.list_price*(1 - value*0.01);

            const updatedSetting = {
                ...data,
                list_price_dc: value,
                sub_total_amount: tempSubTotalAmount,
            };
            handleData(updatedSetting);
        };
    }

    const handleChangeCostPrice = (value) => {
        if(data.total_cost_price !== value) {
            const tempProfit = data.total_quotation_amount - value;
            const tempProfitRate = tempProfit/data.total_quotation_amount*100;

            const updatedSetting = {
                ...data,
                total_cost_price: value,
                profit: tempProfit,
                profit_rate: tempProfitRate,
            };
            handleData(updatedSetting);
        }
    }

    const handleAddNewContent = () => {
        if (!data.name) {
            const tempContents = (
                <>
                    <p>{t('comment.msg_no_necessary_data')}</p>
                    <div> - 고객 이름</div>
                </>
            );
            const tempMsg = {
                title: t('comment.title_check'),
                message: tempContents,
            };
            handleOpenMessage(tempMsg);
            return;
        };

        setSettingForContent({
            ...settingForContent,
            action: 'ADD',
            index: contents.length + 1,
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

        console.log('handleModifyContent:', data);
        const tempOrgContentValues = {};
        Object.keys(data).forEach(keyVal => {
            if (!!data[keyVal] && !!QuotationContentItems[keyVal]) {
                tempOrgContentValues[QuotationContentItems[keyVal].name] = data[keyVal]
            };
        });
        console.log('handleModifyContent:', tempOrgContentValues);
        setOrgContentModalValues(tempOrgContentValues);

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
            ...contents
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

        // const tempQuotation = {
        //     ...quotationChange,
        //     total_quotation_amount: temp_total_amount,
        // };
        // setQuotationChange(tempQuotation);
        handleContents(finalContents);
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
            const tempContents = (
                <>
                    <p>하기 정보는 필수 입력 사항입니다.</p>
                    {!finalData.product_name && <div> - 제품명</div>}
                    {!finalData.quotation_amount && <div> - 견적 가격</div>}
                </>
            );
            const tempMsg = {
                title: t('comment.title_check'),
                message: tempContents,
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
            '18': finalData.profit || '',
            '19': finalData.memo || '',
            '998': finalData.detail_desc || '',
            'org_unit_price': finalData.org_unit_price,
        };

        if (settingForContent.action === "ADD") {
            updatedContent['1'] = contents.length + 1;
            const updatedContents = contents.concat(updatedContent);
            handleContents(updatedContents);

            if (settingForContent.auto_calc) {
                handleCalculateAmounts(updatedContents);
            };
        } else {  //Update
            updatedContent['1'] = settingForContent.index;
            const foundIdx = contents.findIndex(item => item['1'] === settingForContent.index);
            if (foundIdx === -1) {
                console.log('Something Wrong when modifying content');
                return;
            };
            const updatedContents = [
                ...contents.slice(0, foundIdx),
                updatedContent,
                ...contents.slice(foundIdx + 1,),
            ];
            handleContents(updatedContents);

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


    //===== useEffect functions =============================================== 
    // useEffect(() => {
    //     console.log('QuotationContents / useEffect');
    //     if (!columns || columns.length === 0) {
    //         if (!cookies.myQuotationAddColumns) {
    //             const tempQuotationColumn = QuotationDefaultColumns.forEach(item => {
    //                 const ret = {
    //                     title: t(item.title),
    //                     dataIndex: item.dataIndex,
    //                     render: QuotationContentItems[item.dataIndex].type === 'price'
    //                         ? (text, record) => <>{ConvertCurrency(text)}</>
    //                         : (text, record) => <>{text}</>,
    //                 };
    //                 if (!!item.width) {
    //                     ret['width'] = item.width;
    //                 }
    //                 return ret;
    //             });
    //             const tempCookieValue = {
    //                 [cookies.myLationCrmUserId]: tempQuotationColumn
    //             }
    //             handleColumns(tempQuotationColumn);
    //             setCookie('myQuotationAddColumns', tempCookieValue);
    //         } else {
    //             const columnSettings = cookies.myQuotationAddColumns[cookies.myLationCrmUserId];
    //             if (!columnSettings) {
    //                 const tempQuotationColumn = QuotationDefaultColumns.forEach(item => {
    //                     const ret = {
    //                         title: t(item.title),
    //                         dataIndex: item.dataIndex,
    //                         render: QuotationContentItems[item.dataIndex].type === 'price'
    //                             ? (text, record) => <>{ConvertCurrency(text)}</>
    //                             : (text, record) => <>{text}</>,
    //                     };
    //                     if (!!item.width) {
    //                         ret['width'] = item.width;
    //                     }
    //                     return ret;
    //                 });
    //                 const tempCookieValue = {
    //                     ...cookies.myQuotationAddColumns,
    //                     [cookies.myLationCrmUserId]: tempQuotationColumn
    //                 };
    //                 handleColumns(tempQuotationColumn);
    //                 setCookie('myQuotationAddColumns', tempCookieValue);
    //             } else {
    //                 const tempQuotationColumn = columnSettings.map(col => ({
    //                     ...col,
    //                     render: QuotationContentItems[col.dataIndex].type === 'price'
    //                         ? (text, record) => <>{ConvertCurrency(text)}</>
    //                         : (text, record) => <>{text}</>,
    //                 }));
    //                 handleColumns(tempQuotationColumn);
    //             };
    //         };
    //     };
    // }, [cookies.myQuotationAddColumns, columns]);
    

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
                    columns={columns.map((col, index) => ({
                        ...col,
                        onHeaderCell: column => ({
                            width: column.width,
                            onResize: handleColumnResize(index),
                        }),
                    }))
                    }
                    dataSource={contents}
                    pagination={{
                        total: contents.length,
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
                <Flex wrap gap="small">
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.total_list_price')}</label>
                        <InputNumber
                            name='list_price'
                            defaultValue={0}
                            value={data.list_price}
                            disabled={settingForContent.auto_calc}
                            formatter={ConvertCurrency}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                            onChange={handleChangeTotalListPrice}
                            style={{
                                width: 180,
                            }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.total_list_price_dc_rate')}</label>
                        <InputNumber
                            name='list_price_dc'
                            defaultValue={0}
                            value={data.list_price_dc}
                            formatter={(value) => `${value}%`}
                            parser={(value) => typeof value === 'string'
                                ? Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                                : value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                            onChange={handleChangeTotalListPriceDCRate}
                            style={{
                                width: 180,
                            }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label>{t('quotation.sub_total_amount')}</label>
                        <InputNumber
                            name='sub_total_amount'
                            defaultValue={0}
                            value={data.sub_total_amount}
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
                            parser={(value) => typeof value === 'string'
                                ? Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                                : value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
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
                            value={data.dc_amount}
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
                            name='quotation_amount'
                            defaultValue={0}
                            value={data.quotation_amount}
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
                            name='tax_amount'
                            defaultValue={0}
                            value={data.tax_amount}
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
                            name='cut_off_amount'
                            defaultValue={0}
                            value={data.cut_off_amount}
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
                            name='total_quotation_amount'
                            defaultValue={0}
                            value={data.total_quotation_amount}
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
                            value={data.total_cost_price}
                            formatter={ConvertCurrency}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                            onChange={handleChangeCostPrice}
                            style={{
                                width: 180,
                            }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.profit')}</label>
                        <InputNumber
                            name='profit'
                            defaultValue={0}
                            value={data.profit}
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
                        <label >{t('quotation.profit_rate')}</label>
                        <InputNumber
                            name='profit_rate'
                            defaultValue={0}
                            value={data.profit_rate}
                            disabled={settingForContent.auto_calc}
                            formatter={ConvertCurrency}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                            onChange={handleChangeFinalAmount}
                            style={{
                                width: 180,
                            }}
                        />
                    </Space.Compact>
                </Flex>
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
                            const foundItem = columns.filter(column => column.dataIndex === item)[0];
                            return (
                                <tr key={index}>
                                    <td>{t(QuotationContentItems[item].title)}</td>
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
                items={columns}
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
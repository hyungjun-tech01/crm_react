import React, { useCallback, useState } from 'react';
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Resizable } from 'react-resizable';
import { Button, Checkbox, Flex, Input, Modal, Space, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import { AddBoxOutlined, IndeterminateCheckBoxOutlined, SettingsOutlined } from '@mui/icons-material';

import { QuotationContentItems } from '../../repository/quotation';
import { SettingsRepo } from '../../repository/settings';

import QuotationContentModal from "./QuotationContentModal";
import MessageModal from "../../constants/MessageModal";
import { ConvertCurrency, ConvertCurrency0 } from "../../constants/functions";


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

        const tempSetting = { ...settingForContent };
        switch (target_name) {
            case 'vat_included':
                tempSetting.vat_included = target_value;
                tempSetting.unit_vat_included_disabled = !target_value;
                if (settingForContent.auto_calc) {
                    const tempTaxAmount = target_value ? data.quotation_amount * 0.1 : 0;
                    const tempTotalAmount = data.quotation_amount + tempTaxAmount - data.cutoff_amount;
                    const tempProfit = tempTotalAmount - data.total_cost_price;
                    const tempProfitRate = data.total_cost_price !== 0
                        ? tempProfit * 100 / tempTotalAmount
                        : 0;
                    const updatedAmounts = {
                        ...data,
                        tax_amount: tempTaxAmount,
                        total_quotation_amount: tempTotalAmount,
                        profit: tempProfit,
                        profit_rate: tempProfitRate,
                    };
                    handleData(updatedAmounts);
                };
                break;
            case 'unit_vat_included':
                {
                    tempSetting.vat_included_disabled = target_value;
                    tempSetting.unit_vat_included = target_value;
                    tempSetting.total_only_disabled = !target_value;

                    let updatedEachSums = 0;
                    const updatedContents = contents.map(item => {
                        let newPrice = 0;
                        if(!!item['org_unit_price']) {
                            newPrice = (target_value && !settingForContent.total_only) ? item['org_unit_price'] / 1.1 : item['org_unit_price'];
                        } else {
                            newPrice = (target_value && !settingForContent.total_only) ? item['unit_price'] / 1.1 : item['unit_price'] * 1.1;
                        };
                        const updatedAmount = newPrice * item['12'];
                        updatedEachSums += updatedAmount;
                        return {
                            ...item,
                            '15': newPrice,
                            '16': updatedAmount,
                        };
                    });
                    handleContents(updatedContents);

                    const tempQuotationAmount = updatedEachSums;
                    const tempTaxAmount = settingForContent.vat_included ? tempQuotationAmount * 0.1 : 0;
                    const tempTotalAmount = tempQuotationAmount + tempTaxAmount - data.cutoff_amount;
                    const tempProfit = tempTotalAmount - data.total_cost_price;
                    const updatedAmounts = {
                        ...data,
                        quotation_amount: tempQuotationAmount,
                        tax_amount: tempTaxAmount,
                        total_quotation_amount: tempTotalAmount,
                        profit: tempProfit,
                        profit_rate: data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0
                    };
                    handleData(updatedAmounts);
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
                    
                    const tempQuotationAmount = target_value ? updatedEachSums / 1.1 : updatedEachSums;
                    const tempTaxAmount = settingForContent.vat_included ? tempQuotationAmount * 0.1 : 0;
                    const tempTotalAmount = tempQuotationAmount + tempTaxAmount - data.cutoff_amount;
                    const tempProfit = tempTotalAmount - data.total_cost_price;
                    const updatedAmounts = {
                        ...data,
                        quotation_amount: tempQuotationAmount,
                        tax_amount: tempTaxAmount,
                        total_quotation_amount: tempTotalAmount,
                        profit: tempProfit,
                        profit_rate: data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0
                    };
                    handleData(updatedAmounts);
                    
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
        let SumEachListPrice = 0, SumEachItems = 0;
        items.forEach(item => {
            SumEachListPrice += item['13']*item['12'];
            SumEachItems += item['16'];
        });

        const tempDcAmount = SumEachItems * data.dc_rate * 0.01;
        const tempQuotationAmount = SumEachItems - tempDcAmount;
        const tempTaxAmount = settingForContent.vat_included ? tempQuotationAmount * 0.1 : 0;
        const tempTotalAmount = tempQuotationAmount + tempTaxAmount - data.cutoff_amount;
        const tempProfit = tempTotalAmount - data.total_cost_price;
        const tempPriceDCRate = SumEachListPrice !== 0 ? (SumEachListPrice - SumEachItems) * 100 / SumEachListPrice : 0;
        const tempProfitRate = (!!data.total_cost_price && data.total_cost_price !== 0)
            ? tempProfit * 100 / data.total_cost_price
            : 0;

        const tempAmount = {
            ...data,
            list_price: SumEachListPrice,
            list_price_dc: tempPriceDCRate - Math.floor(tempPriceDCRate) > 0 ?  tempPriceDCRate.toFixed(2) : tempPriceDCRate,
            sub_total_amount: SumEachItems,
            dc_amount: tempDcAmount,
            quotation_amount: tempQuotationAmount,
            tax_amount: tempTaxAmount,
            total_quotation_amount: tempTotalAmount,
            profit: tempProfit,
            profit_rate: tempProfitRate - Math.floor(tempProfitRate) > 0 ? tempProfitRate.toFixed(2) : tempProfitRate,
        };
        handleData(tempAmount);

    };

    //===== Handles to change each values related to amounts =======================================
    const handleChangeAmounts = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        const value = Number(targetValue.replace(/\$\s?|(,*)/g, ''));
        if(isNaN(value)) {
            console.log('handleChangeAmounts / value is NaN :', targetValue);
            return;
        };
        if(data[targetName] === undefined || data[targetName] === null) {
            console.log('handleChangeAmounts / name is not in content :', targetName);
            return;
        };
        if(data[targetName] !== value) {
            const updatedAmounts = {
                ...data,
                [targetName]: value
            };
            if (settingForContent.auto_calc) {
                switch(targetName){
                    case 'list_price':
                        updatedAmounts.list_price_dc = (value - data.sub_total_amount) * 100 / value;
                        break;
                    case 'sub_total_amount':
                    {
                        const tempListDc = (data.list_price - value) * 100 / data.list_price;
                        const tempDcAmount = value * settingForContent.dc_rate * 0.01;
                        const tempQuotationAmount = value - tempDcAmount;
                        const tempTaxAmount = settingForContent.vat_included ? tempQuotationAmount * 0.1 : 0;
                        const tempTotalAmount = tempQuotationAmount + tempTaxAmount - data.cutoff_amount;
                        const tempProfit = tempTotalAmount - data.total_cost_price;
                        updatedAmounts.list_dc = tempListDc;
                        updatedAmounts.dc_amount = tempDcAmount;
                        updatedAmounts.quotation_amount = tempQuotationAmount;
                        updatedAmounts.tax_amount = tempTaxAmount;
                        updatedAmounts.total_quotation_amount = tempTotalAmount;
                        updatedAmounts.profit = tempProfit;
                        updatedAmounts.profit_rate = data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0;
                        break;
                    }
                    case 'dc_amount':
                    {
                        const tempQuotationAmount = data.sub_total_amount - value;
                        const tempTaxAmount = settingForContent.vat_included ? tempQuotationAmount * 0.1 : 0;
                        const tempTotalAmount = tempQuotationAmount + tempTaxAmount - data.cutoff_amount;
                        const tempProfit = tempTotalAmount - data.total_cost_price;
                        updatedAmounts.quotation_amount = tempQuotationAmount;
                        updatedAmounts.tax_amount = tempTaxAmount;
                        updatedAmounts.total_quotation_amount = tempTotalAmount;
                        updatedAmounts.profit = tempProfit;
                        updatedAmounts.profit_rate = data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0;
                            break;
                    }
                    case 'quotation_amount':
                    {
                        const tempTaxAmount = settingForContent.vat_included ? value * 0.1 : 0;
                        const tempTotalAmount = value + tempTaxAmount - data.cutoff_amount;
                        const tempProfit = tempTotalAmount - data.total_cost_price;
                        updatedAmounts.tax_amount = tempTaxAmount;
                        updatedAmounts.total_quotation_amount = tempTotalAmount;
                        updatedAmounts.profit = tempProfit;
                        updatedAmounts.profit_rate = data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0;
                        break;
                    }
                    case 'tax_amount':
                    {
                        const tempTotalAmount = data.quotation_amount + value - data.cutoff_amount;
                        const tempProfit = tempTotalAmount - data.total_cost_price;
                        updatedAmounts.total_quotation_amount = tempTotalAmount;
                        updatedAmounts.profit = tempProfit;
                        updatedAmounts.profit_rate = data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0;
                        break;
                    }
                    case 'cutoff_amount':
                    {
                        const tempTotalAmount = data.quotation_amount + data.tax_amount - value;
                        const tempProfit = tempTotalAmount - data.total_cost_price;
                        updatedAmounts.total_quotation_amount = tempTotalAmount;
                        updatedAmounts.profit = tempProfit;
                        updatedAmounts.profit_rate = data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0;
                        break;
                    }
                    case 'total_quotation_amount':
                    {
                        const tempProfit = value - data.total_cost_price;
                        updatedAmounts.profit = tempProfit;
                        updatedAmounts.profit_rate = data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0;
                        break;
                    }
                    case 'total_cost_price':
                    {
                        const tempProfit = data.total_quotation_amount - value;
                        updatedAmounts.profit = tempProfit;
                        updatedAmounts.profit_rate = value !== 0
                            ? tempProfit * 100 / value
                            : 0;
                        break;
                    }
                    case 'profit':
                        const tempProfitRate =  data.total_cost_price !== 0
                            ? value * 100 / data.total_cost_price
                            : 0;
                        updatedAmounts.profit_rate = tempProfitRate;
                        break;
                    default:
                        console.log('handleChangeAmounts / name is not available :', targetName);
                        break;
                };
            };
            handleData(updatedAmounts);
        };
    };

    const handleChangeRates = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        const value = Number(targetValue);
        if(isNaN(value)) {
            console.log('handleChangeRate / value is NaN :', targetValue);
            return;
        };
        if(data[targetName] === undefined || data[targetName] === null) {
            console.log('handleChangeRate / name is not in content :', targetName);
            return;
        };
        if(data[targetName] !== value) {
            const updatedAmounts = {
                ...data,
                [targetName]: value
            };
            if (settingForContent.auto_calc) {
                switch(targetName){
                    case 'list_price_dc':
                        updatedAmounts.sub_total_amount = data.list_price * (1 - value * 0.01);
                        break;
                    case 'dc_rate':
                        const tempDcAmount = data.sub_total_amount * value * 0.01;
                        const tempQuotationAmount = data.sub_total_amount - tempDcAmount;
                        const tempTaxAmount = settingForContent.vat_included ? tempQuotationAmount * 0.1 : 0;
                        const tempTotalAmount = tempQuotationAmount + tempTaxAmount - data.cutoff_amount;
                        const tempProfit = tempTotalAmount - data.total_cost_price;
                        updatedAmounts.dc_amount = tempDcAmount;
                        updatedAmounts.quotation_amount = tempQuotationAmount;
                        updatedAmounts.tax_amount = tempTaxAmount;
                        updatedAmounts.total_quotation_amount = tempTotalAmount;
                        updatedAmounts.profit = tempProfit;
                        updatedAmounts.profit_rate = data.total_cost_price !== 0
                            ? tempProfit * 100 / data.total_cost_price
                            : 0;
                        break;
                    case 'profit_rate':
                        updatedAmounts.profit = data.total_quotation_amount * value * 0.01;
                        break;
                    default:
                        console.log('handleChangeAmounts / name is not available :', targetName);
                        break;
                }
            }
            handleData(updatedAmounts);
        };
    }


    //===== Handles to add, edit and remove content =======================================
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
            title: t('quotation.add_content'),
        });

        setOrgContentModalValues({
            no: "",
            product_class_name: null,
            manufacturer: null,
            model_name: null,
            product_name: null,
            material: null,
            type: null,
            color: null,
            standard: null,
            detail_desc_on_off: "없음",
            unit: null,
            quantity: 0,
            list_price: 0,
            dc_rate: 0,
            unit_price: 0,
            quotation_amount: 0,
            cost_price: 0,
            profit: 0,
            note: null,
            detail_desc: null,
            org_unit_price: 0,
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
            title: t('quotation.modify_content'),
        });

        const tempOrgContentValues = {};
        Object.keys(data).forEach(keyVal => {
            if (!!QuotationContentItems[keyVal]) {
                tempOrgContentValues[ QuotationContentItems[keyVal].name ]
                    = QuotationContentItems[keyVal].type === 'price'
                        || QuotationContentItems[keyVal].type === 'price0'
                        || QuotationContentItems[keyVal].type === 'value'
                        ? Number(data[keyVal]) : data[keyVal]
            } else {
                tempOrgContentValues[keyVal] = data[keyVal];
            };
        });
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

        handleContents(tempContents);
        handleCalculateAmounts(tempContents);
        setSelectedContentRowKeys([]);
    };

    const handleContentModalOk = () => {
        const finalData = {
            ...orgContentModalValues,
            ...editedContentModalValues,
        };
        console.log('handleContentModalOk / input :', finalData);
        if (!finalData.product_name || finalData.product_name === "" || !finalData.quotation_amount ) {
            setMessage({ title: '필요 항목 누락', message: '필요 값 - 제품명 또는 견적 가격 - 이 없습니다.' });
            const tempContents = (
                <>
                    <p>하기 정보는 필수 입력 사항입니다.</p>
                    {(!finalData.product_name || finalData.product_name === "") && <div> - 제품명</div>}
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
            '1': finalData.no,
            '2': finalData.product_class_name,
            '3': finalData.manufacturer,
            '4': finalData.model_name,
            '5': finalData.product_name,
            '6': finalData.material,
            '7': finalData.type,
            '8': finalData.color,
            '9': finalData.standard,
            '10': finalData.detail_desc_on_off,
            '11': finalData.unit,
            '12': finalData.quantity,
            '13': finalData.list_price,
            '14': finalData.dc_rate,
            '15': finalData.unit_price,
            '16': finalData.quotation_amount,
            '17': finalData.cost_price,
            '18': finalData.profit,
            '19': finalData.note,
            '998': finalData.detail_desc,
            index: settingForContent.action === "ADD" ? contents.length : finalData.index,
            org_unit_price: finalData.org_unit_price,
        };
        console.log('handleContentModalOk / updated content :', updatedContent);

        if (settingForContent.action === "ADD") {
            console.log('handleContentModalOk / new index :', finalData.index);
            const updatedContents = contents.concat(updatedContent);
            console.log('handleContentModalOk / updated contents :', updatedContents);
            handleContents(updatedContents);

            if (settingForContent.auto_calc) {
                handleCalculateAmounts(updatedContents);
            };
        } else {  //Update
            console.log('handleContentModalOk / updated index :', finalData.index);
            const updatedContents = [
                ...contents.slice(0, finalData.index),
                updatedContent,
                ...contents.slice(finalData.index + 1,),
            ];
            console.log('handleContentModalOk / updated contents :', updatedContents);
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
                        <Input
                            name='list_price'
                            prefix='&#8361;'
                            defaultValue={data.list_price}
                            value={ConvertCurrency0(data.list_price, settingForContent.show_decimal ? 4 : 0)}
                            disabled={settingForContent.auto_calc}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.total_list_price_dc_rate')}</label>
                        <Input
                            name='list_price_dc'
                            suffix='%'
                            defaultValue={data.list_price_dc}
                            value={data.list_price_dc}
                            disabled={settingForContent.auto_calc}
                            onChange={handleChangeRates}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label>{t('quotation.sub_total_amount')}</label>
                        <Input
                            name='sub_total_amount'
                            prefix='&#8361;'
                            defaultValue={data.sub_total_amount}
                            value={ConvertCurrency0(data.sub_total_amount, settingForContent.show_decimal ? 4 : 0)}
                            disabled={settingForContent.auto_calc}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.dc_rate')}</label>
                        <Input
                            name='dc_rate'
                            suffix='%'
                            defaultValue={data.dc_rate}
                            value={data.dc_rate}
                            onChange={handleChangeRates}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.dc_amount')}</label>
                        <Input
                            name='dc_amount'
                            prefix='&#8361;'
                            defaultValue={data.dc_amount}
                            value={ConvertCurrency0(data.dc_amount, settingForContent.show_decimal ? 4 : 0)}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.quotation_amount')}</label>
                        <Input
                            name='quotation_amount'
                            prefix='&#8361;'
                            defaultValue={data.quotation_amount}
                            value={ConvertCurrency0(data.quotation_amount, settingForContent.show_decimal ? 4 : 0)}
                            disabled={settingForContent.auto_calc}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.tax_amount')}</label>
                        <Input
                            name='tax_amount'
                            prefix='&#8361;'
                            defaultValue={data.tax_amount}
                            value={ConvertCurrency0(data.tax_amount, settingForContent.show_decimal ? 4 : 0)}
                            disabled={settingForContent.auto_calc}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.cutoff_amount')}</label>
                        <Input
                            name='cutoff_amount'
                            prefix='&#8361;'
                            defaultValue={data.cutoff_amount}
                            value={ConvertCurrency0(data.cutoff_amount, settingForContent.show_decimal ? 4 : 0)}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.total_quotation_amount')}</label>
                        <Input
                            name='total_quotation_amount'
                            prefix='&#8361;'
                            defaultValue={data.total_quotation_amount}
                            value={ConvertCurrency0(data.total_quotation_amount, settingForContent.show_decimal ? 4 : 0)}
                            disabled={settingForContent.auto_calc}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.total_cost_price')}</label>
                        <Input
                            name='total_cost_price'
                            prefix='&#8361;'
                            defaultValue={data.total_cost_price}
                            value={ConvertCurrency0(data.total_cost_price, settingForContent.show_decimal ? 4 : 0)}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.profit')}</label>
                        <Input
                            name='profit'
                            prefix='&#8361;'
                            defaultValue={data.profit}
                            value={ConvertCurrency0(data.profit, settingForContent.show_decimal ? 4 : 0)}
                            disabled={settingForContent.auto_calc}
                            onChange={handleChangeAmounts}
                            style={{ width: 180, height: 45 }}
                        />
                    </Space.Compact>
                    <Space.Compact direction="vertical">
                        <label >{t('quotation.profit_rate')}</label>
                        <Input
                            name='profit_rate'
                            suffix='%'
                            defaultValue={data.profit_rate}
                            value={data.profit_rate}
                            disabled={settingForContent.auto_calc}
                            onChange={handleChangeRates}
                            style={{ width: 180, height: 45 }}
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
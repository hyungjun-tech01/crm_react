import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Button, Modal } from 'antd';

import DetailCardItem from '../../constants/DetailCardItem';
import DetailSelectProduct from '../../constants/DetailSelectProduct';


const QuotationContentModal = (props) => {
    const { setting, open, original, edited, handleEdited, handleOk, handleCancel } = props;
    const [t] = useTranslation();


    //===== Handles to edit 'Contents' ==================================================
    const [showDetailDesc, setShowDetailDesc] = useState(false);
    const [tempDetailSpec, setTempDetailSpec] = useState('');

    const detail_spec_desc_select = [{ label: t('common.na'), value: '없음' }, { label: t('common.avail'), value: '있음' }]
    const content_items = showDetailDesc ?
        [
            { name: 'product_name', title: t('purchase.product_name'), detail: {type: 'select', extra: 'long'} },
            { name: 'detail_desc_on_off', title: t('quotation.detail_desc_on_off'), detail: { type: 'select', options: detail_spec_desc_select, extra: 'long' } },
            { name: 'detail_desc', title: t('quotation.detail_desc'), detail: { type: 'textarea', row_no: 8, extra: 'long' } },
            { name: 'quantity', title: t('common.quantity'), detail: { type: 'label', extra: 'long' } },
            { name: 'list_price', title: t('quotation.list_price'), detail: { type: 'label', extra: 'long', price: true, decimal: setting.show_decimal } },
            { name: 'quotation_amount', title: t('quotation.quotation_amount'), detail: { type: 'label', extra: 'long', disabled: true, price: true, decimal: setting.show_decimal } },
        ] :
        [
            { name: 'product_name', title: t('purchase.product_name'), detail: {type: 'select', extra: 'long'} },
            { name: 'detail_desc_on_off', title: t('quotation.detail_desc_on_off'), detail: { type: 'select', options: detail_spec_desc_select, extra: 'long' } },
            { name: 'quantity', title: t('common.quantity'), detail: { type: 'label', extra: 'long' } },
            { name: 'list_price', title: t('quotation.list_price'), detail: { type: 'label', extra: 'long', price: true, decimal: setting.show_decimal } },
            { name: 'quotation_amount', title: t('quotation.quotation_amount'), detail: { type: 'label', extra: 'long', disabled: true, price: true, decimal: setting.show_decimal } },
        ];

    const handleTime = (name, time) => {
        const tempData = {
            ...edited,
            [name]: time,
        };
        handleEdited(tempData)
    };
    const handleSelect = (name, value) => {
        let tempData = { ...edited };
        switch (name) {
            case 'product_name':
                tempData['product_code'] = value.product_code;
                tempData['product_class_name'] = value.product_class_name;
                tempData['product_name'] = value.product_name;
                tempData['cost_price'] = Number(value.cost_price);
                tempData['reseller_price'] = Number(value.reseller_price);
                tempData['list_price'] = setting.unit_vat_included ? Number(value.list_price) / 1.1 : Number(value.list_price);
                tempData['org_unit_price'] = Number(value.list_price);

                setTempDetailSpec(value.detail_desc);
                if (showDetailDesc) {
                    tempData['detail_desc'] = value.detail_desc;
                };
                break;
            case 'detail_desc_on_off':
                setShowDetailDesc(value.value);
                tempData['detail_desc_on_off'] = value.value;

                if (value.value === '있음') {
                    tempData['detail_desc'] = tempDetailSpec;
                } else {
                    delete tempData.detail_desc;;
                };
                break;
            default:
                tempData = {
                    ...edited,
                    [name]: value.value,
                };
                break;
        };
        handleEdited(tempData);
    };
    const handleValue = (event) => {
        const target_name = event.target.name;
        let tempData = { ...edited };
        if (target_name === 'quantity') {
            tempData[target_name] = event.target.value !== '' ? Number(event.target.value) : 0;
            if (!edited['list_price']
                || edited.list_price === ''
                || edited.list_price === 0
            ) {
                if (!original.list_price) {
                    tempData['quotation_amount'] = 0;
                } else {
                    tempData['quotation_amount'] = Number(original.list_price) * tempData.quantity;
                }
            } else {
                tempData['quotation_amount'] = tempData['quantity'] * Number(edited.list_price);
            };
        } else if (target_name === 'list_price') {
            tempData[target_name] = event.target.value !== '' ? Number(event.target.value) : 0;
            if (!edited['quantity'] || edited.quantity === '' || edited.quantity === 0) {
                if (!original.quantity) {
                    tempData['quotation_amount'] = 0;
                } else {
                    tempData['quotation_amount'] = Number(original.quantity) * tempData.list_price;
                }
            } else {
                tempData['quotation_amount'] = tempData['list_price'] * Number(edited.quantity);
            };
        } else {
            tempData[target_name] = event.target.value;
        };
        handleEdited(tempData);
    };


    // ----- useEffect for Production -----------------------------------
    useEffect(() => {
        const show_detail = !!edited['detail_desc_on_off'] ? edited.detail_desc_on_off : original.detail_desc_on_off;
        setShowDetailDesc( show_detail === '있음');

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
        
    }, [edited, original.detail_desc_on_off]);

    return (
        <Modal
            title={setting.title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={edited ? [
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Submit
                </Button>,
            ] : [
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
            ]}
            style={{ top: 120 }}
            width={820}
            zIndex={2001}
        >
            {content_items && content_items.map((item, index) => {
                let modifiedDetail = { ...item.detail };
                if (item.detail.type === 'date') {
                    modifiedDetail['editing'] = handleTime;
                } else if (item.detail.type === 'select') {
                    modifiedDetail['editing'] = handleSelect;
                } else {
                    modifiedDetail['editing'] = handleValue;
                };
                
                if(item.name === 'product_name') {
                    return (
                        <DetailSelectProduct
                            key={index}
                            title={item.title}
                            defaultValue={original[item.name]}
                            name={item.name}
                            edited={edited}
                            detail={modifiedDetail}
                        />
                    );
                };
                
                return (
                    <div key={index} style={{padding: '0.25rem 0'}}>
                        <DetailCardItem
                            title={item.title}
                            defaultValue={original[item.name]}
                            groupValue={item.name === 'product_name' ? original.product_class_name : null}
                            name={item.name}
                            edited={edited}
                            detail={modifiedDetail}
                        />
                    </div>
                );
            })}
        </Modal>
    );
};

export default QuotationContentModal;
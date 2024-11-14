import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Button, Modal } from 'antd';

import DetailCardItem from '../../constants/DetailCardItem';
import DetailSelectProduct from '../../constants/DetailSelectProduct';

import { QuotationContentItems } from '../../repository/quotation';


const QuotationContentModal = (props) => {
    const { setting, open, items, original, edited, handleEdited, handleOk, handleCancel } = props;
    const [t] = useTranslation();


    //===== Handles to edit 'Contents' ==================================================
    const [contentItems, setContentItems] = useState([]);
    const [showDetailDesc, setShowDetailDesc] = useState(false);
    const [tempDetailSpec, setTempDetailSpec] = useState('');

    const detail_spec_desc_select = [
        { label: t('common.na'), value: '없음' },
        { label: t('common.avail'), value: '있음' }
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
                tempData['unit_price'] = tempData['list_price'];
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
        const targetName = event.target.name;
        const targetValue = event.target.value.replace(/[^\d.-]/g, '');
        console.log('handleValue : ', targetValue);
        const tempValue = Number(targetValue);

        let tempData = { ...edited };
        if(isNaN(tempValue)){
            tempData[targetName] = targetValue;
        } else {
            tempData[targetName] = tempValue;
            if(targetName === 'quantity') {
                if(!edited['unit_price']) {
                    if(!!original.unit_price && !isNaN(Number(original.unit_price))) {
                        tempData['quotation_amount'] = Number(original.unit_price) * tempValue;
                    };
                } else {
                    if(!isNaN(Number(edited['unit_price']))) {
                        tempData['quotation_amount'] = Number(edited.unit_price) * tempValue;
                    };
                };
            } else if (targetName === 'unit_price') {
                console.log('- unit price is changed :', tempValue);
                if(!edited['quantity']) {
                    if(!!original.quantity && !isNaN(Number(original.quantity))) {
                        tempData['quotation_amount'] = Number(original.quantity) * tempValue;
                    };
                } else {
                    if(!isNaN(Number(edited['quantity']))) {
                        tempData['quotation_amount'] = Number(edited.quantity) * tempValue;
                    };
                };
            };
        };
         
        handleEdited(tempData);
    };


    // ----- useEffect for Production -----------------------------------
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

    useEffect(() => {
        console.log('QuotationContentModal / useEffect');
        if(!open) return;

        const detailOnOff = !!edited['detail_desc_on_off'] ? edited.detail_desc_on_off : original.detail_desc_on_off;
        const showDetail = ( detailOnOff === '있음');
        setShowDetailDesc(showDetail);

        let tempContentItems = [];
        let needAddproduct = true;

        items.forEach(item => {
            const selectedItem = QuotationContentItems[item.dataIndex];
            if(!selectedItem.content) return;

            if(item.dataIndex === '1') {
                tempContentItems.push({
                    name: QuotationContentItems['1'].name, title: 'No', detail: {type: 'label', extra: 'long'}
                });
                tempContentItems.push({
                    name: 'product_name', title: t('purchase.product_name'), detail: {type: 'select', extra: 'long'} 
                });
                needAddproduct = false;
            } else {
                if(needAddproduct) {
                    tempContentItems.push({
                        name: 'product_name', title: t('purchase.product_name'), detail: {type: 'select', extra: 'long'} 
                    });
                    needAddproduct = false;
                };
                const tempDetail = selectedItem.type === 'label'
                    ? {type: 'label', extra: 'long'}
                    : ( selectedItem.type === 'select'
                        ? { type: 'select', options: detail_spec_desc_select, extra: 'long' }
                        : ( selectedItem.type === 'price'
                            ? { type: 'label', extra: 'long', price: true, decimal: setting.show_decimal }
                            : { type: 'textarea', row_no: 5, extra: 'long' }
                        )
                );
                tempContentItems.push({
                    name: QuotationContentItems[item.dataIndex].name,
                    title: t(QuotationContentItems[item.dataIndex].title),
                    detail: tempDetail
                });
                if(showDetail && selectedItem.name === 'detail_desc_on_off') {
                    const detailDescItem = QuotationContentItems['998'];
                    tempContentItems.push({
                        name: detailDescItem.name,
                        title: t(detailDescItem.title),
                        detail: { type: 'textarea', row_no: 8, extra: 'long' }
                    })
                }
            };
        });
        setContentItems(tempContentItems);
    }, [open, edited, original, items]);

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
            {contentItems.length > 0 && contentItems.map((item, index) => {
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
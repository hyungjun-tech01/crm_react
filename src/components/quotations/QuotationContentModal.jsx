import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { Button, Modal } from 'antd';
import {
    atomProductClassList,
    atomProductClassListState,
    atomProductsState,
    atomProductOptions,
    atomAllProducts,
} from "../../atoms/atoms";
import { ProductClassListRepo, ProductRepo } from "../../repository/product";

import DetailCardItem from '../../constants/DetailCardItem';

const QuotationContentModal = (props) => {
    const { setting, open, original, edited, handleEdited, handleOk, handleCancel } = props;
    const [t] = useTranslation();


    //===== [RecoilState] Related with Product ==========================================
    const productClassState = useRecoilValue(atomProductClassListState);
    const allProductClassList = useRecoilValue(atomProductClassList);
    const { loadAllProductClassList } = useRecoilValue(ProductClassListRepo);
    const productState = useRecoilValue(atomProductsState);
    const allProducts = useRecoilValue(atomAllProducts);
    const { loadAllProducts } = useRecoilValue(ProductRepo);
    const [productOptions, setProductOptions] = useRecoilState(atomProductOptions);


    //===== Handles to edit 'Contents' ==================================================
    const [ showDetailDesc, setShowDetailDesc ] = useState(false);
    const [ tempDetailSpec, setTempDetailSpec ] = useState('');

    const detail_spec_desc_select = [{label:t('common.na'), value:'없음'}, {label:t('common.avail'), value:'있음'}]
    const content_items = showDetailDesc ? 
        [
            { name: 'product_name', title: t('purchase.product_name'), detail: {
                type: 'select', options: productOptions, group: 'product_class_name', extra: 'long' } },
            { name: 'detail_desc_on_off', title: t('quotation.detail_desc_on_off'), detail: { type: 'select', options: detail_spec_desc_select, extra: 'long' } },
            { name: 'detail_desc', title: t('quotation.detail_desc'), detail: { type: 'textarea', row_no:  8, extra: 'long' } },
            { name: 'quantity', title: t('common.quantity'), detail: { type: 'label', extra: 'long' } },
            { name: 'quotation_unit_price', title: t('quotation.quotation_unit_price'), detail: { type: 'label', extra: 'long', price: true, decimal: setting.show_decimal } },
            { name: 'quotation_amount', title: t('quotation.quotation_amount'), detail: { type: 'label', extra: 'long', disabled: true, price: true, decimal: setting.show_decimal } },
        ] :
        [
            { name: 'product_name', title: t('purchase.product_name'), detail: {
                type: 'select', options: productOptions, group: 'product_class_name', extra: 'long' } },
            { name: 'detail_desc_on_off', title: t('quotation.detail_desc_on_off'), detail: { type: 'select', options: detail_spec_desc_select, extra: 'long' } },
            { name: 'quantity', title: t('common.quantity'), detail: { type: 'label', extra: 'long' } },
            { name: 'quotation_unit_price', title: t('quotation.quotation_unit_price'), detail: { type: 'label', extra: 'long', price: true, decimal: setting.show_decimal } },
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
        let tempData = {...edited};
        switch(name){
            case 'product_name':
                tempData['product_code'] = value.value.product_code;
                tempData['product_class_name'] = value.value.product_class_name;
                tempData['product_name'] = value.value.product_name;
                tempData['quotation_unit_price'] = setting.unit_vat_included ? Number(value.value.list_price) / 1.1 : Number(value.value.list_price);
                tempData['org_unit_prce'] = Number(value.value.list_price);
                    
                setTempDetailSpec(value.value.detail_desc);
                if(showDetailDesc){
                    tempData['detail_desc'] = value.value.detail_desc;
                };
                break;
            case 'detail_desc_on_off':
                setShowDetailDesc(value.value);
                tempData['detail_desc_on_off'] =  value.value;

                if(value.value === '있음'){
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
        let tempData = {...edited};
        if(target_name === 'quantity'){
            tempData[target_name] = event.target.value !== '' ? Number(event.target.value) : 0;
            if(!edited['quotation_unit_price'] || edited.quotation_unit_price ==='' || edited.quotation_unit_price === 0){
                if(!original.quotation_unit_price){
                    tempData['quotation_amount'] = 0;
                } else {
                    tempData['quotation_amount'] = Number(original.quotation_unit_price) * tempData.quantity;
                }
            } else {
                tempData['quotation_amount'] = tempData['quantity'] * Number(edited.quotation_unit_price);
            };
        } else if(target_name === 'quotation_unit_price'){
            tempData[target_name] = event.target.value !== '' ? Number(event.target.value) : 0;
            if(!edited['quantity'] || edited.quantity ==='' || edited.quantity === 0){
                if(!original.quantity){
                    tempData['quotation_amount'] = 0;
                } else {
                    tempData['quotation_amount'] = Number(original.quantity) * tempData.quotation_unit_price;
                }
            } else {
                tempData['quotation_amount'] = tempData['quotation_unit_price'] * Number(edited.quantity);
            };
        } else {
            tempData[target_name] = event.target.value;
        };
        handleEdited(tempData);
    };


    // ----- useEffect for Production -----------------------------------
    useEffect(() => {
        console.log('[PurchaseAddModel] useEffect ');
        if ((productClassState & 1) === 0) {
            console.log('[PurchaseAddModel] loadAllProductClassList');
            loadAllProductClassList();
        };
        if ((productState & 1) === 0) {
            console.log('[PurchaseAddModel] loadAllProducts');
            loadAllProducts();
        };
        if (((productClassState & 1) === 1) && ((productState & 1) === 1) && (productOptions.length === 0)) {
            console.log('[PurchaseAddModel] set products for selection');
            const productOptionsValue = allProductClassList.map(proClass => {
                const foundProducts = allProducts.filter(product => product.product_class_name === proClass.product_class_name);
                const subOptions = foundProducts.map(item => {
                    return {
                        label: <span>{item.product_name}</span>,
                        value: { product_code: item.product_code,
                            product_name: item.product_name,
                            product_class_name: item.product_class_name,
                            detail_desc: item.detail_desc ,
                            list_price: item.list_price,
                        }
                    }
                });
                return {
                    label: <span>{proClass.product_class_name}</span>,
                    title: proClass.product_class_name,
                    options: subOptions,
                };
            });
            setProductOptions(productOptionsValue);
        };
        setShowDetailDesc(original.detail_desc_on_off === '있음');
    }, [allProductClassList, allProducts, loadAllProductClassList, loadAllProducts, productClassState, productOptions, productState, setProductOptions, original.detail_desc_on_off]);


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
                return (
                    <DetailCardItem
                        key={index}
                        title={item.title}
                        defaultValue={original[item.name]}
                        groupValue={item.name === 'product_name' ? original.product_class_name : null}
                        name={item.name}
                        edited={edited}
                        detail={modifiedDetail}
                    />
                );
            })}
        </Modal>
    );
};

export default QuotationContentModal;
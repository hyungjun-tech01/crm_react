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
    const { title, open, original, edited, handleEdited, handleOk, handleCancel } = props;
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

    const detail_spec_desc_select = [{label:t('common.na'), value:false}, {label:t('common.avail'), value:true}]
    const content_items = [
        { name: 'product_name', title: t('purchase.product_name'), detail: {
            type: 'select', options: productOptions, group: 'product_class_name', extra: 'modal' } },
        { name: 'detail_desc_on_off', title: t('quotation.detail_desc_on_off'), detail: { type: 'select', options: detail_spec_desc_select, extra: 'modal' } },
        { name: 'detail_desc', title: t('quotation.detail_desc'), detail: { type: 'textarea', row_no:  8, extra: 'modal' } },
        { name: 'quantity', title: t('common.quantity'), detail: { type: 'label', extra: 'modal' } },
        { name: 'quotation_unit_price', title: t('quotation.quotation_unit_price'), detail: { type: 'label', extra: 'modal' } },
        { name: 'quotation_amount', title: t('quotation.quotation_amount'), detail: { type: 'label', extra: 'modal' } },
    ];

    const handleTime = (name, time) => {
        const tempData = {
            ...edited,
            [name]: time,
        };
        handleEdited(tempData)
    };
    const handleSelect = (name, value) => {
        let tempData = {};
        switch(name){
            case 'product_name':
                tempData = {
                    ...edited,
                    ...value.value,
                };
                setTempDetailSpec(value.value.detail_desc);
                if(!showDetailDesc){
                    delete tempData.detail_desc;    
                };
                break;
            case 'detail_desc_on_off':
                setShowDetailDesc(value.value);
                if(value.value){
                    tempData={
                        ...edited,
                        detail_desc: tempDetailSpec,
                        detail_desc_on_off: value.value,
                    };
                } else {
                    tempData={
                        ...edited,
                        detail_desc_on_off: value.value,
                    };
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
        const tempData = {
            ...edited,
            [event.target.name]: event.target.value,
        };
        handleEdited(tempData);
    };

    // ----- useEffect for Production -----------------------------------
    useEffect(() => {
        console.log('[PurchaseAddModel] useEffect / Production');
        if ((productClassState & 1) === 0) {
            console.log('[PurchaseAddModel] loadAllProductClassList');
            loadAllProductClassList();
        };
        if ((productState & 1) === 0) {
            console.log('[PurchaseAddModel] loadAllProducts');
            loadAllProducts();
        };
        if (((productClassState & 1) === 1) && ((productState & 1) === 1) && (productOptions.length === 0)) {
            console.log('[PurchaseAddModel] set companies for selection');
            const productOptionsValue = allProductClassList.map(proClass => {
                const foundProducts = allProducts.filter(product => product.product_class_name === proClass.product_class_name);
                const subOptions = foundProducts.map(item => {
                    return {
                        label: <span>{item.product_name}</span>,
                        value: { product_code: item.product_code, product_name: item.product_name, product_class_name: item.product_class_name, detail_desc: item.detail_desc }
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
    }, [allProductClassList, allProducts, loadAllProductClassList, loadAllProducts, productClassState, productOptions, productState, setProductOptions]);

    return (
        <Modal
            title={title}
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
            style={{ top: 120, width: 240 }}
            zIndex={2001}
        >
            {content_items && content_items.map((item, index) => {
                
                if(item.name === 'detail_desc' && !showDetailDesc) return null;

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
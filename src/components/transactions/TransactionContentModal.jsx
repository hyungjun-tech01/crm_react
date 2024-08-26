import React, { useEffect } from 'react';
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


const TransactionContentModal = (props) => {
    const { setting, open, original, edited, handleEdited, handleOk, handleCancel } = props;
    const [t] = useTranslation();


    //===== [RecoilState] Related with Product ==========================================
    const productClassState = useRecoilValue(atomProductClassListState);
    const allProductClassList = useRecoilValue(atomProductClassList);
    const { tryLoadAllProductClassList } = useRecoilValue(ProductClassListRepo);
    const productState = useRecoilValue(atomProductsState);
    const allProducts = useRecoilValue(atomAllProducts);
    const { tryLoadAllProducts } = useRecoilValue(ProductRepo);
    const [productOptions, setProductOptions] = useRecoilState(atomProductOptions);


    //===== Handles to edit 'Contents' ==================================================
    const content_items = [
        { name: 'transaction_date', title: t('transaction.transaction_date'), detail: { type: 'date', extra: 'long' } },
        { name: 'product_name', title: t('purchase.product_name'), detail: {
                type: 'select', options: productOptions, group: 'product_class_name', extra: 'long'
            }
        },
        { name: 'standard', title: t('common.standard'), detail: { type: 'label', extra: 'long' } },
        { name: 'unit', title: t('common.unit'), detail: { type: 'label', extra: 'long' } },
        { name: 'quantity', title: t('common.quantity'), detail: { type: 'label', extra: 'long' } },
        { name: 'unit_price', title: t('transaction.unit_price'), detail: { type: 'label', extra: 'long' } },
        { name: 'supply_price', title: t('transaction.supply_price'), detail: { type: 'label', extra: 'long', } },
        { name: 'tax_price', title: t('transaction.tax_price'), detail: { type: 'label', extra: 'long', disabled: true } },
        { name: 'total_price', title: t('transaction.total_price'), detail: { type: 'label', extra: 'long', disabled: true } },
        { name: 'memo', title: t('common.note'), detail: { type: 'textarea', extra: 'long', row_no: 3 } },
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
        if(name === 'product_name'){
            tempData['product_class_name'] = value.value.product_class_name;
            tempData['product_name'] = value.value.product_name;
            tempData['unit_price'] = Number(value.value.list_price);
        } else {
            tempData[name] = value.value;
        };

        handleEdited(tempData);
    };
    const handleValue = (event) => {
        const target_name = event.target.name;
        const target_value = event.target.value;
        let tempData = {...edited};
        
        if(target_name === 'unit_price' || target_name === 'quantity' || target_name === 'supply_price'){
            const num_value = Number(target_value);
            if(isNaN(num_value)) return;
            tempData[target_name] = num_value;

            if(target_name === 'unit_price'){
                const qty = edited['quantity'] ? edited['quantity'] : original['quantity'];
                tempData['supply_price'] = qty ? Number(qty) * num_value : 0;
            } else if(target_name === 'quantity'){
                const unit_price = edited['unit_price'] ? edited['unit_price'] : original['unit_price'];
                tempData['supply_price'] = unit_price ? Number(unit_price) * num_value : 0;
            }

            const tax = setting.vat_included ? tempData.supply_price * 0.1 : 0;
            tempData['tax_price'] = tax;
            tempData['total_price'] = tempData.supply_price + tempData.tax_price;
        } else {
            tempData[target_name] = target_value;
        }
        handleEdited(tempData);
    };


    // ----- useEffect for Production -----------------------------------
    useEffect(() => {
        tryLoadAllProductClassList();
        tryLoadAllProducts();

        if (((productClassState & 1) === 1) && ((productState & 1) === 1) && (productOptions.length === 0)) {
            const productOptionsValue = allProductClassList.map(proClass => {
                const foundProducts = allProducts.filter(product => product.product_class_name === proClass.product_class_name);
                const subOptions = foundProducts.map(item => {
                    return {
                        label: <span>{item.product_name}</span>,
                        value: {
                            product_code: item.product_code,
                            product_name: item.product_name,
                            product_class_name: item.product_class_name,
                            detail_desc: item.detail_desc,
                            cost_price: item.const_price,
                            reseller_price: item.reseller_price,
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
    }, [allProductClassList, allProducts, productClassState, productOptions, productState, setProductOptions, original.detail_desc_on_off]);


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

export default TransactionContentModal;
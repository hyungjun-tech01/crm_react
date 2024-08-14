import React from 'react';
import { useTranslation } from "react-i18next";
import { Button, Modal } from 'antd';

import DetailCardItem from '../../constants/DetailCardItem';
import DetailSelectProduct from '../../constants/DetailSelectProduct';


const TransactionContentModal = (props) => {
    const { setting, open, original, edited, handleEdited, handleOk, handleCancel } = props;
    const [t] = useTranslation();


    //===== Handles to edit 'Contents' ==================================================
    const content_items = [
        { name: 'transaction_date', title: t('transaction.transaction_date'), detail: { type: 'date', extra: 'long' } },
        { name: 'product_name', title: t('purchase.product_name'), detail: { type: 'select', extra: 'long' } },
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
            tempData['product_class_name'] = value.product_class_name;
            tempData['product_name'] = value.product_name;
            tempData['unit_price'] = Number(value.list_price);
            // tempData['product_code'] = value.product_code;
            // tempData['cost_price'] = Number(value.cost_price);
            // tempData['reseller_price'] = Number(value.reseller_price);
            // tempData['list_price'] = setting.unit_vat_included ? Number(value.list_price) / 1.1 : Number(value.list_price);
            // tempData['org_unit_prce'] = Number(value.list_price);
        } else {
            tempData[name] = value.value;
        };
        console.log('TransactionContentModal / handleSelect :', tempData);
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
                if(item.name === 'product_name')
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

export default TransactionContentModal;
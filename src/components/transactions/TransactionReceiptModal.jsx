import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Button, Modal } from 'antd';
import DetailCardItem from '../../constants/DetailCardItem';


const TransactionReceiptModal = (props) => {
    const { open, original, edited, handleEdited, handleOk, handleCancel } = props;
    const [t] = useTranslation();
    const [ isCash, setIsCash ] = useState(true);

    const paymentTypeForSelection = [
        {value: '현금', label: t('common.cash')},
        {value: '카드', label: t('common.card')},
    ];

    const content_items = isCash ? 
        [
            { name: 'paid_money', title: t('common.price_1'), detail: {type: 'label',extra: 'modal' } },
            { name: 'payment_type', title: t('transaction.payment_type'), detail: { type: 'select', options: paymentTypeForSelection, extra: 'modal' } },
            { name: 'bank_name', title: t('company.bank_name'), detail: {type: 'label',extra: 'modal' } },
            { name: 'account_owner', title: t('company.account_owner'), detail: {type: 'label',extra: 'modal' } },
            { name: 'account_number', title: t('company.account_code'), detail: {type: 'label',extra: 'modal' } },
        ] :
        [
            { name: 'paid_money', title: t('common.price_1'), detail: {type: 'label',extra: 'modal' } },
            { name: 'payment_type', title: t('transaction.payment_type'), detail: { type: 'select', options: paymentTypeForSelection, extra: 'modal' } },
            { name: 'card_name', title: t('common.card_name'), detail: {type: 'label',extra: 'modal' } },
            { name: 'card_number', title: t('common.card_no'), detail: {type: 'label',extra: 'modal' } },
        ];

    const handleSelect = (name, value) => {
        const tempData = {
            ...edited,
            [name]: value.value,
        };
        handleEdited(tempData);
    };
    const handleValue = (event) => {
        const target_name = event.target.name;
        let tempData = {...edited};
        if(target_name === 'quantity'){
            tempData[target_name] = event.target.value !== '' ? Number(event.target.value) : 0;
            if(!edited['list_price']
                || edited.list_price === ''
                || edited.list_price === 0
            ){
                if(!original.list_price){
                    tempData['quotation_amount'] = 0;
                } else {
                    tempData['quotation_amount'] = Number(original.list_price) * tempData.quantity;
                }
            } else {
                tempData['quotation_amount'] = tempData['quantity'] * Number(edited.list_price);
            };
        } else if(target_name === 'list_price'){
            tempData[target_name] = event.target.value !== '' ? Number(event.target.value) : 0;
            if(!edited['quantity'] || edited.quantity ==='' || edited.quantity === 0){
                if(!original.quantity){
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

    useEffect(() => {
        let tempIsSale = true;
        if(edited && edited['payment_type']){
            if(edited.payment_type === '카드'){
                tempIsSale = false;
            };
        } else {
            if(original && original['payment_type'] && original.payment_type === '카드'){
                tempIsSale = false;
            };
        }
        setIsCash(tempIsSale);
    }, [original, edited]);

    return (
        <Modal
            title={t('transaction.receipt_slip')}
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
            zIndex={2001}
        >
            {content_items && content_items.map((item, index) => {
                let modifiedDetail = { ...item.detail };
                if (item.detail.type === 'select') {
                    modifiedDetail['editing'] = handleSelect;
                } else {
                    modifiedDetail['editing'] = handleValue;
                };
                return (
                    <DetailCardItem
                        key={index}
                        title={item.title}
                        defaultValue={original[item.name]}
                        groupValue={null}
                        name={item.name}
                        edited={edited}
                        detail={modifiedDetail}
                    />
                );
            })}
        </Modal>
    );
};

export default TransactionReceiptModal;
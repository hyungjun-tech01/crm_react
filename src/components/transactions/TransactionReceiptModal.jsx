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
        const tempData = {
            ...edited,
            [target_name]: event.target.value,
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
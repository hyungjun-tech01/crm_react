import React from 'react';
import { useTranslation } from "react-i18next";
import { Button, Modal } from 'antd';
import TransactionView2 from './TransactionView2';

const TransactionPrint = (props) => {
    const { open, handleClose, transaction, contents } = props;
    const [t] = useTranslation();

    return (
        <Modal
            title={t('transaction.receipt_slip')}
            open={open}
            onOk={handleClose}
            onCancel={handleClose}
            footer={[
                <Button key="close" onClick={handleClose}>
                    Close
                </Button>,
            ]}
            style={{ top: 120 }}
            zIndex={2001}
            width={1200}
        >
            <TransactionView2
                transaction={transaction}
                contents={contents}
            />
        </Modal>
    );
};

export default TransactionPrint;
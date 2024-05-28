import React from 'react';
import { Button, Modal } from 'antd';
import DetailCardItem from './DetailCardItem';

const MultiQueryModal = (props) => {
    const {  open, title, handleOk, handleCancel } = props;

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={  [
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Submit
                </Button>,
                ] }
            style={{ top: 120 }}
            zIndex={2001}
        >
            
        </Modal>
    );

};

export default MultiQueryModal;
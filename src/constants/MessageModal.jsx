import React from 'react';
import { Button, Modal } from 'antd';

const MessageModal = (props) => {
    const { title, message, open, handleOk } = props;

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            footer={[
                <Button key="ok" type="primary" onClick={handleOk}>
                    OK
                </Button>,
            ]}
            style={{ top: 120, width: 240 }}
            zIndex={2002}
        >
            {message}
        </Modal>
    );
};

export default MessageModal;
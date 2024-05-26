import React from 'react';
import { Modal } from 'antd';
import DetailCardItem from './DetailCardItem';

const DetailSubModal = (props) => {
    const { items, open, title, handleOk, handleCancel } = props;

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ top: 120 }}
        >
            {items && items.map((item, index ) => 
                <DetailCardItem
                    key={index}
                    defaultText={item.defaultText}
                    edited={item.edited}
                    name={item.name}
                    title={item.title}
                    detail={item.detail}
                    editing={item.editing}
                />
            )}
        </Modal>
    );

};

export default DetailSubModal;
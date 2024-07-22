import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import DetailCardItem from './DetailCardItem';

const DetailSubModal = (props) => {
    const { title, open, item, original, edited, handleEdited, handleOk, handleCancel } = props;

    const handleTime = (name, time) => {
        const tempData = {
            ...edited,
            [name]: time,
        };
        handleEdited(tempData)
    };
    const handleSelect = (name, value) => {
        let tempData = {};
        if(typeof value.value === 'object') {
            tempData = {
                ...edited,
                ...value.value,
            };
        } else {
            tempData = {
                ...edited,
                [name]: value.value,
            };
        }
        handleEdited(tempData);
    };
    const handleValue = (event) => {
        const tempData = {
            ...edited,
            [event.target.name]: event.target.value,
        };
        handleEdited(tempData);
    };

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
            {item && item.map((item, index) => {
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

export default DetailSubModal;
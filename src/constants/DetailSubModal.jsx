import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import DetailCardItem from './DetailCardItem';

const DetailSubModal = (props) => {
    const { title, items, edited, open, handleEditing, handleOk, handleCancel } = props;

    useEffect(()=>{
        console.log('DeailSubModal updated : ', edited);
    }, [edited]);

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={ edited ? [
                    <Button key="cancel" onClick={handleCancel}>
                    Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                    Submit
                    </Button>,
                ]:[
                    <Button key="cancel" onClick={handleCancel}>
                      Cancel
                    </Button>,
                ]}
            style={{ top: 120, width: 240 }}
            zIndex={2001}
        >
            {items && items.map((item, index ) => 
                <DetailCardItem
                    key={index}
                    defaultText={item.defaultText}
                    edited={edited}
                    name={item.name}
                    title={item.title}
                    detail={item.detail}
                    editing={handleEditing}
                />
            )}
        </Modal>
    );

};

export default DetailSubModal;
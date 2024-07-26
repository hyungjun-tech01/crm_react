import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from "react-i18next";
import { Button, Input, List, Modal, Spin } from 'antd';

import { CompanyRepo } from '../repository/company';

const { Search } = Input;

const SelectListModal = (props) => {
    const { title, condition, open, handleChange, handleClose } = props;
    const { t } = useTranslation();

    const { searchCompanies } = useRecoilValue(CompanyRepo);

    const [ loadingState, setLoadingState ] = useState(false);
    const [ listItems, setListItems ] = useState([]);
    const [ selectedItem, setSelectedItem ] = useState({});

    const handleSearch = (input) => {
        console.log('handleSearch');
        if(!condition || !condition['category'] || !condition['item']) {
            console.log('Input data is not proper');
            return;
        };
        setLoadingState(true);
        let response = null;
        switch(condition.category)
        {
            case 'company':
                response = searchCompanies(condition.item, input);
                break;
            default:
                break;
        };
        if(response === null) {
            console.log('Search result is null');
            setLoadingState(false);
            return;
        };
        response.then( res => {
            if(typeof res === 'string') {
                console.log('Fail to search :', res);
                setLoadingState(false);
                return;
            };
            if(Array.isArray(res)){
                console.log('Succeeded to search :', res);
                setListItems(res);
                setLoadingState(false);
            };
        })
    };
    
    const handleOk = () => {
        if(Object.keys(selectedItem).length > 0){
            handleChange(selectedItem);
        };
        handleCancel();
    };

    const handleCancel = () => {
        setListItems([]);
        setSelectedItem({});
        handleClose();
    };

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Submit
                </Button>,
            ]}
            style={{ top: 120, width: 360 }}
            zIndex={2001}
        >
            <Search
                placeholder={t('comment.input_search_text')}
                allowClear
                enterButton
                size="large"
                loading={loadingState}
                onSearch={handleSearch}
                style={{ width: 340, marginBottom: '0.5rem' }}
            />
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <List
                    dataSource={listItems}
                    renderItem={(item, index) => (
                        <List.Item>
                        <List.Item.Meta
                        title={item[condition.item]}
                        />
                    </List.Item>
                    )}
                />
            </div>
        </Modal>
    );
};

export default SelectListModal;
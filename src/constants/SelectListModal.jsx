import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from "react-i18next";
import { Button, Input, List, Modal, Spin } from 'antd';
import classNames from 'classnames';
import { CompanyRepo } from '../repository/company';
import styles from './SelectListModal.module.scss';
import { FiSearch } from 'react-icons/fi';

// const { Search } = Input;

const SelectListModal = (props) => {
    const { title, condition, open, handleChange, handleClose } = props;
    const { t } = useTranslation();

    const { searchCompanies } = useRecoilValue(CompanyRepo);

    const [ inputText, setInputText ] = useState('');
    const [ loadingState, setLoadingState ] = useState(false);
    const [ listItems, setListItems ] = useState([]);
    const [ selectedItem, setSelectedItem ] = useState(null);

    const inputRef = useRef(null);

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
                if(condition.item === 'company_name')
                    response = searchCompanies(condition.item, input);
                break;
            case 'purchase':
                if(condition.item === 'company_name')
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
                const tempItems = res.map((item, idx) => ({ ...item, index: idx}));
                setListItems(tempItems);
                setLoadingState(false);
            };
        })
    };

    const handleClickRow = (data) => {
        console.log('handleClickRow :', data);
        let modifiedData = {index: data.index};
        switch(condition.category)
        {
            case 'company':
                if(condition.item === 'company_name') {
                    modifiedData['company_code'] = data.company_code;
                    modifiedData['company_index'] = data.company_index;
                    modifiedData['company_name'] = data.company_name;
                    modifiedData['company_name_en'] = data.company_name_en;
                    modifiedData['company_zip_code'] = data.company_zip_code;
                    modifiedData['company_address'] = data.company_address;
                    modifiedData['company_phone_number'] = data.company_phone_number;
                    modifiedData['company_fax_number'] = data.company_fax_number;
                };
                break;
            case 'purchase':
                if(condition.item === 'company_name') {
                    modifiedData['company_code'] = data.company_code;
                    modifiedData['company_name'] = data.company_name;
                };
                break;
            default:
                break;
        };
        setSelectedItem(modifiedData);
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

    useEffect(() => {
        if(inputRef.current !== null) {
            inputRef.current.focus();
        };
    }, []);

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
            width={520}
            style={{ top: 120 }}
            zIndex={2001}
        >
            <Input
                ref={inputRef}
                placeholder={t('comment.input_search_text')}
                allowClear
                addonAfter={<div><FiSearch onClick={(e) => handleSearch(inputText)} /></div>}
                onChange={(e) => setInputText(e.target.value)}
                onPressEnter={(e) => handleSearch(inputText)}
            />
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                    marginTop: '0.5rem'
                }}
            >
                { loadingState ? 
                    <Spin tip="Loading" size="large">
                        <div
                        style={{
                            padding: 50,
                            background: "rgba(0, 0, 0, 0.05)",
                            borderRadius: 4,
                        }}
                        />
                    </Spin>
                    :
                    <List
                        dataSource={listItems}
                        renderItem={(item) => 
                            <List.Item
                                className={(selectedItem && (item.index === selectedItem.index)) ?
                                    classNames(styles.ListRow, styles.selected) : styles.ListRow }
                                onClick={() => handleClickRow(item)}
                                onDoubleClick={()=>{handleClickRow(item);handleOk();}}
                            >
                                {item[condition.item]}
                            </List.Item>
                        }
                    />
                }
            </div>
        </Modal>
    );
};

export default SelectListModal;
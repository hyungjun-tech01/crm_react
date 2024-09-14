import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from "react-i18next";
import { Button, Input, List, Modal, Spin } from 'antd';
import classNames from 'classnames';
import { CompanyRepo } from '../repository/company';
import { LeadRepo } from '../repository/lead';
import styles from './SelectListModal.module.scss';
import { FiSearch } from 'react-icons/fi';

// const { Search } = Input;

const SelectListModal = (props) => {
    const { title, condition, open, handleChange, handleClose } = props;
    const { t } = useTranslation();

    const { searchCompanies } = useRecoilValue(CompanyRepo);
    const { searchLeads } = useRecoilValue(LeadRepo);

    const [ inputText, setInputText ] = useState('');
    const [ loadingState, setLoadingState ] = useState(false);
    const [ listItems, setListItems ] = useState([]);
    const [ selectedCategory, setSelectedCategory ] = useState(null);

    const inputRef = useRef(null);

    const handleSearch = (input) => {
        if(!condition || !condition['category'] || !condition['item']) {
            console.log('Input data is not proper');
            return;
        };
        setLoadingState(true);

        let response = null;
        switch(condition.category)
        {
            case 'company':
            case 'lead':
            case 'transaction':
            case 'purchase':
            case 'tax_invoice':
                if(condition.item === 'company_name')
                    response = searchCompanies(condition.item, input);
                break;
            case 'consulting':
            case 'quotation':
                if(condition.item === 'lead_name')
                    response = searchLeads(condition.item, input);
                break;
            default:
                break;
        };
        response.then( res => {
            if(res.result === false) {
                console.log('Fail to search :', res.message);
                setLoadingState(false);
                return;
            };

            let tempItems = null;
            if(condition.item === 'lead_name') {
                tempItems = res.data.map((item, idx) => ({
                    ...item,
                    index: idx,
                    component: <div>{item.lead_name} / {item.company_name}</div>,
                }));
            } else {
                tempItems = res.data.map((item, idx) => ({
                    ...item,
                    index: idx,
                    component: <div>{item[condition.item]}</div>,
                }));
            };
            
            setListItems(tempItems);
            setLoadingState(false);
        })
    };

    const handleClickRow = (data) => {
        let modifiedData = {index: data.index};
        switch(condition.category)
        {
            case 'company':
            case 'lead':
                if(condition.item === 'company_name') {
                    modifiedData['company_code'] = data.company_code;
                    modifiedData['company_index'] = data.company_index;
                    modifiedData['company_name'] = data.company_name;
                    modifiedData['company_name_en'] = data.company_name_en;
                    modifiedData['company_zip_code'] = data.company_zip_code;
                    modifiedData['company_address'] = data.company_address;
                    modifiedData['company_phone_number'] = data.company_phone_number;
                    modifiedData['company_fax_number'] = data.company_fax_number;
                    modifiedData['homepage'] = data.homepage;
                    modifiedData['site_id'] = data.site_id;
                    modifiedData['sales_resource'] = data.sales_resource;
                };
                break;
            case 'consulting':
            case 'quotation':
                if(condition.item === 'lead_name') {
                    modifiedData['company_code'] = data.company_code;
                    modifiedData['company_name'] = data.company_name;
                    modifiedData['lead_code'] = data.lead_code;
                    modifiedData['lead_name'] = data.lead_name;
                    modifiedData['department'] = data.department;
                    modifiedData['position'] = data.position;
                    modifiedData['mobile_number'] = data.mobile_number;
                    modifiedData['phone_number'] = data.phone_number;
                    modifiedData['email'] = data.email;
                    modifiedData['sales_representative'] = data.sales_resource;
                };
                break;
            case 'transaction':
                if(condition.item === 'company_name') {
                    modifiedData['company_code'] = data.company_code;
                    modifiedData['company_name'] = data.company_name;
                    modifiedData['company_address'] = data.company_address;
                    modifiedData['ceo_name'] = data.ceo_name;
                    modifiedData['business_type'] = data.business_type;
                    modifiedData['business_item'] = data.business_item;
                    modifiedData['business_registration_code'] = data.business_registration_code;
                };
                break;
            case 'purchase':
                if(condition.item === 'company_name') {
                    modifiedData['company_code'] = data.company_code;
                    modifiedData['company_name'] = data.company_name;
                };
                break;
            case 'tax_invoice':
                if(condition.item === 'company_name') {
                    modifiedData['company_code'] = data.company_code;
                    modifiedData['company_name'] = data.company_name;
                    modifiedData['company_address'] = data.company_address;
                    modifiedData['ceo_name'] = data.ceo_name;
                    modifiedData['business_type'] = data.business_type;
                    modifiedData['business_item'] = data.business_item;
                    modifiedData['business_registration_code'] = data.business_registration_code;
                };
                break;
            default:
                break;
        };
        setSelectedCategory(modifiedData);
    };
    
    const handleOk = () => {
        if(!selectedCategory || selectedCategory.length === 0) return;
        handleChange(selectedCategory);
        handleCancel();
    };

    const handleCancel = () => {
        setListItems([]);
        setSelectedCategory({});
        handleClose();
    };

    useEffect(() => {
        if(open && inputRef.current !== null) {
            inputRef.current.focus();
        };
    }, [open]);

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
                value={inputText}
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
                                className={(selectedCategory && (item.index === selectedCategory.index)) ?
                                    classNames(styles.ListRow, styles.selected) : styles.ListRow }
                                onClick={() => handleClickRow(item)}
                                onDoubleClick={()=>{handleClickRow(item);handleOk();}}
                            >
                                {item.component}
                            </List.Item>
                        }
                    />
                }
            </div>
        </Modal>
    );
};

export default SelectListModal;
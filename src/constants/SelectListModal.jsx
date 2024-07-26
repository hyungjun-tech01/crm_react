import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from "react-i18next";
import { Button, Input, Modal, Spin, Table } from 'antd';

import { CompanyRepo } from '../repository/company';

const { Search } = Input;

const SelectListModal = (props) => {
    const { title, condition, open, handleChange, handleClose } = props;
    const { t } = useTranslation();

    const { searchCompanies } = useRecoilValue(CompanyRepo);

    const [ loadingState, setLoadingState ] = useState(false);
    const [ listItems, setListItems ] = useState([]);
    const [ selectedItem, setSelectedItem ] = useState({});
    const [ selectedKeys, setSelectedRowKeys ] = useState([]);

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

    const handleClickRow = (data) => {
        console.log('handleClickRow :', data)
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

    const columns = [
        {
            // title: t('company.company_name'),
            dataIndex: 'company_name',
            render: (text, record) => 
                <>{text}</>,
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedKeys,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);

            if (selectedRows.length > 0) {
                // Set data to edit selected consulting ----------------------
                const selectedValue = selectedRows.at(0);
                handleClickRow(selectedValue);
                setSelectedRowKeys([]);   //initialize the selected list about contract
            };
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
            className: "checkbox-red",
        }),
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
            width={520}
            style={{ top: 120 }}
            zIndex={2001}
        >
            <Search
                placeholder={t('comment.input_search_text')}
                allowClear
                loading={loadingState}
                onSearch={handleSearch}
                enterButton
            />
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0 16px',
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
                    <Table
                        rowSelection={rowSelection}
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        dataSource={listItems}
                        rowKey={(record) => record.company_code}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    handleClickRow(record);
                                }, // click row
                                onDoubleClick: (event) => {
                                    handleClickRow(record);
                                    setSelectedRowKeys([]);   //initialize the selected list about contract
                                    handleOk();
                                }, // click row
                            };
                        }}
                    />
                }
            </div>
        </Modal>
    );
};

export default SelectListModal;
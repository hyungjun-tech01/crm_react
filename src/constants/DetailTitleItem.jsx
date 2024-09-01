import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import Select from 'react-select';

import SelectProductModal from './SelectProductModal';

const DetailTitleItem = (props) => {
    const { original, name, title, size, edited, onEditing, type, options, group, disabled } = props;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const classSize = size ? size : "col-md-3";

    let currentValue = null;
    if(edited && edited[name]) {
        currentValue = edited.product_name;
    } else {
        currentValue = original[name];
    };

    if(!type || type ==='text' || type === 'label') {
        return (
            <div className={classSize}>
                <span><b>{title}</b></span>
                <div style={{display: 'flex'}}>
                    <input
                        className='detail-title-input'
                        type="text"
                        placeholder={title}
                        name={name}
                        defaultValue={currentValue}
                        onChange={onEditing}
                    />
                </div>
            </div>
        );
    };
    if(type === 'select' && !!options){
        let defaultOption = null;
        if(!!group){
            const foundIdx = options.findIndex(item => item.title === group);
            if(foundIdx !== -1){
                const groupOptions = options[foundIdx].options;
                const foundIdxSub = groupOptions.findIndex(item => item.value[name] === currentValue);
                if(foundIdxSub !== -1) {
                    defaultOption = groupOptions[foundIdxSub];
                };
            };
        } else {
            if(typeof options[0].value === 'object') {
                const foundIdx = options.findIndex(item => item.value[name] === currentValue);
                if(foundIdx !== -1){
                    defaultOption = options[foundIdx];
                };
            } else {
                const foundIdx = options.findIndex(item => item.value === currentValue);
                if(foundIdx !== -1){
                    defaultOption = options[foundIdx];
                };;
            }
        };
        return (
            <div className={classSize}>
                <span><b>{title}</b></span>
                <div style={{display: 'flex'}}>
                    <Select
                        className='detail-title-select'
                        value={defaultOption}
                        options={options}
                        onChange={onEditing}
                    />
                </div>
            </div>
        );
    };
    if(type ==='product') {
        const current_product_class = (edited && edited['product_class_name'])
            ? edited['product_class_name']
            : (original['product_class_name']);
        const current_product_name = (edited && edited['product_name'])
            ? edited['product_name']
            : original['product_name'];
        return (
            <div className={classSize}>
                <span><b>{title}</b></span>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <label className='detail-title-input'>{currentValue}</label>
                    <div style={{backgroundColor: 'transparent', borderColor: 'transparent', color: '#999',
                        minHeight: '40px', padding: '9pxx 15px', position: 'relative', right: '25px', top: '8px'}}
                        onClick={() => {
                            if(!disabled) setIsPopupOpen(!isPopupOpen)
                        }}
                    >
                        <FiSearch />
                    </div>
                    <SelectProductModal
                        title={title}
                        open={isPopupOpen}
                        handleChange={(data) => {
                            delete data.index;
                            delete data.component;
                            onEditing(name, data);
                        }}
                        current={{
                            product_class_name: current_product_class,
                            product_name: current_product_name,
                        }}
                        handleClose={()=>setIsPopupOpen(false)}
                    />
                </div>
            </div>
        );
    };
};

export default DetailTitleItem;
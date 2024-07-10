import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { Input } from 'antd';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiSearch } from "react-icons/fi";

import PopupPostCode from "./PostCode";

const PopupDom = ({ children }) => {
    const el = document.getElementById('popupDom2');
    return ReactDom.createPortal(children, el);
};

const DateInput = (props) => {
    const { name, addonBefore, onChange, format, showTime, style, value, disabled } = props;
    return (
        <div className="ant-space-item">
            <span className='ant-input-group-wrapper
                ant-input-group-wrapper-outlined
                css-dev-only-do-not-override-1uweeqc'
                style={style}
            >
                <span className='ant-input-wrapper ant-input-group css-dev-only-do-not-override-1uweeqc'>
                    <span className='ant-input-group-addon'>
                        {addonBefore}
                    </span>
                    {showTime ? 
                        <DatePicker
                            className="ant-input css-dev-only-do-not-override-1uweeqc ant-input-outlined"
                            name={ name }
                            selected={ value }
                            onChange={ onChange }
                            dateFormat={ format }
                            showTimeSelect
                            disabled={disabled}
                        /> :
                        <DatePicker
                            className="ant-input css-dev-only-do-not-override-1uweeqc ant-input-outlined"
                            name={ name }
                            selected={ value }
                            onChange={ onChange }
                            dateFormat={ format }
                            disabled={disabled}
                        />
                    }
                </span>
            </span>
        </div>
    );
};

const TextareaInput = (props) => {
    const { name, addonBefore, style, row_no, title, value, onChange, disabled } = props;
    return (
        <div className="ant-space-item" style={style}>
            <span className='ant-input-group-wrapper
                ant-input-group-wrapper-outlined
                css-dev-only-do-not-override-1uweeqc'
            >
                <span className='ant-input-wrapper ant-input-group css-dev-only-do-not-override-1uweeqc'>
                    <span className='ant-input-group-addon'>
                        { addonBefore }
                    </span>
                    <Input.TextArea
                        // className="ant-input detail-input-extra"
                        name={ name }
                        rows={ row_no }
                        placeholder={ title }
                        onChange={ onChange }
                        style={{ backgroundColor: 'white' }}
                        value={ value }
                        disabled={disabled}
                    />
                </span>
            </span>
        </div>
    );
};

const SelectInput = (props) => {
    const { addonBefore, name, style, value, onChange, options, disabled, group } = props;

    let defaultOption = null;
    if(value) {
        if(group.key) {
            const groupOptions = options.filter(item => item.title === group.value);
            if(groupOptions && groupOptions.length > 0) {
                const foundValue = groupOptions[0].options.filter(item => item.value[name] === value);
                if(foundValue && foundValue.length > 0){
                    defaultOption = foundValue[0];
                };
            };
        } else if(typeof options[0].value === 'object'){
            const optionFiltered = options.filter(item => item.value[name] === value);
            if(optionFiltered && optionFiltered.length > 0) {
                defaultOption = optionFiltered[0];
            };
        } else {
            const optionFiltered = options.filter(item => item.value === value);
            if(optionFiltered && optionFiltered.length > 0) {
                defaultOption = optionFiltered[0];
            };
        };
    };
    
    return (
        <div className="ant-space-item"  style={style}>
            <span className='ant-input-group-wrapper
                ant-input-group-wrapper-outlined
                css-dev-only-do-not-override-1uweeqc'
            >
                <span className='ant-input-wrapper ant-input-group css-dev-only-do-not-override-1uweeqc'>
                    <span className='ant-input-group-addon'>
                        {addonBefore}
                    </span>
                    <Select
                        // className="css-dev-only-do-not-override-1uweeqc detail-input-extra"
                        value={defaultOption}
                        options={options}
                        onChange={onChange}
                        disabled={disabled}
                    />
                </span>
            </span>
        </div>
    );
};

const AddressInput = (props) => {
    const { addonBefore, title, name, value, disabled, onChange, style, key_zip } = props;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleChange = (event) => {
        const tempInput={
            [name]: event.target.value
        };
        onChange(tempInput);
    };

    const handleData = (data) =>{
        const tempInput = {
            [name]: data.address,
            [key_zip]: data.zip,
        };
        onChange(tempInput);
    };

    return (
        <div className="ant-space-item" style={style}>
            <span className='ant-input-group-wrapper
                ant-input-group-wrapper-outlined
                css-dev-only-do-not-override-1uweeqc'
            >
                <span className='ant-input-wrapper ant-input-group css-dev-only-do-not-override-1uweeqc'>
                    <span className='ant-input-group-addon'>
                        { addonBefore }
                    </span>
                    <input
                        className="ant-input detail-input-extra"
                        name={ name }
                        placeholder={ title }
                        onChange={ handleChange }
                        style={{ backgroundColor: 'white', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
                        value={ value }
                        disabled={ disabled }
                    />
                    <div className="add-basic-btn" onClick={() => {
                            console.log('Check click!', disabled);
                            if(!disabled) setIsPopupOpen(!isPopupOpen)
                        }}
                    >
                        <FiSearch />
                    </div>
                    <div id="popupDom2">
                        {isPopupOpen && (
                            <PopupDom>
                                <PopupPostCode
                                    onSetData={handleData}
                                    onClose={() => setIsPopupOpen(false)}
                                />
                            </PopupDom>
                        )}
                    </div>
                </span>
            </span>
        </div>
    );
}

const DetailCardItem = (props) => {
    const { title, name, defaultValue, groupValue, edited, detail} = props;
    
    const currentValue = (edited && (edited[name] !== undefined) && (edited[name] !== null))
            ? edited[name]
            : (defaultValue === null ? null :
                (detail.type === 'date'
                    ? ((new Date(defaultValue)).toString() === 'Invalid Date' ? null : new Date(defaultValue))
                    : defaultValue
                ));

    const widthValue = detail['extra'] ? ( detail.extra === 'long' ? 768 : (detail.extra === 'modal' ? 470 : 380)) : 380;

    const SharedProps = {
        name: name,
        addonBefore: <div className='detail-card-before'>{title}</div>,
        value: currentValue,
        disabled: detail.disabled ? detail.disabled : false,
    };

    switch(detail.type)
    {
        case 'label':
            return <Input {...SharedProps} onChange={detail.editing} style={{width: widthValue, height: 38}}/>;
        case 'date':
            const timeformat = detail.time ? "yyyy-MM-dd hh:mm:ss" : "yyyy-MM-dd";
            return <DateInput {...SharedProps} format={ timeformat } showTime={ detail.time } onChange={(date) =>detail.editing(name, date)} style={{width: widthValue, height: 38}}/>;
        case 'textarea':
            return <TextareaInput {...SharedProps} row_no={ detail.row_no ? detail.row_no : 2} onChange={detail.editing} style={detail.extra === 'memo' ? {width: `calc(100% - 380px)`, flexGrow: 1} : {width: widthValue}}/>;
        case 'select':
            const group = {key: detail.group, value: (edited && edited[detail.group]) ? edited[detail.group] : groupValue};
            return <SelectInput {...SharedProps} options={detail.options} group={group} onChange={(selected)=>detail.editing(name, selected)} style={{width: widthValue, height: 38}}/>;
        case 'address':
            return <AddressInput {...SharedProps} title={title} key_zip={detail.key_zip} onChange={detail.editing} style={{width: widthValue, height: 38}} />
        default:
            return null;
    };
};

export default DetailCardItem;
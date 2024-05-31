import React from 'react';
import { Input } from 'antd';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    const { addonBefore, style, value, onChange, options, disabled } = props;
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
                        defaultValue={value}
                        options={options}
                        onChange={onChange}
                        disabled={disabled}
                    />
                </span>
            </span>
        </div>
    );
};

const DetailCardItem = (props) => {
    const { defaultText, edited, name, title, detail, editing, disabled
    } = props;
    
    const currentValue = (edited && edited[name]
            ? edited[name]
            : (detail.type === 'date'
                ? (detail.orgTimeData ? detail.orgTimeData : '')
                : (defaultText ? defaultText : '')));

    const widthValue = detail.extra === 'long' ? 770 : (detail.extra === 'modal' ? 470 : 380);

    const SharedProps = {
        name: name,
        addonBefore: <div className='detail-card-before'>{title}</div>,
        value: currentValue,
        disabled: detail.disabled ? detail.disabled : (disabled ? disabled : false),
    };

    switch(detail.type)
    {
        case 'label':
            return <Input {...SharedProps} onChange={editing} style={{width: widthValue, height: 38}}/>;
        case 'date':
            const timeformat = detail.time ? "yyyy-MM-dd hh:mm:ss" : "yyyy-MM-dd";
            return <DateInput {...SharedProps} format={ timeformat } showTime={ detail.time } onChange={(date) =>detail.timeDateChange(name, date)} style={{width: widthValue, height: 38}}/>;
        case 'textarea':
            return <TextareaInput {...SharedProps} row_no={ detail.row_no ? detail.row_no : 2} onChange={editing} style={detail.extra === 'memo' ? {width: `calc(100% - 380px)`, flexGrow: 1} : {width: widthValue}}/>;
        case 'select':
            return <SelectInput {...SharedProps} options={detail.options} onChange={detail.selectChange} style={{width: widthValue, height: 38}}/>;
        default:
            return null;
    }
};

export default DetailCardItem;
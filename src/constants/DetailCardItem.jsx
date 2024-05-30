import React from 'react';
import { Input } from 'antd';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = (props) => {
    const { name, addonBefore, onChange, format, showTime, style, value } = props;
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
                        /> :
                        <DatePicker
                            className="ant-input css-dev-only-do-not-override-1uweeqc ant-input-outlined"
                            name={ name }
                            selected={ value }
                            onChange={ onChange }
                            dateFormat={ format }
                        />
                    }
                </span>
            </span>
        </div>
    );
};

const TextareaInput = (props) => {
    const { name, addonBefore, style, row_no, title, value, onChange } = props;
    return (
        <div className="ant-space-item">
            <span className='ant-input-group-wrapper
                ant-input-group-wrapper-outlined
                css-dev-only-do-not-override-1uweeqc'
                style={style}
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
                    />
                </span>
            </span>
        </div>
    );
};

const SelectInput = (props) => {
    const { addonBefore, style, value, onChange, options } = props;
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
                    <Select
                        // className="css-dev-only-do-not-override-1uweeqc detail-input-extra"
                        defaultValue={value}
                        options={options}
                        onChange={onChange}
                    />
                </span>
            </span>
        </div>
    );
};

const DetailCardItem = (props) => {
    const { defaultText, edited, name, title, detail, editing
    } = props;
    
    const currentValue = detail.type === 'date'
        ? detail.orgTimeData
        : (edited && edited[name]
            ? edited[name]
            : (defaultText ? defaultText : ''));

    const SharedProps = {
        name: name,
        addonBefore: <div className='detail-card-before'>{title}</div>,
        style: detail.extra === 'long' ? { width: 770 } : (detail.extra === 'modal' ? { width: 470} : { width: 380}),
        value: currentValue,
    };

    switch(detail.type)
    {
        case 'label':
            return <Input {...SharedProps} onChange={editing}/>;
        case 'date':
            const timeformat = detail.time ? "yyyy-MM-dd hh:mm:ss" : "yyyy-MM-dd";
            return <DateInput {...SharedProps} format={ timeformat } showTime={ detail.time } onChange={(date) =>detail.timeDateChange(name, date)} />;
        case 'textarea':
            return <TextareaInput {...SharedProps} row_no={ detail.row_no ? detail.row_no : 2} onChange={editing} />;
        case 'select':
            return <SelectInput {...SharedProps} options={detail.options} onChange={detail.selectChange} />;
        default:
            return null;
    }
};

export default DetailCardItem;
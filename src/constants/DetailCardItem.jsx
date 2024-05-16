import React from 'react';
import { Input, Select } from 'antd';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = (props) => {
    const { name, addonBefore, addonAfter, change, format, showTime, style, value } = props;
    return (
        <div class="ant-space-item">
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
                            onChange={ change }
                            dateFormat={ format }
                            showTimeSelect
                        /> :
                        <DatePicker
                            className="ant-input css-dev-only-do-not-override-1uweeqc ant-input-outlined"
                            name={ name }
                            selected={ value }
                            onChange={ change }
                            dateFormat={ format }
                        />
                    }
                    <span className='ant-input-group-addon'>
                        {addonAfter}
                    </span>
                </span>
            </span>
        </div>
    );
};

const TextareaInput = (props) => {
    const { name, addonBefore, addonAfter, style, row_no, title, value, change, disabled } = props;
    return (
        <div class="ant-space-item">
            <span className='ant-input-group-wrapper
                ant-input-group-wrapper-outlined
                css-dev-only-do-not-override-1uweeqc'
                style={style}
            >
                <span className='ant-input-wrapper ant-input-group css-dev-only-do-not-override-1uweeqc'>
                    <span className='ant-input-group-addon'>
                        { addonBefore }
                    </span>
                    <textarea
                        className="ant-input detail-input-extra"
                        name={ name }
                        rows={ row_no }
                        placeholder={ title }
                        onChange={ change }
                        disabled={ disabled ? true : false}
                        style={{ backgroundColor: 'white' }}
                    >
                        { value }
                    </textarea>
                    <span className='ant-input-group-addon'>
                        { addonAfter }
                    </span>
                </span>
            </span>
        </div>
    );
};

const SelectInput = (props) => {
    const { addonBefore, addonAfter, style, value, change, disabled, options } = props;
    return (
        <div class="ant-space-item">
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
                        className="ant-input css-dev-only-do-not-override-1uweeqc detail-input-extra"
                        defaultValue={value}
                        options={options}
                        onChange={change}
                        disabled={ disabled ? true : false}
                    />
                    <span className='ant-input-group-addon'>
                        {addonAfter}
                    </span>
                </span>
            </span>
        </div>
    );
};

const DetailCardItem = (props) => {
    const { defaultText, edited, saved, name, title, detail,
        checkEdit, startEdit, endEdit,
        editing, checkSaved, cancelSaved
    } = props;

    if(checkEdit && checkEdit(name)) {
        if(detail.type === 'label') {
            return (
                <Input
                    name={ name }
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <SaveAlt onClick={() => { endEdit(name); }}/>}
                    value={ edited[name] }
                    style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                    onChange={ editing }
                    onPressEnter={() => endEdit(name)}
                />
            );
        };
        if(detail.type === 'date') {
            const timeformat = detail.time ? "yyyy-MM-dd hh:mm:ss" : "yyyy-MM-dd";
            return (
                <DateInput
                    name={ name }
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <SaveAlt onClick={() => { detail.endEditTime(name); }}/> }
                    change={ detail.timeDataChange }
                    format={ timeformat }
                    showTime={ detail.time }
                    style={{ width: 375 }}
                    value={ edited[name] }
                />
            );
        };
        if(detail.type === 'textarea') {
            return (
                <TextareaInput
                    name={ name }
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <SaveAlt onClick={() => { endEdit(name); }}/>}
                    style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                    row_no={ detail.row_no ? detail.row_no : 2}
                    title={ title }
                    value={ edited[name] }
                    change={ editing }
                    onPressEnter={() => endEdit(name)}
                />
            );
        };
        return (
            <SelectInput
                name={name}
                addonBefore={ <div className='detail-card-before'>{title}</div> }
                addonAfter={ <SaveAlt onClick={() => { detail.endEditTime(name); }}/> }
                change={ editing }
                style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                options={ detail.options }
                value={ defaultText }
            />
        );
    };
    if(checkSaved && checkSaved(name)) {
        if(detail.type === 'date') {
            const options = detail.time ?
                {year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'} :
                {year: 'numeric', month: 'short', day: 'numeric'};
            const checked_value = (saved[name]) ? (new Date(saved[name])).toLocaleDateString('ko-KR', options) : '';
            return (
                <Input
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <Cancel onClick={() => { cancelSaved(name); }}/>}
                    style={{ width: 375 }}
                    value={ checked_value }
                    onChange={e => e.preventDefault()}
                />
            );
        };
        if(detail.type === 'textarea') {
            return (
                <TextareaInput
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <Cancel onClick={() => { cancelSaved(name); }}/>}
                    style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                    row_no={ detail.row_no ? detail.row_no : 2}
                    title={ title }
                    value={ saved[name] }
                    onChange={e => e.preventDefault()}
                />
            )
        };
        return (
            <Input
                addonBefore={ <div className='detail-card-before'>{title}</div> }
                addonAfter={ <Cancel onClick={() => { cancelSaved(name); }}/>}
                style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                value={ saved[name] }
                onChange={e => e.preventDefault()}
            />
        )
    };

    if(detail.type === 'date') {
        const options = detail.time ?
                {year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'} :
                {year: 'numeric', month: 'short', day: 'numeric'};
        const checked_value = (detail.orgTimeData && detail.orgTimeData !=='')
            ? (new Date(detail.orgTimeData)).toLocaleDateString('ko-KR', options)
            : '';
        return (
            <Input
                addonBefore={ <div className='detail-card-before'>{title}</div> }
                addonAfter={ <Edit onClick={() => { detail.startEditTime(); }}/> }
                style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                value={ checked_value }
                onChange={e => e.preventDefault()}
            />
        );
    };
    if(detail.type === 'textarea') {
        return (
            <TextareaInput
                addonBefore={ <div className='detail-card-before'>{title}</div> }
                addonAfter={ <Edit onClick={() => { startEdit(name); }}/> }
                row_no={ detail.row_no ? detail.row_no : 2}
                style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                title={ title }
                value={ defaultText }
                disabled
            />
        );
    };
    
    return (
        <Input
            addonBefore={ <div className='detail-card-before'>{title}</div> }
            addonAfter={ <Edit onClick={() => { startEdit(name); }}/> }
            style={ detail.extra === 'long' ? { width: 765 } : { width: 375}}
            value={ defaultText ? defaultText : '' }
            onChange={e => e.preventDefault()}
        />
    );
};

export default DetailCardItem;
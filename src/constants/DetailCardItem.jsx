import React, { useRef, forwardRef } from 'react';
import { Input, Select } from 'antd';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = forwardRef((props, ref) => {
    const { name, addonBefore, addonAfter, onChange, format, showTime, style, value } = props;
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
                            ref={ref}
                            name={ name }
                            selected={ value }
                            onChange={ onChange }
                            dateFormat={ format }
                            showTimeSelect
                        /> :
                        <DatePicker
                            className="ant-input css-dev-only-do-not-override-1uweeqc ant-input-outlined"
                            ref={ref}
                            name={ name }
                            selected={ value }
                            onChange={ onChange }
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
});

const TextareaInput = forwardRef((props, ref) => {
    const { name, addonBefore, addonAfter, style, row_no, title, value, onChange, disabled } = props;
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
                    <textarea
                        className="ant-input detail-input-extra"
                        ref={ref}
                        name={ name }
                        rows={ row_no }
                        placeholder={ title }
                        onChange={ onChange }
                        disabled={ disabled }
                        style={{ backgroundColor: 'white' }}
                        value={ value }
                    />
                    <span className='ant-input-group-addon'>
                        { addonAfter }
                    </span>
                </span>
            </span>
        </div>
    );
});

const SelectInput = forwardRef((props, ref) => {
    const { addonBefore, addonAfter, style, value, onChange, disabled, options } = props;
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
                        className="ant-input css-dev-only-do-not-override-1uweeqc detail-input-extra"
                        ref={ref}
                        defaultValue={value}
                        options={options}
                        onChange={onChange}
                        disabled={ disabled ? true : false}
                    />
                    <span className='ant-input-group-addon'>
                        {addonAfter}
                    </span>
                </span>
            </span>
        </div>
    );
});

const DetailCardItem = (props) => {
    const { defaultText, edited, saved, name, title, detail,
        checkEdit, startEdit, endEdit,
        editing, checkSaved, cancelSaved
    } = props;
    
    const inputRef = useRef(null);
    const editChecked = edited && checkEdit(name);
    const saveChecked = saved && checkSaved(name);

    const startEditFunc = detail.type !== 'date'
        ? () => {
            startEdit(name);
            if(detail.type === 'label'){
                console.log('\tDetailCardItem / startEnditFunc :', inputRef.current);
                inputRef.current.focus({cursor: 'end',});
            }
            else {
                console.log('\tDetailCardItem / startEnditFunc :', inputRef.current);
                inputRef.current.focus();
            }
        }
        : () => {
            detail.startEditTime();
            // inputRef.current.focus();
        };
    
    const endEditFunc = detail.type !== 'date'
        ? () => { endEdit(name); }
        : () => { detail.endEditTime(name); };
    
    const changeFunc = detail.type !== 'date'
        ? editing : detail.timeDataChange;
    
    // const options = detail.time ?
    //     {year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'} :
    //     {year: 'numeric', month: 'short', day: 'numeric'};
    
    const currentValue = detail.type === 'date'
        ? detail.orgTimeData : (defaultText ? defaultText : '');
    const editedValue = editChecked ? edited[name] : null;
    const savedValue = saveChecked ? saved[name] : null;
    
    const finalValue = editChecked ? editedValue : (saveChecked ? savedValue : currentValue);

    const SharedProps = {
        name: name,
        addonBefore: <div className='detail-card-before'>{title}</div>,
        addonAfter: editChecked
            ? <SaveAlt onClick={ endEditFunc }/>
            : (saveChecked
                ? <Cancel onClick={() => { cancelSaved(name); }}/>
                : <Edit onClick={ startEditFunc }/>
            ),
        style: detail.extra === 'long' ? { width: 770 } : { width: 380},
        value: finalValue,
        onChange: editChecked ? changeFunc : e => e.preventDefault(),
        onPressEnter: editChecked ? () => endEdit(name) : null,
    };

    if(detail.type === 'label'){
        return <Input {...SharedProps} ref={inputRef} />;
    };

    if(detail.type === 'date'){
        if(finalValue === '') {
            return <Input {...SharedProps} ref={inputRef} />;
        };
        const timeformat = detail.time ? "yyyy-MM-dd hh:mm:ss" : "yyyy-MM-dd";
        return <DateInput {...SharedProps} ref={inputRef} format={ timeformat } showTime={ detail.time } disabled={!editChecked} />;
    };

    if(detail.type === 'textarea'){
        return <TextareaInput {...SharedProps} ref={inputRef} row_no={ detail.row_no ? detail.row_no : 2} disabled={!editChecked}/>;
    };

    return <SelectInput {...SharedProps} ref={inputRef} options={detail.options} disabled={!editChecked}/>;
};

export default DetailCardItem;
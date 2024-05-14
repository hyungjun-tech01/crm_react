import React from 'react';
import { Input } from 'antd';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = (props) => {
    const { addonBefore, addonAfter, styleValue, value, change, format, showTimeSelet } = props;
    return (
        <span className='ant-input-group-wrapper
            ant-input-group-wrapper-outlined
            css-dev-only-do-not-override-1uweeqc'
            style={styleValue}
        >
            <span className='ant-input-wrapper ant-input-group css-dev-only-do-not-override-1uweeqc'>
                <span className='ant-input-group-addon'>
                    {addonBefore}
                </span>
                <DatePicker
                    className="ant-input"
                    selected={ value }
                    onChange={ change }
                    dateFormat={ format }
                    showTimeSelect={showTimeSelet}
                />
                <span className='ant-input-group-addon'>
                    {addonAfter}
                </span>
            </span>
        </span>
    );
};

const DetailCardItem = (props) => {
    const { defaultText, saved, name, title, detail,
        checkEdit, startEdit, endEdit,
        editing, checkSaved, cancelSaved
    } = props;

    if(checkEdit && checkEdit(name)) {
        if(detail.type === 'label') {
            return (
                <Input
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <SaveAlt onClick={() => { endEdit(name); }}/>}
                    defaultValue={ defaultText }
                    name={name}
                    style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                    onChange={editing}
                    onPressEnter={() => endEdit(name)}
                />
            );
        };
        if(detail.type === 'textarea') {
            return (
                <Input.TextArea
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <SaveAlt onClick={() => { endEdit(name); }}/>}
                    autoSize={true}
                    style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                    onChange={editing}
                />
            );
        };
        if(detail.type === 'date') {
            const timeformat = detail.time ? "yyyy-MM-dd hh:mm:ss" : "yyyy-MM-dd";
            return (
                <DateInput
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <SaveAlt onClick={() => { detail.endEditTime(name); }}/> }
                    change={ detail.timeDataChange }
                    format={ timeformat }
                    styleValue={{ width: 375 }}
                    value={ detail.timeData }
                    showTimeSelect={ detail.time }
                />
            );
        };
    };
    if(checkSaved && checkSaved(name)) {
        if(detail.type === 'label') {
            return (
                <Input
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <Cancel onClick={() => { cancelSaved(name); }}/>}
                    style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                    value={ saved[name] }
                />
            )
        };
        if(detail.type === 'textarea') {
            return (
                <Input.TextArea
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <Cancel onClick={() => { cancelSaved(name); }}/>}
                    autoSize={true}
                    style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                    value={ saved[name] }
                />
            )
        };
        if(detail.type === 'date'){
            const options = detail.time ?
                {year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'} :
                {year: 'numeric', month: 'short', day: 'numeric'};
            return (
                <Input
                    addonBefore={ <div className='detail-card-before'>{title}</div> }
                    addonAfter={ <Cancel onClick={() => { cancelSaved(name); }}/>}
                    style={{ width: 375 }}
                    value={ saved[name] && (new Date(saved[name])).toLocaleDateString('ko-KR', options) }
                />
            );
        }
    };

    if(detail.type === 'date'){
        const options = detail.time ?
                {year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'} :
                {year: 'numeric', month: 'short', day: 'numeric'};
        return (
            <Input
                addonBefore={ <div className='detail-card-before'>{title}</div> }
                addonAfter={ <Edit onClick={() => { detail.startEditTime(); }}/> }
                value={ detail.orgTimeData && detail.orgTimeData !=='' && (new Date(detail.orgTimeData)).toLocaleDateString('ko-KR', options)}
                style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
                onClick={(e)=> e.preventDefault()}
            />
        );
    };

    return (
        <Input
            addonBefore={ <div className='detail-card-before'>{title}</div> }
            addonAfter={ <Edit onClick={() => { startEdit(name); }}/> }
            value={ defaultText }
            style={ detail.extra === 'long' ? { width: 760 } : { width: 375}}
            onClick={(e)=> e.preventDefault()}
        />
    );
};

export default DetailCardItem;
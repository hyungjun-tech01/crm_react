import React from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddBasicItem = (props) => {
    const { title, name, defaultValue, options, required, row_no, time , type, long, disabled, onChange } = props;

    switch(type){
        case 'text':
            return (
                <div className={ long ? "col-sm-12" : "col-sm-6"} >
                    <div className="add-basic-item">
                        <div className={ long ? "add-long-title" : "add-basic-title"} >
                            {title}
                            {required && <span className="text-danger">*</span>}
                        </div>
                        <input
                            className={ long ? "add-long-content" : "add-basic-content"}
                            name = {name}
                            type="text"
                            placeholder={title}
                            value={defaultValue ? defaultValue : ''}
                            disabled={disabled ? disabled : false}
                            onChange={onChange}
                        />
                    </div>
                </div>
            );
        case 'textarea':
            return (
                <div className={ long ? "col-sm-12" : "col-sm-6"} >
                    <div className="add-basic-item">
                        <div className={ long ? "add-long-title" : "add-basic-title"} >
                            {title}
                            {required && <span className="text-danger">*</span>}
                        </div>
                        <textarea
                            className={ long ? "add-long-content" : "add-basic-content"}
                            name = {name}
                            placeholder={title}
                            rows={row_no}
                            value={defaultValue ? defaultValue : ''}
                            disabled={disabled ? disabled : false}
                            onChange={onChange}
                        />
                    </div>
                </div>
            );
        case 'select':
            const selected = defaultValue
                ? (typeof options[0].value !== 'object'
                    ? options.filter(item => item.value === defaultValue)[0]
                    : options.filter(item => item.value[name] === defaultValue)[0])
                : null;
            return (
                <div className={ long ? "col-sm-12" : "col-sm-6"} >
                    <div className="add-basic-item">
                        <div className={ long ? "add-long-title" : "add-basic-title"} >
                            {title}
                            {required && <span className="text-danger">*</span>}
                        </div>
                        <Select
                            className="add-basic-select"
                            name={name}
                            options={options}
                            value={selected}
                            isDisabled={disabled ? disabled : false}
                            onChange={(selected) => onChange(name, selected)}
                        />
                    </div>
                </div>
            );
        case 'date':
            return (
                <div className={ long ? "col-sm-12" : "col-sm-6"} >
                    <div className="add-basic-item">
                        <div className={ long ? "add-long-title" : "add-basic-title"} >
                            {title}
                            {required && <span className="text-danger">*</span>}
                        </div>
                        <div className='add-basic-date-wrapper'>
                        {time ? 
                            <DatePicker
                                className="add-basic-date"
                                name = {name}
                                selected={defaultValue}
                                disabled={disabled ? disabled : false}
                                onChange={(date) => onChange(name, date)}
                                dateFormat="yyyy-MM-dd hh:mm:ss"
                                showTimeSelect
                            /> : 
                            <DatePicker
                                className="add-basic-date"
                                name = {name}
                                selected={defaultValue}
                                onChange={(date) => onChange(name, date)}
                                dateFormat="yyyy-MM-dd"
                            /> 
                        }
                        </div>
                    </div>
                </div>
            );
        case 'password':
            return (
                <div className={ long ? "col-sm-12" : "col-sm-6"} >
                    <div className="add-basic-item">
                        <div className={ long ? "add-long-title" : "add-basic-title"} >
                            {title}
                            {required && <span className="text-danger">*</span>}
                        </div>
                        <input
                            className={ long ? "add-long-content" : "add-basic-content"}
                            name = {name}
                            type="password"
                            placeholder={title}
                            value={defaultValue ? defaultValue : ''}
                            disabled={disabled ? disabled : false}
                            onChange={onChange}
                        />
                    </div>
                </div>
            );    
        default: 
              return null;
    }
  };

  export default AddBasicItem;
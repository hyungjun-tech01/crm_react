import React from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddBasicItem = (props) => {
    const { long, name, options, required, row_no, time, title, type, onChange } = props;

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
                            onChange={onChange}
                        />
                    </div>
                </div>
            );
        case 'select':
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
                            onChange={onChange}
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
                        {time.time ? 
                            <DatePicker
                                className="add-basic-date"
                                name = {name}
                                selected={time.data}
                                onChange={onChange}
                                dateFormat="yyyy-MM-dd hh:mm:ss"
                                showTimeSelect
                            /> : 
                            <DatePicker
                                className="add-basic-date"
                                name = {name}
                                selected={time.data}
                                onChange={onChange}
                                dateFormat="yyyy-MM-dd"
                            /> 
                        }
                        </div>
                    </div>
                </div>
            );
        default: 
              return null;
    }
  };

  export default AddBasicItem;
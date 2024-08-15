import React, {  useState , useCallback} from "react";
import { Button, Modal, Checkbox, CheckboxProps } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from "react-select";
import { ColumnQueryCondition } from "../repository/company";
import { useTranslation } from "react-i18next";

import AddBasicItem from "./AddBasicItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const QueryRow = ({ index, column, columnQueryCondition, columnValue, columnQueryConditionValue, multiQueryInputValue, andOrValue, onColumnChange, onColumnQueryConditionChange, onMultiQueryInputChange, onAndOrChange, onDelete }) => (
  <tr>
    <td>
      <Select options={column} value={columnValue} onChange={(value) => onColumnChange(index, value)} />
    </td>
    <td>
      <Select options={columnQueryCondition} value={columnQueryConditionValue} onChange={(value) => onColumnQueryConditionChange(index, value)} />
    </td>
    <td>
      <input
        autoFocus
        type="text"
        className="form-control form-control-sm"
        value={multiQueryInputValue}
        onChange={(e) => onMultiQueryInputChange(index, e.target.value)}
      />
    </td>
    <td>
      <Button type="primary" onClick={() => onAndOrChange(index)}>
        {andOrValue}
      </Button>
    </td>
    <td>
      <Button  onClick={() => onDelete(index)}>
        <DeleteIcon/>
      </Button>
    </td>
  </tr>
);

const DateRangePicker = ({ checked, onChange, label, fromDate, toDate, handleFromDateChange, handleToDateChange }) => (
  <div style={{ display: 'flex', alignItems: 'center' , marginTop: '5px'}}>
    <div style={{ width: '200px' }}>
      <Checkbox checked={checked}  onChange={()=>{onChange(!checked)}} style={{ width: '200px' }}>
        {label}
      </Checkbox>
    </div>
    <div style={{ width: '150px', marginRight: '3px' }}>
      <DatePicker
        className="basic-date"
        selected={fromDate}
        onChange={handleFromDateChange}
        dateFormat="yyyy-MM-dd"
      />
    </div>
    ~
    <div style={{ width: '150px', marginLeft: '3px' }}>
      <DatePicker
        className="basic-date"
        selected={toDate}
        onChange={handleToDateChange}
        dateFormat="yyyy-MM-dd"
      />
    </div>
  </div>
);

const SingleDatePicker = ({ checked, onChange, label, fromDate, handleFromDateChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginTop:'5px' }}>
    <div style={{ width: '200px' }}>
      <Checkbox checked={checked}  onChange={()=>{onChange(!checked)}} style={{ width: '200px' }}>
        {label}
      </Checkbox>
    </div>
    <div style={{ width: '150px', marginRight: '3px' }}>
      <DatePicker
        className="basic-date"
        selected={fromDate}
        onChange={handleFromDateChange}
        dateFormat="yyyy-MM-dd"
      />
    </div>
  </div>
);


const MultiQueryModal = (props) => {
    const {  open, title, handleOk, handleCancel, companyColumn, queryConditions, setQueryConditions, 
            dates, setDates, dateRangeSettings,  initialState, 
            singleDate , setSingleDate, singleDateSettings , initialSingleDate} = props;

    const { t } = useTranslation();

    const handleSelectColumn = (index, value) => {
      const newConditions = [...queryConditions];
      newConditions[index].column = value;
      setQueryConditions(newConditions);
    };
  
    const handleSelectColumnQueryCondition = (index, value) => {
      const newConditions = [...queryConditions];
      newConditions[index].columnQueryCondition = value;
      setQueryConditions(newConditions);
    };
  
    const handleMultiQueryInput = (index, value) => {
      const newConditions = [...queryConditions];
      newConditions[index].multiQueryInput = value;
      setQueryConditions(newConditions);
    };
  
    const handleAndOr = (index) => {
      const newConditions = [...queryConditions];
      newConditions[index].andOr = newConditions[index].andOr === 'And' ? 'Or' : 'And';
      setQueryConditions(newConditions);
    };  

    const onDelete  = (index) => {
      const newConditions = [...queryConditions];
      newConditions[index].column = "";
      newConditions[index].columnQueryCondition = "";
      newConditions[index].multiQueryInput = "";
      newConditions[index].andOr = "And";
      setQueryConditions(newConditions);
    }

    const handleInitial = () => {
      for (let i = 0; i < queryConditions.length; i++) {
        onDelete(i);
      }
      setDates(initialState);
      setSingleDate(initialSingleDate);
    }

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    //check box 
    // const [maNonExtendedchecked, setMaNonExtendedchecked] = useState(false);
    // // date 
    // const [maNonExtendedDate, setMaNonExtendDate] = useState(oneMonthAgo);
    // const handleMaNonExtendedDate = useCallback((date) => {
    //   setMaNonExtendDate(date);
    // }, []);   


const handleDateChange = (key, dateType, date) => {
  setDates((prevDates) => {
    const updatedDates = {
      ...prevDates,
      [key]: {
        ...prevDates[key],
        [dateType]: date,
      },
    };
    console.log(`Updated dates for ${key}:`, updatedDates[key]);
    return updatedDates;
  });
};

const handleCheckedChange = (key) => {
  setDates((prevDates) => {
    const updatedDates = {
      ...prevDates,
      [key]: {
        ...prevDates[key],
        checked: !prevDates[key].checked,
      },
    };
    console.log(`Updated checked state for ${key}:`, updatedDates[key].checked);
    return updatedDates;
  });
};

const handleSingleDateChange = (key, dateType, date) => {
  setSingleDate((prevDates) => {
    const updatedDates = {
      ...prevDates,
      [key]: {
        ...prevDates[key],
        [dateType]: date,
      },
    };
    console.log(`Updated dates for ${key}:`, updatedDates[key]);
    return updatedDates;
  });
};

const handleSingleCheckedChange = (key) => {
  setSingleDate((prevDates) => {
    const updatedDates = {
      ...prevDates,
      [key]: {
        ...prevDates[key],
        checked: !prevDates[key].checked,
      },
    };
    console.log(`Updated checked state for ${key}:`, updatedDates[key].checked);
    return updatedDates;
  });
};

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            footer={  [
                <Button key="init" onClick={handleInitial}>
                  Initialize
                </Button>,
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Submit
                </Button>,
                ] }
            style={{ top: 120 }}
            zIndex={2001}
        >
          <table className="table table-striped table-nowrap custom-table mb-0 datatable">
            <thead>
              <tr>
                <th>{t('common.item')}</th>
                <th>{t('common.condition')}</th>
                <th>{t('common.value')}</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {queryConditions.map((condition, index) => (
              <QueryRow
                key={index}
                index={index}
                column={companyColumn}
                columnQueryCondition={ColumnQueryCondition}
                columnValue={condition.column}
                columnQueryConditionValue={condition.columnQueryCondition}
                multiQueryInputValue={condition.multiQueryInput}
                andOrValue={condition.andOr}
                onColumnChange={handleSelectColumn}
                onColumnQueryConditionChange={handleSelectColumnQueryCondition}
                onMultiQueryInputChange={handleMultiQueryInput}
                onAndOrChange={handleAndOr}
                onDelete = {onDelete}
              />
              ))}       
              </tbody>
              </table>     

              {dateRangeSettings.map((setting) => (
                <div key={setting.stateKey}>
                  <DateRangePicker
                    checked={dates[setting.stateKey].checked}
                    onChange={() => handleCheckedChange(setting.stateKey)}
                    label={setting.label}
                    fromDate={dates[setting.stateKey].fromDate}
                    toDate={dates[setting.stateKey].toDate}
                    handleFromDateChange={(date) => handleDateChange(setting.stateKey, 'fromDate', date)}
                    handleToDateChange={(date) => handleDateChange(setting.stateKey, 'toDate', date)}
                  />
                </div>
              ))}

              {singleDateSettings.map((setting) => (
                <div key={setting.stateKey}>
                  <SingleDatePicker
                    checked={singleDate[setting.stateKey].checked}
                    onChange={() => handleSingleCheckedChange(setting.stateKey)}
                    label={setting.label}
                    fromDate={singleDate[setting.stateKey].fromDate}
                    handleFromDateChange={(date) => handleSingleDateChange(setting.stateKey, 'fromDate', date)}
                  />
                </div>
              ))}

                                                             
        </Modal>
    );

};

export default MultiQueryModal;
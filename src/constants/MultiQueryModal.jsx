import React, {  useState , useCallback} from "react";
import { Button, Modal, Checkbox, CheckboxProps } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from "react-select";
import { companyColumn, ColumnQueryCondition } from "../repository/company";
import { useTranslation } from "react-i18next";
import { formatDate } from "./functions";
import AddBasicItem from "./AddBasicItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const QueryRow = ({ index, companyColumn, columnQueryCondition, companyColumnValue, columnQueryConditionValue, multiQueryInputValue, andOrValue, onCompanyColumnChange, onColumnQueryConditionChange, onMultiQueryInputChange, onAndOrChange, onDelete }) => (
  <tr>
    <td>
      <Select options={companyColumn} value={companyColumnValue} onChange={(value) => onCompanyColumnChange(index, value)} />
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
  <div style={{ display: 'flex', alignItems: 'center' }}>
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

const MultiQueryModal = (props) => {
    const {  open, title, handleOk, handleCancel, setQueryString } = props;

    const { t } = useTranslation();

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [queryConditions, setQueryConditions] = useState([
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    ]);

    //  
    const dateRangeSettings = [
      { label: t('purchase.registration_date'), stateKey: 'registration_date', checked: false },
      { label: t('purchase.delivery_date'), stateKey: 'delivery_date', checked: false },
      { label: t('purchase.hq_finish_date'), stateKey: 'hq_finish_date', checked: false },
      { label: t('purchase.ma_finish_date'), stateKey: 'ma_finish_date', checked: false },
    ];
    const initialState = {
      registration_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
      delivery_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
      hq_finish_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
      ma_finish_date: { fromDate: oneMonthAgo, toDate: today, checked: false },
    };

    const [dates, setDates] = useState(initialState);

    const handleSelectCompanyColumn = (index, value) => {
      const newConditions = [...queryConditions];
      newConditions[index].companyColumn = value;
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
      newConditions[index].companyColumn = "";
      newConditions[index].columnQueryCondition = "";
      newConditions[index].multiQueryInput = "";
      newConditions[index].andOr = "And";
      setQueryConditions(newConditions);
    }

    const handleSubmit = () => {
      console.log(queryConditions);
      let queryString = "";
      for (const i of queryConditions){
        console.log("i", i.companyColumn.value);
        if( i.companyColumn.value !== undefined || i.companyColumn.value !== null || i.companyColumn.value !== ""){
          if ( i.columnQueryCondition.value === "like")
            queryString = queryString 
                     + i.companyColumn.value + " "
                     + i.columnQueryCondition.value + " "
                     + "'%" + i.multiQueryInput + "%'" + " " + i.andOr + " ";
          if ( i.columnQueryCondition.value === "is null" || i.columnQueryCondition.value === "is not null")
            queryString = queryString 
                    + i.companyColumn.value + " "
                    + i.columnQueryCondition.value + " " + i.andOr + " ";
          if ( i.columnQueryCondition.value === "=")
            queryString = queryString 
                     + i.companyColumn.value + " "
                     + i.columnQueryCondition.value + " "
                     + "'" + i.multiQueryInput + "'" + " " + i.andOr + " ";
        }
      }
      console.log("queryString", queryString);
      const checkedDates = Object.keys(dates).filter(key => dates[key].checked).map(key => ({
        label: key,
        fromDate: dates[key].fromDate,
        toDate: dates[key].toDate,
        checked: dates[key].checked,
      }));

      for (const i of checkedDates){
        console.log(formatDate(i.fromDate), formatDate(i.toDate));
        queryString = queryString
                   +"(" + i.label + " between " 
                   +"'"+ formatDate(i.fromDate) +"'" + " and " + "'" + formatDate(i.toDate) + "' )" +" And ";
      }
      console.log('queryString:', queryString.replace(/And\s*$/, ''));
      setQueryString(queryString.replace(/And\s*$/, ''));
      handleOk;
    }

    //check box 
    const [maNonExtendedchecked, setMaNonExtendedchecked] = useState(false);
    // date 
    const [maNonExtendedDate, setMaNonExtendDate] = useState(oneMonthAgo);
    const handleMaNonExtendedDate = useCallback((date) => {
      setMaNonExtendDate(date);
    }, []);   


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

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            footer={  [
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
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
                companyColumn={companyColumn}
                columnQueryCondition={ColumnQueryCondition}
                companyColumnValue={condition.companyColumn}
                columnQueryConditionValue={condition.columnQueryCondition}
                multiQueryInputValue={condition.multiQueryInput}
                andOrValue={condition.andOr}
                onCompanyColumnChange={handleSelectCompanyColumn}
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
              <div style={{ display: 'flex', alignItems: 'center' }}> 
                <div style={{ width: '200px' }}>
                  <Checkbox checked={maNonExtendedchecked}  onChange={()=>setMaNonExtendedchecked(!maNonExtendedchecked)} style={{width:'200px'}}>
                    {t('company.ma_non_extended')} : 
                  </Checkbox>
                </div>
                <div style={{ width: '150px',marginRight:'3px'}}>
                  <DatePicker
                      className="basic-date"
                      name = 'maNonExtendedDate'           
                      selected={maNonExtendedDate}
                      onChange={handleMaNonExtendedDate}
                      dateFormat="yyyy-MM-dd"
                  /> 
                </div>
              </div>                                                                 

        </Modal>
    );

};

export default MultiQueryModal;
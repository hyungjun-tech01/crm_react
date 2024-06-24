import React, {  useState , useCallback} from "react";
import { Button, Modal, Checkbox, CheckboxProps } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from "react-select";
import { companyColumn, ColumnQueryCondition } from "../repository/company";
import { useTranslation } from "react-i18next";
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
    const {  open, title, handleOk, handleCancel } = props;

    const { t } = useTranslation();

    const [queryConditions, setQueryConditions] = useState([
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    ]);


  //   const add_purchase_items = [
  //     ['registration_date', 'purchase.registration_date',
  //         { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],
  //     ['delivery_date', 'purchase.delivery_date',
  //         { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],
  //     ['hq_finish_date', 'purchase.hq_finish_date',
  //         { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],
  //     ['ma_finish_date', 'purchase.ma_finish_date',
  //         { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],
  //     ['ma_non_extended', 'purchase.ma_non_extended',
  //         { type: 'date', orgTimeData: null, timeDateChange: handleNewItemDateChange }],    
  // ];

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
    }

    //check box 
    const [regDatechecked, setRegDatechecked] = useState(true);
    const [deliDatechecked, setDeliDatechecked] = useState(true);
    const [hqFinishDatechecked, setHqFinishDatechecked] = useState(true);
    const [maFinishDatechecked, setMaFinishDatechecked] = useState(true);


    const [checked, setChecked] = useState(true);
    const [disabled, setDisabled] = useState(false);
  
    const toggleChecked = () => {
      setChecked(!checked);
    };
  
    const toggleDisable = () => {
      setDisabled(!disabled);
    };
  
    const onChange = (e) => {
      console.log('checked = ', e.target.checked);
      setChecked(e.target.checked);
    };
  
    const label = `${checked ? 'Checked' : 'Unchecked'}-${disabled ? 'Disabled' : 'Enabled'}`;

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
  
    const [registrationFromDate, setRegistrationFromDate] = useState(oneMonthAgo);
    const handleRegistrationDateFromChange = useCallback((date) => {
      setRegistrationFromDate(date);
    }, []);
    const [registrationToDate, setRegistrationToDate] = useState(today);
    const handleRegistrationDateToChange = useCallback((date) => {
      setRegistrationToDate(date);
    }, []);

    const [deliveryFromDate, setDeliveryFromDate] = useState(oneMonthAgo);
    const handleDeliveryFromDateChange = useCallback((date) => {
      setDeliveryFromDate(date);
    }, []);    
    const [deliveryToDate, setDeliveryToDate] = useState(today);
    const handleDeliveryToDateChange = useCallback((date) => {
      setDeliveryToDate(date);
    }, []);        

    const [hqFindishFromDate, setHqFindishFromDate] = useState(oneMonthAgo);
    const handleHqFindishFromDate = useCallback((date) => {
      setHqFindishFromDate(date);
    }, []);    
    const [hqFindishToDate, setHqFindishToDate] = useState(today);
    const handleHqFindishToDate = useCallback((date) => {
      setHqFindishToDate(date);
    }, []);     

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

              <DateRangePicker
                checked={regDatechecked}
                onChange={setRegDatechecked}
                label={t('purchase.registration_date')}
                fromDate={registrationFromDate}
                toDate={registrationToDate}
                handleFromDateChange={handleRegistrationDateFromChange}
                handleToDateChange={handleRegistrationDateToChange}
              />

              <DateRangePicker
                checked={deliDatechecked}
                onChange={setDeliDatechecked}
                label={t('purchase.delivery_date')}
                fromDate={deliveryFromDate}
                toDate={deliveryToDate}
                handleFromDateChange={handleDeliveryFromDateChange}
                handleToDateChange={handleDeliveryToDateChange}
              />

              <DateRangePicker
                checked={hqFinishDatechecked}
                onChange={setHqFinishDatechecked}
                label={t('purchase.hq_finish_date')}
                fromDate={hqFindishFromDate}
                toDate={hqFindishToDate}
                handleFromDateChange={handleHqFindishFromDate}
                handleToDateChange={handleHqFindishToDate}
              />

              <DateRangePicker
                checked={maFinishDatechecked}
                onChange={setMaFinishDatechecked}
                label={t('purchase.ma_finish_date')}
                fromDate={hqFindishFromDate}
                toDate={hqFindishToDate}
                handleFromDateChange={handleHqFindishFromDate}
                handleToDateChange={handleHqFindishToDate}
              />
        
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '200px' }}>
                  <Checkbox checked={checked} disabled={disabled} onChange={onChange} style={{width:'200px'}}>
                    {t('purchase.ma_finish_date')} : 
                  </Checkbox>
                </div>
                <div style={{ width: '150px',marginRight:'3px'}}>
                  <DatePicker
                      className="basic-date"
                      name = 'deliveryFromDate'           
                      selected={deliveryFromDate}
                      onChange={handleDeliveryFromDateChange}
                      dateFormat="yyyy-MM-dd"
                  /> 
                </div>
                ~
                <div style={{ width: '150px',marginLeft:'3px'}}>
                  <DatePicker
                        className="basic-date"
                        name = 'deliveryToDate'
                        selected={deliveryToDate}
                        onChange={handleDeliveryToDateChange  }
                        dateFormat="yyyy-MM-dd"
                    /> 
                </div>
              </div>   
              <div style={{ display: 'flex', alignItems: 'center' }}> 
                <div style={{ width: '200px' }}>
                  <Checkbox checked={checked} disabled={disabled} onChange={onChange} style={{width:'200px'}}>
                    {t('company.ma_non_extended')} : 
                  </Checkbox>
                </div>
                <div style={{ width: '150px',marginRight:'3px'}}>
                  <DatePicker
                      className="basic-date"
                      name = 'deliveryFromDate'           
                      selected={deliveryFromDate}
                      onChange={handleDeliveryFromDateChange}
                      dateFormat="yyyy-MM-dd"
                  /> 
                </div>
              </div>                                                                 

        </Modal>
    );

};

export default MultiQueryModal;
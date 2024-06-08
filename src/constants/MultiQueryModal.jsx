import React, {  useState , useCallback} from "react";
import { Button, Modal } from 'antd';
import Select from "react-select";
import { companyColumn, ColumnQueryCondition } from "../repository/company";
import { useTranslation } from "react-i18next";

const QueryRow = ({ index, companyColumn, columnQueryCondition, companyColumnValue, columnQueryConditionValue, multiQueryInputValue, andOrValue, onCompanyColumnChange, onColumnQueryConditionChange, onMultiQueryInputChange, onAndOrChange }) => (
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
  </tr>
);


const MultiQueryModal = (props) => {
    const {  open, title, handleOk, handleCancel } = props;

    const { t } = useTranslation();

    const [queryConditions, setQueryConditions] = useState([
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
      { companyColumn: '', columnQueryCondition: '', multiQueryInput: '', andOr: 'And' },
    ]);

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

    const handleSubmit = () => {
      console.log(queryConditions);
    }
  
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
              />
              ))}       
              <tr>
                등록일 : 날짜 ~ 날짜 
              </tr>                  
            </tbody>
          </table>
        </Modal>
    );

};

export default MultiQueryModal;
import React, {  useState , useCallback} from "react";
import { Button, Modal } from 'antd';
import Select from "react-select";
import { KeyManForSelection } from "../repository/lead";
import { companyColumn, ColumnQueryCondition } from "../repository/company";
import { useTranslation } from "react-i18next";


const MultiQueryModal = (props) => {
    const {  open, title, handleOk, handleCancel } = props;

    const { t } = useTranslation();
    const [selectedKeyMan, setSelectedKeyMan] = useState([]);
    const [leadChange, setLeadChange ] = useState(null);

    const handleSelectKeyMan = useCallback((value) => {
        const selected = value.value;
      },[leadChange]);

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            footer={  [
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onPress={handleOk}>
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
              <tr>
                <td><Select  options={companyColumn} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><Select  options={ColumnQueryCondition} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><div><input
                        autoFocus
                        type= "text"
                        className="form-control form-control-sm"
                        name= "multiQueryInput1"
                        defaultValue=""/></div>
                </td>
                <td>
                  <Button key="and_or1" type="primary" onClick={handleOk}>
                  And
                  </Button>
                </td>
              </tr>
              <tr>
                <td><Select  options={companyColumn} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><Select  options={ColumnQueryCondition} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><div><input
                        autoFocus
                        type= "text"
                        className="form-control form-control-sm"
                        name= "multiQueryInput2"
                        defaultValue=""/></div>
                </td>
                <td>
                  <Button key="and_or2" type="primary" onClick={handleOk}>
                  And
                  </Button>
                </td>
              </tr>
              <tr>
                <td><Select  options={companyColumn} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><Select  options={ColumnQueryCondition} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><div><input
                        autoFocus
                        type= "text"
                        className="form-control form-control-sm"
                        name= "multiQueryInput3"
                        defaultValue=""/></div>
                </td>
                <td>
                  <Button key="and_or3" type="primary" onClick={handleOk}>
                  And
                  </Button>
                </td>
              </tr>
              <tr>
                <td><Select  options={companyColumn} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><Select  options={ColumnQueryCondition} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><div><input
                        autoFocus
                        type= "text"
                        className="form-control form-control-sm"
                        name= "multiQueryInput4"
                        defaultValue=""/></div>
                </td>
                <td>
                  <Button key="and_or4" type="primary" onClick={handleOk}>
                  And
                  </Button>
                </td>
              </tr>
              <tr>
                <td><Select  options={companyColumn} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><Select  options={ColumnQueryCondition} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><div><input
                        autoFocus
                        type= "text"
                        className="form-control form-control-sm"
                        name= "multiQueryInput4"
                        defaultValue=""/> </div>
                </td>
                <td>
                  <Button key="and_or4" type="primary" onClick={handleOk}>
                  And
                  </Button>
                </td>
              </tr>
              <tr>
                <td><Select  options={companyColumn} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><Select  options={ColumnQueryCondition} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><div ><input
                        autoFocus
                        type= "text"
                        className="form-control form-control-sm"
                        name= "multiQueryInput4"
                        defaultValue=""/> </div>
                </td>
                <td>
                  <Button key="and_or4" type="primary" onClick={handleOk}>
                  And
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="col-sm-8  d-flex">
               <Select className = "col-sm-4" options={companyColumn} value={selectedKeyMan}  onChange={handleSelectKeyMan} />
               <Select className = "col-sm-4" options={ColumnQueryCondition} value={selectedKeyMan}  onChange={handleSelectKeyMan} />
               <input
                        autoFocus
                        className="col-sm-4"
                        type= "text"
                        name= "multiQueryInput1"
                        defaultValue=""
               />
                <Button className = "col-sm-4" key="and_or" type="primary" onClick={handleOk}>
                  And
                </Button>
            </div>
        </Modal>
    );

};

export default MultiQueryModal;
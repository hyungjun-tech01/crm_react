import React, {  useState , useCallback} from "react";
import { Button, Modal } from 'antd';
import Select from "react-select";
import { KeyManForSelection } from "../repository/lead";
import { companyColumn, ColumnQueryCondition } from "../repository/company";


const MultiQueryModal = (props) => {
    const {  open, title, handleOk, handleCancel } = props;

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
                <th>항목</th>
                <th>조건</th>
                <th>값</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Select  options={companyColumn} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><Select  options={ColumnQueryCondition} value={selectedKeyMan}  onChange={handleSelectKeyMan} /></td>
                <td><input
                        autoFocus
                        type= "text"
                        name= "multiQueryInput1"
                        defaultValue=""/>
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
                <td><input
                        autoFocus
                        type= "text"
                        name= "multiQueryInput2"
                        defaultValue=""/>
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
                <td><input
                        autoFocus
                        type= "text"
                        name= "multiQueryInput3"
                        defaultValue=""/>
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
                <td><input
                        autoFocus
                        type= "text"
                        name= "multiQueryInput4"
                        defaultValue=""/>
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
                <td><input
                        autoFocus
                        type= "text"
                        name= "multiQueryInput4"
                        defaultValue=""/>
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
                <td><input
                        autoFocus
                        type= "text"
                        name= "multiQueryInput4"
                        defaultValue=""/>
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
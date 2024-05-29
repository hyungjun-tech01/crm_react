import React, {  useState , useCallback} from "react";
import { Button, Modal } from 'antd';
import Select from "react-select";
import { KeyManForSelection } from "../repository/lead";
//import { companyColumn } from "../repository/company";


const MultiQueryModal = (props) => {
    const {  open, title, handleOk, handleCancel } = props;

    const [selectedKeyMan, setSelectedKeyMan] = useState([]);
    const [ leadChange, setLeadChange ] = useState(null);

    const handleSelectKeyMan = useCallback((value) => {
        const selected = value.value;
      },[leadChange]);

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
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
            <div className="col-sm-8  d-flex">
               <Select className = "col-sm-4" options={KeyManForSelection} value={selectedKeyMan}  onChange={handleSelectKeyMan} />
               <Select className = "col-sm-4" options={KeyManForSelection} value={selectedKeyMan}  onChange={handleSelectKeyMan} />
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
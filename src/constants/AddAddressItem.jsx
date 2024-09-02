import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import PopupPostCode from "./PostCode";


const AddAddressItem = (props) => {
    const { title, long, key_address, key_zip, disabled, required, edited, setEdited } = props;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleChange = (event) => {
        const modifiedData = {
            ...edited,
            [key_address]: event.target.value,
        };
        setEdited(modifiedData);
    };

    const handleData = (data) =>{
        const modifiedData = {
            ...edited,
            [key_address]: data.address,
            [key_zip]: data.zip,
        };
        setEdited(modifiedData);
    };

    return (
        <div className={ long ? "col-sm-12" : "col-sm-6"} >
            <div className="add-basic-item">
                <div className="add-basic-title" >
                    {title}
                    {required && <span className="text-danger">*</span>}
                </div>
                <input
                    className="add-basic-content"
                    id="add_adress_input"
                    type="text"
                    value={edited[key_address] ? edited[key_address] : ''}
                    placeholder={title}
                    disabled={disabled ? disabled : false}
                    onChange={handleChange}
                />
                <div className="add-basic-btn" onClick={() => {if(!disabled) setIsPopupOpen(!isPopupOpen)}}>
                    <FiSearch />
                </div>
                {isPopupOpen && (
                    <div style={{position:"absolute",top:"45px",right:"650px"}} >
                        <PopupPostCode
                            onSetData={handleData}
                            onClose={() => setIsPopupOpen(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
  };

  export default AddAddressItem;
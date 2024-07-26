import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { FiSearch } from "react-icons/fi";

import PopupPostCode from "./PostCode";

const PopupDom = ({ children }) => {
    const el = document.getElementById('popupDom');
    return ReactDom.createPortal(children, el);
};

const AddAddressItem = (props) => {
    const { title, long, key_address, key_zip, disabled, edited,  setEdited } = props;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleChange = (event) => {
        const modifiedData = {
            ...edited,
            [key_address]: event.target.value,
        };
        console.log('AddAddressItem / handleChange :', modifiedData);
        setEdited(modifiedData);
    };

    const handleData = (data) =>{
        const modifiedData = {
            ...edited,
            [key_address]: data.address,
            [key_zip]: data.zip,
        };
        console.log('AddAddressItem / handleData :', modifiedData);
        setEdited(modifiedData);
    }

    return (
        <div className={ long ? "col-sm-12" : "col-sm-6"} >
            <div className="add-basic-item">
                <div className="add-basic-title" >
                    {title}
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
                <div id="popupDom">
                    {isPopupOpen && (
                        <PopupDom>
                            <PopupPostCode
                                onSetData={handleData}
                                onClose={() => setIsPopupOpen(false)}
                            />
                        </PopupDom>
                    )}
                </div>
            </div>
        </div>
    );
  };

  export default AddAddressItem;
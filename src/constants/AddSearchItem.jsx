import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch } from "react-icons/fi";
import SelectListModal from './SelectListModal';


const AddSearchItem = (props) => {
    const { title, category, name, defaultValue, edited, setEdited, long, required, disabled, } = props;
    const { t } = useTranslation();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {

    }, []);

    return (
        <div className={ long ? "col-sm-12" : "col-sm-6"} >
            <div className="add-basic-item">
                <div className="add-basic-title" >
                    {title}
                    {required && <span className="text-danger">*</span>}
                </div>
                <input
                    className={ long ? "add-long-content" : "add-basic-content"}
                    id="add_adress_input"
                    type="text"
                    value={edited[name] ? edited[name] : (defaultValue ? defaultValue : '')}
                    placeholder={title}
                    disabled    //={disabled ? disabled : false}
                />
                <div className="add-basic-btn" onClick={() => {if(!disabled) setIsPopupOpen(!isPopupOpen)}}>
                    <FiSearch />
                </div>
            </div>
            <SelectListModal
                title={t('company.search_name')}
                condition={{category: category, item: name}}
                open={isPopupOpen}
                handleChange={(data) => {
                    delete data.index;
                    setEdited({
                        ...edited,
                        ...data,
                    })
                }}
                handleClose={()=>setIsPopupOpen(false)}
            />
        </div>
    );
  };

  export default AddSearchItem;
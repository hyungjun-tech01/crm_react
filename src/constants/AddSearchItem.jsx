import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch } from "react-icons/fi";
import SelectListModal from './SelectListModal';


const AddSearchItem = (props) => {
    const { title, category, name, defaultValue, edited, setEdited, long, required, disabled, } = props;
    const { t } = useTranslation();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [ styleName, setStyleName ] = useState('add-basic-content');
    const [ styleLong, setStyleLong ] = useState('col-sm-6');

    useEffect(() => {
        if(!title) {
            setStyleName('add-search');
            setStyleLong('col=sm-12');
        }
        else if(long) {
            setStyleName('add-long-content');
            setStyleLong('col=sm-12');
        };
    }, [title, long]);

    return (
        <div className={ styleLong } >
            <div className="add-basic-item">
                {title !== undefined && title !== null && (
                    <div className="add-basic-title" >
                        {title}
                        {required && <span className="text-danger">*</span>}
                    </div>
                )}
                <input
                    className={styleName}
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
                    delete data.component;
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
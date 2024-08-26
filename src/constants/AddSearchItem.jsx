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
            setStyleLong('col-sm-12');
        }
        else if(long) {
            setStyleName('add-long-content');
            setStyleLong('col-sm-12');
        };
    }, [title, long]);

    return (
        <div className={ styleLong } >
            <div className="add-basic-item">
                {title !== undefined && title !== null && (
                    <div className={long ? "add-long-title" :"add-basic-title"} >
                        {title}
                        {required && <span className="text-danger">*</span>}
                    </div>
                )}
                <label className={styleName}>
                    {edited[name] ? edited[name] : (defaultValue ? defaultValue : '')}
                </label>
                <div className="add-basic-btn" onClick={() => {if(!disabled) setIsPopupOpen(!isPopupOpen)}}>
                    <FiSearch />
                </div>
            </div>
            <SelectListModal
                title={`${title ? title : ''} ${t('common.search')}`}
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
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch } from "react-icons/fi";
import SelectProductModal from './SelectProductModal';


const AddSearchProduct = (props) => {
    const { title, name, edited, setEdited, long, required, disabled, handleOpen } = props;
    const { t } = useTranslation();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [ styleName, setStyleName ] = useState('add-basic-content');
    const [ styleLong, setStyleLong ] = useState('col-sm-6');

    const curr_product_class = edited['product_class_name'] ? edited.product_class_name : null;
    const curr_product = edited['product_name'] ? edited.product_name : null;

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
                <label
                    className={styleName}
                    id="add_adress_input"
                    disabled    //={disabled ? disabled : false}
                >
                    {edited[name] ? edited[name] : ''}
                </label>
                <div className="add-basic-btn" onClick={() => {
                    if(!disabled){
                        setIsPopupOpen(!isPopupOpen)
                        if(handleOpen) handleOpen(!isPopupOpen);
                    }
                }}>
                    <FiSearch />
                </div>
            </div>
            <SelectProductModal
                title={`${title} ${t('common.search')}`}
                open={isPopupOpen}
                current={{product_class_name: curr_product_class, product_name: curr_product}}
                handleChange={(data) => {
                    delete data.index;
                    delete data.component;
                    const modified = {
                        ...edited,
                        product_code: data.product_code,
                        product_class_name: data.product_class_name,
                        product_name: data.product_name,
                    };
                    console.log('AddSearchProduct / modified :', modified);

                    setEdited(modified);
                }}
                handleClose={()=>{
                    setIsPopupOpen(false);
                    if(handleOpen) handleOpen(false);
                }}
            />
        </div>
    );
  };

  export default AddSearchProduct;
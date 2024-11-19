import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";

import SelectProductModal from './SelectProductModal';


const SearchInput = (props) => {
    const { addonBefore, title, name, value, disabled, onChange, style } = props;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    return (
        <div className="ant-space-item">
            <span className='ant-input-group-wrapper
                ant-input-group-wrapper-outlined
                css-dev-only-do-not-override-5wsri9'
                style={style}
            >
                <span className='ant-input-wrapper ant-input-group css-dev-only-do-not-override-5wsri9'>
                    <span className='ant-input-group-addon'>
                        { addonBefore }
                    </span>
                    <input
                        className="ant-input detail-input-extra"
                        name={ name }
                        placeholder={ title }
                        style={{ width: '100%', backgroundColor: 'white', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
                        value={ value }
                        disabled
                    />
                    <div className="add-basic-btn" 
                    onClick={() => {
                            if(!disabled) setIsPopupOpen(!isPopupOpen)
                        }}
                    >
                        <FiSearch />
                    </div>
                    <SelectProductModal
                        title={title}
                        open={isPopupOpen}
                        handleChange={(data) => {
                            delete data.index;
                            delete data.component;
                            onChange(name, data);
                        }}
                        handleClose={()=>setIsPopupOpen(false)}
                    />
                </span>
            </span>
        </div>
    );
};

const DetailSelectProduct = (props) => {
    const { title, name, defaultValue, edited, detail} = props;
    
    const currentValue = (edited && (edited[name] !== undefined) && (edited[name] !== null))
            ? edited[name]
            : (defaultValue === null ? "" : defaultValue );

    const widthValue = detail['extra'] ? ( detail.extra === 'long' ? 768 : (detail.extra === 'modal' ? 470 : 380)) : 380;

    const SharedProps = {
        name: name,
        addonBefore: <div className='detail-card-before'>{title}</div>,
        value: currentValue,
        disabled: detail.disabled ? detail.disabled : false,
    };

    return <SearchInput {...SharedProps} title={title} key_name={detail.key_name} onChange={detail.editing} style={{width: widthValue, height: 38}} />

};

export default DetailSelectProduct;
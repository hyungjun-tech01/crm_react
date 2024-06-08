import React from 'react';

const DetailTitleItem = (props) => {
    const { original, name, title, type, onEditing } = props;

    const classSize = type ? type : "col-md-3";

    return (
        <div className={classSize}>
            <span><b>{title}</b></span>
            <div style={{display: 'flex'}}>
                <input
                    className='detail-title-input'
                    type="text"
                    placeholder={title}
                    name={name}
                    defaultValue={original}
                    onChange={onEditing}
                />
            </div>
        </div>
    );
};

export default DetailTitleItem;
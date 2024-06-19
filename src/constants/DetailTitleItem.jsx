import React from 'react';
import Select from 'react-select';

const DetailTitleItem = (props) => {
    const { original, name, title, size, onEditing, type, options, group } = props;

    const classSize = size ? size : "col-md-3";

    if(!type || type ==='text' || type === 'label') {
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
    if(type === 'select' && !!options){
        let defaultOption = null;
        if(!!group){
            const foundIdx = options.findIndex(item => item.title === group);
            if(foundIdx !== -1){
                const groupOptions = options[foundIdx].options;
                const foundIdxSub = groupOptions.findIndex(item => item.value[name] === original);
                if(foundIdxSub !== -1) {
                    defaultOption = groupOptions[foundIdxSub];
                };
            };
        } else {
            if(typeof options[0].value === 'object') {
                const foundIdx = options.findIndex(item => item.value[name] === original);
                if(foundIdx !== -1){
                    defaultOption = options[foundIdx];
                };
            } else {
                const foundIdx = options.findIndex(item => item.value === original);
                if(foundIdx !== -1){
                    defaultOption = options[foundIdx];
                };;
            }
        };
        return (
            <div className={classSize}>
                <span><b>{title}</b></span>
                <div style={{display: 'flex'}}>
                    <Select
                        className='detail-title-select'
                        value={defaultOption}
                        options={options}
                        onChange={onEditing}
                    />
                </div>
            </div>
        );
    };
};

export default DetailTitleItem;
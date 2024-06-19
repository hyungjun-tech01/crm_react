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
            console.log('[DetailTitleItem] group :', group);
            const foundIdx = options.findIndex(item => item.title === group);
            if(foundIdx !== -1){
                const groupOptions = options[foundIdx];
                console.log('[DetailTitleItem] group options :', groupOptions);
                const foundIdxSub = groupOptions.findIndex(item => item.value[name] === original);
                if(foundIdxSub !== -1) {
                    defaultOption = groupOptions[foundIdxSub];
                };
            };
        } else {
            console.log('[DetailTitleItem] No group');
            const foundIdx = options.findIndex(item => item.value === original);
            if(foundIdx !== -1){
                defaultOption = options[foundIdx];
            };
        };
        console.log('[DetailTitleItem] value :', defaultOption);
        return (
            <div className={classSize}>
                <span><b>{title}</b></span>
                <div style={{display: 'flex'}}>
                    <Select
                        className='detail-title-input'
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
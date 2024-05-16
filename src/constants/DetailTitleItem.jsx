import React from 'react';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';

const DetailTitleItem = (props) => {
    const { defaultText, saved, name, title, type,
        checkEdit, startEdit, endEdit, editing, checkSaved, cancelSaved } = props;

    const classSize = type ? type : "col-md-3";

    if(checkEdit && checkEdit(name)) {
        return (
            <div className={classSize}>
                <span><b>{title}</b></span>
                <div style={{display: 'flex'}}>
                    <input
                        className='detail-edit-label'
                        type="text"
                        placeholder={title}
                        name={name}
                        defaultValue={defaultText}
                        onChange={editing}
                    />
                    <SaveAlt onClick={() => endEdit(name)}/>
                </div>
            </div>
        );
    };
    if(checkSaved && checkSaved(name)) {
        return (
            <div className={classSize}>
                <span><b>{title}</b></span>
                <p>{saved[name]} <Cancel onClick={() => cancelSaved(name) }/></p>
            </div>
        );
    };

    return (
        <div className={classSize}>
            <span><b>{title}</b></span>
            <p>{defaultText} <Edit onClick={() => startEdit(name) }/></p>
        </div>
    );
};

export default DetailTitleItem;
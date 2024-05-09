import React from 'react';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';

const DetailLabelItem = (props) => {
    const { defaultText, saved, name, title, type, no_border,
        checkEdit, startEdit, endEdit, editing, checkSaved, cancelSaved } = props;

    if(checkEdit && checkEdit(name)) {
        return (
            <tr className='detail-tr'>
                <td className={"detail-td-left" + (no_border && " border-0")}><b>{title}</b></td>
                <td className={"detail-td-center" + (no_border && " border-0")} >
                    <input
                        className='detail-edit-label'
                        type={type ? type : "text"}
                        placeholder={title}
                        name={name}
                        defaultValue={defaultText}
                        onChange={editing}
                    />
                </td>
                <td className={"detail-td-right" + (no_border && " border-0")}>
                    <div onClick={() => { endEdit(name); }}>
                        <SaveAlt />
                    </div>
                </td>
            </tr>
        );
    };
    if(checkSaved && checkSaved(name)) {
        return (
            <tr className='detail-tr'>
                <td className={"detail-td-left" + (no_border && " border-0")}><b>{title}</b></td>
                <td className={"detail-td-center" + (no_border && " border-0")} >
                    {saved[name]}
                </td>
                <td className={"detail-td-right" + (no_border && " border-0")}>
                    <div onClick={() => { cancelSaved(name); }}>
                        <Cancel />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <tr className='detail-tr'>
            <td className={"detail-td-left" + (no_border && " border-0")}><b>{title}</b></td>
            <td className={"detail-td-center" + (no_border && " border-0")} >
                {defaultText}
            </td>
            <td className={"detail-td-right" + (no_border && " border-0")}>
                <div onClick={() => { startEdit(name); }}>
                    <Edit />
                </div>
            </td>
        </tr>
    );
};

export default DetailLabelItem;
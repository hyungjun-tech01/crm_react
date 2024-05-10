import React from 'react';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';

const DetailTextareaItem = (props) => {
    const { defaultText, saved, name, title, row_no, no_border,
        checkEdit, startEdit, endEdit, editing, checkSaved, cancelSaved } = props;

    if(checkEdit(name)) {
        return (
            <tr className='detail-tr'>
                <td className={"detail-td-left " + (no_border && "border-0")}>{title}</td>
                <td className={no_border && "border-0"} >
                    <textarea
                        className="detail-edit-textarea"
                        rows={row_no}
                        placeholder={title}
                        defaultValue={defaultText}
                        name={name}
                        onChange={editing}
                    />
                </td >
                <td className={"detail-td-right " + (no_border && "border-0")}>
                    <div onClick={() => { endEdit(name); }}>
                        <SaveAlt />
                    </div>
                </td>
            </tr>
        );
    };
    if(checkSaved(name)) {
        return (
            <tr className='detail-tr'>
                <td className={"detail-td-left " + (no_border && "border-0")}>{title}</td>
                <td className={no_border && "border-0"}>
                    {saved[name]}
                </td>
                <td className={"detail-td-right " + (no_border && "border-0")}>
                    <div onClick={() => { cancelSaved(name); }}>
                        <Cancel />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <tr className='detail-tr'>
            <td className={"detail-td-left " + (no_border && "border-0")}>{title}</td>
            <td className={no_border && "border-0"}>
                {defaultText}
            </td>
            <td className={"detail-td-right " + (no_border && "border-0")}>
                <div onClick={() => { startEdit(name); }}>
                    <Edit />
                </div>
            </td>
        </tr>
    );
};

export default DetailTextareaItem;
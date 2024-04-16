import React from 'react';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';

const DetailLabelItem = (props) => {
    const { defaultText, saved, name, title, type, no_border,
        checkEdit, startEdit, endEdit, editing, checkSaved, cancelSaved } = props;

    if(checkEdit && checkEdit(name)) {
        return (
            <tr>
                <td className={no_border && "border-0"}>{title}</td>
                <td className={no_border && "border-0"} >
                    <input
                        type={type ? type : "text"}
                        placeholder={title}
                        name={name}
                        defaultValue={defaultText}
                        onChange={editing}
                    />
                </td>
                <td className={no_border && "border-0"}>
                    <div onClick={() => { endEdit(name); }}>
                        <SaveAlt />
                    </div>
                </td>
            </tr>
        );
    };
    if(checkSaved && checkSaved(name)) {
        return (
            <tr>
                <td className={no_border && "border-0"}>{title}</td>
                <td className={no_border && "border-0"}>
                    {saved[name]}
                </td>
                <td className={no_border && "border-0"}>
                    <div onClick={() => { cancelSaved(name); }}>
                        <Cancel />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <tr>
            <td className={no_border && "border-0"}>{title}</td>
            <td className={no_border && "border-0"}>
                {defaultText}
            </td>
            <td className={no_border && "border-0"}>
                <div onClick={() => { startEdit(name); }}>
                    <Edit />
                </div>
            </td>
        </tr>
    );
};

export default DetailLabelItem;
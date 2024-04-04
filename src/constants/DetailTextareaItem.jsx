import React from 'react';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';

const DetailTextareaItem = (props) => {
    const { data_set, saved, name, title, row_no, no_border,
        checkEdit, startEdit, endEdit, editing, checkSaved, cancelSaved } = props;

    if(checkEdit(name)) {
        return (
            <tr>
                <td className={no_border && "border-0"}>{title}</td>
                <td className={no_border && "border-0"} >
                    <textarea
                        className="form-control"
                        rows={row_no}
                        placeholder={title}
                        defaultValue={data_set[name]}
                        name={name}
                        onChange={editing}
                    />
                </td >
                <td className={no_border && "border-0"}>
                    <div onClick={() => { endEdit(name); }}>
                        <SaveAlt />
                    </div>
                </td>
            </tr>
        );
    };
    if(checkSaved(name)) {
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
                {data_set[name]}
            </td>
            <td className={no_border && "border-0"}>
                <div onClick={() => { startEdit(name); }}>
                    <Edit />
                </div>
            </td>
        </tr>
    );
};

export default DetailTextareaItem;
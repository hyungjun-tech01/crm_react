import React from 'react';
import Select from 'react-select';
import { Cancel, Edit } from '@mui/icons-material';

const DetailSelectItem = (props) => {
    const { defaultText, saved, name, title, options, no_border,
        checkEdit, startEdit, endEdit, checkSaved, cancelSaved } = props;

    if(checkEdit && checkEdit(name)) {
        return (
            <tr className='detail-tr'>
                <td className={"detail-td-left" + no_border && " border-0"}><b>{title}</b></td>
                <td className={no_border && "border-0"} >
                    <Select options={options} onChange={endEdit}/>
                </td>
                <td className={no_border && "border-0"}>
                    <div>
                        {" "}
                    </div>
                </td>
            </tr>
        );
    };
    if(checkSaved && checkSaved(name)) {
        return (
            <tr className='detail-tr'>
                <td className={"detail-td-left" + no_border && " border-0"}><b>{title}</b></td>
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
        <tr className='detail-tr'>
            <td className={"detail-td-left" + no_border && " border-0"}><b>{title}</b></td>
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

export default DetailSelectItem;
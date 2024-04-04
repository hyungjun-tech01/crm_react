import React from 'react';
import Select from 'react-select';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';

const DetailSelectItem = (props) => {
    const { data_set, saved, name, title, options, no_border,
        checkEdit, startEdit, endEdit, checkSaved, cancelSaved } = props;

    if(checkEdit && checkEdit(name)) {
        return (
            <tr>
                <td className={no_border && "border-0"}>{title}</td>
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

export default DetailSelectItem;
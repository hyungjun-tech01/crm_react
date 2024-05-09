import React from 'react';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DetailDateItem = (props) => {
    const { saved, name, title, no_border,
        orgTimeData, timeData, timeDataChange, selectTime,
        checkEdit, startEdit, endEdit, checkSaved, cancelSaved } = props;

    const options = selectTime ?
        {year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'} :
        {year: 'numeric', month: 'short', day: 'numeric'};

    if(checkEdit(name)) {
        return (
            <tr className='detail-tr'>
                <td className={"detail-td-left" + (no_border && " border-0")}><b>{title}</b></td>
                <td className={no_border && "border-0"} >
                    { selectTime ? 
                        <DatePicker
                            className="detail-edit-datepicker"
                            selected={ timeData }
                            onChange={ timeDataChange }
                            dateFormat="yyyy-MM-dd hh:mm:ss"
                            showTimeSelect
                        />
                        :
                        <DatePicker
                            className="detail-edit-datepicker"
                            selected={ timeData }
                            onChange={ timeDataChange }
                            dateFormat="yyyy-MM-dd"
                        />
                    }
                </td>
                <td className={"detail-td-right" + (no_border && " border-0")}>
                    <div onClick={() => { endEdit(); }}>
                        <SaveAlt />
                    </div>
                </td>
            </tr>
        );
    };
    if(checkSaved(name)) {
        return (
            <tr className='detail-tr'>
                <td className={"detail-td-left" + (no_border && " border-0")}><b>{title}</b></td>
                <td className={no_border && "border-0"}>
                    { saved[name] && (new Date(saved[name])).toLocaleDateString('ko-KR', options) }
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
            <td className={no_border && "border-0"}>
                {orgTimeData && orgTimeData !=='' && (new Date(orgTimeData)).toLocaleDateString('ko-KR', options)}
            </td>
            <td className={"detail-td-right" + (no_border && " border-0")}>
                <div onClick={() => { startEdit(name); }}>
                    <Edit />
                </div>
            </td>
        </tr>
    );
};

export default DetailDateItem;
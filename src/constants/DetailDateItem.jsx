import React from 'react';
import { Cancel, Edit, SaveAlt } from '@mui/icons-material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DetailDateItem = (props) => {
    const { data_set, saved, name, title, is_top,
        timeData, timeDataChange, selectTime,
        checkEdit, startEdit, endEdit, checkSaved, cancelSaved } = props;

    if(checkEdit(name)) {
        return (
            <tr>
                <td className={is_top && "border-0"}>{title}</td>
                <td className={is_top && "border-0"} >
                    { selectTime ? 
                        <DatePicker
                            className="form-control"
                            selected={ timeData }
                            onChange={ timeDataChange }
                            dateFormat="yyyy-MM-dd"
                            showTimeSelect
                        />
                        :
                        <DatePicker
                            className="form-control"
                            selected={ timeData }
                            onChange={ timeDataChange }
                            dateFormat="yyyy-MM-dd"
                        />
                    }
                </td>
                <td className={is_top && "border-0"}>
                    <div onClick={() => { endEdit(); }}>
                        <SaveAlt />
                    </div>
                </td>
            </tr>
        );
    };
    if(checkSaved(name)) {
        return (
            <tr>
                <td className={is_top && "border-0"}>{title}</td>
                <td className={is_top && "border-0"}>
                    {saved[name] && new Date(saved[name]).toLocaleDateString('ko-KR', {year: 'numeric', month: 'short', day: 'numeric'})}
                </td>
                <td className={is_top && "border-0"}>
                    <div onClick={() => { cancelSaved(name); }}>
                        <Cancel />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <tr>
            <td className={is_top && "border-0"}>{title}</td>
            <td className={is_top && "border-0"}>
                {data_set[name] && new Date(data_set[name]).toLocaleDateString('ko-KR', {year: 'numeric', month: 'short', day: 'numeric'})}
            </td>
            <td className={is_top && "border-0"}>
                <div onClick={() => { startEdit(name); }}>
                    <Edit />
                </div>
            </td>
        </tr>
    );
};

export default DetailDateItem;
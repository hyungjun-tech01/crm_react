import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DetailDateItem = (props) => {
    const { title, no_border, timeData, timeDataChange, selectTime} = props;

    return (
        <tr className='detail-tr'>
            <td className={"detail-td-left " + (no_border && "border-0")}>{title}</td>
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
        </tr>
    );
};

export default DetailDateItem;
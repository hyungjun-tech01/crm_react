import React from 'react';

const DetailTextareaItem = (props) => {
    const { defaultText, name, title, row_no, no_border, editing } = props;

    return (
        <tr className='detail-tr'>
            <td className={"detail-td-left " + (no_border && "border-0")}>{title}</td>
            <td className={no_border ? "border-0" : undefined} >
                <textarea
                    className="detail-edit-textarea"
                    rows={row_no}
                    placeholder={title}
                    defaultValue={defaultText}
                    name={name}
                    onChange={editing}
                />
            </td >
        </tr>
    );
};

export default DetailTextareaItem;
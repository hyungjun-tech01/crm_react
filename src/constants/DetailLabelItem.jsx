import React from 'react';

const DetailLabelItem = (props) => {
    const { defaultText, name, title, type, no_border, editing } = props;

    return (
        <tr className='detail-tr'>
            <td className={"detail-td-left " + (no_border && "border-0")}>{title}</td>
            <td className={"detail-td-center " + (no_border && "border-0")} >
                <input
                    autoFocus
                    className='detail-edit-label'
                    type={type ? type : "text"}
                    placeholder={title}
                    name={name}
                    defaultValue={defaultText}
                    onChange={editing}
                />
            </td>
        </tr>
    );
};

export default DetailLabelItem;
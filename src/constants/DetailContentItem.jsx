import React from 'react';

const DetailContentItem = ({ data, params }) => {
    const { title, name, defaultValue, type, no_border, editing } = params;

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
                    defaultValue={defaultValue}
                    onChange={editing}
                />
            </td>
        </tr>
    );
};

export default DetailContentItem;
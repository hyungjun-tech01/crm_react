import React, {useState,useEffect, useRef} from 'react';

const DetailLabelItemChangePassword = (props) => {
    const { defaultText, name, title, type, no_border, editing , resetInputValue} = props;

    const [inputValue, setInputValue] = useState(defaultText);

    console.log('key', name);
    const handleChange = (e) => {
        setInputValue(e.target.value);
        if (editing) {
            editing(e); // 외부에서 전달된 onChange 핸들러 호출
        }
    };

    useEffect(() => {
        if (resetInputValue) {
            resetInputValue(() => {
                setInputValue(''); // 입력값 초기화
            });
        }
    }, [resetInputValue]);

    return (
        <tr className='detail-tr'>
            <td className={"detail-td-left " + (no_border && "border-0")}>{title}</td>
            <td className={"detail-td-center " + (no_border && "border-0")} >
                <input
                    id={name}
                    autoFocus
                    className='detail-edit-label'
                    type={type ? type : "text"}
                    placeholder={title}
                    name={name}
                    value={inputValue}
                    onChange={handleChange}
                />
            </td>
        </tr>
    );
};

export default DetailLabelItemChangePassword;
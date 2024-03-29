import { Edit, SaveAlt } from '@mui/icons-material';

const DetailItem = (props) => {
    const { item, text, type, is_top, checkEdit, endEdit, startEdit, editing } = props;

    if(is_top) {
        return
            { checkEdit(item) ? (
                <>
                    <td className="border-0">
                        <input
                        type={type}
                        placeholder={text}
                        name={item}
                        defaultValue={props.data[item]}
                        onChange={editing}
                        />
                    </td>
                    <td className="border-0">
                        <div onClick={() => {endEdit(item);}}>
                        <SaveAlt />
                        </div>
                    </td>
                </>
            ) : (
                <>
                    <td className="border-0">
                        {data[item]}
                    </td>
                    <td className="border-0">
                        <div onClick={() => {handleStartEdit(item);}}>
                        <Edit />
                        </div>
                    </td>
                </>
            )}
    };

    return 
        { checkEdit(item) ? (
            <>
                <td>
                    <input
                    type={props.type}
                    placeholder={text}
                    name={item}
                    defaultValue={props.data[item]}
                    onChange={editing}
                    />
                </td>
                <td>
                    <div onClick={() => {endEdit(item);}}>
                    <SaveAlt />
                    </div>
                </td>
            </>
        ) : (
            <>
                <td>
                    {data[item]}
                </td>
                <td>
                    <div onClick={() => {startEdit(item);}}>
                    <Edit />
                    </div>
                </td>
            </>
        )}
};

export default DetailItem;
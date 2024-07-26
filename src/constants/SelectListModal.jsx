import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, Modal, Spin } from 'antd';

import {
    atomProductClassList,
    atomProductClassListState,
    atomProductsState,
    atomProductOptions,
    atomAllProducts,
} from "../../atoms/atoms";
import { ProductClassListRepo, ProductRepo } from "../../repository/product";
import DetailCardItem from './DetailCardItem';

const SelectListModal = (props) => {
    const { title, open, item, original, edited, handleEdited, handleOk, handleCancel } = props;

    //===== [RecoilState] Related with Product ==========================================
    const productClassState = useRecoilValue(atomProductClassListState);
    const allProductClassList = useRecoilValue(atomProductClassList);
    const productState = useRecoilValue(atomProductsState);
    const allProducts = useRecoilValue(atomAllProducts);
    const [productOptions, setProductOptions] = useRecoilState(atomProductOptions);
    const { tryLoadAllProductClassList } = useRecoilValue(ProductClassListRepo);
    const { tryLoadAllProducts } = useRecoilValue(ProductRepo);

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={edited ? [
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Submit
                </Button>,
            ] : [
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
            ]}
            style={{ top: 120, width: 240 }}
            zIndex={2001}
        >
            {item && item.map((item, index) => {
                let modifiedDetail = { ...item.detail };
                if (item.detail.type === 'date') {
                    modifiedDetail['editing'] = handleTime;
                } else if (item.detail.type === 'select') {
                    modifiedDetail['editing'] = handleSelect;
                } else {
                    modifiedDetail['editing'] = handleValue;
                };
                return (
                    <DetailCardItem
                        key={index}
                        title={item.title}
                        defaultValue={original[item.name]}
                        name={item.name}
                        edited={edited}
                        detail={modifiedDetail}
                    />
                );
            })}
        </Modal>
    );
};

export default SelectListModal;
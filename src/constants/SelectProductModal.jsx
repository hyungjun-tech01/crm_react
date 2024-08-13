import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from "react-i18next";
import { Button, List, Modal } from 'antd';
import Select from 'react-select';
import classNames from 'classnames';
import { atomAllProducts, atomProductClassList, atomProductClassListState, atomProductsState } from '../atoms/atoms';
import { ProductClassListRepo, ProductRepo } from '../repository/product';
import styles from './SelectListModal.module.scss';

const SelectProductModal = (props) => {
    const { title, open, handleChange, handleClose } = props;
    const { t } = useTranslation();

    const productClassListState = useRecoilValue(atomProductClassListState);
    const productClassList = useRecoilValue(atomProductClassList);
    const { tryLoadAllProductClassList } = useRecoilValue(ProductClassListRepo);

    const productState = useRecoilValue(atomProductsState);
    const allProducts = useRecoilValue(atomAllProducts);
    const { tryLoadAllProducts } = useRecoilValue(ProductRepo);

    const [ productClassOptions, setProductClassOptions ] = useState([]);
    const [ productOptionObj, setProductOptionObj ] = useState({});
    
    // const [ loadingState, setLoadingState ] = useState(false);
    const [ selectedProductClass, setSelectedProductClass ] = useState(null);
    const [ listItems, setListItems ] = useState([]);
    const [ selectedItem, setSelectedItem ] = useState(null);

    const inputRef = useRef(null);

    const handleSelectProductClass = (selected) => {
        setSelectedProductClass(selected);

        console.log('handleSelectProductClass', selected);
        const selectedProducts = productOptionObj[selected.value];

        console.log('handleSelectProductClass', selectedProducts);

        setListItems(selectedProducts);
    };

    const handleClickRow = (data) => {
        setSelectedItem({...data});
    };
    
    const handleOk = () => {
        if(Object.keys(selectedItem).length > 0){
            handleChange(selectedItem);
        };
        handleCancel();
    };

    const handleCancel = () => {
        setListItems([]);
        setSelectedItem({});
        handleClose();
    };

    useEffect(() => {
        tryLoadAllProductClassList();
        tryLoadAllProducts();
        
        if(((productState & 1) === 1) 
            && ((productClassListState & 1) ===  1)
        ) {
            const found = productClassList.map(item => ({
                label: item.product_class_name,
                value: item.product_class_name,
            }));
            setProductClassOptions(found);

            let foundObj = {};
            productClassList.forEach(item => {
                const foundProducts = allProducts.filter(product => product.product_class_name === item.product_class_name);
                const tempItems = foundProducts.map((product, idx) => ({
                    ...product,
                    index: idx,
                    component: <div>{product.product_name}</div>,
                }));
                foundObj[item.product_class_name] = tempItems;
            });
            console.log('SelecteProductModal : ', foundObj);
            setProductOptionObj(foundObj);
        };
    }, [allProducts, productClassList, productClassListState, productState, tryLoadAllProductClassList, tryLoadAllProducts]);

    useEffect(() => {
        if(open && inputRef.current !== null) {
            inputRef.current.focus();
        };
    }, [open]);

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Submit
                </Button>,
            ]}
            width={520}
            style={{ top: 120 }}
            zIndex={2002}
        >
            <Select
                ref={inputRef}
                value={selectedProductClass}
                options={productClassOptions}
                onChange={handleSelectProductClass}
            />
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                    marginTop: '0.5rem'
                }}
            >
                <List
                    dataSource={listItems}
                    renderItem={(item) => 
                        <List.Item
                            className={(selectedItem && (item.index === selectedItem.index)) ?
                                classNames(styles.ListRow, styles.selected) : styles.ListRow }
                            onClick={() => handleClickRow(item)}
                            onDoubleClick={()=>{handleClickRow(item);handleOk();}}
                        >
                            {item.component}
                        </List.Item>
                    }
                />
            </div>
        </Modal>
    );
};

export default SelectProductModal;
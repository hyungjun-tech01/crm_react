import React from 'react';
import { selector } from "recoil";
import { atomProductClassList
    , atomProductClassListState
    , atomAllProducts
    , atomProductsState
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const ProductClassListRepo = selector({
    key: "ProductClassListRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all ProductClassLists /////////////////////////////
        const tryLoadAllProductClassList = getCallback(({ set, snapshot }) => async () => {
            const loadStates = await snapshot.getPromise(atomProductClassListState);
            if((loadStates & 3) === 0){
                set(atomProductClassListState, (loadStates | 2));   // state : loading
                const { loadAllProductClassList } = await snapshot.getPromise(ProductClassListRepo);
                const ret = await loadAllProductClassList();
                if(ret){
                    // succeeded to load
                    set(atomProductClassListState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomProductClassListState, 0);
                };
            }
        });
        const loadAllProductClassList = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/productClass`);
                const data = await response.json();
                if(data.message){
                    console.log('loadAllProductClassList message:', data.message);
                    set(atomProductClassList, []);
                    return false;
                }
                set(atomProductClassList, data);
                return true;
            }
            catch(err){
                console.error(`loadAllProductClassList / Error : ${err}`);
                return false;
            };
        });
        const modifyProductClass = getCallback(({set, snapshot}) => async (newProductClass) => {
            const input_json = JSON.stringify(newProductClass);
            try{
                const response = await fetch(`${BASE_PATH}/modifyProductClass`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyProductClass ] message:', data.message);
                    return false;
                };

                const allProductClassLists = await snapshot.getPromise(atomProductClassList);
                if(newProductClass.action_type === 'ADD'){
                    delete newProductClass.action_type;
                    const updatedNewProduct = {
                        ...newProductClass,
                        product_code : data.out_product_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomProductClassList, [updatedNewProduct, ...allProductClassLists]);
                    return true;
                } else if(newProductClass.action_type === 'UPDATE'){
                    delete newProductClass.action_type;
                    const foundIdx = allProductClassLists.findIndex(item => 
                        item.product_code === newProductClass.product_code);
                    if(foundIdx !== -1){
                        const updatedAllProducts = [
                            ...allProductClassLists.slice(0, foundIdx),
                            newProductClass,
                            ...allProductClassLists.slice(foundIdx + 1,),
                        ];
                        set(atomProductClassList, updatedAllProducts);
                        return true;
                    } else {
                        console.log('\t[ modifyProductClass ] No specified product is found');
                        return false;
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyProductClass ] Error : ${err}`);
                return false;
            };
        });
        return {
            tryLoadAllProductClassList,
            loadAllProductClassList,
            modifyProductClass,
        };
    }
});

export const ProductTypeOptions = [
    {value:'N(Act)', label: 'N(Act)'},
    {value:'ST(Act)', label: 'ST(Act)'},
    {value:'D(USB)', label: 'D(USB)'},
    {value:'N(Pareller)', label: 'N(Pareller)'},
    {value:'N(USB)', label: 'N(USB)'},
    {value:'D(Pareller)', label: 'D(Pareller)'},
];


export const ProductRepo = selector({
    key: "ProductRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all Products /////////////////////////////
        const tryLoadAllProducts = getCallback(({ set, snapshot }) => async () => {
            const loadStates = await snapshot.getPromise(atomProductsState);
            if((loadStates & 3) === 0){
                set(atomProductsState, (loadStates | 2));   // state : loading
                const {loadAllProducts} = await snapshot.getPromise(ProductRepo);
                const ret = await loadAllProducts();
                if(ret){
                    // succeeded to load
                    set(atomProductsState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomProductsState, 0);
                };
            }
        });
        const loadAllProducts = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/product`);
                const data = await response.json();
                if(data.message){
                    console.log('loadAllProducts message:', data.message);
                    set(atomAllProducts, []);
                    set(atomProductsState, 0);
                    return false;
                }
                set(atomAllProducts, data);
                return true;
            }
            catch(err){
                console.error(`loadAllProducts / Error : ${err}`);
                return false;
            };
        });
        const modifyProduct = getCallback(({set, snapshot}) => async (newProduct) => {
            const input_json = JSON.stringify(newProduct);
            try{
                const response = await fetch(`${BASE_PATH}/modifyProduct`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyProduct ] message:', data.message);
                    return false;
                };

                const allProducts = await snapshot.getPromise(atomAllProducts);
                if(newProduct.action_type === 'ADD'){
                    delete newProduct.action_type;
                    const updatedNewProduct = {
                        ...newProduct,
                        product_code : data.out_product_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllProducts, allProducts.concat(updatedNewProduct));
                    return true;
                } else if(newProduct.action_type === 'UPDATE'){
                    delete newProduct.action_type;
                    const foundIdx = allProducts.findIndex(item => 
                        item.product_code === newProduct.product_code);
                    if(foundIdx !== -1){
                        const updatedAllProducts = [
                            ...allProducts.slice(0, foundIdx),
                            newProduct,
                            ...allProducts.slice(foundIdx + 1,),
                        ];
                        set(allProducts, updatedAllProducts);
                        return true;
                    } else {
                        console.log('\t[ modifyProduct ] No specified product is found');
                        return false;
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyProduct ] Error : ${err}`);
                return false;
            };
        });
        return {
            tryLoadAllProducts,
            loadAllProducts,
            modifyProduct,
        };
    }
});
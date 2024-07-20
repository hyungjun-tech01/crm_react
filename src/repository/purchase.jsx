import React from 'react';
import { selector } from "recoil";
import { atomCurrentPurchase
    , atomAllPurchases
    , atomCompanyPurchases
    , atomFilteredPurchase
    , defaultPurchase
    , atomPurchaseState
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const PurchaseStateRepo = selector({
    key: "PurchaseStateRepository",
    get: ({getCallback}) => {
        const tryLoadAllPurchases = getCallback(({set, snapshot}) => async () => {
            const loadStates = await snapshot.getPromise(atomPurchaseState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllPurchases] Try to load all users');
                set(atomPurchaseState, 2);   // state : loading
                const {loadAllPurchases} = await snapshot.getPromise(PurchaseRepo);
                loadAllPurchases();
            };
        });
        return {
            tryLoadAllPurchases,
        }
    },
});

export const PurchaseRepo = selector({
    key: "PurchaseRepository",
    get: ({getCallback}) => {
        const loadAllPurchases = getCallback(({set, snapshot}) => async () => {
            // It is possible that this function might be called by more than two componets almost at the same time.
            // So, to prevent this function from being executed again and again, check the loading state at first.
            const loadStates = await snapshot.getPromise(atomPurchaseState);
            if((loadStates & 1) === 0){
                try{
                    console.log('[PurchaseRepository] Try loading all')
                    const response = await fetch(`${BASE_PATH}/purchases`);
                    const data = await response.json();
                    if(data.message){
                        console.log('loadAllPurchases message:', data.message);
                        set(atomAllPurchases, []);
                        set(atomPurchaseState, 0);
                        return;
                    }
                    set(atomAllPurchases, data);
                    set(atomPurchaseState, (loadStates | 1));
                }
                catch(err){
                    console.error(`loadAllPurchases / Error : ${err}`);
                    set(atomPurchaseState, 0);
                };
            };
        });
        const loadCompanyPurchases = getCallback(({set}) => async (company_code) => {
            const input_json = {company_code:company_code};
            //JSON.stringify(company_code);
            try{
                const response = await fetch(`${BASE_PATH}/companyPurchases`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify(input_json),
                });

                const data = await response.json();
                if(data.message){
                    console.log('loadCompanyPurchases message:', data.message);
                    set(atomCompanyPurchases, input_json);
                    return;
                }
                set(atomCompanyPurchases, data);
            }
            catch(err){
                console.error(`loadCompanyPurchases / Error : ${err}`);
            };
        });
        const filterCompanyPurchase = getCallback(({set, snapshot }) => async (filterText) => {
            const allPurchaseList = await snapshot.getPromise(atomCompanyPurchases);
            
            let allPurchase;
            if (filterText === '') {
                allPurchase = allPurchaseList;
            }
            else {
                allPurchase = 
                allPurchaseList.filter(item => ( item.product_type && item.product_type.includes(filterText)||
                                                item.product_name && item.product_name.includes(filterText)      
                ));
            }
            set(atomFilteredPurchase, allPurchase);
            return true;
        });

        const filterPurchases = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allPurchaseList = await snapshot.getPromise(atomAllPurchases);
            let  allQPurchase ;
            console.log('filterPurchases', itemName, filterText);
            if(itemName === 'common.all'){
                allQPurchase = allPurchaseList.filter(item => (item.product_type &&item.product_type.includes(filterText))||
                                            (item.product_name && item.product_name.includes(filterText)) ||
                                            (item.company_name && item.company_name.includes(filterText)) 
                );
            }else if(itemName === 'purchase.product_type'){
                allQPurchase = allPurchaseList.filter(item => (item.product_type &&item.product_type.includes(filterText))
                );    
            }else if(itemName === 'purchase.product_name'){
                allQPurchase = allPurchaseList.filter(item => (item.product_name &&item.product_name.includes(filterText))
                );  
            }else if(itemName === 'company.company_name'){
                allQPurchase = allPurchaseList.filter(item => (item.company_name &&item.company_name.includes(filterText))
                );  
            }
            set(atomFilteredPurchase, allQPurchase);
            return true;
        });            
        const modifyPurchase = getCallback(({set, snapshot}) => async (newPurchase) => {
            const input_json = JSON.stringify(newPurchase);
            try{
                const response = await fetch(`${BASE_PATH}/modifyPurchase`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyPurchase ] message:', data.message);
                    return {
                        result: false,
                    };
                };

                const allPurchases = await snapshot.getPromise(atomAllPurchases);
                if(newPurchase.action_type === 'ADD'){
                    delete newPurchase.action_type;
                    const updatedNewPurchase = {
                        ...newPurchase,
                        purchase_code : data.out_purchase_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllPurchases, [updatedNewPurchase, ...allPurchases]);
                    return {
                        result: true,
                        code: data.out_purchase_code,
                    };
                } else if(newPurchase.action_type === 'UPDATE'){
                    const currentPurchase = await snapshot.getPromise(atomCurrentPurchase);
                    delete newPurchase.action_type;
                    delete newPurchase.company_code;
                    delete newPurchase.modify_user;
                    const modifiedPurchase = {
                        ...currentPurchase,
                        ...newPurchase,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentPurchase, modifiedPurchase);
                    const foundIdx = allPurchases.findIndex(purchase => 
                        purchase.purchase_code === modifiedPurchase.purchase_code);
                    if(foundIdx !== -1){
                        const updatedAllPurchases = [
                            ...allPurchases.slice(0, foundIdx),
                            modifiedPurchase,
                            ...allPurchases.slice(foundIdx + 1,),
                        ];
                        set(atomAllPurchases, updatedAllPurchases);
                        return {
                            result: true,
                            code: modifiedPurchase.purchase_code,
                        };
                    } else {
                        console.log('\t[ modifyPurchase ] No specified purchase is found');
                        return {
                            result: false,
                        };
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyPurchase ] Error : ${err}`);
                return false;
            };
        });
        const setCurrentPurchase = getCallback(({set, snapshot}) => async (code) => {
            try{
                if(code === undefined || code === null) {
                    set(atomCurrentPurchase, defaultPurchase);
                    return;
                };

                let queriedPurchases = await snapshot.getPromise(atomAllPurchases);

                if(queriedPurchases.length === 0){
                    queriedPurchases = await snapshot.getPromise(atomCompanyPurchases);
                };
                const selected_arrary = queriedPurchases.filter(purchase => purchase.purchase_code === code);
                if(selected_arrary.length > 0){
                    set(atomCurrentPurchase, selected_arrary[0]);
                } else {
                    set(atomCurrentPurchase, defaultPurchase);
                }
            }
            catch(err){
                console.error(`setCurrentPurchase / Error : ${err}`);
            };
        });
        return {
            loadAllPurchases,
            loadCompanyPurchases,
            modifyPurchase,
            setCurrentPurchase,
            filterPurchases,
            filterCompanyPurchase
        };
    }
});
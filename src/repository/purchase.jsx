import React from 'react';
import { selector } from "recoil";
import { atomCurrentPurchase
    , atomAllPurchaseObj
    , atomCompanyPurchases
    , atomFilteredPurchaseArray
    , defaultPurchase
    , atomPurchaseState
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const PurchaseRepo = selector({
    key: "PurchaseRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all Purchases /////////////////////////////
        const tryLoadAllPurchases = getCallback(({ set, snapshot }) => async () => {
            const loadStates = await snapshot.getPromise(atomPurchaseState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllPurchases] Try to load all Purchases');
                set(atomPurchaseState, (loadStates | 2));   // state : loading
                const ret = await loadAllPurchases();
                if(ret){
                    // succeeded to load
                    set(atomPurchaseState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomPurchaseState, 0);
                };
            }
        });
        const loadAllPurchases = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/purchases`);
                const data = await response.json();
                if(data.message){
                    console.log('loadAllPurchases message:', data.message);
                    set(atomAllPurchaseObj, []);
                    set(atomFilteredPurchaseArray, []);
                    return false;
                }
                let allPurchases = {};
                let filteredPurchases = [];
                data.forEach(item => {
                    allPurchases[item.purchase_code] = item;
                    filteredPurchases.push(item);
                });
                set(atomAllPurchaseObj, allPurchases);
                set(atomFilteredPurchaseArray, filteredPurchases);
                return true;
            }
            catch(err){
                console.error(`loadAllPurchases / Error : ${err}`);
                set(atomAllPurchaseObj, []);
                set(atomFilteredPurchaseArray, []);
                return false;
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
            set(atomFilteredPurchaseArray, allPurchase);
            return true;
        });
        const filterPurchases = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allPurchaseData = await snapshot.getPromise(atomAllPurchaseObj);
            const allPurchaseList = Object.values(allPurchaseData);
            let  allQPurchase = [];
            
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
            set(atomFilteredPurchaseArray, allQPurchase);
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

                const allPurchases = await snapshot.getPromise(atomAllPurchaseObj);
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
                    //----- Update AllPurchaseObj --------------------------//
                    const updatedAllPurchases = {
                        ...allPurchases,
                        [data.out_purchase_code]: updatedNewPurchase,
                    };
                    set(atomAllPurchaseObj, updatedAllPurchases);

                    //----- Update FilteredPurchaseArray --------------------//
                    const filteredAllCompanies = await snapshot.getPromise(atomFilteredPurchaseArray);
                    const updatedFiltered = [
                        updatedNewPurchase,
                        ...filteredAllCompanies
                    ];
                    set(atomFilteredPurchaseArray, updatedFiltered);
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

                    //----- Update AllPurchaseObj --------------------------//
                    const updatedAllPurchases = {
                        ...allPurchases,
                        [modifiedPurchase.purchase_code] : modifiedPurchase,
                    };
                    set(atomAllPurchaseObj, updatedAllPurchases);

                    //----- Update FilteredCompanies -----------------------//
                    const filteredAllPurchases = await snapshot.getPromise(atomFilteredPurchaseArray);
                    const foundIdx = filteredAllPurchases.filter(item => item.purchase_code === modifiedPurchase.purchase_code);
                    if(foundIdx !== -1){
                        const updatedFiltered = [
                            ...filteredAllPurchases.slice(0, foundIdx),
                            modifiedPurchase,
                            ...filteredAllPurchases.slice(foundIdx + 1,),
                        ];
                        set(atomFilteredPurchaseArray, updatedFiltered);
                    };
                    return {
                        result: true,
                        code: modifiedPurchase.purchase_code,
                    };
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

                let queriedPurchases = await snapshot.getPromise(atomAllPurchaseObj);

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
        const searchPurchases = getCallback(({set, snapshot}) => async (itemName, filterText) => {
            // At first, request data to server
            let foundInServer = {};
            let foundData = [];
            const query_obj = {
                queryConditions: [{
                    column: { value: itemName},
                    columnQueryCondition: { value: 'like'},
                    multiQueryInput: filterText,
                    andOr: 'And',
                }],
            };
            const input_json = JSON.stringify(query_obj);
            try{
                const response = await fetch(`${BASE_PATH}/purchases`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ searchPurchases ] message:', data.message);
                    return { result: false, message: data.message};
                } else {
                    for(const item of data) {
                        foundInServer[item.purchase_code] = item;
                    };
                    foundData = data.sort((a, b) => {
                        const a_date = new Date(a.modify_date);
                        const b_date = new Date(b.modify_date);
                        if(a_date > b_date) return 1;
                        if(a_date < b_date) return -1;
                        return 0;
                    });
                };
            } catch(e) {
                console.log('\t[ searchPurchases ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };

            //----- Update AllPurchaseObj --------------------------//
            const allPurchaseData = await snapshot.getPromise(atomAllPurchaseObj);
            const updatedAllPurchaseData = {
                ...allPurchaseData,
                ...foundInServer,
            };
            set(atomAllPurchaseObj, updatedAllPurchaseData);

            //----- Update FilteredPurchases -----------------------//
            const updatedList = Object.values(updatedAllPurchaseData);
            set(atomFilteredPurchaseArray, updatedList);
            
            return { result: true, data: foundData};
        });
        return {
            tryLoadAllPurchases,
            loadAllPurchases,
            loadCompanyPurchases,
            modifyPurchase,
            setCurrentPurchase,
            filterPurchases,
            filterCompanyPurchase,
            searchPurchases,
        };
    }
});
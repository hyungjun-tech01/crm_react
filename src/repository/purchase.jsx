import React from 'react';
import { selector } from "recoil";
import { atomCurrentPurchase
    , atomAllPurchaseObj
    , atomFilteredPurchaseArray
    , defaultPurchase
    , atomPurchaseState,
    atomCurrentCompany,
    defaultCompany,
    atomPurchaseByCompany
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const purchaseColumn = [
    { value: 'company_name', label: '회사명'},
    { value: 'product_class_name', label: '제품분류명'},
    { value: 'product_name', label: '제품명'},
    { value: 'licence_info', label: '라인센스정보'},
    { value: 'purchase_memo', label: '구매 메모'},
];


export const PurchaseRepo = selector({
    key: "PurchaseRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all Purchases /////////////////////////////
        const tryLoadAllPurchases = getCallback(({ set, snapshot }) => async (multiQueryCondi) => {
            const loadStates = await snapshot.getPromise(atomPurchaseState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllPurchases] Try to load all Purchases');
                set(atomPurchaseState, (loadStates | 2));   // state : loading
                const ret = await loadAllPurchases(multiQueryCondi);
                if(ret){
                    // succeeded to load
                    set(atomPurchaseState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomPurchaseState, 0);
                };
            }
        });
        const loadAllPurchases = getCallback(({set}) => async (multiQueryCondi) => {
            const input_json = JSON.stringify(multiQueryCondi);
            try{
                const response = await fetch(`${BASE_PATH}/purchases`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('loadAllPurchases message:', data.message);
                    set(atomAllPurchaseObj, {});
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
        // const loadCompanyPurchases = getCallback(({set}) => async (company_code) => {
        //     const input_json = {company_code:company_code};
        //     //JSON.stringify(company_code);
        //     try{
        //         const response = await fetch(`${BASE_PATH}/companyPurchases`, {
        //             method: "POST",
        //             headers:{'Content-Type':'application/json'},
        //             body: JSON.stringify(input_json),
        //         });

        //         const data = await response.json();
        //         if(data.message){
        //             console.log('loadCompanyPurchases message:', data.message);
        //             set(atomCompanyPurchases, input_json);
        //             return;
        //         }
        //         set(atomCompanyPurchases, data);
        //     }
        //     catch(err){
        //         console.error(`loadCompanyPurchases / Error : ${err}`);
        //     };
        // });
        // const filterCompanyPurchase = getCallback(({set, snapshot }) => async (filterText) => {
        //     const allPurchaseList = await snapshot.getPromise(atomCompanyPurchases);
            
        //     let allPurchase;
        //     if (filterText === '') {
        //         allPurchase = allPurchaseList;
        //     }
        //     else {
        //         allPurchase = 
        //         allPurchaseList.filter(item => ( item.product_type && item.product_type.includes(filterText)||
        //                                         item.product_name && item.product_name.includes(filterText)      
        //         ));
        //     }
        //     set(atomFilteredPurchaseArray, allPurchase);
        //     return true;
        // });
        const filterPurchases = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allPurchaseData = await snapshot.getPromise(atomAllPurchaseObj);
            const allPurchaseList = Object.values(allPurchaseData);
            let  allQPurchase = [];
            
            if(itemName === 'common.all'){
                allQPurchase = allPurchaseList.filter(item => (item.product_class_name &&item.product_class_name.includes(filterText))||
                                            (item.product_name && item.product_name.includes(filterText)) ||
                                            (item.company_name && item.company_name.includes(filterText)) ||
                                            (item.licence_info  && item.licence_info.includes(filterText)) ||
                                            (item.purchase_memo  && item.purchase_memo.includes(filterText)) 
                );
            }else if(itemName === 'purchase.product_class_name'){
                allQPurchase = allPurchaseList.filter(item => (item.product_class_name &&item.product_class_name.includes(filterText))
                );    
            }else if(itemName === 'purchase.product_name'){
                allQPurchase = allPurchaseList.filter(item => (item.product_name &&item.product_name.includes(filterText))
                );  
            }else if(itemName === 'company.company_name'){
                allQPurchase = allPurchaseList.filter(item => (item.company_name &&item.company_name.includes(filterText))
                );  
            }else if(itemName === 'purchase.licence_info'){
                allQPurchase = allPurchaseList.filter(item => (item.licence_info &&item.licence_info.includes(filterText))
                );  
            }else if(itemName ==='common.memo'){
                allQPurchase = allPurchaseList.filter(item => (item.purchase_memo &&item.purchase_memo.includes(filterText))
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
                    return {result: false, data: data.message};
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
                    const updatedAllObj = {
                        ...allPurchases,
                        [data.out_purchase_code]: updatedNewPurchase,
                    };
                    set(atomAllPurchaseObj, updatedAllObj);

                    //----- Update FilteredPurchaseArray --------------------//
                    set(atomFilteredPurchaseArray, Object.values(updatedAllObj));

                    //----- Update PurchaseByCompany --------------------//
                    const currentCompany = await snapshot.getPromise(atomCurrentCompany);
                    if((currentCompany !== defaultCompany)
                        && (currentCompany.company_code === updatedNewPurchase.company_code)) {
                        const purchaseByCompany = await snapshot.getPromise(atomPurchaseByCompany);
                        const updated = [
                            updatedNewPurchase,
                            ...purchaseByCompany,
                        ];
                        set(atomPurchaseByCompany, updated);
                    };
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
                    const updatedAllObj = {
                        ...allPurchases,
                        [modifiedPurchase.purchase_code] : modifiedPurchase,
                    };
                    set(atomAllPurchaseObj, updatedAllObj);

                    //----- Update FilteredPurchaseArray --------------------//
                    set(atomFilteredPurchaseArray, Object.values(updatedAllObj));

                    //----- Update PurchaseByCompany --------------------//
                    const currentCompany = await snapshot.getPromise(atomCurrentCompany);
                    if((currentCompany !== defaultCompany)
                        && (currentCompany.company_code === modifiedPurchase.company_code)) {
                        const purchaseByCompany = await snapshot.getPromise(atomPurchaseByCompany);
                        const foundIdx = purchaseByCompany.findIndex(item => item.purchase_code === modifiedPurchase.purchase_code);
                        if(foundIdx !== -1) {
                            const updated = [
                                ...purchaseByCompany.slice(0, foundIdx),
                                modifiedPurchase,
                                ...purchaseByCompany.slice(foundIdx + 1,),
                            ];
                            set(atomPurchaseByCompany, updated);
                        };
                    };
                    return {
                        result: true,
                        code: modifiedPurchase.purchase_code,
                    };
                }
            }
            catch(err){
                return {result: false, data: err};
            };
        });
        const setCurrentPurchase = getCallback(({set, snapshot}) => async (purchase_code) => {
            try{
                if(purchase_code === undefined || purchase_code === null) {
                    set(atomCurrentPurchase, defaultPurchase);
                    return;
                };
                const allPurchases = await snapshot.getPromise(atomAllPurchaseObj);
                if(allPurchases[purchase_code]){
                    set(atomCurrentPurchase, allPurchases[purchase_code]);
                } else {
                    const found = await searchPurchases('purchase_code', purchase_code, true);
                    if(found.result) {
                        set(atomCurrentPurchase, found.data[0]);
                        
                        const updatedAllPurchases = {
                            ...allPurchases,
                            [found.data[0].purchase_code] : found.data[0],
                        };
                        set(atomAllPurchaseObj, updatedAllPurchases);
                        set(atomFilteredPurchaseArray, Object.values(updatedAllPurchases));
                    } else {
                        set(atomCurrentPurchase, defaultPurchase);
                    };
                };
            }
            catch(err){
                console.error(`setCurrentPurchase / Error : ${err}`);
                set(atomCurrentPurchase, defaultPurchase);
            };
        });
        const searchPurchases = getCallback(() => async (itemName, filterText, isAccurate = false) => {
            // At first, request data to server
            let foundInServer = {};
            let foundData = [];
            const query_obj = {
                queryConditions: [{
                    column: { value: `tpi.${itemName}`},
                    columnQueryCondition: { value: isAccurate ? '=' : 'like'},
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

            // //----- Update AllPurchaseObj --------------------------//
            // const allPurchaseData = await snapshot.getPromise(atomAllPurchaseObj);
            // const updatedAllPurchaseData = {
            //     ...allPurchaseData,
            //     ...foundInServer,
            // };
            // set(atomAllPurchaseObj, updatedAllPurchaseData);

            // //----- Update FilteredPurchases -----------------------//
            // const updatedList = Object.values(updatedAllPurchaseData);
            // set(atomFilteredPurchaseArray, updatedList);
            
            return { result: true, data: foundData};
        });
        return {
            tryLoadAllPurchases,
            loadAllPurchases,
            modifyPurchase,
            filterPurchases,
            setCurrentPurchase,
            searchPurchases,
        };
    }
});
import React from 'react';
import { selector } from "recoil";
import {
    atomCurrentTaxInvoice
    , atomAllTaxInvoiceObj
    , atomTaxInvoiceArray
    , atomTaxInvoiceState
    , defaultTaxInvoice,
    atomCurrentCompany,
    defaultCompany,
    atomTaxInvoiceByCompany
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const TaxInvoiceRepo = selector({
    key: "TaxInvoiceRepository",
    get: ({ getCallback }) => {
        /////////////////////try to load all Transactions /////////////////////////////
        const tryLoadTaxInvoices = getCallback(({ set, snapshot }) => async (compnay_code) => {
            const loadStates = await snapshot.getPromise(atomTaxInvoiceState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadTaxInvoices] Try to load all Transactions');
                set(atomTaxInvoiceState, (loadStates | 2));   // state : loading
                const ret = await loadTaxInvoices(compnay_code);
                if(ret){
                    // succeeded to load
                    set(atomTaxInvoiceState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomTaxInvoiceState, 0);
                };
            }
        });
        const loadTaxInvoices = getCallback(({ set }) => async (code) => {
            const input_json = JSON.stringify({company_code: code});
            try {
                console.log('[TaxInvoiceRepository] Try loading all')
                const response = await fetch(`${BASE_PATH}/companyTaxInvoice`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });

                const data = await response.json();
                if (data.message) {
                    console.log('loadTaxInvoices message:', data.message);
                    set(atomAllTaxInvoiceObj, []);
                    if(data.message === 'no data')
                        return true;
                    else
                        return false;
                }
                let allObj = {};
                let filteredArray = [];
                data.forEach(item => {
                    allObj[item.tax_invoice_code] = item;
                    filteredArray.push(item);
                });
                set(atomAllTaxInvoiceObj, allObj);
                set(atomTaxInvoiceArray, filteredArray);
                return true;
            }
            catch (err) {
                console.error(`loadTaxInvoices / Error : ${err}`);
                return false;
            };
        });
        const modifyTaxInvoice = getCallback(({ set, snapshot }) => async (newTaxInvoice) => {
            const input_json = JSON.stringify(newTaxInvoice);
            console.log(`[ modifyTransaction ] input : `, input_json);
            try {
                const response = await fetch(`${BASE_PATH}/modifyTaxInvoice`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: input_json,
                });
                const data = await response.json();
                if (data.message) {
                    return {result:false, data: data.message};
                };

                const allTaxInvoices = await snapshot.getPromise(atomAllTaxInvoiceObj);
                if (newTaxInvoice.action_type === 'ADD') {
                    delete newTaxInvoice.action_type;
                    const updatedTaxInvoice = {
                        ...newTaxInvoice,
                        tax_invoice_code: data.out_tax_invoice_code,
                        creater: data.out_create_user,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    //----- Update AllPurchaseObj --------------------------//
                    const updatedAllObj = {
                        ...allTaxInvoices,
                        [data.out_tax_invoice_code]: updatedTaxInvoice,
                    };
                    set(atomTaxInvoiceState, updatedAllObj);

                    //----- Update FilteredPurchaseArray --------------------//
                    set(atomTaxInvoiceArray, Object.values(updatedAllObj));

                    //----- Update PurchaseByCompany --------------------//
                    const currentCompany = await snapshot.getPromise(atomCurrentCompany);
                    if((currentCompany !== defaultCompany)
                        && (currentCompany.company_code === updatedTaxInvoice.company_code)) {
                        const taxInvoiceByCompany = await snapshot.getPromise(atomTaxInvoiceByCompany);
                        const updated = [
                            ...taxInvoiceByCompany,
                            updatedTaxInvoice,
                        ];
                        set(atomTaxInvoiceByCompany, updated);
                    };
                    return {result: true};
                } else if (newTaxInvoice.action_type === 'UPDATE') {
                    const currentTaxInvoice = await snapshot.getPromise(atomCurrentTaxInvoice);
                    delete newTaxInvoice.action_type;
                    delete newTaxInvoice.company_code;
                    delete newTaxInvoice.modify_user;
                    const modifiedTaxInvoice = {
                        ...currentTaxInvoice,
                        ...newTaxInvoice,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentTaxInvoice, modifiedTaxInvoice);

                    //----- Update AllPurchaseObj --------------------------//
                    const updatedAllObj = {
                        ...allTaxInvoices,
                        [modifiedTaxInvoice.tax_invoice_code]: modifiedTaxInvoice,
                    };
                    set(atomTaxInvoiceState, updatedAllObj);

                    //----- Update FilteredPurchaseArray --------------------//
                    set(atomTaxInvoiceArray, Object.values(updatedAllObj));

                    //----- Update PurchaseByCompany --------------------//
                    const currentCompany = await snapshot.getPromise(atomCurrentCompany);
                    if((currentCompany !== defaultCompany)
                        && (currentCompany.company_code === modifiedTaxInvoice.company_code)) {
                        const taxInvoiceByCompany = await snapshot.getPromise(atomTaxInvoiceByCompany);
                        const foundIdx = taxInvoiceByCompany.findIndex(item => item.tax_invoice_code === modifiedTaxInvoice.tax_invoice_code);
                        if(foundIdx !== -1) {
                            const updated = [
                                ...taxInvoiceByCompany.slice(0, foundIdx),
                                modifiedTaxInvoice,
                                ...taxInvoiceByCompany.slice(foundIdx + 1,),
                            ];
                            set(atomTaxInvoiceByCompany, updated);
                        };
                    };
                    return {result: true};
                }
            }
            catch (err) {
                return {result:false, data: err};
            };
        });
        const setCurrentTaxInvoice = getCallback(({set, snapshot}) => async (tax_invoice_code) => {
            try{
                if(tax_invoice_code === undefined || tax_invoice_code === null) {
                    set(atomCurrentTaxInvoice, defaultTaxInvoice);
                    return;
                };
                const allTaxInvoices = await snapshot.getPromise(atomAllTaxInvoiceObj);
                if(!allTaxInvoices[tax_invoice_code]){
                    // consulting이 없다면 쿼리 
                    const found = await searchTaxInvoices('tax_invoice_code', tax_invoice_code, true);
                    if(found.result) {
                        set(atomCurrentTaxInvoice, found.data[0]);
                        let foundObj = {};
                        found.data.forEach(item => {
                            foundObj[item.tax_invoice_code] = item;
                        });
                        const updatedAllTaxInvoices = {
                            ...allTaxInvoices,
                            ...foundObj,
                        };
                        set(atomAllTaxInvoiceObj, updatedAllTaxInvoices);

                        const allFiltered = await snapshot.getPromise(atomTaxInvoiceArray);
                        set(atomTaxInvoiceArray, [...allFiltered, ...found.data]);
                    } else {
                        set(atomCurrentTaxInvoice, defaultTaxInvoice);
                    };
                }else{
                    set(atomCurrentTaxInvoice, allTaxInvoices[tax_invoice_code]);
                }
            }
            catch(err){
                console.error(`setCurrentTaxInvoice / Error : ${err}`);
                set(atomCurrentTaxInvoice, defaultTaxInvoice);
            };
        });
        const searchTaxInvoices = getCallback(() => async (itemName, filterText, isAccurate = false) => {
            // At first, request data to server
            let foundInServer = {};
            let foundData = [];
            const query_obj = {
                queryConditions: [{
                    column: { value: `tti.${itemName}`},
                    columnQueryCondition: { value: isAccurate ? '=' : 'like'},
                    multiQueryInput: filterText,
                    andOr: 'And',
                }],
            };
            const input_json = JSON.stringify(query_obj);
            try{
                const response = await fetch(`${BASE_PATH}/taxInvoice`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ searchTaxInvoices ] message:', data.message);
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
                console.log('\t[ searchTaxInvoices ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };

            // //----- Update AllTaxInvoiceObj --------------------------//
            // const allTaxInvoiceData = await snapshot.getPromise(atomAllTaxInvoiceObj);
            // const updatedAllTaxInvoiceData = {
            //     ...allTaxInvoiceData,
            //     ...foundInServer,
            // };
            // set(atomAllTaxInvoiceObj, updatedAllTaxInvoiceData);

            // //----- Update FilteredTaxInvoices -----------------------//
            // const updatedList = Object.values(updatedAllTaxInvoiceData);
            // set(atomFilteredTaxInvoiceArray, updatedList);
            
            return { result: true, data: foundData};
        });
        return {
            tryLoadTaxInvoices,
            loadTaxInvoices,
            modifyTaxInvoice,
            setCurrentTaxInvoice,
            searchTaxInvoices,
        };
    }
});
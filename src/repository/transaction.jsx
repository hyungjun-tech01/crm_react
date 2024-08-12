import React from 'react';
import { selector } from "recoil";
import {
    atomCurrentTransaction
    , atomAllTransactionObj
    , atomFilteredTransactionArray
    , atomTransactionState
    , defaultTransaction
    , atomCurrentCompany
    , defaultCompany,
    atomTransactionByCompany
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const DefaultTransactionContent = {
    transaction_code: null,
    month_day: null,
    product_class_name: null,
    product_name: null,
    standard: null,
    unit: null,
    quantity: 0,
    unit_price: 0,
    supply_price: 0,
    tax_price: 0,
    total_price: 0,
    memo: null,
    transaction_sub_index: null,
    lead_code: null,
    company_name: null,
    statement_number: null,
    transaction_sub_type: null,
    modify_date: null,
};

export const transactionColumn = [
    { value: 'company_name', label: '회사명'},
    { value: 'ceo_name', label: 'CEO 이름'},
    { value: 'company_address', label: '회사 주소'},
    { value: 'transaction_title', label: '거래 제목'},
    { value: 'transaction_contents', label: '거래 내용'},
];

export const TransactionRepo = selector({
    key: "TransactionRepository",
    get: ({ getCallback }) => {
        /////////////////////try to load all Transactions /////////////////////////////
        const tryLoadAllTransactions = getCallback(({ set, snapshot }) => async (multiQueryCondi) => {
            const loadStates = await snapshot.getPromise(atomTransactionState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllTransactions] Try to load all Transactions');
                set(atomTransactionState, (loadStates | 2));   // state : loading
                const ret = await loadAllTransactions(multiQueryCondi);
                if(ret){
                    // succeeded to load
                    set(atomTransactionState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomTransactionState, 0);
                };
            }
        });
        const loadAllTransactions = getCallback(({ set }) => async (multiQueryCondi) => {
            const input_json = JSON.stringify(multiQueryCondi);
            try {
                console.log('[TransactionRepository] Try loading all')
                const response = await fetch(`${BASE_PATH}/transactions`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });

                const data = await response.json();
                if(data.message){
                    console.log('loadAllTransactions message:', data.message);
                    set(atomAllTransactionObj, {});
                    set(atomFilteredTransactionArray, []);
                    return false;
                };
                let allconsultings = {};
                let filteredTransactions = [];
                data.forEach(item => {
                    allconsultings[item.transaction_code] = item;
                    filteredTransactions.push(item);
                });
                set(atomAllTransactionObj, allconsultings);
                set(atomFilteredTransactionArray, filteredTransactions);
                return true;
            }
            catch(err){
                console.error(`loadAllTransactions / Error : ${err}`);
                set(atomAllTransactionObj, {});
                set(atomFilteredTransactionArray, []);
                return false;
            };
        });
        const filterTransactions = getCallback(({ set, snapshot }) => async (itemName, filterText) => {
            const allTransactionList = await snapshot.getPromise(atomAllTransactionObj);
            let allTransaction;
            console.log('filterTransactions', itemName, filterText);
            if (itemName === 'common.all') {
                allTransaction = allTransactionList.filter(item => (item.company_name && item.company_name.includes(filterText)) ||
                    (item.transaction_title && item.transaction_title.includes(filterText)) ||
                    (item.transaction_type && item.transaction_type.includes(filterText)) ||
                    (item.publish_type && item.publish_type.includes(filterText)) ||
                    (item.payment_type && item.payment_type.includes(filterText))
                );
            } else if (itemName === 'company.company_name') {
                allTransaction = allTransactionList.filter(item => (item.company_name && item.company_name.includes(filterText))
                );
            } else if (itemName === 'transaction.title') {
                allTransaction = allTransactionList.filter(item => (item.transaction_title && item.transaction_title.includes(filterText))
                );
            } else if (itemName === 'transaction.type') {
                allTransaction = allTransactionList.filter(item => (item.transaction_type && item.transaction_type.includes(filterText))
                );
            } else if (itemName === 'transaction.publish_type') {
                allTransaction = allTransactionList.filter(item => (item.publish_type && item.publish_type.includes(filterText))
                );
            } else if (itemName === 'transaction.payment_type') {
                allTransaction = allTransactionList.filter(item => (item.payment_type && item.payment_type.includes(filterText))
                );
            }
            set(atomFilteredTransactionArray, allTransaction);
            return true;
        });
        const modifyTransaction = getCallback(({ set, snapshot }) => async (newTransaction) => {
            const input_json = JSON.stringify(newTransaction);
            try {
                const response = await fetch(`${BASE_PATH}/modifyTransaction`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: input_json,
                });
                const data = await response.json();
                if (data.message) {
                    return {result:false, data: data.message};
                };

                const allTransactions = await snapshot.getPromise(atomAllTransactionObj);
                if (newTransaction.action_type === 'ADD') {
                    delete newTransaction.action_type;
                    const updatedNewTransaction = {
                        ...newTransaction,
                        transaction_code: data.out_transaction_code,
                        creater: data.out_create_user,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    //----- Update AllTransactionObj --------------------------//
                    const updatedAllObj = {
                        ...allTransactions,
                        [updatedNewTransaction.transaction_code] : updatedNewTransaction,
                    };
                    set(atomAllTransactionObj, updatedAllObj);

                    //----- Update FilteredTransactionArray --------------------//
                    set(atomFilteredTransactionArray, Object.values(updatedAllObj));

                    //----- Update TransactionByCompany --------------------//
                    const currentCompany = await snapshot.getPromise(atomCurrentCompany);
                    if((currentCompany !== defaultCompany)
                        && (currentCompany.company_code === updatedNewTransaction.company_code)) {
                        const transactionByCompany = await snapshot.getPromise(atomTransactionByCompany);
                        const updated = [
                            updatedNewTransaction,
                            ...transactionByCompany,
                        ];
                        set(atomTransactionByCompany, updated);
                    };
                    return {result: true};
                } else if (newTransaction.action_type === 'UPDATE') {
                    const currentTransaction = await snapshot.getPromise(atomCurrentTransaction);
                    delete newTransaction.action_type;
                    delete newTransaction.company_code;
                    delete newTransaction.modify_user;
                    const modifiedTransaction = {
                        ...currentTransaction,
                        ...newTransaction,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentTransaction, modifiedTransaction);

                    //----- Update AllTransactionObj --------------------------//
                    const updatedAllObj = {
                        ...allTransactions,
                        [modifiedTransaction.transaction_code] : modifiedTransaction,
                    };
                    set(atomAllTransactionObj, updatedAllObj);

                    //----- Update FilteredTransactionArray --------------------//
                    set(atomFilteredTransactionArray, Object.values(updatedAllObj));

                    //----- Update TransactionByCompany --------------------//
                    const currentCompany = await snapshot.getPromise(atomCurrentCompany);
                    if((currentCompany !== defaultCompany)
                        && (currentCompany.company_code === modifiedTransaction.company_code)) {
                        const transactionByCompany = await snapshot.getPromise(atomTransactionByCompany);
                        const foundIdx = transactionByCompany.findIndex(item => item.transaction_code === modifiedTransaction.transaction_code);
                        const updated = [
                            ...transactionByCompany.slice(0, foundIdx),
                            modifiedTransaction,
                            ...transactionByCompany.slice(foundIdx + 1, ),
                        ];
                        set(atomTransactionByCompany, updated);
                    };
                    return {result: true};
                };
            }
            catch (err) {
                return {result:false, data: err};
            };
        });
        const setCurrentTransaction = getCallback(({set, snapshot}) => async (transaction_code) => {
            try{
                if(transaction_code === undefined || transaction_code === null) {
                    set(atomCurrentTransaction, defaultTransaction);
                    return;
                };
                const allTransactions = await snapshot.getPromise(atomAllTransactionObj);
                if(!allTransactions[transaction_code]){
                    // consulting이 없다면 쿼리 
                    const found = await searchTransactions('transaction_code', transaction_code, true);
                    if(found.result) {
                        set(atomCurrentTransaction, found.data[0]);
                        let foundObj = {};
                        found.data.forEach(item => {
                            foundObj[item.transaction_code] = item;
                        });
                        const updatedAllTransactions = {
                            ...allTransactions,
                            ...foundObj,
                        };
                        set(atomAllTransactionObj, updatedAllTransactions);

                        const allFiltered = await snapshot.getPromise(atomFilteredTransactionArray);
                        set(atomFilteredTransactionArray, [...allFiltered, ...found.data]);
                    } else {
                        set(atomCurrentTransaction, defaultTransaction);
                    };
                }else{
                    set(atomCurrentTransaction, allTransactions[transaction_code]);
                }
            }
            catch(err){
                console.error(`setCurrentTransaction / Error : ${err}`);
                set(atomCurrentTransaction, defaultTransaction);
            };
        });
        const searchTransactions = getCallback(() => async (itemName, filterText, isAccurate = false) => {
            // At first, request data to server
            let foundInServer = {};
            let foundData = [];
            const query_obj = {
                queryConditions: [{
                    column: { value: itemName},
                    columnQueryCondition: { value: isAccurate ? '=' : 'like'},
                    multiQueryInput: filterText,
                    andOr: 'And',
                }],
            };
            const input_json = JSON.stringify(query_obj);
            try{
                const response = await fetch(`${BASE_PATH}/transactions`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ searchTransactions ] message:', data.message);
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
                console.log('\t[ searchTransactions ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };

            // //----- Update AllTransactionObj --------------------------//
            // const allTransactionData = await snapshot.getPromise(atomAllTransactionObj);
            // const updatedAllTransactionData = {
            //     ...allTransactionData,
            //     ...foundInServer,
            // };
            // set(atomAllTransactionObj, updatedAllTransactionData);

            // //----- Update FilteredTransactions -----------------------//
            // const updatedList = Object.values(updatedAllTransactionData);
            // set(atomFilteredTransactionArrayArray, updatedList);
            
            return { result: true, data: foundData};
        });
        return {
            tryLoadAllTransactions,
            loadAllTransactions,
            modifyTransaction,
            setCurrentTransaction,
            filterTransactions,
            searchTransactions,
        };
    }
});
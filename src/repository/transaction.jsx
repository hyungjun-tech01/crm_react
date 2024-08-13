import React from 'react';
import { selector } from "recoil";
import {
    atomCurrentTransaction
    , atomAllTransactions
    , atomFilteredTransaction
    , atomTransactionState,
    defaultTransaction
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const DefaultTransactionContent = {
    transaction_code: null,
    month_day: null,
    product_class_name: '',
    product_name: '',
    standard: '',
    unit: '',
    quantity: 0,
    unit_price: 0,
    supply_price: 0,
    tax_price: 0,
    total_price: 0,
    memo: '',
    transaction_sub_index: 0,
    company_code: null,
    lead_code: null,
    company_name: '',
    statement_number: '',
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
                if (data.message) {
                    console.log('loadAllTransactions message:', data.message);
                    set(atomAllTransactions, []);
                    return false;
                }
                set(atomAllTransactions, data);
                return true;
            }
            catch (err) {
                console.error(`loadAllTransactions / Error : ${err}`);
                return false;
            };
        });
        const filterTransactions = getCallback(({ set, snapshot }) => async (itemName, filterText) => {
            const allTransactionList = await snapshot.getPromise(atomAllTransactions);
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
            set(atomFilteredTransaction, allTransaction);
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

                const allTransactions = await snapshot.getPromise(atomAllTransactions);
                if (newTransaction.action_type === 'ADD') {
                    delete newTransaction.action_type;
                    const updatedNewTransaction = {
                        ...newTransaction,
                        transaction_code: data.out_transaction_code,
                        creater: data.out_create_user,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllTransactions, [updatedNewTransaction, ...allTransactions]);
                    return {result: true, code: data.out_transaction_code};
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
                    const foundIdx = allTransactions.findIndex(transaction =>
                        transaction.transaction_code === modifiedTransaction.transaction_code);
                    if (foundIdx !== -1) {
                        const updatedAllTransactions = [
                            ...allTransactions.slice(0, foundIdx),
                            modifiedTransaction,
                            ...allTransactions.slice(foundIdx + 1,),
                        ];
                        set(atomAllTransactions, updatedAllTransactions);
                        return {result: true};
                    } else {
                        return {result:false, data: "No Data"};
                    }
                }
            }
            catch (err) {
                return {result:false, data: err};
            };
        });
        const setCurrentTransaction = getCallback(({ set, snapshot }) => async (transaction_code) => {
            try {
                if(transaction_code === undefined || transaction_code === null) {
                    set(atomCurrentTransaction, defaultTransaction);
                    return;
                };
                const allTransactions = await snapshot.getPromise(atomAllTransactions);
                const selected_arrary = allTransactions.filter(transaction => transaction.transaction_code === transaction_code);
                if (selected_arrary.length > 0) {
                    set(atomCurrentTransaction, selected_arrary[0]);
                } else {
                    set(atomCurrentTransaction, defaultTransaction);
                }
            }
            catch (err) {
                console.error(`setCurrentTransaction / Error : ${err}`);
            };
        });
        return {
            tryLoadAllTransactions,
            loadAllTransactions,
            modifyTransaction,
            setCurrentTransaction,
            filterTransactions,
        };
    }
});
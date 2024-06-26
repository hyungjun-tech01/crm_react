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

export const TransactionRepo = selector({
    key: "TransactionRepository",
    get: ({ getCallback }) => {
        const loadAllTransactions = getCallback(({ set, snapshot }) => async () => {
            // It is possible that this function might be called by more than two componets almost at the same time.
            // So, to prevent this function from being executed again and again, check the loading state at first.
            const loadStates = await snapshot.getPromise(atomTransactionState);
            if ((loadStates & 1) === 0) {
                try {
                    console.log('[TransactionRepository] Try loading all')
                    const response = await fetch(`${BASE_PATH}/transactions`);
                    const data = await response.json();
                    if (data.message) {
                        console.log('loadAllTransactions message:', data.message);
                        set(atomAllTransactions, []);
                        return;
                    }
                    set(atomAllTransactions, data);
                    set(atomTransactionState, (loadStates | 1));
                }
                catch (err) {
                    console.error(`loadAllCompanies / Error : ${err}`);
                };
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
            console.log(`[ modifyTransaction ] input : `, input_json);
            try {
                const response = await fetch(`${BASE_PATH}/modifyTransaction`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: input_json,
                });
                const data = await response.json();
                if (data.message) {
                    console.log('\t[ modifyTransaction ] message:', data.message);
                    return false;
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
                    return true;
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
                        return true;
                    } else {
                        console.log('\t[ modifyTransaction ] No specified transaction is found');
                        return false;
                    }
                }
            }
            catch (err) {
                console.error(`\t[ modifyTransaction ] Error : ${err}`);
                return false;
            };
        });
        const setCurrentTransaction = getCallback(({ set, snapshot }) => async (transaction_code) => {
            try {
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
            loadAllTransactions,
            modifyTransaction,
            setCurrentTransaction,
            filterTransactions,
        };
    }
});
import React from 'react';
import { selector } from "recoil";
import {
    atomCurrentTaxInvoice
    , atomTaxInvoiceSet
    , atomTaxInvoiceState
    , defaultTaxInvoice
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const TaxInvoiceRepo = selector({
    key: "TaxInvoiceRepository",
    get: ({ getCallback }) => {
        /////////////////////try to load all Transactions /////////////////////////////
        const tryLoadTaxInvoices = getCallback(({ set, snapshot }) => async (multiQueryCondi) => {
            const loadStates = await snapshot.getPromise(atomTaxInvoiceState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllTransactions] Try to load all Transactions');
                set(atomTaxInvoiceState, (loadStates | 2));   // state : loading
                const ret = await loadTaxInvoices(multiQueryCondi);
                if(ret){
                    // succeeded to load
                    set(atomTaxInvoiceState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomTaxInvoiceState, 0);
                };
            }
        });
        const loadTaxInvoices = getCallback(({ set }) => async (multiQueryCondi) => {
            const input_json = JSON.stringify(multiQueryCondi);
            try {
                console.log('[TransactionRepository] Try loading all')
                const response = await fetch(`${BASE_PATH}/taxInvoice`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });

                const data = await response.json();
                if (data.message) {
                    console.log('loadAllTransactions message:', data.message);
                    set(atomTaxInvoiceSet, []);
                    return false;
                }
                set(atomTaxInvoiceSet, data);
                return true;
            }
            catch (err) {
                console.error(`loadAllTransactions / Error : ${err}`);
                return false;
            };
        });
        const modifyTaxInvoice = getCallback(({ set, snapshot }) => async (newTaxInvoice) => {
            const input_json = JSON.stringify(newTaxInvoice);
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

                const allTaxInvoices = await snapshot.getPromise(atomTaxInvoiceSet);
                if (newTaxInvoice.action_type === 'ADD') {
                    delete newTaxInvoice.action_type;
                    const updatedNewTransaction = {
                        ...newTaxInvoice,
                        transaction_code: data.out_transaction_code,
                        creater: data.out_create_user,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomTaxInvoiceState, [updatedNewTransaction, ...allTaxInvoices]);
                    return true;
                } else if (newTaxInvoice.action_type === 'UPDATE') {
                    const currentTransaction = await snapshot.getPromise(atomCurrentTaxInvoice);
                    delete newTaxInvoice.action_type;
                    delete newTaxInvoice.company_code;
                    delete newTaxInvoice.modify_user;
                    const modifiedTransaction = {
                        ...currentTransaction,
                        ...newTaxInvoice,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentTaxInvoice, modifiedTransaction);
                    const foundIdx = allTaxInvoices.findIndex(transaction =>
                        transaction.transaction_code === modifiedTransaction.transaction_code);
                    if (foundIdx !== -1) {
                        const updatedAllTransactions = [
                            ...allTaxInvoices.slice(0, foundIdx),
                            modifiedTransaction,
                            ...allTaxInvoices.slice(foundIdx + 1,),
                        ];
                        set(allTaxInvoices, updatedAllTransactions);
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
        const setCurrentTransaction = getCallback(({ set, snapshot }) => async (invoice_code) => {
            try {
                if(invoice_code === undefined || invoice_code === null) {
                    set(atomCurrentTaxInvoice, defaultTaxInvoice);
                    return;
                };
                const TaxInvoiceSet = await snapshot.getPromise(atomTaxInvoiceSet);
                const selected_arrary = TaxInvoiceSet.filter(tax_invoice => tax_invoice.tax_invoice_code === invoice_code);
                if (selected_arrary.length > 0) {
                    set(atomCurrentTaxInvoice, selected_arrary[0]);
                } else {
                    set(atomCurrentTaxInvoice, defaultTaxInvoice);
                }
            }
            catch (err) {
                console.error(`setCurrentTaxInvoice / Error : ${err}`);
            };
        });
        return {
            tryLoadTaxInvoices,
            loadTaxInvoices,
            modifyTaxInvoice,
            setCurrentTransaction,
        };
    }
});
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
                    set(atomTaxInvoiceSet, []);
                    if(data.message === 'no data')
                        return true;
                    else
                        return false;
                }
                set(atomTaxInvoiceSet, data);
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
                    return {result: true};
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
        const setCurrentTaxInvoice = getCallback(({ set, snapshot }) => async (invoice_code) => {
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
            setCurrentTaxInvoice,
        };
    }
});
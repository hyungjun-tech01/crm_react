import React from 'react';
import { selector } from "recoil";
import {
    atomCurrentTaxInvoice
    , atomTaxInvoiceSet
    , atomTaxInvoiceState
    , atomFilteredTaxInvoices
    , defaultTaxInvoice
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const TaxInvoiceRepo = selector({
    key: "TaxInvoiceRepository",
    get: ({ getCallback }) => {
        /////////////////////try to load all TaxInvoices /////////////////////////////
        const tryLoadTaxInvoices = getCallback(({ set, snapshot }) => async (multiQueryCondi) => {
            const loadStates = await snapshot.getPromise(atomTaxInvoiceState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadTaxInvoices] Try to load all TaxInvoices');
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
                console.log('[TaxInvoiceRepository] Try loading all')
                const response = await fetch(`${BASE_PATH}/taxInvoice`, {
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
        const filterTaxInvoices = getCallback(({ set, snapshot }) => async (itemName, filterText) => {
            const allTaxInvoiceList = await snapshot.getPromise(atomTaxInvoiceSet);
            let allTaxInvoice;
            console.log('filterTaxInvoices', itemName, filterText);
            if (itemName === 'common.all') {
                allTaxInvoice = allTaxInvoiceList.filter(item => (item.company_name && item.company_name.includes(filterText)) ||
                    (item.transaction_title && item.transaction_title.includes(filterText)) ||
                    (item.transaction_type && item.transaction_type.includes(filterText)) ||
                    (item.publish_type && item.publish_type.includes(filterText)) ||
                    (item.payment_type && item.payment_type.includes(filterText))
                );
            } else if (itemName === 'company.company_name') {
                allTaxInvoice = allTaxInvoiceList.filter(item => (item.company_name && item.company_name.includes(filterText))
                );
            } else if (itemName === 'transaction.title') {
                allTaxInvoice = allTaxInvoiceList.filter(item => (item.transaction_title && item.transaction_title.includes(filterText))
                );
            } else if (itemName === 'transaction.type') {
                allTaxInvoice = allTaxInvoiceList.filter(item => (item.transaction_type && item.transaction_type.includes(filterText))
                );
            } else if (itemName === 'transaction.publish_type') {
                allTaxInvoice = allTaxInvoiceList.filter(item => (item.publish_type && item.publish_type.includes(filterText))
                );
            } else if (itemName === 'transaction.payment_type') {
                allTaxInvoice = allTaxInvoiceList.filter(item => (item.payment_type && item.payment_type.includes(filterText))
                );
            }
            set(atomFilteredTaxInvoices, allTaxInvoice);
            return true;
        });
        const modifyTaxInvoice = getCallback(({ set, snapshot }) => async (newTaxInvoice) => {
            const input_json = JSON.stringify(newTaxInvoice);
            console.log(`[ modifyTaxInvoice ] input : `, input_json);
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
                    const updatedNewTaxInvoice = {
                        ...newTaxInvoice,
                        tax_invoice_code: data.out_tax_invoice_code,
                        creater: data.out_create_user,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomTaxInvoiceState, [updatedNewTaxInvoice, ...allTaxInvoices]);
                    
                    return {result: true, code: data.out_tax_invoice_code};
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
                    const foundIdx = allTaxInvoices.findIndex(item =>
                        item.tax_invoice_code === modifiedTaxInvoice.tax_invoice_code);
                    if (foundIdx !== -1) {
                        const updatedAllTaxInvoices = [
                            ...allTaxInvoices.slice(0, foundIdx),
                            modifiedTaxInvoice,
                            ...allTaxInvoices.slice(foundIdx + 1,),
                        ];
                        set(allTaxInvoices, updatedAllTaxInvoices);
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
import React from 'react';
import { selector } from "recoil";
import { atomCurrentTransaction, atomAllTransactions } from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const TransactionRepo = selector({
    key: "TransactionRepository",
    get: ({getCallback}) => {
        const loadAllTransactions = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/transactions`);
                const data = await response.json();
                if(data.message){
                    console.log('loadAllTransactions message:', data.message);
                    set(atomAllTransactions, []);
                    return;
                }
                set(atomAllTransactions, data);
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
        });
        const modifyTransaction = getCallback(({set, snapshot}) => async (newTransaction) => {
            const input_json = JSON.stringify(newTransaction);
            console.log(`[ modifyTransaction ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/modifyTransaction`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyTransaction ] message:', data.message);
                    return false;
                };

                const allTransactions = await snapshot.getPromise(atomAllTransactions);
                if(newTransaction.action_type === 'ADD'){
                    delete newTransaction.action_type;
                    const updatedNewTransaction = {
                        ...newTransaction,
                        transaction_code : data.out_transaction_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllTransactions, allTransactions.concat(updatedNewTransaction));
                    return true;
                } else if(newTransaction.action_type === 'UPDATE'){
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
                    if(foundIdx !== -1){
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
            catch(err){
                console.error(`\t[ modifyTransaction ] Error : ${err}`);
                return false;
            };
        });
        const setCurrentTransaction = getCallback(({set, snapshot}) => async (transaction_code) => {
            try{
                const allTransactions = await snapshot.getPromise(atomAllTransactions);
                const selected_arrary = allTransactions.filter(transaction => transaction.transaction_code === transaction_code);
                if(selected_arrary.length > 0){
                    set(atomCurrentTransaction, selected_arrary[0]);
                }
            }
            catch(err){
                console.error(`setCurrentTransaction / Error : ${err}`);
            };
        });
        return {
            loadAllTransactions,
            modifyTransaction,
            setCurrentTransaction,
        };
    }
});
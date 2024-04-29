import React from 'react';
import { selector } from "recoil";
import { atomCurrentQuotation, atomAllQuotations, defaultQuotation } from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const QuotationSendTypes = [
    { value: 'FAX', label: 'Fax'},
    { value: 'E-Mail', label: 'Email'},
];

export const QuotationRepo = selector({
    key: "QuotationRepository",
    get: ({getCallback}) => {
        const loadAllQuotations = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/quotations`);
                const data = await response.json();
                if(data.message){
                    console.log('loadAllQuotations message:', data.message);
                    set(atomAllQuotations, []);
                    return;
                }
                set(atomAllQuotations, data);
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
        });
        const modifyQuotation = getCallback(({set, snapshot}) => async (newQuotation) => {
            const input_json = JSON.stringify(newQuotation);
            console.log(`[ modifyQuotation ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/modifyQuotation`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyQuotation ] message:', data.message);
                    return false;
                };

                const allQuotations = await snapshot.getPromise(atomAllQuotations);
                if(newQuotation.action_type === 'ADD'){
                    delete newQuotation.action_type;
                    const updatedNewQuotation = {
                        ...newQuotation,
                        quotation_code : data.out_quotation_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    console.log('\t[ modifyQuotation ] new quotation : ', updatedNewQuotation);
                    set(atomAllQuotations, allQuotations.concat(updatedNewQuotation));
                    return true;
                } else if(newQuotation.action_type === 'UPDATE'){
                    const currentQuotation = await snapshot.getPromise(atomCurrentQuotation);
                    delete newQuotation.action_type;
                    delete newQuotation.company_code;
                    delete newQuotation.modify_user;
                    const modifiedQuotation = {
                        ...currentQuotation,
                        ...newQuotation,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentQuotation, modifiedQuotation);
                    const foundIdx = allQuotations.findIndex(quotation => 
                        quotation.quotation_code === modifiedQuotation.quotation_code);
                    if(foundIdx !== -1){
                        const updatedAllQuotations = [
                            ...allQuotations.slice(0, foundIdx),
                            modifiedQuotation,
                            ...allQuotations.slice(foundIdx + 1,),
                        ];
                        set(atomAllQuotations, updatedAllQuotations);
                        return true;
                    } else {
                        console.log('\t[ modifyQuotation ] No specified quotation is found');
                        return false;
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyQuotation ] Error : ${err}`);
                return false;
            };
        });
        const setCurrentQuotation = getCallback(({set, snapshot}) => async (quotation_code) => {
            try{
                if(quotation_code === undefined || quotation_code === null) {
                    set(atomCurrentQuotation, defaultQuotation);
                    return;
                };
                const allQuotations = await snapshot.getPromise(atomAllQuotations);
                const selected_arrary = allQuotations.filter(quotation => quotation.quotation_code === quotation_code);
                if(selected_arrary.length > 0){
                    set(atomCurrentQuotation, selected_arrary[0]);
                }
            }
            catch(err){
                console.error(`setCurrentQuotation / Error : ${err}`);
            };
        });
        return {
            loadAllQuotations,
            modifyQuotation,
            setCurrentQuotation,
        };
    }
});
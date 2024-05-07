import React from 'react';
import { selector } from "recoil";
import { atomCurrentQuotation, atomAllQuotations, defaultQuotation, atomFilteredQuotation } from '../atoms/atoms';

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
        
        const filterQuotations = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allQuotationList = await snapshot.getPromise(atomAllQuotations);
            let  allQuotation ;
            console.log('filterQuotations', itemName, filterText);
            if(itemName === 'common.all'){
                allQuotation = allQuotationList.filter(item => (item.company_name &&item.company_name.includes(filterText))||
                                            (item.quotation_type && item.quotation_type.includes(filterText)) ||
                                            (item.quotation_title && item.quotation_title.includes(filterText)) ||
                                            (item.lead_name && item.lead_name.includes(filterText)) ||
                                            (item.mobile_number && item.mobile_number.includes(filterText)) || 
                                            (item.phone_number && item.phone_number.includes(filterText)) || 
                                            (item.email && item.email.includes(filterText)) 
                );
            }else if(itemName === 'company.company_name'){
                allQuotation = allQuotationList.filter(item => (item.company_name &&item.company_name.includes(filterText))
                );    
            }else if(itemName === 'quotation.quotation_type'){
                allQuotation = allQuotationList.filter(item => (item.quotation_type &&item.quotation_type.includes(filterText))
                );    
            }else if(itemName === 'common.title'){
                allQuotation = allQuotationList.filter(item => (item.quotation_title &&item.quotation_title.includes(filterText))
                );    
            }else if(itemName === 'lead.full_name'){
                allQuotation = allQuotationList.filter(item => (item.lead_name &&item.lead_name.includes(filterText))
                );    
            }else if(itemName === 'lead.mobile'){
                allQuotation = allQuotationList.filter(item => (item.mobile_number &&item.mobile_number.includes(filterText))
                );    
            }else if(itemName === 'common.phone'){
                allQuotation = allQuotationList.filter(item => (item.phone_number &&item.phone_number.includes(filterText))
                );    
            }else if(itemName === 'lead.email'){
                allQuotation = allQuotationList.filter(item => (item.email &&item.email.includes(filterText))
                );    
            }
            set(atomFilteredQuotation, allQuotation);
            return true;
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
            filterQuotations,
        };
    }
});
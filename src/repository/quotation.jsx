import React from 'react';
import { selector } from "recoil";
import { atomCurrentQuotation
    , atomAllQuotationObj
    , defaultQuotation
    , atomCompanyQuotations
    , atomFilteredQuotationArray
    , atomQuotationState,
    atomCurrentLead,
    defaultLead,
    atomQuotationByLead
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const QuotationTypes = [
    { value: '견적서', label: '견적' },
    { value: '발주서', label: '발주' },
];

export const QuotationSendTypes = [
    { value: 'FAX', label: 'Fax'},
    { value: 'E-Mail', label: 'Email'},
];

export const quotationColumn = [
    { value: 'company_name', label: '회사명'},
    { value: 'lead_name', label: '고객명'},
    { value: 'quotation_manager', label: '견적 책임자'},
    { value: 'quotation_title', label: '견적 제목'},
    { value: 'quotation_contents', label: '견적 내용'},
];


export const QuotationRepo = selector({
    key: "QuotationRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all Quotations /////////////////////////////
        const tryLoadAllQuotations = getCallback(({ set, snapshot }) => async (multiQueryCondi) => {
            const loadStates = await snapshot.getPromise(atomQuotationState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllQuotations] Try to load all Quotations');
                set(atomQuotationState, (loadStates | 2));   // state : loading
                const ret = await loadAllQuotations(multiQueryCondi);
                if(ret){
                    // succeeded to load
                    set(atomQuotationState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomQuotationState, 0);
                };
            }
        });
        const loadAllQuotations = getCallback(({set}) => async (multiQueryCondi) => {
            const input_json = JSON.stringify(multiQueryCondi);
            try{
                console.log('[QuotationRepository] Try loading all')
                const response = await fetch(`${BASE_PATH}/quotations`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('loadAllQuotations message:', data.message);
                    set(atomAllQuotationObj, {});
                    return false;
                };
                let allQuotations = {};
                let filteredQuotations = [];
                data.forEach(item => {
                    allQuotations[item.quotation_code] = item;
                    filteredQuotations.push(item);
                });
                set(atomAllQuotationObj, allQuotations);
                set(atomFilteredQuotationArray, filteredQuotations);
                return true;
            }
            catch(err){
                console.error(`loadAllQuotations / Error : ${err}`);
                set(atomAllQuotationObj, {});
                set(atomFilteredQuotationArray, []);
                return false;
            };
        });
        
        const loadCompanyQuotations = getCallback(({set}) => async (company_code) => {
            const input_json = {company_code:company_code};
            //JSON.stringify(company_code);
            try{
                console.log('loadCompanyConsultings' ,company_code);
                const response = await fetch(`${BASE_PATH}/companyQuotations`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify(input_json),
                });
                const data = await response.json();
                if(data.message){
                    console.log('loadCompanyConsultings message:', data.message);
                    set(atomCompanyQuotations, input_json);
                    return;
                }
                set(atomCompanyQuotations, data);
            }
            catch(err){
                console.error(`loadCompanyConsultings / Error : ${err}`);
            };
        });

        const filterCompanyQuotation = getCallback(({set, snapshot }) => async (filterText) => {
            const allQuotationList = await snapshot.getPromise(atomCompanyQuotations);
            
            let allQuotation;
            if (filterText === '') {
                allQuotation = allQuotationList;
            }
            else {
                allQuotation = 
                allQuotationList.filter(item => ( item.quotation_title && item.quotation_title.includes(filterText)||
                                                item.quotation_manager && item.quotation_manager.includes(filterText)||
                                                item.lead_name && item.lead_name.includes(filterText)                        
                ));
            }
            set(atomFilteredQuotationArray, allQuotation);
            return true;
        });

        const filterQuotations = getCallback(({set, snapshot }) => async (itemName, filterText) => {
           // const allQuotationList = await snapshot.getPromise(atomAllQuotationObj);

            const allQuotationData = await snapshot.getPromise(atomAllQuotationObj);
            const allQuotationList = Object.values(allQuotationData);

            let allQuotation = [];

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
            }else if(itemName === 'common.phone_no'){
                allQuotation = allQuotationList.filter(item => (item.phone_number &&item.phone_number.includes(filterText))
                );    
            }else if(itemName === 'lead.email'){
                allQuotation = allQuotationList.filter(item => (item.email &&item.email.includes(filterText))
                );    
            }
            set(atomFilteredQuotationArray, allQuotation);
            return true;
        });     
        const modifyQuotation = getCallback(({set, snapshot}) => async (newQuotation) => {
            const input_json = JSON.stringify(newQuotation);
            try{
                const response = await fetch(`${BASE_PATH}/modifyQuotation`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    return {result:false, data: data.message};
                };

                const allQuotations = await snapshot.getPromise(atomAllQuotationObj);
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
                    //----- Update AllQuotationObj --------------------------//
                    const updatedAllObj = {
                        [data.out_quotation_code]: updatedNewQuotation,
                        ...allQuotations,
                    };
                    set(atomAllQuotationObj, updatedAllObj);

                    //----- Update FilteredQuotationArry -----------------------//
                    set(atomFilteredQuotationArray, Object.values(updatedAllObj));

                    //----- Update QuotationByLead -----------------------//
                    const currentLead = await snapshot.getPromise(atomCurrentLead);
                    if((currentLead !== defaultLead)
                        && (currentLead.lead_code === updatedNewQuotation.lead_code))
                    {
                        const quotationByLead = await snapshot.getPromise(atomQuotationByLead);
                        const updated = [
                            updatedNewQuotation,
                            ...quotationByLead,
                        ];
                        set(atomQuotationByLead, updated);
                    };

                    return {result: true};
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

                    //----- Update AllQuotationObj --------------------------//
                    const updatedAllObj = {
                        ...allQuotations,
                        [modifiedQuotation.consulting_code]: modifiedQuotation,
                    };
                    set(atomAllQuotationObj, updatedAllObj);

                    //----- Update FilteredQuotationArry -----------------------//
                    set(atomFilteredQuotationArray, Object.values(updatedAllObj));

                    //----- Update QuotationByLead -----------------------//
                    const currentLead = await snapshot.getPromise(atomCurrentLead);
                    if((currentLead !== defaultLead)
                        && (currentLead.lead_code === modifiedQuotation.lead_code))
                    {
                        const quotationsByLead = await snapshot.getPromise(atomQuotationByLead);
                        const foundIdx = quotationsByLead.findIndex(item => item.quotation_code === modifiedQuotation.quotation_code);
                        if(foundIdx !== -1) {
                            const updated = [
                                ...quotationsByLead.slice(0, foundIdx),
                                modifiedQuotation,
                                ...quotationsByLead.slice(foundIdx + 1, ),
                            ];
                            set(atomQuotationByLead, updated);
                        }
                    }
                    return {result: true};
                }
            }
            catch(err){
                return {result:false, data: err};
            };
        });
        const setCurrentQuotation = getCallback(({set, snapshot}) => async (quotation_code) => {
            try{
                if(quotation_code === undefined || quotation_code === null) {
                    set(atomCurrentQuotation, defaultQuotation);
                    return;
                }; 
                const allQuotations = await snapshot.getPromise(atomAllQuotationObj);
                if(!allQuotations[quotation_code]){
                    const found = await searchQuotations('quotation_code', quotation_code, true);
                    if(found.result) {
                        let foundObj = {};
                        found.data.forEach(item => {
                            foundObj[item.quotation_code] = item;
                        });
                        const updatedAllConsultings = {
                            ...allQuotations,
                            ...foundObj,
                        };
                        set(atomAllQuotationObj, updatedAllConsultings);

                        const allFiltered = await snapshot.getPromise(atomFilteredQuotationArray);
                        set(atomFilteredQuotationArray, [...allFiltered, ...found.data]);
                    } else {
                        set(atomCurrentQuotation, defaultQuotation);
                    };
                } else {
                    set(atomCurrentQuotation, allQuotations[quotation_code]);
                };
            }
            catch(err){
                console.error(`setCurrentQuotation / Error : ${err}`);
                set(atomCurrentQuotation, defaultQuotation);
            };
        });
        const searchQuotations = getCallback(() => async (itemName, filterText, isAccurate = false) => {
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
                const response = await fetch(`${BASE_PATH}/quotations`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });

                const data = await response.json();
                if(data.message){
                    console.log('\t[ searchQuotations ] message:', data.message);
                    return { result: false, message: data.message};
                } else {
                    for(const item of data) {
                        foundInServer[item.quotation_code] = item;
                    };
                    foundData = data.sort((a, b) => {
                        if(a.quotation_name > b.quotation_name) return 1;
                        if(a.quotation_name < b.quotation_name) return -1;
                        return 0;
                    });
                };
            } catch(e) {
                console.log('\t[ searchQuotations ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };

            // //----- Update AllQuotationObj --------------------------//
            // const allQuotationData = await snapshot.getPromise(atomAllQuotationObj);
            // const updatedAllQuotationData = {
            //     ...allQuotationData,
            //     ...foundInServer,
            // };
            // set(atomAllQuotationObj, updatedAllQuotationData);

            // //----- Update FilteredQuotationArray --------------------//
            // const updatedList = Object.values(updatedAllQuotationData);
            // set(atomFilteredQuotationArrayArray, updatedList);

            return { result: true, data: foundData};
        });
        return {
            tryLoadAllQuotations,
            loadAllQuotations,
            modifyQuotation,
            setCurrentQuotation,
            filterQuotations,
            loadCompanyQuotations,
            filterCompanyQuotation,
            searchQuotations,
        };
    }
});
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

export const QuotationCompanyColumns = [
    { value: 'company_name', label: '회사명'},
    { value: 'quotation_type', label: '견적구분'},
    { value: 'lead_name', label: '고객명'},
    { value: 'mobile_number', label: '고객휴대전화'},
    { value: 'phone_number', label: '전화번호'},
    { value: 'email', label: '고객이메일'},
    { value: 'quotation_manager', label: '견적 책임자'},
    { value: 'quotation_contents', label: '견적 내용'},
];

export const QuotationExpiry = [
    { value: '5일', label: '견적일로부터 5일 이내'},
    { value: '10일', label: '견적일로부터 10일 이내'},
    { value: '15일', label: '견적일로부터 15일 이내'},
    { value: '20일', label: '견적일로부터 20일 이내'},
    { value: '30일', label: '견적일로부터 30일 이내'},
    { value: '45일', label: '견적일로부터 45일 이내'},
    { value: '60일', label: '견적일로부터 60일 이내'},
];

export const QuotationDelivery = [
    { value: '5일', label: '발주일로부터 5일 이내'},
    { value: '10일', label: '발주일로부터 10일 이내'},
    { value: '15일', label: '발주일로부터 15일 이내'},
    { value: '20일', label: '발주일로부터 20일 이내'},
    { value: '30일', label: '발주일로부터 30일 이내'},
    { value: '45일', label: '발주일로부터 45일 이내'},
    { value: '60일', label: '발주일로부터 60일 이내'},
];

export const QuotationPayment = [
    { value: 'ThisDayCard', label: '당일 카드 결제'},
    { value: 'ThisDayCash', label: '당일 현금 결제'},
    { value: 'ThisMonthLastDayCash', label: '당월말 현금 결제'},
    { value: 'NextMonthLastDayCash', label: '익월말 현금 결제'},
];

export const QuotationDefaultColumns = [
    {
        dataIndex: '1',
        width: 25,
    },
    {
        dataIndex: '5',
        width: 200,
    },
    {
        dataIndex: '10',
        width: 50,
    },
    {
        dataIndex: '12',
        width: 50,
    },
    {
        dataIndex: '15',
        width: 100,
    },
    {
        dataIndex: '16',
    },
];

//---- 1: index, 2: title, 3: render type, 4: content name
export const QuotationContentItems = {
    '1': { name: 'no', title: 'common.no', content : true, view: true, type: 'label', width: 25},
    '2': { name: 'product_class_name', title: 'common.category', content: false, view: true, width: 75},
    '3': { name: 'manufacturer', title: 'common.maker', content: false, view: true, width: 50},
    '4': { name: 'model_name', title: 'quotation.model_name', content: false, view: true, width: 75},
    '5': { name: 'product_name', title: 'common.product', content: false, view: true, width: 200},
    '6': { name: 'material', title: 'common.material', content: true, view: true, type: 'label', width: 50},
    '7': { name: 'type', title: 'common.type', content: true, view: true, type: 'label', width: 40},
    '8': { name: 'color', title: 'common.color', content: true, view: true, type: 'label', width: 40},
    '9': { name: 'standard', title: 'common.standard', content: true, view: true, type:'label', width: 50},
    '10': { name: 'detail_desc_on_off', title: 'quotation.detail_desc', content: true, view: false, type:'select', width: 50},
    '11': { name: 'unit', title: 'common.unit', content: true, view: true, type:'label', width: 40 },
    '12': { name: 'quantity', title: 'common.quantity', content: true, view: true, type:'price0', width: 50},
    '13': { name: 'list_price', title: 'quotation.list_price', content: true, view: true, type:'price', width: 80},
    '14': { name: 'dc_rate', title: 'quotation.discount_rate', content: true, view: true, type: 'value', width: 40},
    '15': { name: 'unit_price', title: 'quotation.quotation_unit_price', content: true, view: true, type:'price', width: 80},
    '16': { name: 'quotation_amount', title: 'quotation.quotation_amount', content: true, view: true, type:'price', width: 100},
    '17': { name: 'cost_price', title: 'quotation.cost_price', content: true, view: false, type:'price', width: 80},
    '18': { name: 'profit', title: 'quotation.profit', content: true, view: false, type:'price', width: 80},
    '19': { name: 'note', title: 'quotation.note', content: true, view: true, type:'textarea', width: 75},
    '998': { name: 'detail_desc', title: 'quotation.detail_desc', content: true, view: false, type:'textarea', width: 150},
}

export const QuotationRepo = selector({
    key: "QuotationRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all Quotations /////////////////////////////
        const tryLoadAllQuotations = getCallback(({ set, snapshot }) => async (multiQueryCondi) => {
            const loadStates = await snapshot.getPromise(atomQuotationState);
            if((loadStates & 3) === 0){
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

            if(itemName === 'common.all'){
                allQuotation = allQuotationList.filter(item => (item.company_name &&item.company_name.includes(filterText))||
                                            (item.quotation_type && item.quotation_type.includes(filterText)) ||
                                            (item.quotation_title && item.quotation_title.includes(filterText)) ||
                                            (item.lead_name && item.lead_name.includes(filterText)) ||
                                            (item.mobile_number && item.mobile_number.includes(filterText)) || 
                                            (item.phone_number && item.phone_number.includes(filterText)) || 
                                            (item.email && item.email.includes(filterText)) ||
                                            (item.quotation_manager && item.quotation_manager.includes(filterText))||
                                            (item.quotation_contents && item.quotation_contents.includes(filterText))
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
            }else if(itemName === 'quotation.quotation_manager'){
                allQuotation = allQuotationList.filter(item => (item.quotation_manager &&item.quotation_manager.includes(filterText))
                );    
            }else if(itemName === 'quotation.quotation_contents'){
                allQuotation = allQuotationList.filter(item => (Array.isArray(item.quotation_contents) &&item.quotation_contents.some(content => content.includes(filterText)))
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
                        ...allQuotations,
                        [data.out_quotation_code]: updatedNewQuotation,
                    };
                    set(atomAllQuotationObj, updatedAllObj);

                    //----- Update FilteredQuotationArry -----------------------//
                    const currentFiltered = await snapshot.getPromise(atomFilteredQuotationArray);
                    const updatedFiltered = [
                        updatedNewQuotation,
                        ...currentFiltered,
                    ]
                    set(atomFilteredQuotationArray, updatedFiltered);

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
                        [modifiedQuotation.quotation_code]: modifiedQuotation,
                    };
                    set(atomAllQuotationObj, updatedAllObj);

                    //----- Update FilteredQuotationArry -----------------------//
                    //set(atomFilteredQuotationArray, Object.values(updatedAllObj));
                    const quotationArray = await snapshot.getPromise(atomFilteredQuotationArray);
                    const idxInfiltered = quotationArray.findIndex(item => item.quotation_code === modifiedQuotation.quotation_code);
                    if(idxInfiltered !== -1){
                        const updatedFiltered = [
                            modifiedQuotation,
                            ...quotationArray.slice(0, idxInfiltered),
                            ...quotationArray.slice(idxInfiltered + 1,)
                        ];
                        set(atomFilteredQuotationArray, updatedFiltered);
                    } else {
                        console.log("[quotation repo / update item] Impossible : this item is chosen in the list, but can't find it now");
                    };

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
        const getQuotationDocNo = getCallback(()=> async (user) => {
            const input_json = JSON.stringify(user);
            try{
                const response = await fetch(`${BASE_PATH}/getQuotationNumber`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });

                const data = await response.json();
                if(data.message){
                    console.log('\t[ getQuotationDocNo ] message:', data.message);
                    return { result: false, message: data.message};
                } else {
                    return { result: true, docNo: data.out_quotation_number};
                };
            } catch(e) {
                console.log('\t[ searchQuotations ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };
        });
        return {
            tryLoadAllQuotations,
            loadAllQuotations,
            modifyQuotation,
            setCurrentQuotation,
            filterQuotations,
            filterCompanyQuotation,
            searchQuotations,
            getQuotationDocNo,
        };
    }
});
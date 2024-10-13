import React from 'react';
import { selector } from "recoil";
import { atomCurrentLead
    , atomAllLeadObj
    , atomFilteredLeadArray
    , defaultLead
    , atomLeadState
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const leadColumn = [
    { value: 'lead_name', label: '고객명'},
    { value: 'lead_group', label: '그룹'},
    { value: 'sales_resource', label: '영업담당자'},
    { value: 'company_name', label: '회사명'},
    { value: 'region', label: '지역'},
    { value: 'company_address', label: '회사주소'},
    { value: 'is_keyman', label: '키맨여부'},
    { value: 'email', label: '이메일'},
    { value: 'status', label: '진행상황'},
];

export const KeyManForSelection = [
    { value: 'M', label: 'Manager'},
    { value: '결제', label: 'Payer'},
    { value: 'User', label: 'User'},
    { value: '구매', label: 'Purchaser'},
];

export const LeadStatusSelection = [
    { value: 'Not Contacted', label: 'Not Contacted'},
    { value: 'Attempted Contact', label: 'Attempted Contact'},
    { value: 'Contact', label: 'Contact'},
    { value: 'Converted', label: 'Converted'},
];


export const LeadRepo = selector({
    key: "LeadRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all Leads /////////////////////////////
        const tryLoadAllLeads = getCallback(({ set, snapshot }) => async (multiQueryCondi) => {
            const loadStates = await snapshot.getPromise(atomLeadState);
            if((loadStates & 3) === 0){
                set(atomLeadState, (loadStates | 2));   // state : loading
                const ret = await loadAllLeads(multiQueryCondi);
                if(ret){
                    // succeeded to load
                    set(atomLeadState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomLeadState, 0);
                };
            }
        });
        const loadAllLeads = getCallback(({set}) => async (multiQueryCondi) => {
            const input_json = JSON.stringify(multiQueryCondi);
            try{
                const response = await fetch(`${BASE_PATH}/leads`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });

                const data = await response.json();
                if(data.message){
                    console.log('loadAllLeads message:', data.message);
                    set(atomAllLeadObj, {});
                    set(atomFilteredLeadArray, []);
                    return false;
                };
                let allleads = {};
                let filteredLeads = []
                data.forEach(item => {
                    allleads[item.lead_code] = item;
                    filteredLeads.push(item);
                });
                set(atomAllLeadObj, allleads);
                set(atomFilteredLeadArray, filteredLeads);
                return true;
            }
            catch(err){
                console.error(`loadAllLeads / Error : ${err}`);
                set(atomAllLeadObj, {});
                set(atomFilteredLeadArray, []);
                return false;
            };
        });
        const filterLeads = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allLeadData = await snapshot.getPromise(atomAllLeadObj);
            const allLeadList = Object.values(allLeadData);
            let allLeads = [];
            if( itemName === 'common.all' ) {
                allLeads = allLeadList.filter(item => (item.lead_name &&item.lead_name.includes(filterText))||
                                           (item.company_name && item.company_name.includes(filterText))||
                                           (item.position && item.position.includes(filterText))||
                                           (item.department && item.department.includes(filterText))||
                                           (item.mobile_number && item.mobile_number.includes(filterText))||
                                           (item.email && item.email.includes(filterText))||
                                           (item.lead_status && item.lead_status.includes(filterText))||
                                           (item.sales_resource && item.sales_resource.includes(filterText))  
                );
            }else if(itemName === 'lead.lead_name'){
                allLeads = allLeadList.filter(item => (item.lead_name &&item.lead_name.includes(filterText))
                );
            }else if(itemName === 'company.company_name'){
                allLeads = allLeadList.filter(item => (item.company_name && item.company_name.includes(filterText))
                );
            }else if(itemName === 'lead.position'){
                allLeads = allLeadList.filter(item => (item.position && item.position.includes(filterText))
                );
            }else if(itemName === 'lead.department'){
                allLeads = allLeadList.filter(item => (item.department && item.department.includes(filterText))
                );
            }else if(itemName === 'lead.mobile_number'){
                allLeads = allLeadList.filter(item => (item.mobile_number && item.mobile_number.includes(filterText))
                );
            }else if(itemName === 'lead.email'){
                allLeads = allLeadList.filter(item => (item.email && item.email.includes(filterText))
                );
            }else if(itemName === 'lead.lead_status'){
                allLeads = allLeadList.filter(item => (item.lead_status && item.lead_status.includes(filterText))
                );
            }else if(itemName === 'lead.sales_resource'){
                allLeads = allLeadList.filter(item => (item.sales_resource && item.sales_resource.includes(filterText))
                );
            }
            set(atomFilteredLeadArray, allLeads);
            return true;
        });
        const modifyLead = getCallback(({set, snapshot}) => async (newLead) => {
            const input_json = JSON.stringify(newLead);
            try{
                const response = await fetch(`${BASE_PATH}/modifyLead`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    return {result:false, data: data.message};
                };

                const allLeads = await snapshot.getPromise(atomAllLeadObj);
                if(newLead.action_type === 'ADD'){
                    delete newLead.action_type;
                    const updatedNewLead = {
                        ...newLead,
                        lead_code : data.out_lead_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    //----- Update AllLeadObj --------------------------//
                    const updatedAllLeads = {
                        ...allLeads,
                        [data.out_lead_code] : updatedNewLead,
                    }
                    set(atomAllLeadObj, updatedAllLeads);

                    //----- Update FilteredLeadArray --------------------//
                    const filteredAllLeads = await snapshot.getPromise(atomFilteredLeadArray);
                    const updatedFiltered = [
                        updatedNewLead,
                        ...filteredAllLeads
                    ];
                    set(atomFilteredLeadArray, updatedFiltered);
                    return {result: true};
                } else if(newLead.action_type === 'UPDATE'){
                    const currentLead = await snapshot.getPromise(atomCurrentLead);
                    delete newLead.action_type;
                    delete newLead.lead_code; 
                    delete newLead.modify_user;
                    const modifiedLead = {
                        ...currentLead,
                        ...newLead,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentLead, modifiedLead);

                    //----- Update AllLeadObj --------------------------//
                    const updatedAllLeads = {
                        ...allLeads,
                        [modifiedLead.lead_code] : modifiedLead,
                    };
                    set(atomAllLeadObj, updatedAllLeads);

                    //----- Update FilteredLeadArray --------------------//
                    const filteredAllLeads = await snapshot.getPromise(atomFilteredLeadArray);

                    // findIndex를 사용하여 lead_code에 맞는 항목의 인덱스를 찾음
                    const foundIdx = filteredAllLeads.findIndex(item => item.lead_code === modifiedLead.lead_code);

                    if (foundIdx !== -1) {
                        // 해당 인덱스를 기반으로 배열을 업데이트
                        const updatedFiltered = [
                            ...filteredAllLeads.slice(0, foundIdx),
                            modifiedLead,  // 해당 항목을 수정된 항목으로 교체
                            ...filteredAllLeads.slice(foundIdx + 1),
                        ];

                        set(atomFilteredLeadArray, updatedFiltered);  // 배열을 업데이트
                        return { result: true };
                    } else {
                        return { result: false, data: "No Data" };  // 해당 lead_code를 찾지 못했을 때
                    }

                }
            }
            catch(err){
                return {result:false, data: err};
            };
        });
        const setCurrentLead = getCallback(({set, snapshot}) => async (lead_code) => {
            try{
                if(lead_code === undefined || lead_code === null) {
                    set(atomCurrentLead, defaultLead);
                    return;
                };
                const allLeads = await snapshot.getPromise(atomAllLeadObj);
                if(allLeads[lead_code]){
                    set(atomCurrentLead, allLeads[lead_code]);
                } else {
                    const found = await searchLeads('lead_code', lead_code, true);
                    if(found.result) {
                        set(atomCurrentLead, found.data[0]);

                        const updatedAllLeads = {
                            ...allLeads,
                            [found.data[0].lead_code]: found.data[0]
                        };
                        set(atomAllLeadObj, updatedAllLeads);
                        set(atomFilteredLeadArray, Object.values(updatedAllLeads));
                    } else {
                        set(atomCurrentLead, defaultLead);
                    };
                }
            }
            catch(err){
                console.error(`setCurrentLead / Error : ${err}`);
                set(atomCurrentLead, defaultLead);
            };
        });
        const searchLeads = getCallback(() => async (itemName, filterText, isAccurate = false) => {
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
                const response = await fetch(`${BASE_PATH}/leads`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });

                const data = await response.json();
                if(data.message){
                    console.log('\t[ searchLeads ] message:', data.message);
                    return { result: false, message: data.message};
                } else {
                    for(const item of data) {
                        foundInServer[item.lead_code] = item;
                    };
                    foundData = data.sort((a, b) => {
                        if(a.lead_name > b.lead_name) return 1;
                        if(a.lead_name < b.lead_name) return -1;
                        return 0;
                    });
                };
            } catch(e) {
                console.log('\t[ searchLeads ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };

            // //----- Update AllLeadObj --------------------------//
            // const allLeadData = await snapshot.getPromise(atomAllLeadObj);
            // const updatedAllLeadData = {
            //     ...allLeadData,
            //     ...foundInServer,
            // };
            // set(atomAllLeadObj, updatedAllLeadData);

            // //----- Update FilteredLeadArray --------------------//
            // const updatedList = Object.values(updatedAllLeadData);
            // set(atomFilteredLeadArray, updatedList);

            return { result: true, data: foundData};
        });
        return {
            tryLoadAllLeads,
            loadAllLeads,
            modifyLead,
            setCurrentLead,
            filterLeads,
            searchLeads,
        };
    }
});
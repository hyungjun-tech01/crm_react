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
                console.log('[tryLoadAllLeads] Try to load all Leads');
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
                console.log('[LeadRepository] Try loading all', input_json)
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
            console.log(`[ modifyLead ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/modifyLead`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyLead ] message:', data.message);
                    return false;
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
                    const updatedAllLeads = {
                        ...allLeads,
                        [data.out_lead_code] : updatedNewLead,
                    }
                    set(atomAllLeadObj, updatedAllLeads);
                    return true;
                } else if(newLead.action_type === 'UPDATE'){
                    const currentLead = await snapshot.getPromise(atomCurrentLead);
                    delete newLead.action_type;
                    delete newLead.company_code;
                    delete newLead.modify_user;
                    const modifiedLead = {
                        ...currentLead,
                        ...newLead,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentLead, modifiedLead);
                    const updatedAllLeads = {
                        ...allLeads,
                        [modifiedLead.lead_code] : modifiedLead,
                    };
                    set(atomAllLeadObj, updatedAllLeads);
                    return true;
                }
            }
            catch(err){
                console.error(`\t[ modifyLead ] Error : ${err}`);
                return false;
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
                    console.log('\t[ setCurrentLead ] No lead data matched the specified id');
                    set(atomCurrentLead, defaultLead);
                }
            }
            catch(err){
                console.error(`setCurrentLead / Error : ${err}`);
                set(atomCurrentLead, defaultLead);
            };
        });
        const searchLeads = getCallback(({set, snapshot}) => async (itemName, filterText) => {
            // At first, request data to server
            let foundInServer = {};
            const query_obj = {
                queryConditions: [{
                    column: { value: itemName},
                    columnQueryCondition: { value: 'like'},
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
                };
            } catch(e) {
                console.log('\t[ searchLeads ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };

            // Then, update all company obj
            const allLeadData = await snapshot.getPromise(atomAllLeadObj);
            const updatedAllLeadData = {
                ...allLeadData,
                ...foundInServer,
            };
            set(atomAllLeadObj, updatedAllLeadData);

            // Next, look for this updated data
            const updatedList = Object.values(updatedAllLeadData);
            const foundLeads = updatedList.filter(item =>
                (item[itemName] && item[itemName].includes(filterText)))
                .sort((a, b) => {
                    if(a.lead_name > b.lead_name) return 1;
                    if(a.lead_name < b.lead_name) return -1;
                    return 0;
                });
            
            return { result: true, data: foundLeads};
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
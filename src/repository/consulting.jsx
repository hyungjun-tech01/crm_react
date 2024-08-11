import React from 'react';
import { selector } from "recoil";
import { atomCurrentConsulting
    , atomAllConsultingObj
    , defaultConsulting
    , atomCompanyConsultings
    , atomFilteredConsultingArray
    , atomConsultingState,
    atomFilteredCompanyArray
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const ConsultingTypes = [
    { value: '방문', label: '방문'},
    { value: '상담', label: '상담'},
    { value: '내근', label: '내근'},
    { value: '행사', label: '행사'},
    { value: '전화', label: '전화'},
    { value: '교육', label: '교육'},
    { value: '납품', label: '납품'},
    { value: 'Mail', label: 'Mail'},
    { value: '원격', label: '원격'},
    { value: 'ChatBot', label: 'ChatBot'},
];

export const ProductTypes = [
    { value: 'SolidWorks', label: 'SolidWorks'},
    { value: 'Simulation', label: 'Simulation'},
    { value: 'PDM', label: 'PDM'},
    { value: 'Flow', label: 'Flow'},
    { value: 'Composer', label: 'Composer'},
    { value: 'SS', label: 'SS'},
    { value: 'API', label: 'API'},
    { value: 'SMAP 3D', label: 'SMAP '},
    { value: 'Electrical', label: 'Electrical'},
    { value: 'DX Tool', label: 'DX '},
    { value: '3DEXPERIENCE', label: '3DEXPERIENCE'},
    { value: 'Draftsight', label: 'Draftsight'},
];

export const ConsultingStatusTypes = [
    { value: '초기', label: '초기',},
    { value: '진행중', label: '진행중',},
    { value: '보류', label: '보류',},
    { value: '취소', label: '취소',},
    { value: '완료', label: '완료',},
    { value: '기타', label: '기타',},
];

export const ConsultingTimeTypes = [
    { value: '5분 이내', label: '5분 이내'},
    { value: '10분', label: '10분', },
    { value: '30분', label: '30분', },
    { value: '1시간', label: '1시간', },
    { value: '2시간', label: '2시간', },
    { value: '2시간 이상', label: '2시간 이상'},
];

export const consultingColumn = [
    { value: 'company_name', label: '회사명'},
    { value: 'consulting_type', label: '상담 유형'},
    { value: 'lead_name', label: '고객명'},
    { value: 'mobile_number', label: '고객휴대전화'},
    { value: 'region', label: '전화번호'},
    { value: 'request_content', label: '상담내역'},
    { value: 'action_content', label: '상담 결과'},
];


export const ConsultingRepo = selector({
    key: "ConsultingRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all Consultings /////////////////////////////
        const tryLoadAllConsultings = getCallback(({ set, snapshot }) => async () => {
            const loadStates = await snapshot.getPromise(atomConsultingState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllConsultings] Try to load all Consultings');
                set(atomConsultingState, (loadStates | 2));   // state : loading
                const ret = await loadAllConsultings();
                if(ret){
                    // succeeded to load
                    set(atomConsultingState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomConsultingState, 0);
                };
            }
        });
        const loadAllConsultings = getCallback(({set}) => async (multiQueryCondi) => {
            const input_json = JSON.stringify(multiQueryCondi);
            try{
                console.log('[ConsultingRepository] Try loading all')
                const response = await fetch(`${BASE_PATH}/consultings`,{
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('loadAllConsultings message:', data.message);
                    set(atomAllConsultingObj, {});
                    set(atomFilteredConsultingArray, []);
                    return false;
                };
                let allconsultings = {};
                let filteredConsultings = [];
                data.forEach(item => {
                    allconsultings[item.consulting_code] = item;
                    filteredConsultings.push(item);
                });
                set(atomAllConsultingObj, allconsultings);
                set(atomFilteredConsultingArray, filteredConsultings);
                return true;
            }
            catch(err){
                console.error(`loadAllConsultings / Error : ${err}`);
                set(atomAllConsultingObj, {});
                set(atomFilteredConsultingArray, []);
                return false;
            };
        });
        const loadCompanyConsultings = getCallback(({set, snapshot}) => async (company_code) => {
            const input_json = {company_code:company_code};
            try{
                const response = await fetch(`${BASE_PATH}/companyConsultings`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify(input_json),
                });

                const data = await response.json();
                if(data.message){
                    console.log('loadCompanyConsultings message:', data.message);
                    set(atomCompanyConsultings, input_json);
                    return;
                }
                set(atomCompanyConsultings, data);

                ///////////////////// update all consulting object ////////////////////////////
                let foundInServer = {};
                for(const item of data) {
                    foundInServer[item.lead_code] = item;
                };

                const allConsultingData = await snapshot.getPromise(atomAllConsultingObj);
                const updatedAllConsultingData = {
                    ...allConsultingData,
                    ...foundInServer,
                };
                set(atomAllConsultingObj, updatedAllConsultingData);
            }
            catch(err){
                console.error(`loadAllConsultings / Error : ${err}`);
            };
        });
        const filterConsulting = getCallback(({set, snapshot }) => async (filterText) => {
            const allConsultingList = await snapshot.getPromise(atomCompanyConsultings);
            
            let allConsulting;
            if (filterText === '') {
                allConsulting = allConsultingList;
            }
            else {
                allConsulting = 
                allConsultingList.filter(item => ( (item.lead_name &&item.lead_name.includes(filterText))||
                                                  (item.receiver && item.receiver.includes(filterText))||
                                                  (item.consulting_type && item.consulting_type.includes(filterText))
                ));
            }
           
            set(atomFilteredConsultingArray, allConsulting);
            return true;
        });
        const filterConsultingOri = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allConsultingData = await snapshot.getPromise(atomAllConsultingObj);
            const allConsultingList = Object.values(allConsultingData);
            let  allConsulting = [];
            if(itemName === 'common.all'){
                allConsulting = allConsultingList.filter(item => (item.lead_name &&item.lead_name.includes(filterText))||
                                            (item.receiver && item.receiver.includes(filterText)) ||
                                            (item.company_name && item.company_name.includes(filterText)) ||
                                            (item.consulting_type && item.consulting_type.includes(filterText)) ||
                                            (item.mobile_number && item.mobile_number.includes(filterText)) || 
                                            (item.phone_number && item.phone_number.includes(filterText)) || 
                                            (item.request_content && item.request_content.includes(filterText)) || 
                                            (item.action_content && item.action_content.includes(filterText)) 
                );
            }else if(itemName === 'company.company_name'){
                allConsulting = allConsultingList.filter(item => (item.company_name &&item.company_name.includes(filterText))
                );    
            }else if(itemName === 'consulting.type'){
                allConsulting = allConsultingList.filter(item => (item.consulting_type &&item.consulting_type.includes(filterText))
                );    
            }else if(itemName === 'lead.full_name'){
                allConsulting = allConsultingList.filter(item => (item.lead_name &&item.lead_name.includes(filterText))
                );    
            }else if(itemName === 'lead.mobile'){
                allConsulting = allConsultingList.filter(item => (item.mobile_number &&item.mobile_number.includes(filterText))
                );    
            }else if(itemName === 'common.phone_no'){
                allConsulting = allConsultingList.filter(item => (item.phone_number &&item.phone_number.includes(filterText))
                );    
            }else if(itemName === 'consulting.request_content'){
                allConsulting = allConsultingList.filter(item => (item.request_content &&item.request_content.includes(filterText))
                );    
            }else if(itemName === 'consulting.action_content'){
                allConsulting = allConsultingList.filter(item => (item.action_content &&item.action_content.includes(filterText))
                );    
            }
            set(atomFilteredConsultingArray, allConsulting);
            return true;
        });        
        const modifyConsulting = getCallback(({set, snapshot}) => async (newConsulting) => {
            const input_json = JSON.stringify(newConsulting);
            try{
                const response = await fetch(`${BASE_PATH}/modifyConsult`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    return {result:false, data: data.message};
                };

                const allConsultings = await snapshot.getPromise(atomAllConsultingObj);
                if(newConsulting.action_type === 'ADD'){
                    delete newConsulting.action_type;
                    const updatedNewConsulting = {
                        ...newConsulting,
                        consulting_code : data.out_consulting_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    //----- Update AllConsultingObj --------------------------//
                    const updatedAllConsultings = {
                        ...allConsultings,
                        [data.out_consulting_code]: updatedNewConsulting,
                    };
                    set(atomAllConsultingObj, updatedAllConsultings);

                    //----- Update FilteredConsultings -----------------------//
                    const filteredAllConsultings = await snapshot.getPromise(atomFilteredConsultingArray);
                    const updatedFiltered = [
                        updatedNewConsulting,
                        ...filteredAllConsultings
                    ];
                    set(atomFilteredConsultingArray, updatedFiltered);
                    return {resutl: true};
                } else if(newConsulting.action_type === 'UPDATE'){
                    const currentConsulting = await snapshot.getPromise(atomCurrentConsulting);
                    delete newConsulting.action_type;
                    delete newConsulting.company_code;
                    delete newConsulting.modify_user;
                    const modifiedConsulting = {
                        ...currentConsulting,
                        ...newConsulting,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentConsulting, modifiedConsulting);

                    //----- Update AllConsultingObj --------------------------//
                    const updatedAllConsultings = {
                        ...allConsultings,
                        [modifiedConsulting.consulting_code] : modifiedConsulting,
                    };
                    set(atomAllConsultingObj, updatedAllConsultings);

                    //----- Update FilteredConsultings -----------------------//
                    const filteredAllConsultings = await snapshot.getPromise(atomFilteredConsultingArray);
                    const foundIdx = filteredAllConsultings.filter(item => item.consulting_code === modifiedConsulting.consulting_code);
                    if(foundIdx !== -1){
                        const updatedFiltered = [
                            ...filteredAllConsultings.slice(0, foundIdx),
                            modifiedConsulting,
                            ...filteredAllConsultings.slice(foundIdx + 1,),
                        ];
                        set(atomFilteredConsultingArray, updatedFiltered);
                    };
                    return {resutl: true};
                }
            }
            catch(err){
                return {result:false, data: err};
            };
        });
        const setCurrentConsulting = getCallback(({set, snapshot}) => async (consulting_code) => {
            try{
                if(consulting_code === undefined || consulting_code === null) {
                    set(atomCurrentConsulting, defaultConsulting);
                    return;
                };
                const allConsultings = await snapshot.getPromise(atomAllConsultingObj);
                if(!allConsultings[consulting_code]){
                    // consulting이 없다면 쿼리 
                    const found = await searchConsultings('consuliting_code', consulting_code, true);
                    if(found.result) {
                        set(atomCurrentConsulting, found.data[0]);
                        let foundObj = {};
                        found.data.forEach(item => {
                            foundObj[item.consulting_code] = item;
                        });
                        const updatedAllConsultings = {
                            ...allConsultings,
                            ...foundObj,
                        };
                        set(atomAllConsultingObj, updatedAllConsultings);

                        const allFiltered = await snapshot.getPromise(atomFilteredConsultingArray);
                        set(atomFilteredConsultingArray, [...allFiltered, ...found.data]);
                    } else {
                        set(atomCurrentConsulting, defaultConsulting);
                    };
                }else{
                    set(atomCurrentConsulting, allConsultings[consulting_code]);
                }
            }
            catch(err){
                console.error(`setCurrentConsulting / Error : ${err}`);
                set(atomCurrentConsulting, defaultConsulting);
            };
        });
        const searchConsultings = getCallback(() => async (itemName, filterText, isAccurate = false) => {
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
                const response = await fetch(`${BASE_PATH}/consultings`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ searchConsultings ] message:', data.message);
                    return { result: false, message: data.message};
                } else {
                    for(const item of data) {
                        foundInServer[item.consulting_code] = item;
                    };
                    foundData = data.sort((a, b) => {
                        const a_time = new Date(a.modify_date);
                        const b_time = new Date(b.modify_date);
                        if(a_time > b_time) return 1;
                        if(a_time < b_time) return -1;
                        return 0;
                    });
                };
            } catch(e) {
                console.log('\t[ searchConsultings ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };

            // //----- Update AllConsultingObj --------------------------//
            // const allConsultingData = await snapshot.getPromise(atomAllConsultingObj);
            // const updatedAllConsultingData = {
            //     ...allConsultingData,
            //     ...foundInServer,
            // };
            // set(atomAllConsultingObj, updatedAllConsultingData);

            // //----- Update FilteredConsultings -----------------------//
            // const updatedList = Object.values(updatedAllConsultingData);
            // set(atomFilteredConsultingArray, updatedList);

            return { result: true, data: foundData };
        });
        return {
            tryLoadAllConsultings,
            loadAllConsultings,
            modifyConsulting,
            setCurrentConsulting,
            loadCompanyConsultings,
            filterConsulting,
            filterConsultingOri,
            searchConsultings,
        };
    }
});
import React from 'react';
import { selector } from "recoil";
import { atomCurrentConsulting, atomAllConsultings, defaultConsulting, atomCompanyConsultings } from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const ConsultingTypes = [
    { value: '전화지원', label: 'Call'},
    { value: '원격지원', label: 'Remote'},
    { value: '교육지원', label: 'Education'},
    { value: '방문', label: 'Visit'},
    { value: '상담', label: 'Consult'},
    { value: '내근', label: 'InDoor'},
    { value: '기타', label: 'Etc'},
    { value: 'NULL', label: 'NULL'},
];

export const ConsultingRepo = selector({
    key: "ConsultingRepository",
    get: ({getCallback}) => {
        const loadAllConsultings = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/consultings`);
                const data = await response.json();
                if(data.message){
                    console.log('loadAllConsultings message:', data.message);
                    set(atomAllConsultings, []);
                    return;
                }
                set(atomAllConsultings, data);
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
        });
        const loadCompanyConsultings = getCallback(({set}) => async (company_code) => {
            const input_json = {company_code:company_code};
            //JSON.stringify(company_code);
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
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
        });
        const modifyConsulting = getCallback(({set, snapshot}) => async (newConsulting) => {
            const input_json = JSON.stringify(newConsulting);
            console.log(`[ modifyConsulting ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/modifyConsult`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyConsulting ] message:', data.message);
                    return false;
                };

                const allConsultings = await snapshot.getPromise(atomAllConsultings);
                if(newConsulting.action_type === 'ADD'){
                    delete newConsulting.action_type;
                    const updatedNewConsulting = {
                        ...newConsulting,
                        // company_code : data.out_company_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllConsultings, allConsultings.concat(updatedNewConsulting));
                    return true;
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
                    const foundIdx = allConsultings.findIndex(consulting => 
                        consulting.consulting_code === modifiedConsulting.consulting_code);
                    if(foundIdx !== -1){
                        const updatedAllConsultings = [
                            ...allConsultings.slice(0, foundIdx),
                            modifiedConsulting,
                            ...allConsultings.slice(foundIdx + 1,),
                        ];
                        set(atomAllConsultings, updatedAllConsultings);
                        return true;
                    } else {
                        console.log('\t[ modifyConsulting ] No specified consulting is found');
                        return false;
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyConsulting ] Error : ${err}`);
                return false;
            };
        });
        const setCurrentConsulting = getCallback(({set, snapshot}) => async (consulting_code) => {
            try{
                if(consulting_code === undefined || consulting_code === null) {
                    set(atomCurrentConsulting, defaultConsulting);
                    return;
                };
                const allConsultings = await snapshot.getPromise(atomAllConsultings);
                const selected_arrary = allConsultings.filter(consulting => consulting.consulting_code === consulting_code);
                if(selected_arrary.length > 0){
                    set(atomCurrentConsulting, selected_arrary[0]);
                }
            }
            catch(err){
                console.error(`setCurrentConsulting / Error : ${err}`);
            };
        });
        return {
            loadAllConsultings,
            modifyConsulting,
            setCurrentConsulting,
            loadCompanyConsultings,
        };
    }
});
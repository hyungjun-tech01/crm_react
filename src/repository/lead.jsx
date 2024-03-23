import React from 'react';
import { selector } from "recoil";
import { atomCurrentLead, atomAllLeads } from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const LeadRepo = selector({
    key: "LeadRepository",
    get: ({getCallback}) => {
        const loadAllLeads = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/leads`);
                const data = await response.json();
                if(data.message){
                    console.log('loadAllLeads message:', data.message);
                    set(atomAllLeads, []);
                    return;
                }
                set(atomAllLeads, data);
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
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

                const allLeads = await snapshot.getPromise(atomAllLeads);
                if(newLead.action_type === 'ADD'){
                    delete newLead.action_type;
                    const updatedNewLead = {
                        ...newLead,
                        // company_code : data.out_company_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllLeads, allLeads.concat(updatedNewLead));
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
                    const foundIdx = allLeads.findIndex(lead => 
                        lead.lead_code === modifiedLead.lead_code);
                    if(foundIdx !== -1){
                        const updatedAllLeads = [
                            ...allLeads.slice(0, foundIdx),
                            modifiedLead,
                            ...allLeads.slice(foundIdx + 1,),
                        ];
                        set(atomAllLeads, updatedAllLeads);
                        return true;
                    } else {
                        console.log('\t[ modifyLead ] No specified lead is found');
                        return false;
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyLead ] Error : ${err}`);
                return false;
            };
        });
        const setCurrentLead = getCallback(({set, snapshot}) => async (lead_code) => {
            try{
                const allLeads = await snapshot.getPromise(atomAllLeads);
                const selected_arrary = allLeads.filter(lead => lead.lead_code === lead_code);
                if(selected_arrary.length > 0){
                    set(atomCurrentLead, selected_arrary[0]);
                }
            }
            catch(err){
                console.error(`setCurrentLead / Error : ${err}`);
            };
        });
        return {
            loadAllLeads,
            modifyLead,
            setCurrentLead,
        };
    }
});
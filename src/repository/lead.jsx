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
        const setCurrentLead = getCallback(({set, snapshot}) => async (lead_code) => {
            try{
                const allLeads = await snapshot.getPromise(atomAllLeads);
                const selected = allLeads.filter(lead => lead.lead_code === lead_code)[0];
                set(atomCurrentLead, selected);
            }
            catch(err){
                console.error(`setCurrentCompany / Error : ${err}`);
            };
        });
        return {
            loadAllLeads,
            setCurrentLead,
        };
    }
});
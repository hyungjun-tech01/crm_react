import React from 'react';
import { selector } from "recoil";
import { atomCurrentLead, atomAllLeads, atomFilteredLead, defaultLead } from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const KeyManForSelection = [
    { value: 'M', label: 'Manager'},
    { value: '결제', label: 'Payer'},
    { value: 'User', label: 'User'},
    { value: '구매', label: 'Purchaser'},
    { value: 'NULL', label: 'NULL'},
];

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
                set(atomFilteredLead, atomAllLeads);
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
        });
        const filterLeads = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allLeadList = await snapshot.getPromise(atomAllLeads);
            let allLeads = null;
            
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
            set(atomFilteredLead, allLeads);
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

                const allLeads = await snapshot.getPromise(atomAllLeads);
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
                if(lead_code === undefined || lead_code === null) {
                    set(atomCurrentLead, defaultLead);
                    return;
                };
                const allLeads = await snapshot.getPromise(atomAllLeads);
                const selected_arrary = allLeads.filter(lead => lead.lead_code === lead_code);
                if(selected_arrary.length > 0){
                    set(atomCurrentLead, selected_arrary[0]);
                } else {
                    console.log('\t[ setCurrentLead ] No lead data matched the specified id');
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
            filterLeads,
        };
    }
});
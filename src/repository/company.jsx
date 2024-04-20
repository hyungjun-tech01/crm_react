import React from 'react';
import { selector } from "recoil";
import { atomCurrentCompany, atomAllCompanies,atomFilteredCompany, defaultCompany } from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const CompanyRepo = selector({
    key: "CompanyRepository",
    get: ({getCallback}) => {
        const loadAllCompanies = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/companies`);
                const data = await response.json();
                if(data.message){
                    console.log('\t[ loadAllCompanies ] message:', data.message);
                    set(atomAllCompanies, []);
                    return;
                }
                set(atomAllCompanies, data);
            }
            catch(err){
                console.error(`\t[ loadAllCompanies ] Error : ${err}`);
            };
        });
        const filterCompanies = getCallback(({set, snapshot }) => async (filterText) => {
            const allCompanyList = await snapshot.getPromise(atomAllCompanies);
            const allCompanies = 
            allCompanyList.filter(item => (item.company_name &&item.company_name.includes(filterText))||
                                           (item.sales_resource && item.sales_resource.includes(filterText))  
            );
            set(atomFilteredCompany, allCompanies);
            return true;
        });
        const modifyCompany = getCallback(({set, snapshot}) => async (newCompany) => {
            const input_json = JSON.stringify(newCompany);
            console.log(`[ modifyCompany ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/modifyCompany`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyCompany ] message:', data.message);
                    return false;
                };

                const allCompany = await snapshot.getPromise(atomAllCompanies);
                if(newCompany.action_type === 'ADD'){
                    delete newCompany.action_type;
                    const updatedNewCompany = {
                        ...newCompany,
                        company_code : data.out_company_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllCompanies, allCompany.concat(updatedNewCompany));
                    return true;
                } else if(newCompany.action_type === 'UPDATE'){
                    const currentCompany = await snapshot.getPromise(atomCurrentCompany);
                    delete newCompany.action_type;
                    delete newCompany.company_code;
                    delete newCompany.modify_user;
                    const modifiedCompany = {
                        ...currentCompany,
                        ...newCompany,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentCompany, modifiedCompany);
                    const foundIdx = allCompany.findIndex(company => 
                        company.company_code === modifiedCompany.company_code);
                    if(foundIdx !== -1){
                        const updatedAllCompanies = [
                            ...allCompany.slice(0, foundIdx),
                            modifiedCompany,
                            ...allCompany.slice(foundIdx + 1,),
                        ];
                        set(atomAllCompanies, updatedAllCompanies);
                        return true;
                    } else {
                        console.log('\t[ modifyCompany ] No specified company is found');
                        return false;
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyCompany ] Error : ${err}`);
                return false;
            };
        });
        const setCurrentCompany = getCallback(({set, snapshot}) => async (company_code) => {
            try{
                if(company_code === undefined || company_code === null) {
                    set(atomCurrentCompany, defaultCompany);
                    return;
                };
                const allCompanies = await snapshot.getPromise(atomAllCompanies);
                const selected_array = allCompanies.filter(company => company.company_code === company_code);
                if(selected_array.length > 0){
                    set(atomCurrentCompany, selected_array[0]);
                }
            }
            catch(err){
                console.error(`\t[ setCurrentCompany ] Error : ${err}`);
            };
        });
        return {
            loadAllCompanies,
            filterCompanies,
            modifyCompany,
            setCurrentCompany,
        };
    }
});
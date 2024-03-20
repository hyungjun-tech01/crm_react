import React from 'react';
import { selector } from "recoil";
import { atomCurrentCompany, atomAllCompanies } from '../atoms/atoms';

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

                const allCompany = snapshot.getPromise(atomAllCompanies);
                if(newCompany.action_type === 'ADD'){
                    delete newCompany.action_type;
                    const updatedNewCompany = {
                        ...newCompany,
                        // company_code : data.out_company_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllCompanies, (await allCompany).concat(newCompany));
                    return true;
                } else if(newCompany.action_type === 'UPDATE'){
                    delete newCompany.action_type;
                    const modifiedCompany = {
                        ...newCompany,
                        // company_code : data.out_company_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    const foundIdx = allCompany.foundIndex(company => company.company_code !== newCompany.company_code);
                    if(foundIdx !== -1){
                        const updatedAllCompanies = [
                            ...allCompany.slice(0, foundIdx),
                            modifiedCompany,
                            ...allCompany.slice(foundIdx + 1,),
                        ];
                        set(atomAllCompanies, updatedAllCompanies);
                        return true;
                    } else {
                        console.log('\t[ modifyCompany ] no specified company is found');
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
                const allCompanies = await snapshot.getPromise(atomAllCompanies);
                const selected = allCompanies.filter(company => company.company_code === company_code)[0];
                set(atomCurrentCompany, selected);
            }
            catch(err){
                console.error(`\t[ setCurrentCompany ] Error : ${err}`);
            };
        });
        return {
            loadAllCompanies,
            modifyCompany,
            setCurrentCompany,
        };
    }
});
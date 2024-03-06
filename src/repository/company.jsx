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
                    console.log('loadAllCompanies message:', data.message);
                    set(atomAllCompanies, []);
                    return;
                }
                set(atomAllCompanies, data);
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
        });
        const setCurrentCompany = getCallback(({set, snapshot}) => async (company_code) => {
            try{
                const allCompanies = await snapshot.getPromise(atomAllCompanies);
                console.log(`[CompanyRepo] setCurrentCompany - input : ${company_code}`);
                const selected = allCompanies.filter(company => company.company_code === company_code)[0];
                console.log(`[CompanyRepo] setCurrentCompany : ${selected}`);
                set(atomCurrentCompany, selected);
            }
            catch(err){
                console.error(`setCurrentCompany / Error : ${err}`);
            };
        });
        return {
            loadAllCompanies,
            setCurrentCompany,
        };
    }
});
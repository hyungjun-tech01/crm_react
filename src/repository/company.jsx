import React from 'react';
import { selector } from "recoil";
import { atomCurrentCompany, atomAllCompanies } from '../atoms/atoms';
import { data_company } from './test_data';

// import Paths from "../constants/Paths";
// const BASE_PATH = Paths.BASE_PATH;


export const CompanyRepo = selector({
    key: "CompanyRepository",
    get: ({getCallback}) => {
        const loadAllCompanies = getCallback(({set}) => async () => {
            try{
                // const response = await fetch(`${BASE_PATH}/company/all`);
                // const data = await response.json();
                // if(data.message){
                //     console.log('loadCurrentCompany message:', data.message);
                //     set(atomAllCompanies, []);
                //     return;
                // }
                // set(atomAllCompanies, data);
                set(atomAllCompanies, data_company);
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
        });
        const setCurrentCompany = getCallback(({set, snapshot}) => async (company_id) => {
            try{
                const allCompanies = await snapshot.getPromise(atomAllCompanies);
                const selected = allCompanies.filter(company => company.id === company_id)[0];
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
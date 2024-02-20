import React from 'react';
import { selector } from "recoil";
import { atomCurrentUser } from '../atoms/atomsUser';
import { data_user } from './test_data';

// import Paths from "../constants/Paths";
// const BASE_PATH = Paths.BASE_PATH;


export const UserRepo = selector({
    key: "UserRepository",
    get: ({getCallback}) => {
        const loadUser = getCallback(({set}) => async () => {
            try{
                // const response = await fetch(`${BASE_PATH}/company/all`);
                // const data = await response.json();
                // if(data.message){
                //     console.log('loadCurrentCompany message:', data.message);
                //     set(atomAllCompanies, []);
                //     return;
                // }
                // set(atomAllCompanies, data);
                set(atomCurrentUser, data_company);
            }
            catch(err){
                console.error(`loadUser / Error : ${err}`);
            };
        });
        
        return {
            loadUser
        };
    }
});
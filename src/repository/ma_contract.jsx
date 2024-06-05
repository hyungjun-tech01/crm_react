import React from 'react';
import { selector } from "recoil";
import { atomCompanyMAContracts
    , atomCurrentMAContract
    , defaultMAContract
    , atomMAContractState
} from '../atoms/atoms';
import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const MAContractRepo = selector({
    key: "MAContractRepository",
    get: ({getCallback}) => {
        const loadCompanyMAContracts = getCallback(({set, snapshot}) => async (code) => {
            const input_json = JSON.stringify({company_code: code});
            console.log(`[ loadCompanyMAContracts ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/companyMaContract`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('[loadCompanyMAContracts] message:', data.message);
                    set(atomCompanyMAContracts, []);
                    return;
                }
                set(atomCompanyMAContracts, data);

                // Change loading state
                const loadStates = snapshot.getPromise(atomMAContractState);
                set(atomMAContractState, (loadStates | 1));
            }
            catch(err){
                console.error(`loadCompanyMAContracts / Error : ${err}`);
            };
        });
        const setCurrentMAContract = getCallback(({set, snapshot}) => async (company_code) => {
            try{
                if(company_code === undefined || company_code === null) {
                    set(atomCurrentMAContract, defaultMAContract);
                    return;
                };
                let companyMAContras = await snapshot.getPromise(atomCompanyMAContracts);

               const selected_arrary = companyMAContras.filter(contract => contract.company_code === company_code);
                if(selected_arrary.length > 0){
                    set(atomCurrentMAContract, selected_arrary[0]);
                }
            }
            catch(err){
                console.error(`setCurrentMAContract / Error : ${err}`);
            };
        });
        const modifyMAContract = getCallback((({set, snapshot}) => async(newContract) => {
            const input_json = JSON.stringify(newContract);
            console.log(`[ modifyMAContract ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/modifyMaContract`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyMAContract ] message:', data.message);
                    return null;
                };

                const companyMAContracts = await snapshot.getPromise(atomCompanyMAContracts);
                if(newContract.action_type === 'ADD'){
                    delete newContract.action_type;
                    const updatedNewMAContract = {
                        ...newContract,
                        guid : data.out_guid,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCompanyMAContracts, companyMAContracts.concat(updatedNewMAContract));
                    return updatedNewMAContract;
                } else if(newContract.action_type === 'UPDATE'){
                    const currentMAContract = await snapshot.getPromise(atomCurrentMAContract);
                    delete newContract.action_type;
                    delete newContract.company_code;
                    delete newContract.modify_user;
                    const modifiedMAContract = {
                        ...currentMAContract,
                        ...newContract,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentMAContract, modifiedMAContract);
                    const foundIdx = atomCompanyMAContracts.findIndex(contract => 
                        contract.guid === modifiedMAContract.guid);
                    if(foundIdx !== -1){
                        const updatedCompanyContracts = [
                            ...atomCompanyMAContracts.slice(0, foundIdx),
                            modifiedMAContract,
                            ...atomCompanyMAContracts.slice(foundIdx + 1,),
                        ];
                        set(atomCompanyMAContracts, updatedCompanyContracts);
                        return modifiedMAContract;
                    } else {
                        console.log('\t[ modifyMAContract ] No specified MA contract is found');
                        return null;
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyMAContract ] Error : ${err}`);
                return false;
            };
        }));
        return {
            loadCompanyMAContracts,
            setCurrentMAContract,
            modifyMAContract,
        };
    }
});
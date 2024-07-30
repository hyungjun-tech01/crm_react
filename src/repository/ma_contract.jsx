import React from 'react';
import { selector , useRecoilValue} from "recoil";
import { atomMAContractSet
    , atomCurrentMAContract
    , defaultMAContract
    , atomMAContractState
} from '../atoms/atoms';
import Paths from "../constants/Paths";

const BASE_PATH = Paths.BASE_PATH;


export const ContractTypes=[
    {label: 'YLC', value: 'YLC'},
    {label: 'YSC', value: 'YSC'},
    {label: 'QLC', value: 'QLC'},
    {label: 'ASC', value: 'ASC'},
];

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
                    set(atomMAContractSet, []);
                    set(atomMAContractState, 0);
                    return;
                }
                set(atomMAContractSet, data);

                // Change loading state
                const loadStates = await snapshot.getPromise(atomMAContractState);
                set(atomMAContractState, (loadStates | 1));
            }
            catch(err){
                console.error(`loadCompanyMAContracts / Error : ${err}`);
                set(atomMAContractState, 0);
            };
        });
        const loadPurchaseMAContracts = getCallback(({set, snapshot}) => async (code) => {
            const input_json = JSON.stringify({purchase_code: code});
            console.log(`[ loadPurchaseMAContracts ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/purchaseMaContract`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('[loadPurchaseMAContracts] message:', data.message);
                    set(atomMAContractSet, []);
                    return;
                }
                set(atomMAContractSet, data);

                // Change loading state
                const loadStates = await snapshot.getPromise(atomMAContractState);
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
                let companyMAContras = await snapshot.getPromise(atomMAContractSet);

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

                const companyMAContracts = await snapshot.getPromise(atomMAContractSet);
                if(newContract.action_type === 'ADD'){
                    delete newContract.action_type;
                    const updatedNewMAContract = {
                        ...newContract,
                        ma_code : data.out_ma_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomMAContractSet, [updatedNewMAContract, ...companyMAContracts]);
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
                    const foundIdx = companyMAContracts.findIndex(contract => 
                        contract.ma_code === modifiedMAContract.ma_code);
                    if(foundIdx !== -1){
                        const updatedCompanyContracts = [
                            ...companyMAContracts.slice(0, foundIdx),
                            modifiedMAContract,
                            ...companyMAContracts.slice(foundIdx + 1,),
                        ];
                        set(atomMAContractSet, updatedCompanyContracts);
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
            loadPurchaseMAContracts,
            setCurrentMAContract,
            modifyMAContract,
        };
    }
});
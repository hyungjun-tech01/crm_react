import React from 'react';
import { selector } from "recoil";
import { atomCurrentCompany
    , atomAllCompanyObj
    , atomFilteredCompanyArray
    , defaultCompany
    , atomCompanyState,
} from '../atoms/atoms';
import Paths from "../constants/Paths";

const BASE_PATH = Paths.BASE_PATH;

export const companyColumn = [
     { value: 'company_name', label: '회사명'},
     { value: 'company_name_en', label: '영문회사명'},
     { value: 'ceo_name', label: '대표자명'},
     { value: 'business_registration_code', label: '사업자번호'},
     { value: 'business_type', label: '업태'},
     { value: 'business_item', label: '종목'},
     { value: 'company_phone_number', label: '회사전화'},
     { value: 'company_fax_number', label: '회사팩스'},
 ];

 export const ColumnQueryCondition = [
    { value: 'like', label: '포함'},
    { value: 'is null', label: '값이없는'},
    { value: 'is not null', label: '값이있는'},
    { value: '=', label: '='},
];

export const CompanyRepo = selector({
    key: "CompanyRepository",
    get: ({getCallback}) => {
        /////////////////////try to load all Companies /////////////////////////////
        const tryLoadAllCompanies = getCallback(({ set, snapshot }) => async (multiQueryCondi) => {
            const loadStates = await snapshot.getPromise(atomCompanyState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllCompanies] Try to load all Companies');
                set(atomCompanyState, (loadStates | 2));   // state : loading
                const ret = await loadAllCompanies(multiQueryCondi);
                if(ret){
                    // succeeded to load
                    set(atomCompanyState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomCompanyState, 0);
                };
            }
        });
        const loadAllCompanies = getCallback(({set}) => async (multiQueryCondi) => {
            const input_json = JSON.stringify(multiQueryCondi);

            try{
                const response = await fetch(`${BASE_PATH}/companies`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });

                const data = await response.json();
                if(data.message){
                    console.log('\t[ loadAllCompanies ] message:', data.message);
                    set(atomAllCompanyObj, {});
                    return false;
                };
                let allCompanies = {};
                let filteredCompany = [];
                data.forEach(item => {
                    allCompanies[item.company_code] = item;
                    filteredCompany.push(item);
                });
                set(atomAllCompanyObj, allCompanies);
                set(atomFilteredCompanyArray, filteredCompany);
                return true;
            }
            catch(err){
                console.error(`\t[ loadAllCompanies ] Error : ${err}`);
                set(atomAllCompanyObj, {});
                return false;
            };
        });
        const filterCompanies = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allCompanyData = await snapshot.getPromise(atomAllCompanyObj);
            const allCompanyList = Object.values(allCompanyData);
            let allCompanies = [];

            if( itemName === 'common.all' ) {
                allCompanies = allCompanyList.filter(item =>
                    (item.company_name && item.company_name.includes(filterText))
                    || (item.company_phone_number && item.company_phone_number.includes(filterText))
                    || (item.company_address && item.company_address.includes(filterText))
                    || (item.sales_resource && item.sales_resource.includes(filterText))
                    || (item.application_engineer && item.application_engineer.includes(filterText))
                );
            }else if(itemName === 'company.company_name' ){
                allCompanies = allCompanyList.filter(item =>
                    (item.company_name &&item.company_name.includes(filterText))
                );
            }else if(itemName === 'common.phone_no' ){
                allCompanies = allCompanyList.filter(item =>
                    (item.company_phone_number &&item.company_phone_number.includes(filterText))
                );
            }else if(itemName === 'company.address' ){
                allCompanies = allCompanyList.filter(item =>
                    (item.company_address &&item.company_address.includes(filterText))
                );
            }else if(itemName === 'company.salesman' ){
                allCompanies = allCompanyList.filter(item =>
                    (item.sales_resource &&item.sales_resource.includes(filterText))
                );
            }else if(itemName === 'company.engineer' ){
                allCompanies = allCompanyList.filter(item =>
                    (item.application_engineer &&item.application_engineer.includes(filterText))
                );
            }
            set(atomFilteredCompanyArray, allCompanies);
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

                const allCompany = await snapshot.getPromise(atomAllCompanyObj);
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
                    const updatedAllCompanies = {
                        ...allCompany,
                        [data.out_company_code]: updatedNewCompany,
                    };
                    set(atomAllCompanyObj, updatedAllCompanies);
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
                    const updatedAllCompanies = {
                        ...allCompany,
                        [modifiedCompany.company_code] : modifiedCompany,
                    };
                    set(atomAllCompanyObj, updatedAllCompanies);
                    return true;
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
                const allCompanies = await snapshot.getPromise(atomAllCompanyObj);
                if(allCompanies[company_code]){
                    set(atomCurrentCompany, allCompanies[company_code]);
                } else {
                    set(atomCurrentCompany, defaultCompany);
                    return;
                };
            }
            catch(err){
                console.error(`\t[ setCurrentCompany ] Error : ${err}`);
            };
        });
        const searchCompanies = getCallback(({set, snapshot}) => async (itemName, filterText) => {
            // At first, request data to server
            let foundInServer = {};
            const query_obj = {
                queryConditions: [{
                    column: { value: itemName},
                    columnQueryCondition: { value: 'like'},
                    multiQueryInput: filterText,
                    andOr: 'And',
                }],
            };
            const input_json = JSON.stringify(query_obj);
            
            try{
                const response = await fetch(`${BASE_PATH}/companies`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ searchCompanies ] message:', data.message);
                } else {
                    for(const item of data) {
                        foundInServer[item.company_code] = item;
                    }
                };
            } catch(e) {
                console.log('\t[ searchCompanies ] error occurs on searching');
            };

            // Then, update all company obj
            const allCompanyData = await snapshot.getPromise(atomAllCompanyObj);
            const updatedAllCompanyData = {
                ...allCompanyData,
                ...foundInServer,
            };
            set(atomAllCompanyObj, updatedAllCompanyData);

            // Next, look for this updated data
            const updatedList = Object.values(updatedAllCompanyData);
            const foundCompanies = updatedList.filter(item =>
                (item[itemName] && item[itemName].includes(filterText)))
                .sort((a, b) => {
                    if(a.company_name > b.company_name) return 1;
                    if(a.company_name < b.company_name) return -1;
                    return 0;
                });
            
            return foundCompanies;
        });
        return {
            tryLoadAllCompanies,
            loadAllCompanies,
            filterCompanies,
            modifyCompany,
            setCurrentCompany,
            searchCompanies,
        };
    }
});
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
                    set(atomFilteredCompanyArray, []);
                    return false;
                };
                let allCompanies = {};
                let filteredCompanies = [];
                data.forEach(item => {
                    allCompanies[item.company_code] = item;
                    filteredCompanies.push(item);
                });
                set(atomAllCompanyObj, allCompanies);
                set(atomFilteredCompanyArray, filteredCompanies);
                return true;
            }
            catch(err){
                console.error(`\t[ loadAllCompanies ] Error : ${err}`);
                set(atomAllCompanyObj, {});
                set(atomFilteredCompanyArray, []);
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
                    || (item.company_name_en && item.company_name_en.includes(filterText))
                    || (item.company_address && item.company_address.includes(filterText))
                    || (item.sales_resource && item.sales_resource.includes(filterText))
                    || (item.application_engineer && item.application_engineer.includes(filterText))
                );
            }else if(itemName === 'company.company_name' ){
                allCompanies = allCompanyList.filter(item =>
                    (item.company_name &&item.company_name.includes(filterText))
                );
            }else if(itemName === 'company.company_name_en' ){
                allCompanies = allCompanyList.filter(item =>
                    (item.company_name_en &&item.company_name_en.toLowerCase().includes(filterText.toLowerCase()))
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
            try{
                const response = await fetch(`${BASE_PATH}/modifyCompany`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    return { result: false, data: data.message};
                };

                const allCompanies = await snapshot.getPromise(atomAllCompanyObj);
                if(newCompany.action_type === 'ADD'){
                    delete newCompany.action_type;
                    const updatedNewCompany = {
                        ...newCompany,
                        company_code : data.out_company_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                        company_number: data.out_company_number,
                    };
                    //----- Update AllCompanyObj --------------------------//
                    const updatedAllCompanies = {
                        ...allCompanies,
                        [data.out_company_code]: updatedNewCompany,
                    };
                    set(atomAllCompanyObj, updatedAllCompanies);

                    //----- Update FilteredCompanyArray --------------------//
                    const filteredAllCompanies = await snapshot.getPromise(atomFilteredCompanyArray);
                    const updatedFiltered = [
                        updatedNewCompany,
                        ...filteredAllCompanies
                    ];
                    set(atomFilteredCompanyArray, updatedFiltered);
                    return {result:true};
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

                    //----- Update AllCompanyObj --------------------------//
                    const updatedAllCompanies = {
                        ...allCompanies,
                        [modifiedCompany.company_code] : modifiedCompany,
                    };
                    set(atomAllCompanyObj, updatedAllCompanies);

                    //----- Update FilteredCompanies -----------------------//
                    const filteredAllCompanies = await snapshot.getPromise(atomFilteredCompanyArray);
                    const foundIdx = filteredAllCompanies.filter(item => item.company_code === modifiedCompany.company_code);
                    if(foundIdx !== -1){
                        const updatedFiltered = [
                            ...filteredAllCompanies.slice(0, foundIdx),
                            modifiedCompany,
                            ...filteredAllCompanies.slice(foundIdx + 1,),
                        ];
                        set(atomFilteredCompanyArray, updatedFiltered);
                    };
                    return {result:true};
                }
            }
            catch(err){
                return {result:false, data: err};
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
                    const found = await searchCompanies('company_code', company_code, true);
                    if(found.result) {
                        set(atomCurrentCompany, found.data[0]);

                        const updatedAllCompanies = {
                            ...allCompanies,
                            [found.data[0].company_code]: found.data[0]
                        };
                        set(atomAllCompanyObj, updatedAllCompanies);
                        set(atomFilteredCompanyArray, Object.values(updatedAllCompanies));
                    } else {
                        set(atomCurrentCompany, defaultCompany);
                    };
                };
            }
            catch(err){
                console.error(`\t[ setCurrentCompany ] Error : ${err}`);
                set(atomCurrentCompany, defaultCompany);
            };
        });
        const searchCompanies = getCallback(() => async (itemName, filterText, isAccurate = false) => {
            // At first, request data to server
            let foundInServer = {};
            let foundData = [];
            const query_obj = {
                queryConditions: [{
                    column: { value: itemName},
                    columnQueryCondition: { value: isAccurate ? '=' : 'like'},
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
                    return { result: false, message: data.message};
                } else {
                    for(const item of data) {
                        foundInServer[item.company_code] = item;
                    };
                    foundData = data.sort((a, b) => {
                        if(a.company_name > b.company_name) return 1;
                        if(a.company_name < b.company_name) return -1;
                        return 0;
                    });
                };
            } catch(e) {
                console.log('\t[ searchCompanies ] error occurs on searching');
                return { result: false, message: 'fail to query'};
            };

            // //----- Update AllCompanyObj --------------------------//
            // const allCompanyData = await snapshot.getPromise(atomAllCompanyObj);
            // const updatedAllCompanyData = {
            //     ...allCompanyData,
            //     ...foundInServer,
            // };
            // set(atomAllCompanyObj, updatedAllCompanyData);

            // //----- Update FilteredCompanies -----------------------//
            // const updatedList = Object.values(updatedAllCompanyData);
            // set(atomFilteredCompanyArray, updatedList);
            
            return { result: true, data: foundData};
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
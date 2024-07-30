import React from 'react';
import { selector } from "recoil";
import { atomCurrentCompany
    , atomAllCompanyObj
    , atomFilteredCompany
    , defaultCompany
    , atomCompanyState,
    atomCompanyForSelection
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
                    set(atomCompanyForSelection, []);
                    return false;
                };
                let allCompanies = {};
                data.forEach(item => {
                    allCompanies[item.company_code] = item;
                });
                set(atomAllCompanyObj, allCompanies);
                const tempCompanySelection = data.map(item => ({
                    value: {
                        company_code: item.company_code,
                        company_name: item.company_name,
                        company_name_en: item.company_name_en,
                        company_zip_code: item.company_zip_code,
                        company_address: item.company_address,
                        company_phone_number: item.company_phone_number,
                        company_fax_number: item.company_fax_number,
                        ceo_name: item.ceo_name,
                        business_type: item.business_type,
                        business_item: item.business_item,
                        business_registration_code: item.business_registration_code,
                        region: item.region,
                    },
                    label: item.company_name,
                }));
                set(atomCompanyForSelection, tempCompanySelection);
                return true;
            }
            catch(err){
                console.error(`\t[ loadAllCompanies ] Error : ${err}`);
                set(atomAllCompanyObj, {});
                // set(atomCompanyForSelection, []);
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

                const allCompany = await snapshot.getPromise(atomAllCompanyObj);
                // const allCompanySelection = await snapshot.getPromise(atomCompanyForSelection);
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
                    // set(atomCompanyForSelection, allCompanySelection.concat({
                    //     value: {
                    //         company_code: updatedNewCompany.company_code,
                    //         company_name: updatedNewCompany.company_name,
                    //         company_name_en: updatedNewCompany.company_name_en,
                    //         company_zip_code: updatedNewCompany.company_zip_code,
                    //         company_address: updatedNewCompany.company_address,
                    //         region: updatedNewCompany.region,
                    //     },
                    //     label: updatedNewCompany.company_name,
                    // }));
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
                    // const foundSelIdx = allCompanySelection.findIndex(item => 
                    //     item.value.company_code === modifiedCompany.company_code);
                    // if(foundSelIdx !== -1){
                    //     const updatedCompanySelection = [
                    //         ...allCompanySelection.slice(0, foundSelIdx),
                    //         {
                    //             value: {
                    //                 company_code: modifiedCompany.company_code,
                    //                 company_name: modifiedCompany.company_name,
                    //                 company_name_en: modifiedCompany.company_name_en,
                    //                 company_zip_code: modifiedCompany.company_zip_code,
                    //                 company_address: modifiedCompany.company_address,
                    //                 region: modifiedCompany.region,
                    //             },
                    //             label: modifiedCompany.company_name,
                    //         },
                    //         ...allCompanySelection.slice(foundSelIdx + 1, ),
                    //     ]
                    //     set(atomCompanyForSelection, updatedCompanySelection);
                    // } else {
                    //     console.log('\t[ modifyCompany / modify selection ] Impossible case~~!!');    
                    // }
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
                    return data.message;
                };
                return data;
            } catch(e) {
                console.log('\t[ searchCompanies ] error occurs on searching');
                return 'fail to query';
            };
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
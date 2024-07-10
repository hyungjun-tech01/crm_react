import React from 'react';
import { selector } from "recoil";
import { atomCurrentCompany
    , atomAllCompanies
    , atomFilteredCompany
    , defaultCompany
    , atomCompanyState,
    atomCompanyForSelection
} from '../atoms/atoms';
import Paths from "../constants/Paths";

const BASE_PATH = Paths.BASE_PATH;

export const companyColumn = [
     { value: 'company_name', label: '회사명'},
     { value: 'company_name_eng', label: '영문회사명'},
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
        const loadAllCompanies = getCallback(({set, snapshot}) => async (multiQueryCondi) => {
            // It is possible that this function might be called by more than two componets almost at the same time.
            // So, to prevent this function from being executed again and again, check the loading state at first.
            // (State & 1) : check if data is already loaded
            // (State & (1 << 1)) : check if it is on the way to load data.
            const loadStates = await snapshot.getPromise(atomCompanyState);
            const input_json = JSON.stringify(multiQueryCondi);

            if((loadStates & 1) === 0){
                try{
                    //const response = await fetch(`${BASE_PATH}/companies`);
                    const response = await fetch(`${BASE_PATH}/companies`, {
                        method: "POST",
                        headers:{'Content-Type':'application/json'},
                        body: input_json,
                    });
    
                    const data = await response.json();
                    if(data.message){
                        console.log('\t[ loadAllCompanies ] message:', data.message);
                        set(atomAllCompanies, []);
                        set(atomCompanyForSelection, []);
                        set(atomCompanyState, 0);
                        return;
                    }
                    set(atomAllCompanies, data);
                    const tempCompanySelection = data.map(item => ({
                        value: {
                            company_code: item.company_code,
                            company_name: item.company_name,
                            company_name_en: item.company_name_en,
                            company_zip_code: item.company_zip_code,
                            company_address: item.company_address,
                            ceo_name: item.ceo_name,
                            business_type: item.business_type,
                            business_item: item.business_item,
                            business_registration_code: item.business_registration_code,
                            region: item.region,
                        },
                        label: item.company_name,
                    }));
                    set(atomCompanyForSelection, tempCompanySelection);
                    set(atomCompanyState, (loadStates | 1));
                }
                catch(err){
                    console.error(`\t[ loadAllCompanies ] Error : ${err}`);
                    set(atomAllCompanies, []);
                    set(atomCompanyForSelection, []);
                    set(atomCompanyState, 0);
                };
            };
        });

        const filterCompanies = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allCompanyList = await snapshot.getPromise(atomAllCompanies);
            let allCompanies;

            if( itemName === 'common.all' ) {
                allCompanies = allCompanyList.filter(item => (item.company_name &&item.company_name.includes(filterText))||
                                            (item.company_phone_number &&item.company_phone_number.includes(filterText))||
                                            (item.company_address &&item.company_address.includes(filterText))||
                                           (item.sales_resource && item.sales_resource.includes(filterText))  ||
                                           (item.application_engineer && item.application_engineer.includes(filterText))                       
                );
            }else if(itemName === 'company.company_name' ){
                allCompanies = allCompanyList.filter(item => (item.company_name &&item.company_name.includes(filterText))
                );
            }else if(itemName === 'common.phone_no' ){
                allCompanies = allCompanyList.filter(item => (item.company_phone_number &&item.company_phone_number.includes(filterText))
                );
            }else if(itemName === 'company.address' ){
                allCompanies = allCompanyList.filter(item => (item.company_address &&item.company_address.includes(filterText))
                );
            }else if(itemName === 'company.salesman' ){
                allCompanies = allCompanyList.filter(item => (item.sales_resource &&item.sales_resource.includes(filterText))
                );
            }else if(itemName === 'company.engineer' ){
                allCompanies = allCompanyList.filter(item => (item.application_engineer &&item.application_engineer.includes(filterText))
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

                const allCompany = await snapshot.getPromise(atomAllCompanies);
                const allCompanySelection = await snapshot.getPromise(atomCompanyForSelection);
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
                    set(atomAllCompanies, [updatedNewCompany, ...allCompany]);
                    set(atomCompanyForSelection, allCompanySelection.concat({
                        value: {
                            company_code: updatedNewCompany.company_code,
                            company_name: updatedNewCompany.company_name,
                            company_name_en: updatedNewCompany.company_name_en,
                            company_zip_code: updatedNewCompany.company_zip_code,
                            company_address: updatedNewCompany.company_address,
                            region: updatedNewCompany.region,
                        },
                        label: updatedNewCompany.company_name,
                    }));
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
                        const foundSelIdx = allCompanySelection.findIndex(item => 
                            item.value.company_code === modifiedCompany.company_code);
                        if(foundSelIdx !== -1){
                            const updatedCompanySelection = [
                                ...allCompanySelection.slice(0, foundSelIdx),
                                {
                                    value: {
                                        company_code: modifiedCompany.company_code,
                                        company_name: modifiedCompany.company_name,
                                        company_name_en: modifiedCompany.company_name_en,
                                        company_zip_code: modifiedCompany.company_zip_code,
                                        company_address: modifiedCompany.company_address,
                                        region: modifiedCompany.region,
                                    },
                                    label: modifiedCompany.company_name,
                                },
                                ...allCompanySelection.slice(foundSelIdx + 1, ),
                            ]
                            set(atomCompanyForSelection, updatedCompanySelection);
                        } else {
                            console.log('\t[ modifyCompany / modify selection ] Impossible case~~!!');    
                        }
                        return true;
                    } else {
                        console.log('\t[ modifyCompany ] No specified company is found');
                        return false;
                    };
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
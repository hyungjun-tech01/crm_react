import React from 'react';
import { selector } from "recoil";
import { atomCurrentPurchase
    , atomAllPurchases
    , atomCompanyPurchases
    , atomFilteredPurchase
    , defaultPurchase
    , atomPurchaseState
} from '../atoms/atoms';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const ProductDataOptions = [
    {
        label: <span>01.SolidWorks 관련</span>,
        title: '01.SolidWorks 관련',
        options: [
            {
                label: <span>SOLIDWORKS Standard</span>,
                value: {
                    product_code: '652C63E3291FF44FA30097E2FC1A336C',
                    product_name: 'SOLIDWORKS Standard',
                    product_class: '01.SolidWorks 관련',
                }
            },
            {
                label: <span>SOLIDWORKS Professional</span>,
                value: {
                    product_code: '6FCBFE8D9ADAD248841762C8ED709ACB',
                    product_name: 'SOLIDWORKS Professional',
                    product_class: '01.SolidWorks 관련',
                }
            },
            {
                label: <span>SOLIDWORKS Professional - 1year</span>,
                value: {
                    product_code: '38F93398BD44704598C2D168EC1005E8',
                    product_name: 'SOLIDWORKS Professional - 1year',
                    product_class: '01.SolidWorks 관련',
                }
            },
            {
                label: <span>SOLIDWORKS Professional Term License</span>,
                value: {
                    product_code: 'D299E69F097F1E4897CEABB644F15A82',
                    product_name: 'SOLIDWORKS Professional Term License',
                    product_class: '01.SolidWorks 관련',
                },
            },
            {
                label: <span>SOLIDWORKS Premium</span>,
                value: {
                    product_code: '314443004EF76E458A4655352D7731A9',
                    product_name: 'SOLIDWORKS Premium',
                    product_class: '01.SolidWorks 관련',
                },
            },
            {
                label: <span>SOLIDWORKS Premium Term 1year</span>,
                value: {
                    product_code: '2E4A5064FB618248AAFA6D8AFC90314D',
                    product_name: 'SOLIDWORKS Premium Term 1year',
                    product_class: '01.SolidWorks 관련',
                },
            },
            {
                label: <span>DraftSight Enterprise</span>,
                value: {
                    product_code: 'C41FE762DAC93D478EB903E59FEF31BA',
                    product_name: 'DraftSight Enterprise',
                    product_class: '01.SolidWorks 관련',
                },
            },
        ],
    },
    {
        label: <span>05.PDMWorks Enterprise 관련</span>,
        title: '05.PDMWorks Enterprise 관련',
        options: [
            {
                label: <span>SOLIDWORKS PDM Professional CAD Editor</span>,
                value: {
                    product_code: 'E093C7511E80AC42984774DF2CC3543E',
                    product_name: 'SOLIDWORKS PDM Professional CAD Editor',
                    product_class: '05.PDMWorks Enterprise 관련',
                },
            },
        ],
    },
    {
        label: <span>09.제품관리</span>,
        title: '09.제품관리',
        options: [
            {
                label: <span>SOLIDWORKS Premium</span>,
                value: {
                    product_code: '3B66D7F737A3B34297B4D877FE4905F9',
                    product_name: 'SOLIDWORKS Premium',
                    product_class: '09.제품관리',
                },
            },
        ],
    },
    {
        label: <span>13. 3DEXPERIENCE Platform</span>,
        title: '13. 3DEXPERIENCE Platform',
        options: [
            {
                label: <span>Collaborative Business Innovator</span>,
                value: {
                    product_code: '3ED434AE1590CD40B0E2A904E359A61D',
                    product_name: 'Collaborative Business Innovator',
                    product_class: '13. 3DEXPERIENCE Platform',
                },
            },
            {
                label: <span>Collaborative Industry Innovator</span>,
                value: {
                    product_code: '8EB5C5B2DC207943A06346292290799A',
                    product_name: 'Collaborative Industry Innovator',
                    product_class: '13. 3DEXPERIENCE Platform',
                },
            },
            {
                label: <span>Platform Extended Storage</span>,
                value: {
                    product_code: 'AAD4BC6AF5CB664887DF592631AF5364',
                    product_name: 'Platform Extended Storage',
                    product_class: '13. 3DEXPERIENCE Platform',
                },
            },
        ],
    },
];

export const ProductTypeOptions = [
    {value:null, label: 'N/A'},
    {value:'N(Act)', label: 'N(Act)'},
    {value:'ST(Act)', label: 'ST(Act)'},
    {value:'D(USB)', label: 'D(USB)'},
    {value:'N(Pareller)', label: 'N(Pareller)'},
    {value:'N(USB)', label: 'N(USB)'},
    {value:'D(Pareller)', label: 'D(Pareller)'},
]

export const PurchaseRepo = selector({
    key: "PurchaseRepository",
    get: ({getCallback}) => {
        const loadAllPurchases = getCallback(({set, snapshot}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/purchases`);
                const data = await response.json();
                if(data.message){
                    console.log('loadAllPurchases message:', data.message);
                    set(atomAllPurchases, []);
                    return;
                }
                set(atomAllPurchases, data);

                // Change loading state
                const loadStates = snapshot.getPromise(atomPurchaseState);
                set(atomPurchaseState, (loadStates | 1));
            }
            catch(err){
                console.error(`loadAllCompanies / Error : ${err}`);
            };
        });
        const loadCompanyPurchases = getCallback(({set}) => async (company_code) => {
            const input_json = {company_code:company_code};
            //JSON.stringify(company_code);
            try{
                const response = await fetch(`${BASE_PATH}/companyPurchases`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify(input_json),
                });

                const data = await response.json();
                if(data.message){
                    console.log('loadCompanyPurchases message:', data.message);
                    set(atomCompanyPurchases, input_json);
                    return;
                }
                set(atomCompanyPurchases, data);
            }
            catch(err){
                console.error(`loadCompanyPurchases / Error : ${err}`);
            };
        });
        const filterCompanyPurchase = getCallback(({set, snapshot }) => async (filterText) => {
            const allPurchaseList = await snapshot.getPromise(atomCompanyPurchases);
            
            let allPurchase;
            if (filterText === '') {
                allPurchase = allPurchaseList;
            }
            else {
                allPurchase = 
                allPurchaseList.filter(item => ( item.product_type && item.product_type.includes(filterText)||
                                                item.product_name && item.product_name.includes(filterText)      
                ));
            }
            set(atomFilteredPurchase, allPurchase);
            return true;
        });

        const filterPurchases = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allPurchaseList = await snapshot.getPromise(atomAllPurchases);
            let  allQPurchase ;
            console.log('filterPurchases', itemName, filterText);
            if(itemName === 'common.all'){
                allQPurchase = allPurchaseList.filter(item => (item.product_type &&item.product_type.includes(filterText))||
                                            (item.product_name && item.product_name.includes(filterText)) ||
                                            (item.company_name && item.company_name.includes(filterText)) 
                );
            }else if(itemName === 'purchase.product_type'){
                allQPurchase = allPurchaseList.filter(item => (item.product_type &&item.product_type.includes(filterText))
                );    
            }else if(itemName === 'purchase.product_name'){
                allQPurchase = allPurchaseList.filter(item => (item.product_name &&item.product_name.includes(filterText))
                );  
            }else if(itemName === 'company.company_name'){
                allQPurchase = allPurchaseList.filter(item => (item.company_name &&item.company_name.includes(filterText))
                );  
            }
            set(atomFilteredPurchase, allQPurchase);
            return true;
        });            
        const modifyPurchase = getCallback(({set, snapshot}) => async (newPurchase) => {
            const input_json = JSON.stringify(newPurchase);
            console.log(`[ modifyPurchase ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/modifyPurchase`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message){
                    console.log('\t[ modifyPurchase ] message:', data.message);
                    return false;
                };

                const allPurchases = await snapshot.getPromise(atomAllPurchases);
                if(newPurchase.action_type === 'ADD'){
                    delete newPurchase.action_type;
                    const updatedNewPurchase = {
                        ...newPurchase,
                        purchase_code : data.out_purchase_code,
                        create_user : data.out_create_user,
                        create_date : data.out_create_date,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomAllPurchases, allPurchases.concat(updatedNewPurchase));
                    return true;
                } else if(newPurchase.action_type === 'UPDATE'){
                    const currentPurchase = await snapshot.getPromise(atomCurrentPurchase);
                    delete newPurchase.action_type;
                    delete newPurchase.company_code;
                    delete newPurchase.modify_user;
                    const modifiedPurchase = {
                        ...currentPurchase,
                        ...newPurchase,
                        modify_date: data.out_modify_date,
                        recent_user: data.out_recent_user,
                    };
                    set(atomCurrentPurchase, modifiedPurchase);
                    const foundIdx = allPurchases.findIndex(purchase => 
                        purchase.purchase_code === modifiedPurchase.purchase_code);
                    if(foundIdx !== -1){
                        const updatedAllPurchases = [
                            ...allPurchases.slice(0, foundIdx),
                            modifiedPurchase,
                            ...allPurchases.slice(foundIdx + 1,),
                        ];
                        set(atomAllPurchases, updatedAllPurchases);
                        return true;
                    } else {
                        console.log('\t[ modifyPurchase ] No specified purchase is found');
                        return false;
                    }
                }
            }
            catch(err){
                console.error(`\t[ modifyPurchase ] Error : ${err}`);
                return false;
            };
        });
        const setCurrentPurchase = getCallback(({set, snapshot}) => async (code) => {
            try{
                if(code === undefined || code === null) {
                    set(atomCurrentPurchase, defaultPurchase);
                    return;
                };

                let queriedPurchases = await snapshot.getPromise(atomAllPurchases);

                if(queriedPurchases.length === 0){
                    queriedPurchases = await snapshot.getPromise(atomCompanyPurchases);
                };
                const selected_arrary = queriedPurchases.filter(purchase => purchase.purchase_code === code);
                if(selected_arrary.length > 0){
                    set(atomCurrentPurchase, selected_arrary[0]);
                } else {
                    set(atomCurrentPurchase, defaultPurchase);
                }
            }
            catch(err){
                console.error(`setCurrentPurchase / Error : ${err}`);
            };
        });
        return {
            loadAllPurchases,
            loadCompanyPurchases,
            modifyPurchase,
            setCurrentPurchase,
            filterPurchases,
            filterCompanyPurchase
        };
    }
});
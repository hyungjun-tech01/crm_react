import React from 'react';
import { atom } from 'recoil';

//----- Compnay ----------------------
export const defaultCompany = {
    company_code: null,
    company_number: null,
    group_: null,
    company_scale: null,
    deal_type: null,
    company_name: null,
    company_name_eng: null,
    business_registration_code: null,
    establishment_date: null,
    closure_date: null,
    ceo_name: null,
    business_type: null,
    business_item: null,
    industry_type: null,
    company_zip_code: null,
    company_address: null,
    company_phone_number: null,
    company_fax_number: null,
    homepage: null,
    memo: null,
    create_user: null,
    create_date: null,
    modify_date: null,
    recent_user: null,
    counter: 0,
    account_code: null,
    bank_name: null,
    account_owner: null,
    sales_resource: null,
    application_engineer: null,
    region: null,
};

export const atomCurrentCompany = atom({
    key: "currentCompany",
    default: defaultCompany,
});

export const atomAllCompanies = atom({
    key: "allCompanies",
    default: [],
});

//----- Lead ------------------------
export const defaultLead = {
    lead_code: null,
    company_code: null,
    lead_index: 0,
    company_index: 0,
    lead_number: null,
    group_: null,
    sales_resource: null,
    region: null,
    company_name: null,
    company_zip_code: null,
    company_address: null,
    company_phone_number: null,
    company_fax_number: null,
    lead_name: null,
    is_keyman: null,
    department: null,
    position: null,
    mobile_number: null,
    company_name_en: null,
    email: null,
    homepage: null,
    create_user: null,
    create_date: null,
    modify_date: null,
    recent_user: null,
    counter: 0,
    application_engineer: null,
    status: null,
};

export const atomCurrentLead = atom({
    key: "currentLead",
    default: defaultLead,
});

export const atomAllLeads = atom({
    key: "allLeads",
    default: [],
});

//----- Consulting ------------------------
export const defaultConsulting = {
    consulting_code : null,    
    lead_code : null,         
    receipt_date : null,      
    receipt_time : null,      
    consulting_type : null,   
    receiver : null,          
    sales_representati : null,
    company_name : null,      
    company_code : null,      
    lead_name : null,         
    department : null,        
    position : null,          
    phone_number : null,      
    mobile_number : null,     
    email : null,             
    request_content : null,    
    status : null,             
    lead_time : null,          
    action_content : null,     
    request_type : null,       
    create_date : null,               
    creater : null,            
    recent_user : null,        
    modify_date : null,         
    product_type : null,      
};

export const atomCurrentConsulting = atom({
    key: "currentConsulting",
    default: defaultConsulting,
});

export const atomAllConsultings = atom({
    key: "allConsultings",
    default: [],
});
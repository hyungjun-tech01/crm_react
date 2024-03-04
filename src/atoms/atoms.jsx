import React from 'react';
import { atom } from 'recoil';

//----- Compnay ----------------------
export const defaultCompany = {
    company_code: "",
    company_number: "",
    group_: "",
    company_scale: "",
    deal_type: "",
    company_name: "",
    company_name_eng: "",
    business_registration_code: "",
    establishment_date: null,
    closure_date: null,
    ceo_name: "",
    business_type: "",
    business_item: "",
    industry_type: "",
    company_zip_code: "",
    company_address: "",
    company_phone_number: "",
    company_fax_number: "",
    homepage: "",
    memo: "",
    create_user: "",
    create_date: null,
    modify_date: null,
    recent_user: "",
    counter: 0,
    account_code: "",
    bank_name: "",
    account_owner: "",
    sales_resource: "",
    application_engineer: "",
    region: "",
};

export const atomCurrentCompany = atom({
    key: "currentCompany",
    default: defaultCompany,
});

export const atomAllCompanies = atom({
    key: "allCompanies",
    default: [],
});

//----- Lead ----------------------
export const defaultLead = {
    leads_code: "",
    company_code: "",
    leads_index: 0,
    company_index: 0,
    lead_number: "",
    group_: "",
    sales_resource: "",
    region: "",
    company_name: "",
    company_zip_code: "",
    company_address: "",
    company_phone_number: "",
    company_fax_number: "",
    leads_name: "",
    is_keyman: "",
    department: "",
    position: "",
    mobile_number: "",
    company_name_en: "",
    email: "",
    homepage: "",
    create_user: "",
    create_date: null,
    modify_date: null,
    recent_user: "",
    counter: 0,
    application_engineer: "",
    status: "",
};

export const atomCurrentLead = atom({
    key: "currentLead",
    default: defaultLead,
});

export const atomAllLeads = atom({
    key: "allLeads",
    default: [],
});
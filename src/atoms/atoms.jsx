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
    //-----Lead info --------------
    lead_code: null,
    lead_index: 0,
    lead_number: null,
    lead_name: null,
    is_keyman: null,
    department: null,
    position: null,
    mobile_number: null,
    email: null,
    homepage: null,
    group_: null,
    region: null,
    sales_resource: null,
    application_engineer: null,
    status: null,
    //-----Company info --------------
    company_code: null,
    company_index: 0,
    company_name: null,
    company_name_en: null,
    company_zip_code: null,
    company_address: null,
    company_phone_number: null,
    company_fax_number: null,
    //-----Etc info --------------
    counter: 0,
    create_user: null,
    create_date: null,
    modify_date: null,
    recent_user: null,
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
    //-----Consulting info --------------
    consulting_code: null,
    consulting_type: null,
    receipt_date: null,
    receipt_time: null,
    receiver: null,
    product_type: null,
    lead_time: null,
    request_type: null,
    request_content: null,
    action_content: null,
    sales_representati: null,
    status: null,
    //-----Company info --------------
    company_code: null,
    company_name: null,
    //-----Lead info -----------------
    lead_code: null,
    lead_name: null,
    department: null,
    position: null,
    mobile_number: null,
    phone_number: null,
    email: null,
    //-----Etc info -----------------
    create_date: null,
    creater: null,
    modify_date: null,
    recent_user: null,
};

export const atomCurrentConsulting = atom({
    key: "currentConsulting",
    default: defaultConsulting,
});

export const atomAllConsultings = atom({
    key: "allConsultings",
    default: [],
});

//----- Quotations ------------------------
export const defaultQuotation = {
    //-----Quotation info -----------------
    quotation_code: null,
    quotation_type: null,
    quotation_number: null,
    quotation_title: null,
    quotation_send_type: null,
    quotation_date: null,
    quotation_contents: null,
    quotation_manager: null,
    quotation_expiration_date: null,
    quotation_amount: null,
    delivery_location: null,
    payment_type: null,
    warranty_period: null,
    delivery_period: null,
    status: null,
    comfirm_date: null,
    quotation_table: null,
    list_price: null,
    list_price_dc: null,
    sub_total_amount: null,
    dc_rate: null,
    dc_amount: null,
    tax_amount: null,
    total_quotation_amount: null,
    cutoff_amount: null,
    total_cost_price: null,
    profit: null,
    profit_rate: null,
    upper_memo: null,
    lower_memo: null,
    currency: null,
    print_template: null,
    //-----Lead info -----------------
    lead_code: null,
    lead_name: null,
    department: null,
    position: null,
    mobile_number: null,
    phone_number: null,
    fax_number: null,
    email: null,
    //-----Company info --------------
    company_code: null,
    region: null,
    company_name: null,
    //-----Etc info -----------------
    sales_representative: null,
    count: null,
    creator: null,
    create_date: null,
    modify_date: null,
    recent_user: null,
};

export const atomCurrentQuotation = atom({
    key: "currentQuotation",
    default: defaultQuotation,
});

export const atomAllQuotations = atom({
    key: "allQuotations",
    default: [],
});

//----- Transaction ------------------------
export const defaultTransaction = {
    //-----Transaction info --------------
    transaction_code: null,
    transaction_title: null,
    transaction_type: null,
    transaction_contents: null,
    publish_date: null,
    publish_type: null,
    supply_price: null,
    tax_price: null,
    total_price: null,
    currency: null,
    payment_type: null,
    //-----Lead info --------------
    lead_code: null,
    //-----Company info --------------
    company_name: null,
    ceo_name: null,
    company_address: null,
    business_type: null,
    business_item: null,
    business_registration_code: null,
    //-----Etc info --------------
    creater: null,
    modify_date: null,
    recent_user: null,
};

export const atomCurrentTransaction = atom({
    key: "currentTransaction",
    default: defaultTransaction,
});

export const atomAllTransactions = atom({
    key: "allTransactions",
    default: [],
});

//----- Purchase ------------------------
export const defaultPurchase = {
    //-----Purchase info --------------
    purchase_code: null,
    //----- Company info --------------
    company_code: null,
    //----- Product info --------------
    product_code: null,
    product_type: null,
    product_name: null,
    serial_number: null,
    delivery_date: null,
    MA_contact_date: null,
    MA_finish_date: null,
    quantity: null,
    price: null,
    currency: null,
    register: null,
    registration_date: null,
    regcode: null,
    purchase_memo: null,
    //----- Etc info --------------
    recent_user: null,
    modify_date: null,
    status: null,
};

export const atomCurrentPurchase = atom({
    key: "currentPurchase",
    default: defaultPurchase,
});

export const atomAllPurchases = atom({
    key: "allPurchases",
    default: [],
});
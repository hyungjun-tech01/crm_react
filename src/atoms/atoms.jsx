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
export const atomFilteredCompany = atom({
    key: "filteredCompanies",
    default: [],
});
export const atomCompanyState = atom({
    key: "companyState",
    default: 0,
});
export const atomCompanyForSelection = atom({
    key: "companySelection",
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
export const atomFilteredLead  = atom({
    key: "filteredLeads",
    default: [],
});
export const atomLeadState = atom({
    key: "leadState",
    default: 0,
});
export const atomLeadsForSelection = atom({
    key: "leadsForSelection",
    default: [],
});

//----- Consulting ------------------------
export const defaultConsulting = {
    //-----Consulting info --------------
    consulting_code: null,
    consulting_type: null,
    receipt_date: null,
    receiver: null,
    product_type: null,
    lead_time: null,
    request_type: null,
    request_content: null,
    action_content: null,
    sales_representati: null,
    application_engineer: null,
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
    creator: null,
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
export const atomCompanyConsultings = atom({
    key: "companyConsultings",
    default: [],
});
export const atomFilteredConsulting = atom({
    key: "filteredConsultings",
    default: [],
});
export const atomConsultingState = atom({
    key: "consultingState",
    default: 0,
});
//----- Quotations ------------------------
export const defaultQuotation = {
    //-----Quotation Main info -----------------
    quotation_code: null,
    quotation_title: null,
    quotation_number: null,
    quotation_type: null,
    quotation_manager: null,
    quotation_send_type: null,
    quotation_date: null,
    quotation_expiration_date: null,
    comfirm_date: null,
    delivery_location: null,
    delivery_period: null,
    warranty_period: null,
    sales_representative: null,
    //-----Quotation Cost info -----------------
    payment_type: null,
    list_price: 0,
    list_price_dc: 0,
    sub_total_amount: 0,
    dc_rate: 0,
    dc_amount: 0,
    quotation_amount: 0,
    tax_amount: 0,
    cutoff_amount: 0,
    total_quotation_amount: 0,
    total_cost_price: 0,
    profit: 0,
    profit_rate: 0,
    quotation_table: null,
    quotation_contents: [],
    print_template: null,
    upper_memo: null,
    lower_memo: null,
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
    status: null,
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
export const atomCompanyQuotations = atom({
    key: "companyQuotations",
    default: [],
});
export const atomFilteredQuotation = atom({
    key: "filteredQuotations",
    default: [],
});
export const atomQuotationState = atom({
    key: "quotationState",
    default: 0,
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
    supply_price: 0,
    tax_price: 0,
    total_price: 0,
    payment_type: null,
    paid_money: 0,
    bank_name: '',
    account_owner: '',
    account_number: '',
    card_name: '',
    card_number: '',
    is_bill_publish: false,
    //-----Company info --------------
    company_code: null,
    company_name: null,
    ceo_name: null,
    company_address: null,
    business_type: null,
    business_item: null,
    business_registration_code: null,
    //-----Etc info --------------
    creator: null,
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
export const atomFilteredTransaction = atom({
    key: "allFilteredTransactions",
    default: [],
});
export const atomTransactionState = atom({
    key: "transactionState",
    default: 0,
});

//----- Purchase ------------------------
export const defaultPurchase = {
    //-----Purchase info --------------
    purchase_code: null,
    //----- Company info --------------
    company_code: null,
    //----- Product info --------------
    product_code: null,
    product_class_name: null,
    product_name: null,
    serial_number: null,
    licence_info: null,
    po_number: null,
    product_type: null,
    module: null,
    //----- Deal info --------------
    receipt_date: null,
    delivery_date: null,
    ma_finish_date: null,
    invoice_number: null,
    price: null,
    register: null,
    registration_date: null,
    hq_finish_date: null,
    quantity: null,
    regcode: null,
    ma_contact_date: null,
    //----- Etc info --------------
    purchase_memo: null,
    modify_user: null,
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
export const atomCompanyPurchases = atom({
    key: "companyPurchases",
    default: [],
});
export const atomFilteredPurchase = atom({
    key: "allFilteredPurchases",
    default: [],
});
export const atomPurchaseState = atom({
    key: "purchaseState",
    default: 0,
});

//----- MA Contract ------------------------
export const defaultMAContract = {
    action_type : null,
    ma_code : null,
    purchase_code : null,
    ma_company_code : null,
    ma_contract_date : null,
    ma_contract_type: null,
    ma_finish_date : null,
    ma_price : null,
    ma_memo : null,
    modify_user : null,
};
export const atomCurrentMAContract = atom({
    key: "currentMAContract",
    default: defaultMAContract,
});
export const atomMAContractSet = atom({
    key: "MAcontractSet",
    default: [],
});
export const atomMAContractState = atom({
    key: "MAContractState",
    default: 0,
});

//----- Product class ------------------------
export const defaultProductClass = {
    product_class_code : null,
    product_class_name : null,
    product_class_order : null,
    product_class_memo : null,
};
export const atomProductClassList = atom({
    key: "allProductClassList",
    default: [],
});
export const atomProductClassListState = atom({
    key: "ProductClassListState",
    default: 0,
});

//----- Product  -----------------------------
export const defaultProduct = {
    product_code : null,
    product_class_name : null,
    manufacturer : null,
    model_name : null,
    product_name : null,
    unit : null,
    cost_price : null,
    reseller_price : null,
    list_price : null,
    detail_desc : null,
    memo : null,
    modify_user : null,
};
export const atomAllProducts = atom({
    key: "loadedProducts",
    default: [],
});
export const atomProductsState = atom({
    key: "ProductsState",
    default: 0,
});

//----- Product Options for Select  -----------------------------
export const atomProductOptions = atom({
    key: "productOptions",
    default: [],
});
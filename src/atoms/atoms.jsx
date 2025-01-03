 import React from 'react';
import { atom } from 'recoil';

//----- Compnay ----------------------
export const defaultCompany = {
    company_code: null,
    company_number: null,
    company_group: null,
    company_scale: null,
    deal_type: null,
    company_name: null,
    company_name_en: null,
    business_registration_code: null,
    establishment_date: null,
    closure_date: null,
    site_id: null,
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
export const atomAllCompanyObj = atom({
    key: "allCompanyObj",
    default: {},
});
export const atomFilteredCompanyArray = atom({
    key: "filteredCompanyArray",
    default: [],
});
export const atomCompanyState = atom({
    key: "companyState",
    default: 0,
});
export const atomPurchaseByCompany = atom({
    key: "purchaseByCompany",
    default: [],
});
export const atomTransactionByCompany = atom({
    key: "transactionByCompany",
    default: [],
});
export const atomTaxInvoiceByCompany = atom({
    key: "taxInvoiceByCompany",
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
    email2: null,
    homepage: null,
    dm_exist: null,
    lead_group: null,
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
    site_id: null,
    //-----Etc info --------------
    memo: null,
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
export const atomAllLeadObj = atom({
    key: "allLeadObj",
    default: {},
});
export const atomFilteredLeadArray  = atom({
    key: "filteredLeadArray",
    default: [],
});
export const atomConsultingByLead = atom({
    key: "consultingByLead",
    default: [],
});
export const atomQuotationByLead = atom({
    key: "quotationByLead",
    default: [],
});
export const atomLeadState = atom({
    key: "leadState",
    default: 0,
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
    request_attachment_code: null,
    action_content: null,
    action_attachment_code: null,
    sales_representative: null,
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
export const atomAllConsultingObj = atom({
    key: "allConsultings",
    default: {},
});
export const atomCompanyConsultings = atom({
    key: "companyConsultings",
    default: [],
});
export const atomFilteredConsultingArray = atom({
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
export const atomAllQuotationObj = atom({
    key: "allQuotations",
    default: {},
});
export const atomCompanyQuotations = atom({
    key: "companyQuotations",
    default: [],
});
export const atomFilteredQuotationArray = atom({
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
    payment_type: null,
    supply_price: 0,
    tax_price: 0,
    total_price: 0,
    paid_money: 0,
    bank_name: null,
    account_owner: null,
    account_number: null,
    card_name: null,
    card_number: null,
    is_bill_publish: null,
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
export const atomAllTransactionObj = atom({
    key: "allTransactions",
    default: {},
});
export const atomFilteredTransactionArray = atom({
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
    company_name: null,
    company_name_en:null,
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
export const atomAllPurchaseObj = atom({
    key: "allPurchases",
    default: {},
});
export const atomCompanyPurchases = atom({
    key: "companyPurchases",
    default: [],
});
export const atomFilteredPurchaseArray = atom({
    key: "allFilteredPurchases",
    default: [],
});
export const atomPurchaseState = atom({
    key: "purchaseState",
    default: 0,
});

//----- MA Contract ------------------------
export const defaultMAContract = {
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


//----- Tax Invoice ------------------------
export const defaultTaxInvoice = {
    //----- Tax Invoice info --------------
    tax_invoice_code : null,
    publish_type : null,
    transaction_type : null,
    invoice_type : null,
    index1 : null,
    index2 : null,
    receive_type : null,
    invoice_contents : null,
    //----- Company info --------------
    company_code : null,
    business_registration_code : null,
    company_name : null,
    ceo_name : null,
    company_address : null,
    business_type : null,
    business_item : null,
    //----- Price info --------------
    supply_price : null,
    tax_price : null,
    total_price : null,
    cash_amount : null,
    check_amount : null,
    note_amount : null,
    receivable_amount : null,
    //----- Etc info --------------
    sequence_number: 0,
    memo : null,
    summary : null,
    create_date : null,
    modify_date : null,
    creator : null,
    recent_user : null,
};
export const atomCurrentTaxInvoice = atom({
    key: "currentTaxInvoice",
    default: defaultTaxInvoice,
});
export const atomAllTaxInvoiceObj = atom({
    key: "taxInvoiceObj",
    default: {},
});
export const atomTaxInvoiceArray = atom({
    key: "taxInvoiceArray",
    default: [],
});
export const atomFilteredTaxInvoiceArray = atom({
    key: "filteredTaxInvoiceArray",
    default: [],
});
export const atomTaxInvoiceState = atom({
    key: "taxInvoiceState",
    default: 0,
});

//----- Attchments for Consulting ------------------------
export const atomRequestAttachmentCode = atom({
    key: "requestAttachmentCode",
    default: null,
});
export const atomActionAttachmentCode = atom({
    key: "actionAttachmentCode",
    default: null,
});
export const atomRequestAttachments = atom({
    key: "requestAttachments",
    default: [],
});
export const atomActionAttachments = atom({
    key: "actionAttachments",
    default: [],
});

//----- Modal State ------------------------
export const atomModalInfoStack = atom({
    key: "modalInfoStack",
    default: [],
});
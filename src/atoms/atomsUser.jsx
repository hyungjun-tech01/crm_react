import { atom } from "recoil";

export const defaultUser = {
    userId: "",
    userName: "",
    password: "",
    mobileNumber: "",
    phoneNumber: "",
    department: "",
    position: "",
    email: "",
    private_group: "",
    memo: "",
    jobType: "",
    isWork: "",
    userRole:"",
}

export const atomCurrentUser = atom({
    key: "currentUser",
    default: defaultUser
});

export const atomCurrentModifyUser = atom({
    key: "atomCurrentModifyUser",
    default: defaultUser
});

export const atomAllUsers = atom({
    key: "allUsers",
    default: [],
});

export const atomFilteredUserArray = atom({
    key: "fileteredUserArray",
    default: [],
});

export const atomUserState = atom({
    key: "userState",
    default: 0,
});

export const atomSalespersonsForSelection = atom({
    key: "salespersonUsers",
    default: [],
});

export const atomEngineersForSelection = atom({
    key: "engineerUsers",
    default: [],
});

export const atomUsersForSelection = atom({
    key: "userSelection",
    default: [],
});

export const atomAccountState = atom({
    key: "accountState",
    default: 0,
});

export const defaultAccount = {
    account_code: null,
    business_registration_code: null,
    company_name: null,
    company_name_en: null,
    ceo_name: null,
    company_address: null,
    company_zip_code: null,
    business_type: null,
    business_item: null,
    phone_number: null,
    fax_number: null,
    email: null,
    homepage: null,
    memo: null,
    event: null,
}

export const atomAccountInfo = atom({
    key: "atomAccountInfo",
    default: defaultAccount,
})
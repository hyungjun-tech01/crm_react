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

export const atomAllUsers = atom({
    key: "allUsers",
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
    business_registration_code: '',
    company_name: '',
    ceo_name: '',
    company_address: '',
    business_type: '',
    business_item: '',
}

export const atomAccountInfo = atom({
    key: "accountInfo",
    default: defaultAccount,
})
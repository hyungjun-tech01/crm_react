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
    group_: "",
    memo: "",
    jobType: "",
    isWork: ""
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
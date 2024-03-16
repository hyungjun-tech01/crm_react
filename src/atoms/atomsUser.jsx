import {atom} from "recoil";

export const defaultUser = {
    userId: "", 
    userName: "", 
    password: "", 
    mobileNumber: "",
    phoneNumber : "",
    department: "", 
    position: "", 
    email: "", 
    group_: "", 
    memo: ""
}

export const atomCurrentUser= atom({
    key: "currentUser",
    default: defaultUser,
});



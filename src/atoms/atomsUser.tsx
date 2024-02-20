import {atom, selector} from "recoil";
import React from "react";

export const defaultUser = {
    userId: "", 
    userName: "", 
    name: "", 
    email: "", 
    isAdmin: false, 
    password: "", 
    phone: "",
    organization: "", 
    subscribeToOwnCards: false, 
    createdAt: "", 
    updatedAt: "", 
    deletedAt: "", 
    language: "",
    passwordChangeAt: "", 
    avatar: "", 
    detail: ""
}


export const atomCurrentUser= atom({
    key: "currentUser",
    default: defaultUser,
});



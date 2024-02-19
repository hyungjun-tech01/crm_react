import {atom, selector} from "recoil";
import React from "react";

export interface IUser{
    userId : string;
    userName : string;
    name : string; 
    email : string;
    isAdmin : boolean; 
    password : string; 
    phone : string; 
    organization : string; 
    subscribeToOwnCards : boolean;
    createdAt : string;
    updatedAt : string;
    deletedAt : string;
    language : string;
    passwordChangeAt :string;
    avatar : string;
    detail : string;
}

// export interface IModifyUser{
//     createrId : string; 
//     userActionType : string; 
//     userName : string; 
//     name : string; 
//     userId : string;
//     email : string;
//     isAdmin : boolean; 
//     password : string; 
//     phone : string; 
//     organization : string; 
//     subscribeToOwnCards : boolean;
//     language : string;
//     avatar : string;
//     detail : string;
// }

// export interface IValidateUser{
//     email: string;
//     password: string;
// }

export const defaultUser:IUser = {
    userId:"" , userName:"", name:"", email:"", isAdmin:false, password:"", phone:"", 
        organization:"", subscribeToOwnCards:false, createdAt:"", updatedAt:"", deletedAt:"",language:"",
        passwordChangeAt:"", avatar:"", detail:""
}

export const atomMyUser = atom<IUser>({
    key:"myUser",
    default : defaultUser,
});


// user selector  get , set 
// export const allUserSelector = selector ({
//     key:"allUserSelector",
//     get:({get}) => {
//         const allUsers = get(atomAllUser); 
//         return (allUsers);
//     },
//     set:({set, get}, newValue )=>{
//         //const allUsers = get(atomAllUser); 
//         if (Array.isArray(newValue)) {
//             const updatedUsers = [...newValue];
//             const newAtomAllUsers = updatedUsers;
//             set(atomAllUser, newAtomAllUsers);
//         }
//     }
// });


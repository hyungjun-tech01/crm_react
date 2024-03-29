import React from 'react';
import { selector } from "recoil";
import { atomCurrentUser } from '../atoms/atomsUser';
import { data_user } from './test_data';


import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export async function  apiLoginValidate(email, password) {
    try{
        const input_data = {
            email: email,
            password: password,
        };
        const response = await fetch(`${BASE_PATH}/login`,{
            method: "POST", 
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(input_data)
           }); 
        let responseMessage = await response.json();
        responseMessage  ={...responseMessage};
           console.log('responseMessage', responseMessage);
           return(responseMessage);
    }catch(err){
        console.error(err);
        return(err);
    }
 }


 export const UserRepo = selector({
    key: "UserRepository",
    get: ({getCallback}) => {
        const loadUsers = getCallback(({set}) => async (userId) => {
            try{
                const input_data = {
                    userId: userId,
                };
                const response = await fetch(`${BASE_PATH}/getuser`, {
                 method: 'POST',
                 headers: {'Content-Type':'application/json'},
                 body: JSON.stringify(input_data)
                });

                const data = await response.json();
                if(data.message){
                    console.log('loadUsers message:', data.message);
                    set(atomCurrentUser, []);
                    return;
                }
                set(atomCurrentUser, data);
            }
            catch(err){
                console.error(`loadUsers / Error : ${err}`);
            };
        });
        return {
            loadUsers,
        };
    }
});

// export const UserRepo = selector({
//     key: "UserRepo",
//     get: ({getCallback}) => {
//         const loadUser = getCallback(({set}) => async (email, password) => {
//         try{
//             console.log("loadUser ~~~~ ", email, password, `${BASE_PATH}/login`);
//             // from friday subscription 
//             const input_data = {
//                 email: email,
//                 password: password,
//             };
//              const response = await fetch(`${BASE_PATH}/login`, {
//                  method: 'POST',
//                  headers: {'Content-Type':'application/json'},
//                  body: JSON.stringify(input_data)
//              });

//              const data = await response.json();

//              if(data.message) {
//                 console.log(data.message);
//                  set(atomCurrentUser, []);
//              }
//              else {
//                  set(atomCurrentUser, data);
//              }

//                 // const response = await fetch(`${BASE_PATH}/company/all`);
//                 // const data = await response.json();
//                 // if(data.message){
//                 //     console.log('loadCurrentCompany message:', data.message);
//                 //     set(atomAllCompanies, []);
//                 //     return;
//                 // }
//                 // set(atomAllCompanies, data);

//             }
//             catch(err){
//                 console.error(`loadUser / Error : ${err}`);
//             };
//         });
        
//         return {
//             loadUser
//         };
//     }
// });
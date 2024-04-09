import React from 'react';
import { selector } from "recoil";
import { atomCurrentUser, defaultUser } from '../atoms/atomsUser';
import { data_user } from './test_data';


import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export async function  apiLoginValidate(userId, password) {
    try{
        const input_data = {
            userId: userId,
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
 export async function  apiRegister(userId, userName, Email, password) {
    try{
        const input_data = {
            action_type:'ADD',
            userId: userId,
            userName: userName,
            password: password,
            email:Email
        };
        const response = await fetch(`${BASE_PATH}/modifyUser`,{
            method: "POST", 
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(input_data)
           }); 
        
           const responseData = await response.json();
           if (responseData.message) {
            console.log('responseMessage', responseData.message );
            return responseData;
        }

        
    }catch(err){
        console.error(err);
        return(err);
    }
 }
 

 export const UserRepo = selector({
    key: "UserRepository",
    get: ({getCallback}) => {
        /////////////////////load Users /////////////////////////////
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
        /////////////////////modify User /////////////////////////////
        const modifyUser = getCallback(({set, snapshot}) => async (newUser) => {
            const input_json = JSON.stringify(newUser);
            console.log(`[ modifyCompany ] input : `, input_json);
            try{
                const response = await fetch(`${BASE_PATH}/modifyUser`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                if(data.message !== "success"){
                    console.log('\t[ modifyUser ] message:', data.message);
                    return false;
                };

                if(newUser.action_type === 'UPDATE'){
                    const currentUser = await snapshot.getPromise(atomCurrentUser);
                    delete newUser.action_type;
                    delete newUser.modify_user;
                    const modifiedUser = {
                        ...currentUser,
                        ...newUser
                    };
                    set(atomCurrentUser, modifiedUser);

                    console.log('modifiedUser', atomCurrentUser, modifiedUser);

                    return(true);

                    // const foundIdx = allCompany.findIndex(company => 
                    //     company.company_code === modifiedCompany.company_code);

                    // if(foundIdx !== -1){
                    //     const updatedAllCompanies = [
                    //         ...allCompany.slice(0, foundIdx),
                    //         modifiedCompany,
                    //         ...allCompany.slice(foundIdx + 1,),
                    //     ];
                    //     set(atomAllCompanies, updatedAllCompanies);
                    //     return true;
                    // } else {
                    //     console.log('\t[ modifyCompany ] No specified company is found');
                    //     return false;
                    // }
                }
            } catch(err){
                console.error(`\t[ modifyUser ] Error : ${err}`);
                return false;
            };
        });
        /////////////////////modify User /////////////////////////////
        const setCurrentUser = getCallback(({set, snapshot}) => async (userId) => {
            try{
                if(userId === undefined || userId === null) {
                    set(atomCurrentUser, defaultUser);
                    return;
                };
                const allUser = await snapshot.getPromise(atomCurrentUser);
                set(atomCurrentUser, allUser);

                //const selected_array = allUser.filter(user => user.userId === userId);
                //if(selected_array.length > 0){
                //    set(atomCurrentUser, selected_array[0]);
               // }
            }
            catch(err){
                console.error(`\t[ setCurrentUser ] Error : ${err}`);
            };
        });
        return {
            loadUsers,
            modifyUser,
            setCurrentUser
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
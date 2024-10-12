import React from 'react';
import { selector } from "recoil";
import { atomCurrentUser,
    defaultUser,
    atomAllUsers,
    atomCurrentModifyUser,
    atomFilteredUserArray,
    atomUserState,
    atomUsersForSelection,
    atomSalespersonsForSelection,
    atomEngineersForSelection
} from '../atoms/atomsUser';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const company_info = {
    company_code: '',
    business_registration_code: '106-86-26016',
    company_name: '노드데이타',
    ceo_name: '김신일',
    company_address: '서울특별시 금천구 가산디지털 1로 128 1811 (STX V-Tower)',
    business_type: '도소매서비스',
    business_item: '컴퓨터및주변기기, S/W개발, 공급, 자문',
};

export async function apiLoginValidate(userId, password) {
    try {
        const input_data = {
            userId: userId,
            password: password,
        };
        const response = await fetch(`${BASE_PATH}/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input_data)
        });
        let responseMessage = await response.json();
        responseMessage = { ...responseMessage };
        console.log('responseMessage', responseMessage);
        return (responseMessage);
    } catch (err) {
        console.error(err);
        return (err);
    }
}
export async function apiRegister(userId, userName, Email, password) {
    try {
        const input_data = {
            action_type: 'ADD',
            userId: userId,
            userName: userName,
            password: password,
            email: Email
        };
        const response = await fetch(`${BASE_PATH}/modifyUser`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input_data)
        });

        const responseData = await response.json();
        if (responseData.message) {
            console.log('responseMessage', responseData.message);
            return responseData;
        }


    } catch (err) {
        console.error(err);
        return (err);
    }
}

export const UserRepo = selector({
    key: "UserRepository",
    get: ({ getCallback }) => {
        /////////////////////try to load all Users /////////////////////////////
        const tryLoadAllUsers = getCallback(({ set, snapshot }) => async () => {
            const loadStates = await snapshot.getPromise(atomUserState);
            if((loadStates & 3) === 0){
                console.log('[tryLoadAllUsers] Try to load all users');
                set(atomUserState, (loadStates | 2));   // state : loading
                const ret = await loadAllUsers();
                if(ret){
                    // succeeded to load
                    set(atomUserState, (loadStates | 3));
                } else {
                    // failed to load
                    set(atomUserState, 0);
                };
            }
        });
        /////////////////////load all Users /////////////////////////////
        const loadAllUsers = getCallback(({ set }) => async () => {
            try {
                console.log('[UserRepository] Try loading all');
                const response = await fetch(`${BASE_PATH}/getallusers`);
                const data = await response.json();
                if (data.message) {
                    console.log('loadUsers message:', data.message);
                    set(atomAllUsers, []);
                    return false;
                }
                set(atomAllUsers, data);

                let filteredUsers = [];
                data.forEach(item => {
                    atomAllUsers[item.userId] = item;
                    filteredUsers.push(item);
                });
              
                set(atomFilteredUserArray, filteredUsers);

                //----- Store SR, AE data -----------------------------------
                const workingUsers = data.filter(user => user.isWork === 'Y');
                workingUsers.sort((a, b) => {
                    if (a.userName > b.userName) return 1;
                    if (a.userName < b.userName) return -1;
                    return 0;
                });
                set(atomUsersForSelection, workingUsers.map(user => ({ label: user.userName, value: user.userName })));
                const salespersons = workingUsers.filter(user => user.jobType === 'SR')
                    .map(user => ({ label: user.userName, value: user.userName }));
                set(atomSalespersonsForSelection, salespersons)
                const engineers = workingUsers.filter(user => user.jobType === 'AE')
                    .map(user => ({ label: user.userName, value: user.userName }));
                set(atomEngineersForSelection, engineers);
                return true;
            }
            catch (err) {
                console.error(`loadUsers / Error : ${err}`);
                return false;
            };
        });
        const filterUsers = getCallback(({set, snapshot }) => async (itemName, filterText) => {
            const allUserData = await snapshot.getPromise(atomAllUsers);
            const allUserList = Object.values(allUserData);
            let allUsers = [];

            if( itemName === 'common.all' ) {
                allUsers = allUserList.filter(item =>
                    (item.userName && item.userName.includes(filterText))
                    || (item.posoition && item.posoition.includes(filterText))
                    || (item.department && item.department.includes(filterText))
                    || (item.position && item.position.includes(filterText))
                    || (item.isWork && item.isWork.includes(filterText))
                    || (item.jobType && item.jobType.includes(filterText))
                );
            }else if(itemName === 'user.name' ){
                allUsers = allUserList.filter(item =>
                    (item.userName &&item.userName.includes(filterText))
                );
            }else if(itemName === 'user.department' ){
                allUsers = allUserList.filter(item =>
                    (item.department &&item.department.toLowerCase().includes(filterText.toLowerCase()))
                );  
            }else if(itemName === 'user.position' ){
                allUsers = allUserList.filter(item =>
                    (item.position &&item.position.includes(filterText))
                );
            }else if(itemName === 'user.is_work' ){
                allUsers = allUserList.filter(item =>
                    (item.isWork &&item.isWork.includes(filterText))
                );
            }else if(itemName === 'user.job_type' ){
                allUsers = allUserList.filter(item =>
                    (item.jobType &&item.jobType.includes(filterText))
                );
            }
            set(atomFilteredUserArray, allUsers);
            return true;
        });        
        /////////////////////load Users /////////////////////////////
        const loadUsers = getCallback(({ set }) => async (userId) => {
            try {
                const input_data = {
                    userId: userId,
                };
                const response = await fetch(`${BASE_PATH}/getuser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input_data)
                });

                const data = await response.json();
                if (data.message) {
                    console.log('loadUsers message:', data.message);
                    set(atomCurrentUser, []);
                    return;
                }
                set(atomCurrentUser, data);
            }
            catch (err) {
                console.error(`loadUsers / Error : ${err}`);
            };
        });
        /////////////////////modify User /////////////////////////////
        const modifyUser = getCallback(({ set, snapshot }) => async (newUser) => {
            const input_json = JSON.stringify(newUser);
            console.log(`[ modifyUser ] input : `, input_json);
            try {
                const response = await fetch(`${BASE_PATH}/modifyUser`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: input_json,
                });
                const data = await response.json();
                if (data.message !== "success") {
                    console.log('[modifyUser] rtn message:', data.message);
                    return  false;
                };

                if (newUser.action_type === 'UPDATE_PASSWORD') {
                    console.log('modified password', );
                    return true;
                }

                if (newUser.action_type === 'UPDATE') {
                    const currentUser = await snapshot.getPromise(atomCurrentUser);
                    delete newUser.action_type;
                    delete newUser.modify_user;
                    const modifiedUser = {
                        ...currentUser,
                        ...newUser
                    };
                   //  set(atomCurrentUser, modifiedUser);

                    // update all users
                    const allUsers = await snapshot.getPromise(atomAllUsers);
                    const foundIdx = allUsers.findIndex(user => user.userId === modifiedUser.userId);
                    if (foundIdx !== -1) {
                        const updatedAllUsers = [
                            ...allUsers.slice(0, foundIdx),
                            modifiedUser,
                            ...allUsers.slice(foundIdx + 1,),
                        ];
                        set(atomAllUsers, updatedAllUsers);
                    };
                    
                    //update filtered users 
                    const filteredUser = await snapshot.getPromise(atomFilteredUserArray);
                    const foundFilteredIdx = filteredUser.findIndex(user => user.userId === modifiedUser.userId);
                    if (foundIdx !== -1) {
                        const updatedAllUsers = [
                            ...filteredUser.slice(0, foundIdx),
                            modifiedUser,
                            ...filteredUser.slice(foundIdx + 1,),
                        ];
                        set(atomFilteredUserArray, updatedAllUsers);
                    };


                    if (modifiedUser.isWork === 'N') {
                        if (modifiedUser.jobType === 'SR') {
                            //update salespersons selection
                            const allSalesPersons = await snapshot.getPromise(atomSalespersonsForSelection);
                            const foundSalesIdx = allSalesPersons.findIndex(user => user.userId === modifiedUser.userId);
                            if (foundSalesIdx !== -1) {
                                const updatedSalesPersons = [
                                    ...allSalesPersons.slice(0, foundSalesIdx),
                                    ...allSalesPersons.slice(foundSalesIdx + 1,)
                                ];
                                set(atomSalespersonsForSelection, updatedSalesPersons);
                            };
                        } else if (modifiedUser.jobType === 'AE') {
                            //update engineers selection
                            const allEngineers = await snapshot.getPromise(atomEngineersForSelection);
                            const foundEngIdx = allEngineers.findIndex(user => user.userId === modifiedUser.userId);
                            if (foundEngIdx !== -1) {
                                const udpatedEngineers = [
                                    ...allEngineers.slice(0, foundEngIdx),
                                    ...allEngineers.slice(foundEngIdx + 1,),
                                ];
                                set(atomEngineersForSelection, udpatedEngineers);
                            };
                        };
                    } else {
                        if (modifiedUser.jobType === 'SR') {
                            //update salespersons selection
                            const allSalesPersons = await snapshot.getPromise(atomSalespersonsForSelection);
                            const foundSalesIdx = allSalesPersons.findIndex(user => user.userId === modifiedUser.userId);
                            if (foundSalesIdx === -1) {
                                set(atomSalespersonsForSelection, allSalesPersons.concat({ label: modifiedUser.userName, value: modifiedUser.userName }));
                            };
                        } else if (modifiedUser.jobType === 'AE') {
                            //update engineers selection
                            const allEngineers = await snapshot.getPromise(atomEngineersForSelection);
                            const foundEngIdx = allEngineers.findIndex(user => user.userId === modifiedUser.userId);
                            if (foundEngIdx === -1) {
                                set(atomEngineersForSelection, allEngineers.concat({ label: modifiedUser.userName, value: modifiedUser.userName }));
                            };
                        };
                    };

                    console.log('modifiedUser', atomCurrentUser, modifiedUser);

                    return (true);
                }
              
            } catch (err) {
                console.error(`\t[ modifyUser ] Error : ${err}`);
                return {'message':`\t[ modifyUser ] Error : ${err}`};
            };
        });
        /////////////////////modify User /////////////////////////////
        const setCurrentUser = getCallback(({ set, snapshot }) => async (userId) => {
            try {
                if (userId === undefined || userId === null) {
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
            catch (err) {
                console.error(`\t[ setCurrentUser ] Error : ${err}`);
            };
        });
        const setCurrentModifyUser = getCallback(({set, snapshot}) => async (userId) => {
            try{
                if(userId === undefined || userId === null) {
                    set(atomCurrentModifyUser, defaultUser);
                    return;
                };
                const allUsers = await snapshot.getPromise(atomAllUsers);

                const selected_array = allUsers.filter(user => user.userId === userId);
                if(selected_array.length > 0){
                    set(atomCurrentModifyUser, selected_array[0]);
                }

                //if(allUsers[userId]){
                //    set(atomCurrentModifyUser, allUsers[userId]);
                //} 
                console.log('setCurrentModifyUser',atomCurrentModifyUser, userId );
            }
            catch(err){
                console.error(`\t[ setCurrentCompany ] Error : ${err}`);
                set(atomCurrentModifyUser, defaultUser);
            };
        });        
        return {
            tryLoadAllUsers,
            loadUsers,
            modifyUser,
            setCurrentUser,
            loadAllUsers,
            filterUsers,
            setCurrentModifyUser
        };
    }
});


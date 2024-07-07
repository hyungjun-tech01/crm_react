import React from 'react';
import { selector } from "recoil";
import { atomAccountInfo, atomAccountState,defaultAccount } from '../atoms/atomsUser';

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const AccountRepo = selector({
    key: "AccountRepository",
    get: ({ getCallback }) => {
        /////////////////////load account /////////////////////////////
        const loadAccount = getCallback(({ set, snapshot }) => async () => {
            try {
                const response = await fetch(`${BASE_PATH}/getaccountinfo`);
                const data = await response.json();
                if (data.message) {
                    console.log('loadUsers message:', data.message);
                    set(atomAccountInfo, defaultAccount);
                    const loadStates = await snapshot.getPromise(atomAccountState);
                    set(atomAccountState, (loadStates & ~1));
                    return;
                }
                set(atomAccountInfo, data);

                //----- Change loading state -----------------------------------
                const loadStates = await snapshot.getPromise(atomAccountState);
                set(atomAccountState, (loadStates | 1));
            }
            catch (err) {
                console.error(`loadUsers / Error : ${err}`);
                const loadStates = await snapshot.getPromise(atomAccountState);
                set(atomAccountState, (loadStates & ~1));
            };
        });
        /////////////////////modify User /////////////////////////////
        const modifyAccount = getCallback(({ set, snapshot }) => async (newAccount) => {
            const input_json = JSON.stringify(newAccount);
            console.log(`[ modifyCompany ] input : `, input_json);
            try {
                const response = await fetch(`${BASE_PATH}/modifyUser`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: input_json,
                });
                const data = await response.json();
                if (data.message !== "success") {
                    console.log('\t[ modifyUser ] message:', data.message);
                    return false;
                };

                if (newAccount.action_type === 'UPDATE') {
                    const currentUser = await snapshot.getPromise(atomAccountInfo);
                    delete newAccount.action_type;
                    delete newAccount.modify_user;
                    const modifiedUser = {
                        ...currentUser,
                        ...newAccount
                    };
                    set(atomAccountInfo, modifiedUser);
                   
                    console.log('modifiedUser', atomAccountInfo, modifiedUser);
                    return true;
                }
            } catch (err) {
                console.error(`\t[ modifyUser ] Error : ${err}`);
                return false;
            };
        });
        return {
            loadAccount,
            modifyAccount,
        };
    }
});
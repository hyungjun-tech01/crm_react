import React from 'react';
import { selector } from "recoil";
import * as bootstrap from '../assets/js/bootstrap.bundle';
import { atomModalInfoStack } from '../atoms/atoms';

export const SettingsRepo = selector({
    key: "SettingsRepository",
    get: ({getCallback}) => {
        const openModal = getCallback(({ set, snapshot }) => async (modalId) => {
            const modalInfoStack = await snapshot.getPromise(atomModalInfoStack);
            if(modalInfoStack.length > 0){
                const lastModalId = modalInfoStack.at(-1);
                const lastModal = bootstrap.Modal.getInstance('#' + lastModalId);
                if(lastModal){
                    lastModal._focustrap.deactivate();
                };
            };
            if(modalId){
                if(modalId !== 'antModal'){
                    const myModal = new bootstrap.Modal(document.getElementById(modalId), {
                        keyboard: true,
                        focus: true,
                    });
                    if(myModal) myModal.show();
                }
                const updatedModalInfoStack = modalInfoStack.concat(modalId);
                console.log(' - Modals in Stack :', updatedModalInfoStack);
                set(atomModalInfoStack, updatedModalInfoStack);
            };
        });
        const closeModal = getCallback(({ set, snapshot }) => async () => {
            const modalInfoStack = await snapshot.getPromise(atomModalInfoStack);
            if(modalInfoStack.length > 0){
                const lastModalId = modalInfoStack.at(-1);
                const lastModal = bootstrap.Modal.getInstance('#'+lastModalId);
                console.log('closeModal / last modal : ', lastModal);
                
                if(lastModal){
                    lastModal.hide();
                };
                const updatedModalInfoStack = [ ...modalInfoStack.slice(0, -1)];
                if(updatedModalInfoStack.length > 0){
                    const nextLastModalId = updatedModalInfoStack.at(-1);
                    const nextLastModal = bootstrap.Modal.getInstance('#'+nextLastModalId);
                    if(nextLastModal){
                        nextLastModal._focustrap.activate();
                    };
                };
                console.log(' - Modals in Stack :', updatedModalInfoStack);
                set(atomModalInfoStack, updatedModalInfoStack);
            };
        });
        return {
            openModal,
            closeModal,
        }
    }
});
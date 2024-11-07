import React from 'react';
import { selector } from "recoil";
import * as bootstrap from '../assets/js/bootstrap.bundle';
import { atomModalInfoStack,
    atomCurrentCompany,
    defaultCompany,
    atomCurrentLead,
    defaultLead,
    atomCurrentConsulting,
    defaultConsulting,
    atomCurrentPurchase,
    defaultPurchase,
    atomCurrentQuotation,
    defaultQuotation,
    atomCurrentTaxInvoice,
    defaultTaxInvoice,
    atomCurrentTransaction,
    defaultTransaction
} from '../atoms/atoms';

const ANTD_MODAL = 'antModal';

export const SettingsRepo = selector({
    key: "SettingsRepository",
    get: ({getCallback}) => {
        const escapeKeyDownEvent = (event) => {
            if(event.key !== 'Escape') return;
            closeModal();
        };
        const openModal = getCallback(({ set, snapshot }) => async (modalId, command=null) => {
            if(!modalId) return;
            // console.log(' - Check input :', modalId);
            const modalInfoStack = await snapshot.getPromise(atomModalInfoStack);
            if(modalInfoStack.length > 0){
                const lastModalId = modalInfoStack.at(-1).id;
                const lastModal = bootstrap.Modal.getInstance('#' + lastModalId);
                if(lastModal){
                    lastModal._focustrap.deactivate();
                    const modalElement = document.getElementById(lastModalId);
                    if(modalElement) {
                        modalElement.removeEventListener('keydown', escapeKeyDownEvent);
                    };
                };
            };
            if(modalId !== ANTD_MODAL){
                const modalElement = document.getElementById(modalId);
                const myModal = new bootstrap.Modal(modalElement, {
                    backdrop: 'static',
                    keyboard: false,
                    focus: true,
                });
                if(myModal){
                    modalElement.addEventListener('keydown', escapeKeyDownEvent);
                    myModal.show();  
                };
            };
            const updatedModalInfoStack = modalInfoStack.concat({id:modalId, command:command});
            // console.log(' - Modals in Stack :', updatedModalInfoStack);
            set(atomModalInfoStack, updatedModalInfoStack);
        });
        const closeModal = getCallback(({ set, snapshot }) => async (command) => {
            let gottenCommand = null;
            const modalInfoStack = await snapshot.getPromise(atomModalInfoStack);
            if(modalInfoStack.length > 0){
                const lastModalId = modalInfoStack.at(-1).id;
                if(lastModalId !== ANTD_MODAL){
                    const lastModal = bootstrap.Modal.getInstance('#'+lastModalId);
                    if(!!lastModal){
                        const modalElement = document.getElementById(lastModalId);
                        if(modalElement) {
                            modalElement.removeEventListener('keydown', escapeKeyDownEvent);
                        };
                        lastModal.hide();
                    };
                    const lastModalCommand = modalInfoStack.at(-1).command;
                    if(!!lastModalCommand){
                        gottenCommand = lastModalCommand;
                    };
                }
                
                const updatedModalInfoStack = [ ...modalInfoStack.slice(0, -1)];
                if(updatedModalInfoStack.length > 0){
                    const nextLastModalId = updatedModalInfoStack.at(-1).id;
                    if(nextLastModalId !== ANTD_MODAL){
                        const nextLastModal = bootstrap.Modal.getInstance('#'+nextLastModalId);
                        if(nextLastModal){
                            nextLastModal._focustrap.activate();
                            const modalElement = document.getElementById(nextLastModalId);
                            if(modalElement) {
                                modalElement.addEventListener('keydown', escapeKeyDownEvent);
                            };
                        };
                    }
                };
                // console.log(' - Modals in Stack :', updatedModalInfoStack);
                set(atomModalInfoStack, updatedModalInfoStack);
            };
            if(command || gottenCommand){
                gottenCommand = command || gottenCommand;
                switch(gottenCommand){
                    case 'initialize_company':
                        set(atomCurrentCompany, defaultCompany);
                        break;
                    case 'initialize_lead':
                        set(atomCurrentLead, defaultLead);
                        break;
                    case 'initialize_consulting':
                        set(atomCurrentConsulting, defaultConsulting);
                        break;
                    case 'initialize_purchase':
                        set(atomCurrentPurchase, defaultPurchase);
                        break;
                    case 'initialize_quotation':
                        set(atomCurrentQuotation, defaultQuotation);
                        break;
                    case 'initialize_tax_invoice':
                        set(atomCurrentTaxInvoice, defaultTaxInvoice);
                        break;
                    case 'initialize_transaction':
                        set(atomCurrentTransaction, defaultTransaction);
                        break;
                    default:
                        console.log('Nothing is done');
                }
            }
        });
        return {
            openModal,
            closeModal,
        }
    }
});
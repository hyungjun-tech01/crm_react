import React from 'react';
import { atom } from 'recoil';

export const defaultCompany = {
    company: "",
    phone: "",
    billing: "",
    state: "",
    country: "",
    image : null,
};

export const atomCurrentCompany = atom({
    key: "currentCompany",
    default: defaultCompany,
});

export const atomAllCompanies = atom({
    key: "allCompany",
    default: [],
});
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";

const LeadPurchaseModel = () => {
    const { t } = useTranslation();
    const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
};

export default LeadPurchaseModel;
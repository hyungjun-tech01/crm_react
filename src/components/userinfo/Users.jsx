import React, {useEffect, useState, useCallback } from "react";
import {useRecoilValue} from "recoil";
import { useCookies } from "react-cookie";
import { UserRepo } from "../../repository/user";
import {atomCurrentUser} from "../../atoms/atomsUser.jsx";

const Users = () => {
    const currentUser = useRecoilValue(atomCurrentUser);
    const { loadUsers, setCurrentUser } = useRecoilValue(UserRepo);
    const [cookies] = useCookies([
      "myLationCrmUserId",
      "myLationCrmUserName",
      "myLationCrmAuthToken",
    ]);    
    useEffect(() => {
        if (currentUser.userId === "") {  
          loadUsers(cookies.myLationCrmUserId);
        }
    
      }, [currentUser, loadUsers]);    
    return (
        <div>
        <div>Users Management</div>
        <div>Users Management</div>
        </div>
    );
};
export default Users;
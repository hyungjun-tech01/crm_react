import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { Collapse } from "antd";
import { C_logo, C_logo2, CircleImg } from "../imagepath";
import { atomCurrentUser, defaultUser } from "../../atoms/atomsUser";
import { UserRepo } from "../../repository/user";
import DetailLabelItemChangePassword from "../../constants/DetailLabelItem";
import { useTranslation } from "react-i18next";

const ChangePassword = (props) => {

  const { inputPassword } = props;

  const { t } = useTranslation();

  const { Panel } = Collapse;
  const selectedUser = useRecoilValue(atomCurrentUser);
  const { modifyUser } = useRecoilValue(UserRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);

  const [ editedValues, setEditedValues ] = useState(null);
  const [ savedValues, setSavedValues ] = useState(null);
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);
  const [ establishDate, setEstablishDate ] = useState(new Date());
  const [ orgCloseDate, setOrgCloseDate ] = useState(null);
  const [ closeDate, setCloseDate ] = useState(new Date());
  const resetInputValueRef = useRef(null);  // resetInputValue 함수 참조


  console.log('savedValues', savedValues);
  console.log('editedValues',editedValues);

  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    console.log('start editedValues',editedValues);
    const tempEdited = {
      ...editedValues,
      [name]: selectedUser[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedUser]);

  const handleEditing = useCallback((e) => {
    console.log('editing editedValues',editedValues);
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {

    if(editedValues[name] === selectedUser[name]){
      const tempEdited = {
        ...editedValues,
      };
      delete tempEdited[name];
      setEditedValues(tempEdited);
      return;
    };

    const tempSaved = {
      ...savedValues,
      [name] : editedValues[name],
    }
    setSavedValues(tempSaved);  

    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited[name];
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, selectedUser]);

  

  // --- Funtions for Saving ---------------------------------
  const handleCheckSaved = useCallback((name) => {
    return savedValues !== null && name in savedValues;
  }, [savedValues]);

  const handleCancelSaved = useCallback((name) => {
    const tempSaved = {
      ...savedValues,
    };
    delete tempSaved[name];
    setSavedValues(tempSaved);
  }, [savedValues]);

  const handleSaveAll = useCallback(async () => {
    if(editedValues !== null
      && selectedUser
      && selectedUser !== defaultUser)
    {
      
      const temp_all_saved = {
        ...editedValues,
        action_type: "UPDATE_PASSWORD",
        modify_user: cookies.myLationCrmUserId,
        userId: selectedUser.userId,
      };

      console.log("confirm password", temp_all_saved.change_password);

      if(temp_all_saved.change_password === null || temp_all_saved.change_password === null|| temp_all_saved.change_password_confirm === null||
        temp_all_saved.change_password === '' || temp_all_saved.change_password === '' || temp_all_saved.change_password_confirm === '' ||
        temp_all_saved.change_password === undefined || temp_all_saved.change_password === undefined || temp_all_saved.change_password_confirm === undefined){
        
        alert(t('user.miss_password_item'));
        return;
      }

      if(temp_all_saved.change_password.length <= 4){
        alert(t('user.min_password_length'));
        return;
      }
      if(temp_all_saved.change_password !== temp_all_saved.change_password_confirm){
        alert(t('user.change_password_same'))
        return;
      }
     
      const res = await modifyUser(temp_all_saved);
      if (res) {
        alert('패스워드가 변경되었습니다.');
      } else {
        alert('패스워드 변경이 실패하였습니다.');
      }

    } else {
      console.log("[ CompanyDetailModel ] No saved data");
    };

    setEditedValues(null);
    setSavedValues(null);

    var changepassword1 = document.querySelector('[name="current_password"]');
    if (changepassword1) {
      changepassword1.value='';
    } else {
        console.error('changepassword1 not found');
    }    

    var changepassword2 = document.querySelector('[name="change_password"]');
    if (changepassword2) {
      changepassword2.value='';
    } else {
        console.error('changepassword2 not found');
    }    
    
    var changepassword3 = document.querySelector('[name="change_password_confirm"]');
    if (changepassword3) {
      changepassword3.value='';
    } else {
        console.error('changepassword3 not found');
    }    

   // setTimeout(() => {
      var closeButton = document.querySelector('#btn_change_password_close');
      if (closeButton) {
          closeButton.click();
      } else {
          console.error('Close button not found');
      }
 //   }, 100); // 모달이 렌더링될 시간을 준 후 시도  
      if (resetInputValueRef.current) {
        resetInputValueRef.current();  // inputValue를 빈 문자열로 설정
      }
  }, [cookies.myLationCrmUserId, modifyUser, savedValues,editedValues, selectedUser, resetInputValueRef]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);


    var changepassword1 = document.querySelector('[name="current_password"]');
    if (changepassword1) {
      changepassword1.value='';
    } else {
        console.error('changepassword1 not found');
    }    

    var changepassword2 = document.querySelector('[name="change_password"]');
    if (changepassword2) {
      changepassword2.value='';
    } else {
        console.error('changepassword2 not found');
    }    
    
    var changepassword3 = document.querySelector('[name="change_password_confirm"]');
    if (changepassword3) {
      changepassword3.value='';
    } else {
        console.error('changepassword3 not found');
    }        

    var closeButton = document.querySelector('#btn_change_password_close');
    if (closeButton) {
        closeButton.click();
    } else {
        console.error('Close button not found');
    }  

  }, []);

  // --- Funtions for Establishment Date ---------------------------------
  const handleStartEstablishDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      establishment_date: orgEstablishDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgEstablishDate]);
  const handleEstablishDateChange = useCallback((date) => {
    setEstablishDate(date);
  }, []);
  const handleEndEstablishDateEdit = useCallback(() => {
    if(establishDate !== orgEstablishDate) {
      const tempSaved = {
        ...savedValues,
        establishment_date : establishDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.establishDate;  
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgEstablishDate, establishDate]);

  // --- Funtions for Closure Date ---------------------------------
  const handleStartCloseDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      closure_date: orgCloseDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgCloseDate]);
  const handleCloseDateChange = useCallback((date) => {
    setCloseDate(date);
  }, []);
  const handleEndCloseDateEdit = useCallback(() => {
    if(closeDate !== orgCloseDate) {
      const tempSaved = {
        ...savedValues,
        closure_date : closeDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.closure_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgCloseDate, closeDate]);


useEffect(() => {
    // 모달이 열릴 때 editedValues와 savedValues를 초기화
    setEditedValues(null);
    setSavedValues(null);
}, []);

  // useEffect(() => {
  //   if (isModalOpen) {
  //     setEditedValues(null);
  //     setSavedValues(null);
  //     console.log('savedValues!', savedValues);
  //   }
  //  }, [isModalOpen]);

  return (
    <>
      <div
        className="modal right fade"
        id="change-password"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog" role="document">
          <button
            type="button"
            className="close md-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            {" "}
          </button>
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <div className="col-md-7 account d-flex">
                  <div className="company_img">
                    <img src={C_logo} alt="User" className="user-image" />
                  </div>
                  <div>
                    <p className="mb-0">UserInfo</p>
                    <span className="modal-title">
                      {selectedUser.userName}
                    </span>
                  </div>
                </div>
                <div className="col-md-5 text-end">
                  <ul className="list-unstyled list-style-none">
                    <li className="dropdown list-inline-item">
                      <br />
                      <Link
                        className="dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {" "}
                        Actions{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="btn-close xs-close"
                id = "btn_change_password_close"
                data-bs-dismiss="modal"
                onClick={handleCancelAll}
              />
            </div>
            <div className="modal-body">
              <div className="task-infos">
                <div className="tab-content">
                  <div className="tab-pane show active" id="task-details">
                    <div className="crms-tasks">
                      <div className="tasks__item crms-task-item active">
                        {/* <Collapse accordion expandIconPosition="end">
                          <Panel header="Organization Name" key="1"> */}
                            <table className="table">
                              <tbody>
                                <DetailLabelItemChangePassword
                                  defaultText=""
                                  saved={savedValues}
                                  name="current_password"
                                  type = "password"
                                  title= {t('user.current_password')}
                                  row_no={3}
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                  resetInputValue={resetInputValueRef}
                                />
                                <DetailLabelItemChangePassword
                                  defaultText=""
                                  saved={savedValues}
                                  name="change_password"
                                  type = "password"
                                  title= {t('user.change_password')}
                                  row_no={3}
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItemChangePassword
                                  defaultText=""
                                  saved={savedValues}
                                  name="change_password_confirm"
                                  type = "password"
                                  title= {t('user.change_password_confirm')}
                                  row_no={3}
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />          
                              </tbody>
                            </table>
                          {/* </Panel>
                        </Collapse> */}
                      </div>
                    </div>
                  </div>

                </div>
                { editedValues !== null && Object.keys(editedValues).length !== 0 &&
                  <div className="text-center py-3">
                    <button
                      type="button"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      onClick={handleSaveAll}
                    >
                      Save
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      onClick={handleCancelAll}
                    >
                      Cancel
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
          {/* modal-content */}
        </div>
        {/* modal-dialog */}
      </div>
    </>
  );
};

export default ChangePassword;

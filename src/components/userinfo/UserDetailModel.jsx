import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { Collapse } from "antd";
import { C_logo, C_logo2, CircleImg } from "../imagepath";
import { atomCurrentUser, defaultUser } from "../../atoms/atomsUser";
import { UserRepo } from "../../repository/user";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailDateItem from "../../constants/DetailDateItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import { useTranslation } from "react-i18next";

const UserDetailModel = () => {
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

  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedUser[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedUser]);

  const handleEditing = useCallback((e) => {
    console.log('editedValues',editedValues);
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

  const handleSaveAll = useCallback(() => {
    if(editedValues !== null
      && selectedUser
      && selectedUser !== defaultUser)
    {
      const temp_all_saved = {
        ...editedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        userId: selectedUser.userId,
      };
      console.log('temp_all_saved', temp_all_saved);
      if (modifyUser(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
      } else {
        console.error('Failed to modify company')
      }
    } else {
      console.log("[ CompanyDetailModel ] No saved data");
    };
    setEditedValues(null);
    setSavedValues(null);
  }, [cookies.myLationCrmUserId, modifyUser, savedValues,editedValues, selectedUser]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
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

  // useEffect(() => {
  //   console.log('[UserDetailModel] called!', selectedUser);
  //   setOrgEstablishDate(selectedCompany.establishment_date ? new Date(selectedCompany.establishment_date) : null);
  //   setOrgCloseDate(selectedCompany.closure_date ? new Date(selectedCompany.closure_date) : null);
  // }, [selectedCompany, savedValues]);

  useEffect(() => {
        // 모달 내부 페이지의 히스토리 상태 추가
        history.pushState({ modalInternal: true }, '', location.href);

        const handlePopState = (event) => {
          if (event.state && event.state.modalInternal) {
            // 뒤로 가기를 방지하기 위해 다시 히스토리를 푸시
            history.replaceState({ modalInternal: true }, '', location.href);
          }
        };
      
        // popstate 이벤트 리스너 추가 (중복 추가 방지)
        window.addEventListener('popstate', handlePopState);
      
},[]);

  return (
    <>
      <div
        className="modal right fade"
        id="user-detail"
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
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to="#">
                          Edit This Company
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Organization Image
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Delete This Organization
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Record Owner
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Generate Merge Document
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Print This Organization
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Task For Organization
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Event For Organization
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add Activity Set To Organization
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Contact For Organization
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Opportunity For Organization
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Opportunity For Organization
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Project For Organization
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="btn-close xs-close"
                data-bs-dismiss="modal"
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
                                <DetailLabelItem
                                  defaultText={selectedUser.userName}
                                  saved={savedValues}
                                  name="userName"
                                  title={ t('user.name')}
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedUser.department}
                                  saved={savedValues}
                                  name="department"
                                  title= {t('user.department')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                               <DetailLabelItem
                                  defaultText={selectedUser.position}
                                  saved={savedValues}
                                  name="position"
                                  title= {t('user.position')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />     
                                <DetailLabelItem
                                  defaultText={selectedUser.phoneNumber}
                                  saved={savedValues}
                                  name="phoneNumber"
                                  title= {t('user.phone')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />                                                                 
                                <DetailLabelItem
                                  defaultText={selectedUser.mobileNumber}
                                  saved={savedValues}
                                  name="mobileNumber"
                                  title= {t('user.mobile')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                               <DetailLabelItem
                                  defaultText={selectedUser.email}
                                  saved={savedValues}
                                  name="email"
                                  title= {t('user.e_mail')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />          
                                <DetailLabelItem
                                  defaultText={selectedUser.private_group}
                                  saved={savedValues}
                                  name="private_group"
                                  title= {t('user.private_group')}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                 <DetailTextareaItem
                                  defaultText={selectedUser.memo}
                                  saved={savedValues}
                                  name="memo"
                                  title= {t('user.memo')}
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

export default UserDetailModel;

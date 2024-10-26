import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import * as bootstrap from "../../assets/js/bootstrap.bundle";
import { defaultCompany } from "../../atoms/atoms";
import { defaultUser } from "../../atoms/atomsUser";
import {
  atomUserState,
  atomEngineersForSelection,
  atomSalespersonsForSelection,
} from "../../atoms/atomsUser";
import { CompanyRepo } from "../../repository/company";
import { UserRepo } from "../../repository/user";
import {
  option_locations,
  option_deal_type,
  option_industry_type,
  option_is_yn,
  option_job_type,
} from "../../constants/constants";

import AddBasicItem from "../../constants/AddBasicItem";
import AddAddressItem from "../../constants/AddAddressItem";
import MessageModal from "../../constants/MessageModal";

const UserAddModal = (props) => {
  const { init, handleInit } = props;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: "", message: "" });


  //===== [RecoilState] Related with Company ==========================================
  const { modifyCompany } = useRecoilValue(CompanyRepo);

  const { modifyUser } = useRecoilValue(UserRepo);


  //===== [RecoilState] Related with Users ============================================
  const userState = useRecoilValue(atomUserState);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);

  //===== Handles to edit 'CompanyAddModel' ===========================================
  const [companyChange, setCompanyChange] = useState({ ...defaultCompany });

  const [userChange, setUserChange] = useState({ ...defaultUser });

  const initializeUserTemplate = useCallback(() => {
    setUserChange({ ...defaultUser });
    document.querySelector("#add_new_user_form").reset();
  }, []);

  const handleItemChange = (e) => {
    const modifiedData = {
      ...userChange,
      [e.target.name]: e.target.value,
    };
    setUserChange(modifiedData);
  };

  const handleSelectChange = (name, selected) => {
    const modifiedData = {
      ...userChange,
      [name]: selected.value,
    };
    setUserChange(modifiedData);
  };

  const handleAddNewUser = () => {
    // Check data if they are available
    let numberOfNoInputItems = 0;
    let noUserId = false;
    if(!userChange.userId || userChange.userId === ""){
      numberOfNoInputItems++;
      noUserId = true;
    };
    let noUserName = false;
    if(!userChange.userName || userChange.userName === ""){
      numberOfNoInputItems++;
      noUserName = true;
    };
    let noPassword = false;
    if(!userChange.password || userChange.password === ""){
      numberOfNoInputItems++;
      noPassword = true;
    };
    let noIsWork = false;
    if(!userChange.isWork || userChange.isWork === ""){
      numberOfNoInputItems++;
      noIsWork = true;
    };
    let noUserRole = false;
    if(!userChange.userRole || userChange.userRole === ""){
      numberOfNoInputItems++;
      noUserRole = true;
    };
   

    if(numberOfNoInputItems > 0){
      const contents = (
        <>
          <p>하기 정보는 필수 입력 사항입니다.</p>
          { noUserId && <div> - 아이디</div> }
          { noUserName && <div> - 이름</div> }
          { noPassword && <div> - 비밀번호</div> }
          { noIsWork && <div> - 현재사원</div> }
          { noUserRole && <div> - 권한</div> }
        </>
      );
      const tempMsg = {
        title: t('comment.title_check'),
        message: contents,
      };
      setMessage(tempMsg);
      setIsMessageModalOpen(true);
      return;
    };

    const newUserData = {
      ...userChange,
      action_type: "ADD",
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewUser ]`, newUserData);
    // const result = modifyUser(newUserData);
    // result.then((res) => {
      if (modifyUser(newUserData)) {
        initializeUserTemplate();
        let thisModal = bootstrap.Modal.getInstance('#add_user');
        if (thisModal) thisModal.hide();
      } else {
        const tempMsg = {
          title: t('comment.title_check'),
          message: `${t('comment.msg_fail_save')} - 오류 이유 : ${res.data}`,
        };
        setMessage(tempMsg);
        setIsMessageModalOpen(true);
      }
  //  });
  };

  useEffect(() => {
    if (init && (userState & 1) === 1) {
      console.log("[CompanyAddModel] initialzie!");
      if (handleInit) handleInit(!init);
      setTimeout(() => {
        initializeUserTemplate();
      }, 500);
    }
  }, [userState, init]);

  if (init)
    return <div>&nbsp;</div>;

  return (
    <div
      className="modal right fade"
      id="add_user"
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
          <span aria-hidden="true">×</span>
        </button>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title text-center">
              <b>{t("user.new_user")}</b>
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <form id="add_new_user_form">
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("user.user_id")}
                      type="text"
                      name="userId"
                      defaultValue={userChange.userId}
                      required
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("user.name")}
                      type="text"
                      name="userName"
                      defaultValue={userChange.userName}
                      required
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("user.password")}
                      type="password"
                      name="password"
                      defaultValue={userChange.password}
                      required
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("user.mobile")}
                      type="text"
                      name="mobileNumber"
                      defaultValue={userChange.mobileNumber}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("user.phone")}
                      type="text"
                      name="phoneNumber"
                      defaultValue={userChange.phoneNumber}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("user.e_mail")}
                      type="text"
                      name="email"
                      defaultValue={userChange.email}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("user.department")}
                      type="text"
                      name="department"
                      defaultValue={userChange.department}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("user.position")}
                      type="text"
                      name="position"
                      defaultValue={userChange.position}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("user.private_group")}
                      type="text"
                      name="private_group"
                      defaultValue={userChange.private_group}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("user.memo")}
                      type="text"
                      name="memo"
                      defaultValue={userChange.memo}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("user.job_type")}
                      type="select"
                      name="jobType"
                      defaultValue={userChange.jobType}
                      options={option_job_type.ko}
                      onChange={handleSelectChange}
                    />
                    <AddBasicItem
                      title={t("user.is_work")}
                      type="select"
                      name="isWork"
                      defaultValue={userChange.isWork}
                      options={option_is_yn.ko}
                      required
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("user.user_role")}
                      type="text"
                      name="userRole"
                      defaultValue={userChange.userRole}
                      required
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="text-center py-3">
                    <button
                      type="button"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      onClick={handleAddNewUser}
                    >
                      {t("common.save")}
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      data-bs-dismiss="modal"
                      onClick={initializeUserTemplate}
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* modal-content */}
      </div>
      <MessageModal
        title={message.title}
        message={message.message}
        open={isMessageModalOpen}
        handleOk={() => setIsMessageModalOpen(false)}
      />
      {/* modal-dialog */}
    </div>
  );
};

export default UserAddModal;

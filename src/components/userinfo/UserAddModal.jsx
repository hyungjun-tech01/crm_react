import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import * as bootstrap from "../../assets/js/bootstrap.bundle";
import { defaultCompany } from "../../atoms/atoms";
import {
  atomUserState,
  atomEngineersForSelection,
  atomSalespersonsForSelection,
} from "../../atoms/atomsUser";
import { CompanyRepo } from "../../repository/company";
import {
  option_locations,
  option_deal_type,
  option_industry_type,
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


  //===== [RecoilState] Related with Users ============================================
  const userState = useRecoilValue(atomUserState);
  const engineersForSelection = useRecoilValue(atomEngineersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);

  //===== Handles to edit 'CompanyAddModel' ===========================================
  const [companyChange, setCompanyChange] = useState({ ...defaultCompany });

  const initializeCompanyTemplate = useCallback(() => {
    setCompanyChange({ ...defaultCompany });
    document.querySelector("#add_new_company_form").reset();
  }, []);

  const handleDateChange = (name, date) => {
    const modifiedData = {
      ...companyChange,
      [name]: date,
    };
    setCompanyChange(modifiedData);
  };

  const handleItemChange = (e) => {
    const modifiedData = {
      ...companyChange,
      [e.target.name]: e.target.value,
    };
    setCompanyChange(modifiedData);
  };

  const handleSelectChange = (name, selected) => {
    const modifiedData = {
      ...companyChange,
      [name]: selected.value,
    };
    setCompanyChange(modifiedData);
  };

  const handleAddNewCompany = () => {
    // Check data if they are available
    let numberOfNoInputItems = 0;
    let noCompanyName = false;
    if(!companyChange.company_name || companyChange.company_name === ""){
      numberOfNoInputItems++;
      noCompanyName = true;
    };
    let noCompanyAddress = false;
    if(!companyChange.company_address || companyChange.company_address === ""){
      numberOfNoInputItems++;
      noCompanyAddress = true;
    };
    let noCompanyFaxNumber = false;
    if(!companyChange.company_fax_number || companyChange.company_fax_number === ""){
      numberOfNoInputItems++;
      noCompanyFaxNumber = true;
    };
    let noCompanyHomepage = false;
    if(!companyChange.homepage || companyChange.homepage === ""){
      numberOfNoInputItems++;
      noCompanyHomepage = true;
    };
    let noCompanySiteId = false;
    if(!companyChange.site_id || companyChange.site_id === ""){
      numberOfNoInputItems++;
      noCompanySiteId = true;
    };
    let noSalesResource = false;
    if(!companyChange.sales_resource || companyChange.sales_resource === ""){
      numberOfNoInputItems++;
      noSalesResource = true;
    };

    if(numberOfNoInputItems > 0){
      const contents = (
        <>
          <p>하기 정보는 필수 입력 사항입니다.</p>
          { noCompanyName && <div> - 회사 이름</div> }
          { noCompanyAddress && <div> - 회사 주소</div> }
          { noCompanyFaxNumber && <div> - 회사 팩스 번호</div> }
          { noCompanyHomepage && <div> - 회사 홈페이지</div> }
          { noCompanySiteId && <div> - 회사 Site ID</div> }
          { noSalesResource && <div> - 담당 영업 사원</div> }
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

    const newComData = {
      ...companyChange,
      action_type: "ADD",
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewCompany ]`, newComData);
    const result = modifyCompany(newComData);
    result.then((res) => {
      if (res.result) {
        initializeCompanyTemplate();
        let thisModal = bootstrap.Modal.getInstance('#add_company');
        if (thisModal) thisModal.hide();
      } else {
        const tempMsg = {
          title: t('comment.title_check'),
          message: `${t('comment.msg_fail_save')} - 오류 이유 : ${res.data}`,
        };
        setMessage(tempMsg);
        setIsMessageModalOpen(true);
      }
    });
  };

  useEffect(() => {
    if (init && (userState & 1) === 1) {
      console.log("[CompanyAddModel] initialzie!");
      if (handleInit) handleInit(!init);
      setTimeout(() => {
        initializeCompanyTemplate();
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
              <b>{t("company.new_company")}</b>
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
                <form id="add_new_company_form">
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.company_name")}
                      type="text"
                      name="company_name"
                      defaultValue={companyChange.company_name}
                      required
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("company.company_name_en")}
                      type="text"
                      name="company_name_en"
                      defaultValue={companyChange.company_name_en}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.ceo_name")}
                      type="text"
                      name="ceo_name"
                      defaultValue={companyChange.ceo_name}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("company.business_registration_code")}
                      type="text"
                      name="business_registration_code"
                      defaultValue={companyChange.business_registration_code}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddAddressItem
                      title={t("company.address")}
                      key_address="company_address"
                      key_zip="company_zip_code"
                      required
                      edited={companyChange}
                      setEdited={setCompanyChange}
                    />
                    <AddBasicItem
                      title={t("company.phone_number")}
                      type="text"
                      name="company_phone_number"
                      defaultValue={companyChange.company_phone_number}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("lead.zip_code")}
                      type="text"
                      name="company_zip_code"
                      defaultValue={companyChange.company_zip_code}
                      required
                      disabled={true}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("company.fax_number")}
                      type="text"
                      name="company_fax_number"
                      defaultValue={companyChange.company_fax_number}
                      required
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.homepage")}
                      type="text"
                      name="homepage"
                      required
                      defaultValue={companyChange.homepage}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("company.company_scale")}
                      type="text"
                      name="company_scale"
                      defaultValue={companyChange.company_scale}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.deal_type")}
                      type="select"
                      name="deal_type"
                      defaultValue={companyChange.deal_type}
                      options={option_deal_type.ko}
                      onChange={handleSelectChange}
                    />
                    <AddBasicItem
                      title={t("company.industry_type")}
                      type="select"
                      name="industry_type"
                      defaultValue={companyChange.industry_type}
                      options={option_industry_type.ko}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.business_type")}
                      type="text"
                      name="business_type"
                      defaultValue={companyChange.business_type}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("company.business_item")}
                      type="text"
                      name="business_item"
                      defaultValue={companyChange.business_item}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.establishment_date")}
                      type="date"
                      name="establishment_date"
                      defaultValue={companyChange.establishment_date}
                      onChange={handleDateChange}
                    />
                    <AddBasicItem
                      title={t("common.site_id")}
                      type="text"
                      name="site_id"
                      defaultValue={companyChange.site_id}
                      required
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.account_code")}
                      type="text"
                      name="account_code"
                      defaultValue={companyChange.account_code}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("company.bank_name")}
                      type="text"
                      name="bank_name"
                      defaultValue={companyChange.bank_name}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.account_owner")}
                      type="text"
                      name="account_owner"
                      defaultValue={companyChange.account_owner}
                      onChange={handleItemChange}
                    />
                    <AddBasicItem
                      title={t("company.salesman")}
                      type="select"
                      name="sales_resource"
                      defaultValue={companyChange.sales_resource}
                      required
                      options={salespersonsForSelection}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("company.engineer")}
                      type="select"
                      name="application_engineer"
                      defaultValue={companyChange.application_engineer}
                      options={engineersForSelection}
                      onChange={handleSelectChange}
                    />
                    <AddBasicItem
                      title={t("common.location")}
                      type="select"
                      name="region"
                      options={option_locations.ko}
                      defaultValue={companyChange.region}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div className="form-group row">
                    <AddBasicItem
                      title={t("common.memo")}
                      type="textarea"
                      long
                      row_no={3}
                      name="memo"
                      defaultValue={companyChange.memo}
                      onChange={handleItemChange}
                    />
                  </div>
                  <div className="text-center py-3">
                    <button
                      type="button"
                      className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                      onClick={handleAddNewCompany}
                    >
                      {t("common.save")}
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      data-bs-dismiss="modal"
                      onClick={initializeCompanyTemplate}
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

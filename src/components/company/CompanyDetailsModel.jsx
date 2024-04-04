import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { Collapse } from "antd";
import { C_logo, C_logo2, CircleImg } from "../imagepath";
import { atomCurrentCompany, defaultCompany } from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailDateItem from "../../constants/DetailDateItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";

const CompanyDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany } = useRecoilValue(CompanyRepo);
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
      [name]: selectedCompany[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedCompany]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if(editedValues[name] === selectedCompany[name]){
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
  }, [editedValues, savedValues, selectedCompany]);

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
    if(savedValues !== null
      && selectedCompany
      && selectedCompany !== defaultCompany)
    {
      const temp_all_saved = {
        ...savedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        company_code: selectedCompany.company_code,
      };
      if (modifyCompany(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
      } else {
        console.error('Failed to modify company')
      }
    } else {
      console.log("[ CompanyDetailModel ] No saved data");
    };
    setEditedValues(null);
    setSavedValues(null);
  }, [cookies.myLationCrmUserId, modifyCompany, savedValues, selectedCompany]);

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

  useEffect(() => {
    console.log('[CompanyDetailsModel] called!');
    setOrgEstablishDate(selectedCompany.establishment_date ? new Date(selectedCompany.establishment_date) : null);
    setOrgCloseDate(selectedCompany.closure_date ? new Date(selectedCompany.closure_date) : null);
  }, [selectedCompany, savedValues]);

  return (
    <>
      <div
        className="modal right fade"
        id="company-details"
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
                    <p className="mb-0">Company</p>
                    <span className="modal-title">
                      {selectedCompany.company_name}
                    </span>
                    <span className="rating-star">
                      <i className="fa fa-star" aria-hidden="true" />
                    </span>
                    <span className="lock">
                      <i className="fa fa-lock" aria-hidden="true" />
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
            <div className="card due-dates">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <span>Title</span>
                    <p>Enquiry</p>
                  </div>
                  <div className="col">
                    <span>Companies</span>
                    <p>{selectedCompany.company_name}</p>
                  </div>
                  <div className="col">
                    <span>Phone</span>
                    <p>{selectedCompany.company_phone_number}</p>
                  </div>
                  <div className="col">
                    <span>Fax</span>
                    <p>{selectedCompany.company_fax_number}</p>
                  </div>
                  <div className="col">
                    <span>Contact owner</span>
                    <p>{selectedCompany.ceo_name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div className="task-infos">
                <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      to="#task-details"
                      data-bs-toggle="tab"
                    >
                      Details
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-related"
                      data-bs-toggle="tab"
                    >
                      Lead
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-related"
                      data-bs-toggle="tab"
                    >
                      Purchase
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-related"
                      data-bs-toggle="tab"
                    >
                      Quatation
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-related"
                      data-bs-toggle="tab"
                    >
                      Transaction
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-activity"
                      data-bs-toggle="tab"
                    >
                      Activity
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-news"
                      data-bs-toggle="tab"
                    >
                      News
                    </Link>
                  </li> */}
                </ul>
                <div className="tab-content">
                  <div className="tab-pane show active" id="task-details">
                    <div className="crms-tasks">
                      <div className="tasks__item crms-task-item active">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Organization Name" key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="company_name"
                                  title="Name"
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="company_name_eng"
                                  title="English Name"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                              </tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item active">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Organization Details" key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="group_"
                                  title="Group"
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="company_scale"
                                  title="Company Scale"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="deal_type"
                                  title="Deal Type"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="business_registration_code"
                                  title="Business Registration Code"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailDateItem
                                  saved={savedValues}
                                  name="establishment_date"
                                  title="Establishment Date"
                                  orgTimeData={orgEstablishDate}
                                  timeData={establishDate}
                                  timeDataChange={handleEstablishDateChange}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEstablishDateEdit}
                                  endEdit={handleEndEstablishDateEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailDateItem
                                  saved={savedValues}
                                  name="closure_date"
                                  title="Closure Date"
                                  orgTimeData={orgCloseDate}
                                  timeData={closeDate}
                                  timeDataChange={handleCloseDateChange}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartCloseDateEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndCloseDateEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="ceo_name"
                                  title="Ceo Name"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="business_type"
                                  title="Business Type"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="business_item"
                                  title="Business Item"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="industry_type"
                                  title="Industry Type"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                              </tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Organization Contact Details" key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="company_phone_number"
                                  title="Phone"
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="company_fax_number"
                                  title="Fax"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="homepage"
                                  title="Website"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                              </tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Address Information" key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="company_address"
                                  title="Address"
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="company_zip_code"
                                  title="Postal code"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                              </tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Additional Information" key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="account_code"
                                  title="Account Code"
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="bank_name"
                                  title="Bank Name"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="account_owner"
                                  title="Account Owner"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="sales_resource"
                                  title="Sales Resource"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="application_engineer"
                                  title="Application Engineer"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="region"
                                  title="Region"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                              </tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Memo" key="1">
                            <table className="table">
                              <tbody>
                                <DetailTextareaItem
                                  data_set={selectedCompany}
                                  saved={savedValues}
                                  name="memo"
                                  title="Memo"
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
                          </Panel>
                        </Collapse>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane task-related" id="task-related">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card bg-gradient-danger card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">
                              Companies
                            </h4>
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-gradient-info card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">Deals</h4>
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-gradient-success card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">
                              Projects
                            </h4>
                            <span>1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row pt-3">
                      <div className="col-md-4">
                        <div className="card bg-gradient-success card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">
                              Contacts
                            </h4>
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-gradient-danger card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">Notes</h4>
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-gradient-info card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">Files</h4>
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="crms-tasks p-2">
                        <div className="tasks__item crms-task-item active">
                          <Collapse accordion expandIconPosition="end">
                            <Panel header="Companies" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Company Name</th>
                                    <th>Phone</th>
                                    <th>Billing Country</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <Link to="#" className="avatar">
                                        <img alt="" src={C_logo2} />
                                      </Link>
                                      <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#company-details"
                                      >
                                        Clampett Oil and Gas Corp.
                                      </Link>
                                    </td>
                                    <td>8754554531</td>
                                    <td>United States</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <Link to="#" className="avatar">
                                        <img alt="" src={C_logo} />
                                      </Link>
                                      <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#company-details"
                                      >
                                        Acme Corporation
                                      </Link>
                                    </td>
                                    <td>8754554531</td>
                                    <td>United States</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                        <div className="tasks__item crms-task-item">
                          <Collapse accordion expandIconPosition="end">
                            <Panel header="Deals" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Deal Name</th>
                                    <th>Company</th>
                                    <th>User Responsible</th>
                                    <th>Deal Value</th>
                                    <th />
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Bensolet</td>
                                    <td>Globex</td>
                                    <td>John Doe</td>
                                    <td>USD $‎180</td>
                                    <td>
                                      <i
                                        className="fa fa-star"
                                        aria-hidden="true"
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Ansanio tech</td>
                                    <td>Lecto</td>
                                    <td>John Smith</td>
                                    <td>USD $‎180</td>
                                    <td>
                                      <i
                                        className="fa fa-star"
                                        aria-hidden="true"
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                        <div className="tasks__item crms-task-item">
                          <Collapse accordion expandIconPosition="end">
                            <Panel header="Projects" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Project Name</th>
                                    <th>Status</th>
                                    <th>User Responsible</th>
                                    <th>Date Created</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Wilmer Deluna</td>
                                    <td>Completed</td>
                                    <td>Williams</td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                        <div className="tasks__item crms-task-item">
                          <Collapse accordion expandIconPosition="end">
                            <Panel header="Contacts" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>phone</th>
                                    <th>Email</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Wilmer Deluna</td>
                                    <td>Call Enquiry</td>
                                    <td>987675656</td>
                                    <td>william@gmail.com</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>John Doe</td>
                                    <td>Enquiry</td>
                                    <td>987675656</td>
                                    <td>john@gmail.com</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                        <div className="tasks__item crms-task-item">
                          <Collapse accordion expandIconPosition="end">
                            <Panel header="Notes" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Size</th>
                                    <th>Category</th>
                                    <th>Date Added</th>
                                    <th>Added by</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Document</td>
                                    <td>50KB</td>
                                    <td>Email</td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td>John Doe</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Finance</td>
                                    <td>100KB</td>
                                    <td>Phone call</td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td>Smith</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                        <div className="tasks__item crms-task-item">
                          <Collapse accordion expandIconPosition="end">
                            <Panel header="Files" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Size</th>
                                    <th>Category</th>
                                    <th>Date Added</th>
                                    <th>Added by</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Document</td>
                                    <td>50KB</td>
                                    <td>Phone Enquiry</td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td>John Doe</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Finance</td>
                                    <td>100KB</td>
                                    <td>Email</td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td>Smith</td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Edit Link
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Delete Link
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="task-activity">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card bg-gradient-danger card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">
                              Total Activities
                            </h4>
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-gradient-info card-img-holder text-white h-100">
                          <div className="card-body">
                            <img
                              src={CircleImg}
                              className="card-img-absolute"
                              alt="circle"
                            />
                            <h4 className="font-weight-normal mb-3">
                              Last Activity
                            </h4>
                            <span>1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="crms-tasks  p-2">
                        <div className="tasks__item crms-task-item active">
                          <Collapse accordion expandIconPosition="end">
                            <Panel header="Upcoming Activity" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Type</th>
                                    <th>Activity Name</th>
                                    <th>Assigned To</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Meeting</td>
                                    <td>Call Enquiry</td>
                                    <td>John Doe</td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td>
                                      <label className="container-checkbox">
                                        <input
                                          type="checkbox"
                                          defaultChecked=""
                                        />
                                        <span className="checkmark" />
                                      </label>
                                    </td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Add New Task
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Add New Event
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Meeting</td>
                                    <td>Phone Enquiry</td>
                                    <td>David</td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td>
                                      <label className="container-checkbox">
                                        <input
                                          type="checkbox"
                                          defaultChecked=""
                                        />
                                        <span className="checkmark" />
                                      </label>
                                    </td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Add New Task
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Add New Event
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                        <div className="tasks__item crms-task-item">
                          <Collapse accordion expandIconPosition="end">
                            <Panel header="Past Activity" key="1">
                              <table className="table table-striped table-nowrap custom-table mb-0 datatable">
                                <thead>
                                  <tr>
                                    <th>Type</th>
                                    <th>Activity Name</th>
                                    <th>Assigned To</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Meeting</td>
                                    <td>Call Enquiry</td>
                                    <td>John Doe</td>
                                    <td>13-Jul-20 11:37 PM</td>
                                    <td>
                                      <label className="container-checkbox">
                                        <input
                                          type="checkbox"
                                          defaultChecked=""
                                        />
                                        <span className="checkmark" />
                                      </label>
                                    </td>
                                    <td className="text-center">
                                      <div className="dropdown dropdown-action">
                                        <Link
                                          to="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Add New Task
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Add New Event
                                          </Link>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Panel>
                          </Collapse>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="task-news">
                    <div className="row">
                      <div className="col-md-12">
                        <h4>News Items</h4>
                        <p>
                          Current news items about this Organization are sourced
                          from Google News
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                { savedValues !== null && Object.keys(savedValues).length !== 0 &&
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

export default CompanyDetailsModel;

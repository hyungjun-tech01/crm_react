import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { Collapse } from "antd";
import { C_logo, C_logo2, CircleImg } from "../imagepath";
import { atomCurrentPurchase, defaultPurchase } from "../../atoms/atoms";
import { PurchaseRepo } from "../../repository/purchase";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailDateItem from "../../constants/DetailDateItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";

const PurchaseDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedPurchase = useRecoilValue(atomCurrentPurchase);
  const { modifyPurchase } = useRecoilValue(PurchaseRepo);
  const [cookies] = useCookies(["myLationCrmUserId"]);

  const [editedValues, setEditedValues] = useState(null);
  const [savedValues, setSavedValues] = useState(null);

  const [orgDeliveryDate, setOrgDeliveryDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [orgContactDate, setOrgContactDate] = useState(null);
  const [contactDate, setContactDate] = useState(new Date());
  const [orgFinishDate, setOrgFinishDate] = useState(null);
  const [finishDate, setFinishDate] = useState(new Date());
  const [orgRegisterDate, setOrgRegisterDate] = useState(null);
  const [registerDate, setRegisterDate] = useState(new Date());

  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedPurchase[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedPurchase]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if (editedValues[name] === selectedPurchase[name]) {
      const tempEdited = {
        ...editedValues,
      };
      delete tempEdited[name];
      setEditedValues(tempEdited);
      return;
    }

    const tempSaved = {
      ...savedValues,
      [name]: editedValues[name],
    };
    setSavedValues(tempSaved);

    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited[name];
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, selectedPurchase]);

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
    if (
      savedValues !== null &&
      selectedPurchase &&
      selectedPurchase !== defaultPurchase
    ) {
      const temp_all_saved = {
        ...savedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        purchase_code: selectedPurchase.purchase_code,
      };
      if (modifyPurchase(temp_all_saved)) {
        console.log(`Succeeded to modify purchase`);
      } else {
        console.error("Failed to modify purchase");
      }
    } else {
      console.log("[ PurchaseDetailModel ] No saved data");
    }
    setEditedValues(null);
    setSavedValues(null);
  }, [
    cookies.myLationCrmUserId,
    modifyPurchase,
    savedValues,
    selectedPurchase,
  ]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
  }, []);

  // --- Funtions for Delivery Date ---------------------------------
  const handleStartDeliveryDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      deliveryment_date: orgDeliveryDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgDeliveryDate]);
  const handleDeliveryDateChange = useCallback((date) => {
    setDeliveryDate(date);
  }, []);
  const handleEndDeliveryDateEdit = useCallback(() => {
    if (deliveryDate !== orgDeliveryDate) {
      const tempSaved = {
        ...savedValues,
        deliveryment_date: deliveryDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.deliveryment_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgDeliveryDate, deliveryDate]);

  // --- Funtions for MA Contact Date ---------------------------------
  const handleStartContactDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      MA_contact_date: orgContactDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgContactDate]);
  const handleContactDateChange = useCallback((date) => {
    setContactDate(date);
  }, []);
  const handleEndContactDateEdit = useCallback(() => {
    if (contactDate !== orgContactDate) {
      const tempSaved = {
        ...savedValues,
        MA_contact_date: contactDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.MA_contact_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgContactDate, contactDate]);

  // --- Funtions for Finishment Date ---------------------------------
  const handleStartFinishDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      MA_finish_date: orgFinishDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgFinishDate]);
  const handleFinishDateChange = useCallback((date) => {
    setFinishDate(date);
  }, []);
  const handleEndFinishDateEdit = useCallback(() => {
    if(finishDate !== orgFinishDate) {
      const tempSaved = {
        ...savedValues,
        MA_finish_date : finishDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.MA_finish_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgFinishDate, finishDate]);

  // --- Funtions for Registerment Date ---------------------------------
  const handleStartRegisterDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      registration_date: orgRegisterDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgRegisterDate]);
  const handleRegisterDateChange = useCallback((date) => {
    setRegisterDate(date);
  }, []);
  const handleEndRegisterDateEdit = useCallback(() => {
    if(registerDate !== orgRegisterDate) {
      const tempSaved = {
        ...savedValues,
        registration_date : registerDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.registration_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgRegisterDate, registerDate]);

  useEffect(() => {
    console.log("[PurchaseDetailsModel] called!");
    setOrgDeliveryDate(
      selectedPurchase.delivery_date
        ? new Date(selectedPurchase.delivery_date)
        : null
    );
    setOrgContactDate(
      selectedPurchase.MA_contact_date
        ? new Date(selectedPurchase.MA_contact_date)
        : null
    );
    setOrgFinishDate(
      selectedPurchase.MA_finish_date
        ? new Date(selectedPurchase.MA_finish_date)
        : null
    );
    setOrgRegisterDate(
      selectedPurchase.registration_date
        ? new Date(selectedPurchase.registration_date)
        : null
    );
  }, [selectedPurchase, savedValues]);

  return (
    <>
      <div
        className="modal right fade"
        id="purchase-details"
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
                  <div className="purchase_img">
                    <img src={C_logo} alt="User" className="user-image" />
                  </div>
                  <div>
                    <p className="mb-0">Purchase</p>
                    <span className="modal-title">Detail Information</span>
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
                          Edit This Purchase
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
                    <p>{selectedPurchase.purchase_name}</p>
                  </div>
                  <div className="col">
                    <span>Phone</span>
                    <p>{selectedPurchase.purchase_phone_number}</p>
                  </div>
                  <div className="col">
                    <span>Fax</span>
                    <p>{selectedPurchase.purchase_fax_number}</p>
                  </div>
                  <div className="col">
                    <span>Contact owner</span>
                    <p>{selectedPurchase.ceo_name}</p>
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
                          <Panel header="Product" key="1">
                            <table className="table">
                              <tbody>{}</tbody>
                            </table>
                          </Panel>
                        </Collapse>
                      </div>
                      <div className="tasks__item crms-task-item active">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Deal" key="1">
                            <table className="table">
                              <tbody>
                                <DetailLabelItem
                                  defaultText={selectedPurchase.quantity}
                                  saved={savedValues}
                                  name="quantity"
                                  title="Quantity"
                                  no_border={true}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedPurchase.price}
                                  saved={savedValues}
                                  name="price"
                                  title="Price"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedPurchase.currency}
                                  saved={savedValues}
                                  name="currency"
                                  title="Currency"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailDateItem
                                  saved={savedValues}
                                  name="delivery_date"
                                  title="Delivery Date"
                                  orgTimeData={orgDeliveryDate}
                                  timeData={deliveryDate}
                                  timeDataChange={handleDeliveryDateChange}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartDeliveryDateEdit}
                                  endEdit={handleEndDeliveryDateEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailDateItem
                                  saved={savedValues}
                                  name="MA_contact_date"
                                  title="MA Contact Date"
                                  orgTimeData={orgContactDate}
                                  timeData={contactDate}
                                  timeDataChange={handleContactDateChange}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartContactDateEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndContactDateEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailDateItem
                                  saved={savedValues}
                                  name="MA_finish_date"
                                  title="MA Finish Date"
                                  orgTimeData={orgFinishDate}
                                  timeData={finishDate}
                                  timeDataChange={handleFinishDateChange}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartFinishDateEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndFinishDateEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedPurchase.register}
                                  saved={savedValues}
                                  name="register"
                                  title="Register"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailDateItem
                                  saved={savedValues}
                                  name="registration_date"
                                  title="Registration Date"
                                  orgTimeData={orgRegisterDate}
                                  timeData={finishDate}
                                  timeDataChange={handleRegisterDateChange}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartRegisterDateEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndRegisterDateEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailLabelItem
                                  defaultText={selectedPurchase.regcode}
                                  saved={savedValues}
                                  name="regcode"
                                  title="Registration Code"
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                                <DetailTextareaItem
                                  defaultText={selectedPurchase.purchase_memo}
                                  saved={savedValues}
                                  name="purchase_memo"
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
                      <div className="tasks__item crms-task-item">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Status" key="1">
                            <table className="table">
                              <tbody>
                                <DetailTextareaItem
                                  defaultText={selectedPurchase.status}
                                  saved={savedValues}
                                  name="status"
                                  title="Status"
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
                                    <th>Purchase Name</th>
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
                                        data-bs-target="#purchase-details"
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
                                        data-bs-target="#purchase-details"
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
                                    <th>Purchase</th>
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
                {savedValues !== null &&
                  Object.keys(savedValues).length !== 0 && (
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
                  )}
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

export default PurchaseDetailsModel;

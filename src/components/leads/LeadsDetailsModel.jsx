import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { CircleImg, SystemUser } from "../imagepath";
import { Collapse } from "antd";
import { atomCurrentLead, defaultLead } from "../../atoms/atoms";
import { KeyManForSelection, LeadRepo } from "../../repository/lead";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import DetailSelectItem from "../../constants/DetailSelectItem";

const LeadsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedLead = useRecoilValue(atomCurrentLead);
  const { modifyLead, setCurrentLead } = useRecoilValue(LeadRepo);
  const [cookies] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);

  const [ editedValues, setEditedValues ] = useState(null);
  const [ savedValues, setSavedValues ] = useState(null);

  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedLead[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedLead]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if(editedValues[name] === selectedLead[name]){
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
  }, [editedValues, selectedLead]);

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
      && selectedLead
      && selectedLead !== defaultLead)
    {
      const temp_all_saved = {
        ...savedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        lead_code: selectedLead.lead_code,
      };
      if (modifyLead(temp_all_saved)) {
        console.log(`Succeeded to modify lead`);
      } else {
        console.error('Failed to modify lead')
      }
    } else {
      console.log("[ LeadDetailModel ] No saved data");
    };
    setEditedValues(null);
    setSavedValues(null);
  }, [savedValues, selectedLead]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
  }, []);

  // --- Funtions for Select ---------------------------------
  const handleEndEditKeyMan = useCallback((value) => {
    console.log('handleEndEditKeyMan called! : ', value);
    const selected = value.value;

    if(editedValues.is_keyman === selected){
      const tempEdited = {
        ...editedValues,
      };
      delete tempEdited.is_keyman;
      setEditedValues(tempEdited);
      return;
    };

    console.log('handleEndEditKeyMan edited : ', editedValues.is_keyman);
    const tempSaved = {
      ...savedValues,
      is_keyman : selected,
    }
    setSavedValues(tempSaved); 

    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.is_keyman;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, selectedLead.is_keyman]);

  useEffect(() => {
    console.log('[LeadsDetailsModel] called!');
  }, [selectedLead, savedValues]);

  return (
    <>
      <div
        className="modal right fade"
        id="leads-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <div className="col-md-7 account d-flex">
                  <div className="company_img">
                    <img src={SystemUser} alt="User" className="user-image" />
                  </div>
                  <div>
                    <p className="mb-0">System User</p>
                    <span className="modal-title">{selectedLead.lead_name}</span>
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
                          Edit This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Lead Image
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Delete This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Email This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Clone This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Record Owner
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Generate Merge Document
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Lead to Contact
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Convert Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Print This Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Merge Into Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          SmartMerge Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add Activity Set To Lead
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Event For Lead
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
                onClick={()=>setCurrentLead()}
              />
            </div>
            <div className="card due-dates">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <span>Lead Status</span>
                    <p>Not Contacted</p>
                  </div>
                  <div className="col">
                    <span>Name</span>
                    <p>Anne Lynch</p>
                  </div>
                  <div className="col">
                    <span>Lead Source</span>
                    <p>Phone Enquiry</p>
                  </div>
                  <div className="col">
                    <span>Lead Rating</span>
                    <p>0</p>
                  </div>
                  <div className="col">
                    <span>Lead owner</span>
                    <p>John Doe</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <ul
                    className="cd-breadcrumb triangle nav nav-tabs w-100 crms-steps"
                    role="tablist"
                  >
                    <li role="presentation">
                      <Link
                        to="#not-contacted"
                        className="active"
                        aria-controls="not-contacted"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded="true"
                      >
                        <span className="octicon octicon-light-bulb" />
                        Not Contacted
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#attempted-contact"
                        aria-controls="attempted-contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                      >
                        <span className="octicon octicon-diff-added" />
                        Attempted Contact
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#contact"
                        aria-controls="contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                      >
                        <span className="octicon octicon-comment-discussion" />
                        Contact
                      </Link>
                    </li>
                    <li role="presentation" className="">
                      <Link
                        to="#converted"
                        aria-controls="contact"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                      >
                        <span className="octicon octicon-comment-discussion" />
                        Converted
                      </Link>
                    </li>
                    <li role="presentation" className="d-none">
                      <Link
                        to="#converted"
                        aria-controls="converted"
                        role="tab"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                      >
                        <span className="octicon octicon-verified" />
                        Converted
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="tab-content pipeline-tabs border-0">
                <div
                  role="tabpanel"
                  className="tab-pane active p-0"
                  id="not-contacted"
                >
                  <div className="">
                    <div className="task-infos">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            to="#not-contact-task-details"
                            data-bs-toggle="tab"
                          >
                            Details
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-related"
                            data-bs-toggle="tab"
                          >
                            Related
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#not-contact-task-activity"
                            data-bs-toggle="tab"
                          >
                            Activity
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane show active p-0"
                          id="not-contact-task-details"
                        >
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Lead Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="lead_name"
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
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="position"
                                        title="Title"
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="department"
                                        title="Department"
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="company_name"
                                        title="Organization"
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailSelectItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="is_keyman"
                                        title="Key Man"
                                        options={KeyManForSelection}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        endEdit={handleEndEditKeyMan}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="group_"
                                        title="Group"
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        data_set={selectedLead}
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
                                      <DetailLabelItem
                                        data_set={selectedLead}
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
                                        data_set={selectedLead}
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
                                      <tr>
                                        <td className="border-0">Lead Created</td>
                                        <td className="border-0">
                                          {new Date(selectedLead.create_date).toLocaleDateString('ko-KR', {year:"numeric", month: 'short', day:'numeric'})}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Contact Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="email"
                                        title="Email"
                                        no_border={true}
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="mobile_number"
                                        title="Mobile"
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="company_phone_number"
                                        title="Phone"
                                        checkEdit={handleCheckEditState}
                                        startEdit={handleStartEdit}
                                        editing={handleEditing}
                                        endEdit={handleEndEdit}
                                        checkSaved={handleCheckSaved}
                                        cancelSaved={handleCancelSaved}
                                      />
                                      <DetailLabelItem
                                        data_set={selectedLead}
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
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="homepage"
                                        title="Website"
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
                                <Panel header="Address Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailLabelItem
                                        data_set={selectedLead}
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
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="company_zip_code"
                                        title="Postal Code"
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
                                <Panel header="Status Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <DetailTextareaItem
                                        data_set={selectedLead}
                                        saved={savedValues}
                                        name="status"
                                        title="Status"
                                        row_no={2}
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
                        <div
                          className="tab-pane task-related p-0"
                          id="not-contact-task-related"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Notes
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
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Files
                                  </h4>
                                  <span>2</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="crms-tasks  p-2">
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
                                          <td>phone Call</td>
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
                                          <td>Enquiry</td>
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
                                          <td>Phone Enquiry</td>
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
                        <div
                          className="tab-pane p-0"
                          id="not-contact-task-activity"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Total Activities
                                  </h4>
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
                                    alt="circle-image"
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
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  role="tabpanel"
                  className="tab-pane p-0"
                  id="attempted-contact"
                >
                  <div>
                    <div className="task-infos">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            to="#attempted-task-details"
                            data-bs-toggle="tab"
                          >
                            Details
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#attempted-task-related"
                            data-bs-toggle="tab"
                          >
                            Related
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#attempted-task-activity"
                            data-bs-toggle="tab"
                          >
                            Activity
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane show active p-0"
                          id="attempted-task-details"
                        >
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Lead Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Record ID</td>
                                        <td>124192692</td>
                                      </tr>
                                      <tr>
                                        <td>Name</td>
                                        <td>Anny Lench</td>
                                      </tr>
                                      <tr>
                                        <td>Title</td>
                                        <td>VP of Sales</td>
                                      </tr>
                                      <tr>
                                        <td>Organization</td>
                                        <td>Howe-Blanda LLC</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Status</td>
                                        <td>OPEN - NotContacted</td>
                                      </tr>
                                      <tr>
                                        <td>User Responsible</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Link Email Address</td>
                                        <td>abc@gmail.com</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Created</td>
                                        <td>03-Jun-20 1:14 AM</td>
                                      </tr>
                                      <tr>
                                        <td>Date of Last Activity</td>
                                        <td>09/03/2000</td>
                                      </tr>
                                      <tr>
                                        <td>Date of Next Activity</td>
                                        <td>10/03/2000</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Rating</td>
                                        <td>0</td>
                                      </tr>
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
                                      <tr>
                                        <td>Email Address</td>
                                        <td>abc@gmail.com</td>
                                      </tr>
                                      <tr>
                                        <td>Email Opted Out</td>
                                        <td>Lorem</td>
                                      </tr>
                                      <tr>
                                        <td>Phone</td>
                                        <td>(406) 653-3860</td>
                                      </tr>
                                      <tr>
                                        <td>Mobile Phone</td>
                                        <td>9867656756</td>
                                      </tr>
                                      <tr>
                                        <td>Fax</td>
                                        <td>1234</td>
                                      </tr>
                                      <tr>
                                        <td>Website</td>
                                        <td>Lorem ipsum</td>
                                      </tr>
                                      <tr>
                                        <td>Industry</td>
                                        <td>lorem ipsum</td>
                                      </tr>
                                      <tr>
                                        <td>Number of Employees</td>
                                        <td>2</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Source</td>
                                        <td>Phone Enquiry</td>
                                      </tr>
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
                                      <tr>
                                        <td> Address</td>
                                        <td>
                                          1000 Escalon Street, Palo Alto, CA,
                                          94020, United States map
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Description Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Description</td>
                                        <td>
                                          Interested in model: Whirlygig T950{" "}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Tag Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Tag List</td>
                                        <td className="border-0">
                                          Lorem Ipsum
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel
                                  header="Lead Conversion Information"
                                  key="1"
                                >
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Converted Contact</td>
                                        <td>John Smith</td>
                                      </tr>
                                      <tr>
                                        <td>Converted Organization</td>
                                        <td>Claimpett Corp</td>
                                      </tr>
                                      <tr>
                                        <td>Converted Opportunity</td>
                                        <td>Lorem ipsum</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane task-related p-0"
                          id="attempted-task-related"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Notes
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
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Files
                                  </h4>
                                  <span>2</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="crms-tasks  p-2">
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
                                          <td>Phone Call</td>
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
                                          <td>Enquiry</td>
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
                        <div
                          className="tab-pane p-0"
                          id="attempted-task-activity"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Total Activities
                                  </h4>
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
                                    alt="circle-image"
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
                      </div>
                    </div>
                  </div>
                </div>
                <div role="tabpanel" className="tab-pane p-0" id="contact">
                  <div>
                    <div className="task-infos">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            to="#contact-task-details"
                            data-bs-toggle="tab"
                          >
                            Details
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#contact-task-related"
                            data-bs-toggle="tab"
                          >
                            Related
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#contact-task-activity"
                            data-bs-toggle="tab"
                          >
                            Activity
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane show active p-0"
                          id="contact-task-details"
                        >
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Lead Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Record ID</td>
                                        <td>124192692</td>
                                      </tr>
                                      <tr>
                                        <td>Name</td>
                                        <td>Anny Lench</td>
                                      </tr>
                                      <tr>
                                        <td>Title</td>
                                        <td>VP of Sales</td>
                                      </tr>
                                      <tr>
                                        <td>Organization</td>
                                        <td>Howe-Blanda LLC</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Status</td>
                                        <td>OPEN - NotContacted</td>
                                      </tr>
                                      <tr>
                                        <td>User Responsible</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Link Email Address</td>
                                        <td>abc@gmail.com</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Created</td>
                                        <td>03-Jun-20 1:14 AM</td>
                                      </tr>
                                      <tr>
                                        <td>Date of Last Activity</td>
                                        <td>09/02/2000</td>
                                      </tr>
                                      <tr>
                                        <td>Date of Next Activity</td>
                                        <td>07/02/2010</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Rating</td>
                                        <td>0</td>
                                      </tr>
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
                                      <tr>
                                        <td>Email Address</td>
                                        <td>abc@gmail.com</td>
                                      </tr>
                                      <tr>
                                        <td>Email Opted Out</td>
                                        <td>Lorem</td>
                                      </tr>
                                      <tr>
                                        <td>Phone</td>
                                        <td>(406) 653-3860</td>
                                      </tr>
                                      <tr>
                                        <td>Mobile Phone</td>
                                        <td>8987454554</td>
                                      </tr>
                                      <tr>
                                        <td>Fax</td>
                                        <td>1234</td>
                                      </tr>
                                      <tr>
                                        <td>Website</td>
                                        <td>google.com</td>
                                      </tr>
                                      <tr>
                                        <td>Industry</td>
                                        <td>IT</td>
                                      </tr>
                                      <tr>
                                        <td>Number of Employees</td>
                                        <td>2</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Source</td>
                                        <td>Phone Enquiry</td>
                                      </tr>
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
                                      <tr>
                                        <td> Address</td>
                                        <td>
                                          1000 Escalon Street, Palo Alto, CA,
                                          94020, United States map
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Description Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Description</td>
                                        <td>
                                          Interested in model: Whirlygig T950{" "}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Tag Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Tag List</td>
                                        <td className="border-0">
                                          Lorem Ipsum
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel
                                  header="Lead Conversion Information"
                                  key="1"
                                >
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Converted Contact</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Converted Organization</td>
                                        <td>Claimpett corp</td>
                                      </tr>
                                      <tr>
                                        <td>Converted Opportunity</td>
                                        <td>Lorem ipsum</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane task-related p-0"
                          id="not-contact-task-related"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Notes
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
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Files
                                  </h4>
                                  <span>2</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="crms-tasks  p-2">
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
                                          <td>phone Call</td>
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
                                          <td>Enquiry</td>
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
                                <div className="accordion-header js-accordion-header">
                                  Files{" "}
                                </div>
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
                                          <td>Phone Enquiry</td>
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
                        <div
                          className="tab-pane p-0"
                          id="not-contact-task-activity"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Total Activities
                                  </h4>
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
                                    alt="circle-image"
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
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  role="tabpanel"
                  className="tab-pane p-0"
                  id="attempted-contact"
                >
                  <div>
                    <div className="task-infos">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            to="#attempted-task-details"
                            data-bs-toggle="tab"
                          >
                            Details
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#attempted-task-related"
                            data-bs-toggle="tab"
                          >
                            Related
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#attempted-task-activity"
                            data-bs-toggle="tab"
                          >
                            Activity
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane show active p-0"
                          id="attempted-task-details"
                        >
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Lead Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Record ID</td>
                                        <td>124192692</td>
                                      </tr>
                                      <tr>
                                        <td>Name</td>
                                        <td>Anny Lench</td>
                                      </tr>
                                      <tr>
                                        <td>Title</td>
                                        <td>VP of Sales</td>
                                      </tr>
                                      <tr>
                                        <td>Organization</td>
                                        <td>Howe-Blanda LLC</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Status</td>
                                        <td>OPEN - NotContacted</td>
                                      </tr>
                                      <tr>
                                        <td>User Responsible</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Link Email Address</td>
                                        <td>abc@gmail.com</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Created</td>
                                        <td>03-Jun-20 1:14 AM</td>
                                      </tr>
                                      <tr>
                                        <td>Date of Last Activity</td>
                                        <td>09/03/2000</td>
                                      </tr>
                                      <tr>
                                        <td>Date of Next Activity</td>
                                        <td>10/03/2000</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Rating</td>
                                        <td>0</td>
                                      </tr>
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
                                      <tr>
                                        <td>Email Address</td>
                                        <td>abc@gmail.com</td>
                                      </tr>
                                      <tr>
                                        <td>Email Opted Out</td>
                                        <td>Lorem</td>
                                      </tr>
                                      <tr>
                                        <td>Phone</td>
                                        <td>(406) 653-3860</td>
                                      </tr>
                                      <tr>
                                        <td>Mobile Phone</td>
                                        <td>9867656756</td>
                                      </tr>
                                      <tr>
                                        <td>Fax</td>
                                        <td>1234</td>
                                      </tr>
                                      <tr>
                                        <td>Website</td>
                                        <td>Lorem ipsum</td>
                                      </tr>
                                      <tr>
                                        <td>Industry</td>
                                        <td>lorem ipsum</td>
                                      </tr>
                                      <tr>
                                        <td>Number of Employees</td>
                                        <td>2</td>
                                      </tr>
                                      <tr>
                                        <td>Lead Source</td>
                                        <td>Phone Enquiry</td>
                                      </tr>
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
                                      <tr>
                                        <td> Address</td>
                                        <td>
                                          1000 Escalon Street, Palo Alto, CA,
                                          94020, United States map
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Description Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Description</td>
                                        <td>
                                          Interested in model: Whirlygig T950{" "}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <div className="accordion-header js-accordion-header">
                                Tag Information
                              </div>
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Tag Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Tag List</td>
                                        <td className="border-0">
                                          Lorem Ipsum
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel
                                  header="Lead Conversion Information"
                                  key="1"
                                >
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td>Converted Contact</td>
                                        <td>John Smith</td>
                                      </tr>
                                      <tr>
                                        <td>Converted Organization</td>
                                        <td>Claimpett Corp</td>
                                      </tr>
                                      <tr>
                                        <td>Converted Opportunity</td>
                                        <td>Lorem ipsum</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane task-related p-0"
                          id="attempted-task-related"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Notes
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
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Files
                                  </h4>
                                  <span>2</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="crms-tasks  p-2">
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
                                          <td>Phone Call</td>
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
                                          <td>Enquiry</td>
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
                        <div
                          className="tab-pane p-0"
                          id="attempted-task-activity"
                        >
                          <div className="row">
                            <div className="col-md-4">
                              <div className="card bg-gradient-danger card-img-holder text-white h-100">
                                <div className="card-body">
                                  <img
                                    src={CircleImg}
                                    className="card-img-absolute"
                                    alt="circle-image"
                                  />
                                  <h4 className="font-weight-normal mb-3">
                                    Total Activities
                                  </h4>
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
                                    alt="circle-image"
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
                      </div>
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
          {/* modal-content */}
        </div>
        {/* modal-dialog */}
      </div>
    </>
  );
};

export default LeadsDetailsModel;

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { CircleImg, SystemUser } from "../imagepath";
import { Collapse } from "antd";
import { Edit, SaveAlt } from "@mui/icons-material";
import { atomCurrentConsulting, defaultConsulting } from "../../atoms/atoms";
import { ConsultingRepo } from "../../repository/consulting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ConsultingsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedConsulting = useRecoilValue(atomCurrentConsulting);
  const { modifyConsulting } = useRecoilValue(ConsultingRepo);
  const [editedValues, setEditedValues] = useState(null);
  const [cookies] = useCookies(["myLationCrmUserName"]);

  const [ receiptTime, setReceiptTime ] = useState(new Date());

  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const temp_value = {
      ...editedValues,
      [name]: null,
    };
    setEditedValues(temp_value);
  }, [editedValues]);

  const handleEditing = useCallback((e) => {
    const temp_value = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(temp_value);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if (editedValues[name]) {
      if(editedValues[name] === selectedConsulting[name]){
        const tempValue = {
          ...editedValues,
        };
        delete tempValue[name];
        setEditedValues(tempValue);
        return;
      };

      if (modifyConsulting(editedValues)) {
        console.log(`Succeeded to modify: ${name}`);
        const tempValue = {
          ...editedValues,
        };
        delete tempValue[name];
        setEditedValues(tempValue);
      } else {
        console.alert("Fail to change value");
        const tempValue = {
          ...editedValues,
        };
        delete tempValue[name];
        setEditedValues(tempValue);
      }
    } else {
      const tempValue = {
        ...editedValues,
      };
      delete tempValue[name];
      setEditedValues(tempValue);
    }
  }, [editedValues, selectedConsulting]);

  // --- Funtions for Editing ---------------------------------
  const handleReceiptTimeChange = useCallback((time) => {
    setReceiptTime(time);
  }, []);

  useEffect(() => {
    if (editedValues === null) {
      const tempValues = {
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserName,
      };
      setEditedValues(tempValues);
    };
    if (selectedConsulting && (selectedConsulting !== defaultConsulting)) {
      const tempValues = {
        ...editedValues,
        consulting_code: selectedConsulting.consulting_code,
      };
      setEditedValues(tempValues);

      // Set time from selected consulting data
      let input_time = new Date();
      if(selectedConsulting.receipt_date !== null)
      {
        input_time.setTime(Date.parse(selectedConsulting.receipt_date));

        if(selectedConsulting.receipt_time !== null
          && selectedConsulting.receipt_time !== '')
        {
          let converted_time = '';
          const splitted = selectedConsulting.receipt_time.split(' ');
          if(splitted.length === 2) {
            if(splitted[0] === '오전'){
              converted_time = splitted[1] + ' AM';
            } else if(splitted[0] === '오후'){
              converted_time = splitted[1] + ' PM';
            }
          };

          if(converted_time !==''){
            const str_ymd = input_time.toLocaleDateString('ko-KR', {year: 'numeric', month: 'numeric', day: 'numeric'})
              + ' ' + converted_time;
            if(str_ymd !== NaN){
              input_time.setTime(Date.parse(str_ymd));
            }
          }
        }
        setReceiptTime(input_time);
      };
    }
  }, [cookies.myLationCrmUserName, selectedConsulting]);

  return (
    <>
      <div
        className="modal right fade"
        id="consultings-details"
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
                    <span className="modal-title">{' '}</span>
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
                          Edit This Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Consulting Image
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Delete This Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Email This Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Clone This Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Record Owner
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Generate Merge Document
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Consulting to Contact
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Convert Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Print This Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Merge Into Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          SmartMerge Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add Activity Set To Consulting
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Event For Consulting
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
                    <span>Consulting Status</span>
                    <p>Not Contacted</p>
                  </div>
                  <div className="col">
                    <span>Name</span>
                    <p>Anne Lynch</p>
                  </div>
                  <div className="col">
                    <span>Consulting Source</span>
                    <p>Phone Enquiry</p>
                  </div>
                  <div className="col">
                    <span>Consulting Rating</span>
                    <p>0</p>
                  </div>
                  <div className="col">
                    <span>Consulting owner</span>
                    <p>John Doe</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              {/* <div className="row">
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
              </div> */}
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
                                <Panel header="Consulting Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Type</td>
                                        { handleCheckEditState("consulting_type") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Consulting Type"
                                                name="consulting_type"
                                                defaultValue={selectedConsulting.consulting_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleEndEdit("consulting_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td className="border-0">
                                              {selectedConsulting.consulting_type}
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleStartEdit("consulting_type");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Receipt Time</td>
                                        { handleCheckEditState("receipt_date") ? (
                                          <>
                                            <td>
                                              <DatePicker
                                                className="form-control"
                                                selected={ receiptTime }
                                                onChange={ handleReceiptTimeChange }
                                                dateFormat="yyyy-MM-dd"
                                                showTimeSelect
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("receipt_date");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td>
                                              {receiptTime.toLocaleDateString('ko-KR', {
                                                year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
                                              })}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("receipt_date");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Receiver</td>
                                        { handleCheckEditState("receiver") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Receiver"
                                                name="receiver"
                                                defaultValue={selectedConsulting.receiver}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("receiver");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.receiver}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("receiver");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Product Type</td>
                                        { handleCheckEditState("product_type") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Product Type"
                                                name="product_type"
                                                defaultValue={selectedConsulting.product_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("product_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.product_type}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("product_type");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Lead Time</td>
                                        { handleCheckEditState("lead_time") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Lead Time"
                                                name="lead_time"
                                                defaultValue={selectedConsulting.lead_time}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("lead_time");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.lead_time}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("lead_time");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Request Type</td>
                                        { handleCheckEditState("request_type") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Request Type"
                                                name="request_type"
                                                defaultValue={selectedConsulting.request_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("request_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.request_type}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("request_type");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Request Content</td>
                                        {handleCheckEditState("request_content") ? (
                                          <>
                                            <td className="border-0">
                                              <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Request Content"
                                                defaultValue={selectedConsulting.request_content}
                                                name="request_content"
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("request_content");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.request_content}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("request_content");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Action Content</td>
                                        {handleCheckEditState("action_content") ? (
                                          <>
                                            <td>
                                              <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Action Content"
                                                defaultValue={selectedConsulting.action_content}
                                                name="action_content"
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("action_content");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.action_content}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("action_content");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Sales Representative</td>
                                        {handleCheckEditState("sales_representati") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Request Type"
                                                name="Sales Representative"
                                                defaultValue={selectedConsulting.sales_representati}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("sales_representati");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.sales_representati}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("sales_representati");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      {/* <tr>
                                        <td>Status</td>
                                        {handleCheckEditState("status") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Status"
                                                name="status"
                                                defaultValue={selectedConsulting.status}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("status");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.status}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("status");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr> */}
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Lead Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Lead Name</td>
                                        { handleCheckEditState("lead_name") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Lead Name"
                                                name="lead_name"
                                                defaultValue={selectedConsulting.lead_name}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleEndEdit("lead_name");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td className="border-0">
                                              {selectedConsulting.lead_name}
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleStartEdit("lead_name");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Department</td>
                                        { handleCheckEditState("department") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Department"
                                                name="department"
                                                defaultValue={selectedConsulting.department}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("department");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.department}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("department");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Position</td>
                                        { handleCheckEditState("position") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Position"
                                                name="position"
                                                defaultValue={selectedConsulting.position}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("position");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.position}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("position");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Mobile</td>
                                        { handleCheckEditState("mobile_number") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Mobile"
                                                name="mobile_number"
                                                defaultValue={selectedConsulting.mobile_number}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("mobile_number");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.mobile_number}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("mobile_number");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Phone</td>
                                        { handleCheckEditState("phone_number") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Phone"
                                                name="phone_number"
                                                defaultValue={selectedConsulting.phone_number}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("phone_number");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.phone_number}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("phone_number");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Email</td>
                                        { handleCheckEditState("email") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Email"
                                                name="email"
                                                defaultValue={selectedConsulting.email}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("email");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedConsulting.email}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("email");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    </tbody>
                                  </table>
                                </Panel>
                              </Collapse>
                            </div>
                            <div className="tasks__item crms-task-item">
                              <Collapse accordion expandIconPosition="end">
                                <Panel header="Company Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Organization</td>
                                        { handleCheckEditState("company_name") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Organization"
                                                name="company_name"
                                                defaultValue={selectedConsulting.company_name}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleEndEdit("company_name");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td className="border-0">
                                              {selectedConsulting.company_name}
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleStartEdit("company_name");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
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
                                      <tr>
                                        <td className="border-0">Status</td>
                                        {handleCheckEditState("status") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Status"
                                                defaultValue={selectedConsulting.status}
                                                name="status"
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleEndEdit("status");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td className="border-0">
                                              {selectedConsulting.status}
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleStartEdit("status");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
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
                                <Panel header="Consulting Information" key="1">
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
                                        <td>Consulting Status</td>
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
                                        <td>Consulting Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Consulting Created</td>
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
                                        <td>Consulting Rating</td>
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
                                        <td>Consulting Source</td>
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
                                  header="Consulting Conversion Information"
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
                                <Panel header="Consulting Information" key="1">
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
                                        <td>Consulting Status</td>
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
                                        <td>Consulting Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Consulting Created</td>
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
                                        <td>Consulting Rating</td>
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
                                        <td>Consulting Source</td>
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
                                  header="Consulting Conversion Information"
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
                                <Panel header="Consulting Information" key="1">
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
                                        <td>Consulting Status</td>
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
                                        <td>Consulting Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Consulting Created</td>
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
                                        <td>Consulting Rating</td>
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
                                        <td>Consulting Source</td>
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
                                  header="Consulting Conversion Information"
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
            </div>
          </div>
          {/* modal-content */}
        </div>
        {/* modal-dialog */}
      </div>
    </>
  );
};

export default ConsultingsDetailsModel;

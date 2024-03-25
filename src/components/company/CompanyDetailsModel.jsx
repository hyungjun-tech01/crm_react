import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useRecoilValue } from "recoil";
import { Collapse } from "antd";
import { Edit, SaveAlt } from "@mui/icons-material";
import { C_logo, C_logo2, CircleImg } from "../imagepath";
import { atomCurrentCompany, defaultCompany } from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";

const CompanyDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany } = useRecoilValue(CompanyRepo);
  const [editedValues, setEditedValues] = useState(null);
  const [cookies] = useCookies(["myLationCrmUserName"]);

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
      if(editedValues[name] === selectedCompany[name]){
        const tempValue = {
          ...editedValues,
        };
        delete tempValue[name];
        setEditedValues(tempValue);
        return;
      };

      if (modifyCompany(editedValues)) {
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
  }, [editedValues, selectedCompany]);

  useEffect(() => {
    if (editedValues === null){
      const tempValues = {
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserName,
      };
      setEditedValues(tempValues);
    };
    if(selectedCompany && selectedCompany !== defaultCompany){
      const tempValues = {
        ...editedValues,
        company_code: selectedCompany.company_code,
      };
      setEditedValues(tempValues);
    }
  }, [cookies.myLationCrmUserName, selectedCompany]);

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
                                <tr>
                                  <td className="border-0">
                                    Organization Name
                                  </td>
                                  {handleCheckEditState("company_name") ? (
                                    <>
                                      <td className="border-0">
                                        <input
                                          type="text"
                                          placeholder="Organization Name"
                                          name="company_name"
                                          defaultValue={selectedCompany.company_name}
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
                                        {selectedCompany.company_name}
                                      </td>
                                      <td className="border-0">
                                        <div onClick={() => {handleStartEdit("company_name");}}>
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>English Organization Name</td>
                                  {handleCheckEditState("company_name_eng") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="English Organization Name"
                                          name="company_name_eng"
                                          defaultValue={selectedCompany.company_name_eng}
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div onClick={() => {handleEndEdit("company_name_eng");}}>
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>
                                        {selectedCompany.company_name_eng}
                                      </td>
                                      <td>
                                        <div onClick={() => {handleStartEdit("company_name_eng");}}>
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
                      <div className="tasks__item crms-task-item active">
                        <Collapse accordion expandIconPosition="end">
                          <Panel header="Organization Details" key="1">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="border-0">Group</td>
                                  {handleCheckEditState("group_") ? (
                                    <>
                                      <td className="border-0">
                                        <input
                                          type="text"
                                          placeholder="Group"
                                          name="group_"
                                          defaultValue={selectedCompany.group_}
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td className="border-0">
                                        <div
                                          onClick={() => {
                                            handleEndEdit("group_");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="border-0">
                                        {selectedCompany.group_}
                                      </td>
                                      <td className="border-0">
                                        <div
                                          onClick={() => {
                                            handleStartEdit("group_");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Organization Scale</td>
                                  {handleCheckEditState("company_scale") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Organization Scale"
                                          name="company_scale"
                                          defaultValue={
                                            selectedCompany.company_scale
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("company_scale");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.company_scale}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("company_scale");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Deal Type</td>
                                  {handleCheckEditState("deal_type") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Deal Type"
                                          name="deal_type"
                                          defaultValue={
                                            selectedCompany.deal_type
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("deal_type");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.deal_type}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("deal_type");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Bussiness Registration Code</td>
                                  {handleCheckEditState(
                                    "business_registration_code"
                                  ) ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Bussiness Registration Code"
                                          name="business_registration_code"
                                          defaultValue={
                                            selectedCompany.business_registration_code
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit(
                                              "business_registration_code"
                                            );
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>
                                        {
                                          selectedCompany.business_registration_code
                                        }
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit(
                                              "business_registration_code"
                                            );
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Establishment Date</td>
                                  {handleCheckEditState(
                                    "establishment_date"
                                  ) ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Establishment Date"
                                          name="establishment_date"
                                          defaultValue={
                                            selectedCompany.establishment_date
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("establishment_date");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>
                                        {selectedCompany.establishment_date}
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit(
                                              "establishment_date"
                                            );
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Closure Date</td>
                                  {handleCheckEditState("closure_date") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Closure Date"
                                          name="closure_date"
                                          defaultValue={
                                            selectedCompany.closure_date
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("closure_date");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.closure_date}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("closure_date");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>CEO Name</td>
                                  {handleCheckEditState("ceo_name") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="CEO Name"
                                          name="ceo_name"
                                          defaultValue={
                                            selectedCompany.ceo_name
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("ceo_name");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.ceo_name}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("ceo_name");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Bussiness Type</td>
                                  {handleCheckEditState("business_type") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Bussiness Type"
                                          name="business_type"
                                          defaultValue={
                                            selectedCompany.business_type
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("business_type");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.business_type}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("business_type");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Bussiness Item</td>
                                  {handleCheckEditState("business_item") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Bussiness Item"
                                          name="business_item"
                                          defaultValue={
                                            selectedCompany.business_item
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("business_item");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.business_item}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("business_item");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Industry Type</td>
                                  {handleCheckEditState("industry_type") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Industry Type"
                                          name="industry_type"
                                          defaultValue={
                                            selectedCompany.industry_type
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("industry_type");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.industry_type}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("industry_type");
                                          }}
                                        >
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
                          <Panel header="Organization Contact Details" key="1">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="border-0">Phone</td>
                                  {handleCheckEditState(
                                    "company_phone_number"
                                  ) ? (
                                    <>
                                      <td className="border-0">
                                        <input
                                          type="text"
                                          placeholder="Phone"
                                          name="company_phone_number"
                                          defaultValue={
                                            selectedCompany.company_phone_number
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td className="border-0">
                                        <div
                                          className="border-0"
                                          onClick={() => {
                                            handleEndEdit(
                                              "company_phone_number"
                                            );
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="border-0">
                                        {selectedCompany.company_phone_number}
                                      </td>
                                      <td className="border-0">
                                        <div
                                          className="border-0"
                                          onClick={() => {
                                            handleStartEdit(
                                              "company_phone_number"
                                            );
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Fax</td>
                                  {handleCheckEditState(
                                    "company_fax_number"
                                  ) ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Fax"
                                          name="company_fax_number"
                                          defaultValue={
                                            selectedCompany.company_fax_number
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("company_fax_number");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>
                                        {selectedCompany.company_fax_number}
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit(
                                              "company_fax_number"
                                            );
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Website</td>
                                  {handleCheckEditState("homepage") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Website"
                                          name="homepage"
                                          defaultValue={
                                            selectedCompany.homepage
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("homepage");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.homepage}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("homepage");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                {/* <tr>
                                  <td>LinkedIn</td>
                                  <td>{}</td>
                                </tr>
                                <tr>
                                  <td>Facebook</td>
                                  <td>{}</td>
                                </tr>
                                <tr>
                                  <td>X (Twitter)</td>
                                  <td>{}</td>
                                </tr>
                                <tr>
                                  <td>Email Domains</td>
                                  <td>{}</td>
                                </tr> */}
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
                                  <td className="border-0">Address</td>
                                  {handleCheckEditState("company_address") ? (
                                    <>
                                      <td className="border-0">
                                        <input
                                          type="text"
                                          placeholder="Address"
                                          name="company_address"
                                          defaultValue={
                                            selectedCompany.company_address
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td className="border-0">
                                        <div
                                          onClick={() => {
                                            handleEndEdit("company_address");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="border-0">
                                        {selectedCompany.company_address}
                                      </td>
                                      <td className="border-0">
                                        <div
                                          onClick={() => {
                                            handleStartEdit("company_address");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Postal code</td>
                                  {handleCheckEditState("company_zip_code") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Postal code"
                                          name="company_zip_code"
                                          defaultValue={
                                            selectedCompany.company_zip_code
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("company_zip_code");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>
                                        {selectedCompany.company_zip_code}
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("company_zip_code");
                                          }}
                                        >
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
                          <Panel header="Additional Information" key="1">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="border-0">Account No.</td>
                                  {handleCheckEditState("account_code") ? (
                                    <>
                                      <td className="border-0">
                                        <input
                                          type="text"
                                          placeholder="Account No."
                                          name="account_code"
                                          defaultValue={
                                            selectedCompany.account_code
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td className="border-0">
                                        <div
                                          onClick={() => {
                                            handleEndEdit("account_code");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="border-0">
                                        {selectedCompany.account_code}
                                      </td>
                                      <td className="border-0">
                                        <div
                                          onClick={() => {
                                            handleStartEdit("account_code");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Bank Name</td>
                                  {handleCheckEditState("bank_name") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Bank Name"
                                          name="bank_name"
                                          defaultValue={
                                            selectedCompany.bank_name
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("bank_name");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.bank_name}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("bank_name");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Account Owner</td>
                                  {handleCheckEditState("account_owner") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Account Owner"
                                          name="account_owner"
                                          defaultValue={
                                            selectedCompany.account_owner
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("account_owner");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.account_owner}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("account_owner");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Sales Resource</td>
                                  {handleCheckEditState("sales_resource") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Sales Resource"
                                          name="sales_resource"
                                          defaultValue={
                                            selectedCompany.sales_resource
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("sales_resource");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.sales_resource}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("sales_resource");
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Application Engineer</td>
                                  {handleCheckEditState(
                                    "application_engineer"
                                  ) ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Application Engineer"
                                          name="application_engineer"
                                          defaultValue={
                                            selectedCompany.application_engineer
                                          }
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit(
                                              "application_engineer"
                                            );
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>
                                        {selectedCompany.application_engineer}
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit(
                                              "application_engineer"
                                            );
                                          }}
                                        >
                                          <Edit />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                <tr>
                                  <td>Region</td>
                                  {handleCheckEditState("region") ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          placeholder="Region"
                                          name="region"
                                          defaultValue={selectedCompany.region}
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleEndEdit("region");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{selectedCompany.region}</td>
                                      <td>
                                        <div
                                          onClick={() => {
                                            handleStartEdit("region");
                                          }}
                                        >
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
                          <Panel header="Memo" key="1">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="border-0">Memo</td>
                                  {handleCheckEditState("memo") ? (
                                    <>
                                      <td className="border-0">
                                        <textarea
                                          className="form-control"
                                          rows={3}
                                          placeholder="Memo"
                                          defaultValue={selectedCompany.memo}
                                          name="memo"
                                          onChange={handleEditing}
                                        />
                                      </td>
                                      <td className="border-0">
                                        <div
                                          onClick={() => {
                                            handleEndEdit("memo");
                                          }}
                                        >
                                          <SaveAlt />
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="border-0">
                                        {selectedCompany.memo}
                                      </td>
                                      <td className="border-0">
                                        <div
                                          onClick={() => {
                                            handleStartEdit("memo");
                                          }}
                                        >
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

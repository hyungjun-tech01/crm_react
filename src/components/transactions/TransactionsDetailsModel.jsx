import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { CircleImg, SystemUser } from "../imagepath";
import { Collapse } from "antd";
import { Edit, SaveAlt } from "@mui/icons-material";
import { atomCurrentTransaction, defaultTransaction } from "../../atoms/atoms";
import { TransactionRepo } from "../../repository/transaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TransactionsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedTransaction = useRecoilValue(atomCurrentTransaction);
  const { modifyTransaction } = useRecoilValue(TransactionRepo);
  const [editedValues, setEditedValues] = useState(null);
  const [cookies] = useCookies(["myLationCrmUserName"]);

  const [ publishDate, setPublishDate ] = useState(new Date());

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
      if(editedValues[name] === selectedTransaction[name]){
        const tempValue = {
          ...editedValues,
        };
        delete tempValue[name];
        setEditedValues(tempValue);
        return;
      };

      if (modifyTransaction(editedValues)) {
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
  }, [editedValues, selectedTransaction]);

  // --- Funtions for Editing ---------------------------------
  const handlePublishDateChange = useCallback((time) => {
    setPublishDate(time);
  }, []);

  useEffect(() => {
    if (editedValues === null) {
      const tempValues = {
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserName,
      };
      setEditedValues(tempValues);
    };
    if (selectedTransaction && (selectedTransaction !== defaultTransaction)) {
      const tempValues = {
        ...editedValues,
        transaction_code: selectedTransaction.transaction_code,
      };
      setEditedValues(tempValues);

      // Set time from selected transaction data
      if(selectedTransaction.publish_date !== null)
      {
        setPublishDate(new Date(selectedTransaction.publish_date));
      };
    }
  }, [cookies.myLationCrmUserName, selectedTransaction]);

  return (
    <>
      <div
        className="modal right fade"
        id="transactions-details"
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
                          Edit This Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Transaction Image
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Delete This Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Email This Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Clone This Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Record Owner
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Generate Merge Document
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Transaction to Contact
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Convert Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Print This Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Merge Into Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          SmartMerge Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add Activity Set To Transaction
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Event For Transaction
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
                    <span>Transaction Status</span>
                    <p>Not Contacted</p>
                  </div>
                  <div className="col">
                    <span>Name</span>
                    <p>Anne Lynch</p>
                  </div>
                  <div className="col">
                    <span>Transaction Source</span>
                    <p>Phone Enquiry</p>
                  </div>
                  <div className="col">
                    <span>Transaction Rating</span>
                    <p>0</p>
                  </div>
                  <div className="col">
                    <span>Transaction owner</span>
                    <p>John Doe</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
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
                                <Panel header="Transaction Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Title</td>
                                        { handleCheckEditState("transaction_title") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Transaction Title"
                                                name="transaction_type"
                                                defaultValue={selectedTransaction.transaction_title}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleEndEdit("transaction_title");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td className="border-0">
                                              {selectedTransaction.transaction_title}
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleStartEdit("transaction_title");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Type</td>
                                        { handleCheckEditState("transaction_type") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Type"
                                                name="transaction_type"
                                                defaultValue={selectedTransaction.transaction_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("transaction_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.transaction_type}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("transaction_type");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Publish Date</td>
                                        { handleCheckEditState("publish_date") ? (
                                          <>
                                            <td>
                                              <DatePicker
                                                className="form-control"
                                                selected={ publishDate }
                                                onChange={ handlePublishDateChange }
                                                dateFormat="yyyy-MM-dd"
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("publish_date");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td>
                                              {publishDate.toLocaleDateString('ko-KR', {
                                                year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
                                              })}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("publish_date");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Publish Type</td>
                                        { handleCheckEditState("publish_type") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Publish Type"
                                                name="publish_type"
                                                defaultValue={selectedTransaction.publish_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("publish_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.publish_type}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("publish_type");}}>
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
                                <Panel header="Organization Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Organization Name</td>
                                        { handleCheckEditState("company_name") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Company Name"
                                                name="company_name"
                                                defaultValue={selectedTransaction.company_name}
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
                                              {selectedTransaction.company_name}
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
                                        <td>Ceo Name</td>
                                        { handleCheckEditState("ceo_name") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Department"
                                                name="ceo_name"
                                                defaultValue={selectedTransaction.ceo_name}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("ceo_name");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.ceo_name}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("ceo_name");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Organization Address</td>
                                        { handleCheckEditState("company_address") ? (
                                          <>
                                            <td>
                                              <textarea
                                                className="form-control"
                                                rows={2}
                                                placeholder="Address"
                                                defaultValue={selectedTransaction.email}
                                                name="company_address"
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("company_address");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.company_address}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("company_address");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Business Type</td>
                                        { handleCheckEditState("business_type") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Business Type"
                                                name="business_type"
                                                defaultValue={selectedTransaction.business_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("business_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.business_type}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("business_type");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Business Item</td>
                                        { handleCheckEditState("business_item") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Business Item"
                                                name="business_item"
                                                defaultValue={selectedTransaction.business_item}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("business_item");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.business_item}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("business_item");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Business Registration Code</td>
                                        { handleCheckEditState("business_registration_code") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Business Registration Code"
                                                name="business_registration_code"
                                                defaultValue={selectedTransaction.business_registration_code}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("business_registration_code");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.business_registration_code}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("business_registration_code");}}>
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
                                <Panel header="Price Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Supply Price</td>
                                        { handleCheckEditState("supply_price") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Supply Price"
                                                name="supply_price"
                                                defaultValue={selectedTransaction.supply_price}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleEndEdit("supply_price");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td className="border-0">
                                              {selectedTransaction.supply_price}
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleStartEdit("supply_price");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Tax Price</td>
                                        { handleCheckEditState("tax_price") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Tax Price"
                                                name="tax_price"
                                                defaultValue={selectedTransaction.tax_price}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("tax_price");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.tax_price}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("tax_price");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Total Price</td>
                                        { handleCheckEditState("total_price") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Total Price"
                                                name="total_price"
                                                defaultValue={selectedTransaction.total_price}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("total_price");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.total_price}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("total_price");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Currency</td>
                                        { handleCheckEditState("currency") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Currency"
                                                name="currency"
                                                defaultValue={selectedTransaction.currency}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("currency");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.currency}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("currency");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Payment Type</td>
                                        { handleCheckEditState("payment_type") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Payment Type"
                                                name="payment_type"
                                                defaultValue={selectedTransaction.payment_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("payment_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedTransaction.payment_type}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("payment_type");}}>
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
                                <Panel header="Transaction Information" key="1">
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
                                        <td>Transaction Status</td>
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
                                        <td>Transaction Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Transaction Created</td>
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
                                        <td>Transaction Rating</td>
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
                                        <td>Transaction Source</td>
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
                                  header="Transaction Conversion Information"
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
                                <Panel header="Transaction Information" key="1">
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
                                        <td>Transaction Status</td>
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
                                        <td>Transaction Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Transaction Created</td>
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
                                        <td>Transaction Rating</td>
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
                                        <td>Transaction Source</td>
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
                                  header="Transaction Conversion Information"
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
                                <Panel header="Transaction Information" key="1">
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
                                        <td>Transaction Status</td>
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
                                        <td>Transaction Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Transaction Created</td>
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
                                        <td>Transaction Rating</td>
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
                                        <td>Transaction Source</td>
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
                                  header="Transaction Conversion Information"
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

export default TransactionsDetailsModel;

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { CircleImg, SystemUser } from "../imagepath";
import { Collapse } from "antd";
import { Edit, SaveAlt } from "@mui/icons-material";
import { atomCurrentQuotation, defaultQuotation } from "../../atoms/atoms";
import { QuotationRepo } from "../../repository/quotation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const QuotationsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedQuotation = useRecoilValue(atomCurrentQuotation);
  const { modifyQuotation } = useRecoilValue(QuotationRepo);
  const [editedValues, setEditedValues] = useState(null);
  const [cookies] = useCookies(["myLationCrmUserName"]);

  const [ quotationDate, setQuotationDate ] = useState(new Date());
  const [ confirmDate, setConfirmDate ] = useState(null);

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
      if(editedValues[name] === selectedQuotation[name]){
        const tempValue = {
          ...editedValues,
        };
        delete tempValue[name];
        setEditedValues(tempValue);
        return;
      };

      if (modifyQuotation(editedValues)) {
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
  }, [editedValues, selectedQuotation]);

  // --- Funtions for Editing ---------------------------------
  const handleQuotationDateChange = useCallback((date) => {
    setQuotationDate(date);
  }, []);

  const handleConfirmDateChange = useCallback((date) => {
    setConfirmDate(date);
  }, []);

  useEffect(() => {
    console.log('[QuotationsDetailsModel] called!');
    if (editedValues === null) {
      const tempValues = {
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserName,
      };
      setEditedValues(tempValues);
    };
    if (selectedQuotation && (selectedQuotation !== defaultQuotation)) {
      const tempValues = {
        ...editedValues,
        quotation_code: selectedQuotation.quotation_code,
      };
      setEditedValues(tempValues);

      // Set time from selected quotation data
      if(selectedQuotation.quotation_date !== null)
      {
        setQuotationDate(new Date(selectedQuotation.quotation_date));
      };
      if(selectedQuotation.comfirm_date !== null)
      {
        setConfirmDate(new Date(selectedQuotation.comfirm_date));
      };
    }
  }, [cookies.myLationCrmUserName, selectedQuotation]);

  return (
    <>
      <div
        className="modal right fade"
        id="quotations-details"
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
                          Edit This Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Quotation Image
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Delete This Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Email This Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Clone This Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Record Owner
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Generate Merge Document
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Change Quotation to Contact
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Convert Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Print This Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Merge Into Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          SmartMerge Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add Activity Set To Quotation
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Add New Event For Quotation
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
                    <span>Quotation Status</span>
                    <p>Not Contacted</p>
                  </div>
                  <div className="col">
                    <span>Name</span>
                    <p>Anne Lynch</p>
                  </div>
                  <div className="col">
                    <span>Quotation Source</span>
                    <p>Phone Enquiry</p>
                  </div>
                  <div className="col">
                    <span>Quotation Rating</span>
                    <p>0</p>
                  </div>
                  <div className="col">
                    <span>Quotation owner</span>
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
                                <Panel header="Quotation Main Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Type</td>
                                        { handleCheckEditState("quotation_type") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Quotation Type"
                                                name="quotation_type"
                                                defaultValue={selectedQuotation.quotation_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleEndEdit("quotation_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td className="border-0">
                                              {selectedQuotation.quotation_type}
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleStartEdit("quotation_type");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Title</td>
                                        { handleCheckEditState("quotation_title") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Title"
                                                name="quotation_title"
                                                defaultValue={selectedQuotation.quotation_title}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("quotation_title");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.quotation_title}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("quotation_title");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Manager</td>
                                        { handleCheckEditState("quotation_manager") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Manager"
                                                name="quotation_manager"
                                                defaultValue={selectedQuotation.quotation_manager}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("quotation_manager");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.quotation_manager}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("quotation_manager");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Send Type</td>
                                        { handleCheckEditState("quotation_send_type") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Send Type"
                                                name="quotation_send_type"
                                                defaultValue={selectedQuotation.quotation_send_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("quotation_send_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.quotation_send_type}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("quotation_send_type");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Quotation Date</td>
                                        { handleCheckEditState("quotation_date") ? (
                                          <>
                                            <td>
                                              <DatePicker
                                                className="form-control"
                                                selected={ quotationDate }
                                                onChange={ handleQuotationDateChange }
                                                dateFormat="yyyy-MM-dd"
                                                showTimeSelect
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("quotation_date");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td>
                                              {quotationDate.toLocaleDateString('ko-KR', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                              })}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("quotation_date");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Expiry Date</td>
                                        { handleCheckEditState("quotation_expiration_date") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Expriy Date"
                                                name="quotation_expiration_date"
                                                defaultValue={selectedQuotation.quotation_expiration_date}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("quotation_expiration_date");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.quotation_expiration_date}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("quotation_expiration_date");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Confirm Date</td>
                                        { handleCheckEditState("comfirm_date") ? (
                                          <>
                                            <td>
                                              <DatePicker
                                                className="form-control"
                                                selected={ confirmDate === null? new Date() : confirmDate }
                                                onChange={ handleConfirmDateChange }
                                                dateFormat="yyyy-MM-dd"
                                                showTimeSelect
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("comfirm_date");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                          ) : (
                                          <>
                                            <td>
                                              {confirmDate === null ? '' : confirmDate.toLocaleDateString('ko-KR', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                              })}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("comfirm_date");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Delivery Location</td>
                                        { handleCheckEditState("delivery_location") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Product Type"
                                                name="delivery_location"
                                                defaultValue={selectedQuotation.delivery_location}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("delivery_location");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.delivery_location}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("delivery_location");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Delivery Period</td>
                                        { handleCheckEditState("delivery_location") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Delivery Period"
                                                name="delivery_period"
                                                defaultValue={selectedQuotation.delivery_period}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("delivery_period");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.delivery_period}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("delivery_period");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Warranty Period</td>
                                        { handleCheckEditState("warranty_period") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Warranty Period"
                                                name="warranty_period"
                                                defaultValue={selectedQuotation.warranty_period}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("warranty_period");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.delivery_pewarranty_periodriod}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("warranty_period");}}>
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
                                                defaultValue={selectedQuotation.sales_representati}
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
                                              {selectedQuotation.sales_representati}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("sales_representati");}}>
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
                                <Panel header="Quotation Cost Information" key="1">
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="border-0">Payment Type</td>
                                        { handleCheckEditState("payment_type") ? (
                                          <>
                                            <td className="border-0">
                                              <input
                                                type="text"
                                                placeholder="Payment Type"
                                                name="payment_type"
                                                defaultValue={selectedQuotation.payment_type}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleEndEdit("payment_type");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td className="border-0">
                                              {selectedQuotation.payment_type}
                                            </td>
                                            <td className="border-0">
                                              <div onClick={() => {handleStartEdit("payment_type");}}>
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
                                                defaultValue={selectedQuotation.currency}
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
                                              {selectedQuotation.quotation_title}
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
                                        <td>List Price</td>
                                        { handleCheckEditState("list_price") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="List Price"
                                                name="list_price"
                                                defaultValue={selectedQuotation.list_price}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("list_price");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.list_price}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("list_price");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>List Price DC</td>
                                        { handleCheckEditState("list_price_dc") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="List Price DC"
                                                name="list_price_dc"
                                                defaultValue={selectedQuotation.list_price_dc}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("list_price_dc");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.list_price_dc}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("list_price_dc");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Sub Total Amount</td>
                                        { handleCheckEditState("list_price_dc") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Sub Total Amount"
                                                name="sub_total_amount"
                                                defaultValue={selectedQuotation.sub_total_amount}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("sub_total_amount");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.sub_total_amount}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("sub_total_amount");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>DC Rate</td>
                                        { handleCheckEditState("dc_rate") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="DC Rate"
                                                name="dc_rate"
                                                defaultValue={selectedQuotation.dc_rate}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("dc_rate");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.dc_rate}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("dc_rate");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Quotation Amount</td>
                                        { handleCheckEditState("quotation_amount") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Quotation Amount"
                                                name="quotation_amount"
                                                defaultValue={selectedQuotation.quotation_amount}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("quotation_amount");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.quotation_amount}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("quotation_amount");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Tax Amount</td>
                                        { handleCheckEditState("tax_amount") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Tax Amount"
                                                name="tax_amount"
                                                defaultValue={selectedQuotation.tax_amount}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("tax_amount");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.tax_amount}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("tax_amount");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Cut-Off Amount</td>
                                        { handleCheckEditState("cutoff_amount") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Cut-Off Amount"
                                                name="cutoff_amount"
                                                defaultValue={selectedQuotation.cutoff_amount}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("cutoff_amount");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.cutoff_amount}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("cutoff_amount");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Total Quotation Amount</td>
                                        { handleCheckEditState("total_quotation_amount") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Total Quotation Amount"
                                                name="total_quotation_amount"
                                                defaultValue={selectedQuotation.total_quotation_amount}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("total_quotation_amount");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.total_quotation_amount}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("total_quotation_amount");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Total Cost Amount</td>
                                        { handleCheckEditState("total_cost_price") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Total Cost Amount"
                                                name="total_cost_price"
                                                defaultValue={selectedQuotation.total_cost_price}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("total_cost_price");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.total_cost_price}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("total_cost_price");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Profit</td>
                                        { handleCheckEditState("profit") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Profit"
                                                name="profit"
                                                defaultValue={selectedQuotation.profit}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("profit");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.profit}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("profit");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Profit Rate</td>
                                        { handleCheckEditState("profit_rate") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Profit Rate"
                                                name="profit_rate"
                                                defaultValue={selectedQuotation.profit_rate}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("profit_rate");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.profit_rate}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("profit_rate");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Upper Memo</td>
                                        { handleCheckEditState("upper_memo") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Upper Memo"
                                                name="upper_memo"
                                                defaultValue={selectedQuotation.upper_memo}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("upper_memo");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.upper_memo}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("upper_memo");}}>
                                                <Edit />
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>Lower Memo</td>
                                        { handleCheckEditState("lower_memo") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Lower Memo"
                                                name="lower_memo"
                                                defaultValue={selectedQuotation.lower_memo}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("lower_memo");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.lower_memo}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("lower_memo");}}>
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
                                                defaultValue={selectedQuotation.lead_name}
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
                                              {selectedQuotation.lead_name}
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
                                                defaultValue={selectedQuotation.department}
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
                                              {selectedQuotation.department}
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
                                                defaultValue={selectedQuotation.position}
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
                                              {selectedQuotation.position}
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
                                                defaultValue={selectedQuotation.mobile_number}
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
                                              {selectedQuotation.mobile_number}
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
                                                defaultValue={selectedQuotation.phone_number}
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
                                              {selectedQuotation.phone_number}
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
                                        <td>Fax</td>
                                        { handleCheckEditState("fax_number") ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                placeholder="Fax"
                                                name="fax_number"
                                                defaultValue={selectedQuotation.fax_number}
                                                onChange={handleEditing}
                                              />
                                            </td>
                                            <td>
                                              <div onClick={() => {handleEndEdit("fax_number");}}>
                                                <SaveAlt />
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>
                                              {selectedQuotation.fax_number}
                                            </td>
                                            <td>
                                              <div onClick={() => {handleStartEdit("fax_number");}}>
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
                                                defaultValue={selectedQuotation.email}
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
                                              {selectedQuotation.email}
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
                                                defaultValue={selectedQuotation.company_name}
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
                                              {selectedQuotation.company_name}
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
                                                defaultValue={selectedQuotation.status}
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
                                              {selectedQuotation.status}
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
                                <Panel header="Quotation Information" key="1">
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
                                        <td>Quotation Status</td>
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
                                        <td>Quotation Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Quotation Created</td>
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
                                        <td>Quotation Rating</td>
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
                                        <td>Quotation Source</td>
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
                                  header="Quotation Conversion Information"
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
                                <Panel header="Quotation Information" key="1">
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
                                        <td>Quotation Status</td>
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
                                        <td>Quotation Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Quotation Created</td>
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
                                        <td>Quotation Rating</td>
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
                                        <td>Quotation Source</td>
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
                                  header="Quotation Conversion Information"
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
                                <Panel header="Quotation Information" key="1">
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
                                        <td>Quotation Status</td>
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
                                        <td>Quotation Owner</td>
                                        <td>John Doe</td>
                                      </tr>
                                      <tr>
                                        <td>Quotation Created</td>
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
                                        <td>Quotation Rating</td>
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
                                        <td>Quotation Source</td>
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
                                  header="Quotation Conversion Information"
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

export default QuotationsDetailsModel;

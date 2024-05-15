import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { CircleImg } from "../imagepath";
import { Collapse, Space, Switch } from "antd";
import { atomCurrentConsulting, defaultConsulting } from "../../atoms/atoms";
import { ConsultingRepo } from "../../repository/consulting";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import { MoreVert } from "@mui/icons-material";


const ConsultingsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedConsulting = useRecoilValue(atomCurrentConsulting);
  const { modifyConsulting, setCurrentConsulting } = useRecoilValue(ConsultingRepo);
  const [ cookies ] = useCookies(["myLationCrmUserId"]);
  const [ t ] = useTranslation();

  const [ editedValues, setEditedValues ] = useState(null);
  const [ savedValues, setSavedValues ] = useState(null);
  const [ orgReceiptTime, setOrgReceiptTime ] = useState(new Date());
  const [ isFullscreen, setIsFullscreen ] = useState(false);


  // --- Funtions for Editing ---------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedConsulting[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedConsulting]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    console.log('handleEditing : ', tempEdited);
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if(editedValues[name] === selectedConsulting[name]){
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
  }, [editedValues, savedValues, selectedConsulting]);

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
      && selectedConsulting
      && selectedConsulting !== defaultConsulting)
    {
      let temp_all_saved = {
        ...savedValues
      };
      if(savedValues.receipt_date) {
        const date_string = savedValues.toLocaleDateString('ko-KR', {year:'numeric', month:'numeric', day:'numeric'});
        const time_string = savedValues.toLocaleDateString('ko-KR', {hour:'numeric', minute:'numeric', second:'numeric'});
        temp_all_saved['receipt_date'] = date_string;
        temp_all_saved['receipt_time'] = time_string;
      };
      temp_all_saved['action_type'] = "UPDATE";
      temp_all_saved['modify_user'] = cookies.myLationCrmUserId;
      temp_all_saved['consulting_code'] = selectedConsulting.consulting_code;

      if (modifyConsulting(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
        if(savedValues.receipt_time){
          setOrgReceiptTime(savedValues.receipt_time);
        };
      } else {
        console.error('Failed to modify company')
      }
    } else {
      console.log("[ ConsultingDetailModel ] No saved data");
    };
    setEditedValues(null);
    setSavedValues(null);
  }, [cookies.myLationCrmUserId, modifyConsulting, savedValues, selectedConsulting]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
  }, []);

  // --- Funtions for Receipt time ---------------------------------
  const handleStartReceiptTimeEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      receipt_time: orgReceiptTime,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgReceiptTime]);
  const handleReceiptTimeChange = useCallback((time) => {
    const tempEdited = {
      ...editedValues,
      receipt_time: time,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);
  const handleEndReceiptTimeEdit = useCallback(() => {
    const receiptTime = editedValues.receipt_time;
    if(receiptTime !== orgReceiptTime) {
      const tempSaved = {
        ...savedValues,
        receipt_time : receiptTime,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.receipt_time;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgReceiptTime]);

  const handleWidthChange = useCallback((checked) => {
    setIsFullscreen(checked);
  }, []);

  const consulting_items_info = [
    ['consulting_type','consulting.type',{ type:'label'}],
    ['receipt_time','consulting.receipt_time',
      { type:'date', time: true, orgTimeData: orgReceiptTime, timeDataChange: handleReceiptTimeChange, startEditTime: handleStartReceiptTimeEdit, endEditTime: handleEndReceiptTimeEdit }
    ],
    ['product_type','consulting.product_type',{ type:'label' }],
    ['lead_time','consulting.lead_time',{ type:'label' }],
    ['request_type','consulting.request_type',{ type:'label' }],
    ['lead_sales','lead.lead_sales',{ type:'label' }],
    ['department','lead.department',{ type:'label' }],
    ['position','lead.position',{ type:'label' }],
    ['mobile_number','lead.mobile',{ type:'label' }],
    ['phone_number','common.phone',{ type:'label' }],
    ['email','lead.email',{ type:'label' }],
    ['company_name','company.company_name',{ type:'label' }],
    ['request_content','consulting.request_content',{ type:'textarea', extra:'long' }],
    ['action_content','consulting.action_content',{ type:'textarea', extra:'long' }],
    ['memo','common.memo',{ type:'textarea', extra:'long' }],
  ];

  useEffect(() => {
    console.log('[ConsultingsDetailsModel] called!');
    if (selectedConsulting && (selectedConsulting !== defaultConsulting)) {

      // Set time from selected consulting data
      let input_time = new Date();
      if(selectedConsulting.receipt_date !== null)
      {
        input_time.setTime(Date.parse(selectedConsulting.receipt_date));

        if(selectedConsulting.receipt_time !== null
          && selectedConsulting.receipt_time !== '' && selectedConsulting.receipt_time !== undefined)
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

            input_time.setTime(Date.parse(str_ymd));
          };
        };
        setOrgReceiptTime(input_time);
      };
    }
  }, [cookies.myLationCrmUserName, selectedConsulting]);

  return (
    <div
      className="modal right fade"
      id="consulting-details"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="row w-100">
              <DetailTitleItem
                defaultText={selectedConsulting.status}
                saved={savedValues}
                name='status'
                title={t('consulting.status')}
                checkEdit={handleCheckEditState}
                startEdit={handleStartEdit}
                endEdit={handleEndEdit}
                editing={handleEditing}
                checkSaved={handleCheckSaved}
                cancelSaved={handleCancelSaved}
              />
              <DetailTitleItem
                defaultText={selectedConsulting.lead_name}
                saved={savedValues}
                name='status'
                title={t('lead.lead_name')}
                checkEdit={handleCheckEditState}
                startEdit={handleStartEdit}
                endEdit={handleEndEdit}
                editing={handleEditing}
                checkSaved={handleCheckSaved}
                cancelSaved={handleCancelSaved}
              />
              <DetailTitleItem
                defaultText={selectedConsulting.receiver}
                saved={savedValues}
                name='status'
                title={t('consulting.receiver')}
                checkEdit={handleCheckEditState}
                startEdit={handleStartEdit}
                endEdit={handleEndEdit}
                editing={handleEditing}
                checkSaved={handleCheckSaved}
                cancelSaved={handleCancelSaved}
              />
            </div>
            <Switch checkedChildren="full" onChange={handleWidthChange}/>
            <button
              type="button"
              className="btn-close xs-close"
              data-bs-dismiss="modal"
              onClick={() => setCurrentConsulting()}
            />
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
                          {t('common.details')}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#not-contact-task-related"
                          data-bs-toggle="tab"
                        >
                          {t('common.related')}
                        </Link>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className="tab-pane show active p-0"
                        id="not-contact-task-details"
                      >
                        <div className="crms-tasks">
                          <div className="tasks__item crms-task-item">
                            <Space
                              align="start"
                              direction="horizontal"
                              size="small"
                              style={{ display: 'flex', marginBottom: '0.5rem' }}
                              wrap
                            >
                              { consulting_items_info.map((item, index) => 
                                <DetailCardItem
                                  key={index}
                                  defaultText={selectedConsulting[item.at(0)]}
                                  edited={editedValues}
                                  saved={savedValues}
                                  name={item.at(0)}
                                  title={t(item.at(1))}
                                  detail={item.at(2)}
                                  checkEdit={handleCheckEditState}
                                  startEdit={handleStartEdit}
                                  editing={handleEditing}
                                  endEdit={handleEndEdit}
                                  checkSaved={handleCheckSaved}
                                  cancelSaved={handleCancelSaved}
                                />
                              )}
                            </Space>
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                    { savedValues !== null && Object.keys(savedValues).length !== 0 &&
                      <div className="text-center py-3">
                        <button
                          type="button"
                          className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          onClick={handleSaveAll}
                        >
                          {t('common.save')}
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className="btn btn-secondary btn-rounded"
                          onClick={handleCancelAll}
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    }
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
                                              <MoreVert />
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
  );
};

export default ConsultingsDetailsModel;

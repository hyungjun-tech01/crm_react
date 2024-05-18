import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Collapse, Space, Switch } from "antd";
import { C_logo, C_logo2, CircleImg } from "../imagepath";
import { atomCurrentPurchase, defaultPurchase } from "../../atoms/atoms";
import { PurchaseRepo } from "../../repository/purchase";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import { MoreVert } from "@mui/icons-material";


const PurchaseDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedPurchase = useRecoilValue(atomCurrentPurchase);
  const { modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const { t } = useTranslation();

  const [editedValues, setEditedValues] = useState(null);
  const [savedValues, setSavedValues] = useState(null);

  const [orgDeliveryDate, setOrgDeliveryDate] = useState(null);
  const [orgContactDate, setOrgContactDate] = useState(null);
  const [orgFinishDate, setOrgFinishDate] = useState(null);
  const [orgRegisterDate, setOrgRegisterDate] = useState(null);
  const [ isFullScreen, setIsFullScreen ] = useState(false);

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
        if(savedValues.delivery_date){
          setOrgDeliveryDate(savedValues.delivery_date);
        };
        if(savedValues.MA_contact_date){
          setOrgContactDate(savedValues.MA_contact_date);
        };
        if(savedValues.MA_finish_date){
          setOrgFinishDate(savedValues.MA_finish_date);
        };
        if(savedValues.registration_date){
          setOrgRegisterDate(savedValues.registration_date);
        };
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
      delivery_date: orgDeliveryDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgDeliveryDate]);
  const handleDeliveryDateChange = useCallback((date) => {
    const tempEdited = {
      ...editedValues,
      delivery_date: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);
  const handleEndDeliveryDateEdit = useCallback(() => {
    const deliveryDate = editedValues.delivery_date;
    if (deliveryDate !== orgDeliveryDate) {
      const tempSaved = {
        ...savedValues,
        delivery_date: deliveryDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.delivery_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgDeliveryDate]);

  // --- Funtions for MA Contact Date ---------------------------------
  const handleStartContactDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      MA_contact_date: orgContactDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgContactDate]);
  const handleContactDateChange = useCallback((date) => {
    const tempEdited = {
      ...editedValues,
      MA_contact_date: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);
  const handleEndContactDateEdit = useCallback(() => {
    const contactDate = editedValues.MA_contact_date;
    if (contactDate !== orgContactDate) {
      const tempSaved = {
        ...savedValues,
        MA_contact_date: contactDate,
      };
      setSavedValues(tempSaved);
    };
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.MA_contact_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgContactDate]);

  // --- Funtions for Finishment Date ---------------------------------
  const handleStartFinishDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      MA_finish_date: orgFinishDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgFinishDate]);
  const handleFinishDateChange = useCallback((date) => {
    const tempEdited = {
      ...editedValues,
      MA_finish_date: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);
  const handleEndFinishDateEdit = useCallback(() => {
    const finishDate = editedValues.MA_finish_date;
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
  }, [editedValues, savedValues, orgFinishDate]);

  // --- Funtions for Registerment Date ---------------------------------
  const handleStartRegisterDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      registration_date: orgRegisterDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgRegisterDate]);
  const handleRegisterDateChange = useCallback((date) => {
    const tempEdited = {
      ...editedValues,
      registration_date: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);
  const handleEndRegisterDateEdit = useCallback(() => {
    const registerDate = editedValues.registration_date;
    if(registerDate !== orgRegisterDate) {
      const tempSaved = {
        ...savedValues,
        registration_date : registerDate,
      };
      setSavedValues(tempSaved);
    };
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.registration_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgRegisterDate]);

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  const handleClose = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
    setCurrentPurchase();
  }, []);

  const purchase_items_info = [
    ['serial_number','purchase.serial',{ type:'label',extra:'long'}],
    ['quantity','common.quantity',{ type:'label'}],
    ['price','common.price',{ type:'label' }],
    ['currency','common.currency',{ type:'label' }],
    ['delivery_date','purchase.delivery_date',
      { type:'date', orgTimeData: orgDeliveryDate, timeDataChange: handleDeliveryDateChange, startEditTime: handleStartDeliveryDateEdit, endEditTime: handleEndDeliveryDateEdit }
    ],
    ['MA_contact_date','purchase.ma_contract_date',
      { type:'date', orgTimeData: orgContactDate, timeDataChange: handleContactDateChange, startEditTime: handleStartContactDateEdit, endEditTime: handleEndContactDateEdit }
    ],
    ['MA_finish_date','purchase.ma_finish_date',
      { type:'date', orgTimeData: orgFinishDate, timeDataChange: handleFinishDateChange, startEditTime: handleStartFinishDateEdit, endEditTime: handleEndFinishDateEdit }
    ],
    ['register','purchase.register',{ type:'label' }],
    ['registration_date','purchase.registration_date',
      { type:'date', orgTimeData: orgRegisterDate, timeDataChange: handleRegisterDateChange, startEditTime: handleStartRegisterDateEdit, endEditTime: handleEndRegisterDateEdit }
    ],
    ['regcode','purchase.registration_code',{ type:'label' }],
    ['status','common.status',{ type:'label' }],
    ['purchase_memo','common.memo',{ type:'textarea', extra:'long' }],
  ];

  useEffect(() => {
    if(selectedPurchase !== defaultPurchase) {
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

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if(detailViewStatus === null){
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if(detailViewStatus === '0'){
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };
    };
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
        <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <DetailTitleItem
                  defaultText={selectedPurchase.product_type}
                  saved={savedValues}
                  name='product_type'
                  title={t('purchase.type')}
                  type='col-md-4'
                  checkEdit={handleCheckEditState}
                  startEdit={handleStartEdit}
                  endEdit={handleEndEdit}
                  editing={handleEditing}
                  checkSaved={handleCheckSaved}
                  cancelSaved={handleCancelSaved}
                />
                <DetailTitleItem
                  defaultText={selectedPurchase.product_name}
                  saved={savedValues}
                  name='product_name'
                  title={t('purchase.product_name')}
                  type='col-md-6'
                  checkEdit={handleCheckEditState}
                  startEdit={handleStartEdit}
                  endEdit={handleEndEdit}
                  editing={handleEditing}
                  checkSaved={handleCheckSaved}
                  cancelSaved={handleCancelSaved}
                />
              </div>
              <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWidthChange}/>
              <button
                type="button"
                className="btn-close xs-close"
                data-bs-dismiss="modal"
                onClick={ handleClose }
              />
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
                      {t('common.details')}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="#task-related"
                      data-bs-toggle="tab"
                    >
                      {t('common.related')}
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
                        <Space
                          align="start"
                          direction="horizontal"
                          size="small"
                          style={{ display: 'flex', marginBottom: '0.5rem' }}
                          wrap
                        >
                          { purchase_items_info.map((item, index) => 
                            <DetailCardItem
                              key={index}
                              defaultText={selectedPurchase[item.at(0)]}
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
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
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
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
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
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
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
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
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
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
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
                          <Collapse defaultActiveKey={['1']} accordion expandIconPosition="end">
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

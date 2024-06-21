import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "antd/dist/reset.css";
import { Button, Checkbox, Space, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import { AddBoxOutlined, ModeEdit, IndeterminateCheckBoxOutlined, SettingsOutlined } from '@mui/icons-material';
import { option_locations } from '../../constants/constants';

import {
  atomLeadState,
  atomLeadsForSelection,
  defaultQuotation,
} from "../../atoms/atoms";
import {
  atomUserState,
  atomUsersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import { UserRepo } from '../../repository/user';
import { LeadRepo } from "../../repository/lead";
import { QuotationRepo, QuotationTypes, QuotationSendTypes } from "../../repository/quotation";

import AddBasicItem from "../../constants/AddBasicItem";
import QuotationContentModal from "./QuotationContentModal";

const default_quotation_content = {
  '1': null, '2': null, '3': null, '4': null, '5': null,
  '6': null, '7': null, '8': null, '9': null, '10': null,
  '11': null, '12': null, '13': null, '14': null, '15': null,
  '16': null, '17': null, '18': null, '19': null, '998': null,
};

const QuotationAddModel = (props) => {
  const { init, handleInit, leadCode } = props;
  const [t] = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);


  //===== [RecoilState] Related with Quotation =======================================
  const { modifyQuotation } = useRecoilValue(QuotationRepo);


  //===== [RecoilState] Related with Lead =============================================
  const leadsState = useRecoilValue(atomLeadState);
  const leadsForSelection = useRecoilValue(atomLeadsForSelection);
  const { loadAllLeads } = useRecoilValue(LeadRepo);


  //===== [RecoilState] Related with Users ==========================================
  const userState = useRecoilValue(atomUserState);
  const { loadAllUsers } = useRecoilValue(UserRepo)
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to edit 'QuotationAddModel' ========================================
  const [quotationChange, setQuotationChange] = useState({ ...defaultQuotation });
  const [quotationContents, setQuotationContents] = useState([]);
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);
  const [currentContent, setCurrentContent] = useState(null);

  const initializeQuotationTemplate = useCallback(() => {
    document.querySelector("#add_new_quotation_form").reset();

    setQuotationContents([]);
    if (leadCode && leadCode !== '') {
      const foundIdx = leadsForSelection.findIndex(item => item.value.lead_code === leadCode);
      if (foundIdx !== -1) {
        const found_lead_info = leadsForSelection.at(foundIdx);
        console.log('[initializeQuotationTemplate] leadsForSelection :', found_lead_info);
        setQuotationChange({
          ...defaultQuotation,
          ...found_lead_info.value,
        });
      };
    } else {
      setQuotationChange({
        ...defaultQuotation,
      });
    };
  }, [leadCode, leadsForSelection]);

  const handleItemChange = useCallback((e) => {
    const modifiedData = {
      ...quotationChange,
      [e.target.name]: e.target.value,
    };
    setQuotationChange(modifiedData);
  }, [quotationChange]);

  const handleDateChange = (name, date) => {
    const modifiedData = {
      ...quotationChange,
      [name]: date
    };
    console.log('[handleDateChange] : ', modifiedData);
    setQuotationChange(modifiedData);
  };

  const handleSelectChange = useCallback((name, selected) => {
    let modifiedData = null;
    if (name === 'lead_name') {
      modifiedData = {
        ...quotationChange,
        lead_code: selected.value.lead_code,
        lead_name: selected.value.lead_name,
        department: selected.value.department,
        position: selected.value.position,
        mobile_number: selected.value.mobile_number,
        phone_number: selected.value.phone_number,
        email: selected.value.email,
        company_name: selected.value.company_name,
        company_code: selected.value.company_code,
      };
    } else {
      modifiedData = {
        ...quotationChange,
        [name]: selected.value,
      };
    };

    setQuotationChange(modifiedData);
  }, [quotationChange]);


  //===== Handles to edit 'Quotation Contents' ========================================
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const default_content_array = [
    ['2', t('common.category')],
    ['3', t('common.maker')],
    ['4', t('quotation.model_name')],
    ['5', t('common.product')],
    ['6', t('common.material')],
    ['7', t('common.type')],
    ['8', t('common.color')],
    ['9', t('common.standard')],
    ['10', t('quotation.detail_desc')],
    ['11', t('common.unit')],
    ['12', t('common.quantity')],
    ['13', t('quotation.consumer_price')],
    ['14', t('quotation.discount_rate')],
    ['15', t('quotation.quotation_unit_price')],
    ['16', t('quotation.quotation_amount')],
    ['17', t('quotation.raw_price')],
    ['18', t('quotation.profit_amount')],
    ['19', t('quotation.note')],
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ConvertHeaderInfosToString = (data) => {
    let ret = '1|No|';

    if (data[0]['title'] === 'No') ret += data[0]['size']
    else ret += '0';

    default_content_array.forEach(item => {
      ret += '|' + item.at(0) + '|' + item.at(1) + '|';

      const foundIdx = data.findIndex(col => col.title === item.at(1));
      if (foundIdx === -1) {
        ret += '0';
      } else {
        ret += data[foundIdx]['size'];
      }
    });

    console.log('\t[ ConvertHeaderInfosToString ] Result : ', ret);
    return ret;
  };

  // --- Functions / Variables dealing with contents table -------------------------------
  const default_columns = [
    {
      title: "No",
      dataIndex: '1',
      size: 5,
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.product'),
      dataIndex: '5',
      size: 50,
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('quotation.detail_desc'),
      dataIndex: '10',
      size: 10,
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.quantity'),
      dataIndex: '12',
      size: 10,
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('quotation.quotation_unit_price'),
      dataIndex: '15',
      size: 15,
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('quotation.quotation_amount'),
      dataIndex: '16',
      size: 15,
      render: (text, record) => <>{text}</>,
    },
    // {
    //   title: "Edit",
    //   render: (text, record) => (
    //     <div className="dropdown dropdown-action text-center">
    //       <ModeEdit onClick={() => {
    //         handleLoadSelectedContent(record);
    //       }} />
    //     </div>
    //   ),
    // },
  ];

  const rowSelection = {
    selectedRowKeys: selectedContentRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedContentRowKeys(selectedRows);
    },
  };


  const handleDeleteSelectedConetents = useCallback(() => {
    if (selectedContentRowKeys.length === 0) {
      console.log('\t[handleDeleteSelectedConetents] No row is selected');
      return;
    };

    let tempContents = [
      ...quotationContents
    ];
    selectedContentRowKeys.forEach(row => {
      const filteredContents = tempContents.filter(item => item['1'] !== row['1']);
      tempContents = filteredContents;
    });
    let temp_total_amount = 0;
    const finalContents = tempContents.map((item, index) => {
      temp_total_amount += item['16'];
      return { ...item, '1': index + 1 };
    });
    const tempQuotation = {
      ...quotationChange,
      total_quotation_amount: temp_total_amount,
    };
    setQuotationChange(tempQuotation);
    console.log('handleDeleteSelectedConetents / final : ', finalContents);
    setQuotationContents(finalContents);
  }, []);

  // --- Functions used for adding new quotation ------------------------------
  const handleAddNewQuotation = useCallback((event) => {
    // Check data if they are available
    if (quotationChange.lead_name === null
      || quotationChange.lead_name === ''
      || quotationChange.quotation_type === null
      || quotationContents.length === 0
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };
    const newQuotationData = {
      ...quotationChange,
      quotation_table: "",
      quotation_contents: JSON.stringify(quotationContents),
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewQuotation ]`, newQuotationData);
    const result = modifyQuotation(newQuotationData);
    if (result) {
      initializeQuotationTemplate();
      //close modal ?
    };
  }, [cookies.myLationCrmUserId, initializeQuotationTemplate, modifyQuotation, quotationChange, quotationContents]);



  //===== Handles to edit 'Contents' =================================================
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalSetting, setSubModalSetting] = useState({ title: '' })
  const [orgSubModalValues, setOrgSubModalValues] = useState({});
  const [editedSubModalValues, setEditedSubModalValues] = useState({});


  // --- Functions used for editing content ------------------------------
  const handleAddNewContent = useCallback(() => {
    if (!quotationChange.lead_name) {
      console.log('\t[handleAddNewContent] No lead is selected');
      return;
    };

    const tempContent = {
      ...default_quotation_content,
      '1': quotationContents.length + 1,
    };
    setCurrentContent(tempContent);
    setSubModalSetting({ title: t('quotation.add_content') });
    setOrgSubModalValues({
      product_name: null,
      product_class_name: null,
      detail_desc_on_off: false,
      detail_desc: null,
      quantity: null,
      quotation_unit_price: null,
      quotation_amount: null,
    });
    setIsSubModalOpen(true);
  }, [quotationChange.lead_name, quotationContents.length, t]);

  const handleModifyContent = useCallback((data) => {
    if (!data) {
      console.log('\t[handleModifyContent] No Data');
      return;
    };

    const tempContent = {
      ...default_quotation_content,
      '1': quotationContents.length + 1,
    };
    setCurrentContent(tempContent);
    setIsSubModalOpen(true);
  }, [quotationContents, quotationChange]);

  const handleSubModalOk = useCallback(() => {
    const finalData = {
      ...orgSubModalValues,
      ...editedSubModalValues,
      index: quotationContents.length + 1,
    };
    if (!finalData.product_name || !finalData.quotatio_amount) {
      console.log("Inevitable data can't be null");
      return;
    };
    setIsSubModalOpen(false);
    console.log('[handleSubModalOk] ', finalData);
    const updatedContents = quotationContents.concat(finalData);
    setQuotationContents(updatedContents);
    setSelectedContentRowKeys([]);

  }, [editedSubModalValues, orgSubModalValues, quotationContents]);

  const handleSubModalCancel = () => {
    setIsSubModalOpen(false);
    setEditedSubModalValues(null);
    setSelectedContentRowKeys([]);
  };

  const handleSubModalItemChange = useCallback(data => {
    setEditedSubModalValues(data);
  }, []);

  //===== useEffect functions ==========================================
  useEffect(() => {
    if ((userState & 1) === 0) {
      loadAllUsers();
    } else {
      if (init) {
        initializeQuotationTemplate();
      } else {
        if (handleInit) handleInit(!init);
      };
    };

  }, [handleInit, init, initializeQuotationTemplate, loadAllUsers, userState]);

  useEffect(() => {
    if ((leadsState & 1) === 0) {
      loadAllLeads();
    };
  }, [leadsState, loadAllLeads]);

  

  return (
    <div
      className="modal right fade"
      id="add_quotation"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      data-bs-focus="false"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
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
            <h4 className="modal-title"><b>{t('quotation.add_new_quotation')}</b></h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form className="forms-sampme" id="add_new_quotation_form">
              <div className="form-group row">
                <AddBasicItem
                  title={t('lead.lead_name')}
                  type='select'
                  name='lead_name'
                  defaultValue={quotationChange.lead_name}
                  options={leadsForSelection}
                  required
                  onChange={handleSelectChange}
                />
              </div>
              {(quotationChange.lead_name !== null) &&
                <div className="form-group row">
                  <div className="col-sm-12">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td><b>{t('lead.department')}</b></td>
                          <td>{quotationChange.department}</td>
                          <td><b>{t('lead.position')}</b></td>
                          <td>{quotationChange.position}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.mobile')}</b></td>
                          <td>{quotationChange.mobile_number}</td>
                          <td><b>{t('common.phone_no')}</b></td>
                          <td>{quotationChange.phone_number}</td>
                        </tr>
                        <tr>
                          <td><b>{t('lead.fax_number')}</b></td>
                          <td>{quotationChange.fax_number}</td>
                          <td><b>{t('lead.email')}</b></td>
                          <td>{quotationChange.email}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              }
              <div className="form-group row">
                <AddBasicItem
                  title={t('common.title')}
                  type='text'
                  name='quotation_title'
                  defaultValue={quotationChange.quotation_title}
                  required
                  long
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.quotation_type')}
                  type='select'
                  name='quotation_type'
                  defaultValue={quotationChange.quotation_type}
                  options={QuotationTypes}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.doc_no')}
                  type='text'
                  name='quotation_number'
                  defaultValue={quotationChange.quotation_number}
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.send_type')}
                  type='select'
                  name='quotation_send_type'
                  defaultValue={quotationChange.quotation_send_type}
                  options={QuotationSendTypes}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.quotation_date')}
                  type='date'
                  name='quotation_date'
                  time={{ data: quotationChange.quotation_date }}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.expiry_date')}
                  type='text'
                  name='quotation_expiration_date'
                  defaultValue={quotationChange.quotation_expiration_date}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('quotation.confirm_date')}
                  type='date'
                  name='comfirm_date'
                  time={{ data: quotationChange.comfirm_date }}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.delivery_location')}
                  type='text'
                  name='delivery_location'
                  defaultValue={quotationChange.delivery_location}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('quotation.delivery_period')}
                  type='text'
                  name='delivery_period'
                  defaultValue={quotationChange.delivery_period}
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.warranty')}
                  type='text'
                  name='warranty_period'
                  defaultValue={quotationChange.warranty_period}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('common.region')}
                  type='select'
                  name='region'
                  options={option_locations.ko}
                  defaultValue={quotationChange.region}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.payment_type')}
                  type='text'
                  name='payment_type'
                  defaultValue={quotationChange.payment_type}
                  onChange={handleItemChange}
                />
                <AddBasicItem
                  title={t('common.status')}
                  type='text'
                  name='status'
                  defaultValue={quotationChange.status}
                  onChange={handleItemChange}
                />
              </div>
              <div className="form-group row">
                <AddBasicItem
                  title={t('quotation.sales_rep')}
                  type='select'
                  name='sales_representative'
                  defaultValue={quotationChange.sales_representative}
                  options={salespersonsForSelection}
                  onChange={handleSelectChange}
                />
                <AddBasicItem
                  title={t('quotation.quotation_manager')}
                  type='select'
                  name='quotation_manager'
                  defaultValue={quotationChange.quotation_manager}
                  options={usersForSelection}
                  onChange={handleSelectChange}
                />
              </div>
              <h4 className="h4-price">
                <div style={{ fontSize: 18, fontWeight: 600 }}>{t('common.product')}{t('common.table')}</div>
                <div className="text-end flex-row">
                  <div>
                    <AddBoxOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={handleAddNewContent}
                    />
                    <IndeterminateCheckBoxOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={handleDeleteSelectedConetents}
                      disabled={!selectedContentRowKeys}
                    />
                    {/* <SettingsOutlined
                      style={{ height: 32, width: 32, color: 'gray' }}
                      onClick={() => { setEditHeaders(!editHeaders); }}
                    /> */}
                  </div>
                </div>
              </h4>
              <div className="form-group row">
                <Space
                  align="start"
                  direction="horizontal"
                  size="small"
                  style={{ display: 'flex', marginBottom: '0.5rem' }}
                  wrap
                >
                  <Button>금액 : 얼마얼마얼마</Button>
                  <Checkbox>{t('quotation.tax_included')}</Checkbox>
                  <Checkbox>{t('quotation.total_applied_only')}</Checkbox>
                  <Checkbox>{t('quotation.auto_calculation')}</Checkbox>
                  <Checkbox>{t('quotation.show_decimal')}</Checkbox>
                </Space>
              </div>
              <div className="form-group row">
                <Table
                  rowSelection={rowSelection}
                  pagination={{
                    total: quotationContents.length,
                    showTotal: ShowTotal,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    ItemRender: ItemRender,
                  }}
                  style={{ overflowX: "auto" }}
                  columns={default_columns}
                  bordered
                  dataSource={quotationContents}
                  rowKey={(record) => record['1']}
                // onChange={handleTableChange}
                />
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                  onClick={handleAddNewQuotation}
                >
                  {t('common.save')}
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-secondary btn-rounded"
                  data-bs-dismiss="modal"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* {temporaryContent &&
        <div className="edit-content">
          <div className="edit-content-header">
            <h4>&nbsp;&nbsp;<b>{t('common.edit_content')}</b></h4>
          </div>
          <table className="table">
            <tbody>
              {default_content_array.map((item, index) => {
                if (index % 2 === 0) {
                  if (index !== default_content_array.length - 1) return;
                  return (
                    <tr key={index}>
                      <td>
                        <b>{item.at(1)}</b>
                      </td>
                      <td>
                        <input
                          name={item.at(0)}
                          className="input-group-text input-group-text-sm"
                          type="text"
                          defaultValue={temporaryContent[item.at(0)]}
                          onChange={handleEditTemporaryContent}
                        />
                      </td>
                    </tr>
                  )
                };
                return (
                  <tr key={index}>
                    <td>
                      <b>{default_content_array[index - 1][1]}</b>
                    </td>
                    <td>
                      <input
                        name={default_content_array[index - 1][0]}
                        className="input-group-text input-group-text-sm"
                        type="text"
                        defaultValue={temporaryContent[default_content_array[index - 1][0]]}
                        onChange={handleEditTemporaryContent}
                      />
                    </td>
                    <td>
                      <b>{item.at(1)}</b>
                    </td>
                    <td>
                      <input
                        name={item.at(0)}
                        className="input-group-text input-group-text-sm"
                        type="text"
                        defaultValue={temporaryContent[item.at(0)]}
                        onChange={handleEditTemporaryContent}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!!temporaryContent['10'] &&
            <div>
              <textarea
                className="form-control"
                rows={3}
                placeholder='Comment'
                defaultValue={temporaryContent['998']}
                name='998'
                onChange={handleEditTemporaryContent}
              />
            </div>
          }
          <div className="edit-content-footer" >
            <button
              type="button"
              className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
              onClick={handleSaveTemporaryEdit}
            >
              {t('common.save')}
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-secondary btn-rounded"
              onClick={handleCloseTemporaryEdit}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      } */}
      {/* {editHeaders &&
        <div className="edit-content">
          <div className="edit-content-header">
            <h4><b>{t('quotation.header_setting')}</b></h4>
            <button
              type="button"
              className="edit-content-close"
              onClick={() => { setEditHeaders(!editHeaders) }}
            >
              {" "}
            </button>
          </div>
          <div className="form-group">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">{t('common.title')}</th>
                  <th scope="col">{t('common.visible')}</th>
                  <th scope="col">{t('common.size')}</th>
                </tr>
              </thead>
              <tbody>
                {default_content_array.map((item, index) => {
                  const foundItem = contentColumns.filter(column => column.dataIndex === item.at(0))[0];
                  return (
                    <tr key={index}>
                      <td>
                        {item.at(1)}
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name={item.at(0)}
                          checked={!!foundItem}
                          onChange={handleHeaderCheckChange}
                        />
                      </td>
                      <td>
                        {foundItem ?
                          <input
                            type="text"
                            name={item.at(0)}
                            className="input-group-text input-group-text-sm"
                            defaultValue={foundItem.size}
                            onChange={handleHeaderSizeChange}
                          /> :
                          0
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      } */}
      <QuotationContentModal
        title={subModalSetting.title}
        open={isSubModalOpen}
        original={orgSubModalValues}
        edited={editedSubModalValues}
        handleEdited={handleSubModalItemChange}
        handleOk={handleSubModalOk}
        handleCancel={handleSubModalCancel}
      />
    </div>
  );
};

export default QuotationAddModel;

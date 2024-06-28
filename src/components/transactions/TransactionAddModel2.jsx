import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "antd/dist/reset.css";
import { Button, Checkbox, Col, Row, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { atomCompanyState,
  atomCompanyForSelection,
  defaultTransaction,
} from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { TransactionRepo } from "../../repository/transaction";

import { ConvertCurrency, formatDate } from "../../constants/functions";
import DetailSubModal from "../../constants/DetailSubModal";

const TransactionAddModel = (props) => {
  const { init, handleInit } = props;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);


  //===== [RecoilState] Related with Transaction =====================================
  const { modifyTransaction } = useRecoilValue(TransactionRepo);

  //===== [RecoilState] Related with Company =========================================
  const companyState = useRecoilValue(atomCompanyState);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);


  //===== Handles to edit 'TransactionAddModel' ======================================
  const [transactionChange, setTransactionChange] = useState({});
  const [transactionContents, setTransactionContents] = useState([]);
  const [temporaryContent, setTemporaryContent] = useState(null);
  const [isSale, setIsSale] = useState(true);
  const [selectedContentRowKeys, setSelectedContentRowKeys] = useState([]);

  const handleItemChange = useCallback((e) => {
    const modifiedData = {
      ...transactionChange,
      [e.target.name]: e.target.value,
    };
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleDateChange = useCallback((name, date) => {
    const modifiedData = {
      ...transactionChange,
      [name]: date
    };
    console.log('[handleDateChange] : ', modifiedData);
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleSelectChange = useCallback((name, selected) => {
    console.log('handleSelectChange :', name, selected);
    let modifiedData = null;
    if (name === 'company_name') {
      modifiedData = {
        ...transactionChange,
        company_code: selected.value.company_code,
        company_name: selected.value.company_name,
        company_address: selected.value.company_address,
        ceo_name: selected.value.ceo_name,
        business_type: selected.value.business_type,
        business_item: selected.value.business_item,
        business_registration_code: selected.value.business_registration_code,
      };
    } else {
      if(name === 'transaction_type') {
        if(selected.value === '매출') {
          setIsSale(true);
        } else {
          setIsSale(false);
        };
      };
      modifiedData = {
        ...transactionChange,
        [name]: selected.value,
      };
    };

    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const trans_types = [
    { value: '매출', label: t('company.deal_type_sales') },
    { value: '매입', label: t('company.deal_type_purchase') },
  ];

  const payment_types = [
    { value: '매출', label: t('company.deal_type_sales') },
    { value: '매입', label: t('company.deal_type_purchase') },
  ];

  // --- Functions / Variables dealing with contents -------------------------------
  const rowSelection = {
    selectedRowKeys: selectedContentRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedContentRowKeys(selectedRowKeys);
    },
  };

  const default_columns = [
    {
      title: t('transaction.month_day'),
      dataIndex: 'month_day',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.product'),
      dataIndex: 'product_name',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.standard'),
      dataIndex: 'standard',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.unit'),
      dataIndex: 'unit',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.quantity'),
      dataIndex: 'quantity',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.unit_price'),
      dataIndex: 'unit_price',
      render: (text, record) => <>{ConvertCurrency(text)}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{ConvertCurrency(text)}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: 'tax_price',
      render: (text, record) => <>{ConvertCurrency(text)}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{ConvertCurrency(text)}</>,
    },
    {
      title: t('transaction.modified'),
      dataIndex: 'modify_date',
      render: (text, record) => <>{text}</>,
    },
  ];

  
  //===== Handles to edit 'Contents' =================================================
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [orgContentModalValues, setorgContentModalValues] = useState({});
  const [editedContentModalValues, setEditedContentModalValues] = useState({});
  const [settingForContent, setSettingForContent] = useState({ title: '',
    vat_included: false, show_decimal: false, auto_calc: true, valance_prev: 0, supply_price: 0, tax_price: 0, 
    sum_price: 0, receipt: 0, valance_final: 0, receiver: '', page_cur: 1, page_total: 1, page: '1p'
  });

  const handleContentModalOk = useCallback(() => {
  }, []);

  const handleContentModalCancel = () => {
    setIsContentModalOpen(false);
    setEditedContentModalValues({});
    setorgContentModalValues({});
    setSelectedContentRowKeys([]);
  };

  const handleContentItemChange = useCallback(data => {
    console.log('handleContentItemChange : ', data);
    setEditedContentModalValues(data);
  }, []);

  const initializeTransactionTemplate = useCallback(() => {
    setTransactionChange({ ...defaultTransaction });
    setTransactionContents([]);

    document.querySelector("#add_new_transaction_form").reset();

    handleInit(!init);
  }, [handleInit, init]);


  useEffect(() => {   
    console.log('Company called!');
    if((companyState & 1) === 0) {
      loadAllCompanies();
    };
  }, [companyState, loadAllCompanies]);

  useEffect(() => {
    console.log('[TransactionAddModel] called!');
    if(init) {
      initializeTransactionTemplate();
      handleInit(!init);
    };
  }, [handleInit, init, initializeTransactionTemplate]);

  return (
    <div
      className="modal right fade"
      id="add_new_transaction2"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
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
            <h4 className="modal-title"><b>{t('transaction.add_transaction')}</b></h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form className="forms-sampme" id="add_new_transaction_form">
              <div className="card p-3">
                <Row>
                  <Col flex={13}>
                    <Row justify="space-around" align="middle">
                      <Col className="trans_title">{t("transaction.statement_of_account")}</Col>
                    </Row>
                    <Row justify="space-around" align="middle">
                      <Col flex={2}>
                        <Row justify='end' style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>{t('common.type2')} : </Col>
                        </Row>
                        <Row justify='end' style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>{t('transaction.customer_name')}: </Col>
                        </Row>
                      </Col>
                      <Col flex={3}>
                        <Row justify='space-between' style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <Select
                              className="trans_select"
                              defaultValue='매출'
                              onChange={selected => handleSelectChange('transaction_type', selected)}
                              options={trans_types}
                            />
                          </Col>
                          <Col>{t('transaction.publish_date')} : </Col>
                        </Row>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <Select
                              className="trans_select"
                              defaultValue={null}
                              onChange={selected => handleSelectChange('company_name', selected)}
                              options={companyForSelection}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col flex={3}>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <DatePicker
                              name="publish_date"
                              selected={ transactionChange['publish_date'] }
                              onChange={ (date) => handleDateChange('publish_date', date) }
                              dateFormat="yyyy-MM-dd"
                              className="trans_date"
                            />
                          </Col>
                        </Row>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <Button style={{width: 80}}>{t('transaction.issue')}</Button>
                            <Button style={{width: 80}}>{t('common.cancel')}</Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={10} className={`trans_receiver ${!isSale && 'trans_pur'}`}>
                    <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`} >{isSale? t('transaction.receiver') : t('transaction.supplier')}</Col>
                    <Col flex='auto' align='strech'>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.register_no')}</Col>
                        <Col flex='auto'><label>{transactionChange['business_registration_code']}</label></Col>
                      </Row>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.company_name')}</Col>
                        <Col flex={1} className={`trans_rec_content ${!isSale && 'trans_pur'}`}><label>{transactionChange['company_name']}</label></Col>
                        <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('common.name2')}</Col>
                        <Col flex={1}><label>{transactionChange['ceo_name']}</label></Col>
                      </Row>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.address')}</Col>
                        <Col flex='auto'><label>{transactionChange['company_address']}</label></Col>
                      </Row>
                      <Row style={{ height: 42 }}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('company.business_type')}</Col>
                        <Col flex={1} className={`trans_rec_content ${!isSale && 'trans_pur'}`}><label>{transactionChange['business_type']}</label></Col>
                        <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('company.business_item')}</Col>
                        <Col flex={1}><label>{transactionChange['business_item']}</label></Col>
                      </Row>
                    </Col>
                  </Col>
                </Row>
                <Row align='middle'>
                  <Col flex={13} className={`trans_cell_left ${!isSale && "trans_pur"}`}>
                    <Button>{t('transaction.add_content')}</Button>
                    <Button>{t('transaction.remove_selects')}</Button>
                    <Button>{t('transaction.move_up')}</Button>
                    <Button>{t('transaction.move_down')}</Button>
                  </Col>
                  <Col flex={12} className={`trans_cell_right ${!isSale && "trans_pur"}`}>
                    <div style={{ flexGrow: 1 }}>{t('transaction.tax_type')} : </div>
                    <div style={{ flexGrow: 3 }}>
                      <select name='vat_type'>
                        <option value='vat_excluded'>{t('quotation.vat_excluded')}</option>
                        <option value='vat_included'>{t('quotation.vat_included')}</option>
                      </select>
                    </div>
                    <div style={{ flexGrow: 3 }}>
                      <Checkbox>{t('quotation.show_decimal')}</Checkbox>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col flex='auto' className={`trans_table ${!isSale && "trans_pur"}`}>
                    <Table
                      rowSelection={rowSelection}
                      pagination={{
                        total: transactionContents.length,
                        showTotal: ShowTotal,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        ItemRender: ItemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={default_columns}
                      bordered
                      dataSource={transactionContents}
                      rowKey={(record) => record.trasaction_index}
                      onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (event) => {
                              console.log('Double Click');
                            }, // click row
                        };
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col flex={5} className={`trans_border_left ${!isSale && "trans_pur"}`}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.balance_prev')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(settingForContent.valance_prev)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.receipt')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(settingForContent.receipt)}
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={5}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.supply_price')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(settingForContent.supply_price)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.balance_total')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(settingForContent.valance_final)}
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={5}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.tax_price')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(settingForContent.tax_price)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right ">
                        {t('transaction.receiver2')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {settingForContent.receiver===''? "N/A" : settingForContent.receiver}
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={5} className={`trans_border_right ${!isSale && "trans_pur"}`}>
                    <Row>
                      <Col flex='auto' className="trans_amt_title">
                        {t('transaction.sum_price')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(settingForContent.sum_price)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title">
                        {t('transaction.trans_pages')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt ${!isSale && "trans_pur"}`}>
                        {`${settingForContent.page_cur}/${settingForContent.page_total}/${settingForContent.page}`}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </form>
          </div>
        </div>
      </div>
      <DetailSubModal
        title={t('transaction.receipt_ticket')}
        open={isContentModalOpen}
        item={[
          { name: 'month_day', title: t('common.price_1'), detail: { type: 'price' } },
          { name: 'product_name', title: t('common.price_1'), detail: { type: 'select' } },
          { name: 'standard', title: t('common.price_1'), detail: { type: 'select' } },
          { name: 'quantity', title: t('common.price_1'), detail: { type: 'select' } },
          { name: 'unit_price', title: t('common.price_1'), detail: { type: 'select' } },
          { name: 'supply_price', title: t('common.price_1'), detail: { type: 'select' } },
          { name: 'tax_price', title: t('common.price_1'), detail: { type: 'select' } },
        ]}
        original={orgContentModalValues}
        edited={editedContentModalValues}
        handleEdited={handleContentItemChange}
        handleOk={handleContentModalOk}
        handleCancel={handleContentModalCancel}
      />
    </div>
  );
};

export default TransactionAddModel;

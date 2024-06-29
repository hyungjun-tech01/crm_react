import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "antd/dist/reset.css";
import { Button, Checkbox, Col, Input, Row, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  atomCompanyState,
  atomCompanyForSelection,
  atomProductClassList,
  atomAllProducts,
  atomProductOptions,
  atomProductClassListState,
  atomProductsState,
  defaultTransaction,
} from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { ProductClassListRepo } from "../../repository/product";
import { ProductRepo } from "../../repository/product";
import { DefaultTransactionContent, TransactionRepo } from "../../repository/transaction";

import { ConvertCurrency, formatDate } from "../../constants/functions";
import TransactionContentModal from "./TransactionContentModal";
import TransactionReceiptModal from "./TransactionReceiptModal";
import MessageModal from "../../constants/MessageModal";

const TransactionAddModel = (props) => {
  const { init, handleInit } = props;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);
  const [ isMessageModalOpen, setIsMessageModalOpen ] = useState(false);
  const [ message, setMessage ] = useState({title:'', message: ''});


  //===== [RecoilState] Related with Transaction =====================================
  const { modifyTransaction } = useRecoilValue(TransactionRepo);


  //===== [RecoilState] Related with Company =========================================
  const companyState = useRecoilValue(atomCompanyState);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);


  //===== [RecoilState] Related with Product =========================================
  const allProductClassList = useRecoilValue(atomProductClassList);
  const { loadAllProductClassList } = useRecoilValue(ProductClassListRepo);
  const allProducts = useRecoilValue(atomAllProducts);
  const { loadAllProducts } = useRecoilValue(ProductRepo);
  const [productOptions, setProductOptions] = useRecoilState(atomProductOptions);


  //===== Handles to edit 'TransactionAddModel' ======================================
  const productClassState = useRecoilValue(atomProductClassListState);
  const productState = useRecoilValue(atomProductsState);
  const [transactionChange, setTransactionChange] = useState({});
  const [transactionContents, setTransactionContents] = useState([]);
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
      if (name === 'transaction_type') {
        if (selected.value === '매출') {
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


  // --- Functions / Variables dealing with contents -------------------------------
  const rowSelection = {
    selectedRowKeys: selectedContentRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selected :', selectedRowKeys);
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
  const [dataForTransaction, setDataForTransaction] = useState({
    title: '',
    vat_included: false, show_decimal: false, auto_calc: true, valance_prev: 0, supply_price: 0, tax_price: 0,
    total_price: 0, receipt: 0, valance_final: 0, receiver: '', page_cur: 1, page_total: 1, page: '1p'
  });
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [orgContentModalData, setOrgContentModalData] = useState({});
  const [editedContentModalData, setEditedContentModalData] = useState({});

  const handleAmountCalculation = (data) => {
    let supply_price = 0, tax_price = 0, total_price = 0;
    data.forEach(item => {
      supply_price += item.supply_price;
      tax_price += item.tax_price;
      total_price += item.total_price;
    });
    console.log('handleAmountCalculation : ', supply_price, tax_price, total_price);
    const valance_final = dataForTransaction.valance_prev + total_price - dataForTransaction.receipt;
    const tempData = {
      ...dataForTransaction,
      supply_price: supply_price,
      tax_price: tax_price,
      total_price: total_price,
      valance_final: valance_final,
    };
    setDataForTransaction(tempData);
  };
  
  const handleStartAddContent = () => {
    if(!transactionChange['company_code']) return;
    const tempData = {
      ...dataForTransaction,
      title: t('quotation.add_content'),
    };
    setDataForTransaction(tempData);
    setOrgContentModalData({...DefaultTransactionContent});
    setEditedContentModalData({});
    setIsContentModalOpen(true);
  };

  const handleStartEditContent = (data) => {
    const tempData = {
      ...data,
      title: `${t('common.item')} ${t('common.edit')}`,
    };
    setDataForTransaction(tempData);
    setOrgContentModalData({...DefaultTransactionContent});
    setEditedContentModalData({});
    setIsContentModalOpen(true);
  };

  const handleContentModalOk = () => {
    if(!editedContentModalData['transaction_date']){
      const tempMsg = {title: '확인', message: '거래일 정보가 누락되었습니다.'}
      setMessage(tempMsg);
      setIsMessageModalOpen(true);
      return;
    };

    setIsContentModalOpen(false);
    const inputData = new Date(editedContentModalData.transaction_date);
    const tempDate = `${inputData.getMonth()+1}.${inputData.getDate()}`;
    const tempContent = {
      ...orgContentModalData,
      ...editedContentModalData,
      month_day: tempDate,
      trasaction_sub_index: transactionContents.length + 1,
      lead_code: transactionChange.company_code,
      company_name: transactionChange.company_name,
      transaction_sub_type: dataForTransaction.payment_type,
      modify_date: formatDate(new Date()),
    };
    delete tempContent.transaction_date;
    delete tempContent.product_class_name;

    const tempContents = transactionContents.concat(tempContent);
    setTransactionContents(tempContents);
    handleAmountCalculation(tempContents);
    setIsContentModalOpen(false);
    setOrgContentModalData({...DefaultTransactionContent});
    setEditedContentModalData({});
  };

  const handleContentModalCancel = () => {
    setIsContentModalOpen(false);
    setEditedContentModalData({});
    setOrgContentModalData({});
    setSelectedContentRowKeys([]);
  };

  const handleContentDelete = () => {
    if(selectedContentRowKeys.length ===0) return;
    const tempContents = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.trasaction_sub_index) === -1);
    setTransactionContents(tempContents);
    setSelectedContentRowKeys([]);
  };

  const handleContentMoveUp = () => {
    if(selectedContentRowKeys.length === 0) return;
    selectedContentRowKeys.sort();
    console.log('handleContentMoveUp : ', selectedContentRowKeys);
    
    let tempContents = null;
    let startIdx = 0;
    const selecteds = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.trasaction_sub_index) !== -1);
    const unselecteds = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.trasaction_sub_index) === -1);
    const firstIdx = selectedContentRowKeys[0];
    if(firstIdx === 1){
      tempContents = [
        ...selecteds,
        ...unselecteds,
      ];
      startIdx = 1;
    } else {
      tempContents = [
        ...unselecteds.slice(0, firstIdx - 2),
        ...selecteds,
        ...unselecteds.slice(firstIdx - 2, ),
      ];
      startIdx = firstIdx - 1;
    };
    const finalContents = tempContents.map((item, index) => {
      const temp3 = {
        ...item,
        trasaction_sub_index: index + 1,
      };
      return temp3;
    });
    setTransactionContents(finalContents);

    let tempKeys = [];
    for(let i = 0; i<selecteds.length; i++, startIdx++){
      tempKeys.push(startIdx);
    }
    setSelectedContentRowKeys(tempKeys);
  };

  const handleContentMoveDown = () => {
    if(selectedContentRowKeys.length === 0) return;
    selectedContentRowKeys.sort();
    console.log('handleContentMoveDown :', selectedContentRowKeys);

    let tempContents = null;
    let startIdx = 0;
    const selecteds = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.trasaction_sub_index) !== -1);
    const unselecteds = transactionContents.filter(item => selectedContentRowKeys.indexOf(item.trasaction_sub_index) === -1);
    const lastIdx = selectedContentRowKeys.at(-1);
    if(lastIdx === transactionContents.length){
      tempContents = [
        ...unselecteds,
        ...selecteds,
      ];
      startIdx=lastIdx;
    } else {
      tempContents = [
        ...unselecteds.slice(0, lastIdx),
        ...selecteds,
        ...unselecteds.slice(lastIdx, ),
      ];
      startIdx=lastIdx + 1;
    };
    const finalContents = tempContents.map((item, index) => {
      const temp3 = {
        ...item,
        trasaction_sub_index: index + 1,
      };
      return temp3;
    });
    setTransactionContents(finalContents);
    console.log('handleContentMoveUp / final value: ', finalContents);

    let tempKeys = [];
    for(let i = 0; i<selecteds.length; i++){
      tempKeys.push(startIdx--);
    }
    setSelectedContentRowKeys(tempKeys);
    console.log('handleContentMoveDown / final key : ', tempKeys);
  };


  //===== Handles to edit 'Receipt' ==============================================
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [orgReceiptModalData, setOrgReceiptModalData] = useState({});
  const [editedReceiptModalData, setEditedReceiptModalData] = useState({});

  const handleStartEditReceipt = () => {
    if(!orgReceiptModalData['payment_amount']){
      const tempReceipt = {
        payment_amount: 0,
        payment_type: '현금',
        payment_org: '',
        payment_code: '',
      };
      setOrgReceiptModalData(tempReceipt);
    };
    setIsReceiptModalOpen(true);
  };

  const handleReceiptModalOk = () => {
    setIsReceiptModalOpen(false);
    const tempOrgData = {
      ...orgReceiptModalData,
      ...editedReceiptModalData
    };
    setOrgReceiptModalData(tempOrgData);
    setEditedReceiptModalData({});
    console.log('[handleReceiptModalOk] ', tempOrgData);
    
    const temp_valance= dataForTransaction.valance_prev + dataForTransaction.total_price - tempOrgData.payment_amount;
    const tempData={
      ...dataForTransaction,
      receipt: tempOrgData.payment_amount,
      valance_final: temp_valance,
    };
    setDataForTransaction(tempData);
  };

  const handleReceiptModalCancel = () => {
    setIsReceiptModalOpen(false);
    setEditedReceiptModalData({});
  };

  //===== Handles for special actions =============================================
  const initializeTransactionTemplate = useCallback(() => {
    setTransactionChange({ ...defaultTransaction });
    setTransactionContents([]);
    setOrgReceiptModalData({});
    setEditedReceiptModalData({});

    document.querySelector("#add_new_transaction_form").reset();

    handleInit(!init);
  }, [handleInit, init]);

  //===== useEffect ==============================================================
  useEffect(() => {
    console.log('Company called!');
    if ((companyState & 1) === 0) {
      loadAllCompanies();
    };
  }, [companyState, loadAllCompanies]);

  useEffect(() => {
    console.log('[TransactionAddModel] called!');
    if (init) {
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
                              selected={transactionChange['publish_date']}
                              onChange={(date) => handleDateChange('publish_date', date)}
                              dateFormat="yyyy-MM-dd"
                              className="trans_date"
                            />
                          </Col>
                        </Row>
                        <Row style={{ fontSize: 15, padding: '0.25rem 0.5rem' }}>
                          <Col>
                            <Button style={{ width: 150 }}>{t('transaction.issue')}</Button>
                            <Button style={{ width: 80 }}>{t('common.cancel')}</Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={10} className={`trans_receiver ${!isSale && 'trans_pur'}`}>
                    <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`} >{isSale ? t('transaction.receiver') : t('transaction.supplier')}</Col>
                    <Col flex='auto' align='strech'>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.register_no')}</Col>
                        <Col flex='auto'>
                          <Input
                            name='business_registration_code'
                            value={transactionChange['business_registration_code']}
                            onChange={handleItemChange}
                          />
                        </Col>
                      </Row>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.company_name')}</Col>
                        <Col flex={1} className={`trans_rec_content ${!isSale && 'trans_pur'}`}>
                          <label>{transactionChange['company_name']}</label>
                        </Col>
                        <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('common.name2')}</Col>
                        <Col flex={1}>
                          <Input
                            name='ceo_name'
                            value={transactionChange['ceo_name']}
                            onChange={handleItemChange}
                          />
                        </Col>
                      </Row>
                      <Row className={`trans_rec_item ${!isSale && 'trans_pur'}`}>
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('transaction.address')}</Col>
                        <Col flex='auto'>
                          <Input
                            name='company_address'
                            value={transactionChange['company_address']}
                            onChange={handleItemChange}
                          />
                        </Col>
                      </Row>
                      <Row className="trans_rec_item_last">
                        <Col flex='125px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('company.business_type')}</Col>
                        <Col flex={1} className={`trans_rec_content ${!isSale && 'trans_pur'}`}>
                          <Input
                            name='business_type'
                            value={transactionChange['business_type']}
                            onChange={handleItemChange}
                          />
                        </Col>
                        <Col flex='25px' className={`trans_rec_title ${!isSale && 'trans_pur'}`}>{t('company.business_item')}</Col>
                        <Col flex={1}>
                          <Input
                            name='business_item'
                            value={transactionChange['business_item']}
                            onChange={handleItemChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                </Row>
                <Row align='middle'>
                  <Col flex={13} className={`trans_cell_left ${!isSale && "trans_pur"}`}>
                    <Button onClick={handleStartAddContent}>{t('transaction.add_content')}</Button>
                    <Button onClick={handleContentDelete} disabled={selectedContentRowKeys.length === 0}>{t('transaction.remove_selects')}</Button>
                    <Button onClick={handleContentMoveUp} disabled={selectedContentRowKeys.length === 0}>{t('transaction.move_up')}</Button>
                    <Button onClick={handleContentMoveDown} disabled={selectedContentRowKeys.length === 0}>{t('transaction.move_down')}</Button>
                  </Col>
                  <Col flex={12} className={`trans_cell_right ${!isSale && "trans_pur"}`}>
                    <div style={{ flexGrow: 1 }}>{t('transaction.tax_type')} : </div>
                    <div style={{ flexGrow: 3 }}>
                      <select
                        name='vat_type'
                        onChange={(e)=>{
                          const tempValues = {
                            ...dataForTransaction,
                            vat_included: e.target.value === 'vat_included',
                          };
                          setDataForTransaction(tempValues);
                        }}
                      >
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
                      rowKey={(record) => record.trasaction_sub_index}
                      onRow={(record, rowIndex) => {
                        return {
                          onDoubleClick: (event) => {
                            console.log('Double Click / Edit - ', record);
                            handleStartEditContent(record);
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
                        {ConvertCurrency(dataForTransaction.valance_prev)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right" onClick={handleStartEditReceipt}>
                        {t('transaction.receipt')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(dataForTransaction.receipt)}
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
                        {ConvertCurrency(dataForTransaction.supply_price)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right">
                        {t('transaction.balance_total')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {ConvertCurrency(dataForTransaction.valance_final)}
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
                        {ConvertCurrency(dataForTransaction.tax_price)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title right ">
                        {t('transaction.receiver2')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt right ${!isSale && "trans_pur"}`}>
                        {dataForTransaction.receiver === '' ? "N/A" : dataForTransaction.receiver}
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
                        {ConvertCurrency(dataForTransaction.total_price)}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className="trans_amt_title">
                        {t('transaction.trans_pages')}
                      </Col>
                    </Row>
                    <Row>
                      <Col flex='auto' className={`trans_amt ${!isSale && "trans_pur"}`}>
                        {`${dataForTransaction.page_cur}/${dataForTransaction.page_total}/${dataForTransaction.page}`}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </form>
          </div>
        </div>
      </div>
      <TransactionContentModal
        setting={dataForTransaction}
        open={isContentModalOpen}
        original={orgContentModalData}
        edited={editedContentModalData}
        handleEdited={setEditedContentModalData}
        handleOk={handleContentModalOk}
        handleCancel={handleContentModalCancel}
      />
      <TransactionReceiptModal
        open={isReceiptModalOpen}
        original={orgReceiptModalData}
        edited={editedReceiptModalData}
        handleEdited={setEditedReceiptModalData}
        handleOk={handleReceiptModalOk}
        handleCancel={handleReceiptModalCancel}
      />
      <MessageModal
        title={message.title}
        message={message.message}
        open={isMessageModalOpen}
        handleOk={()=>setIsMessageModalOpen(false)}
      />
    </div>
  );
};

export default TransactionAddModel;

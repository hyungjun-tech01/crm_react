import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "antd/dist/reset.css";
import { Col, Row, Table } from 'antd';
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import "../antdstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AddBoxOutlined, ModeEdit, IndeterminateCheckBoxOutlined } from '@mui/icons-material';

import { LeadRepo } from "../../repository/lead";
import { TransactionRepo } from "../../repository/transaction";
import { atomAllCompanies, atomAllLeads, defaultTransaction } from "../../atoms/atoms";
import { ConvertCurrency, formatDate } from "../../constants/functions";

const default_transaction_content = {
  "transaction_code": null,
  "month_day": null,
  "product_name": null,
  "standard": null,
  "unit": null,
  "quantity": 0,
  "unit_price": 0,
  "supply_price": 0,
  "tax_price": 0,
  "total_price": 0,
  "memo": null,
  "trasaction_sub_index": null,
  "lead_code": null,
  "company_name": null,
  "statement_number": null,
  "transaction_sub_type": null,
  "modify_date": null,
};

const trans_key_to_name = {
  "transaction_code": '거래코드',
  "month_day": '월일',
  "product_name": '품목',
  "standard": '규격',
  "unit": '단위',
  "quantity": '수량',
  "unit_price": '단가',
  "supply_price": '공급가액',
  "tax_price": '세액',
  "total_price": '합계금액',
  "memo": '비고',
  "trasaction_sub_index": '순번',
  "lead_code": '거래처코드',
  "company_name": '거래처명',
  "statement_number": '전표번호',
  "transaction_sub_type": '구분',
  "modify_date": '날짜',
};

const TransactionAddModel = (props) => {
  const { init, handleInit } = props;
  const allCompanyData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const { loadAllLeads } = useRecoilValue(LeadRepo);
  const { modifyTransaction } = useRecoilValue(TransactionRepo);
  const [ cookies] = useCookies(["myLationCrmUserId"]);
  const { t } = useTranslation();

  const [ leadsForSelection, setLeadsForSelection ] = useState([]);
  const [ selectedCompany, setSelectedCompany ] = useState(null);
  const [ transactionChange, setTransactionChange ] = useState(null);
  const [ publishDate, setPublishDate ] = useState(new Date());

  const [ transactionContents, setTransactionContents ] = useState([]);
  const [ temporaryContent, setTemporaryContent ] = useState(null);
  const [ selectedRows, setSelectedRows ] = useState([]);

  const [ supplyPrice, setSupplyPrice ] = useState(0);
  const [ taxyPrice, setTaxPrice ] = useState(0);
  const [ totalPrice, setTotalPrice ] = useState(0);

  
  // --- Functions / Variables dealing with editing -------------------------------
  const selectLeadRef = useRef(null);

  const handleSelectLead= useCallback((value) => {
    if(value) {
      const tempChanges = {
        ...transactionChange,
        lead_code: value.value.lead_code,
        company_code: value.value.company_code,
        company_name: value.value.company_name,
        ceo_name: value.value.ceo_name,
        address: value.value.company_address,
        business_type: value.value.business_type,
        business_item: value.value.business_item,
        business_reg_code: value.value.business_registration_code,
      };
      setTransactionChange(tempChanges);
      setSelectedCompany(value.value.company_code)
    }
  }, [transactionChange]);

  const handlePublishDateChange = useCallback((date) => {
    setPublishDate(date);
    const localDate = formatDate(date);
    const tempChanges = {
      ...transactionChange,
      publish_date: localDate,
    };
    setTransactionChange(tempChanges);
  }, [transactionChange]);

  // --- Functions / Variables dealing with contents -------------------------------
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRows(selectedRows);
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
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.supply_price'),
      dataIndex: 'supply_price',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.tax_price'),
      dataIndex: 'tax_price',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.total_price'),
      dataIndex: 'total_price',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('transaction.modified'),
      dataIndex: 'modify_date',
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.edit'),
      render: (text, record) => (
        <div className="dropdown dropdown-action text-center">
          <ModeEdit onClick={() => {
            handleLoadSelectedContent(record);
          }} />
        </div>
      ),
    },
  ];

  const handleLoadNewTemporaryContent = useCallback(() => {
    if(!transactionChange.company_name) {
      console.log('\t[handleLoadNewTemporaryContent] No company is selected');
      return;
    };

    const tempContent = {
      ...default_transaction_content,
      trasaction_sub_index: transactionContents.length,
      company_name: transactionChange.company_name,
    };
    setTemporaryContent(tempContent);
  }, [transactionContents, transactionChange]);

  const handleLoadSelectedContent = useCallback((data) => {
    setTemporaryContent(data);
  }, [setTemporaryContent]);

  const handleDeleteSelectedConetents = useCallback(()=>{
    if(selectedRows.length === 0) {
      console.log('\t[handleDeleteSelectedConetents] No row is selected');
      return;
    };

    let tempContents=[
      ...transactionContents
    ];
    selectedRows.forEach(row => {
      const filteredContents = tempContents.filter(item => item.trasaction_sub_index !== row.trasaction_sub_index);
      tempContents = filteredContents;
    });
    let temp_supply_price = 0;
    let temp_tax_price = 0;
    let temp_total_price = 0;
    const finalContents = tempContents.map((item, index) => {
      temp_supply_price += item.supply_price;
      temp_tax_price += item.tax_price;
      temp_total_price += item.total_price;
      return { ...item, trasaction_sub_index: index};
    });
    const tempTransaction = {
      ...transactionChange,
      supply_price: temp_supply_price,
      tax_price: temp_tax_price,
      total_price: temp_total_price,
    };
    setTransactionChange(tempTransaction);
    console.log('handleDeleteSelectedConetents / final : ', finalContents);
    setTransactionContents(finalContents);
  }, [selectedRows, transactionContents, transactionChange, setTransactionContents, setTransactionChange]);

  const handleEditTemporaryContent = useCallback((event) => {
    let temp_value = null;
    let tempContent = {
      ...temporaryContent
    };
    if(event.target.name === 'unit_price') {
      temp_value = Number(event.target.value);
      if(isNaN(temp_value)) {
        console.log('\t[ handleEditTemporaryContent ] Wrong input value');
        return;
      };
      if(temp_value !== 0) {
        tempContent.unit_price = temp_value;
        if(tempContent.quantity !== 0) {
          tempContent.supply_price = temp_value * tempContent.quantity;
          tempContent.tax_price = tempContent.supply_price*0.1;
          tempContent.total_price = tempContent.supply_price + tempContent.tax_price;
          setSupplyPrice(tempContent.supply_price);
          setTaxPrice(tempContent.tax_price);
          setTotalPrice(tempContent.total_price);
        };
      }
    } else if(event.target.name === 'quantity'){
      temp_value = Number(event.target.value);
      if(isNaN(temp_value)) {
        console.log('\t[ handleEditTemporaryContent ] Wrong input value');
        return;
      };
      if(temp_value !== 0) {
        tempContent.quantity = temp_value;
        if(tempContent.unit_price !== 0) {
          tempContent.supply_price = temp_value * tempContent.unit_price;
          tempContent.tax_price = tempContent.supply_price*0.1;
          tempContent.total_price = tempContent.supply_price + tempContent.tax_price;
          setSupplyPrice(tempContent.supply_price);
          setTaxPrice(tempContent.tax_price);
          setTotalPrice(tempContent.total_price);
        };
      }
      
    } else {
      tempContent[event.target.name] = event.target.value;
    }
    
    setTemporaryContent(tempContent);
  }, [temporaryContent, setTemporaryContent]);

  const handleSaveTemporaryEdit = useCallback(() => {
    const contentToSave = {
      ...temporaryContent
    };
    const temp_index = contentToSave.trasaction_sub_index;
    let tempContents = [];
    let temp_supply_price = contentToSave.supply_price;
    let temp_tax_price = contentToSave.tax_price;
    let temp_total_price = contentToSave.total_price;

    temp_supply_price += transactionChange.supply_price;
    temp_tax_price = transactionChange.tax_price;
    temp_total_price = transactionChange.total_price;

    if (temp_index === transactionContents.length) {
      tempContents = [
        ...transactionContents,
        contentToSave
      ];
    } else {
      temp_supply_price -= transactionContents[temp_index].supply_price;
      temp_tax_price -= transactionContents[temp_index].tax_price;
      temp_total_price -= transactionContents[temp_index].total_price;
      tempContents = [
        ...transactionContents.slice(0, temp_index),
        contentToSave,
        ...transactionContents.slice(temp_index + 1,)
      ];
    }
    setTransactionContents(tempContents);

    const tempTransactionChange = {
      ...transactionChange,
      supply_price: temp_supply_price,
      tax_price: temp_tax_price,
      total_price: temp_total_price,
    };
    setTransactionChange(tempTransactionChange);
    setTemporaryContent(null);
    setSupplyPrice(0);
    setTaxPrice(0);
    setTotalPrice(0);
  }, [temporaryContent, transactionContents, setTransactionContents, setTemporaryContent]);

  const handleCloseTemporaryEdit = useCallback(() => {
    setTemporaryContent(null);
    setTemporaryContent(null);
    setSupplyPrice(0);
    setTaxPrice(0);
    setTotalPrice(0);
  }, [setTemporaryContent]);

  // --- Functions used for adding/editing new transaction ------------------------------
  const initializeTransactionTemplate = useCallback(() => {
    console.log('\tinitializeTransactionTemplate called : ', init);
    setTransactionChange({ ...defaultTransaction });
    setPublishDate(null);
    setSelectedCompany(null);
    setTransactionContents([]);

    if(selectLeadRef.current)
      selectLeadRef.current.clearValue();

    document.querySelector("#add_new_transaction_form").reset();

    setSupplyPrice(0);
    setTaxPrice(0);
    setTotalPrice(0);

    handleInit(!init);
  }, [selectLeadRef.current, defaultTransaction]);

  const handleTransactionChange = useCallback((e) => {
    const modifiedData = {
      ...transactionChange,
      [e.target.name]: e.target.value,
    };
    setTransactionChange(modifiedData);
  }, [transactionChange]);

  const handleAddNewTransaction = useCallback((event) => {
    // Check data if they are available
    if (transactionChange.company_name === null
      || transactionChange.company_name === ''
      || transactionContents.length === 0
    ) {
      console.log("Necessary information isn't submitted!");
      return;
    };
    const newTransactionData = {
      ...transactionChange,
      transaction_contents: JSON.stringify(transactionContents),
      action_type: 'ADD',
      modify_user: cookies.myLationCrmUserId,
    };
    console.log(`[ handleAddNewTransaction ]`, newTransactionData);
    const result = modifyTransaction(newTransactionData);
    if (result) {
      initializeTransactionTemplate();
      //close modal ?
    };
  }, [transactionChange, transactionContents, cookies.myLationCrmUserId, modifyTransaction, initializeTransactionTemplate]);


  useEffect(() => {
    // ----- Load companies and set up the relation between lead and company by company code ---
    // if (allCompanyData.length === 0) {
    //   loadAllCompanies();
    // };

    // ----- Load Leads and set up the options of lead to select -----
    if (allLeadData.length === 0) {
      loadAllLeads();
    } else {
      if(allCompanyData.length > 0) {
        const temp_data = allLeadData.map(lead => {
          const foundIdx = allCompanyData.findIndex(com => com.company_code === lead.company_code);
          if(foundIdx !== -1) {
            const foundCompany = allCompanyData[foundIdx];
            return {
              label: lead.lead_name + " / " + lead.company_name,
              value: {
                lead_code: lead.lead_code,
                company_code: foundCompany.company_code,
                company_name: foundCompany.company_name,
                ceo_name: foundCompany.ceo_name,
                address: foundCompany.company_address,
                business_type: foundCompany.business_type,
                business_item: foundCompany.business_item,
                business_reg_code: foundCompany.business_registration_code,
              }
            };
          };
          return {
            label: lead.lead_name + " / " + lead.company_name,
            value: {
              lead_code: lead.lead_code,
              company_code: lead.company_code,
              company_name: lead.company_name,
              ceo_name: null,
              address: null,
              business_type: null,
              business_item: null,
              business_reg_code: null,
            }
          };
        });
        temp_data.sort((a, b) => {
          if (a.label > b.label) {
            return 1;
          }
          if (a.label < b.label) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        setLeadsForSelection(temp_data);
      }
    };

    // ----- Initialize template to store values -----
    if(init) initializeTransactionTemplate();

  }, [allLeadData, init]);

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
                      <Col>거래명세서</Col>
                    </Row>
                    <Row justify="space-around" align="middle">
                      <Col>
                        <Row>
                          <Col>구분: 매출 / 발행일자 : 2024년 6월 25일</Col>
                        </Row>
                        <Row>
                          <Col>거래처명: 신도리코 / 검색, 목록, 추가</Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>                      
                  <Col flex={11} className="trans_cell">
                    <Row>
                      <Col flex='30px' className="trans_cell" >공 급 받 는 자</Col>
                      <Col flex='auto'>
                        <Row align='stretch'>
                          <Col flex='125px' className="trans_cell">등록번호</Col>
                          <Col flex='auto' className="trans_cell">656-40-01152 / 등록정보</Col>
                        </Row>
                        <Row>
                          <Col flex='125px' className="trans_cell">상호(법인명)</Col>
                          <Col flex='auto' className="trans_cell">마이레이션 / 성명 : 이길재</Col>
                          </Row>
                        <Row>
                          <Col flex='125px' className="trans_cell">사업장주소</Col>
                          <Col flex='auto' className="trans_cell">서울금천구 가산동.......</Col>
                          </Row>
                        <Row>
                          <Col flex='125px' className="trans_cell">업 태</Col>
                          <Col flex='auto' className="trans_cell">정보통신업 및 도매 / 종목 : 응용 소프트웨어 개발 및 판매</Col>
                          </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col  flex={13} className="trans_cell">
                    <Row>
                      <Col flex='auto'>열추가/품목추가/세금계산서</Col>
                    </Row>
                    <Row>
                      <Col flex='auto'>열삽입/삭제</Col>
                    </Row>
                  </Col>
                  <Col  flex={11} className="trans_cell">
                    <Row>
                      <Col flex='auto'>과세구분: 부가세별도</Col>
                    </Row>
                    <Row>
                      <Col flex='auto'>소수점(자동)</Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col flex='auto' className="trans_table">
                    <Table
                      rowSelection={{
                        ...rowSelection,
                      }}
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
                    />
                  </Col>
                </Row>
                <Row>
                  <Col flex={5} style={{borderLeft:'2px solid #ff5522'}}>
                    <Row><Col flex='auto' className="trans_title right">전잔액</Col></Row>
                    <Row><Col flex='auto' className="trans_amount">0</Col></Row>
                    <Row><Col flex='auto' className="trans_title right">입금</Col></Row>
                    <Row><Col flex='auto' className="trans_amount">0</Col></Row>
                  </Col>
                  <Col flex={5}>
                    <Row><Col flex='auto' className="trans_title right">공급가액</Col></Row>
                    <Row><Col flex='auto' className="trans_amount">0</Col></Row>
                    <Row><Col flex='auto' className="trans_title right">총잔액</Col></Row>
                    <Row><Col flex='auto' className="trans_amount">0</Col></Row>
                  </Col>
                  <Col flex={5}>
                    <Row><Col flex='auto' className="trans_title right">세액</Col></Row>
                    <Row><Col flex='auto' className="trans_amount">0</Col></Row>
                    <Row><Col flex='auto' className="trans_title right">인수자</Col></Row>
                    <Row><Col flex='auto' className="trans_amount">0</Col></Row>
                  </Col>
                  <Col flex={5} style={{borderRight:'2px solid #ff5522'}}>
                    <Row><Col flex='auto' className="trans_title">합계금액</Col></Row>
                    <Row><Col flex='auto' className="trans_amount_right">0</Col></Row>
                    <Row><Col flex='auto' className="trans_title">현재/전체/Page</Col></Row>
                    <Row><Col flex='auto' className="trans_amount_right">0</Col></Row>
                  </Col>
                </Row>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionAddModel;

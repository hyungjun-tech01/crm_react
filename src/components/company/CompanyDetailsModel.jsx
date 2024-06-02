import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Button, Space, Switch, Table } from "antd";
import { C_logo,  } from "../imagepath";
import { atomAllPurchases, atomAllTransactions, atomCurrentCompany, defaultCompany, defaultPurchase } from "../../atoms/atoms";
import { CompanyRepo } from "../../repository/company";
import { TransactionRepo } from "../../repository/transaction";
import { ProductDataOptions, PurchaseRepo } from "../../repository/purchase";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import DetailSubModal from "../../constants/DetailSubModal";
import { option_locations, option_deal_type } from '../../constants/constans';
import { ItemRender, ShowTotal } from "../paginationfunction";
import { formatDate } from "../../constants/functions";
// import { MoreVert } from "@mui/icons-material";

const CompanyDetailsModel = () => {
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const allTransactions = useRecoilValue(atomAllTransactions);
  const { loadAllTransactions, modifyTransaction } = useRecoilValue(TransactionRepo);
  const allPurchases = useRecoilValue(atomAllPurchases);
  const { loadAllPurchases, modifyPurchase } = useRecoilValue(PurchaseRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
  const { t } = useTranslation();

  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [ isSubModalOpen, setIsSubModalOpen ] = useState(false);
  const [ subModalSetting, setSubModalSetting ] = useState({title:''})
  const [ subModalItems, setSubModalItems ] = useState([]);

  // --- Variables for Details ------------------------------------------------
  const [ editedDetailValues, setEditedDetailValues ] = useState(null);
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);

  // --- Variables for the others except Details -------------------------------
  const [ otherItem, setOtherItem ] = useState(null);
  const [ editedOtherValues, setEditedOtherValues ] = useState(null);
  const [ orgTimeOther, setOrgTimeOther ] = useState(null);
  const [ editedNewValues, setEditedNewValues ] = useState(null);

  // --- Variables for only Purchase ------------------------------------------------
  const [ maContractByCompany, setMaContractByCompany] = useState([]);
  const [ purchaseByCompany, setPurchaseByCompany] = useState([]);
  const [ validMACount, setValidMACount ] = useState(0);
  const [ selectedPurchaseRowKey, setSelectedPurchaseRowKey ] = useState([]);

  const purchase_items_info = [
    ['product_name','purchase.product_name',{ type:'select', options: ProductDataOptions }],
    ['product_type','purchase.product_type',{ type:'label', disabled: true }],
    ['serial_number','purchase.serial',{ type:'label' }],
    ['licence_info','purchase.licence_info',{ type:'label' }],
    ['module','purchase.module',{ type:'label' }],
    ['quantity','common.quantity',{ type:'label' }],
    ['receipt_date','purchase.receipt_date',{ type:'date' }],
    ['delivery_date','purchase.delivery_date',{ type:'date' }],
    ['hq_finish_date','purchase.hq_finish_date',{ type:'date', disabled: true }],
    ['MA_finish_date','purchase.ma_finish_date',{ type:'date', disabled: true }],
  ];

  // --- Variables for only Transaction ------------------------------------------------
  const [ transactionByCompany, setTransactionByCompany] = useState([]);
  

  // --- Funtions for Editing Detail ---------------------------------
  const handleDetailEdit = useCallback((e) => {
    const tempEdited = {
      ...editedDetailValues,
      [e.target.name]: e.target.value,
    };
    console.log('\t[handleDetailEdit] value: ', tempEdited);
    setEditedDetailValues(tempEdited);
  }, [editedDetailValues]);

  const handleDetailSave = useCallback(() => {
    if(editedDetailValues !== null
      && selectedCompany !== defaultCompany)
    {
      const temp_all_saved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        company_code: selectedCompany.company_code,
      };
      if (modifyCompany(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
        if(editedDetailValues.establishment_date){
          setOrgEstablishDate(editedDetailValues.establishment_date);
        };
      } else {
        console.error('Failed to modify company')
      }
    } else {
      console.log("[ CompanyDetailModel ] No saved data");
    };
    setEditedDetailValues(null);
  }, [cookies.myLationCrmUserId, modifyCompany, editedDetailValues, selectedCompany]);

  const handleDetailCancel = useCallback(() => {
    setEditedDetailValues(null);
  }, []);

  // --- Funtions for Specific Changes in Detail ---------------------------------
  const handleDetailDateChange = useCallback((name, date) => {
    const tempEdited = {
      ...editedDetailValues,
      [name]: date,
    };
    setEditedDetailValues(tempEdited);
  }, [editedDetailValues]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    const tempEdited = {
      ...editedDetailValues,
      [name]: selected.value,
    };
    setEditedDetailValues(tempEdited);
  }, [editedDetailValues]);

  // --- Variables for Editing Detail ---------------------------------
  const company_items_info = [
    ['company_address','common.address',{ type:'label', extra:'long' }],
    ['company_phone_number','common.phone_no',{ type:'label' }],
    ['company_zip_code','common.zip_code',{ type:'label' }],
    ['company_fax_number','common.fax_no',{ type:'label' }],
    ['homepage','company.homepage',{ type:'label' }],
    ['company_scale','company.company_scale',{ type:'label' }],
    ['deal_type','company.deal_type', { type:'select', options: option_deal_type.ko, selectChange: (selected) => handleDetailSelectChange('deal_type', selected) }],
    ['industry_type','company.industry_type',{ type:'label' }],
    ['business_type','company.business_type',{ type:'label' }],
    ['business_item','company.business_item',{ type:'label' }],
    ['establishment_date','company.establishment_date',
      { type:'date', orgTimeData: orgEstablishDate, timeDataChange: handleDetailDateChange }
    ],
    ['ceo_name','company.ceo_name',{ type:'label' }],
    ['account_code','company.account_code',{ type:'label' }],
    ['bank_name','company.bank_name',{ type:'label' }],
    ['account_owner','company.account_owner',{ type:'label' }],
    ['sales_resource','company.salesman',{ type:'label' }],
    ['application_engineer','company.engineer',{ type:'label' }],
    ['region','common.region', { type:'select', options: option_locations.ko, selectChange: (selected) => handleDetailSelectChange('region', selected) }],
    ['memo','common.memo',{ type:'textarea', extra:'long' }],
  ];

  // --- Functions for Editing Sub Detail ---------------------------------
  const handleOtherItemChange = useCallback(e => {
    const tempEdited = {
      ...editedOtherValues,
      [e.target.name]: e.target.value,
    };

    setEditedOtherValues(tempEdited);
    console.log('handleOtherItemChange : ', tempEdited);
  }, [editedOtherValues]);

  const handleOtherItemTimeChange = useCallback((name, date) => {
    const tempEdited = {
      ...editedOtherValues,
      [name]: date,
    };
    setEditedOtherValues(tempEdited);
    console.log('handleOtherItemTimeChange : ', tempEdited);
  }, [editedOtherValues]);

  const handleOtherItemSelectChange = useCallback((name, value) => {
    if(name === 'product_name') {
      const tempOther = {
        ...editedOtherValues,
        product_name: value.value.product_name,
        product_type: value.value.product_class,
        product_code: value.value.product_code,
      };
      setEditedOtherValues(tempOther);
    };
  }, [editedOtherValues]);

  const handleOtherItemChangeCancel = useCallback(() => {
    setEditedOtherValues(null);
  }, []);

  const handleOtherItemChangeSave = useCallback((code_name) => {
    if(editedOtherValues){
      const tempSubValues = {
        ...editedOtherValues,
        action_type: "UPDATE",
        company_code: otherItem.company_code,
        modify_user: cookies.myLationCrmUserId,
        [code_name]: otherItem[code_name],
      };
      
      switch(code_name)
      {
        case 'purchase_code':
          if (modifyPurchase(tempSubValues)) {
            console.log(`Succeeded to modify purchase`);
          } else {
            console.error('Failed to modify company')
          };
          break;
        default:
          console.log("handleOtherItemChangeSave / Impossible case!!!");
          break;
      };
      setOrgTimeOther(null);
      setEditedOtherValues(null);
    }
  }, [cookies.myLationCrmUserId, editedOtherValues, otherItem]);

  // --- Functions for Editing New item ---------------------------------
  const handleNewItemChange = useCallback(e => {
    const tempEdited = {
      ...editedNewValues,
      [e.target.name]: e.target.value,
    };

    setEditedNewValues(tempEdited);
    console.log('handleNewItemChange : ', tempEdited);
  }, [editedNewValues]);

  const handleNewItemDateChange = useCallback((name, date) => {
    const tempEdited = {
      ...editedNewValues,
      [name]: date,
    };
    setEditedNewValues(tempEdited);
  }, [editedNewValues]);

  const handleNewItemSelectChange = useCallback((name, value) => {
    if(name === 'product_name') {
      const tempNew = {
        ...editedNewValues,
        product_name: value.value.product_name,
        product_type: value.value.product_class,
        product_code: value.value.product_code,
      };
      setEditedNewValues(tempNew);
    };
  }, [editedNewValues]);

  const handleCancelNewItemChange = useCallback(() => {
    setEditedNewValues(null);
  }, []);

  const handleSaveNewItemChange = useCallback((code_name) => {
    if(editedNewValues){
      const tempSubValues = {
        ...editedNewValues,
        action_type: "ADD",
        company_code: selectedCompany.company_code,
        modify_user: cookies.myLationCrmUserId,
      };
      
      switch(code_name)
      {
        case 'purchase_code':
          if (modifyPurchase(tempSubValues)) {
            console.log(`Succeeded to add purchase`);
            
          } else {
            console.error('Failed to add company')
          };
          break;
        default:
          console.log("handleSaveNewItemChange / Impossible case!!!");
          break;
      };
      setEditedNewValues(null);
    }
  }, [cookies.myLationCrmUserId, editedNewValues, selectedCompany]);

  // --- Funtions for Sub Modal ---------------------------------
  const handleSubModalOk = () => {setIsSubModalOpen(false);};
  const handleSubModalCancel = () => {setIsSubModalOpen(false);};

  const columns_purchase = [
    {
      title: 'No',
      dataIndex: 'index',
      render: (text, record) => <>{record.rowIndex}</>,
    },
    {
      title: t('purchase.product_name'),
      dataIndex: "product_name",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('purchase.product_type'),
      dataIndex: "product_type",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('purchase.serial'),
      dataIndex: "serial_number",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('purchase.delivery_date'),
      dataIndex: "delivery_date",
      render: (text, record) => <>{formatDate(record.delivery_date)}</>,
    },
    {
      title: t('purchase.ma_finish_date'),
      dataIndex: "ma_finish_date",
      render: (text, record) => <>{formatDate(record.ma_finish_date)}</>,
    },
  ];

  const purchaseRowSelection = {
    selectedPurchaseRowKey,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ", selectedRows
      );
      if(selectedRows.length > 0){
        const latestKey = selectedRowKeys.at(-1);
        setOtherItem({...selectedRows.at(-1)});
        setSelectedPurchaseRowKey([selectedRows.at(-1)]);

        const selectedPurchase = purchaseByCompany.filter(item => item.purchase_code === latestKey)[0];
        setEditedOtherValues(null);
        setOrgTimeOther({
          receipt_date: selectedPurchase.receipt_date ? new Date(selectedPurchase.receipt_date) : null,
          delivery_date: selectedPurchase.delivery_date ? new Date(selectedPurchase.delivery_date) : null,
          MA_finish_date: selectedPurchase.MA_finish_date ? new Date(selectedPurchase.MA_finish_date) : null,
          hq_finish_date: selectedPurchase.hq_finish_date ? new Date(selectedPurchase.hq_finish_date) : null,
         });
      } else {
        setOtherItem(null);
        setEditedOtherValues(null);
        setOrgTimeOther(null);
      };
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red",
    }),
  };

  const handleSelecPurchaseRow = useCallback((record)=>{
    setSelectedPurchaseRowKey([record.rowKey]);
  }, []);

  const columns_ma_contract = [
    {
      title: t('contract.contract_date'),
      dataIndex: 'ma_contract_date',
      render: (text, record) => <>{record.rowIndex}</>,
    },
    {
      title: t('contract.end_date'),
      dataIndex: "ma_finish_date",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('contract.end_date'),
      dataIndex: "ma_finish_date",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.price_1'),
      dataIndex: "ma_price",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('purchase.serial'),
      dataIndex: "ma_memo",
      render: (text, record) => <>{text}</>,
    },
  ];

  // --- Funtions for Control Windows ---------------------------------
  const handleWindowWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  const handleClose = useCallback(() => {
    setEditedDetailValues(null);
    setCurrentCompany();
  }, []);

  useEffect(() => {
    if(selectedCompany !== defaultCompany) {
      console.log('[CompanyDetailsModel] called!');
      setOrgEstablishDate(selectedCompany.establishment_date ? new Date(selectedCompany.establishment_date) : null);

      const detailViewStatus = localStorage.getItem("isFullScreen");

      if(detailViewStatus === null){
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if(detailViewStatus === '0'){
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      if(allTransactions.length === 0){
        loadAllTransactions();
      } else {
        const companyTransactions = allTransactions.filter(transaction => transaction.company_name === selectedCompany.company_name);
        setTransactionByCompany(companyTransactions);
      };
      if(allPurchases.length === 0){
        loadAllPurchases();
      } else {
        const companyPurchases = allPurchases.filter(purchase => purchase.company_code === selectedCompany.company_code);
        setPurchaseByCompany(companyPurchases);
        let valid_count = 0;
        companyPurchases.forEach(item => {
          console.log('UseEffect / item.MA_finish_date :', item.ma_finish_date);
          if(new Date(item.ma_finish_date) > Date.now()) valid_count++;
        });
        setValidMACount(valid_count);
        setEditedOtherValues([]);
        setEditedNewValues(null);
      };
    };
  }, [selectedCompany, allTransactions, allPurchases, loadAllTransactions, loadAllPurchases]);

  return (
    <div
      className="modal right fade"
      id="company-details"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      data-bs-focus="false"
    >
      <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="row w-100">
              <div className="col-md-4 account d-flex">
                <div className="company_img">
                  <img src={C_logo} alt="User" className="user-image" />
                </div>
                <div>
                  <p className="mb-0"><b>{t('company.company')}</b></p>
                  <span className="modal-title">
                    {selectedCompany.company_name}
                  </span>
                </div>
              </div>
              <DetailTitleItem
                defaultText={selectedCompany.company_name_eng}
                name='company_name_eng'
                title={t('company.eng_company_name')}
                editing={handleDetailEdit}
              />
              <DetailTitleItem
                defaultText={selectedCompany.business_registration_code}
                name='business_registration_code'
                title={t('company.business_registration_code')}
                editing={handleDetailEdit}
              />
            </div>
            <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWindowWidthChange}/>
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
                    to="#company-details-info"
                    data-bs-toggle="tab"
                  >
                    {t('common.details')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#company-details-product"
                    data-bs-toggle="tab"
                  >
                    {t('purchase.product_info') + "(" + validMACount + "/" + purchaseByCompany.length + ")"}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#company-detail-transaction"
                    data-bs-toggle="tab"
                  >
                    {t('transaction.statement_of_account') + "(" + transactionByCompany.length + ")"}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#company-detail-tax-invoice"
                    data-bs-toggle="tab"
                  >
                    {t('transaction.tax_invoice')}
                  </Link>
                </li>
                {/* <li className="nav-item">
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
                <div className="tab-pane show active" id="company-details-info">
                  <div className="crms-tasks">
                    <div className="tasks__item crms-task-item">
                    <div className="row">
                      <Space
                        align="start"
                        direction="horizontal"
                        size="small"
                        style={{ display: 'flex', marginBottom: '0.5rem' }}
                        wrap
                      >
                        { company_items_info.map((item, index) => 
                          <DetailCardItem
                            key={index}
                            defaultText={selectedCompany[item.at(0)]}
                            edited={editedDetailValues}
                            name={item.at(0)}
                            title={t(item.at(1))}
                            detail={item.at(2)}
                            editing={handleDetailEdit}
                          />
                        )}
                      </Space>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane company-details-product" id="company-details-product">
                  <div className="row">
                    <div className="card mb-0">
                      <div className="table-body">
                        <div className="table-responsive">
                          <Table
                            rowSelection={purchaseRowSelection}
                            pagination={{
                              total:  purchaseByCompany.length,
                              showTotal: ShowTotal,
                              showSizeChanger: true,
                              ItemRender: ItemRender,
                            }}
                            className="table"
                            style={{ overflowX: "auto" }}
                            columns={columns_purchase}
                            dataSource={purchaseByCompany}
                            rowKey={(record) => record.purchase_code}
                            onRow={(record) => ({
                              onClick: () => {
                                handleSelecPurchaseRow(record);
                              }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="card mb-0">
                      
                    { otherItem && 
                        <div>
                          <div style={{fontSize: 15, fontWeight: 600, padding: '0.5rem 0 0 1.0rem'}}>Selected Item</div>
                          <Space
                            align="start"
                            direction="horizontal"
                            size="small"
                            style={{ display: 'flex', marginBottom: '0.5rem', margineTop: '0.5rem' }}
                            wrap
                          >
                            {
                              purchase_items_info.map((item, index) => 
                                <DetailCardItem
                                  key={index}
                                  defaultText={otherItem[item.at(0)]}
                                  edited={editedOtherValues}
                                  name={item.at(0)}
                                  title={t(item.at(1))}
                                  detail={item.at(2).type === 'date' 
                                    ? { type:'date',
                                        disabled: item.at(2).disabled ? true : false,
                                        orgTimeData: orgTimeOther[item.at(0)],
                                        timeDateChange: handleOtherItemTimeChange,
                                      }
                                    : (item.at(2).type === 'select' 
                                      ? { type:'select',
                                          disabled: item.at(2).disabled ? true : false,
                                          options: item.at(2).options,
                                          selectChange: (value) => handleOtherItemSelectChange(item.at(0), value),
                                        } 
                                      : item.at(2))
                                  }
                                  editing={handleOtherItemChange}
                                />
                            )}
                          </Space>
                          <div style={{marginBottom: '0.5rem', display: 'flex'}}>
                            <DetailCardItem
                              defaultText={otherItem["purchase_memo"]}
                              edited={editedOtherValues}
                              name="purchase_memo"
                              title={t('common.memo')}
                              detail={{type:'textarea', extra: 'memo', row_no: 3}}
                              editing={handleOtherItemChange}
                            />
                            <div style={{width: 380, display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'space-evenly'}}>
                              <Button
                                type="primary" 
                                style={{width: '120px'}} 
                                disabled={!editedOtherValues}
                                onClick={()=>handleOtherItemChangeSave('purchase_code')}
                              >
                                {t('common.save')}
                              </Button>
                              <Button 
                                type="primary" 
                                style={{width: '120px'}} 
                                disabled={!editedOtherValues} 
                                onClick={handleOtherItemChangeCancel}
                              >
                                {t('common.cancel')}
                              </Button>
                            </div>
                          </div>
                        </div>
                    }
                    </div>
                  </div>
                  <div className="row">
                    <div className="card mb-0">
                      <>
                        <div style={{fontSize: 15, fontWeight: 600, padding: '0.5rem 0 0 1.0rem'}}>{t('purchase.add_purchase')}</div>
                        <Space
                          align="start"
                          direction="horizontal"
                          size="small"
                          style={{ display: 'flex', marginBottom: '0.5rem', margineTop: '0.5rem' }}
                          wrap
                        >
                        {
                          purchase_items_info.map((item, index) => 
                            <DetailCardItem
                              key={index}
                              defaultText=''
                              edited={editedNewValues}
                              name={item.at(0)}
                              title={t(item.at(1))}
                              detail={item.at(2).type === 'date' 
                                ? {type:'date', orgTimeData: null,
                                    timeDateChange: handleNewItemDateChange }
                                : (item.at(2).type === 'select' 
                                ? { type:'select',
                                    disabled: item.at(2).disabled ? true : false,
                                    options: item.at(2).options,
                                    selectChange: (value) => handleNewItemSelectChange(item.at(0), value),
                                  } 
                                : item.at(2))
                              }
                              editing={handleNewItemChange}
                            />
                        )}
                        </Space>
                        <div style={{marginBottom: '0.5rem', display: 'flex'}}>
                          <DetailCardItem
                            defaultText=''
                            edited={editedNewValues}
                            name="purchase_memo"
                            title={t('common.memo')}
                            detail={{type:'textarea', extra: 'memo', row_no: 3}}
                            editing={handleNewItemChange}
                          />
                          <div style={{width: 380, display: 'flex', flexDirection: 'column', flewGrow: 0, alignItems:'center', justifyContent: 'space-evenly'}}>
                            <Button
                              type="primary" 
                              style={{width: '120px'}} 
                              disabled={!editedNewValues}
                              onClick={()=>handleSaveNewItemChange('purchase_code')}
                            >
                              {t('common.add')}
                            </Button>
                            <Button 
                              type="primary" 
                              style={{width: '120px'}} 
                              disabled={!editedNewValues} 
                              onClick={handleCancelNewItemChange}
                            >
                              {t('common.cancel')}
                            </Button>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                  {maContractByCompany.length > 0 && 
                    <div className="row">
                      <div className="card mb-0">
                        <div className="table-body">
                          <div className="table-responsive">
                            <Table
                              rowSelection={purchaseRowSelection}
                              pagination={{
                                total:  maContractByCompany.length,
                                showTotal: ShowTotal,
                                showSizeChanger: true,
                                ItemRender: ItemRender,
                              }}
                              className="table"
                              style={{ overflowX: "auto" }}
                              columns={columns_ma_contract}
                              dataSource={maContractByCompany}
                              rowKey={(record) => record.guid}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
              { editedDetailValues !== null && Object.keys(editedDetailValues).length !== 0 &&
                <div className="text-center py-3">
                  <button
                    type="button"
                    className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                    onClick={handleDetailSave}
                  >
                    {t('common.save')}
                  </button>
                  &nbsp;&nbsp;
                  <button
                    type="button"
                    className="btn btn-secondary btn-rounded"
                    onClick={handleDetailCancel}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
        {/* modal-content */}
        <DetailSubModal
          title={subModalSetting.title}
          edited={editedOtherValues}
          items={subModalItems}
          open={isSubModalOpen}
          handleDetailEdit={handleOtherItemChange}
          handleOk={handleSubModalOk}
          handleCancel={handleSubModalCancel}
        />
      </div>
    </div>
  );
};

export default CompanyDetailsModel;

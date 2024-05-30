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
import { PurchaseRepo } from "../../repository/purchase";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import DetailSubModal from "../../constants/DetailSubModal";
import { option_locations, option_deal_type } from '../../constants/constans';
import { ItemRender, ShowTotal } from "../paginationfunction";
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

  const [ editedValues, setEditedValues ] = useState(null);
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);

  const [ transactionByCompany, setTransactionByCompany] = useState([]);
  const [ purchaseByCompany, setPurchaseByCompany] = useState([]);
  const [ validMACount, setValidMACount ] = useState(0);

  const [ subDetailItems, setSubDetailItems ] = useState([]);
  const [ editedSubValues, setEditedSubValues ] = useState([]);
  const [ orgTimeInSub, setOrgTimeInSub ] = useState([]);

  const [ editedNewValues, setEditedNewValues ] = useState(null);

  const [ isSubModalOpen, setIsSubModalOpen ] = useState(false);
  const [ subModalSetting, setSubModalSetting ] = useState({title:''})
  const [ subModalItems, setSubModalItems ] = useState([]);

  // --- Funtions for Editing Detail ---------------------------------
  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    console.log('\t[handleEditing] value: ', tempEdited);
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleSaveAll = useCallback(() => {
    if(editedValues !== null
      && selectedCompany !== defaultCompany)
    {
      const temp_all_saved = {
        ...editedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        company_code: selectedCompany.company_code,
      };
      if (modifyCompany(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
        if(editedValues.establishment_date){
          setOrgEstablishDate(editedValues.establishment_date);
        };
      } else {
        console.error('Failed to modify company')
      }
    } else {
      console.log("[ CompanyDetailModel ] No saved data");
    };
    setEditedValues(null);
  }, [cookies.myLationCrmUserId, modifyCompany, editedValues, selectedCompany]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
  }, []);

  // --- Funtions for Specific Changes in Detail ---------------------------------
  const handleDateChange = useCallback((name, date) => {
    const tempEdited = {
      ...editedValues,
      [name]: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleSelectChange = useCallback((name, selected) => {
    const tempEdited = {
      ...editedValues,
      [name]: selected.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  // --- Funtions for Control Windows ---------------------------------
  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);

  const handleClose = useCallback(() => {
    setEditedValues(null);
    setCurrentCompany();
  }, []);

  // --- Variables for Editing Detail ---------------------------------
  const company_items_info = [
    ['company_address','common.address',{ type:'label', extra:'long' }],
    ['company_phone_number','common.phone_no',{ type:'label' }],
    ['company_zip_code','common.zip_code',{ type:'label' }],
    ['company_fax_number','common.fax_no',{ type:'label' }],
    ['homepage','company.homepage',{ type:'label' }],
    ['company_scale','company.company_scale',{ type:'label' }],
    ['deal_type','company.deal_type', { type:'select', options: option_deal_type.ko, selectChange: (selected) => handleSelectChange('deal_type', selected) }],
    ['industry_type','company.industry_type',{ type:'label' }],
    ['business_type','company.business_type',{ type:'label' }],
    ['business_item','company.business_item',{ type:'label' }],
    ['establishment_date','company.establishment_date',
      { type:'date', orgTimeData: orgEstablishDate, timeDataChange: handleDateChange }
    ],
    ['ceo_name','company.ceo_name',{ type:'label' }],
    ['account_code','company.account_code',{ type:'label' }],
    ['bank_name','company.bank_name',{ type:'label' }],
    ['account_owner','company.account_owner',{ type:'label' }],
    ['sales_resource','company.salesman',{ type:'label' }],
    ['application_engineer','company.engineer',{ type:'label' }],
    ['region','common.region', { type:'select', options: option_locations.ko, selectChange: (selected) => handleSelectChange('region', selected) }],
    ['memo','common.memo',{ type:'textarea', extra:'long' }],
  ];

  // --- Variables for Editing Sub Detail ---------------------------------
  const purchase_items_info = [
    ['product_name','purchase.product_name',{ type:'label' }],
    ['product_type','purchase.product_type',{ type:'label' }],
    ['serial_number','purchase.serial',{ type:'label' }],
    ['licence_info','purchase.licence_info',{ type:'label' }],
    ['module','purchase.module',{ type:'label' }],
    ['quantity','common.quantity',{ type:'label' }],
    ['receipt_date','purchase.receipt_date',{ type:'date' }],
    ['delivery_date','purchase.delivery_date',{ type:'date' }],
    ['hq_finish_date','purchase.hq_finish_date',{ type:'date' }],
    ['MA_finish_date','purchase.ma_finish_date',{ type:'date' }],
  ];

  // --- Functions for Editing Sub Detail ---------------------------------
  const handleSubValueChange = useCallback((idx, e) => {
    const tempEdited = {
      ...editedSubValues[idx],
      [e.target.name]: e.target.value,
    };

    const tempEditedArry = [
      ...editedSubValues.slice(0, idx),
      tempEdited,
      ...editedSubValues.slice(idx + 1,),
    ];
    setEditedSubValues(tempEditedArry);
    console.log('handleSubValueChange : ', tempEditedArry);
  }, [editedSubValues]);

  const handleSubDateValueChange = useCallback((idx, name, date) => {
    const tempEdited = {
      ...editedSubValues[idx],
      [name]: date,
    };
    const tempEditedArry = [
      ...editedSubValues.slice(0, idx),
      tempEdited,
      ...editedSubValues.slice(idx + 1,),
    ];
    setEditedSubValues(tempEditedArry);
    console.log('handleSubDateValueChange : ', tempEditedArry);
  }, [editedSubValues])

  const handleCancelSubItemChange = useCallback((idx) => {
    if(editedSubValues[idx]){
      const tempEditedArry = [
        ...editedSubValues.slice(0, idx),
        null,
        ...editedSubValues.slice(idx + 1, ),
      ];
      setEditedSubValues(tempEditedArry);
    }
  }, [editedSubValues]);

  const handleSaveSubItemChange = useCallback((idx) => {
    if(editedSubValues[idx]){
      let tempSubValues = null;
      if(idx < purchaseByCompany.length) {
        tempSubValues = {
          ...editedSubValues[idx],
          action_type: "UPDATE",
          modify_user: cookies.myLationCrmUserId,
          purchase_code: purchaseByCompany[idx].purchase_code,
        };
      } else {
        tempSubValues = {
          ...editedSubValues[idx],
          action_type: "ADD",
          modify_user: cookies.myLationCrmUserId,
        };
      }
      
      if (modifyPurchase(tempSubValues)) {
        console.log(`Succeeded to modify purchase`);
        let tempDateValues = {
          ...orgTimeInSub[idx]
        };
        if(editedSubValues[idx].delivery_date){
          tempDateValues.delivery_date = editedSubValues[idx].delivery_date;
        };
        if(editedSubValues[idx].hq_finish_date){
          tempDateValues.hq_finish_date = editedSubValues[idx].hq_finish_date;
        };
        if(editedSubValues[idx].ma_finish_date){
          tempDateValues.ma_finish_date = editedSubValues[idx].ma_finish_date;
        };
        if(editedSubValues[idx].receipt_date){
          tempDateValues.receipt_date = editedSubValues[idx].receipt_date;
        };
        const tempDateArry = [
          ...orgTimeInSub.slice(0, idx),
          tempDateValues,
          ...orgTimeInSub.slice(idx + 1, ),
        ];
        setOrgTimeInSub(tempDateArry);
      } else {
        console.error('Failed to modify company')
      };
      const tempSubValueArry = [
        ...editedSubValues.slice(0, idx),
        ...editedSubValues.slice(idx + 1, ),
      ];
      setEditedSubValues(tempSubValueArry);
    }
  }, [cookies.myLationCrmUserId, editedSubValues, orgTimeInSub]);

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
    console.log('handleNewItemDateChange : ', tempEdited);
  }, [editedNewValues])

  const handleCancelNewItemChange = useCallback(() => {
    setEditedNewValues(null);
  }, []);

  const handleSaveNewItemChange = useCallback(() => {
    if(editedNewValues){
      const tempSubValues = {
        ...editedNewValues,
        action_type: "ADD",
        recent_user: cookies.myLationCrmUserId,
      };
      
      if (modifyPurchase(tempSubValues)) {
        console.log(`Succeeded to modify purchase`);
        
      } else {
        console.error('Failed to modify company')
      };
      setEditedNewValues(null);
    }
  }, [cookies.myLationCrmUserId, editedNewValues]);

  // --- Funtions for Sub Modal ---------------------------------
  const handleSubModalOk = () => {setIsSubModalOpen(false);};
  const handleSubModalCancel = () => {setIsSubModalOpen(false);};

  const handleAddProduct = () => {
    const generated = purchase_items_info.map(item => {
      return {
        defaultText: '',
        name: item.at(0),
        title: t(item.at(1)),
        detail: item.at(2),
        editing: {handleSubValueChange},
      }
    });
  };

  const handleModifyProduct = (code) => {
    setSubModalItems(null);
    if(purchaseByCompany.length > 0) {
      const foundIdx = purchaseByCompany.findIndex(item => item.purchase_code === code);
      if(foundIdx !== -1) {
        const foundItem = purchaseByCompany[foundIdx];
        const generated = purchase_items_info.map(item => {
          return {
            defaultText: foundItem[item.at(0)],
            name: item.at(0),
            title: t(item.at(1)),
            detail: item.at(2),
            editing: {handleSubValueChange},
          }
        });
        setSubModalItems(generated);
        setSubModalSetting({title: t('purchase.modify_purchase')})
        setIsSubModalOpen(true);
      };
    };
  };

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
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('purchase.ma_finish_date'),
      dataIndex: "MA_finish_date",
      render: (text, record) => <>{text}</>,
    },
  ];

  const purchaseRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ", selectedRows
      );
      if(selectedRows.length > 0){
        // set data of selected purchases into 'subDetailItems'.
        const selectedSubItems = [
          ...selectedRows
        ];
        setSubDetailItems(selectedSubItems);

        // prepare variable to be available when editing sub items.
        let arryForEdit = [];
        let dateArrayForEdit = [];

        for(let i=0; i < selectedRows.length; i++) {
          arryForEdit.push(null);
          const tempDates = {
            'delivery_date': purchaseByCompany[i].delivery_date,
            'hq_finish_date': purchaseByCompany[i].hq_finish_date,
            'ma_finish_date': purchaseByCompany[i].ma_finish_date,
            'receipt_date': purchaseByCompany[i].receipt_date,
          };
          dateArrayForEdit.push(tempDates);
        }
        setEditedSubValues(arryForEdit);
        setOrgTimeInSub(dateArrayForEdit);
      } else {
        setSubDetailItems([]);
        setEditedSubValues([]);
        setOrgTimeInSub([]);
      };
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red",
    }),
  };

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
          if(new Date(item.MA_finish_date) > new Date()) valid_count++;
        });
        setValidMACount(valid_count);
        setEditedSubValues([]);
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
                editing={handleEditing}
              />
              <DetailTitleItem
                defaultText={selectedCompany.business_registration_code}
                name='business_registration_code'
                title={t('company.business_registration_code')}
                editing={handleEditing}
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
                            edited={editedValues}
                            name={item.at(0)}
                            title={t(item.at(1))}
                            detail={item.at(2)}
                            editing={handleEditing}
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
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="card mb-0">
                    { subDetailItems.length > 0 && 
                      subDetailItems.map((dItem, dIndex) => 
                        <div key={dIndex}>
                          <div style={{fontSize: 15, fontWeight: 600, padding: '0.5rem 0 0 1.0rem'}}>{"No. " + (dIndex + 1)}</div>
                          <div  
                            style={{display:'flex', flexWrap:'wrap', justifyContent:'space-between' ,margin: 0, padding:'0.5rem 0', border: 0, backgroundColor:'white'}}>
                            {
                              purchase_items_info.map((item, index) => 
                                <DetailCardItem
                                  key={index}
                                  defaultText={dItem[item.at(0)]}
                                  edited={editedSubValues[dIndex]}
                                  name={item.at(0)}
                                  title={t(item.at(1))}
                                  detail={item.at(2).type === 'date' 
                                    ? {type:'date', orgTimeData: orgTimeInSub[dIndex][item.at(0)], 
                                        timeDateChange: (name, date) => handleSubDateValueChange(dIndex, name, date) }
                                    : item.at(2)}
                                  editing={(event) => handleSubValueChange(dIndex, event)}
                                />
                            )}
                            
                          </div>
                          <div style={{marginBottom: '0.5rem', display: 'flex'}}>
                            <DetailCardItem
                              defaultText={dItem["purchase_memo"]}
                              edited={editedSubValues[dIndex]}
                              name="purchase_memo"
                              title={t('common.memo')}
                              detail={{type:'textarea', extra: 'memo', row_no: 3}}
                              editing={(event) => handleSubValueChange(dIndex, event)}
                            />
                            <div style={{width: 380, display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'space-evenly'}}>
                              <Button
                                type="primary" 
                                style={{width: '120px'}} 
                                disabled={!editedSubValues[dIndex]}
                                onClick={()=>{handleSaveSubItemChange(dIndex)}}
                              >
                                {t('common.save')}
                              </Button>
                              <Button 
                                type="primary" 
                                style={{width: '120px'}} 
                                disabled={!editedSubValues[dIndex]} 
                                onClick={()=>{handleCancelSubItemChange(dIndex)}}
                              >
                                {t('common.cancel')}
                              </Button>
                            </div>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="card mb-0">
                      <>
                        <div style={{fontSize: 15, fontWeight: 600, padding: '0.5rem 0 0 1.0rem'}}>{t('purchase.add_purchase')}</div>
                        <div style={{display:'flex', flexWrap:'wrap', justifyContent:'space-between' ,margin: 0, padding: '0.5rem 0', border: 0, backgroundColor:'white'}}>
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
                                : item.at(2)}
                              editing={handleNewItemChange}
                            />
                        )}
                        </div>
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
                              onClick={handleSaveNewItemChange}
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
                </div>
              </div>
              { editedValues !== null && Object.keys(editedValues).length !== 0 &&
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
        {/* modal-content */}
        <DetailSubModal
          title={subModalSetting.title}
          edited={editedSubValues}
          items={subModalItems}
          open={isSubModalOpen}
          handleEditing={handleSubValueChange}
          handleOk={handleSubModalOk}
          handleCancel={handleSubModalCancel}
        />
      </div>
    </div>
  );
};

export default CompanyDetailsModel;

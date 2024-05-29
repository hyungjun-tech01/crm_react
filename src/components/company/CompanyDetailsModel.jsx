import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch, Table } from "antd";
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

const MODAL_NULL = 0;
const MODAL_ADD_PRODUCT=1;
const MODAL_MODIFY_PRODUCT=2;
const MODAL_ADD_TRANSACTION=3;
const MODAL_MODIFY_TRANSACTION=4;
const MODAL_ADD_TAX_INVOICE=5;
const MODAL_MODIFY_TAX_INVOICE=6;

const CompanyDetailsModel = () => {
  const selectedCompany = useRecoilValue(atomCurrentCompany);
  const { modifyCompany, setCurrentCompany } = useRecoilValue(CompanyRepo);
  const allTransactions = useRecoilValue(atomAllTransactions);
  const { loadAllTransactions, setCurrentTransaction } = useRecoilValue(TransactionRepo);
  const allPurchases = useRecoilValue(atomAllPurchases);
  const { loadAllPurchases, setCurrentPurchase } = useRecoilValue(PurchaseRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName", "myLationCrmUserId"]);
  const { t } = useTranslation();

  const [ editedValues, setEditedValues ] = useState(null);
  const [ orgEstablishDate, setOrgEstablishDate ] = useState(null);

  const [ transactionByCompany, setTransactionByCompany] = useState([]);
  const [ purchaseByCompany, setPurchaseByCompany] = useState([]);
  const [ noValidMA, setNoValidMA ] = useState(0);

  const [ isFullScreen, setIsFullScreen ] = useState(false);

  const [ isSubModalOpen, setIsSubModalOpen ] = useState(false);
  const [ subModalItems, setSubModalItems ] = useState([]);
  const [ editedSubValues, setEditedSubValues ] = useState(null);

  // --- Funtions for Editing ---------------------------------
  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    console.log('\t[handleEditing] value: ', tempEdited);
    setEditedValues(tempEdited);
  }, [editedValues]);

    // --- Funtions for Saving ---------------------------------
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

  // --- Funtions for Specific Changes ---------------------------------
  const handleEstablishDateChange = useCallback((date) => {
    const tempEdited = {
      ...editedValues,
      establishment_date: date,
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
      { type:'date', orgTimeData: orgEstablishDate, timeDataChange: handleEstablishDateChange }
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

  const purchase_items_info = [
    ['product_name','purchase.product_name',{ type:'label', extra:'modal' }],
    ['product_type','purchase.product_type',{ type:'label', extra:'modal' }],
    ['serial_number','purchase.serial',{ type:'label', extra:'modal' }],
    ['regcode','purchase.registration_code',{ type:'label', extra:'modal' }],
    ['quantity','common.quantity',{ type:'label', extra:'modal' }],
    ['registration_date','purchase.registration_date',{ type:'date', extra:'modal', orgTimeData: null, timeDataChange: null }],
    ['delivery_date','purchase.delivery_date',{ type:'date', extra:'modal', orgTimeData: null, timeDataChange: null }],
    ['MA_finish_date','purchase.ma_finish_date',{ type:'label', extra:'modal' }],
    ['purchase_memo','common.memo',{ type:'textarea', extra:'modal' }],
  ];

  // --- Funtions for Sub Modal ---------------------------------
  const handleSubModalOk = () => {setIsSubModalOpen(false);};
  const handleSubModalCancel = () => {setIsSubModalOpen(false);};
  const handleSubValueEditing = useCallback((e) => {
    const tempEdited = {
      ...editedSubValues,
      [e.target.name]: e.target.value,
    };
    console.log('\t[handleSubValueEditing] value: ', tempEdited);
    setEditedSubValues(tempEdited);
  }, [editedSubValues]);

  const handleAddProduct = () => {
    setIsSubModalOpen(true);
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
            editing: {handleSubValueEditing},
          }
        });
        setSubModalItems(generated);
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
        setNoValidMA(valid_count);
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
                    {t('purchase.product_info') + "(" + noValidMA + "/" + purchaseByCompany.length + ")"}
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
                <div className="tab-pane company-details-product" id="company-details-product">
                  <div className="row">
                    <div className="table-body">
                      <div className="table-responsive">
                        <Table
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
                          onRow={(record, rowIndex) => {
                            return {
                              onDoubleClick: (event) => {
                                  console.log('\tClick :', event);
                                  handleModifyProduct(record.purchase_code);
                              }, // double click row
                            };
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-end py-3">
                      <button
                        type="button"
                        className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                        onClick={handleAddProduct}
                      >
                        {t('common.add')}
                      </button>
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
          title='Basic Modal'
          edited={editedSubValues}
          items={subModalItems}
          open={isSubModalOpen}
          handleEditing={handleSubValueEditing}
          handleOk={handleSubModalOk}
          handleCancel={handleSubModalCancel}
        />
      </div>
    </div>
  );
};

export default CompanyDetailsModel;

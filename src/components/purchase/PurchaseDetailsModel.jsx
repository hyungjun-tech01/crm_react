import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch, Table } from "antd";
import { Add } from "@mui/icons-material";

import {
  atomCompanyState,
  atomCompanyForSelection,
  atomProductClassListState,
  atomProductClassList,
  atomProductsState,
  atomAllProducts,
  atomProductOptions,
  atomMAContractSet,
  defaultMAContract,
} from "../../atoms/atoms";
import { PurchaseRepo } from "../../repository/purchase";
import { CompanyRepo } from "../../repository/company";
import { ProductClassListRepo, ProductRepo, ProductTypeOptions } from "../../repository/product";
import { ContractTypes, MAContractRepo } from "../../repository/ma_contract";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import DetailSubModal from "../../constants/DetailSubModal";
import { ItemRender, ShowTotal } from "../paginationfunction";
import { ConvertCurrency, formatDate } from "../../constants/functions";


const PurchaseDetailsModel = (props) => {
  const { selected, handleSelected } = props;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);


  //===== [RecoilState] Related with Purchase =========================================
  const { modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);


  //===== [RecoilState] Related with Company ==========================================
  const companyState = useRecoilValue(atomCompanyState);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Product ==========================================
  const productClassState = useRecoilValue(atomProductClassListState);
  const allProductClassList = useRecoilValue(atomProductClassList);
  const { loadAllProductClassList } = useRecoilValue(ProductClassListRepo);
  const productState = useRecoilValue(atomProductsState);
  const allProducts = useRecoilValue(atomAllProducts);
  const { loadAllProducts } = useRecoilValue(ProductRepo);
  const [productOptions, setProductOptions] = useRecoilState(atomProductOptions);


  //===== [RecoilState] Related with MA Contract ======================================
  const maContractSet = useRecoilValue(atomMAContractSet);
  const { loadPurchaseMAContracts, modifyMAContract, setCurrentMAContract } = useRecoilValue(MAContractRepo);


  //===== Handles to deal this component ==============================================
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if (checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);


  //===== Handles to edit 'Purchase Details' ==========================================
  const [editedDetailValues, setEditedDetailValues] = useState({});

  const handleDetailChange = useCallback((e) => {
    if (e.target.value !== selected[e.target.name]) {
      const tempEdited = {
        ...editedDetailValues,
        [e.target.name]: e.target.value,
      };
      setEditedDetailValues(tempEdited);
    }
  }, [editedDetailValues, selected]);

  const handleDetailDateChange = useCallback((name, date) => {
    if (date !== new Date(selected[name])) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: date,
      };
      setEditedDetailValues(tempEdited);
    }
  }, [editedDetailValues, selected]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    console.log('handleDetailSelectChange / start : ', selected);

    if (selected[name] !== selected.value) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: selected.value,
      };
      console.log('handleDetailSelectChange : ', tempEdited);
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues]);

  const handleSaveAll = useCallback(() => {
    if (Object.keys(editedDetailValues).length !== 0 && selected) {
      const temp_all_saved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        purchase_code: selected.purchase_code,
      };
      const res_data = modifyPurchase(temp_all_saved);
      if (res_data.result) {
        console.log(`Succeeded to modify purchase`);
      } else {
        console.error("Failed to modify purchase");
      }
    } else {
      console.log("[ PurchaseDetailModel ] No saved data");
    }
    setEditedDetailValues(null);
  }, [
    cookies.myLationCrmUserId,
    modifyPurchase,
    editedDetailValues,
    selected,
  ]);

  const handleCancelAll = useCallback(() => {
    setEditedDetailValues(null);
  }, []);

  const handleClose = useCallback(() => {
    setEditedDetailValues(null);
    setCurrentPurchase();
  }, []);

  const purchase_items_info = [
    { key: 'product_type', title: 'purchase.product_type', detail: { type: 'select', options: ProductTypeOptions, editing: handleDetailSelectChange } },
    { key: 'serial_number', title: 'purchase.serial_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'licence_info', title: 'purchase.licence_info', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'module', title: 'purchase.module', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'quantity', title: 'common.quantity', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'receipt_date', title: 'purchase.receipt_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'delivery_date', title: 'purchase.delivery_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'hq_finish_date', title: 'purchase.hq_finish_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'ma_finish_date', title: 'purchase.ma_finish_date', detail: { type: 'date', editing: handleDetailDateChange } },
    { key: 'po_number', title: 'purchase.po_number', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'price', title: 'common.price_1', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'invoice_number', title: 'purchase.invoice_no', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'status', title: 'common.status', detail: { type: 'label', editing: handleDetailChange } },
    { key: 'purchase_memo', title: 'common.memo', detail: { type: 'textarea', extra: 'long', editing: handleDetailChange } },
  ];


  //===== Handles to edit 'MA contract' =================================================
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalSetting, setSubModalSetting] = useState({ title: '' })
  const [selectedMAContractRowKeys, setSelectedMAContractRowKeys] = useState([]);
  const [orgSubModalValues, setOrgSubModalValues] = useState({});
  const [editedSubModalValues, setEditedSubModalValues] = useState({});

  const handleSubModalOk = useCallback(() => {
    const finalData = {
      ...orgSubModalValues,
      ...editedSubModalValues,
    };
    if (!finalData.ma_finish_date) {
      console.error('[PurchaseAddModel] no end date!');
      return;
    };
    const resp = modifyMAContract(finalData);
    resp.then(result => {
      if (result) {
        console.log(`[ handleSubModalOk ] update contract`);

        // Update MA Contract end date
        if (selected.purchase_code
          && (!selected.ma_finish_date || (new Date(selected.ma_finish_date) < finalData.ma_finish_date))) {
          // Update 'selected'
          const updateSelected = {
            ...selected,
            ma_finish_date: finalData.ma_finish_date,
          };
          handleSelected(updateSelected);

          // Update 'purchase' item
          const modifiedPurchase = {
            ...updateSelected,
            action_type: 'UPDATE',
            modify_user: cookies.myLationCrmUserId,
          };
          delete modifiedPurchase.company_name;
          delete modifiedPurchase.company_name_eng;
          delete modifiedPurchase.ma_remain_date;

          const res_data = modifyPurchase(modifiedPurchase);
          res_data.then(res => {
            if (res.result) {
              console.log('Succeeded to update MA end date');
            } else {
              console.log('Fail to update MA end date');
            };
          });
        };
      } else {
        console.error('Failed to add/modify ma contract');
      }
    });

    setSelectedMAContractRowKeys([]);
    setIsSubModalOpen(false);
  }, [cookies.myLationCrmUserId, editedSubModalValues, handleSelected, modifyMAContract, modifyPurchase, orgSubModalValues, selected]);

  const handleSubModalCancel = () => {
    setIsSubModalOpen(false);
    setOrgSubModalValues(defaultMAContract);
    setSelectedMAContractRowKeys([]);
  };

  const handleSubModalItemChange = useCallback(data => {
    setEditedSubModalValues(data);
  }, []);

  const handleAddMAContract = useCallback((company_code, purchase_code) => {
    setEditedSubModalValues(null);
    setOrgSubModalValues({
      ...defaultMAContract,
      action_type: 'ADD',
      ma_company_code: company_code,
      purchase_code: purchase_code,
      modify_user: cookies.myLationCrmUserId,
    });
    setSubModalSetting({ title: t('contract.add_contract') });
    setIsSubModalOpen(true);
  }, [cookies.myLationCrmUserId, t]);

  const handleModifyMAContract = useCallback((code) => {
    setEditedSubModalValues(null);
    const foundMAContract = maContractSet.filter(item => item.ma_code === code);
    if (foundMAContract.length > 0) {
      const selectedContract = foundMAContract[0];
      setOrgSubModalValues({
        ...selectedContract,
        ma_contract_date: selectedContract.ma_contract_date,
        ma_finish_date: selectedContract.ma_finish_date,
        action_type: 'UPDATE',
        modify_user: cookies.myLationCrmUserId,
      });
      setSubModalSetting({ title: t('contract.add_contract') });
      setIsSubModalOpen(true);
    } else {
      console.error("Impossible Case~");
    };
  }, [cookies.myLationCrmUserId, maContractSet, t]);

  const columns_ma_contract = [
    {
      title: t('contract.contract_date'),
      dataIndex: "ma_contract_date",
      render: (text, record) => <>{formatDate(record.ma_contract_date)}</>,
    },
    {
      title: t('contract.contract_end_date'),
      dataIndex: "ma_finish_date",
      render: (text, record) => <>{formatDate(record.ma_finish_date)}</>,
    },
    {
      title: t('contract.contract_type'),
      dataIndex: "ma_contract_type",
      render: (text, record) => <>{text}</>,
    },
    {
      title: t('common.price_1'),
      dataIndex: "ma_price",
      render: (text, record) => <>{ConvertCurrency(record.ma_price)}</>,
    },
    {
      title: t('common.memo'),
      dataIndex: "ma_memo",
      render: (text, record) => <>{text}</>,
    },
  ];

  const maContractRowSelection = {
    selectedRowKeys: selectedMAContractRowKeys,
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedMAContractRowKeys(selectedRowKeys);

      if (selectedRows.length > 0) {
        // Set data to edit selected purchase ----------------------
        const selectedValue = selectedRows.at(0);
        setCurrentMAContract(selectedValue.ma_code);
      } else {
        setCurrentMAContract();
      };
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red",
    }),
  };

  const ma_contract_items = [
    { name: 'ma_contract_date', title: t('contract.contract_date'), detail: { type: 'date' } },
    { name: 'ma_finish_date', title: t('contract.end_date'), detail: { type: 'date' } },
    { name: 'ma_contract_type', title: t('contract.contract_type'), detail: { type: 'select', options: ContractTypes } },
    { name: 'ma_price', title: t('common.price_1'), detail: { type: 'label' } },
    { name: 'ma_memo', title: t('common.memo'), detail: { type: 'textarea', row_no: 4 } },
  ];

  useEffect(() => {
    if (selected) {
      console.log("[PurchaseDetailsModel] called!");

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if (detailViewStatus === null) {
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if (detailViewStatus === '0') {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      loadPurchaseMAContracts(selected.purchase_code);
    };
  }, [selected, loadPurchaseMAContracts]);

  useEffect(() => {
    if ((companyState & 1) === 0) {
      loadAllCompanies();
    }
  }, [companyState, loadAllCompanies]);

  useEffect(() => {
    console.log('[PurchaseAddModel] useEffect / Production');
    if ((productClassState & 1) === 0) {
      console.log('[PurchaseAddModel] loadAllProductClassList');
      loadAllProductClassList();
    };
    if ((productState & 1) === 0) {
      console.log('[PurchaseAddModel] loadAllProducts');
      loadAllProducts();
    };
    if (((productClassState & 1) === 1) && ((productState & 1) === 1) && (productOptions.length === 0)) {
      console.log('[PurchaseAddModel] set companies for selection');
      const productOptionsValue = allProductClassList.map(proClass => {
        const foundProducts = allProducts.filter(product => product.product_class_name === proClass.product_class_name);
        const subOptions = foundProducts.map(item => {
          return {
            label: <span>{item.product_name}</span>,
            value: { product_code: item.product_code,
              product_name: item.product_name,
              product_class_name: item.product_class_name,
              detail_desc: item.detail_desc,
              cost_price: item.const_price,
              reseller_price: item.reseller_price,
              list_price: item.list_price,
          }
          }
        });
        return {
          label: <span>{proClass.product_class_name}</span>,
          title: proClass.product_class_name,
          options: subOptions,
        };
      });
      setProductOptions(productOptionsValue);
    };
  }, [allProductClassList, allProducts, loadAllProductClassList, loadAllProducts, productClassState, productOptions, productState, setProductOptions]);

  return (
    <>
      <div
        className="modal right fade"
        id="purchase-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        data-bs-focus="false"
      >
        <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
          <div className="modal-content">
            {selected &&
              <>
                <div className="modal-header">
                  <div className="row w-100">
                    <DetailTitleItem
                      original={selected.product_name}
                      name='product_name'
                      title={t('purchase.product_name')}
                      size='col-md-6'
                      type='select'
                      options={productOptions}
                      group={selected.product_class_name}
                      onEditing={handleDetailSelectChange}
                    />
                    <DetailTitleItem
                      original={selected.company_name}
                      name='company_name'
                      title={t('company.company_name')}
                      size='col-md-4'
                      type='select'
                      options={companyForSelection}
                      onEditing={handleDetailChange}
                    />
                  </div>
                  <Switch checkedChildren="full" checked={isFullScreen} onChange={handleWidthChange} />
                  <button
                    type="button"
                    className="btn-close xs-close"
                    data-bs-dismiss="modal"
                    onClick={handleClose}
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
                        &nbsp;
                      </li>
                      <li className="nav-item">
                        &nbsp;
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
                            <div className="row">
                              <Space
                                align="start"
                                direction="horizontal"
                                size="small"
                                style={{ display: 'flex', marginBottom: '0.5rem' }}
                                wrap
                              >
                                {purchase_items_info.map((item, index) =>
                                  <DetailCardItem
                                    key={index}
                                    defaultValue={selected[item.key]}
                                    edited={editedDetailValues}
                                    name={item.key}
                                    title={t(item.title)}
                                    detail={item.detail}
                                  />
                                )}
                              </Space>
                            </div>
                            <div className="row">
                              <div className="card mb-0">
                                <div className="table-body">
                                  <div className="table-responsive">
                                    <Table
                                      rowSelection={maContractRowSelection}
                                      pagination={{
                                        total: maContractSet.length,
                                        showTotal: ShowTotal,
                                        showSizeChanger: true,
                                        ItemRender: ItemRender,
                                      }}
                                      className="table"
                                      style={{ overflowX: "auto" }}
                                      columns={columns_ma_contract}
                                      dataSource={maContractSet}
                                      rowKey={(record) => record.ma_code}
                                      title={() =>
                                        <div style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          backgroundColor: '#cccccc',
                                          fontWeight: 600,
                                          lineHeight: 1.5,
                                          height: '2.5rem',
                                          padding: '0.5rem 0.8rem',
                                          borderRadius: '5px',
                                        }}
                                        >
                                          <div>{t('contract.contract_info')}</div>
                                          <Add onClick={() => handleAddMAContract(selected.company_code, selected.purchase_code)} />
                                        </div>
                                      }
                                      onRow={(record, rowIndex) => {
                                        return {
                                          onDoubleClick: (event) => {
                                            setSelectedMAContractRowKeys([record.ma_code]);
                                            handleModifyMAContract(record.ma_code);
                                          }, // click row
                                        };
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {editedDetailValues !== null &&
                      Object.keys(editedDetailValues).length !== 0 && (
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
              </>
            }
          </div>
          {/* modal-content */}
        </div>
        {/* modal-dialog */}
        <DetailSubModal
          title={subModalSetting.title}
          open={isSubModalOpen}
          item={ma_contract_items}
          original={orgSubModalValues}
          edited={editedSubModalValues}
          handleEdited={handleSubModalItemChange}
          handleOk={handleSubModalOk}
          handleCancel={handleSubModalCancel}
        />
      </div>
    </>
  );
};

export default PurchaseDetailsModel;

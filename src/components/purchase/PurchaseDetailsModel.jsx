import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";

import { atomCompanyState,
  atomCompanyForSelection,
  atomProductClassListState,
  atomProductClassList,
  atomProductsState,
  atomAllProducts,
  atomProductOptions,
} from "../../atoms/atoms";
import { PurchaseRepo } from "../../repository/purchase";
import { CompanyRepo } from "../../repository/company";
import { ProductClassListRepo, ProductRepo } from "../../repository/product";

import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";


const PurchaseDetailsModel = (props) => {
  const { selected } = props;
  const { t } = useTranslation();
  const [cookies] = useCookies(["myLationCrmUserId"]);
  

  //===== [RecoilState] Related with Purchase =========================================
  const { modifyPurchase, setCurrentPurchase } = useRecoilValue(PurchaseRepo);


  //===== [RecoilState] Related with Company ==========================================
  const companyState = useRecoilValue(atomCompanyState);
  const companyForSelection = useRecoilValue(atomCompanyForSelection);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);


  //===== [RecoilState] Related with Product =============================================
  const productClassState = useRecoilValue(atomProductClassListState);
  const allProductClassList = useRecoilValue(atomProductClassList);
  const { loadAllProductClassList } = useRecoilValue(ProductClassListRepo);
  const productState = useRecoilValue(atomProductsState);
  const allProducts = useRecoilValue(atomAllProducts);
  const { loadAllProducts } = useRecoilValue(ProductRepo);
  const [productOptions, setProductOptions] = useRecoilState(atomProductOptions);


  //===== Handles to deal this component ==============================================
  const [ isFullScreen, setIsFullScreen ] = useState(false);

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
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
  }, [editedDetailValues, selected]);

  const handleSaveAll = useCallback(() => {
    if (Object.keys(editedDetailValues).length !== 0 && selected) {
      const temp_all_saved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        purchase_code: selected.purchase_code,
      };
      const res_data = modifyPurchase(temp_all_saved);
      if(res_data.result) {
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
    { key:'serial_number', title:'purchase.serial_number', detail:{ type:'label',extra:'long',editing: handleDetailChange}},
    { key:'quantity', title:'common.quantity', detail:{ type:'label',editing: handleDetailChange}},
    { key:'price', title:'common.price', detail:{ type:'label',editing: handleDetailChange}},
    { key:'currency', title:'common.currency', detail:{ type:'label',editing: handleDetailChange}},
    { key:'delivery_date', title:'purchase.delivery_date', detail:{ type:'date',editing: handleDetailDateChange}},
    { key:'ma_contact_date', title:'purchase.ma_contract_date', detail:{ type:'date',editing: handleDetailDateChange}},
    { key:'ma_finish_date', title:'purchase.ma_finish_date', detail:{ type:'date',editing: handleDetailDateChange }},
    { key:'register', title:'purchase.register', detail:{ type:'label',editing: handleDetailChange}},
    { key:'registration_date', title:'purchase.registration_date', detail:{ type:'date',editing: handleDetailDateChange}},
    { key:'regcode', title:'purchase.registration_code', detail:{ type:'label',editing: handleDetailChange}},
    { key:'status', title:'common.status', detail:{ type:'label',editing: handleDetailChange}},
    { key:'purchase_memo', title:'common.memo', detail:{ type:'textarea', extra:'long',editing: handleDetailChange}},
  ];

  useEffect(() => {
    if(selected) {
      console.log("[PurchaseDetailsModel] called!");

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
  }, [selected]);

  useEffect(() => {
    if((companyState & 1) === 0) {
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
                    value: { product_code: item.product_code, product_name: item.product_name, product_class_name: item.product_class_name }
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
                      onEditing={handleDetailChange}
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
                                  defaultValue={selected[item.key]}
                                  edited={editedDetailValues}
                                  name={item.key}
                                  title={t(item.title)}
                                  detail={item.detail}
                                />
                              )}
                            </Space>
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
      </div>
    </>
  );
};

export default PurchaseDetailsModel;

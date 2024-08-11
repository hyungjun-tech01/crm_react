import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Collapse, Space, Switch } from "antd";
import { atomCurrentQuotation,
  defaultQuotation,
  atomQuotationState,
  atomProductClassList,
  atomProductClassListState,
  atomProductsState,
  atomProductOptions,
  atomAllProducts,
} from "../../atoms/atoms";
import { atomUserState,
  atomUsersForSelection,
  atomSalespersonsForSelection,
} from '../../atoms/atomsUser';
import { QuotationRepo, QuotationSendTypes, QuotationTypes } from "../../repository/quotation";
import { ProductClassListRepo, ProductRepo } from "../../repository/product";

import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import QuotationView from "./QuotationtView";
import { Add, Remove } from '@mui/icons-material';

const content_indices = ['3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18'];


const QuotationDetailsModel = ({init, handleInit}) => {
  const [ t ] = useTranslation();
  const [ cookies ] = useCookies(["myLationCrmUserId"]);
  const { Panel } = Collapse;


  //===== [RecoilState] Related with Quotation ========================================
  const quotationState = useRecoilValue(atomQuotationState);
  const selectedQuotation = useRecoilValue(atomCurrentQuotation);
  const { modifyQuotation, setCurrentQuotation } = useRecoilValue(QuotationRepo);

  
  //===== [RecoilState] Related with Product ==========================================
  const productClassState = useRecoilValue(atomProductClassListState);
  const allProductClassList = useRecoilValue(atomProductClassList);
  const productState = useRecoilValue(atomProductsState);
  const allProducts = useRecoilValue(atomAllProducts);
  const [productOptions, setProductOptions] = useRecoilState(atomProductOptions);
  const { tryLoadAllProductClassList } = useRecoilValue(ProductClassListRepo);
  const { tryLoadAllProducts } = useRecoilValue(ProductRepo);


  //===== [RecoilState] Related with Users ============================================
  const userState = useRecoilValue(atomUserState);
  const usersForSelection = useRecoilValue(atomUsersForSelection);
  const salespersonsForSelection = useRecoilValue(atomSalespersonsForSelection);


  //===== Handles to deal this component ==============================================
  const [ isAllNeededDataLoaded, setIsAllNeededDataLoaded ] = useState(false);
  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [ currentQuotationCode, setCurrentQuotationCode ] = useState('');

  const handleWidthChange = useCallback((checked) => {
    setIsFullScreen(checked);
    if(checked)
      localStorage.setItem('isFullScreen', '1');
    else
      localStorage.setItem('isFullScreen', '0');
  }, []);


  //===== Handles to edit 'Quotation Details' =========================================
  const [editedDetailValues, setEditedDetailValues] = useState({});

  const handleDetailChange = useCallback((e) => {
    if (e.target.value !== selectedQuotation[e.target.name]) {
      const tempEdited = {
        ...editedDetailValues,
        [e.target.name]: e.target.value,
      };
      setEditedDetailValues(tempEdited);
    } else {
      if(editedDetailValues[e.target.name]){
        delete editedDetailValues[e.target.name];
      };
    };
  }, [editedDetailValues, selectedQuotation]);

  const handleDetailDateChange = useCallback((name, date) => {
    if (date !== new Date(selectedQuotation[name])) {
      const tempEdited = {
        ...editedDetailValues,
        [name]: date,
      };
      setEditedDetailValues(tempEdited);
    };
  }, [editedDetailValues, selectedQuotation]);

  const handleDetailSelectChange = useCallback((name, selected) => {
    if(selected.value !== selectedQuotation[name]){
      const tempEdited = {
        ...editedDetailValues,
        [name]: selected.value,
      }
      setEditedDetailValues(tempEdited);
    }
  }, [editedDetailValues, selectedQuotation]);

  const handleSaveAll = useCallback(() => {
    if (editedDetailValues !== null &&
      selectedQuotation &&
      selectedQuotation !== defaultQuotation
    ) {
      const temp_all_saved = {
        ...editedDetailValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        quotation_code: selectedQuotation.quotation_code,
      };
      const resp = modifyQuotation(temp_all_saved);
      resp.then(res => {
        if (res.result) {
          console.log(`Succeeded to modify Quotation`);
        } else {
          console.error("Failed to modify Quotation :", res.data);
        };
      });
    } else {
      console.log("[ QuotationDetailModel ] No saved data");
    }
    setEditedDetailValues({});
  }, [cookies.myLationCrmUserId, modifyQuotation, editedDetailValues, selectedQuotation]);

  const handleCancelAll = useCallback(() => {
    setEditedDetailValues({});
  }, []);


  //===== Handles to edit 'Content' ===================================================
  const [ orgQuotationContents, setOrgQuotationContents ] = useState([]);
  const [ quotationContents, setQuotationContents ] = useState([]);
  const [ quotationHeaders, setQuotationHeaders ] = useState([]);

  const [ editedContentValues, setEditedContentValues ] = useState(null);
  const [ savedContentValues, setSavedContentValues ] = useState(null);

  const [ checkContentState, setCheckContentState ] = useState(null);
  const [ isNewlyAdded, setIsNewlyAdded ] = useState(false);

  const handleCheckContentEditState = useCallback((key) => {
    return editedContentValues !== null && key in editedContentValues;
  }, [editedContentValues]);

  const handleStartContentEdit = useCallback((input) => {
    const splitted = input.split('.');
    const [index, key] = splitted;
    const tempEdited = {
      ...editedContentValues,
      [input]: quotationContents[index][key],
    };
    setEditedContentValues(tempEdited);
  }, [editedContentValues, quotationContents]);

  const handleContentEditing = useCallback((e) => {
    const tempEdited = {
      ...editedContentValues,
      [e.target.name]: e.target.value,
    };
    setEditedContentValues(tempEdited);
  }, [editedContentValues]);

  const handleEndContentEdit = useCallback((input) => {
    const splitted = input.split('.');
    const [index, key] = splitted;
    if (editedContentValues[input] === quotationContents[index][key])
    {
      const tempEdited = {
        ...editedContentValues,
      };
      delete tempEdited[input];
      setEditedContentValues(tempEdited);
      return;
    }

    const tempSaved = {
      ...savedContentValues,
      [input]: editedContentValues[input],
    };
    setSavedContentValues(tempSaved);

    const tempEdited = {
      ...editedContentValues,
    };
    delete tempEdited[input];
    setEditedContentValues(tempEdited);
  }, [editedContentValues, savedContentValues, quotationContents]);

  // --- Funtions for Content Saving ----------------------------------------------------
  const handleCheckContentSaved = useCallback((input) => {
    return savedContentValues !== null && input in savedContentValues;
  }, [savedContentValues]);

  const handleCancelContentSaved = useCallback((input) => {
    const tempSaved = {
      ...savedContentValues,
    };
    delete tempSaved[input];
    setSavedContentValues(tempSaved);
  }, [savedContentValues]);

  // --- Funtions for Dealing Content ------------------------------------------------------
  const handleAddContent = useCallback(() => {
    let tempContent = {};
    quotationHeaders.forEach((header) => {
      tempContent[header[0]] = null;
    });
    tempContent['1'] = quotationContents.length + 1;
    const tempContents = [
      ...quotationContents,
      tempContent
    ];
    setQuotationContents(tempContents);

    const tempCheck=[
      ...checkContentState,
      true,
    ];
    setCheckContentState(tempCheck);

    if(!isNewlyAdded){
      setIsNewlyAdded(true);
    };
  }, [checkContentState, isNewlyAdded, quotationContents, quotationHeaders]);

  const handleDeleteConetent = useCallback((index) => {
    // Check 'editedContentValues' and clear data related content
    let tempEditedContent = {
      ...editedContentValues
    };
    if(editedContentValues){
      Object.keys(editedContentValues).forEach(key => {
        const [no, idx] = key.split('.');
        if(no === index){
          delete tempEditedContent[key];
        };
      });
      setEditedContentValues(tempEditedContent);
    }

    // Check 'savedContentValues' and clear data related content
    let tempSavedContent = {
      ...savedContentValues
    };
    if(savedContentValues){
      Object.keys(savedContentValues).forEach(key => {
        const [no, idx] = key.split('.');
        if(no === index){
          delete tempSavedContent[key];
        };
      });
      setSavedContentValues(tempSavedContent);
    }

    // Finally, ---------------------------------------------
    const tempContents = [
      ...quotationContents.slice(0, index),
      ...quotationContents.slice(index + 1, ),
    ];
    setQuotationContents(tempContents);

    const tempCheck = [
      ...checkContentState
    ];
    tempCheck.splice(index, 1);
    setCheckContentState(tempCheck);

    let isThereNewlyAdded = false;
    for(let i=0; i<tempCheck.length; i++){
      if(tempCheck[i]){
        isThereNewlyAdded = true;
        break;
      };
    };
    setIsNewlyAdded(isThereNewlyAdded);
  }, [checkContentState, editedContentValues, quotationContents, savedContentValues]);

  const handleSaveContentAll = useCallback(() => {
    if (
      savedContentValues !== null &&
      selectedQuotation &&
      selectedQuotation !== defaultQuotation
    ) {
      // Transfer data in temporary variable into content data.
      let contents_in_saved = {};
      let tempContents = [
        ...quotationContents,
      ];

      Object.keys(savedContentValues).forEach(item => {
        const [no, index] = item.split('.');
        tempContents[no][index] = savedContentValues[item];
        if(!contents_in_saved[no]){
          contents_in_saved[no] = true;
        };
      });

      // Check if there is a newly added content having no date in it
      for(let i=checkContentState.length - 1; i >= 0; i--){
        if(checkContentState[i] && !contents_in_saved[i]){
          tempContents.splice(i, 1);
        };
      };

      const temp_all_saved = {
        ...selectedQuotation,
        quotation_contents: JSON.stringify(tempContents),
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        quotation_code: selectedQuotation.quotation_code,
      };
      const resp = modifyQuotation(temp_all_saved);
      resp.then(res => {
        if (res.result) {
          setQuotationContents(tempContents);
          setOrgQuotationContents(tempContents);
          let tempCheck = [];
          tempContents.forEach(content => {
            tempCheck.push(true);
          });
          setCheckContentState(tempCheck);
          setIsNewlyAdded(false);
        } else {
          console.error("Failed to modify Quotation : ", res.data);
        };
      });
    } else {
      console.log("[ QuotationDetailModel ] No saved data");
    }
    setEditedContentValues(null);
    setSavedContentValues(null);
  }, [
    checkContentState,
    cookies.myLationCrmUserId,
    modifyQuotation,
    savedContentValues,
    selectedQuotation,
    quotationContents,
  ]);

  const handleCancelContentAll = useCallback(() => {
    setEditedContentValues(null);
    setSavedContentValues(null);
    const tempContents = [
      ...orgQuotationContents
    ];
    setQuotationContents(tempContents);
  }, []);

  // --- Funtions for Control Windows ---------------------------------
  

  const handleClose = useCallback(() => {
    setEditedDetailValues(null);
    setCurrentQuotation();
  }, [setCurrentQuotation]);

  const qotation_items_info = [
    { key:'quotation_type', title:'quotation.quotation_type', detail:{ type:'select', options:QuotationTypes, editing:handleDetailChange }},
    { key:'quotation_manager', title:'quotation.quotation_manager', detail:{ type:'select', options:usersForSelection, editing:handleDetailChange }},
    { key:'quotation_send_type', title:'quotation.send_type', detail:{ type:'select', options:QuotationSendTypes, editing:handleDetailChange }},
    { key:'quotation_date', title:'quotation.quotation_date', detail:{ type:'date', editing:handleDetailDateChange}},
    { key:'quotation_expiration_date', title:'quotation.expiry_date', detail:{ type:'label', editing:handleDetailChange }},
    { key:'comfirm_date', title:'quotation.confirm_date', detail:{ type:'date', editing:handleDetailDateChange}},
    { key:'delivery_location', title:'quotation.delivery_location', detail:{ type:'label', editing:handleDetailChange }},
    { key:'delivery_period', title:'quotation.delivery_period', detail:{ type:'label', editing:handleDetailChange }},
    { key:'warranty_period', title:'quotation.warranty', detail:{ type:'label', editing:handleDetailChange }},
    { key:'sales_representative', title:'quotation.sales_rep', detail:{ type:'select', options:salespersonsForSelection, editing:handleDetailSelectChange }},
    { key:'payment_type', title:'quotation.payment_type', detail:{ type:'label', editing:handleDetailChange }},
    { key:'list_price', title:'quotation.list_price', detail:{ type:'label', editing:handleDetailChange }},
    { key:'list_price_dc', title:'quotation.list_price_dc', detail:{ type:'label', editing:handleDetailChange }},
    { key:'sub_total_amount', title:'quotation.sub_total_amount', detail:{ type:'label', editing:handleDetailChange }},
    { key:'dc_rate', title:'quotation.dc_rate', detail:{ type:'label', editing:handleDetailChange }},
    { key:'cutoff_amount', title:'quotation.cutoff_amount', detail:{ type:'label', editing:handleDetailChange }},
    { key:'total_quotation_amount', title:'quotation.total_quotation_amount', detail:{ type:'label', editing:handleDetailChange }},
    { key:'profit', title:'quotation.profit_amount', detail:{ type:'label', editing:handleDetailChange }},
    { key:'profit_rate', title:'quotation.profit_rate', detail:{ type:'label', editing:handleDetailChange }},
    { key:'upper_memo', title:'quotation.upper_memo', detail:{ type:'textarea', extra:'long', editing:handleDetailChange }},
    { key:'lower_memo', title:'quotation.lower_memo', detail:{ type:'textarea', extra:'long', editing:handleDetailChange }},
    { key:'lead_name', title:'lead.lead_name', detail:{ type:'label', editing:handleDetailChange }},
    { key:'department', title:'lead.department', detail:{ type:'label', editing:handleDetailChange }},
    { key:'position', title:'lead.position', detail:{ type:'label', editing:handleDetailChange }},
    { key:'mobile_number', title:'lead.mobile', detail:{ type:'label', editing:handleDetailChange }},
    { key:'phone_number', title:'common.phone_no', detail:{ type:'label', editing:handleDetailChange }},
    { key:'fax_number', title:'lead.fax_number', detail:{ type:'label', editing:handleDetailChange }},
    { key:'email', title:'lead.email', detail:{ type:'label', editing:handleDetailChange }},
    { key:'company_name', title:'company.company_name', detail:{ type:'label', extra:'long', editing:handleDetailChange }},
  ];

  // --- useEffect ------------------------------------------------------
  useEffect(() => {
    if((selectedQuotation !== defaultQuotation)
      && (selectedQuotation.quotation_code !== currentQuotationCode)
    ){
      console.log('[QuotationDetailsModel] new quotation is loading!');

      const headerValues = selectedQuotation.quotation_table.split('|');
      if(headerValues && Array.isArray(headerValues)){
        let tableHeaders = [];
        const headerCount = headerValues.length / 3;
        for(let i=0; i < headerCount; i++){
          tableHeaders.push([ headerValues.at(3*i), headerValues.at(3*i + 1),headerValues.at(3*i + 2)]);
        };
        setQuotationHeaders(tableHeaders);
      };

      const contentsData = JSON.parse(selectedQuotation.quotation_contents);
      if(contentsData && Array.isArray(contentsData)){
        setOrgQuotationContents([...contentsData]);
        setQuotationContents([...contentsData]);

        let tempCheck = [];
        for(let i=0; i<contentsData.length; i++){
          tempCheck.push(false);
        };
        setCheckContentState(tempCheck);
      };

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

    setCurrentQuotationCode(selectedQuotation.quotation_code);
  }, [selectedQuotation, editedDetailValues, currentQuotationCode, quotationState]);


  // ----- useEffect for Production -----------------------------------
  useEffect(() => {
    tryLoadAllProductClassList();
    tryLoadAllProducts();
    if (((userState & 1) === 1)
      && ((quotationState & 1) === 1)
      && ((productClassState & 1) === 1)
      && ((productState & 1) === 1)
    ) {
      if((productOptions.length === 0)) {
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
      }
        
      console.log('[QuotationDetailsModel] all needed data is loaded');
      handleInit(false);
    };
}, [allProductClassList, allProducts, productClassState, productOptions, productState, setProductOptions, userState, quotationState, handleInit]);

if (init)
  return <div>&nbsp;</div>;

  return (
    <>
      <div
        className="modal right fade"
        id="quotation-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        data-bs-focus="false"
      >
        <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <DetailTitleItem
                  original={selectedQuotation.quotation_title}
                  name='title'
                  title={t('common.title')}
                  onEditing={handleDetailChange}
                />
                <DetailTitleItem
                  original={selectedQuotation.quotation_number}
                  name='quotation_number'
                  title={t('quotation.doc_no')}
                  onEditing={handleDetailChange}
                />
                <DetailTitleItem
                  original={selectedQuotation.status}
                  name='status'
                  title={t('common.status')}
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
              <div className="tab-content pipeline-tabs border-0">
                <div
                  role="tabpanel"
                  className="tab-pane active p-0"
                  id="not-contacted"
                >
                  <div>
                    <div className="task-infos">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            to="#sub-quotation-details"
                            data-bs-toggle="tab"
                          >
                            {t('common.details')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#sub-quotation-products"
                            data-bs-toggle="tab"
                          >
                            {t('quotation.product_lists')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#sub-quotation-pdf-view"
                            data-bs-toggle="tab"
                          >
                            {t('common.view')}
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
{/*---- Start -- Tab : Detail Quotation-------------------------------------------------------------*/}
                        <div className="tab-pane show active p-0" id="sub-quotation-details">
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item">
                              <Space
                                align="start"
                                direction="horizontal"
                                size="small"
                                style={{ display: 'flex', marginBottom: '0.5rem' }}
                                wrap
                              >
                                { qotation_items_info.map((item, index) => 
                                  <DetailCardItem
                                    key={index}
                                    title={t(item.title)}
                                    defaultValue={selectedQuotation[item.key]}
                                    edited={editedDetailValues}
                                    name={item.key}
                                    detail={item.detail}
                                  />
                                )}
                              </Space>
                            </div>
                          </div>
                          { editedDetailValues !== null &&
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
{/*---- End   -- Tab : Detail Quotation ------------------------------------------------------------*/}
{/*---- Start -- Tab : Product Lists - Quotation ---------------------------------------------------*/}
                        <div className="tab-pane task-related p-0" id="sub-quotation-products">
                          <div className="crms-tasks">
                            <div className="tasks__item crms-task-item active">
                            { quotationContents && quotationContents.length > 0 && 
                                quotationContents.map((content, index1) => {
                                  if(content['1'] === null || content['1'] === 'null') return;
                                  return (
                                    <Collapse key={index1}  defaultActiveKey={[index1]} accordion expandIconPosition="start">
                                      <Panel header={"No." + content["1"]} key={index1}
                                        extra={ <Remove
                                                  style={{ color: 'gray' }}
                                                  onClick={()=>{ handleDeleteConetent(index1);}}
                                                /> } >
                                        <table className="table">
                                          <tbody>
                                            <DetailLabelItem
                                              key={21}
                                              defaultText={content['2']}
                                              saved={savedContentValues}
                                              name={index1 + '.2'}
                                              no_border={true}
                                              title={t('common.category')}
                                              checkEdit={handleCheckContentEditState}
                                              startEdit={handleStartContentEdit}
                                              endEdit={handleEndContentEdit}
                                              editing={handleContentEditing}
                                              checkSaved={handleCheckContentSaved}
                                              cancelSaved={handleCancelContentSaved}
                                            />
                                            { content_indices.map((value, index2) =>
                                                <DetailLabelItem
                                                  key={index2}
                                                  defaultText={content[value]}
                                                  saved={savedContentValues}
                                                  name={index1 + '.' + value}
                                                  title={quotationHeaders[value - 1][1]}
                                                  checkEdit={handleCheckContentEditState}
                                                  startEdit={handleStartContentEdit}
                                                  endEdit={handleEndContentEdit}
                                                  editing={handleContentEditing}
                                                  checkSaved={handleCheckContentSaved}
                                                  cancelSaved={handleCancelContentSaved}
                                                />
                                            )}
                                            <DetailTextareaItem
                                              key={22}
                                              defaultText={content['19']}
                                              saved={savedContentValues}
                                              name={index1 + '.19'}
                                              title={t('quotation.note')}
                                              row_no={3}
                                              no_border={ content['998'] ? false : true}
                                              checkEdit={handleCheckContentEditState}
                                              startEdit={handleStartContentEdit}
                                              endEdit={handleEndContentEdit}
                                              editing={handleContentEditing}
                                              checkSaved={handleCheckContentSaved}
                                              cancelSaved={handleCancelContentSaved}
                                            />
                                            { content['998'] && 
                                              <DetailTextareaItem
                                                key={23}
                                                defaultText={content['998']}
                                                saved={savedContentValues}
                                                name={index1 + '.998'}
                                                title='Comment'
                                                row_no={5}
                                                no_border={true}
                                                checkEdit={handleCheckContentEditState}
                                                startEdit={handleStartContentEdit}
                                                endEdit={handleEndContentEdit}
                                                editing={handleContentEditing}
                                                checkSaved={handleCheckContentSaved}
                                                cancelSaved={handleCancelContentSaved}
                                              />
                                            }
                                          </tbody>
                                        </table>
                                      </Panel>
                                    </Collapse>
                                )})}
                            </div>
                            <div className="detail-add-content">
                              <Add
                                style={{ height: 32, width: 32, color: '#d9c9c9' }}
                                onClick={ handleAddContent }
                              />
                            </div>
                          </div>
                          { ((savedContentValues && Object.keys(savedContentValues).length !== 0)
                              || isNewlyAdded)
                            && (
                              <div className="text-center py-3">
                                <button
                                  type="button"
                                  className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                                  onClick={handleSaveContentAll}
                                >
                                  {t('common.save')}
                                </button>
                                &nbsp;&nbsp;
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-rounded"
                                  onClick={handleCancelContentAll}
                                >
                                  {t('common.cancel')}
                                </button>
                              </div>
                          )}
                        </div>
{/*---- End   -- Tab : Product Lists - Quotation ---------------------------------------------------*/}
{/*---- Start -- Tab : PDF View - Quotation --------------------------------------------------------*/}
                        <div className="tab-pane task-related p-0" id="sub-quotation-pdf-view">
                          { selectedQuotation && (selectedQuotation.quotation_contents.length > 0) &&
                            <QuotationView/>
                          }
                        </div>
{/*---- End   -- Tab : PDF View - Quotation---------------------------------------------------------*/}
                      </div>
                    </div>
                  </div>
                </div>
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

export default QuotationDetailsModel;

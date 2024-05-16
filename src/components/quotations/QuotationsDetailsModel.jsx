import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Collapse, Space, Switch } from "antd";
import { atomCurrentQuotation, defaultQuotation } from "../../atoms/atoms";
import { QuotationRepo } from "../../repository/quotation";
import DetailLabelItem from "../../constants/DetailLabelItem";
import DetailTextareaItem from "../../constants/DetailTextareaItem";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import QuotationView from "./QuotationtView";
import { Add, Remove } from '@mui/icons-material';

const content_indices = ['3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18'];

const QuotationsDetailsModel = () => {
  const { Panel } = Collapse;
  const selectedQuotation = useRecoilValue(atomCurrentQuotation);
  const { modifyQuotation, setCurrentQuotation } = useRecoilValue(QuotationRepo);
  const [ cookies ] = useCookies(["myLationCrmUserId"]);
  const [ t ] = useTranslation();

  const [ editedValues, setEditedValues ] = useState(null);
  const [ savedValues, setSavedValues ] = useState(null);

  const [ orgQuotationDate, setOrgQuotationDate ] = useState(null);
  const [ orgConfirmDate, setOrgConfirmDate ] = useState(null);

  const [ orgQuotationContents, setOrgQuotationContents ] = useState([]);
  const [ quotationContents, setQuotationContents ] = useState([]);
  const [ quotationHeaders, setQuotationHeaders ] = useState([]);

  const [ editedContentValues, setEditedContentValues ] = useState(null);
  const [ savedContentValues, setSavedContentValues ] = useState(null);

  const [ checkContentState, setCheckContentState ] = useState(null);
  const [ isNewlyAdded, setIsNewlyAdded ] = useState(false);
  const [ isFullscreen, setIsFullscreen ] = useState(false);

  // --- Funtions for Quotation Date ----------------------------------------------------
  const handleStartQuotationDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      quotation_date: orgQuotationDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgQuotationDate]);
  const handleQuotationDateChange = useCallback((date) => {
    const tempEdited = {
      ...editedValues,
      quotation_date: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);
  const handleEndQuotationDateEdit = useCallback(() => {
    const quotationDate = editedValues.quotation_date;
    if (quotationDate !== orgQuotationDate) {
      const tempSaved = {
        ...savedValues,
        quotation_date: quotationDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.quotation_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgQuotationDate]);

  // --- Funtions for Confirm Date ------------------------------------------------------
  const handleStartConfirmDateEdit = useCallback(() => {
    const tempEdited = {
      ...editedValues,
      comfirm_date: orgConfirmDate,
    };
    setEditedValues(tempEdited);
  }, [editedValues, orgConfirmDate]);
  const handleConfirmDateChange = useCallback((date) => {
    const tempEdited = {
      ...editedValues,
      comfirm_date: date,
    };
    setEditedValues(tempEdited);
  }, [editedValues])
  const handleEndConfirmDateEdit = useCallback(() => {
    const confirmDate = editedValues.comfirm_date;
    if (confirmDate !== orgConfirmDate) {
      const tempSaved = {
        ...savedValues,
        comfirm_date: confirmDate,
      };
      setSavedValues(tempSaved);
    }
    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited.comfirm_date;
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, orgConfirmDate]);

  // --- Funtions for Editing ----------------------------------------------------------
  const handleCheckEditState = useCallback((name) => {
    return editedValues !== null && name in editedValues;
  }, [editedValues]);

  const handleStartEdit = useCallback((name) => {
    const tempEdited = {
      ...editedValues,
      [name]: selectedQuotation[name],
    };
    setEditedValues(tempEdited);
  }, [editedValues, selectedQuotation]);

  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleEndEdit = useCallback((name) => {
    if (editedValues[name] === selectedQuotation[name]) {
      const tempEdited = {
        ...editedValues,
      };
      delete tempEdited[name];
      setEditedValues(tempEdited);
      return;
    }

    const tempSaved = {
      ...savedValues,
      [name]: editedValues[name],
    };
    setSavedValues(tempSaved);

    const tempEdited = {
      ...editedValues,
    };
    delete tempEdited[name];
    setEditedValues(tempEdited);
  }, [editedValues, savedValues, selectedQuotation]);

  // --- Funtions for Saving -----------------------------------------------------------
  const handleCheckSaved = useCallback((name) => {
    return savedValues !== null && name in savedValues;
  }, [savedValues]);

  const handleCancelSaved = useCallback((name) => {
    const tempSaved = {
      ...savedValues,
    };
    delete tempSaved[name];
    setSavedValues(tempSaved);
  }, [savedValues]);

  const handleSaveAll = useCallback(() => {
    if (
      savedValues !== null &&
      selectedQuotation &&
      selectedQuotation !== defaultQuotation
    ) {
      const temp_all_saved = {
        ...savedValues,
        action_type: "UPDATE",
        modify_user: cookies.myLationCrmUserId,
        quotation_code: selectedQuotation.quotation_code,
      };
      if (modifyQuotation(temp_all_saved)) {
        console.log(`Succeeded to modify Quotation`);
        if(savedValues.quotation_date){
          setOrgQuotationDate(savedValues.quotation_date);
        };
        if(savedValues.confirm_date){
          setOrgConfirmDate(savedValues.confirm_date);
        };
      } else {
        console.error("Failed to modify Quotation");
      }
    } else {
      console.log("[ QuotationDetailModel ] No saved data");
    }
    setEditedValues(null);
    setSavedValues(null);
  }, [
    cookies.myLationCrmUserId,
    modifyQuotation,
    savedValues,
    selectedQuotation,
  ]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
    setSavedValues(null);
  }, []);

  // --- Funtions for Content Editing --------------------------------------------------
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
  }, [savedContentValues, selectedQuotation]);

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
  }, [checkContentState, isNewlyAdded, quotationContents, savedContentValues]);

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
      if (modifyQuotation(temp_all_saved)) {
        console.log(`Succeeded to modify Quotation`);
        setQuotationContents(tempContents);
        setOrgQuotationContents(tempContents);
        let tempCheck = [];
        tempContents.forEach(content => {
          tempCheck.push(true);
        });
        setCheckContentState(tempCheck);
        setIsNewlyAdded(false);
      } else {
        console.error("Failed to modify Quotation");
      }
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

  const handleWidthChange = useCallback((checked) => {
    setIsFullscreen(checked);
  }, []);

  const qotation_items_info = [
    ['quotation_type','quotation.quotation_type',{ type:'label'}],
    ['quotation_manager','quotation.quotation_manager',{ type:'label'}],
    ['quotation_send_type','quotation.send_type',{ type:'label' }],
    ['quotation_date','quotation.quotation_date',
      { type:'date', orgTimeData: orgQuotationDate, timeDataChange: handleQuotationDateChange, startEditTime: handleStartQuotationDateEdit, endEditTime: handleEndQuotationDateEdit }
    ],
    ['quotation_expiration_date','quotation.expiry_date',{ type:'label' }],
    ['comfirm_date','quotation.confirm_date',
      { type:'date', orgTimeData: orgConfirmDate, timeDataChange: handleConfirmDateChange, startEditTime: handleStartConfirmDateEdit, endEditTime: handleEndConfirmDateEdit }
    ],
    ['delivery_location','quotation.delivery_location',{ type:'label' }],
    ['delivery_period','quotation.delivery_period',{ type:'label' }],
    ['warranty_period','quotation.warranty',{ type:'label' }],
    ['sales_representative','quotation.sales_rep',{ type:'label' }],
    ['payment_type','quotation.payment_type',{ type:'label' }],
    ['list_price','quotation.list_price',{ type:'label' }],
    ['list_price_dc','quotation.list_price_dc',{ type:'label' }],
    ['sub_total_amount','quotation.sub_total_amount',{ type:'label' }],
    ['dc_rate','quotation.dc_rate',{ type:'label' }],
    ['cutoff_amount','quotation.cutoff_amount',{ type:'label' }],
    ['total_quotation_amount','quotation.total_quotation_amount',{ type:'label' }],
    ['profit','quotation.profit_amount',{ type:'label' }],
    ['profit_rate','quotation.profit_rate',{ type:'label' }],

    ['upper_memo','quotation.upper_memo',{ type:'textarea', extra:'long' }],
    ['lower_memo','quotation.lower_memo',{ type:'textarea', extra:'long' }],

    ['lead_name','lead.lead_name',{ type:'label' }],
    ['department','lead.department',{ type:'label' }],
    ['position','lead.position',{ type:'label' }],
    ['mobile_number','lead.mobile',{ type:'label' }],
    ['phone_number','common.phone_no',{ type:'label' }],
    ['fax_number','lead.fax_number',{ type:'label' }],
    ['email','lead.email',{ type:'label' }],
    ['company_name','company.company_name',{ type:'label' }],
  ];

  // --- useEffect ------------------------------------------------------
  useEffect(() => {
    console.log('[QuotationsDetailsModel] called!');
    setOrgQuotationDate(
      selectedQuotation.quotation_date
        ? new Date(selectedQuotation.quotation_date)
        : null
    );
    setOrgConfirmDate(
      selectedQuotation.comfirm_date
        ? new Date(selectedQuotation.comfirm_date)
        : null
    );
    if(selectedQuotation !== defaultQuotation)
    {
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
    }
  }, [ selectedQuotation, savedValues ]);

  return (
    <>
      <div
        className="modal right fade"
        id="quotations-details"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row w-100">
                <DetailTitleItem
                  defaultText={selectedQuotation.quotation_title}
                  saved={savedValues}
                  name='title'
                  title={t('common.title')}
                  checkEdit={handleCheckEditState}
                  startEdit={handleStartEdit}
                  endEdit={handleEndEdit}
                  editing={handleEditing}
                  checkSaved={handleCheckSaved}
                  cancelSaved={handleCancelSaved}
                />
                <DetailTitleItem
                  defaultText={selectedQuotation.quotation_number}
                  saved={savedValues}
                  name='quotation_number'
                  title={t('quotation.doc_no')}
                  checkEdit={handleCheckEditState}
                  startEdit={handleStartEdit}
                  endEdit={handleEndEdit}
                  editing={handleEditing}
                  checkSaved={handleCheckSaved}
                  cancelSaved={handleCancelSaved}
                />
                <DetailTitleItem
                  defaultText={selectedQuotation.status}
                  saved={savedValues}
                  name='status'
                  title={t('common.status')}
                  checkEdit={handleCheckEditState}
                  startEdit={handleStartEdit}
                  endEdit={handleEndEdit}
                  editing={handleEditing}
                  checkSaved={handleCheckSaved}
                  cancelSaved={handleCancelSaved}
                />
              </div>
              <Switch checkedChildren="full" onChange={handleWidthChange}/>
              <button
                type="button"
                className="btn-close xs-close"
                data-bs-dismiss="modal"
                onClick={() => setCurrentQuotation()}
              />
            </div>
            <div className="modal-body">
              <div className="tab-content pipeline-tabs border-0">
                <div
                  role="tabpanel"
                  className="tab-pane active p-0"
                  id="not-contacted"
                >
                  <div className="">
                    <div className="task-infos">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            to="#quotation-details"
                            data-bs-toggle="tab"
                          >
                            {t('common.details')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#quotation-products"
                            data-bs-toggle="tab"
                          >
                            {t('quotation.product_lists')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="#quotation-pdf-view"
                            data-bs-toggle="tab"
                          >
                            {t('common.view')}
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
{/*---- Start -- Tab : Detail Quotation-------------------------------------------------------------*/}
                        <div className="tab-pane show active p-0" id="quotation-details">
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
                                    defaultText={selectedQuotation[item.at(0)]}
                                    edited={editedValues}
                                    saved={savedValues}
                                    name={item.at(0)}
                                    title={t(item.at(1))}
                                    detail={item.at(2)}
                                    checkEdit={handleCheckEditState}
                                    startEdit={handleStartEdit}
                                    editing={handleEditing}
                                    endEdit={handleEndEdit}
                                    checkSaved={handleCheckSaved}
                                    cancelSaved={handleCancelSaved}
                                  />
                                )}
                              </Space>
                            </div>
                          </div>
                          { savedValues !== null &&
                            Object.keys(savedValues).length !== 0 && (
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
                        <div className="tab-pane task-related p-0" id="quotation-products">
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
                        <div className="tab-pane task-related p-0" id="quotation-pdf-view">
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

export default QuotationsDetailsModel;

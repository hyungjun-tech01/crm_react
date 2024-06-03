import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Space, Switch } from "antd";
import { atomCurrentConsulting, defaultConsulting } from "../../atoms/atoms";
import { ConsultingRepo } from "../../repository/consulting";
import DetailCardItem from "../../constants/DetailCardItem";
import DetailTitleItem from "../../constants/DetailTitleItem";
import { formatDate, formatTime } from "../../constants/functions";


const ConsultingsDetailsModel = () => {
  const selectedConsulting = useRecoilValue(atomCurrentConsulting);
  const { modifyConsulting, setCurrentConsulting } = useRecoilValue(ConsultingRepo);
  const [ cookies ] = useCookies(["myLationCrmUserId"]);
  const [ t ] = useTranslation();

  const [ isFullScreen, setIsFullScreen ] = useState(false);

  const [ editedValues, setEditedValues ] = useState(null);
  const [ orgReceiptTime, setOrgReceiptTime ] = useState(new Date());

  // --- Funtions for Editing ---------------------------------
  const handleEditing = useCallback((e) => {
    const tempEdited = {
      ...editedValues,
      [e.target.name]: e.target.value,
    };
    console.log('handleEditing : ', tempEdited);
    setEditedValues(tempEdited);
  }, [editedValues]);

  const handleSaveAll = useCallback(() => {
    if(editedValues !== null
      && selectedConsulting
      && selectedConsulting !== defaultConsulting)
    {
      let temp_all_saved = {
        ...editedValues
      };
      if(editedValues.receipt_time) {
        const date_string = formatDate(editedValues.receipt_time);
        const time_string = formatTime(editedValues.receipt_time);
        temp_all_saved['receipt_date'] = date_string;
        temp_all_saved['receipt_time'] = time_string;
      };
      temp_all_saved['action_type'] = "UPDATE";
      temp_all_saved['modify_user'] = cookies.myLationCrmUserId;
      temp_all_saved['consulting_code'] = selectedConsulting.consulting_code;

      if (modifyConsulting(temp_all_saved)) {
        console.log(`Succeeded to modify company`);
        if(editedValues.receipt_time){
          setOrgReceiptTime(editedValues.receipt_time);
        };
      } else {
        console.error('Failed to modify company')
      }
    } else {
      console.log("[ ConsultingDetailModel ] No saved data");
    };
    setEditedValues(null);
  }, [cookies.myLationCrmUserId, modifyConsulting, editedValues, selectedConsulting]);

  const handleCancelAll = useCallback(() => {
    setEditedValues(null);
  }, []);

  // --- Funtions for Receipt time ---------------------------------
  const handleDateChange = useCallback((name, date) => {
    const tempEdited = {
      ...editedValues,
      [name]: date,
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
    setCurrentConsulting();
  }, []);

  const consulting_items_info = [
    ['consulting_type','consulting.type',{ type:'label'}],
    ['receipt_time','consulting.receipt_time',
      { type:'date', time: true, orgTimeData: orgReceiptTime, timeDataChange: handleDateChange }
    ],
    ['product_type','consulting.product_type',{ type:'label' }],
    ['lead_time','consulting.lead_time',{ type:'label' }],
    ['request_type','consulting.request_type',{ type:'label' }],
    ['lead_sales','lead.lead_sales',{ type:'label' }],
    ['department','lead.department',{ type:'label' }],
    ['position','lead.position',{ type:'label' }],
    ['mobile_number','lead.mobile',{ type:'label' }],
    ['phone_number','common.phone_no',{ type:'label' }],
    ['email','lead.email',{ type:'label' }],
    ['company_name','company.company_name',{ type:'label', extra:'long' }],
    ['request_content','consulting.request_content',{ type:'textarea', extra:'long' }],
    ['action_content','consulting.action_content',{ type:'textarea', extra:'long' }],
    ['memo','common.memo',{ type:'textarea', extra:'long' }],
  ];

  useEffect(() => {
    if(selectedConsulting !== defaultConsulting) {
      console.log('[ConsultingsDetailsModel] called!');

      const detailViewStatus = localStorage.getItem("isFullScreen");
      if(detailViewStatus === null){
        localStorage.setItem("isFullScreen", '0');
        setIsFullScreen(false);
      } else if(detailViewStatus === '0'){
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      };

      // Set time from selected consulting data
      let input_time = new Date();
      if(selectedConsulting.receipt_date !== null
        && selectedConsulting.receipt_date !== '' && selectedConsulting.receipt_date !== undefined)
      {
        input_time.setTime(Date.parse(selectedConsulting.receipt_date));

        if(selectedConsulting.receipt_time !== null
          && selectedConsulting.receipt_time !== '' && selectedConsulting.receipt_time !== undefined)
        {
          let converted_time = '';
          const splitted = selectedConsulting.receipt_time.split(' ');
          if(splitted.length === 2) {
            if(splitted[0] === '오전'){
              converted_time = splitted[1] + ' AM';
            } else if(splitted[0] === '오후'){
              converted_time = splitted[1] + ' PM';
            }
          } else {
            converted_time = selectedConsulting.receipt_time;
          };

          if(converted_time !==''){
            const str_ymd = input_time.toLocaleDateString('ko-KR', {year: 'numeric', month: 'numeric', day: 'numeric'})
              + ' ' + converted_time;

            input_time.setTime(Date.parse(str_ymd));
          };
        };
        setOrgReceiptTime(input_time);
      };
    };
  }, [cookies.myLationCrmUserName, selectedConsulting]);

  return (
    <div
      className="modal right fade"
      id="consulting-details"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className={isFullScreen ? 'modal-fullscreen' : 'modal-dialog'} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="row w-100">
              <DetailTitleItem
                defaultText={selectedConsulting.status}
                name='status'
                title={t('consulting.status')}
                editing={handleEditing}
              />
              <DetailTitleItem
                defaultText={selectedConsulting.lead_name}
                name='status'
                title={t('lead.lead_name')}
                editing={handleEditing}
              />
              <DetailTitleItem
                defaultText={selectedConsulting.receiver}
                name='status'
                title={t('consulting.receiver')}
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
                          to="#not-contact-task-details"
                          data-bs-toggle="tab"
                        >
                          {t('common.details')}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#not-contact-task-related"
                          data-bs-toggle="tab"
                        >
                          {t('common.related')}
                        </Link>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className="tab-pane show active p-0"
                        id="not-contact-task-details"
                      >
                        <div className="crms-tasks">
                          <div className="tasks__item crms-task-item">
                            <Space
                              align="start"
                              direction="horizontal"
                              size="small"
                              style={{ display: 'flex', marginBottom: '0.5rem' }}
                              wrap
                            >
                              { consulting_items_info.map((item, index) => 
                                <DetailCardItem
                                  key={index}
                                  defaultText={selectedConsulting[item.at(0)]}
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
            </div>
          </div>
        </div>
        {/* modal-content */}
      </div>
      {/* modal-dialog */}
    </div>
  );
};

export default ConsultingsDetailsModel;

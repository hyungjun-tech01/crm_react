import React, {useEffect, useState, useCallback } from "react";
import {useRecoilValue} from "recoil";
import { useCookies } from "react-cookie";
import { UserRepo } from "../../repository/user";
import {atomCurrentUser} from "../../atoms/atomsUser.jsx";
import { atomAllUsers, atomUserState, atomFilteredUserArray } from "../../atoms/atomsUser";
import { compareText } from "../../constants/functions";

import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";


const Users = () => {
  const { t } = useTranslation();

    const currentUser = useRecoilValue(atomCurrentUser);
    const { loadUsers, setCurrentUser , tryLoadAllUsers, filterUsers} = useRecoilValue(UserRepo);

    const allUsers = useRecoilValue(atomAllUsers);
    const filteredUser = useRecoilValue(atomFilteredUserArray);

//===== Handles to this =============================================================
const [ nowLoading, setNowLoading ] = useState(false);
const [searchCondition, setSearchCondition] = useState("");
const [statusSearch, setStatusSearch] = useState('common.all');
const [ expanded, setExpaned ] = useState(false);

const userState = useRecoilValue(atomUserState);

const handleClickUser = useCallback((id)=> {
  console.log('User Click', id);
}, []);

const handleAddNewCompanyClicked = useCallback(() => {
  console.log('handle');
}, []);


const handleSearchCondition = (newValue) => {
  setSearchCondition(newValue);
  filterUsers(statusSearch, newValue);
};

const handleStatusSearch = (newValue) => {
  setStatusSearch(newValue);
  
  tryLoadAllUsers();

  setExpaned(false);
  setSearchCondition("");
};

// --- Functions used for Table ------------------------------
const columns = [
  {
    title: t('user.user_id'),
    dataIndex: "userId",
    render: (text, record) => (
      <>{text}</>
    ),
    sorter: (a, b) => compareText(a.userId, b.userId),
  },
  {
    title: t('user.name'),
    dataIndex: "userName",
    render: (text, record) => <>{text}</>,
    sorter: (a, b) => compareText(a.userName, b.userName),
  },
  {
    title: t('user.department'),
    dataIndex: "department",
    render: (text, record) => <>{text}</>,
    sorter: (a, b) => compareText(a.department, b.department),
  },
  {
    title: t('user.position'),
    dataIndex: "position",
    render: (text, record) => <>{text}</>,
    sorter: (a, b) => compareText(a.position, b.position),
  },
  {
    title: t('user.is_work'),
    dataIndex: "isWork",
    render: (text, record) => <>{text}</>,
    sorter: (a, b) => compareText(a.isWork, b.isWork),
  },  
  {
    title: t('user.job_type'),
    dataIndex: "jobType",
    render: (text, record) => <>{text}</>,
    sorter: (a, b) => compareText(a.jobType, b.jobType),
  },
  {
    title: t('user.user_role'),
    dataIndex: "userRole",
    render: (text, record) => <>{text}</>,
    sorter: (a, b) => compareText(a.userRole, b.userRole),
  },
];


const [cookies] = useCookies([
  "myLationCrmUserId",
  "myLationCrmUserName",
  "myLationCrmAuthToken",
]);    

useEffect(() => {
    if (currentUser.userId === "") {  
      loadUsers(cookies.myLationCrmUserId);
    }
    tryLoadAllUsers();

    if(((userState & 1) === 1) && ((userState & 1) === 1)){
      setNowLoading(false);
    };

  }, [currentUser, loadUsers]);    

    return (
      <HelmetProvider>
        <div className="page-wrapper">
          <Helmet>
            <title>{t('company.company')}</title>
            <meta name="description" content="Reactify Blank Page" />
          </Helmet>
          <div className="content container-fluid">
             {/* Page Header */}
             <div className="page-header pt-3 mb-0 ">
              <div className="row">
              <div className="text-start" style={{width:'120px'}}>
                  <div className="dropdown">
                    <button className="dropdown-toggle recently-viewed" type="button" onClick={()=>setExpaned(!expanded)}data-bs-toggle="dropdown" aria-expanded={expanded}style={{ backgroundColor: 'transparent',  border: 'none', outline: 'none' }}> {statusSearch === "" ? t('common.all'):t(statusSearch)}</button>
                      <div className={`dropdown-menu${expanded ? ' show' : ''}`}>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('common.all')}>{t('common.all')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('user.name')}>{t('user.name')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('user.department')}>{t('user.department')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('user.position')}>{t('user.position')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('user.is_work')}>{t('user.is_work')}</button>
                        <button className="dropdown-item" type="button" onClick={()=>handleStatusSearch('user.job_type')}>{t('user.job_type')}</button>
                      </div>
                  </div>
                </div> 
                
                <div className="col text-start" style={{ width: '300px' }}>
                  <input
                    id="searchCondition"
                    className="form-control"
                    type="text"
                    placeholder={t('common.search_here')}
                    style={{ width: '300px', display: 'inline' }}
                    value={searchCondition}
                    onChange={(e) => handleSearchCondition(e.target.value)}
                  />
                </div>
                <div className="col text-end">
                  <ul className="list-inline-item pl-0">
                    <li className="list-inline-item">
                      <button
                        className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                        id="add-task"
                        data-bs-toggle="modal"
                        data-bs-target="#add_company"
                        onClick={handleAddNewCompanyClicked}
                      >
                        {t('user.new_user')}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
             </div>
              {/* /Page Header */}
              <div className="row">
                <div className="col-md-12">
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="table-responsive">
                        <Table
                          pagination={{
                            total: filteredUser.length > 0 ? filteredUser.length : 0,
                            showTotal: ShowTotal,
                            showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            ItemRender: ItemRender,
                          }}
                          className="table"
                          loading={nowLoading}
                          style={{ overflowX: "auto" }}
                          columns={columns}
                          dataSource={filteredUser.length > 0 ? filteredUser : null}
                          rowKey={(record) => record.user_id}
                          onRow={(record, rowIndex) => {
                            return {
                              onClick: () => {
                                handleClickUser(record.user_id);
                              },
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
        
      </HelmetProvider>
    );
};
export default Users;
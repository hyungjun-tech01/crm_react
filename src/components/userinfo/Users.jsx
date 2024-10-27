import React, {useEffect, useState, useCallback } from "react";
import {useRecoilValue} from "recoil";
import { useCookies } from "react-cookie";
import { UserRepo } from "../../repository/user";
import {atomCurrentUser} from "../../atoms/atomsUser.jsx";
import { atomAllUsers, atomUserState, atomFilteredUserArray } from "../../atoms/atomsUser";
import { compareText } from "../../constants/functions";
import UserDetailsModel from "./UserDetailsModel";
import UserDetailModel from "./UserDetailModel";
import UserAddModal from "./UserAddModal";


import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { ItemRender, onShowSizeChange, ShowTotal } from "../paginationfunction";
import * as bootstrap from '../../assets/js/bootstrap.bundle';


const Users = () => {
  const { t } = useTranslation();

    const currentUser = useRecoilValue(atomCurrentUser);
    const { loadUsers, setCurrentUser , tryLoadAllUsers, filterUsers, setCurrentModifyUser} = useRecoilValue(UserRepo);

    const allUsers = useRecoilValue(atomAllUsers);
    const filteredUser = useRecoilValue(atomFilteredUserArray);

//===== Handles to this =============================================================
const [ nowLoading, setNowLoading ] = useState(false);
const [searchCondition, setSearchCondition] = useState("");
const [statusSearch, setStatusSearch] = useState('common.all');
const [ expanded, setExpaned ] = useState(false);

const userState = useRecoilValue(atomUserState);

const [initToAddUser, setInitToAddUser] = useState(false);
const [initToEditUser, setInitToEditUser] = useState(false);


const handleAddNewCompanyClicked = useCallback(() => {
  setInitToAddUser(true);
}, [setInitToAddUser]);


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

const handleClickUser = useCallback((id) => {
  console.log('[User] set current user : ', id);
  setInitToEditUser(true);
  setCurrentModifyUser(id);
  //setSelectedCategory({category: 'company', item_code: id});
  setTimeout(()=>{
    const modalElement = document.getElementById('user-details-modal');
   // console.log('modalElement',modalElement);
    let myModal = new bootstrap.Modal(document.getElementById('user-details-model'), {
      keyboard: false
    });
      myModal.show();
  }, 500);
  
}, [setCurrentModifyUser]);

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
                        data-bs-target="#add_user"
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
                          rowKey={(record) => record.userId}
                          onRow={(record, rowIndex) => {
                            return {
                              onClick: () => {
                                handleClickUser(record.userId);
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
        <UserDetailsModel
          init={initToEditUser}
          handleInit={setInitToEditUser}
        />
        <UserDetailModel/> 
        <UserAddModal init={initToAddUser} handleInit={setInitToAddUser}/>         
        </div>
      </HelmetProvider>
    );
};
export default Users;
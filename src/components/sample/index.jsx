import React, {useEffect} from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useCookies } from "react-cookie";
import {atomCurrentUser} from "../../atoms/atomsUser.jsx";
import {defaultLead} from "../../atoms/atoms.jsx";
import {useRecoilValue} from "recoil";
import { UserRepo } from "../../repository/user";
import Paths from "../../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

const Sample = () => {

  useEffect(() => {

  const info ={
      lead_code: 'AE490436080B074BBAF5F3EE360A2434',
      company_code:'AE490436080B074BBAF5F3EE360A2434',
      consulting_code: '4B70907C2F57D74B85BC157CFB4527E7',
      receipt_date:'2024.01.01',
      receipt_time:'오전 10:21:51',
      request_content:"문제 접수",
      action_content:"해결 접수",
      action_type: 'UPDATE',
      modify_user: 'crm 관리자12'
     }    
   
  // const info = {
  //   action_type:'UPDATE'                ,   // 'ADD', 'UPDATE'
  //   lead_code: '44A1DB07FD251E5088364163E54D5EAC'                 ,   // ADD일때는 들어오면 안되고, UPDATE일때는 반드시 들어와야
  //   leads_name           :   '테스트리드---111'    ,
  //   mobile_number        :   "1"    ,
  //   email                :   "1"    ,
  //   counter              :   1111   ,   // in integer 
  //   application_engineer :   "1"    ,
  //   modify_user: 'crm 관리자3',
  //   status               :   "1"    };

    try{
      const response = fetch(`${BASE_PATH}/modifyConsult`,{
          method: "POST", 
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(info)
         }); 
         const responseMessage = response.json();
         console.log(responseMessage);
   }catch(err){
      console.error(err);
  }

  }, []);
  
  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>Mylation - UserInfo</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          <div className="crms-title row bg-white">
            <div className="col  p-0">
              <h3 className="page-title m-0">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="feather-user" />
                </span>{" "}
                Sample{" "}
              </h3>
            </div>
            <div className="col p-0 text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                {/* <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li> */}
                <li className="breadcrumb-item active">Sample</li>
              </ul>
            </div>
          </div>
          {/* Page Header */}

        {/* /Page Content */}
      </div>
      </div>
    </HelmetProvider>
  );
};
export default Sample;

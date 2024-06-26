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

  // const info ={
  //     lead_code: 'AE490436080B074BBAF5F3EE360A2434',
  //     company_code:'AE490436080B074BBAF5F3EE360A2434',
  //     consulting_code: '4B70907C2F57D74B85BC157CFB4527E7',
  //     receipt_date:'2024.01.01',
  //     receipt_time:'오전 10:21:51',
  //     request_content:"문제 접수",
  //     action_content:"해결 접수",
  //     action_type: 'UPDATE',
  //     modify_user: 'crm 관리자12'
  //    }    
   
  // const info = {
  //   action_type:'ADD'                ,   // 'ADD', 'UPDATE'
  //   lead_code: '44A1DB07FD251E5088364163E54D5EAC'                 ,   // ADD일때는 들어오면 안되고, UPDATE일때는 반드시 들어와야
  //   company_code: '44A1DB07FD251E5088364163E54D5EAC'                 , 
  //   lead_name           :   '테스트리드---111'    ,
  //   mobile_number        :   "1"    ,
  //   email                :   "1"    ,
  //   counter              :   1111   ,   // in integer 
  //   application_engineer :   "1"    ,
  //   modify_user: 'crm 관리자3',
  //   status               :   "1"    };

    // const info = {
    //   action_type:'UPDATE'                ,   // 'ADD', 'UPDATE'
    //   purchase_code  : "BA030572AC0AD04AB428E9ECDBCA08C5"     , 
    //   company_code   :"AAAA"     ,
    //   product_code   : "AAAA"     ,
    //   product_type   :"AAAA"     ,
    //   product_name   :"BBBBBBB"     ,
    //   serial_number  :"1234"     ,
    //   delivery_date  :"2024.03.01"      ,
    //   ma_finish_date : "2025.10.10"      , 
    //   price : "1110000",
    //   quantity: "100"};    
    const v_txn_contents = [{transaction_code:"bbbb", product_name:null}, {transaction_code:"aaa", product_name:null}];
    const b_txn_contents = JSON.stringify(v_txn_contents);

    // const info = {
    //     action_type:'UPDATE'                ,   // 'ADD', 'UPDATE'
    //     quotation_code : '495D3F942621ED9C8D0063292EC0240C'            ,         
    //     lead_code        : 'BBB'         ,          
    //     region     : '성동구'   ,         
    //     company_name     : '어니언'      ,   
    //     quotation_date        : '2024.03.28'    ,
    //     modify_user : 'hjkim',
    //     quotation_amount : '9999.99' ,
    //     quotation_contents :    b_txn_contents            
    //   };          
    // --4B554B54422FD42C9A153EABB0CEEFDE
    const info ={
        action_type:'ADD'                ,   // 'ADD', 'UPDATE'
        lead_code : '271D70FE7C4C8744A78149F255FD7C72',
         company_code : '4B554B54422FD42C9A153EABB0CEEFDE' ,   // 4B554B54422FD42C9A153EABB0CEEFDE
        lead_name : '테스트리드 변경',
        modify_user : 'admin'
    }
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

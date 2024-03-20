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
      company_code: '',
      company_number: '99999',
      group_: 'etc',
      company_scale: '',
      deal_type: 'buyer',
      company_name: '(주)신도리코',
      company_name_eng: 'Sindoh Co., Ltd.',
      business_registration_code: '',
      establishment_date: '1997.08.29',
      closure_date: null,
      ceo_name: '',
      business_type: '',
      business_item: '',
      industry_type: '',
      company_zip_code: '',
      company_address: '서울시 성동구 성수이로24길 3',
      company_phone_number: '',
      company_fax_number: '',
      homepage: '',
      memo: 'test',
      counter: 0,
      account_code: '',
      bank_name: '',
      account_owner: '',
      sales_resource: 'chs',
      application_engineer: 'chs',
      region: '',
      action_type: 'ADD',
      modify_user: 'crm 관리자'
    }
//   const info = {
//     action_type:'UPDATE'                ,   // 'ADD', 'UPDATE'
// leads_code:"31F7C09C971245C9B26DD18AC5BD12C5"                 ,   // ADD일때는 들어오면 안되고, UPDATE일때는 반드시 들어와야
// company_code :""               ,
// leads_index :            0    ,  // in integer
// company_index:           0    ,  // in integer
// lead_number  :           "1"    ,
// group_        :          "1"    ,
// sales_resource :         "1"    ,
// region          :        "1"    ,
// company_name     :       "1"    ,
// company_zip_code  :      "1"    ,
// company_address    :     "1"    ,
// company_phone_number:    "1"    ,
// company_fax_number   :   "1"    ,
// leads_name           :   "1"    ,
// is_keyman            :   "1"    ,
// department           :   "1"    ,
// position             :   "1"    ,
// mobile_number        :   "1"    ,
// company_name_en      :   "1"    ,
// email                :   "1"    ,
// homepage             :   "1"    ,
// modify_user          :   "1"    ,
// counter              :   0   ,   // in integer 
// application_engineer :   "1"    ,
// status               :   "1"    ,
    
//   };
    try{
      const response = fetch(`${BASE_PATH}/modifyCompany`,{
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

import React, {useEffect} from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useCookies } from "react-cookie";
import {atomCurrentUser} from "../../atoms/atomsUser.jsx";
import {useRecoilValue} from "recoil";
import { UserRepo } from "../../repository/user";
import Paths from "../../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

const Sample = () => {

  useEffect(() => {
  //   const info = {
  //   action_type : 'ADD',
  //   company_code : "CE17D394A9FC4507B927446E20D90AEE",
  //   company_number: "1000",
  //   group_: "",
  //   company_scale: "",
  //   deal_type: "",
  //   company_name: "테슽라---1",
  //   company_name_eng: "",
  //   business_registration_code: "",
  //   establishment_date: '2016.01.01',
  //   closure_date: null,
  //   ceo_name: "",
  //   business_type: "",
  //   business_item: "",
  //   industry_type: "",
  //   company_zip_code: "",
  //   company_address: "",
  //   company_phone_number: "",
  //   company_fax_number: "",
  //   homepage: "",
  //   memo: "",
  //   modify_user:admin",
  //   counter: 10000,
  //   account_code: "",
  //   bank_name: "",
  //   account_owner: "",
  //   sales_resource: "",
  //   application_engineer: "",
  //   region: "",
  // };
  const info = {company_code:"",
  company_number:"99999",
  group_:"prospective",
  company_scale:"",
  deal_type:"",
  company_name:"(주)크로버",
  company_name_eng:"Clover Co., Ltd.",
  business_registration_code:"",
  establishment_date:"1998.08.12",
  closure_date:null,
  ceo_name:"",
  business_type:"",
  business_item:"",
  industry_type:"",
  company_zip_code:"",
  company_address:"",
  company_phone_number:"",
  company_fax_number:"",
  homepage:"",
  memo:"",
  counter:0,
  account_code:"",
  bank_name:"",
  account_owner:"",
  sales_resource:"chs",
  application_engineer:"chs",
  region:"",
  modify_user:"test11111",
  action_type:"ADD"};

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

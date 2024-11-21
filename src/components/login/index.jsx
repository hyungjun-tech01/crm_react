import React, { useCallback, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Alert } from 'antd';
import LOGO from "../../assets/images/nodeData.png";
import priorLOGO from "../../assets/images/priorNodeData.png"
import { apiLoginValidate } from "../../repository/user.jsx";
import { atomCurrentUser } from "../../atoms/atomsUser.jsx";
import { AccountRepo } from "../../repository/account";

const createMessage = (error) => {
  if (!error) {
    return error;
  }
  switch (error.message) {
    case 'Invalid email or password':
      return {
        ...error,        
        type: 'error',
        description: 'login.invalidEmailOrUsername',
      };
    case 'Failed to fetch':
      return {
        ...error,
        type: 'warning',
        description: 'login.noInternetConnection',
      };
    case 'Network request failed':
      return {
        ...error,    
        type: 'warning',
        description: 'login.serverConnectionFailed',
      };
    default:
      return {
        ...error,
        type: 'warning',
        description: 'login.unknownError',
      };
  }
};

const Login = () => {
  const { t } = useTranslation();
  const [ cookies, setCookie, removeCookie ] = useCookies([
    "myLationCrmUserId",
    "myLationCrmUserName",
    "myLationCrmAuthToken",
    "myLationCrmAccountInfo",
  ]);
  const [currentUser, setCurrentUser] = useRecoilState(atomCurrentUser);
  const history = useHistory();
  const [loginUserId, setLoginUserId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState({message:"", type:"", description:""});
  const { loadAccount } = useRecoilValue(AccountRepo);

  const onMessageDismiss = () => {
    setLoginError({message:"", type:"", description:""});
    document.getElementById('loginForm').reset();
  };


  // event.preventDefault() 주로 사용되는 경우는

  // 1. a 태그를 눌렀을때도 href 링크로 이동하지 않게 할 경우
  
  // 2. form 안에 submit 역할을 하는 버튼을 눌렀어도 새로 실행하지 않게 하고싶을 경우 (submit은 작동됨)
  
  //   -> 진짜네..(새로고침이 안됨)
  
  //   const onSubmit = (event:React.FormEvent<HTMLFormElement>)=> {
  //     event.preventDefault();
  //     console.log("hello", value);
  //   };


  const handleCheckLogin = useCallback(async (event) => {
    event.preventDefault();
    const res = await apiLoginValidate(loginUserId, loginPassword);
    console.log("user", res);
      
    if (res.message === "success") {  
      setCookie("myLationCrmUserId", res.userId);
      setCookie("myLationCrmUserName", res.userName);
      setCookie("myLationCrmAuthToken", res.token);
      setCurrentUser(res);
      
      const accountInfo = await loadAccount();
      console.log("account", accountInfo);
      if(!!accountInfo) {
        setCookie("myLationCrmAccountInfo", accountInfo)
      };
      history.push("/");
    } else {
      setLoginError(createMessage(res));          
      removeCookie('myLationCrmUserId');
      removeCookie('myLationCrmUserName');
      removeCookie('myLationCrmAuthToken');
      removeCookie('myLationCrmAccountInfo');
    }
  },[loginUserId, loginPassword]);

  return (
    <>
      {/* Main Wrapper */}
      <HelmetProvider>
        {/* <div className="page-wrapper"> */}
          <Helmet>
            <title>Login - CRMS admin template</title>
            <meta name="description" description="Reactify Blank Page" />
          </Helmet>
          <div className="main-wrapper">
            <div className="account-description">
              <div className="container">
                {/* Account Logo */}
                <div className="account-logo">
                  <Link to="/">
                    <span>
                      <img src={priorLOGO} alt="" />
                      <img src={LOGO} alt="NodeData Co., Ltd" />
                    </span>
                  </Link>
                </div>
                {/* /Account Logo */}
                <div className="account-box">
                  <div className="account-wrapper">
                    <h3 className="account-title">{t('login.login')}</h3>
                    {/* Account Form */}
                    <form id='loginForm'>
                      <div className="form-group">
                        <label>{t('login.userId')}</label>
                        <input
                          tabIndex="1"
                          type="text"
                          className="form-control"
                          onChange={(e) => setLoginUserId(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <div className="row">
                          <div className="col">
                            <label>{t('login.password')}</label>
                          </div>
                          <div className="col-auto">
                            {/*
                            <Link className="text-muted" to="/forgot-password">
                              {t('login.forgotPassword')}
                            </Link>
                            */}
                          </div>
                        </div>
                        <input
                          className="form-control"
                          tabIndex="2"
                          type="password"
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                      {loginError.message==="" ? "" : (
                          <Alert
                            message={loginError.message}
                            type={loginError.type}
                            showIcon
                            closable
                            description={t(`${loginError.description}`)}
                            afterClose={onMessageDismiss}
                          />
                        )
                      }
                      <div className="form-group text-center mt-2">
                        {/* <Link onClick = {()=>handleCheckLogin()} to="/" className="btn btn-primary account-btn"> */}
                        <button
                          onClick={handleCheckLogin}
                          className="btn btn-primary account-btn"
                        >
                          {t('login.login')}
                        </button>
                        {/* <Link onClick = {()=>handleCheckLogin()} to="/" className="btn btn-primary account-btn">
                          Login
                        </Link> */}
                      </div>
                      {/* <div className="account-footer">
                        <p>
                          Don't have an account yet?{" "}
                          <Link to="/register">Register</Link>
                        </p>
                      </div> */}
                    </form>
                    {/* /Account Form */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}
      </HelmetProvider>
      {/* /Main Wrapper */}
    </>
  );
};

export default Login;

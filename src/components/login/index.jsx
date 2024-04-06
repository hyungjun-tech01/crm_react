import React, { useCallback, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import IMG01 from "../../assets/images/logo.png";
import { apiLoginValidate } from "../../repository/user.jsx";
import {atomCurrentUser} from "../../atoms/atomsUser.jsx";

const Login = () => {
  const [ cookies, setCookie ] = useCookies([
    "myLationCrmUserId",
    "myLationCrmUserName",
    "myLationCrmAuthToken",
  ]);
  const [currentUser, setCurrentUser] = useRecoilState(atomCurrentUser);
  const history = useHistory();
  const [loginUserId, setLoginUserId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  // event.preventDefault() 주로 사용되는 경우는

  // 1. a 태그를 눌렀을때도 href 링크로 이동하지 않게 할 경우
  
  // 2. form 안에 submit 역할을 하는 버튼을 눌렀어도 새로 실행하지 않게 하고싶을 경우 (submit은 작동됨)
  
  //   -> 진짜네..(새로고침이 안됨)
  
  //   const onSubmit = (event:React.FormEvent<HTMLFormElement>)=> {
  //     event.preventDefault();
  //     console.log("hello", value);
  //   };


  const handleCheckLogin = useCallback((event) => {
    event.preventDefault();
    console.log("Login index", loginUserId, loginPassword);
    const response = apiLoginValidate(loginUserId, loginPassword);
    response.then((res) => {
      console.log("res", res);
      if (res.message === "success") {  
        setCookie("myLationCrmUserId", res.userId);
        setCookie("myLationCrmUserName", res.userName);
        setCookie("myLationCrmAuthToken", res.token);
        setCurrentUser(res);
        console.log(currentUser);
        history.push("/");
      }
    });
  },[loginUserId, loginPassword]);

  return (
    <>
      {/* Main Wrapper */}
      <HelmetProvider>
        {/* <div className="page-wrapper"> */}
          <Helmet>
            <title>Login - CRMS admin template</title>
            <meta name="description" content="Reactify Blank Page" />
          </Helmet>
          <div className="main-wrapper">
            <div className="account-content">
              <div className="container">
                {/* Account Logo */}
                <div className="account-logo">
                  <Link to="/">
                    <img src={IMG01} alt="Dreamguy's Technologies" />
                  </Link>
                </div>
                {/* /Account Logo */}
                <div className="account-box">
                  <div className="account-wrapper">
                    <h3 className="account-title">Login</h3>
                    <p className="account-subtitle">Access to our dashboard</p>
                    {/* Account Form */}
                    <form>
                      <div className="form-group">
                        <label>User Id</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setLoginUserId(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <div className="col">
                            <label>Password</label>
                          </div>
                          <div className="col-auto">
                            <Link className="text-muted" to="/forgot-password">
                              Forgot password?
                            </Link>
                          </div>
                        </div>
                        <input
                          className="form-control"
                          type="password"
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                      <div className="form-group text-center">
                        {/* <Link onClick = {()=>handleCheckLogin()} to="/" className="btn btn-primary account-btn"> */}
                        <button
                          onClick={handleCheckLogin}
                          className="btn btn-primary account-btn"
                        >
                          Login
                        </button>
                        {/* <Link onClick = {()=>handleCheckLogin()} to="/" className="btn btn-primary account-btn">
                          Login
                        </Link> */}
                      </div>
                      <div className="account-footer">
                        <p>
                          Don't have an account yet?{" "}
                          <Link to="/register">Register</Link>
                        </p>
                      </div>
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

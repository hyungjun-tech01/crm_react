import React, { useCallback, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import IMG01 from "../../assets/images/logo.png";
import { apiLoginValidate } from "../../repository/user.jsx";

const Login = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies([
    "myLationCrmUserId",
    "myLationCrmUserName",
    "myLationCrmAuthToken",
  ]);
  const history = useHistory();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleCheckLogin = useCallback(() => {
    console.log("Login index", loginEmail, loginPassword);
    const response = apiLoginValidate(loginEmail, loginPassword);
    response.then((res) => {
      console.log("res", res);
      if (res.message === "success") {
        setCookie("myLationCrmUserId", res.userId);
        setCookie("myLationCrmUserName", res.userName);
        setCookie("myLationCrmAuthToken", res.token);
        history.push("/");
      }
    });
  },[loginEmail, loginPassword]);

  return (
    <>
      {/* Main Wrapper */}
      <HelmetProvider>
        <div className="page-wrapper">
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
                        <label>Email Address</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setLoginEmail(e.target.value)}
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
                        <div
                          onClick={handleCheckLogin}
                          className="btn btn-primary account-btn"
                        >
                          Login
                        </div>
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
        </div>
      </HelmetProvider>
      {/* /Main Wrapper */}
    </>
  );
};

export default Login;

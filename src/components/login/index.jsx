import React, {useCallback} from "react";
import { Helmet } from "react-helmet";
import {useCookies} from "react-cookie";
import { Link , useHistory } from "react-router-dom";
import IMG01 from "../../assets/images/logo.png";
const Login =()=> {
  const [cookies, setCookie, ] = useCookies(['myLationCrmUserId','myLationCrmUserName', 'myLationCrmAuthToken']);
  const history = useHistory();

  const handleCheckLogin = () => {
    setCookie('myLationCrmUserId', 'A');
    setCookie('myLationCrmUserName', 'A');
    setCookie('myLationCrmAuthToken','AAA');
    history.push("/");
  }   

  return(
<>
  {/* Main Wrapper */}
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
                <input className="form-control" type="text" />
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
                <input className="form-control" type="password" />
              </div>
              <div className="form-group text-center">
                {/* <Link onClick = {()=>handleCheckLogin()} to="/" className="btn btn-primary account-btn"> */}
                <Link onClick = {()=>handleCheckLogin()} to="/" className="btn btn-primary account-btn">
                  Login
                </Link>
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
  {/* /Main Wrapper */}
</>

)};
export default Login;
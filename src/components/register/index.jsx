import React, {useCallback, useState} from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { apiLoginValidate, apiRegister } from "../../repository/user.jsx";
import { Link , useHistory} from "react-router-dom";
import {atomCurrentUser} from "../../atoms/atomsUser.jsx";
import IMG01 from "../../assets/images/logo.png";
import {Snackbar, Button, Alert, AlertProps} from "@mui/material";

const Register = () => {
  const [ cookies, setCookie ] = useCookies([
    "myLationCrmUserId",
    "myLationCrmUserName",
    "myLationCrmAuthToken",
  ]);
  const history = useHistory();
  const [currentUser, setCurrentUser] = useRecoilState(atomCurrentUser);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [Email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [open , setOpen] = useState(false);
  const [registerErrMsg, setRegisterErrMsg] = useState("");
 
  const handleClose = (event, reason)=>{
    if(reason === "clickaway"){
        return;
    }
    setOpen(false);
  }


  const handleRegisterUser = useCallback((event) => {
    event.preventDefault();
    console.log("Login index", userId, Email, password);

    // register  성공한다면 . 후에 login 
    const registerResponse = apiRegister(userId, userName, Email, password); 
    registerResponse.then((res) => {
      console.log("res", res);
      if(res.message){
        if (res.message === "success") {  
          const response = apiLoginValidate(userId, password);
          response.then((res) => {
            if (res.message === "success") {  
              setCookie("myLationCrmUserId", res.userId);
              setCookie("myLationCrmUserName", res.userName);
              setCookie("myLationCrmAuthToken", res.token);
              setCurrentUser(res);
              console.log(currentUser);
              history.push("/");
            }
          });
        }else{
          setRegisterErrMsg(res.message);
          setOpen(true);
        }
      }
    });  

    
  },[userId, Email, password]);

  return (
    <>
      <HelmetProvider>
        <div className="main-wrapper">
          <Helmet>
            <title>Register - User </title>
            <meta name="description" content="Reactify Blank Page" />
          </Helmet>
          <div className="account-content">
            <div className="container">
              <div className="account-logo">
                <Link to="/">
                  <img src={IMG01} alt="Dreamguy's Technologies" />
                </Link>
              </div>

              <div className="account-box">
                <div className="account-wrapper">
                  <h3 className="account-title">Register</h3>
                  <p className="account-subtitle">Access to our dashboard</p>
                  {/***** 에러메세지 표현 *****/}
                  <Snackbar 
                      message={registerErrMsg}
                      autoHideDuration={2000}
                      open={open}
                      onClose={handleClose}
                      anchorOrigin={{
                          vertical:"bottom",
                          horizontal:"center"
                      }}
                  />

                  <form>
                    <div className="form-group">
                      <label>User Id</label>
                      <div style={{display: 'flex'}}>
                        <input className="form-control" 
                           value={userId}
                           onChange={(e) => setUserId(e.target.value)}
                           type="text"  
                           style={{ flex: 1 , marginRight: '10px'}} />
                      </div>
                    </div>
                    <div className="form-group">
                    <label>User Name</label>
                      <div style={{display: 'flex'}}>
                        <input className="form-control" 
                           value={userName}
                           onChange={(e) => setUserName(e.target.value)}
                           type="text"  
                           style={{ flex: 1 , marginRight: '10px'}} />
                      </div>
                    </div>                    
                    <div className="form-group">
                      <label>Email</label>
                      <input className="form-control" 
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text" />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input className="form-control" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" />
                    </div>
                    <div className="form-group">
                      <label>Repeat Password</label>
                      <input className="form-control" 
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        type="password" />
                    </div>
                    <div className="form-group text-center">
                      {/* <Link to="/login" className="btn btn-primary account-btn">
                        Register
                      </Link> */}

                      <button
                          onClick={handleRegisterUser}
                          className="btn btn-primary account-btn"
                        >
                          Register
                        </button>
                    </div>
                    <div className="account-footer">
                      <p>
                        Already have an account? <Link to="/login">Login</Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HelmetProvider>
    </>
  );
};

export default Register;

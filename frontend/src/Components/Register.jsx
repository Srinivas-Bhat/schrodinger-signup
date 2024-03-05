import React, { useEffect, useState } from "react";
import "../styles/signup.css";
import register from "../Assets/register.svg";
import logo from "../Assets/logo.svg";
import { strengthColor, strengthIndicator } from "../utils/helper";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [mode, setMode] = useState("sign-up-mode");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const [isUserOnline, setIsUserOnline] = useState(null);

  // toggle b/w signin and signup
  const handleSignupToggle = () => {
    setMode("sign-up-mode");
  };

  // toggle b/w signin and signup
  const handleSignInToggle = () => {
    setMode("");
  };

  //Username Validation
  const handleUsernameChange = (e) => {
    const { value } = e.target;
    if (value === "" || value.trim().length < 0) {
      setError({ ...error, name: true });
    } else {
      setError({ ...error, name: false });
      setForm({ ...form, name: value });
    }
  };

  //Email Validation
  const handleEmailChange = (e) => {
    const { value } = e.target;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      setForm({ ...form, email: value });
      setError({ ...error, email: false });
    } else {
      setError({ ...error, email: true });
    }
  };

  //Password Validation
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
    if (value === "" || value.trim().length < 0) {
      setError({ ...error, password: true });
    } else {
      setError({ ...error, password: false });
      setForm({ ...form, password: value });
    }
  };

  // Submit for the for submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    console.log("handleSubmit function");
    if (error.name || error.email || error.password) {
      toast.error(`Please fill all the fields`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (navigator.onLine) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await axios.post(
          `${process.env.REACT_APP_DEPLOYED_BACKEND_LINK}/api/user/signup`,
          { name: form.name, email: form.email, password: form.password },
          config
        );
        // console.log(data);
        toast.success(
          `🎊 ${data?.name?.toUpperCase()}, You have been successfully registered`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setForm({
          name: "",
          email: "",
          password: "",
        });
        setError({
          name: false,
          email: false,
          password: false,
        });
        return "done";
      } catch (err) {
        console.log(err);
        toast.error(`${err.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      if (
        form.name &&
        form.email &&
        form.password &&
        !error.name &&
        !error.email &&
        !error.password
      ) {
        let data = {
          name: form.name,
          email: form.email,
          password: form.password,
        };
        localStorage.setItem("userInfo", JSON.stringify(data));
        setForm({
          name: "",
          email: "",
          password: "",
        });
        setError({
          name: false,
          email: false,
          password: false,
        });
        toast.success(`🎊  You have been successfully registered`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });

        return;
      }
    }
  };

  // function to submit if the user is online again
  const handleOnlineSubmit = async (userInfo) => {
    console.log("onlineSubmit function", userInfo);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_DEPLOYED_BACKEND_LINK}/api/user/signup`,
        { name: userInfo.name, email: userInfo.email, password: userInfo.password },
        config
      );
      // console.log(data);
      toast.success(
        `🎊 ${data?.name?.toUpperCase()}, You have been successfully registered`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setForm({
        name: "",
        email: "",
        password: "",
      });
      setError({
        name: false,
        email: false,
        password: false,
      });
      localStorage.removeItem("userInfo");
      return "done";
    } catch (err) {
      console.log(err);
      toast.error(`${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // to check if the user is online or not
  let interval = null;
  const InternetErrMessagenger = () => setIsUserOnline(navigator.onLine === true);

  useEffect(() => {
    // localStorage.removeItem("userInfo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    interval = setInterval(InternetErrMessagenger, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (isUserOnline === true && userInfo) {
      // console.log(handleOnlineSubmit(userInfo))
      handleOnlineSubmit(userInfo).then((res) => {
        console.log(res);
      });
    }
  }, [isUserOnline]);

  return (
    <>
      <ToastContainer />
      <div className={`container ${mode}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* signin form  */}
            <form action="#" className="sign-in-form">
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" value="Login" className="btn solid" />
              <p className="social-text">Or Sign in with social platforms</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>

            {/* signup form  */}
            <form action="#" className="sign-up-form">
              <h2 className="title">Sign up</h2>
              <div
                className="input-field"
                style={{ border: error.name ? "1px solid red" : "none" }}
              >
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  name="name"
                  onChange={handleUsernameChange}
                  // value={form.name}
                />
              </div>
              <div
                className="input-field"
                style={{ border: error.email ? "1px solid red" : "none" }}
              >
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleEmailChange}
                  // value={form.email}
                />
              </div>
              <div
                className="input-field"
                style={{ border: error.password ? "1px solid red" : "none" }}
              >
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handlePasswordChange}
                  // value={form.password}
                />
              </div>

              {strength !== 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: 150,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: level?.color,
                      width: "100%",
                      height: 8,
                      borderRadius: "7px",
                      margin: "15px 0",
                    }}
                  ></div>
                  <span style={{ margin: "10px 10px", fontSize: "13px", color: "gray" }}>
                    {level.label}
                  </span>{" "}
                </div>
              )}

              <input
                type="submit"
                className="btn"
                value="Sign up"
                onClick={handleSubmit}
              />

              <p>or</p>
              <p className="social-text">Sign up with social platforms</p>
              <div className="social-media">
                <a className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis, ex
                ratione. Aliquid!
              </p>
              <button
                className="btn transparent"
                id="sign-up-btn"
                onClick={handleSignupToggle}
              >
                Sign up
              </button>
            </div>
            <img src={logo} className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                laboriosam ad deleniti.
              </p>
              <button
                className="btn transparent"
                id="sign-in-btn"
                onClick={handleSignInToggle}
              >
                Sign in
              </button>
            </div>
            <img src={register} className="image" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

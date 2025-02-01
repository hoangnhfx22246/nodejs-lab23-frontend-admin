import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "./Login.module.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // * kiểm tra isLoginPage để render theo yêu cầu
  const usernameRef = useRef();
  const passwordRef = useRef();
  const fullNameRef = useRef();
  const phoneNumberRef = useRef();
  const emailRef = useRef();
  const [error, setError] = useState(null);

  // * handlerSubmit
  const handlerSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const fullName = fullNameRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const email = emailRef.current.value;
    setError(null);
    const url = `${process.env.REACT_APP_ADMIN_URL}/user/sign-up`;
    axios
      .post(url, {
        username: username,
        password: password,
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
      })
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => setError(err.response.data.message));
    // e.target.reset();
  };
  return (
    <section>
      <div className={styled["form-container"]}>
        <form onSubmit={handlerSubmit}>
          <div className={styled["form-title"]}>Sign up</div>
          {error && <div className={styled["error-text"]}>{error}</div>}
          <div className={styled["form-control"]}>
            <input
              type="text"
              name="text"
              id="username"
              placeholder="enter username"
              required
              ref={usernameRef}
            />
          </div>
          <div className={styled["form-control"]}>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="enter password"
              required
              ref={passwordRef}
            />
          </div>
          <div className={styled["form-control"]}>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="enter email"
              required
              ref={emailRef}
            />
          </div>
          <div className={styled["form-control"]}>
            <input
              type="text"
              name="full-name"
              id="full-name"
              placeholder="enter full name"
              required
              ref={fullNameRef}
            />
          </div>
          <div className={styled["form-control"]}>
            <input
              type="text"
              name="phone-number"
              id="phone-number"
              placeholder="enter phone number"
              required
              ref={phoneNumberRef}
            />
          </div>
          <div className={styled["form-actions"]}>
            <button className="btn__second" type="submit">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

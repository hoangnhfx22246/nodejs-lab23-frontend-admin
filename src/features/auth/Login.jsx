import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "./Login.module.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // * kiểm tra isLoginPage để render theo yêu cầu
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);

  // * handlerSubmit
  const handlerSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    setError(null);
    const url = `${process.env.REACT_APP_ADMIN_URL}/user/login`;
    axios
      .post(url, {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.data.result.user.isAdmin) {
          dispatch(setUser(res.data.result.user));
          navigate("/");
        } else {
          setError("username does not exist or password is incorrect");
        }
      })
      .catch((err) => setError(err.response.data.message));
    e.target.reset();
  };
  return (
    <section>
      <div className={styled["form-container"]}>
        <form onSubmit={handlerSubmit}>
          <div className={styled["form-title"]}>Login</div>
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
          <div className={styled["form-actions"]}>
            <button className="btn__second" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

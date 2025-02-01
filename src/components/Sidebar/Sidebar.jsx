import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "./Sidebar.module.css";
import { removeUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // logout handler
  const handlerLogout = () => {
    dispatch(removeUser());
    navigate("/");
  };

  return (
    <div className={styled["sidebar-container"]}>
      <ul>
        <li>
          <div className={styled.sidebar__title}>Main</div>
          <ul>
            <li>
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  isActive ? styled.active : undefined
                }
              >
                <span className={styled["sidebar-icon"]}>
                  <i className="fa-solid fa-chart-simple"></i>
                </span>{" "}
                <span>Dashboard</span>
              </NavLink>
            </li>
          </ul>
        </li>
        <li>
          <div className={styled.sidebar__title}>Lists</div>
          <ul>
            <li>
              <NavLink
                to={"/users"}
                className={({ isActive }) =>
                  isActive ? styled.active : undefined
                }
              >
                <span className={styled["sidebar-icon"]}>
                  <i className="fa-regular fa-user"></i>
                </span>{" "}
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/hotels"}
                className={({ isActive }) =>
                  isActive ? styled.active : undefined
                }
              >
                <span className={styled["sidebar-icon"]}>
                  <i className="fa-solid fa-hotel"></i>
                </span>{" "}
                <span>Hotels</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/rooms"}
                className={({ isActive }) =>
                  isActive ? styled.active : undefined
                }
              >
                <span className={styled["sidebar-icon"]}>
                  <i className="fa-solid fa-door-open"></i>
                </span>{" "}
                <span>Rooms</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/transactions"}
                className={({ isActive }) =>
                  isActive ? styled.active : undefined
                }
              >
                <span className={styled["sidebar-icon"]}>
                  <i className="fa-solid fa-truck"></i>
                </span>
                <span>Transactions</span>
              </NavLink>
            </li>
          </ul>
        </li>
        <li>
          <div className={styled.sidebar__title}>New</div>
          <ul>
            <li>
              <NavLink to={"/hotels?editing=false"}>
                <span className={styled["sidebar-icon"]}>
                  <i className="fa-solid fa-hotel"></i>
                </span>{" "}
                <span>New Hotel</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/rooms?editing=false"}>
                <span className={styled["sidebar-icon"]}>
                  <i className="fa-solid fa-door-open"></i>
                </span>{" "}
                <span>New Room</span>
              </NavLink>
            </li>
          </ul>
        </li>
        <li>
          <div className={styled.sidebar__title}>User</div>
          <ul>
            <li>
              <Link onClick={handlerLogout}>
                <span className={styled["sidebar-icon"]}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                </span>{" "}
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

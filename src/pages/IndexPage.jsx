import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import styled from "./IndexPage.module.css";

export default function IndexPage() {
  return (
    <div className={styled["admin-container"]}>
      <div className={styled["admin-title"]}>Admin Page</div>
      <div></div>
      <Sidebar />
      <Outlet />
    </div>
  );
}

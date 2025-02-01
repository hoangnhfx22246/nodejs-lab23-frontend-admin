import { useEffect, useState } from "react";
import Transactions from "../../features/Transaction/Transactions";
import styled from "./Dashboard.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const [countUsers, setCountUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_ADMIN_URL}/admin/user/count-users`, {
        headers: {
          authorization: `${user["_id"]}`,
        },
      })
      .then((res) => {
        setCountUsers(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(
        `${process.env.REACT_APP_ADMIN_URL}/admin/transaction/get-transactions`,
        {
          headers: {
            authorization: `${user["_id"]}`,
          },
        }
      )
      .then((res) => {
        setTransactions(res.data.results); // Lưu dữ liệu giao dịch vào state
      })
      .catch((err) => console.log(err)); // In lỗi ra console nếu có
  }, [user]);

  const earnings = transactions.reduce(
    (sum, transaction) => (sum += transaction.price),
    0
  );
  // Tính balance dựa trên doanh thu trung bình hàng tháng
  const monthCount = new Set(
    transactions.map(
      (transaction) => new Date(transaction.dateStart).getMonth() + 1
    )
  ).size;
  const averageMonthlyEarnings = monthCount ? earnings / monthCount : 0;
  const balance = averageMonthlyEarnings;

  return (
    <div className={styled["dashboard-container"]}>
      <div className={styled["info-board"]}>
        <div>
          <div className={styled["info-board__title"]}>Users</div>
          <div className={styled["info-board__value"]}>{countUsers}</div>
          <div
            className={styled["info-board__icon"]}
            style={{
              "--icon-color": "#E02D4C",
              "--icon-background-color": "#FFCCCC",
            }}
          >
            <i className="fa-regular fa-user"></i>
          </div>
        </div>
        <div>
          <div className={styled["info-board__title"]}>Orders</div>
          <div className={styled["info-board__value"]}>
            {transactions.length}
          </div>
          <div
            className={styled["info-board__icon"]}
            style={{
              "--icon-color": "#DAA521",
              "--icon-background-color": "#F8EDD2",
            }}
          >
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
        </div>
        <div>
          <div className={styled["info-board__title"]}>Earnings</div>
          <div className={styled["info-board__value"]}>$ {earnings}</div>
          <div
            className={styled["info-board__icon"]}
            style={{
              "--icon-color": "#028106",
              "--icon-background-color": "#CCE6CC",
            }}
          >
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
        </div>
        <div>
          <div className={styled["info-board__title"]}>Balance</div>
          <div className={styled["info-board__value"]}>$ {balance}</div>
          <div
            className={styled["info-board__icon"]}
            style={{
              "--icon-color": "#800080",
              "--icon-background-color": "#E6CCE6",
            }}
          >
            <i className="fa-solid fa-money-bills"></i>
          </div>
        </div>
      </div>
      <div className={styled["transactions-board"]}>
        <div className={styled["transactions-title"]}>Latest Transactions</div>
        <Transactions />
      </div>
    </div>
  );
}

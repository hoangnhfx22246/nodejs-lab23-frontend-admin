import { useSelector } from "react-redux";
import styled from "./Transactions.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";

export default function Transactions() {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);

  // Trạng thái để lưu danh sách giao dịch và các giao dịch được chọn
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // Trạng thái để theo dõi checkbox "Chọn tất cả"
  const [isSelectAll, setIsSelectAll] = useState(false);

  // Trạng thái phân trang
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalItems, setTotalItems] = useState(0);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 8;

  // useEffect để lấy dữ liệu giao dịch của người dùng khi component được render
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_ADMIN_URL}/admin/transaction/get-transactions?page=${page}&limit=${pageSize}`,
        {
          headers: {
            authorization: `${user["_id"]}`,
          },
        }
      )
      .then((res) => {
        setTransactions(res.data.results); // Lưu dữ liệu giao dịch vào state
        setTotalItems(res.data.totalItems);
      })
      .catch((err) => console.log(err)); // In lỗi ra console nếu có
  }, [user, page, pageSize]);

  // Hàm xử lý khi checkbox "Chọn tất cả" được thay đổi
  const handleSelectAll = () => {
    if (isSelectAll) {
      // Nếu "Chọn tất cả" đang bật, bỏ chọn tất cả các giao dịch
      setSelectedTransactions([]);
    } else {
      // Nếu "Chọn tất cả" đang tắt, chọn tất cả các giao dịch bằng cách thêm ID vào mảng
      setSelectedTransactions(
        transactions.map((transaction) => transaction["_id"])
      );
    }
    // Đổi trạng thái checkbox "Chọn tất cả"
    setIsSelectAll(!isSelectAll);
  };

  // Hàm xử lý khi checkbox của từng giao dịch được thay đổi
  const handleCheckboxChange = (id) => {
    setSelectedTransactions(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((transactionId) => transactionId !== id) // Bỏ chọn nếu đã có trong danh sách
          : [...prevSelected, id] // Thêm vào nếu chưa có trong danh sách
    );
  };

  // Hiển thị thông báo nếu không có giao dịch nào
  if (transactions.length === 0) {
    return <h2>No transactions available</h2>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>
              {/* Checkbox "Chọn tất cả" */}
              <input
                type="checkbox"
                checked={isSelectAll} // Kiểm tra trạng thái đã chọn tất cả chưa
                onChange={handleSelectAll} // Gọi hàm xử lý khi thay đổi
              />
            </th>
            <th>
              <div>ID</div>
            </th>
            <th>
              <div>User</div>
            </th>
            <th>
              <div>Hotel</div>
            </th>
            <th>
              <div>Room</div>
            </th>
            <th>
              <div>Date</div>
            </th>
            <th>
              <div>Price</div>
            </th>
            <th>
              <div>Payment Method</div>
            </th>
            <th>
              <div>Status</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction["_id"]}>
              <td>
                {/* Checkbox từng giao dịch */}
                <input
                  type="checkbox"
                  checked={selectedTransactions.includes(transaction["_id"])} // Kiểm tra trạng thái đã chọn
                  onChange={() => handleCheckboxChange(transaction["_id"])} // Gọi hàm xử lý khi thay đổi
                />
              </td>
              <td>{transaction["_id"]}</td>
              <td>{transaction.user.fullName}</td>
              <td>{transaction.hotel.name}</td>
              <td>{transaction.room.join(", ")}</td>
              <td>
                {/* Định dạng ngày bắt đầu và kết thúc */}
                {format(new Date(transaction.dateStart), "yyyy/MM/dd") +
                  " - " +
                  format(new Date(transaction.dateEnd), "yyyy/MM/dd")}
              </td>
              <td>${transaction.price}</td>
              <td>{transaction.payment}</td>
              <td>
                <div
                  // Áp dụng class từ styled dựa trên trạng thái giao dịch
                  className={
                    styled.tag + " " + styled[transaction.status.toLowerCase()]
                  }
                >
                  {transaction.status}
                </div>
              </td>
            </tr>
          ))}
          <tr className="none-row">
            <td colSpan={9}></td>
          </tr>
          <tr>
            <td colSpan={9}>
              <Pagination
                page={page}
                pageSize={pageSize}
                totalItems={totalItems}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import { useSelector } from "react-redux";
import styled from "./Hotels.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";

export default function Hotels() {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);

  // Trạng thái để lưu danh sách hotel
  const [hotels, setHotels] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);

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
        `${process.env.REACT_APP_ADMIN_URL}/admin/hotels/all?page=${page}&limit=${pageSize}`,
        {
          headers: {
            authorization: `${user["_id"]}`,
          },
        }
      )
      .then((res) => {
        setHotels(res.data.results); // Lưu dữ liệu giao dịch vào state
        setTotalItems(res.data.totalItems);
      })
      .catch((err) => console.log(err)); // In lỗi ra console nếu có
  }, [user, page, pageSize]);

  // Hàm xử lý khi checkbox "Chọn tất cả" được thay đổi
  const handleSelectAll = () => {
    if (isSelectAll) {
      // Nếu "Chọn tất cả" đang bật, bỏ chọn tất cả các giao dịch
      setSelectedHotels([]);
    } else {
      // Nếu "Chọn tất cả" đang tắt, chọn tất cả các giao dịch bằng cách thêm ID vào mảng
      setSelectedHotels(hotels.map((hotel) => hotel["_id"]));
    }
    // Đổi trạng thái checkbox "Chọn tất cả"
    setIsSelectAll(!isSelectAll);
  };

  const deleteHotelHandler = (idHotel) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?"
    );
    if (!confirmDelete) return;

    axios
      .delete(
        `${process.env.REACT_APP_ADMIN_URL}/admin/hotels/hotel/${idHotel}`,
        {
          headers: {
            authorization: `${user["_id"]}`,
          },
        }
      )
      .then((res) => {
        setHotels((prevState) =>
          prevState.filter((hotel) => hotel["_id"] !== idHotel)
        );
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 400) {
          alert(err.response.data.message);
        }
      });
  };

  // Hàm xử lý khi checkbox của từng giao dịch được thay đổi
  const handleCheckboxChange = (id) => {
    setSelectedHotels(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((hotelId) => hotelId !== id) // Bỏ chọn nếu đã có trong danh sách
          : [...prevSelected, id] // Thêm vào nếu chưa có trong danh sách
    );
  };

  const handlerEditHotel = (idHotel) => {
    setSearchParams({
      editing: true,
      id: idHotel,
    });
  };

  // Hiển thị thông báo nếu không có giao dịch nào
  if (hotels.length === 0) {
    return <h2>No hotels available</h2>;
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
              <div>Name</div>
            </th>
            <th>
              <div>Type</div>
            </th>
            <th>
              <div>Title</div>
            </th>
            <th>
              <div>City</div>
            </th>
            <th>
              <div>Action</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel["_id"]}>
              <td>
                {/* Checkbox từng giao dịch */}
                <input
                  type="checkbox"
                  checked={selectedHotels.includes(hotel["_id"])} // Kiểm tra trạng thái đã chọn
                  onChange={() => handleCheckboxChange(hotel["_id"])} // Gọi hàm xử lý khi thay đổi
                />
              </td>
              <td>{hotel["_id"]}</td>
              <td>{hotel.name}</td>
              <td>{hotel.type}</td>
              <td>{hotel.name}</td>
              <td>{hotel.city}</td>
              <td>
                <button
                  className="btn btn-delete"
                  onClick={() => {
                    deleteHotelHandler(hotel["_id"]);
                  }}
                >
                  Delete
                </button>

                <button
                  className="btn btn-update"
                  onClick={() => {
                    handlerEditHotel(hotel["_id"]);
                  }}
                >
                  update
                </button>
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

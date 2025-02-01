import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";

export default function Rooms() {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);

  // Trạng thái để lưu danh sách room
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

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
        `${process.env.REACT_APP_ADMIN_URL}/admin/rooms/all?page=${page}&limit=${pageSize}`,
        {
          headers: {
            authorization: `${user["_id"]}`,
          },
        }
      )
      .then((res) => {
        setRooms(res.data.results); // Lưu dữ liệu giao dịch vào state
        setTotalItems(res.data.totalItems);
      })
      .catch((err) => console.log(err)); // In lỗi ra console nếu có
  }, [user, page, pageSize]);

  // Hàm xử lý khi checkbox "Chọn tất cả" được thay đổi
  const handleSelectAll = () => {
    if (isSelectAll) {
      // Nếu "Chọn tất cả" đang bật, bỏ chọn tất cả các giao dịch
      setSelectedRooms([]);
    } else {
      // Nếu "Chọn tất cả" đang tắt, chọn tất cả các giao dịch bằng cách thêm ID vào mảng
      setSelectedRooms(rooms.map((room) => room["_id"]));
    }
    // Đổi trạng thái checkbox "Chọn tất cả"
    setIsSelectAll(!isSelectAll);
  };

  const deleteRoomHandler = (idRoom) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmDelete) return;

    axios
      .delete(`${process.env.REACT_APP_ADMIN_URL}/admin/rooms/room/${idRoom}`, {
        headers: {
          authorization: `${user["_id"]}`,
        },
      })
      .then((res) => {
        setRooms((prevState) =>
          prevState.filter((room) => room["_id"] !== idRoom)
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
    setSelectedRooms(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((roomId) => roomId !== id) // Bỏ chọn nếu đã có trong danh sách
          : [...prevSelected, id] // Thêm vào nếu chưa có trong danh sách
    );
  };

  const handlerEditRoom = (idRoom) => {
    setSearchParams({
      editing: true,
      id: idRoom,
    });
  };

  // Hiển thị thông báo nếu không có giao dịch nào
  if (rooms.length === 0) {
    return <h2>No rooms available</h2>;
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
              <div>Title</div>
            </th>
            <th>
              <div>Description</div>
            </th>
            <th>
              <div>Price</div>
            </th>
            <th>
              <div>Max People</div>
            </th>
            <th>
              <div>Action</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room["_id"]}>
              <td>
                {/* Checkbox từng giao dịch */}
                <input
                  type="checkbox"
                  checked={selectedRooms.includes(room["_id"])} // Kiểm tra trạng thái đã chọn
                  onChange={() => handleCheckboxChange(room["_id"])} // Gọi hàm xử lý khi thay đổi
                />
              </td>
              <td>{room["_id"]}</td>
              <td>{room.title}</td>
              <td>{room.desc}</td>
              <td>{room.price}</td>
              <td>{room.maxPeople}</td>
              <td>
                <button
                  className="btn btn-delete"
                  onClick={() => {
                    deleteRoomHandler(room["_id"]);
                  }}
                >
                  Delete
                </button>

                <button
                  className="btn btn-update"
                  onClick={() => {
                    handlerEditRoom(room["_id"]);
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
